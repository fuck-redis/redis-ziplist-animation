import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { createZipList } from './core/ziplist';
import { ZipListState, VisualizationConfig } from './types/ziplist';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';
import IntroductionSection from './components/education/IntroductionSection';
import ConceptsSection from './components/education/ConceptsSection';
import PracticeSection from './components/education/PracticeSection';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [zipListState, setZipListState] = useState<ZipListState>(() => createZipList([]));
  
  const [config, setConfig] = useState<VisualizationConfig>({
    showByteView: true,
    showStructureView: true,
    showMemoryLayout: true,
    showStatistics: true,
    animationSpeed: 1.0,
    highlightDuration: 1000,
    colorScheme: 'default',
  });

  const handleUpdateZipList = (newState: ZipListState) => {
    setZipListState(newState);
  };

  const handleUpdateConfig = (newConfig: Partial<VisualizationConfig>) => {
    setConfig({ ...config, ...newConfig });
  };

  const handleSectionChange = (section: string) => {
    // 路由映射
    const routeMap: { [key: string]: string } = {
      'introduction': '/',
      'demo': '/demo',
      'concepts': '/concepts',
      'practice': '/practice',
      'resources': '/resources',
    };
    
    navigate(routeMap[section] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 从路由路径获取当前section
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/') return 'introduction';
    if (path === '/demo') return 'demo';
    if (path === '/concepts') return 'concepts';
    if (path === '/practice') return 'practice';
    if (path === '/resources') return 'resources';
    return 'introduction';
  };

  return (
    <div className="app">
      <Header 
        currentSection={getCurrentSection()}
        onSectionChange={handleSectionChange}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<IntroductionSection />} />
          <Route 
            path="/demo" 
            element={
              <MainLayout
                zipListState={zipListState}
                config={config}
                onUpdateZipList={handleUpdateZipList}
                onUpdateConfig={handleUpdateConfig}
              />
            } 
          />
          <Route path="/concepts" element={<ConceptsSection />} />
          <Route path="/practice" element={<PracticeSection />} />
          <Route 
            path="/resources" 
            element={
              <div className="coming-soon">
                <h1>📚 学习资源</h1>
                <p>即将推出...</p>
                <p className="hint">这里将包含相关文章、视频和Redis官方文档链接</p>
              </div>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
