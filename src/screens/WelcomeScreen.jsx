import React, { useState } from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import AvatarDisplay from '../components/AvatarDisplay';

const WelcomeScreen = ({ onStart }) => {
    const [id, setId] = useState('');
    const [error, setError] = useState('');

    const handleStart = () => {
        if (!id.trim()) {
            setError('PLEASE ENTER ID');
            return;
        }
        onStart(id);
    };

    return (
        <PixelCard className="text-center">
            <h1 className="mb-4" style={{ fontSize: '1.5rem', color: 'var(--pixel-accent)' }}>
                PIXEL QUIZ
            </h1>
            <div className="mb-4">
                <AvatarDisplay seed="welcome_bot" size={120} />
            </div>
            <p className="mb-4">ENTER YOUR ID TO START</p>

            <div className="flex-col mb-4">
                <input
                    type="text"
                    className="pixel-input"
                    placeholder="USER ID"
                    value={id}
                    onChange={(e) => {
                        setId(e.target.value);
                        setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
            </div>

            {error && <p style={{ color: 'red', fontSize: '0.8rem' }} className="mb-4">{error}</p>}

            <PixelButton onClick={handleStart}>START GAME</PixelButton>
        </PixelCard>
    );
};

export default WelcomeScreen;
