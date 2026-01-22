import React, { useRef, useEffect } from "react";

const Visualizer = ({ audioBox, isPlaying }) => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const analyser = audioBox.audio.analyserNode; // Access the analyser node

        if (!analyser) return;

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Ensure canvas is always visible and style is correct
        canvas.style.display = 'block';

        const bufferLength = analyser.frequencyBinCount; // Or analyser.fftSize for time domain
        const dataArray = new Uint8Array(bufferLength); // Use Uint8Array for byte data

        const draw = () => {
            animationFrameId.current = requestAnimationFrame(draw);

            // Clear canvas with full transparency
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            analyser.getByteTimeDomainData(dataArray); // Get waveform data

            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgb(0, 255, 0)"; // Green line
            ctx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0; // Normalize to 0-2 (0-255 mapped to -1 to 1, then scaled)
                const y = v * canvas.height / 2; // Scale to canvas height

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2); // Connect to center right
            ctx.stroke();
        };

        if (isPlaying) {
            draw();
        } else {
            // Clear canvas if not playing
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas completely
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isPlaying, audioBox.audio.analyserNode]); // Dependencies for useEffect

    return (
        <div className="Visualizer">
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default Visualizer;
