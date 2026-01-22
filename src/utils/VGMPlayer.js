
import { NES } from 'jsnes';
import * as TinyVGM from 'tinyvgm';
import pako from 'pako';

class VGMPlayer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sampleRate = this.audioContext.sampleRate;

        this.nes = new NES({
            onFrame: () => { },
            onAudioSample: (left, right) => {
                if (this.audioBuffer.length < 4096 * 2) {
                    this.audioBuffer.push(left);
                    this.audioBuffer.push(right);
                }
            },
            sampleRate: this.sampleRate
        });

        // Monkey-patch stop() method for jsnes as it calls it on illegal opcode (which happens with dummy ROM)
        this.nes.stop = () => { };

        this.scriptNode = null;
        this.vgmData = null;
        this.commandIterator = null; // Iterator for VGM commands
        this.waitSamples = 0;
        this.loop = true;
        this.volume = 1.0;
        this.isPlaying = false;
        this.audioBuffer = [];

        // Initialize with dummy ROM to ensure CPU runs
        const dummyROM = new Uint8Array(16 + 16384);
        dummyROM.set([0x4E, 0x45, 0x53, 0x1A, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        try {
            this.nes.loadROM(String.fromCharCode(...dummyROM));
        } catch (e) {
            console.error("Failed to load dummy ROM", e);
        }
    }

    async load(url) {
        try {
            this.stop();
            console.log("Loading VGM:", url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();

            let vgmBuffer = arrayBuffer;
            const header = new Uint8Array(arrayBuffer.slice(0, 4));
            console.log("Header bytes:", header[0].toString(16), header[1].toString(16), header[2].toString(16), header[3].toString(16));

            // Check for GZIP (0x1F 0x8B)
            if (header[0] === 0x1f && header[1] === 0x8b) {
                console.log("Detected GZIP, unzipping...");
                try {
                    vgmBuffer = pako.ungzip(new Uint8Array(arrayBuffer));
                    const newHeader = new Uint8Array(vgmBuffer.slice(0, 4));
                    console.log("Unzipped header:", newHeader[0].toString(16), newHeader[1].toString(16), newHeader[2].toString(16), newHeader[3].toString(16));
                } catch (err) {
                    console.error("Unzip failed:", err);
                }
            } else {
                console.log("Not GZIP, assuming raw VGM");
            }

            this.vgmData = TinyVGM.parseVGM(vgmBuffer);
            this.reset();
        } catch (e) {
            console.error("Failed to load VGM:", e);
            throw e;
        }
    }

    reset() {
        this.nes.reset();
        this.waitSamples = 0;
        this.audioBuffer = [];

        if (this.vgmData) {
            // Get the command generator
            // Pass loop count if needed, default handles infinite/defined loops
            this.commandIterator = this.vgmData.commands();
        } else {
            this.commandIterator = null;
        }
    }

    play() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (!this.scriptNode) {
            this.scriptNode = this.audioContext.createScriptProcessor(4096, 0, 2);
            this.scriptNode.onaudioprocess = this.processAudio.bind(this);
            this.scriptNode.connect(this.audioContext.destination);
        }
        this.isPlaying = true;
    }

    pause() {
        this.isPlaying = false;
        if (this.scriptNode) {
            this.scriptNode.disconnect();
            this.scriptNode = null;
        }
    }

    stop() {
        this.pause();
        this.reset();
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    processAudio(e) {
        if (!this.isPlaying || !this.vgmData) return;

        // Debug trace
        if (Math.random() < 0.01) {
            console.log(`processAudio: CtxState=${this.audioContext.state}, BufferLen=${this.audioBuffer.length}, WaitSamples=${this.waitSamples}`);
        }

        const outputL = e.outputBuffer.getChannelData(0);
        const outputR = e.outputBuffer.getChannelData(1);
        const count = outputL.length;

        for (let i = 0; i < count; i++) {
            this.runVGM();

            while (this.audioBuffer.length < 2) {
                this.nes.frame();
            }

            const l = this.audioBuffer.shift();
            const r = this.audioBuffer.shift();

            outputL[i] = l * this.volume;
            outputR[i] = r * this.volume;

            if (this.waitSamples > 0) {
                this.waitSamples--;
            }
        }
    }

    runVGM() {
        if (!this.commandIterator) return;

        while (this.waitSamples <= 0) {
            const result = this.commandIterator.next();

            if (result.done) {
                console.log("Track Ended");
                this.isPlaying = false;
                return;
            }

            const cmd = result.value;

            // Handle wait samples
            if (cmd.sampleIncrement) {
                this.waitSamples += cmd.sampleIncrement;
            }

            // Handle NES APU Write (0xB4)
            if (cmd.cmd === 0xB4) {
                // cmd.data is a Uint8Array [reg, val]
                if (cmd.data && cmd.data.length >= 2) {
                    const reg = cmd.data[0];
                    const val = cmd.data[1];
                    this.nes.cpu.write(0x4000 + reg, val);
                }
            }
            // TinyVGM handles looping internally via the generator, so we don't need manual loop logic here
            // It also handles parsing of data bytes for us.
        }
    }
}

export default VGMPlayer;
