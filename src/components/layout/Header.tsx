import { useState } from 'react';
import './Header.css';

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

function Header({ currentSection, onSectionChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'introduction', label: '基础知识', icon: '📖' },
    { id: 'demo', label: '实战演示', icon: '🎮' },
    { id: 'concepts', label: '核心概念', icon: '🔬' },
    { id: 'practice', label: '练习测验', icon: '✍️' },
    { id: 'resources', label: '学习资源', icon: '📚' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">📦</div>
            <h1 className="logo-text">Redis ZipList 学习系统</h1>
          </div>
          <div className="subtitle">从零开始，完全掌握</div>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-item ${currentSection === item.id ? 'active' : ''}`}
              onClick={() => {
                onSectionChange(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;
