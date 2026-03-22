import { useState } from 'react';
import { ZipListState, VisualizationConfig } from '@/types/ziplist';
import MemoryLayoutView from './MemoryLayoutView';
import ByteLevelView from './ByteLevelView';
import StructureView from './StructureView';
import StatisticsPanel from './StatisticsPanel';
import ConversionDemo from './ConversionDemo';
import { InlineVideo } from '../video/InlineVideo';
import './VisualizationArea.css';

interface VisualizationAreaProps {
  zipListState: ZipListState;
  config: VisualizationConfig;
}

function VisualizationArea({ zipListState, config }: VisualizationAreaProps) {
  const [activeTab, setActiveTab] = useState<'memory' | 'byte' | 'structure' | 'conversion'>('memory');

  return (
    <div className="visualization-area">
      <div className="viz-header">
        <h2 className="viz-title">ZipList 可视化 <InlineVideo videoType="memory" title="内存布局" /></h2>
        <div className="viz-tabs">
          <button
            className={`viz-tab ${activeTab === 'memory' ? 'active' : ''}`}
            onClick={() => setActiveTab('memory')}
          >
            内存布局
          </button>
          <button
            className={`viz-tab ${activeTab === 'byte' ? 'active' : ''}`}
            onClick={() => setActiveTab('byte')}
          >
            字节视图
          </button>
          <button
            className={`viz-tab ${activeTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            结构视图
          </button>
          <button
            className={`viz-tab ${activeTab === 'conversion' ? 'active' : ''}`}
            onClick={() => setActiveTab('conversion')}
          >
            转换演示
          </button>
        </div>
      </div>

      <div className="viz-content">
        {activeTab === 'memory' && <MemoryLayoutView zipListState={zipListState} />}
        {activeTab === 'byte' && <ByteLevelView zipListState={zipListState} />}
        {activeTab === 'structure' && <StructureView zipListState={zipListState} />}
        {activeTab === 'conversion' && <ConversionDemo />}
      </div>

      {config.showStatistics && (
        <div className="viz-footer">
          <StatisticsPanel zipListState={zipListState} />
        </div>
      )}
    </div>
  );
}

export default VisualizationArea;
