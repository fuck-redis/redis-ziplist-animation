import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="copyright">
            © 2024 Redis ZipList 可视化演示系统
          </p>
          <p className="description">
            深入理解Redis ZipList的内存布局和连锁更新机制
          </p>
        </div>
        <div className="footer-section">
          <div className="stats">
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-text">教育性可视化</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⚡</span>
              <span className="stat-text">实时动画演示</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔬</span>
              <span className="stat-text">字节级分析</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
