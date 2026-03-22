import { ZipListState } from '@/types/ziplist';
import './StatisticsPanel.css';

interface StatisticsPanelProps {
  zipListState: ZipListState;
}

function StatisticsPanel({ zipListState }: StatisticsPanelProps) {
  const { header, entries, totalBytes } = zipListState;

  // 计算统计数据
  const avgEntrySize = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.totalSize, 0) / entries.length).toFixed(2)
    : 0;

  const entriesBytes = entries.reduce((sum, e) => sum + e.totalSize, 0);
  const memoryEfficiency = entries.length > 0
    ? ((entriesBytes / totalBytes) * 100).toFixed(1)
    : 0;

  // 假设普通链表每个节点需要24字节（8字节数据 + 8字节prev指针 + 8字节next指针）
  const linkedListBytes = entries.length > 0 ? entries.length * 24 + entriesBytes : 0;
  const savings = linkedListBytes > 0 
    ? (((linkedListBytes - totalBytes) / linkedListBytes) * 100).toFixed(1)
    : 0;

  return (
    <div className="statistics-panel">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-label">节点数量</div>
            <div className="stat-value">{header.zllen}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-info">
            <div className="stat-label">总字节数</div>
            <div className="stat-value">{totalBytes}B</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📏</div>
          <div className="stat-info">
            <div className="stat-label">平均节点大小</div>
            <div className="stat-value">{avgEntrySize}B</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-label">内存效率</div>
            <div className="stat-value">{memoryEfficiency}%</div>
          </div>
        </div>

        {linkedListBytes > 0 && (
          <div className="stat-card highlight">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <div className="stat-label">vs 普通链表节省</div>
              <div className="stat-value">{savings}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatisticsPanel;
