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
    { id: 'config', label: '配置参数', icon: '⚙️' },
    { id: 'comparison', label: '对比', icon: '⚖️' },
    { id: 'commands', label: 'Redis命令', icon: '⌨️' },
    { id: 'practice', label: '练习测验', icon: '✍️' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-section" onClick={() => onSectionChange('introduction')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">📦</div>
            <h1 className="logo-text">Redis ZipList 学习系统</h1>
          </div>
          <div className="subtitle">从零开始，完全掌握</div>
        </div>

        <div className="header-right">
          <a
            href="https://github.com/fuck-redis/redis-ziplist-animation"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            title="查看 GitHub 仓库"
          >
            <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
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
