import React from 'react';

const footerStyle = {
    background: 'linear-gradient(90deg, #1b5e20 0%, #388e3c 100%)', // xanh lá cây đậm
    color: '#fff',
    textAlign: 'center',
    padding: '1.2rem 0',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
    fontSize: '1.1rem',
    letterSpacing: '1px',
    zIndex: 100
};

const footerTitleStyle = {
    fontWeight: 600,
    letterSpacing: '2px'
};

const footerSubStyle = {
    marginLeft: 8,
    opacity: 0.8
};

const Footer = () => (
    <footer style={footerStyle}>
        <span style={footerTitleStyle}>
            © {new Date().getFullYear()} AI Pencil.
        </span>
        <span style={footerSubStyle}>
            All rights reserved.
        </span>
    </footer>
);

export default Footer;