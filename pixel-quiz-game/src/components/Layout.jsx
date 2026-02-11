import React from 'react';
import '../styles/pixel-theme.css';

const Layout = ({ children }) => {
    return (
        <>
            <div className="crt-container"></div>
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
                {children}
            </div>
        </>
    );
};

export default Layout;
