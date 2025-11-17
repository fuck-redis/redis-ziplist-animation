import { useState } from 'react';
import { ZipListState, VisualizationConfig, AnimationStep } from '@/types/ziplist';
import { insertEntry, deleteEntry, createZipList } from '@/core/ziplist';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import AnimationControls from './AnimationControls';
import './ControlPanel.css';

interface ControlPanelProps {
  zipListState: ZipListState;
  config: VisualizationConfig;
  onUpdateZipList: (state: ZipListState) => void;
  onUpdateConfig: (config: Partial<VisualizationConfig>) => void;
}

function ControlPanel({ zipListState, onUpdateZipList }: ControlPanelProps) {
  const {
    animationState,
    setSteps,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    setSpeed,
    goToStep,
  } = useAnimationControl();
  const [operation, setOperation] = useState<'insert' | 'delete' | 'batch'>('insert');
  const [position, setPosition] = useState(0);
  const [value, setValue] = useState('');
  const [batchValues, setBatchValues] = useState('');

  const handleInsert = () => {
    if (!value.trim()) {
      alert('请输入值');
      return;
    }

    // 尝试转换为数字
    const numValue = Number(value);
    const insertValue = !isNaN(numValue) && value.trim() !== '' ? numValue : value;

    const result = insertEntry(zipListState, position, insertValue);
    if (result.success) {
      onUpdateZipList(result.newState);
      
      // 生成动画步骤
      if (result.animationSteps) {
        setSteps(result.animationSteps);
      }
      
      setValue('');
    } else {
      alert(result.message);
    }
  };

  const handleDelete = () => {
    if (zipListState.entries.length === 0) {
      alert('ZipList为空');
      return;
    }

    const result = deleteEntry(zipListState, position);
    if (result.success) {
      onUpdateZipList(result.newState);
      setPosition(Math.max(0, position - 1));
    } else {
      alert(result.message);
    }
  };

  const handleBatchInsert = () => {
    if (!batchValues.trim()) {
      alert('请输入批量值（用逗号分隔）');
      return;
    }

    const values = batchValues.split(',').map(v => {
      const trimmed = v.trim();
      const num = Number(trimmed);
      return !isNaN(num) && trimmed !== '' ? num : trimmed;
    });

    const newState = createZipList(values);
    onUpdateZipList(newState);
    setBatchValues('');
  };

  const handlePushTail = () => {
    if (!value.trim()) {
      alert('请输入值');
      return;
    }

    const numValue = Number(value);
    const insertValue = !isNaN(numValue) && value.trim() !== '' ? numValue : value;

    const result = insertEntry(zipListState, zipListState.entries.length, insertValue);
    if (result.success) {
      onUpdateZipList(result.newState);
      setValue('');
    }
  };

  return (
    <div className="control-panel">
      <div className="control-card">
        <h3 className="control-title">🎮 操作控制</h3>
        
        <div className="operation-selector">
          <button
            className={`op-btn ${operation === 'insert' ? 'active' : ''}`}
            onClick={() => setOperation('insert')}
          >
            📌 插入
          </button>
          <button
            className={`op-btn ${operation === 'delete' ? 'active' : ''}`}
            onClick={() => setOperation('delete')}
          >
            ❌ 删除
          </button>
          <button
            className={`op-btn ${operation === 'batch' ? 'active' : ''}`}
            onClick={() => setOperation('batch')}
          >
            📦 批量
          </button>
        </div>

        {operation === 'insert' && (
          <div className="control-form">
            <div className="form-group">
              <label className="form-label">插入位置</label>
              <input
                type="number"
                className="form-input"
                value={position}
                onChange={(e) => setPosition(Math.max(0, parseInt(e.target.value) || 0))}
                min={0}
                max={zipListState.entries.length}
              />
              <span className="form-hint">0 ~ {zipListState.entries.length}</span>
            </div>

            <div className="form-group">
              <label className="form-label">节点值</label>
              <input
                type="text"
                className="form-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="输入数字或字符串"
              />
            </div>

            <div className="form-actions">
              <button className="action-btn primary" onClick={handleInsert}>
                插入节点
              </button>
              <button className="action-btn secondary" onClick={handlePushTail}>
                尾部追加
              </button>
            </div>
          </div>
        )}

        {operation === 'delete' && (
          <div className="control-form">
            <div className="form-group">
              <label className="form-label">删除位置</label>
              <input
                type="number"
                className="form-input"
                value={position}
                onChange={(e) => setPosition(Math.max(0, parseInt(e.target.value) || 0))}
                min={0}
                max={Math.max(0, zipListState.entries.length - 1)}
              />
              <span className="form-hint">
                0 ~ {Math.max(0, zipListState.entries.length - 1)}
              </span>
            </div>

            <div className="form-actions">
              <button className="action-btn danger" onClick={handleDelete}>
                删除节点
              </button>
            </div>
          </div>
        )}

        {operation === 'batch' && (
          <div className="control-form">
            <div className="form-group">
              <label className="form-label">批量值（逗号分隔）</label>
              <textarea
                className="form-textarea"
                value={batchValues}
                onChange={(e) => setBatchValues(e.target.value)}
                placeholder="例如: 1, Hello, 42, World"
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button className="action-btn primary" onClick={handleBatchInsert}>
                批量创建
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="control-card">
        <h3 className="control-title">💡 使用提示</h3>
        <div className="tips-content">
          <div className="tip-item">
            <span className="tip-icon">🔢</span>
            <span className="tip-text">输入纯数字将自动选择整数编码</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📝</span>
            <span className="tip-text">输入文本将使用字符串编码</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔄</span>
            <span className="tip-text">大节点插入可能触发连锁更新</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📊</span>
            <span className="tip-text">切换不同视图查看详细信息</span>
          </div>
        </div>
      </div>

      <AnimationControls
        animationState={animationState}
        onTogglePlay={togglePlay}
        onNextStep={nextStep}
        onPrevStep={prevStep}
        onReset={reset}
        onSpeedChange={setSpeed}
        onGoToStep={goToStep}
      />

      <div className="control-card info-card">
        <h3 className="control-title">ℹ️ 当前状态</h3>
        <div className="info-content">
          <div className="info-item">
            <span className="info-label">节点数:</span>
            <span className="info-value">{zipListState.header.zllen}</span>
          </div>
          <div className="info-item">
            <span className="info-label">总大小:</span>
            <span className="info-value">{zipListState.totalBytes}B</span>
          </div>
          <div className="info-item">
            <span className="info-label">末尾偏移:</span>
            <span className="info-value">{zipListState.header.zltail}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
