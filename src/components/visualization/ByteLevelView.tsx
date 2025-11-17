import { ZipListState } from '@/types/ziplist';
import './ByteLevelView.css';

interface ByteLevelViewProps {
  zipListState: ZipListState;
}

function ByteLevelView({ zipListState }: ByteLevelViewProps) {
  const { memoryBlocks } = zipListState;

  const getColorForField = (fieldType?: string): string => {
    const colorMap: Record<string, string> = {
      'zlbytes': 'var(--color-zlbytes)',
      'zltail': 'var(--color-zltail)',
      'zllen': 'var(--color-zllen)',
      'prevlen': 'var(--color-prevlen)',
      'encoding': 'var(--color-encoding)',
      'content': 'var(--color-content)',
    };
    return fieldType ? colorMap[fieldType] || '#ccc' : 'var(--color-end)';
  };

  return (
    <div className="byte-level-view">
      <div className="byte-header">
        <h3>字节级内存视图</h3>
        <div className="byte-legend">
          <div className="legend-item">
            <span className="legend-color" style={{background: 'var(--color-zlbytes)'}}></span>
            <span className="legend-label">zlbytes</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: 'var(--color-zltail)'}}></span>
            <span className="legend-label">zltail</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: 'var(--color-zllen)'}}></span>
            <span className="legend-label">zllen</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: 'var(--color-prevlen)'}}></span>
            <span className="legend-label">prevlen</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: 'var(--color-encoding)'}}></span>
            <span className="legend-label">encoding</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: 'var(--color-content)'}}></span>
            <span className="legend-label">content</span>
          </div>
        </div>
      </div>

      <div className="byte-grid-container">
        <div className="byte-grid">
          {memoryBlocks.map((byte) => (
            <div
              key={byte.byteIndex}
              className="byte-cell"
              style={{background: getColorForField(byte.fieldType)}}
              title={`Offset: ${byte.byteIndex}, Value: ${byte.hexValue}, Field: ${byte.fieldType || 'end'}`}
            >
              <div className="byte-offset">{byte.byteIndex}</div>
              <div className="byte-value">{byte.hexValue}</div>
              <div className="byte-binary">{byte.binaryValue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ByteLevelView;
