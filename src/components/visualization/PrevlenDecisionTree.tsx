import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './PrevlenDecisionTree.css';

interface DecisionResult {
  size: number;
  prevlenBytes: number;
  hexValue: string;
}

export const PrevlenDecisionTree: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [prevEntrySize, setPrevEntrySize] = useState(100);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentNode, setCurrentNode] = useState<string | null>(null);

  const decisionResult: DecisionResult = prevEntrySize < 254
    ? {
        size: prevEntrySize,
        prevlenBytes: 1,
        hexValue: `[0x${prevEntrySize.toString(16).toUpperCase().padStart(2, '0')}]`
      }
    : {
        size: prevEntrySize,
        prevlenBytes: 5,
        hexValue: `[0xFE]${Array.from(
          { length: 4 },
          (_, i) => `[0x${((prevEntrySize >> (i * 8)) & 0xFF).toString(16).toUpperCase().padStart(2, '0')}]`
        ).join('')}`
      };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 700;

    // Create gradient
    const defs = svg.append('defs');

    const blueGradient = defs.append('linearGradient')
      .attr('id', 'decisionBlue')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    blueGradient.append('stop').attr('offset', '0%').attr('stop-color', '#3B82F6');
    blueGradient.append('stop').attr('offset', '100%').attr('stop-color', '#2563EB');

    const greenGradient = defs.append('linearGradient')
      .attr('id', 'decisionGreen')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    greenGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10B981');
    greenGradient.append('stop').attr('offset', '100%').attr('stop-color', '#059669');

    const orangeGradient = defs.append('linearGradient')
      .attr('id', 'decisionOrange')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    orangeGradient.append('stop').attr('offset', '0%').attr('stop-color', '#F59E0B');
    orangeGradient.append('stop').attr('offset', '100%').attr('stop-color', '#D97706');

    // Tree structure
    const treeData = {
      name: '开始',
      type: 'start',
      children: [
        {
          name: `前节点大小\n< 254?`,
          type: 'decision',
          children: [
            {
              name: '使用1字节',
              type: 'result',
              value: 'small'
            },
            {
              name: '使用5字节',
              type: 'result',
              value: 'large'
            }
          ]
        }
      ]
    };

    const treeLayout = d3.tree<typeof treeData>()
      .size([width - 100, 280]);

    const root = d3.hierarchy(treeData);
    const treeNodes = treeLayout(root);

    // Draw links
    svg.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(treeNodes.links())
      .enter()
      .append('path')
      .attr('d', d3.linkVertical<d3.HierarchyPointLink<typeof treeData>, d3.HierarchyPointNode<typeof treeData>>()
        .x(d => d.x + 50)
        .y(d => d.y + 60))
      .attr('fill', 'none')
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 2);

    // Draw nodes
    const nodes = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(treeNodes.descendants())
      .enter()
      .append('g')
      .attr('class', d => `node node-${d.data.type}`)
      .attr('transform', d => `translate(${d.x + 50}, ${d.y + 60})`);

    // Start node
    nodes.filter(d => d.data.type === 'start')
      .append('circle')
      .attr('r', 30)
      .attr('fill', 'url(#decisionBlue)')
      .attr('stroke', '#1E293B')
      .attr('stroke-width', 2);

    nodes.filter(d => d.data.type === 'start')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .text('开始');

    // Decision node (diamond shape)
    nodes.filter(d => d.data.type === 'decision')
      .each(function(d) {
        const g = d3.select(this);
        const isActive = showAnimation && currentNode === 'decision';

        // Diamond shape
        g.append('polygon')
          .attr('points', '0,-35 50,0 0,35 -50,0')
          .attr('fill', isActive ? '#FEF3C7' : 'url(#decisionOrange)')
          .attr('stroke', isActive ? '#F59E0B' : '#1E293B')
          .attr('stroke-width', isActive ? 3 : 2)
          .style('filter', isActive ? 'drop-shadow(0 4px 8px rgba(245,158,11,0.4))' : 'none');

        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#1E293B')
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .selectAll('tspan')
          .data(d.data.name.split('\n'))
          .enter()
          .append('tspan')
          .attr('x', 0)
          .attr('dy', (_d, i) => i === 0 ? '-0.3em' : '1.2em')
          .text(text => text);
      });

    // Result nodes
    nodes.filter(d => d.data.type === 'result')
      .each(function(d) {
        const g = d3.select(this);
        const nodeValue = (d.data as { value?: string }).value;
        const isSmall = nodeValue === 'small';
        const isActive = showAnimation && currentNode === nodeValue;

        g.append('rect')
          .attr('x', -55)
          .attr('y', -25)
          .attr('width', 110)
          .attr('height', 50)
          .attr('rx', 8)
          .attr('fill', isActive ? (isSmall ? '#D1FAE5' : '#FEE2E2') : 'url(#decisionGreen)')
          .attr('stroke', isActive ? (isSmall ? '#10B981' : '#EF4444') : '#1E293B')
          .attr('stroke-width', isActive ? 3 : 2);

        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', isSmall ? '#065F46' : '#991B1B')
          .attr('font-size', '13px')
          .attr('font-weight', '700')
          .text(d.data.name);
      });

    // Threshold indicator on the decision node
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text('prevlen 决策树 (根据前一个 entry 的大小)');

    // Animate path
    if (showAnimation) {
      const path = svg.append('path')
        .attr('class', 'animated-path')
        .attr('fill', 'none')
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 4)
        .attr('stroke-dasharray', '10,5');

      const pathData = prevEntrySize < 254
        ? 'M 350,80 L 350,150 L 200,220 L 200,290'
        : 'M 350,80 L 350,150 L 500,220 L 500,290';

      path
        .attr('d', pathData)
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .attr('opacity', 1);

      setTimeout(() => setShowAnimation(false), 1000);
    }

  }, [prevEntrySize, showAnimation, currentNode]);

  const handleTest = () => {
    setShowAnimation(true);
    setCurrentNode('decision');
    setTimeout(() => {
      setCurrentNode(prevEntrySize < 254 ? 'small' : 'large');
    }, 400);
  };

  return (
    <div className="prevlen-decision-tree">
      <h3 className="viz-title">prevlen 决策树</h3>
      <p className="viz-subtitle">根据前一个 entry 的大小判断 prevlen 占用字节数</p>

      <div className="input-section">
        <label>
          前一个 entry 的大小:
          <input
            type="range"
            min="1"
            max="500"
            value={prevEntrySize}
            onChange={e => setPrevEntrySize(parseInt(e.target.value))}
          />
          <span className="value-display">{prevEntrySize} 字节</span>
        </label>
        <button className="test-btn" onClick={handleTest}>
          测试决策流程
        </button>
      </div>

      <div className="viz-container">
        <svg ref={svgRef} width="700" height="400" viewBox="0 0 700 400" />
      </div>

      <div className="result-panel">
        <div className="result-header">
          <span className="result-label">决策结果</span>
          <span className={`result-badge ${prevEntrySize < 254 ? 'small' : 'large'}`}>
            {prevEntrySize < 254 ? '1 字节' : '5 字节'}
          </span>
        </div>
        <div className="result-detail">
          <div className="result-item">
            <span className="item-label">输入大小:</span>
            <span className="item-value">{prevEntrySize} 字节</span>
          </div>
          <div className="result-item">
            <span className="item-label">prevlen 占用:</span>
            <span className="item-value">{decisionResult.prevlenBytes} 字节</span>
          </div>
          <div className="result-item">
            <span className="item-label">十六进制:</span>
            <code className="item-hex">{decisionResult.hexValue}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevlenDecisionTree;
