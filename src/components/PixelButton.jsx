import React from 'react';

const PixelButton = ({ children, onClick, className = '', disabled }) => {
    return (
        <button
            className={`pixel-btn ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default PixelButton;
