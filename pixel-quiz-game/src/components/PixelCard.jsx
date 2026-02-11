import React from 'react';

const PixelCard = ({ children, className = '' }) => {
    return (
        <div className={`pixel-card ${className}`}>
            {children}
        </div>
    );
};

export default PixelCard;
