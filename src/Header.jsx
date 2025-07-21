import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>ManhProject - Update Ca Thi</h1>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw', // hoặc '100%'
    background: '#1976d2',
    padding: '16px 0',
    color: '#fff',
    textAlign: 'center',
    zIndex: 1200, // Lớn hơn Paper/DataGrid mặc định
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  title: {
    margin: 0,
    fontSize: '2rem'
  }
};

export default Header;
