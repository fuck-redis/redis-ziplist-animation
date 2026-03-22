import { useState } from 'react';
import './ConversionDemo.css';

interface ZipListNode {
  entries: string[];
  totalBytes: number;
}

interface QuickListNode {
  ziplist: ZipListNode;
  prev: QuickListNode | null;
  next: QuickListNode | null;
}

function ConversionDemo() {
  const [ziplist] = useState<ZipListNode>({
    entries: ['Entry1', 'Entry2', 'Entry3', 'Entry4', 'Entry5'],
    totalBytes: 120,
  });

  const [quicklist, setQuicklist] = useState<QuickListNode | null>(null);
  const [conversionStep, setConversionStep] = useState(0);
  const [showQuicklist, setShowQuicklist] = useState(false);

  const simulateConversion = () => {
    setConversionStep(1);
    setTimeout(() => {
      setConversionStep(2);
      setTimeout(() => {
        setConversionStep(3);
        setTimeout(() => {
          setShowQuicklist(true);
          setQuicklist({
            ziplist: {
              entries: ['Entry1', 'Entry2'],
              totalBytes: 48,
            },
            prev: null,
            next: {
              ziplist: {
                entries: ['Entry3', 'Entry4'],
                totalBytes: 48,
              },
              prev: null,
              next: {
                ziplist: {
                  entries: ['Entry5'],
                  totalBytes: 24,
                },
                prev: null,
                next: null,
              },
            },
          });
          setConversionStep(4);
        }, 500);
      }, 500);
    }, 500);
  };

  const resetDemo = () => {
    setConversionStep(0);
    setShowQuicklist(false);
    setQuicklist(null);
  };

  return (
    <div className="conversion-demo">
      <h3>ZipList → QuickList 转换演示</h3>
      <p className="demo-description">
        当 ZipList 中的节点数量或大小超过阈值时，Redis 会将其转换为 QuickList。
      </p>

      {/* ZipList 展示 */}
      <div className={`structure-section ziplist-section ${conversionStep >= 1 ? 'converting' : ''}`}>
        <h4>ZipList</h4>
        <div className="structure-visual">
          <div className="block header-block">Header<br/>(12B)</div>
          {ziplist.entries.map((entry, i) => (
            <div key={i} className={`block entry-block ${conversionStep >= 2 && conversionStep < 4 ? 'highlight' : ''}`}>
              {entry}
            </div>
          ))}
          <div className="block end-block">End</div>
        </div>
        <p className="structure-info">总大小: {ziplist.totalBytes} 字节</p>
      </div>

      {/* 转换箭头 */}
      <div className="conversion-arrow">
        {conversionStep === 0 && <button className="convert-btn" onClick={simulateConversion}>开始转换 →</button>}
        {conversionStep >= 1 && conversionStep < 4 && <div className="arrow-animation">↓ 转换中...</div>}
        {conversionStep >= 4 && <div className="arrow-complete">✓ 转换完成</div>}
      </div>

      {/* QuickList 展示 */}
      <div className={`structure-section quicklist-section ${showQuicklist ? 'visible' : ''}`}>
        <h4>QuickList</h4>
        {quicklist && (
          <div className="structure-visual quicklist">
            <div className="pointer-block">ZIP</div>
            <div className="ziplist-container">
              {renderQuicklist(quicklist)}
            </div>
            <div className="pointer-block">NULL</div>
          </div>
        )}
        {quicklist && <p className="structure-info">3个ZipList节点组成的双向链表</p>}
      </div>

      {/* 重置按钮 */}
      {conversionStep >= 4 && (
        <button className="reset-btn" onClick={resetDemo}>重新演示</button>
      )}

      {/* 说明信息 */}
      <div className="conversion-info">
        <h4>转换条件：</h4>
        <ul>
          <li>元素数量超过 list-max-ziplist-entries (默认512)</li>
          <li>单个元素大小超过 list-max-ziplist-size 配置</li>
        </ul>
        <h4>转换优势：</h4>
        <ul>
          <li>避免大连锁更新问题</li>
          <li>保持O(1)的头尾操作</li>
          <li>更好的内存管理</li>
        </ul>
      </div>
    </div>
  );
}

// 递归渲染 QuickList
function renderQuicklist(node: QuickListNode): React.ReactNode {
  return (
    <div className="quicklist-node">
      <div className="mini-ziplist">
        {node.ziplist.entries.map((entry, i) => (
          <div key={i} className="mini-entry">{entry}</div>
        ))}
      </div>
      {node.next && (
        <>
          <div className="next-pointer">→</div>
          {renderQuicklist(node.next)}
        </>
      )}
    </div>
  );
}

export default ConversionDemo;
