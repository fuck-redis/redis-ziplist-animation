import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './MemoryCalculator.css';

interface MemoryStats {
  linkedListBytes: number;
  zipListBytes: number;
  savings: number;
  savingsPercent: number;
}

export const MemoryCalculator: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [elementCount, setElementCount] = useState(10);
  const [avgElementSize, setAvgElementSize] = useState(50);

  const stats: MemoryStats = calculateMemory(elementCount, avgElementSize);

  function calculateMemory(count: number, avgSize: number): MemoryStats {
    // Linked list: each node has prev(8) + next(8) + data pointer(8) + data(avgSize)
    const linkedListPerNode = 8 + 8 + 8 + avgSize;
    const linkedListTotal = linkedListPerNode * count + 16; // +16 for list head/tail

    // ZipList: header(12) + each entry(prevlen 1 + encoding 1 + content avgSize) + end(1)
    const zipListPerEntry = 1 + 1 + avgSize; // prevlen + encoding + content
    const zipListTotal = 12 + (zipListPerEntry * count) + 1;

    const savings = linkedListTotal - zipListTotal;
    const savingsPercent = (savings / linkedListTotal) * 100;

    return {
      linkedListBytes: linkedListTotal,
      zipListBytes: zipListTotal,
      savings,
      savingsPercent
    };
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 350;
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Data
    const data = [
      { name: '普通链表', value: stats.linkedListBytes, color: '#EF4444' },
      { name: 'ZipList', value: stats.zipListBytes, color: '#10B981' }
    ];

    // Scales
    const maxValue = Math.max(stats.linkedListBytes * 1.1, 1000);
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, chartWidth])
      .padding(0.4);

    const yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([chartHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#E2E8F0')
      .attr('stroke-dasharray', '3,3');

    // Bars
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar');

    // Bar rectangles
    bars.append('rect')
      .attr('x', d => xScale(d.name)!)
      .attr('y', chartHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', d => d.color)
      .attr('rx', 6)
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.value))
      .attr('height', d => chartHeight - yScale(d.value));

    // Value labels on bars
    bars.append('text')
      .attr('x', d => xScale(d.name)! + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('font-family', 'Monaco, Menlo, monospace')
      .attr('opacity', 0)
      .text(d => `${d.value} 字节`)
      .transition()
      .delay(600)
      .duration(300)
      .attr('opacity', 1);

    // X axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', '#475569')
      .attr('font-size', '13px')
      .attr('font-weight', '600');

    // Y axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d} B`))
      .selectAll('text')
      .attr('fill', '#64748B')
      .attr('font-size', '11px');

    // Y axis label
    svg.append('text')
      .attr('x', 20)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .attr('transform', `rotate(-90, 20, ${height / 2})`)
      .text('内存占用 (字节)');

    // Savings indicator
    if (stats.savings > 0) {
      const savingsY = yScale(stats.zipListBytes + (stats.linkedListBytes - stats.zipListBytes) / 2);

      // Arrow
      g.append('path')
        .attr('d', `M ${chartWidth / 2 - 40},${savingsY} L ${chartWidth / 2 + 40},${savingsY}`)
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');

      g.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', savingsY - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#3B82F6')
        .attr('font-size', '14px')
        .attr('font-weight', '700')
        .text(`节省 ${stats.savingsPercent.toFixed(1)}%`);
    }

    // Arrow marker definition
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#3B82F6');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 24)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .text('内存占用对比');

  }, [elementCount, avgElementSize, stats]);

  return (
    <div className="memory-calculator">
      <h3 className="viz-title">内存节省计算器</h3>
      <p className="viz-subtitle">对比普通链表与 ZipList 的内存占用</p>

      <div className="input-grid">
        <div className="input-group">
          <label>
            元素数量: <span className="value">{elementCount}</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={elementCount}
            onChange={e => setElementCount(parseInt(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label>
            平均元素大小: <span className="value">{avgElementSize} 字节</span>
          </label>
          <input
            type="range"
            min="1"
            max="200"
            value={avgElementSize}
            onChange={e => setAvgElementSize(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="viz-container">
        <svg ref={svgRef} width="600" height="350" viewBox="0 0 600 350" />
      </div>

      <div className="stats-grid">
        <div className="stat-card linked-list">
          <div className="stat-header">普通链表</div>
          <div className="stat-value">{stats.linkedListBytes} 字节</div>
          <div className="stat-breakdown">
            <div className="breakdown-item">
              <span>每节点:</span>
              <span>prev(8) + next(8) + ptr(8) + data({avgElementSize})</span>
            </div>
            <div className="breakdown-item">
              <span>总计:</span>
              <span>{8 + 8 + 8 + avgElementSize} x {elementCount} + 16</span>
            </div>
          </div>
        </div>

        <div className="stat-card ziplist">
          <div className="stat-header">ZipList</div>
          <div className="stat-value">{stats.zipListBytes} 字节</div>
          <div className="stat-breakdown">
            <div className="breakdown-item">
              <span>每节点:</span>
              <span>prevlen(1) + encoding(1) + content({avgElementSize})</span>
            </div>
            <div className="breakdown-item">
              <span>总计:</span>
              <span>12(header) + {1 + 1 + avgElementSize} x {elementCount} + 1(end)</span>
            </div>
          </div>
        </div>

        <div className="stat-card savings">
          <div className="stat-header">节省</div>
          <div className="stat-value">{stats.savings} 字节</div>
          <div className="stat-percent">{stats.savingsPercent.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCalculator;
