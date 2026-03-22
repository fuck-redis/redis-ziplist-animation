import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './MemoryComparisonChart.css';

export const MemoryComparisonChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [elementCount, setElementCount] = useState(100);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };

    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Calculate memory usage
    const ziplistOverhead = 12; // Header bytes
    const ziplistPerEntry = 6; // avg prevlen + encoding bytes
    const ziplistEnd = 1; // End byte

    const linkedListOverhead = 0;
    const linkedListPerNode = 24; // 8 bytes data pointer + 8 bytes prev + 8 bytes next

    const avgEntrySize = 20; // Average entry size in bytes

    const ziplistMemory = ziplistOverhead + (elementCount * (ziplistPerEntry + avgEntrySize)) + ziplistEnd;
    const linkedListMemory = linkedListOverhead + (elementCount * (linkedListPerNode + avgEntrySize));

    const data = [
      { name: 'ZipList', memory: ziplistMemory, color: '#3B82F6' },
      { name: 'LinkedList', memory: linkedListMemory, color: '#06B6D4' }
    ];

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.memory) as number * 1.1])
      .range([height - margin.bottom, margin.top]);

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '18px')
      .attr('font-weight', '600')
      .text('Memory Usage Comparison');

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('fill', '#1E293B')
      .attr('font-size', '14px');

    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => `${(d as number) / 1000}KB`))
      .selectAll('text')
      .attr('fill', '#1E293B')
      .attr('font-size', '12px');

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text('Memory Usage');

    // Create bars with animation
    const bars = svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name) as number)
      .attr('width', x.bandwidth())
      .attr('y', height - margin.bottom)
      .attr('height', 0)
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .style('cursor', 'pointer');

    // Animate bars
    bars.transition()
      .duration(800)
      .ease(d3.easeElasticOut.amplitude(1).period(0.5))
      .attr('y', d => y(d.memory))
      .attr('height', d => height - margin.bottom - y(d.memory));

    // Add value labels on bars
    svg.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.name) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.memory) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(d => `${(d.memory / 1000).toFixed(1)}KB`)
      .transition()
      .delay(600)
      .duration(300)
      .attr('opacity', 1);

    // Add hover effects
    bars.on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 0.8)
        .attr('transform', 'scale(1.02)');

      // Show tooltip
      const tooltip = svg.append('g')
        .attr('class', 'tooltip')
        .attr('transform', `translate(${event.offsetX + 10},${event.offsetY - 30})`);

      tooltip.append('rect')
        .attr('fill', '#1E293B')
        .attr('rx', 4)
        .attr('width', 120)
        .attr('height', 40);

      tooltip.append('text')
        .attr('fill', 'white')
        .attr('x', 60)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .text(`${d.name}`);

      tooltip.append('text')
        .attr('fill', '#06B6D4')
        .attr('x', 60)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(`${d.memory} bytes`);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1)
        .attr('transform', 'scale(1)');

      svg.selectAll('.tooltip').remove();
    });

    // Add savings indicator
    const savings = ((linkedListMemory - ziplistMemory) / linkedListMemory * 100).toFixed(1);
    svg.append('text')
      .attr('x', width - margin.right)
      .attr('y', margin.top + 10)
      .attr('text-anchor', 'end')
      .attr('fill', '#10B981')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(`ZipList saves ${savings}% memory`);

  }, [elementCount]);

  return (
    <div className="memory-comparison-chart">
      <div className="chart-header">
        <h3>Memory Usage: ZipList vs LinkedList</h3>
        <p className="chart-description">
          Compare memory footprint between ZipList and traditional linked list
        </p>
      </div>

      <div className="slider-container">
        <label htmlFor="element-slider">Number of Elements: {elementCount}</label>
        <input
          id="element-slider"
          type="range"
          min="10"
          max="500"
          step="10"
          value={elementCount}
          onChange={(e) => setElementCount(parseInt(e.target.value))}
          className="element-slider"
        />
        <div className="slider-markers">
          <span>10</span>
          <span>100</span>
          <span>250</span>
          <span>500</span>
        </div>
      </div>

      <svg ref={svgRef} className="chart-svg" />

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color ziplist"></span>
          <span>ZipList (compact)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color linkedlist"></span>
          <span>LinkedList (with pointers)</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryComparisonChart;
