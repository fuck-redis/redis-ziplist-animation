import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './EntryStructureD3.css';

interface EntryPart {
  id: string;
  name: string;
  sizeRange: string;
  color: string;
  description: string;
  details: string[];
}

const entryParts: EntryPart[] = [
  {
    id: 'prevlen',
    name: 'prevlen',
    sizeRange: '1或5字节',
    color: '#3B82F6',
    description: '记录前一个entry的长度，用于反向遍历',
    details: [
      '前一个entry < 254字节: 用1字节存储',
      '前一个entry >= 254字节: 用5字节存储',
      '第一个entry的prevlen为0'
    ]
  },
  {
    id: 'encoding',
    name: 'encoding',
    sizeRange: '1-5字节',
    color: '#10B981',
    description: '指示如何解析content字段',
    details: [
      '整数编码: 11111110(INT8), 11000000(INT16), etc.',
      '字符串编码: 00xxxxxx(6bit), 01xxxxxx(14bit), 10xxxxxx(32bit)',
      '编码决定了content的长度和类型'
    ]
  },
  {
    id: 'content',
    name: 'content',
    sizeRange: 'N字节',
    color: '#F59E0B',
    description: '存储实际数据',
    details: [
      '整数: 直接存储，不再额外分配指针',
      '字符串: 连续字节序列',
      '内容长度由encoding字段解析得出'
    ]
  }
];

export const EntryStructureD3: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggedPart, setDraggedPart] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<EntryPart | null>(null);
  const [partPositions, setPartPositions] = useState<{ [key: string]: { x: number; y: number } }>({
    prevlen: { x: 50, y: 150 },
    encoding: { x: 220, y: 150 },
    content: { x: 390, y: 150 }
  });
  const [isSeparated, setIsSeparated] = useState(false);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;

    // Create gradients
    const defs = svg.append('defs');

    entryParts.forEach((part, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `entryGradient${i}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', part.color)
        .attr('stop-opacity', 0.9);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.color(part.color)!.darker(0.4).toString())
        .attr('stop-opacity', 1);
    });

    // Main group
    const mainGroup = svg.append('g').attr('class', 'main-group');

    // Draw entry parts
    entryParts.forEach((part, i) => {
      const pos = partPositions[part.id];
      const isDragging = draggedPart === part.id;
      const isSelected = selectedPart?.id === part.id;

      const partGroup = mainGroup.append('g')
        .attr('class', `part-${part.id}`)
        .attr('transform', `translate(${pos.x}, ${pos.y})`)
        .style('cursor', isSeparated ? 'grab' : 'pointer');

      // Box dimensions
      const boxWidth = 140;
      const boxHeight = isSeparated ? 120 : 80;

      // Shadow
      partGroup.append('rect')
        .attr('x', 4)
        .attr('y', 4)
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('rx', 8)
        .attr('fill', 'rgba(0,0,0,0.1)');

      // Main box
      partGroup.append('rect')
        .attr('class', 'part-box')
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('rx', 8)
        .attr('fill', `url(#entryGradient${i})`)
        .attr('stroke', isSelected ? '#1E293B' : (isDragging ? '#3B82F6' : 'rgba(255,255,255,0.3)'))
        .attr('stroke-width', isSelected ? 3 : (isDragging ? 2 : 1))
        .style('filter', isDragging ? 'drop-shadow(0 12px 20px rgba(0,0,0,0.3))' : 'none');

      // Part name
      partGroup.append('text')
        .attr('x', boxWidth / 2)
        .attr('y', boxHeight / 2 - 8)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#FFFFFF')
        .attr('font-size', '16px')
        .attr('font-weight', '700')
        .attr('font-family', 'Monaco, Menlo, monospace')
        .text(part.name);

      // Size range
      partGroup.append('text')
        .attr('x', boxWidth / 2)
        .attr('y', boxHeight / 2 + 12)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'rgba(255,255,255,0.85)')
        .attr('font-size', '11px')
        .attr('font-family', 'Monaco, Menlo, monospace')
        .text(part.sizeRange);

      // Plus sign between parts (when not separated)
      if (!isSeparated && i < entryParts.length - 1) {
        partGroup.append('text')
          .attr('x', boxWidth + 10)
          .attr('y', boxHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#94A3B8')
          .attr('font-size', '20px')
          .attr('font-weight', '700')
          .text('+');
      }

      // Click handler
      partGroup.on('click', () => {
        if (!isSeparated) {
          setSelectedPart(selectedPart?.id === part.id ? null : part);
        }
      });

      // Drag behavior (only when separated)
      if (isSeparated) {
        const drag = d3.drag<SVGGElement, unknown>()
          .on('start', function() {
            d3.select(this).raise();
            setDraggedPart(part.id);
          })
          .on('drag', function(event) {
            const newX = pos.x + event.dx;
            const newY = pos.y + event.dy;
            d3.select(this).attr('transform', `translate(${newX}, ${newY})`);
          })
          .on('end', function(event) {
            const newX = Math.max(20, Math.min(width - 160, pos.x + event.x - pos.x));
            const newY = Math.max(20, Math.min(height - 140, pos.y + event.y - pos.y));
            setPartPositions(prev => ({ ...prev, [part.id]: { x: newX, y: newY } }));
            setDraggedPart(null);
          });

        partGroup.call(drag as any);
      }
    });

    // Labels and instructions
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text('Entry 结构分解图');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text(isSeparated ? '拖拽各部分查看详情' : '点击各部分查看详细说明');

  }, [partPositions, draggedPart, selectedPart, isSeparated]);

  const toggleSeparation = () => {
    if (!isSeparated) {
      setPartPositions({
        prevlen: { x: 50, y: 80 },
        encoding: { x: 220, y: 80 },
        content: { x: 390, y: 80 }
      });
    } else {
      setPartPositions({
        prevlen: { x: 50, y: 150 },
        encoding: { x: 220, y: 150 },
        content: { x: 390, y: 150 }
      });
    }
    setIsSeparated(!isSeparated);
    setSelectedPart(null);
  };

  return (
    <div className="entry-structure-d3">
      <div className="viz-header">
        <h3 className="viz-title">Entry 结构分解图</h3>
        <button className="toggle-btn" onClick={toggleSeparation}>
          {isSeparated ? '合并' : '拖拽分离'}
        </button>
      </div>
      <div className="viz-container">
        <svg ref={svgRef} width="600" height="300" viewBox="0 0 600 300" />
      </div>
      {selectedPart && (
        <div className="part-detail-panel" style={{ borderLeftColor: selectedPart.color }}>
          <div className="detail-header">
            <span className="detail-name">{selectedPart.name}</span>
            <span className="detail-size">{selectedPart.sizeRange}</span>
          </div>
          <p className="detail-desc">{selectedPart.description}</p>
          <ul className="detail-list">
            {selectedPart.details.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      )}
      {isSeparated && !selectedPart && (
        <div className="hint-panel">
          <p>拖拽各部分到任意位置，点击查看详细说明</p>
        </div>
      )}
    </div>
  );
};

export default EntryStructureD3;
