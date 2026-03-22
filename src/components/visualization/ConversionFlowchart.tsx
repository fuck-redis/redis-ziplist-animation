import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './ConversionFlowchart.css';

interface ConversionStep {
  id: string;
  type: 'source' | 'condition' | 'target';
  label: string;
  sublabel?: string;
  color: string;
}

interface ConversionPath {
  source: ConversionStep;
  conditions: ConversionStep[];
  target: ConversionStep;
  description: string;
}

const conversions: ConversionPath[] = [
  {
    source: { id: 'list', type: 'source', label: 'List', sublabel: 'ZipList', color: '#3B82F6' },
    conditions: [
      { id: 'list-cond-1', type: 'condition', label: 'Elements > 512', color: '#F59E0B' },
      { id: 'list-cond-2', type: 'condition', label: 'Element Size > 64B', color: '#F59E0B' }
    ],
    target: { id: 'quicklist', type: 'target', label: 'QuickList', sublabel: 'LinkedList of ZipLists', color: '#06B6D4' },
    description: 'When a List exceeds size or element thresholds, it converts to a QuickList for better performance'
  },
  {
    source: { id: 'hash', type: 'source', label: 'Hash', sublabel: 'ZipList', color: '#3B82F6' },
    conditions: [
      { id: 'hash-cond-1', type: 'condition', label: 'Fields > 512', color: '#F59E0B' },
      { id: 'hash-cond-2', type: 'condition', label: 'Field/Value > 64B', color: '#F59E0B' }
    ],
    target: { id: 'hashtable', type: 'target', label: 'HashTable', sublabel: 'Dict (Hash Table)', color: '#10B981' },
    description: 'Large Hashes convert to HashTables for O(1) field access'
  },
  {
    source: { id: 'zset', type: 'source', label: 'Zset', sublabel: 'ZipList + Score', color: '#3B82F6' },
    conditions: [
      { id: 'zset-cond-1', type: 'condition', label: 'Elements > 128', color: '#F59E0B' },
      { id: 'zset-cond-2', type: 'condition', label: 'Element Size > 64B', color: '#F59E0B' }
    ],
    target: { id: 'skiplist', type: 'target', label: 'SkipList', sublabel: 'Sorted Set', color: '#EC4899' },
    description: 'Large Sorted Sets use SkipLists for efficient range queries'
  }
];

export const ConversionFlowchart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedConversion, setSelectedConversion] = useState<ConversionPath | null>(null);
  const [animatedStep, setAnimatedStep] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 420;
    const margin = { top: 40, right: 30, bottom: 40, left: 30 };

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const rowHeight = 120;
    const colX = {
      source: 120,
      condition1: 300,
      condition2: 450,
      target: 650
    };

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '18px')
      .attr('font-weight', '600')
      .text('Data Structure Conversion Flow');

    // Create conversion rows
    conversions.forEach((conversion, rowIndex) => {
      const y = margin.top + rowIndex * rowHeight + 20;
      const isSelected = selectedConversion?.source.id === conversion.source.id;

      // Source node
      const sourceGroup = svg.append('g')
        .attr('class', 'node source-node')
        .attr('transform', `translate(${colX.source}, ${y})`)
        .style('cursor', 'pointer')
        .on('click', () => setSelectedConversion(conversion));

      sourceGroup.append('rect')
        .attr('x', -50)
        .attr('y', -25)
        .attr('width', 100)
        .attr('height', 50)
        .attr('rx', 8)
        .attr('fill', conversion.source.color)
        .attr('stroke', isSelected ? '#1E293B' : 'transparent')
        .attr('stroke-width', isSelected ? 3 : 0)
        .attr('opacity', animatedStep >= 0 ? 1 : 0)
        .transition()
        .delay(rowIndex * 200)
        .duration(400)
        .attr('opacity', 1);

      sourceGroup.append('text')
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(conversion.source.label);

      sourceGroup.append('text')
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.8)')
        .attr('font-size', '10px')
        .text(conversion.source.sublabel || '');

      // Arrow 1
      svg.append('path')
        .attr('d', `M${colX.source + 55},${y} L${colX.condition1 - 50},${y}`)
        .attr('fill', 'none')
        .attr('stroke', '#CBD5E1')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)')
        .attr('opacity', animatedStep >= 1 ? 1 : 0)
        .transition()
        .delay(rowIndex * 200 + 300)
        .duration(300)
        .attr('opacity', 1);

      // Condition nodes
      conversion.conditions.forEach((cond, condIndex) => {
        const condX = condIndex === 0 ? colX.condition1 : colX.condition2;
        const condY = y + (condIndex === 0 ? -15 : 15);

        const condGroup = svg.append('g')
          .attr('class', 'node condition-node')
          .attr('transform', `translate(${condX}, ${condY})`)
          .style('cursor', 'pointer')
          .on('click', () => setSelectedConversion(conversion));

        condGroup.append('polygon')
          .attr('points', '0,-20 40,0 0,20 -40,0')
          .attr('fill', cond.color)
          .attr('stroke', isSelected ? '#1E293B' : 'transparent')
          .attr('stroke-width', isSelected ? 3 : 0)
          .attr('opacity', animatedStep >= 2 ? 1 : 0)
          .transition()
          .delay(rowIndex * 200 + 400 + condIndex * 150)
          .duration(400)
          .attr('opacity', 1);

        condGroup.append('text')
          .attr('y', 4)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '10px')
          .attr('font-weight', '500')
          .text(cond.label);
      });

      // Arrow 2 (from second condition to target)
      svg.append('path')
        .attr('d', `M${colX.condition2 + 45},${y + 15} Q${colX.condition2 + 80},${y + 50} ${colX.target - 50},${y + 25}`)
        .attr('fill', 'none')
        .attr('stroke', '#CBD5E1')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)')
        .attr('opacity', animatedStep >= 3 ? 1 : 0)
        .transition()
        .delay(rowIndex * 200 + 600)
        .duration(300)
        .attr('opacity', 1);

      // Target node
      const targetGroup = svg.append('g')
        .attr('class', 'node target-node')
        .attr('transform', `translate(${colX.target}, ${y + 10})`)
        .style('cursor', 'pointer')
        .on('click', () => setSelectedConversion(conversion));

      targetGroup.append('rect')
        .attr('x', -55)
        .attr('y', -25)
        .attr('width', 110)
        .attr('height', 50)
        .attr('rx', 8)
        .attr('fill', conversion.target.color)
        .attr('stroke', isSelected ? '#1E293B' : 'transparent')
        .attr('stroke-width', isSelected ? 3 : 0)
        .attr('opacity', animatedStep >= 4 ? 1 : 0)
        .transition()
        .delay(rowIndex * 200 + 700)
        .duration(400)
        .attr('opacity', 1);

      targetGroup.append('text')
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(conversion.target.label);

      targetGroup.append('text')
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.8)')
        .attr('font-size', '10px')
        .text(conversion.target.sublabel || '');
    });

    // Define arrowhead marker
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#94A3B8');

    // Trigger animation steps
    const timers: number[] = [];
    [1, 2, 3, 4].forEach((step, i) => {
      const timer = window.setTimeout(() => setAnimatedStep(step), 300 + i * 400);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [selectedConversion]);

  return (
    <div className="conversion-flowchart">
      <div className="flowchart-header">
        <h3>Structure Conversion Rules</h3>
        <p className="flowchart-description">
          Click on nodes to see conversion details
        </p>
      </div>

      <svg ref={svgRef} className="flowchart-svg" />

      <div className="legend">
        <div className="legend-item">
          <span className="legend-shape source"></span>
          <span>Source (ZipList)</span>
        </div>
        <div className="legend-item">
          <span className="legend-shape condition"></span>
          <span>Trigger Condition</span>
        </div>
        <div className="legend-item">
          <span className="legend-shape target"></span>
          <span>Target Structure</span>
        </div>
      </div>

      {selectedConversion && (
        <div className="conversion-info-panel">
          <div className="panel-header">
            <span className="panel-badge" style={{ background: selectedConversion.source.color }}>
              {selectedConversion.source.label}
            </span>
            <span className="panel-arrow">→</span>
            <span className="panel-badge" style={{ background: selectedConversion.target.color }}>
              {selectedConversion.target.label}
            </span>
          </div>
          <p className="panel-description">{selectedConversion.description}</p>
          <div className="panel-conditions">
            <strong>Trigger Conditions:</strong>
            <ul>
              {selectedConversion.conditions.map(c => (
                <li key={c.id}>{c.label}</li>
              ))}
            </ul>
          </div>
          <button className="panel-close" onClick={() => setSelectedConversion(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversionFlowchart;
