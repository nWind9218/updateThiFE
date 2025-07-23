import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>TinZ - Update Ca Thi</h1>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    background: '#1b5e20', // xanh lá cây đậm
    padding: '16px 0',
    color: '#fff',
    textAlign: 'center',
    zIndex: 1200,
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  title: {
    margin: 0,
    fontSize: '2rem'
  }
};

export default Header;
