import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ user, children, currentPage, onNavigate }) => {
  return (
    <div className="layout">
      <Sidebar 
        user={user} 
        currentPage={currentPage} 
        onNavigate={onNavigate} 
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 