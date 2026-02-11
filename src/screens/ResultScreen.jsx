import React, { useEffect, useState } from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import AvatarDisplay from '../components/AvatarDisplay';
import confetti from 'canvas-confetti'; // We might need to install this or just use simple CSS animation

const ResultScreen = ({ result, onRetry }) => {
    // result: { score, correctCount, isPass }
    const [showScore, setShowScore] = useState(false);

    useEffect(() => {
        // Animation delay
        setTimeout(() => setShowScore(true), 500);

        if (result.isPass) {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#ff0055', '#00e436', '#ffcc00']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#ff0055', '#00e436', '#ffcc00']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [result]);

    return (
        <PixelCard className="text-center">
            <h2 className="mb-4">{result.isPass ? "MISSION COMPLETE" : "GAME OVER"}</h2>

            <div className="mb-4">
                <AvatarDisplay seed={result.isPass ? "win" : "lose"} size={100} />
            </div>

            <div style={{ fontSize: '2rem', margin: '2rem 0', opacity: showScore ? 1 : 0, transition: 'opacity 1s' }}>
                {result.score} pts
            </div>

            <p className="mb-4">
                {result.isPass ? "CONGRATULATIONS!" : "TRY AGAIN?"}
            </p>

            <PixelButton onClick={onRetry}>PLAY AGAIN</PixelButton>
        </PixelCard>
    );
};

export default ResultScreen;
