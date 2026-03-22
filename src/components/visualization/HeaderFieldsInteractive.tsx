import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './HeaderFieldsInteractive.css';

interface FieldInfo {
  name: string;
  size: string;
  type: string;
  description: string;
  usage: string[];
  example: string;
  color: string;
}

const headerFields: FieldInfo[] = [
  {
    name: 'zlbytes',
    size: '4字节',
    type: 'uint32_t',
    description: '记录整个ZipList占用的总字节数',
    usage: [
      '快速获取整个结构的大小',
      '内存管理时快速判断是否需要扩容',
      'Redis MEMORY命令获取对象大小'
    ],
    example: 'zlbytes = 16 (12字节Header + 3字节Entry + 1字节End)',
    color: '#06B6D4'
  },
  {
    name: 'zltail',
    size: '4字节',
    type: 'uint32_t',
    description: '记录最后一个entry的偏移量',
    usage: [
      'O(1)时间定位到最后一个节点',
      '支持从尾部快速插入(rpush)',
      '支持从尾部快速删除(rpop)',
      '反向遍历的起点'
    ],
    example: 'zltail = 12 (跳过12字节Header，指向最后节点)',
    color: '#10B981'
  },
  {
    name: 'zllen',
    size: '2字节',
    type: 'uint16_t',
    description: '记录entry的数量',
    usage: [
      '节点数 < 65535时，存储真实数量',
      '节点数 >= 65535时，值为65535，需遍历计数'
    ],
    example: 'zllen = 5 (表示有5个entry)',
    color: '#3B82F6'
  }
];

export const HeaderFieldsInteractive: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedField, setSelectedField] = useState<FieldInfo | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create gradient definitions
    const defs = svg.append('defs');

    headerFields.forEach((field, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `headerGradient${i}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', field.color)
        .attr('stop-opacity', 0.8);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.color(field.color)!.darker(0.5).toString())
        .attr('stop-opacity', 0.9);
    });

    // 3D cube group
    const cubeGroup = svg.append('g')
      .attr('class', 'cubes')
      .attr('transform', `translate(${centerX - 200}, ${centerY})`);

    const cubeWidth = 100;
    const cubeHeight = 80;
    const cubeDepth = 40;
    const spacing = 140;

    // Draw 3D cubes for each field
    headerFields.forEach((field, i) => {
      const x = i * spacing;
      const isSelected = selectedField?.name === field.name;
      // Animate selection
      const targetY = isSelected ? -30 : 0;
      const currentY = animationStep === i ? targetY : 0;

      const cube = cubeGroup.append('g')
        .attr('class', `cube-${i}`)
        .attr('transform', `translate(${x}, ${currentY})`)
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedField(selectedField?.name === field.name ? null : field);
          setAnimationStep(i);
        });

      // Front face
      cube.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', cubeWidth)
        .attr('height', cubeHeight)
        .attr('fill', `url(#headerGradient${i})`)
        .attr('stroke', isSelected ? '#1E293B' : '#94A3B8')
        .attr('stroke-width', isSelected ? 3 : 1)
        .style('filter', isSelected ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' : 'none');

      // Top face (3D effect)
      cube.append('polygon')
        .attr('points', `0,0 ${cubeWidth},0 ${cubeWidth + cubeDepth * 0.5},${-cubeDepth * 0.5} ${cubeDepth * 0.5},${-cubeDepth * 0.5}`)
        .attr('fill', d3.color(field.color)!.brighter(0.3).toString())
        .attr('stroke', isSelected ? '#1E293B' : '#94A3B8')
        .attr('stroke-width', isSelected ? 2 : 0.5);

      // Right face (3D effect)
      cube.append('polygon')
        .attr('points', `${cubeWidth},0 ${cubeWidth + cubeDepth * 0.5},${-cubeDepth * 0.5} ${cubeWidth + cubeDepth * 0.5},${cubeHeight - cubeDepth * 0.5} ${cubeWidth},${cubeHeight}`)
        .attr('fill', d3.color(field.color)!.darker(0.3).toString())
        .attr('stroke', isSelected ? '#1E293B' : '#94A3B8')
        .attr('stroke-width', isSelected ? 2 : 0.5);

      // Field name label
      cube.append('text')
        .attr('x', cubeWidth / 2)
        .attr('y', cubeHeight / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#FFFFFF')
        .attr('font-size', '16px')
        .attr('font-weight', '700')
        .attr('font-family', 'Monaco, Menlo, monospace')
        .text(field.name);

      // Size label
      cube.append('text')
        .attr('x', cubeWidth / 2)
        .attr('y', cubeHeight / 2 + 15)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'rgba(255,255,255,0.8)')
        .attr('font-size', '12px')
        .attr('font-family', 'Monaco, Menlo, monospace')
        .text(field.size);
    });

    // Animated connection lines
    const lineGroup = svg.append('g')
      .attr('class', 'connection-lines');

    for (let i = 0; i < 2; i++) {
      const x1 = centerX - 200 + i * spacing + 100;
      const x2 = centerX - 200 + (i + 1) * spacing;

      lineGroup.append('line')
        .attr('x1', x1)
        .attr('y1', centerY + 40)
        .attr('x2', x2)
        .attr('y2', centerY + 40)
        .attr('stroke', '#94A3B8')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.6);
    }

    // Size indicator
    svg.append('text')
      .attr('x', centerX)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text('点击方块查看详细说明 | Header 总大小: 12字节');

    // Animate on selection
    if (selectedField) {
      const idx = headerFields.findIndex(f => f.name === selectedField.name);
      d3.select(`.cube-${idx}`)
        .transition()
        .duration(300)
        .attr('transform', `translate(${idx * spacing}, -30)`);
    }

  }, [selectedField, animationStep]);

  return (
    <div className="header-fields-interactive">
      <h3 className="viz-title">Header 字段 3D 结构图</h3>
      <div className="viz-container">
        <svg ref={svgRef} width="800" height="400" viewBox="0 0 800 400" />
      </div>
      {selectedField && (
        <div className="field-detail-panel" style={{ borderLeftColor: selectedField.color }}>
          <div className="detail-header">
            <span className="detail-name">{selectedField.name}</span>
            <span className="detail-type">{selectedField.type} ({selectedField.size})</span>
          </div>
          <p className="detail-desc">{selectedField.description}</p>
          <div className="detail-usage">
            <strong>用途:</strong>
            <ul>
              {selectedField.usage.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </div>
          <div className="detail-example">
            <strong>示例:</strong>
            <code>{selectedField.example}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderFieldsInteractive;
