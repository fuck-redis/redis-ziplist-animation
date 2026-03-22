import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './EncodingRangeViz.css';

interface EncodingRange {
  name: string;
  bits: number;
  min: number;
  max: number;
  color: string;
  formula: string;
}

const encodingRanges: EncodingRange[] = [
  {
    name: 'INT8',
    bits: 8,
    min: -128,
    max: 127,
    color: '#3B82F6',
    formula: '-2^7 ~ 2^7-1'
  },
  {
    name: 'INT16',
    bits: 16,
    min: -32768,
    max: 32767,
    color: '#10B981',
    formula: '-2^15 ~ 2^15-1'
  },
  {
    name: 'INT24',
    bits: 24,
    min: -8388608,
    max: 8388607,
    color: '#F59E0B',
    formula: '-2^23 ~ 2^23-1'
  },
  {
    name: 'INT32',
    bits: 32,
    min: -2147483648,
    max: 2147483647,
    color: '#EC4899',
    formula: '-2^31 ~ 2^31-1'
  },
  {
    name: 'INT64',
    bits: 64,
    min: -9223372036854775808,
    max: 9223372036854775807,
    color: '#8B5CF6',
    formula: '-2^63 ~ 2^63-1'
  }
];

export const EncodingRangeViz: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedRange, setSelectedRange] = useState<EncodingRange | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 40, bottom: 80, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create gradient definitions
    const defs = svg.append('defs');

    encodingRanges.forEach((range, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `rangeGradient${i}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', range.color)
        .attr('stop-opacity', 0.8);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.color(range.color)!.darker(0.5).toString())
        .attr('stop-opacity', 0.9);
    });

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Number line scale
    const minVal = -1e19;
    const maxVal = 1e19;

    const xScale = d3.scaleLinear()
      .domain([minVal, maxVal])
      .range([0, chartWidth]);

    // Center line (zero)
    g.append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', 0)
      .attr('y2', chartHeight + 20)
      .attr('stroke', '#94A3B8')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4');

    // Zero label
    g.append('text')
      .attr('x', xScale(0))
      .attr('y', chartHeight + 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '11px')
      .text('0');

    // Draw range bars
    const barHeight = 40;
    const barGap = 12;
    const startY = 20;

    encodingRanges.forEach((range, i) => {
      const y = startY + i * (barHeight + barGap);
      const isSelected = selectedRange?.name === range.name;

      // Background track
      g.append('rect')
        .attr('x', 0)
        .attr('y', y)
        .attr('width', chartWidth)
        .attr('height', barHeight)
        .attr('fill', '#F1F5F9')
        .attr('rx', 6);

      // Use simpler approach - just center the ranges visually
      const centerPos = chartWidth / 2;
      const halfWidth = (chartWidth / 2) * (i + 1) / encodingRanges.length;

      // Range bar
      const rangeGroup = g.append('g')
        .attr('class', `range-group-${i}`)
        .style('cursor', 'pointer');

      rangeGroup.append('rect')
        .attr('x', centerPos - halfWidth)
        .attr('y', y)
        .attr('width', 0)
        .attr('height', barHeight)
        .attr('fill', `url(#rangeGradient${i})`)
        .attr('rx', 6)
        .attr('opacity', isSelected ? 1 : 0.75)
        .transition()
        .duration(800)
        .delay(i * 100)
        .attr('width', halfWidth * 2);

      // Range label
      rangeGroup.append('text')
        .attr('x', centerPos)
        .attr('y', y + barHeight / 2 - 6)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#FFFFFF')
        .attr('font-size', '14px')
        .attr('font-weight', '700')
        .attr('font-family', 'Monaco, Menlo, monospace')
        .attr('opacity', 0)
        .text(range.name)
        .transition()
        .delay(800 + i * 100)
        .duration(300)
        .attr('opacity', 1);

      // Bits label
      rangeGroup.append('text')
        .attr('x', centerPos)
        .attr('y', y + barHeight / 2 + 10)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'rgba(255,255,255,0.8)')
        .attr('font-size', '10px')
        .attr('font-family', 'Monaco, Menlo, monospace')
        .attr('opacity', 0)
        .text(`${range.bits} bits`)
        .transition()
        .delay(800 + i * 100)
        .duration(300)
        .attr('opacity', 1);

      // Click handler
      rangeGroup.on('click', () => {
        setSelectedRange(selectedRange?.name === range.name ? null : range);
      });
    });

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .text('整数编码取值范围');

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 200}, 25)`);

    legend.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#64748B')
      .attr('font-size', '11px')
      .text('点击查看详细范围');

    // Axis labels
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', height - 15)
      .attr('fill', '#64748B')
      .attr('font-size', '11px')
      .text('负数');

    svg.append('text')
      .attr('x', width - margin.right)
      .attr('y', height - 15)
      .attr('text-anchor', 'end')
      .attr('fill', '#64748B')
      .attr('font-size', '11px')
      .text('正数');

  }, [selectedRange]);

  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1e15) {
      return num.toExponential(2);
    }
    return num.toLocaleString();
  };

  return (
    <div className="encoding-range-viz">
      <h3 className="viz-title">整数编码取值范围</h3>
      <p className="viz-subtitle">ZipList 使用不同位数的整数编码来节省空间</p>

      <div className="viz-container">
        <svg ref={svgRef} width="800" height="400" viewBox="0 0 800 400" />
      </div>

      {selectedRange && (
        <div className="range-detail-panel" style={{ borderLeftColor: selectedRange.color }}>
          <div className="detail-header">
            <span className="detail-name">{selectedRange.name}</span>
            <span className="detail-bits">{selectedRange.bits} 位</span>
          </div>
          <div className="range-values">
            <div className="range-item negative">
              <span className="range-label">最小值:</span>
              <span className="range-value">{formatNumber(selectedRange.min)}</span>
            </div>
            <div className="range-item positive">
              <span className="range-label">最大值:</span>
              <span className="range-value">{formatNumber(selectedRange.max)}</span>
            </div>
          </div>
          <div className="range-formula">
            <span className="formula-label">公式:</span>
            <code>{selectedRange.formula}</code>
          </div>
          <div className="range-example">
            <span className="example-label">示例:</span>
            <div className="example-values">
              <span>-1: <code>0xFF</code></span>
              <span>0: <code>0x00</code></span>
              <span>127: <code>0x7F</code></span>
            </div>
          </div>
        </div>
      )}

      <div className="range-legend">
        <div className="legend-title">编码类型说明</div>
        <div className="legend-grid">
          {encodingRanges.map(range => (
            <div
              key={range.name}
              className={`legend-item ${selectedRange?.name === range.name ? 'active' : ''}`}
              style={{ borderColor: range.color }}
              onClick={() => setSelectedRange(selectedRange?.name === range.name ? null : range)}
            >
              <span className="legend-color" style={{ background: range.color }} />
              <span className="legend-name">{range.name}</span>
              <span className="legend-range">{range.bits}bits</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EncodingRangeViz;
