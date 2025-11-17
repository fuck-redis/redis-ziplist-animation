import { ZipListState } from '@/types/ziplist';
import './MemoryLayoutView.css';

interface MemoryLayoutViewProps {
  zipListState: ZipListState;
}

function MemoryLayoutView({ zipListState }: MemoryLayoutViewProps) {
  const { header, entries } = zipListState;

  return (
    <div className="memory-layout-view">
      <div className="memory-section">
        <h3 className="section-title">ZipList 内存布局 - 总大小: {header.zlbytes}字节</h3>
        
        <div className="memory-visual">
          {/* Header */}
          <div className="memory-block header-block">
            <div className="block-label">Header (12字节)</div>
            <div className="block-fields">
              <div className="field" style={{background: 'var(--color-zlbytes)'}}>
                <span className="field-name">zlbytes</span>
                <span className="field-value">{header.zlbytes}</span>
              </div>
              <div className="field" style={{background: 'var(--color-zltail)'}}>
                <span className="field-name">zltail</span>
                <span className="field-value">{header.zltail}</span>
              </div>
              <div className="field" style={{background: 'var(--color-zllen)'}}>
                <span className="field-name">zllen</span>
                <span className="field-value">{header.zllen}</span>
              </div>
            </div>
          </div>

          {/* Entries */}
          {entries.length > 0 ? (
            <div className="entries-container">
              {entries.map((entry, index) => (
                <div key={index} className={`memory-block entry-block ${entry.isNew ? 'new-entry' : ''}`}>
                  <div className="block-label">
                    Entry {index} @offset {entry.offset} ({entry.totalSize}字节)
                  </div>
                  <div className="entry-details">
                    <div className="entry-field" style={{background: 'var(--color-prevlen)'}}>
                      <span className="entry-field-label">prevlen</span>
                      <span className="entry-field-value">
                        {entry.prevlen} ({entry.prevlenSize}字节)
                      </span>
                    </div>
                    <div className="entry-field" style={{background: 'var(--color-encoding)'}}>
                      <span className="entry-field-label">encoding</span>
                      <span className="entry-field-value">{entry.encoding}</span>
                    </div>
                    <div className="entry-field" style={{background: 'var(--color-content)'}}>
                      <span className="entry-field-label">content</span>
                      <span className="entry-field-value">
                        {typeof entry.content === 'number' ? entry.content : `"${entry.content}"`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">
              ZipList为空，使用右侧控制面板添加节点
            </div>
          )}

          {/* End marker */}
          <div className="memory-block end-block">
            <div className="block-label">END (1字节)</div>
            <div className="block-content" style={{background: 'var(--color-end)'}}>
              0xFF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryLayoutView;
