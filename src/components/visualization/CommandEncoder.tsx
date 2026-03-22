import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './CommandEncoder.css';

type EncodingType = 'INT8' | 'INT16' | 'INT24' | 'INT32' | 'INT64' | 'STR_6BIT' | 'STR_14BIT' | 'STR_32BIT';

interface EncodingInfo {
  type: EncodingType;
  name: string;
  description: string;
  byteIndicator: string;
  range?: string;
  maxSize?: string;
}

const encodings: EncodingInfo[] = [
  { type: 'INT8', name: 'INT8', description: '8-bit signed integer', byteIndicator: '11111110', range: '-128 to 127' },
  { type: 'INT16', name: 'INT16', description: '16-bit signed integer', byteIndicator: '11000000', range: '-32768 to 32767' },
  { type: 'INT24', name: 'INT24', description: '24-bit signed integer', byteIndicator: '11110000', range: '-8388608 to 8388607' },
  { type: 'INT32', name: 'INT32', description: '32-bit signed integer', byteIndicator: '11010000', range: '-2147483648 to 2147483647' },
  { type: 'INT64', name: 'INT64', description: '64-bit signed integer', byteIndicator: '11100000', range: 'Beyond 32-bit range' },
  { type: 'STR_6BIT', name: 'STR_6BIT', description: '6-bit length string', byteIndicator: '00xxxxxx', maxSize: 'Up to 63 bytes' },
  { type: 'STR_14BIT', name: 'STR_14BIT', description: '14-bit length string', byteIndicator: '01xxxxxx', maxSize: 'Up to 16383 bytes' },
  { type: 'STR_32BIT', name: 'STR_32BIT', description: '32-bit length string', byteIndicator: '10xxxxxx', maxSize: 'Up to 4GB' }
];

export const CommandEncoder: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedEncoding, setSelectedEncoding] = useState<EncodingInfo>(encodings[0]);
  const [animatedBits, setAnimatedBits] = useState<string[]>([]);

  useEffect(() => {
    // Animate bits when encoding changes
    const bits = selectedEncoding.byteIndicator.split('');
    setAnimatedBits([]);
    const timer = setTimeout(() => {
      setAnimatedBits(bits);
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedEncoding]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 280;

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent');

    // Title
    svg.append('text')
      .attr('x', centerX)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .text('Encoding Type Visualization');

    // Main encoding byte visualization
    const byteWidth = 280;
    const byteHeight = 60;
    const byteX = centerX - byteWidth / 2;
    const byteY = centerY - 30;

    // Byte container
    const byteGroup = svg.append('g')
      .attr('transform', `translate(${byteX}, ${byteY})`);

    // Byte background
    byteGroup.append('rect')
      .attr('width', byteWidth)
      .attr('height', byteHeight)
      .attr('rx', 8)
      .attr('fill', '#F1F5F9')
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 2);

    // Bit cells
    const bitWidth = byteWidth / 8;
    animatedBits.forEach((bit, i) => {
      const isData = i >= 2 || bit === 'x';
      const bitColor = bit === 'x' ? '#3B82F6' :
                      bit === '1' ? '#10B981' : '#EF4444';

      const bitGroup = byteGroup.append('g')
        .attr('transform', `translate(${i * bitWidth + bitWidth / 2}, ${byteHeight / 2})`);

      // Bit cell background
      bitGroup.append('rect')
        .attr('x', -bitWidth / 2 + 2)
        .attr('y', -byteHeight / 2 + 4)
        .attr('width', bitWidth - 4)
        .attr('height', byteHeight - 8)
        .attr('rx', 3)
        .attr('fill', isData ? '#E2E8F0' : bitColor)
        .attr('opacity', 0)
        .transition()
        .delay(i * 80)
        .duration(300)
        .attr('opacity', 1);

      // Bit text
      bitGroup.append('text')
        .attr('y', 5)
        .attr('text-anchor', 'middle')
        .attr('fill', isData ? '#64748B' : 'white')
        .attr('font-size', '16px')
        .attr('font-weight', '700')
        .attr('font-family', "'JetBrains Mono', monospace")
        .attr('opacity', 0)
        .text(bit === 'x' ? 'x' : bit)
        .transition()
        .delay(i * 80 + 100)
        .duration(300)
        .attr('opacity', 1);
    });

    // Labels
    svg.append('text')
      .attr('x', byteX + 30)
      .attr('y', byteY - 10)
      .attr('fill', '#64748B')
      .attr('font-size', '11px')
      .text('Prefix bits');

    svg.append('text')
      .attr('x', byteX + byteWidth - 50)
      .attr('y', byteY - 10)
      .attr('fill', '#64748B')
      .attr('font-size', '11px')
      .text('Data bits');

    // Arrow between bits
    svg.append('line')
      .attr('x1', byteX + byteWidth * 0.25)
      .attr('y1', byteY + byteHeight + 15)
      .attr('x2', byteX + byteWidth * 0.25)
      .attr('y2', byteY + byteHeight + 30)
      .attr('stroke', '#94A3B8')
      .attr('stroke-width', 1);

    svg.append('text')
      .attr('x', byteX + byteWidth * 0.25)
      .attr('y', byteY + byteHeight + 42)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '10px')
      .text('2 bits');

    svg.append('line')
      .attr('x1', byteX + byteWidth * 0.75)
      .attr('y1', byteY + byteHeight + 15)
      .attr('x2', byteX + byteWidth * 0.75)
      .attr('y2', byteY + byteHeight + 30)
      .attr('stroke', '#94A3B8')
      .attr('stroke-width', 1);

    svg.append('text')
      .attr('x', byteX + byteWidth * 0.75)
      .attr('y', byteY + byteHeight + 42)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '10px')
      .text('6 bits');

    // Encoding info panel
    const infoY = byteY + byteHeight + 65;
    const infoGroup = svg.append('g')
      .attr('transform', `translate(${centerX}, ${infoY})`);

    infoGroup.append('text')
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '18px')
      .attr('font-weight', '700')
      .text(selectedEncoding.name);

    infoGroup.append('text')
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '13px')
      .text(selectedEncoding.description);

    if (selectedEncoding.range) {
      infoGroup.append('text')
        .attr('y', 42)
        .attr('text-anchor', 'middle')
        .attr('fill', '#10B981')
        .attr('font-size', '12px')
        .text(`Range: ${selectedEncoding.range}`);
    }

    if (selectedEncoding.maxSize) {
      infoGroup.append('text')
        .attr('y', 42)
        .attr('text-anchor', 'middle')
        .attr('fill', '#F59E0B')
        .attr('font-size', '12px')
        .text(`Max size: ${selectedEncoding.maxSize}`);
    }

  }, [selectedEncoding, animatedBits]);

  return (
    <div className="command-encoder">
      <div className="encoder-header">
        <h3>Encoding Type Selector</h3>
        <p className="encoder-description">
          Click to explore different ZipList encoding types
        </p>
      </div>

      <svg ref={svgRef} className="encoder-svg" />

      <div className="encoding-buttons">
        <div className="button-group">
          <span className="group-label">Integer Encodings:</span>
          <div className="button-row">
            {encodings.filter(e => e.type.startsWith('INT')).map(encoding => (
              <button
                key={encoding.type}
                className={`encoding-button int-button ${selectedEncoding.type === encoding.type ? 'active' : ''}`}
                onClick={() => setSelectedEncoding(encoding)}
              >
                {encoding.type}
              </button>
            ))}
          </div>
        </div>

        <div className="button-group">
          <span className="group-label">String Encodings:</span>
          <div className="button-row">
            {encodings.filter(e => e.type.startsWith('STR')).map(encoding => (
              <button
                key={encoding.type}
                className={`encoding-button str-button ${selectedEncoding.type === encoding.type ? 'active' : ''}`}
                onClick={() => setSelectedEncoding(encoding)}
              >
                {encoding.type.replace('STR_', 'STR ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="encoding-info-panel">
        <div className="info-row">
          <span className="info-label">Encoding:</span>
          <span className="info-value type-badge">{selectedEncoding.type}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Description:</span>
          <span className="info-value">{selectedEncoding.description}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Byte Pattern:</span>
          <span className="info-value byte-pattern">{selectedEncoding.byteIndicator}</span>
        </div>
        {selectedEncoding.range && (
          <div className="info-row">
            <span className="info-label">Value Range:</span>
            <span className="info-value range-value">{selectedEncoding.range}</span>
          </div>
        )}
        {selectedEncoding.maxSize && (
          <div className="info-row">
            <span className="info-label">Maximum Size:</span>
            <span className="info-value max-value">{selectedEncoding.maxSize}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandEncoder;
