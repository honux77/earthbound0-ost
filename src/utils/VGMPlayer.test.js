
import VGMPlayer from './VGMPlayer';
import fs from 'fs';
import path from 'path';

// Mock AudioContext
global.AudioContext = class {
    constructor() {
        this.sampleRate = 44100;
        this.createScriptProcessor = jest.fn(() => ({
            connect: jest.fn(),
            disconnect: jest.fn(),
            onaudioprocess: null
        }));
        this.resume = jest.fn();
        this.state = 'suspended';
    }
};

// Mock buffer loading
const vgzPath = path.join(__dirname, '../../public/vgz/01 MOTHER EARTH.vgz');
const fileBuffer = fs.readFileSync(vgzPath);

// Define mock fetch
const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    arrayBuffer: () => Promise.resolve(fileBuffer.buffer),
    status: 200,
    statusText: 'OK',
});

// Apply mock
global.fetch = mockFetch;
Object.defineProperty(window, 'fetch', {
    writable: true,
    value: mockFetch,
});


describe('VGMPlayer', () => {
    let player;

    beforeEach(() => {
        jest.clearAllMocks();

        // Ensure mock behavior is fresh
        mockFetch.mockResolvedValue({
            ok: true,
            arrayBuffer: () => Promise.resolve(fileBuffer.buffer),
            status: 200,
            statusText: 'OK',
        });

        player = new VGMPlayer();
    });

    test('loads and behaves correctly with tinyvgm generator', async () => {
        const url = '/vgz/01 MOTHER EARTH.vgz';

        console.log("Starting load test...");
        try {
            await player.load(url);
            console.log("Load completed.");
        } catch (e) {
            console.error("Player.load failed:", e);
        }

        // Verify fetch
        expect(mockFetch).toHaveBeenCalledWith(url);

        // Verify internal state
        expect(player.vgmData).toBeDefined();

        // Check if commandIterator is initialized (which happens in reset(), called by load())
        expect(player.commandIterator).toBeDefined();
        expect(typeof player.commandIterator.next).toBe('function');

        console.log("Command Iterator initialized successfully.");

        // Test that we can pull a command
        const result = player.commandIterator.next();
        // { value: { cmd: ..., ...}, done: false }

        console.log("First command from iterator:", result.value);
        expect(result.done).toBe(false);
        expect(result.value).toHaveProperty('cmd');
    });
});
