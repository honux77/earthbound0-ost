
import { NES } from 'jsnes';
import * as TinyVGM from 'tinyvgm';
import pako from 'pako';

const VGM_SAMPLE_RATE = 44100;
const NES_CPU_FREQ = 1789772.5; // NTSC
const BUFFER_SIZE = 16384; // Ring buffer size

class VGMPlayer {
    constructor(onSongEnd = null) {
        this.onSongEnd = onSongEnd;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sampleRate = this.audioContext.sampleRate;

        // Ring buffer for better performance
        this.bufferL = new Float32Array(BUFFER_SIZE);
        this.bufferR = new Float32Array(BUFFER_SIZE);
        this.writePos = 0;
        this.readPos = 0;

        // DMC sample data storage
        this.dmcData = new Uint8Array(0x4000); // 16KB for DMC samples (0xC000-0xFFFF)

        this.nes = new NES({
            onFrame: () => { },
            onAudioSample: (left, right) => {
                this.bufferL[this.writePos] = left;
                this.bufferR[this.writePos] = right;
                this.writePos = (this.writePos + 1) % BUFFER_SIZE;
            },
            sampleRate: VGM_SAMPLE_RATE,
            emulateSound: true
        });

        // Create a fake memory mapper for DMC data access
        this.nes.mmap = {
            load: (addr) => {
                if (addr >= 0xC000 && addr <= 0xFFFF) {
                    return this.dmcData[addr - 0xC000];
                }
                return 0;
            }
        };

        // CPU cycles per VGM sample (at 44100 Hz)
        this.cyclesPerSample = NES_CPU_FREQ / VGM_SAMPLE_RATE;
        this.cycleFraction = 0;

        // For sample rate conversion
        this.resamplePos = 0;
        this.resampleStep = VGM_SAMPLE_RATE / this.sampleRate;

        this.scriptNode = null;
        this.vgmData = null;
        this.commandIterator = null;
        this.waitSamples = 0;
        this.loop = true;
        this.volume = 1.0;
        this.isPlaying = false;
    }

    getBufferedSamples() {
        let diff = this.writePos - this.readPos;
        if (diff < 0) diff += BUFFER_SIZE;
        return diff;
    }

    async load(url) {
        try {
            this.stop();
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();

            let vgmBuffer = arrayBuffer;
            const header = new Uint8Array(arrayBuffer.slice(0, 4));

            // Check for GZIP (0x1F 0x8B)
            if (header[0] === 0x1f && header[1] === 0x8b) {
                vgmBuffer = pako.ungzip(new Uint8Array(arrayBuffer));
            }

            // Extract DMC data blocks before parsing
            this.extractDmcData(vgmBuffer);

            this.vgmData = TinyVGM.parseVGM(vgmBuffer);
            this.reset();
        } catch (e) {
            console.error("Failed to load VGM:", e);
            throw e;
        }
    }

    extractDmcData(vgmBuffer) {
        // Clear previous DMC data
        this.dmcData.fill(0);

        const view = vgmBuffer instanceof Uint8Array ? vgmBuffer : new Uint8Array(vgmBuffer);

        // Get data offset (at 0x34)
        const dataOffset = (view[0x34] | (view[0x35] << 8) | (view[0x36] << 16) | (view[0x37] << 24)) + 0x34;

        let pos = dataOffset;
        while (pos < view.length) {
            const cmd = view[pos];
            if (cmd === 0x66) break; // End of data

            if (cmd === 0x67) {
                // Data block: 0x67 0x66 tt ss ss ss ss [data]
                const type = view[pos + 2];
                const size = view[pos + 3] | (view[pos + 4] << 8) | (view[pos + 5] << 16) | (view[pos + 6] << 24);

                // Type 0xC2 = NES APU RAM (with two-chip bit)
                // Type 0x07 = NES APU RAM
                if (type === 0xC2 || type === 0x07) {
                    const dataStart = pos + 7;
                    // First 2 bytes might be address offset for type 0xC2
                    let offset = 0;
                    let actualSize = size;
                    if (type === 0xC2 && size > 2) {
                        offset = view[dataStart] | (view[dataStart + 1] << 8);
                        actualSize = size - 2;
                        // Copy data to DMC buffer
                        for (let i = 0; i < actualSize && (offset + i) < this.dmcData.length; i++) {
                            this.dmcData[offset + i] = view[dataStart + 2 + i];
                        }
                    } else {
                        // Copy data starting at 0xC000 (offset 0 in our buffer)
                        for (let i = 0; i < actualSize && i < this.dmcData.length; i++) {
                            this.dmcData[i] = view[dataStart + i];
                        }
                    }
                }
                pos += 7 + size;
            }
            else if (cmd === 0xB4) pos += 3;
            else if (cmd >= 0x70 && cmd < 0x80) pos += 1;
            else if (cmd === 0x61) pos += 3;
            else if (cmd === 0x62 || cmd === 0x63) pos += 1;
            else if (cmd >= 0x30 && cmd <= 0x3F) pos += 2;
            else if (cmd >= 0x40 && cmd <= 0x4E) pos += 3;
            else if (cmd === 0x4F || cmd === 0x50) pos += 2;
            else if (cmd >= 0x51 && cmd <= 0x5F) pos += 3;
            else if (cmd >= 0xA0 && cmd <= 0xBF) pos += 3;
            else if (cmd >= 0xC0 && cmd <= 0xDF) pos += 4;
            else if (cmd >= 0xE0 && cmd <= 0xE1) pos += 5;
            else if (cmd >= 0x80 && cmd < 0x90) pos += 1;
            else pos += 1;
        }
    }

    reset() {
        this.nes.papu.reset();
        this.waitSamples = 0;
        this.writePos = 0;
        this.readPos = 0;
        this.cycleFraction = 0;
        this.resamplePos = 0;

        // Enable all APU channels (including DMC)
        this.nes.papu.writeReg(0x4015, 0x1F);
        // Set frame counter to 4-step mode
        this.nes.papu.writeReg(0x4017, 0x40);

        if (this.vgmData) {
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

        const outputL = e.outputBuffer.getChannelData(0);
        const outputR = e.outputBuffer.getChannelData(1);
        const count = outputL.length;

        // Calculate how many VGM samples we need (with some extra for buffer)
        const vgmSamplesNeeded = Math.ceil(count * this.resampleStep) + 8192;

        // Generate samples until we have enough buffered
        while (this.getBufferedSamples() < vgmSamplesNeeded && this.isPlaying) {
            this.runVGM();

            // Clock APU for one sample's worth of CPU cycles
            this.cycleFraction += this.cyclesPerSample;
            const wholeCycles = Math.floor(this.cycleFraction);
            this.cycleFraction -= wholeCycles;
            this.nes.papu.clockFrameCounter(wholeCycles);

            if (this.waitSamples > 0) {
                this.waitSamples--;
            }
        }

        // Output with linear interpolation for sample rate conversion
        for (let i = 0; i < count; i++) {
            const pos = Math.floor(this.resamplePos);
            const frac = this.resamplePos - pos;
            const idx0 = (this.readPos + pos) % BUFFER_SIZE;
            const idx1 = (this.readPos + pos + 1) % BUFFER_SIZE;

            // Linear interpolation
            const l = this.bufferL[idx0] * (1 - frac) + this.bufferL[idx1] * frac;
            const r = this.bufferR[idx0] * (1 - frac) + this.bufferR[idx1] * frac;

            outputL[i] = l * this.volume;
            outputR[i] = r * this.volume;

            this.resamplePos += this.resampleStep;
        }

        // Advance read position
        const samplesConsumed = Math.floor(this.resamplePos);
        this.readPos = (this.readPos + samplesConsumed) % BUFFER_SIZE;
        this.resamplePos -= samplesConsumed;
    }

    runVGM() {
        if (!this.commandIterator) return;

        while (this.waitSamples <= 0) {
            const result = this.commandIterator.next();

            if (result.done) {
                this.isPlaying = false;
                this.onSongEnd && this.onSongEnd(); // Call the callback if it exists
                return;
            }

            const cmd = result.value;

            if (cmd.sampleIncrement) {
                this.waitSamples += cmd.sampleIncrement;
            }

            // Handle NES APU Write (0xB4)
            if (cmd.cmd === 0xB4 && cmd.data && cmd.data.length >= 2) {
                this.nes.papu.writeReg(0x4000 + cmd.data[0], cmd.data[1]);
            }
        }
    }
}

export default VGMPlayer;
