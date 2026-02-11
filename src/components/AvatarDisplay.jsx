import React, { useMemo } from 'react';

const AvatarDisplay = ({ seed, size = 100 }) => {
    // Using DiceBear Pixel Art style
    // API: https://api.dicebear.com/9.x/pixel-art/svg?seed=...
    const avatarUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&size=${size}`;
    }, [seed, size]);

    return (
        <div className="avatar-frame">
            <img src={avatarUrl} alt="Avatar" width={size} height={size} style={{ display: 'block' }} />
        </div>
    );
};

export default AvatarDisplay;
