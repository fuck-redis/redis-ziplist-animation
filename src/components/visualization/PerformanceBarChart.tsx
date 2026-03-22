import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './PerformanceBarChart.css';

type Operation = 'access' | 'search' | 'insert' | 'delete';
type DataStructure = 'ziplist' | 'quicklist' | 'skiplist';

const complexityMap: Record<DataStructure, Record<Operation, number>> = {
  ziplist: { access: 100, search: 100, insert: 100, delete: 100 },
  quicklist: { access: 80, search: 80, insert: 30, delete: 30 },
  skiplist: { access: 30, search: 30, insert: 30, delete: 30 }
};

const operationLabels: Record<Operation, string> = {
  access: 'Random Access',
  search: 'Search',
  insert: 'Insert',
  delete: 'Delete'
};

const operationDescriptions: Record<Operation, string> = {
  access: 'Access element by index',
  search: 'Find element by value',
  insert: 'Insert new element',
  delete: 'Delete existing element'
};

export const PerformanceBarChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation>('search');
  const [hoveredBar, setHoveredBar] = useState<{ ds: DataStructure; value: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 350;
    const margin = { top: 50, right: 40, bottom: 60, left: 80 };

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const dataStructures: DataStructure[] = ['ziplist', 'quicklist', 'skiplist'];
    const colors: Record<DataStructure, string> = {
      ziplist: '#3B82F6',
      quicklist: '#06B6D4',
      skiplist: '#10B981'
    };

    const data = dataStructures.map(ds => ({
      name: ds,
      value: complexityMap[ds][selectedOperation],
      color: colors[ds]
    }));

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '18px')
      .attr('font-weight', '600')
      .text(`${operationLabels[selectedOperation]} Complexity Comparison`);

    // Subtitle
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text(operationDescriptions[selectedOperation]);

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.35);

    const y = d3.scaleLinear()
      .domain([0, 120])
      .range([height - margin.bottom, margin.top]);

    // Grid lines
    svg.selectAll('.grid-line')
      .data([20, 40, 60, 80, 100])
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d))
      .attr('stroke', '#E2E8F0')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .selectAll('text')
      .attr('fill', '#64748B')
      .attr('font-size', '11px');

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text('Relative Complexity');

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => {
        const labels: Record<string, string> = {
          ziplist: 'ZipList',
          quicklist: 'QuickList',
          skiplist: 'SkipList'
        };
        return labels[d as string] || d;
      }))
      .selectAll('text')
      .attr('fill', '#1E293B')
      .attr('font-size', '12px')
      .attr('font-weight', '500');

    // Create bars with animation
    const bars = svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .style('cursor', 'pointer');

    bars.append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name) as number)
      .attr('width', x.bandwidth())
      .attr('y', height - margin.bottom)
      .attr('height', 0)
      .attr('fill', d => d.color)
      .attr('rx', 6)
      .on('mouseover', function(_event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 0.8)
          .attr('transform', 'scale(1.02)');
        setHoveredBar({ ds: d.name, value: d.value });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1)
          .attr('transform', 'scale(1)');
        setHoveredBar(null);
      })
      .transition()
      .duration(800)
      .ease(d3.easeElasticOut.amplitude(1).period(0.6))
      .attr('y', d => y(d.value))
      .attr('height', d => height - margin.bottom - y(d.value));

    // Value labels
    bars.append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.name) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text(d => `${d.value}%`)
      .transition()
      .delay(500)
      .duration(300)
      .attr('opacity', 1);

    // Efficiency threshold line
    if (selectedOperation !== 'access') {
      svg.append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', y(50))
        .attr('y2', y(50))
        .attr('stroke', '#F59E0B')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8,4');

      svg.append('text')
        .attr('x', width - margin.right - 5)
        .attr('y', y(50) - 8)
        .attr('text-anchor', 'end')
        .attr('fill', '#F59E0B')
        .attr('font-size', '11px')
        .text('Good efficiency');
    }

  }, [selectedOperation]);

  return (
    <div className="performance-bar-chart">
      <div className="chart-header">
        <h3>Operation Complexity Comparison</h3>
        <p className="chart-description">
          Compare time complexity across different Redis data structures
        </p>
      </div>

      <div className="operation-tabs">
        {(Object.keys(operationLabels) as Operation[]).map(op => (
          <button
            key={op}
            className={`operation-tab ${selectedOperation === op ? 'active' : ''}`}
            onClick={() => setSelectedOperation(op)}
          >
            <span className="tab-label">{operationLabels[op]}</span>
          </button>
        ))}
      </div>

      <svg ref={svgRef} className="chart-svg" />

      {hoveredBar && (
        <div className="hover-info">
          <span
            className="hover-color"
            style={{
              background: hoveredBar.ds === 'ziplist' ? '#3B82F6' :
                         hoveredBar.ds === 'quicklist' ? '#06B6D4' : '#10B981'
            }}
          ></span>
          <span className="hover-name">
            {hoveredBar.ds === 'ziplist' ? 'ZipList' :
             hoveredBar.ds === 'quicklist' ? 'QuickList' : 'SkipList'}:
          </span>
          <span className="hover-value">{hoveredBar.value}%</span>
        </div>
      )}

      <div className="complexity-scale">
        <span className="scale-low">Lower is better</span>
        <div className="scale-bar"></div>
        <span className="scale-high">Higher complexity</span>
      </div>
    </div>
  );
};

export default PerformanceBarChart;
