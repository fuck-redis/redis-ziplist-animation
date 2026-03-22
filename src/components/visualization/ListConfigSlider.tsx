import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './ListConfigSlider.css';

interface ZipListVisualization {
  entries: { label: string; size: number }[];
  totalBytes: number;
  status: 'ziplist' | 'converting' | 'quicklist';
}

export const ListConfigSlider: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [threshold, setThreshold] = useState(4); // list-max-ziplist-size in KB
  const [visualization, setVisualization] = useState<ZipListVisualization>({
    entries: [
      { label: 'Item A', size: 1 },
      { label: 'Item B', size: 2 },
      { label: 'Item C', size: 1 },
      { label: 'Item D', size: 1 },
      { label: 'Item E', size: 2 }
    ],
    totalBytes: 85,
    status: 'ziplist'
  });

  // Simulate entries with varying sizes
  const generateEntries = (thresholdKB: number) => {
    const entries = [];
    const baseCount = 8;
    let totalSize = 0;

    for (let i = 0; i < baseCount; i++) {
      const sizeKB = Math.random() * 3 + 0.5;
      totalSize += sizeKB;

      entries.push({
        label: `Item ${String.fromCharCode(65 + i)}`,
        size: sizeKB
      });
    }

    const status: 'ziplist' | 'converting' | 'quicklist' = totalSize > thresholdKB * baseCount / 8 ? 'converting' : 'ziplist';

    return {
      entries,
      totalBytes: Math.round(totalSize * 1024),
      status
    };
  };

  useEffect(() => {
    const newViz = generateEntries(threshold);
    setVisualization(newViz);
  }, [threshold]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .text(`list-max-ziplist-size: ${threshold}KB`);

    // Calculate bar positions
    const barWidth = 50;
    const barGap = 15;
    const startX = (width - (visualization.entries.length * (barWidth + barGap))) / 2;
    const thresholdY = height - 80;

    // Draw threshold line
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', thresholdY)
      .attr('y2', thresholdY)
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    svg.append('text')
      .attr('x', width - margin.right - 5)
      .attr('y', thresholdY - 8)
      .attr('text-anchor', 'end')
      .attr('fill', '#EF4444')
      .attr('font-size', '11px')
      .text(`Threshold: ${threshold}KB`);

    // Create bars for each entry
    visualization.entries.forEach((entry, i) => {
      const x = startX + i * (barWidth + barGap);
      const barHeight = Math.min(entry.size / 8 * (height - 100), height - 100);
      const y = height - margin.bottom - barHeight;
      const isOverThreshold = entry.size > threshold;

      const barGroup = svg.append('g')
        .attr('transform', `translate(${x}, 0)`);

      // Bar rectangle
      barGroup.append('rect')
        .attr('y', height - margin.bottom)
        .attr('width', barWidth)
        .attr('height', 0)
        .attr('fill', isOverThreshold ? '#EF4444' : '#3B82F6')
        .attr('rx', 4)
        .transition()
        .duration(600)
        .delay(i * 80)
        .attr('y', y)
        .attr('height', barHeight);

      // Entry label
      barGroup.append('text')
        .attr('y', height - margin.bottom + 20)
        .attr('x', barWidth / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748B')
        .attr('font-size', '11px')
        .text(entry.label);

      // Size label
      barGroup.append('text')
        .attr('y', y - 8)
        .attr('x', barWidth / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1E293B')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('opacity', 0)
        .text(`${entry.size.toFixed(1)}KB`)
        .transition()
        .delay(i * 80 + 400)
        .duration(200)
        .attr('opacity', 1);
    });

    // Status indicator
    const statusY = 55;
    const statusColor = visualization.status === 'ziplist' ? '#10B981' :
                        visualization.status === 'converting' ? '#F59E0B' : '#3B82F6';
    const statusText = visualization.status === 'ziplist' ? 'Using ZipList' :
                       visualization.status === 'converting' ? 'Converting...' : 'Using QuickList';

    svg.append('circle')
      .attr('cx', width / 2 - 70)
      .attr('cy', statusY)
      .attr('r', 6)
      .attr('fill', statusColor);

    svg.append('text')
      .attr('x', width / 2 - 55)
      .attr('y', statusY + 4)
      .attr('fill', '#1E293B')
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .text(statusText);

    // Total size indicator
    svg.append('text')
      .attr('x', width / 2 + 50)
      .attr('y', statusY + 4)
      .attr('fill', '#64748B')
      .attr('font-size', '13px')
      .text(`Total: ${(visualization.totalBytes / 1024).toFixed(2)}KB`);

  }, [visualization, threshold]);

  return (
    <div className="list-config-slider">
      <div className="slider-header">
        <h3>List Configuration Threshold</h3>
        <p className="slider-description">
          Adjust the list-max-ziplist-size threshold to see structure changes
        </p>
      </div>

      <svg ref={svgRef} className="slider-svg" />

      <div className="threshold-control">
        <label htmlFor="threshold-slider">
          <span className="threshold-label">Threshold (KB)</span>
          <span className="threshold-value">{threshold} KB</span>
        </label>
        <input
          id="threshold-slider"
          type="range"
          min="1"
          max="8"
          step="0.5"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="threshold-slider"
        />
        <div className="slider-scale">
          <span>1KB</span>
          <span>2KB</span>
          <span>4KB</span>
          <span>8KB</span>
        </div>
      </div>

      <div className="config-info">
        <div className="info-card">
          <div className="info-icon ziplist-icon"></div>
          <div className="info-content">
            <strong>ZipList</strong>
            <span>Compact memory layout for small lists</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon quicklist-icon"></div>
          <div className="info-content">
            <strong>QuickList</strong>
            <span>Linked list of ziplists for large lists</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListConfigSlider;
