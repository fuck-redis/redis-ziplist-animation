import { useState, useEffect } from 'react';
import { ZipListState, VisualizationConfig } from '@/types/ziplist';
import VisualizationArea from '../visualization/VisualizationArea';
import ControlPanel from '../controls/ControlPanel';
import BeginnerGuide from '../guide/BeginnerGuide';
import OperationHints from '../guide/OperationHints';
import './MainLayout.css';

interface MainLayoutProps {
  zipListState: ZipListState;
  config: VisualizationConfig;
  onUpdateZipList: (state: ZipListState) => void;
  onUpdateConfig: (config: Partial<VisualizationConfig>) => void;
}

function MainLayout({ zipListState, config, onUpdateZipList, onUpdateConfig }: MainLayoutProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  // 检查是否是第一次访问
  useEffect(() => {
    const hasVisited = localStorage.getItem('ziplist-demo-visited');
    if (!hasVisited) {
      setShowGuide(true);
    } else {
      setHasSeenGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    setHasSeenGuide(true);
    localStorage.setItem('ziplist-demo-visited', 'true');
  };

  const handleShowGuideAgain = () => {
    setShowGuide(true);
  };

  return (
    <main className="main-layout">
      {showGuide && <BeginnerGuide onClose={handleCloseGuide} />}
      
      <div className="demo-header">
        <div className="demo-title-section">
          <h1 className="demo-title">🎮 实战演示</h1>
          <p className="demo-subtitle">动手操作，直观理解ZipList</p>
        </div>
        {hasSeenGuide && (
          <button className="show-guide-btn" onClick={handleShowGuideAgain}>
            📖 查看新手引导
          </button>
        )}
      </div>

      <div className="layout-container">
        <div className="visualization-section">
          <VisualizationArea zipListState={zipListState} config={config} />
        </div>
        <div className="control-section">
          <OperationHints entryCount={zipListState.entries.length} />
          <ControlPanel
            zipListState={zipListState}
            config={config}
            onUpdateZipList={onUpdateZipList}
            onUpdateConfig={onUpdateConfig}
          />
        </div>
      </div>
    </main>
  );
}

export default MainLayout;
