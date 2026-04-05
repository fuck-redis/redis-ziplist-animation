import { useState, useEffect, useRef, useCallback } from 'react';
import { ZipListState, VisualizationConfig } from '@/types/ziplist';
import VisualizationArea from '../visualization/VisualizationArea';
import ControlPanel from '../controls/ControlPanel';
import BeginnerGuide from '../guide/BeginnerGuide';
import OperationHints from '../guide/OperationHints';
import StatisticsPanel from '../visualization/StatisticsPanel';
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
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(() => {
    const saved = localStorage.getItem('ziplist-control-panel-collapsed');
    return saved === 'true';
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 检查是否是第一次访问
  useEffect(() => {
    const hasVisited = localStorage.getItem('ziplist-demo-visited');
    if (!hasVisited) {
      setShowGuide(true);
    } else {
      setHasSeenGuide(true);
    }
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+\ 切换控制面板
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        setIsControlPanelCollapsed(prev => {
          const newValue = !prev;
          localStorage.setItem('ziplist-control-panel-collapsed', String(newValue));
          return newValue;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleControlPanel = useCallback(() => {
    setIsControlPanelCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem('ziplist-control-panel-collapsed', String(newValue));
      return newValue;
    });
  }, []);

  const handleSplitterMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const leftWidth = parseInt(getComputedStyle(containerRef.current).getPropertyValue('--left-panel-width'));

      // Calculate right panel width based on mouse position
      const availableWidth = containerRect.width - leftWidth;
      const rightEdgeX = containerRect.right;
      const splitterWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--splitter-width')) || 6;
      const newRightWidth = rightEdgeX - e.clientX - (splitterWidth / 2);

      // Clamp between min and max
      const minWidth = 280;
      const maxWidth = Math.min(600, availableWidth * 0.6);
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newRightWidth));

      // Update CSS variable for right panel
      if (containerRef.current) {
        containerRef.current.style.setProperty('--right-panel-width', `${clampedWidth}px`);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
          <h1 className="demo-title">实战演示</h1>
          <p className="demo-subtitle">动手操作，直观理解ZipList</p>
        </div>
        {hasSeenGuide && (
          <button className="show-guide-btn" onClick={handleShowGuideAgain}>
            查看新手引导
          </button>
        )}
      </div>

      <div className="layout-container" ref={containerRef}>
        {/* 左侧面板 - Operation Hints */}
        <div className="left-panel">
          <OperationHints entryCount={zipListState.entries.length} />
        </div>

        {/* 中心画布区域 */}
        <div className="visualization-section">
          <VisualizationArea
            zipListState={zipListState}
            config={config}
            showStatistics={false} /* 底部单独显示 */
          />
        </div>

        {/* 右侧控制面板 */}
        {!isControlPanelCollapsed && (
          <div
            className="splitter"
            onMouseDown={handleSplitterMouseDown}
          />
        )}

        <div
          className={`control-section ${isControlPanelCollapsed ? 'collapsed' : ''}`}
          style={{
            width: isControlPanelCollapsed ? 'var(--control-panel-collapsed-width)' : undefined,
            gridColumn: isControlPanelCollapsed ? '3' : undefined
          }}
        >
          <button
            className="collapse-btn"
            onClick={toggleControlPanel}
            title={isControlPanelCollapsed ? '展开控制面板' : '收起控制面板'}
          >
            {isControlPanelCollapsed ? '→' : '←'}
          </button>
          {!isControlPanelCollapsed && (
            <ControlPanel
              zipListState={zipListState}
              config={config}
              onUpdateZipList={onUpdateZipList}
              onUpdateConfig={onUpdateConfig}
            />
          )}
        </div>

        {/* 底部统计面板 */}
        {config.showStatistics && (
          <div className="bottom-panel">
            <StatisticsPanel zipListState={zipListState} />
          </div>
        )}
      </div>
    </main>
  );
}

export default MainLayout;
