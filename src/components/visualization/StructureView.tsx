import { ZipListState } from '@/types/ziplist';
import './StructureView.css';

interface StructureViewProps {
  zipListState: ZipListState;
}

function StructureView({ zipListState }: StructureViewProps) {
  const { header, entries } = zipListState;

  return (
    <div className="structure-view">
      <h3 className="structure-title">ZipList 结构关系图</h3>
      
      <div className="structure-diagram">
        {/* Header */}
        <div className="struct-node header-node">
          <div className="node-label">HEADER</div>
          <div className="node-details">
            <div className="node-detail">zlbytes: {header.zlbytes}</div>
            <div className="node-detail">zltail: {header.zltail}</div>
            <div className="node-detail">zllen: {header.zllen}</div>
          </div>
          <div className="node-size">{12}字节</div>
        </div>

        {/* Arrow */}
        {entries.length > 0 && <div className="struct-arrow">→</div>}

        {/* Entries */}
        {entries.map((entry, index) => (
          <div key={index} className="struct-node-wrapper">
            <div className={`struct-node entry-node ${entry.isNew ? 'new-node' : ''}`}>
              <div className="node-label">ENTRY {index}</div>
              <div className="node-details">
                <div className="node-detail">offset: {entry.offset}</div>
                <div className="node-detail">prevlen: {entry.prevlen} ({entry.prevlenSize}B)</div>
                <div className="node-detail">encoding: {entry.encoding}</div>
                <div className="node-detail">
                  content: {typeof entry.content === 'number' ? entry.content : `"${entry.content}"`}
                </div>
              </div>
              <div className="node-size">{entry.totalSize}字节</div>
            </div>
            
            {index < entries.length - 1 && <div className="struct-arrow">→</div>}
          </div>
        ))}

        {/* End marker */}
        {entries.length > 0 && <div className="struct-arrow">→</div>}
        <div className="struct-node end-node">
          <div className="node-label">END</div>
          <div className="node-details">
            <div className="node-detail">0xFF</div>
          </div>
          <div className="node-size">1字节</div>
        </div>
      </div>

      {/* Tail pointer visualization */}
      {entries.length > 0 && (
        <div className="tail-pointer">
          <div className="pointer-label">zltail 指向</div>
          <div className="pointer-arrow">↓</div>
          <div className="pointer-target">
            Entry {entries.length - 1} (offset: {header.zltail})
          </div>
        </div>
      )}
    </div>
  );
}

export default StructureView;
