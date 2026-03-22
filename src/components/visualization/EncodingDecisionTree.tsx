import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './EncodingDecisionTree.css';

interface TreeNode {
  id: string;
  label: string;
  description?: string;
  children?: TreeNode[];
  encoding?: string;
  bytes?: number;
  color?: string;
}

const decisionTreeData: TreeNode = {
  id: 'root',
  label: 'Input Value',
  description: 'Start encoding decision',
  color: '#3B82F6',
  children: [
    {
      id: 'type-check',
      label: 'Is Numeric?',
      description: 'Check value type',
      color: '#06B6D4',
      children: [
        {
          id: 'int-check',
          label: 'Integer Range',
          description: 'Determine integer size',
          color: '#06B6D4',
          children: [
            {
              id: 'int8',
              label: '-128 to 127',
              description: '8-bit signed integer',
              encoding: 'INT8',
              bytes: 1,
              color: '#10B981'
            },
            {
              id: 'int16',
              label: '-32768 to 32767',
              description: '16-bit signed integer',
              encoding: 'INT16',
              bytes: 2,
              color: '#10B981'
            },
            {
              id: 'int24',
              label: '-8388608 to 8388607',
              description: '24-bit signed integer',
              encoding: 'INT24',
              bytes: 3,
              color: '#10B981'
            },
            {
              id: 'int32',
              label: '-2147483648 to 2147483647',
              description: '32-bit signed integer',
              encoding: 'INT32',
              bytes: 4,
              color: '#10B981'
            },
            {
              id: 'int64',
              label: 'Beyond 32-bit',
              description: '64-bit signed integer',
              encoding: 'INT64',
              bytes: 5,
              color: '#10B981'
            }
          ]
        }
      ]
    },
    {
      id: 'string-check',
      label: 'String Length',
      description: 'Determine string encoding',
      color: '#06B6D4',
      children: [
        {
          id: 'str-6bit',
          label: '0-63 bytes',
          description: '6-bit length encoding',
          encoding: 'STR_6BIT',
          bytes: 1,
          color: '#F59E0B'
        },
        {
          id: 'str-14bit',
          label: '64-16383 bytes',
          description: '14-bit length encoding',
          encoding: 'STR_14BIT',
          bytes: 2,
          color: '#F59E0B'
        },
        {
          id: 'str-32bit',
          label: '> 16383 bytes',
          description: '32-bit length encoding',
          encoding: 'STR_32BIT',
          bytes: 5,
          color: '#F59E0B'
        }
      ]
    }
  ]
};

export const EncodingDecisionTree: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 700;
    const height = 500;
    const margin = { top: 30, right: 40, bottom: 30, left: 40 };

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Create tree layout
    const treeLayout = d3.tree<TreeNode>()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

    // Create hierarchy
    const root = d3.hierarchy(decisionTreeData);
    const treeData = treeLayout(root);

    // Create container group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add links
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 2)
      .attr('d', d3.linkVertical<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.x)
        .y(d => d.y) as any)
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .delay((_, i) => i * 100)
      .attr('opacity', 1);

    // Create node groups
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        if (d.data.children) return;
        setSelectedNode(d.data);
      })
      .on('mouseover', (_event, d) => {
        setHoveredNode(d.data);
      })
      .on('mouseout', () => {
        setHoveredNode(null);
      });

    // Add node circles
    nodes.append('circle')
      .attr('r', 0)
      .attr('fill', d => d.data.color || '#3B82F6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .transition()
      .duration(500)
      .delay((_, i) => i * 80)
      .attr('r', d => d.data.children ? 22 : 18);

    // Add node labels
    nodes.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', d => d.data.children ? '10px' : '9px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(d => {
        if (d.data.id === 'root') return '?';
        if (d.data.children) return d.data.label.charAt(0);
        if (d.data.encoding?.startsWith('INT')) return d.data.encoding.replace('INT', '');
        if (d.data.encoding?.startsWith('STR')) return d.data.encoding.replace('STR_', '');
        return d.data.label.substring(0, 2);
      })
      .transition()
      .duration(400)
      .delay((_, i) => i * 80 + 300)
      .attr('opacity', 1);

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .text('ZipList Encoding Decision Tree');

  }, []);

  return (
    <div className="encoding-decision-tree">
      <div className="tree-header">
        <h3>Encoding Type Selection</h3>
        <p className="tree-description">
          Click on leaf nodes to see encoding details
        </p>
      </div>

      <svg ref={svgRef} className="tree-svg" />

      {(selectedNode || hoveredNode) && (
        <div className="encoding-details">
          <h4>{selectedNode?.label || hoveredNode?.label}</h4>
          {selectedNode?.encoding && (
            <>
              <div className="detail-row">
                <span className="detail-label">Encoding:</span>
                <span className="detail-value encoding-badge">{selectedNode.encoding}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Bytes:</span>
                <span className="detail-value">{selectedNode.bytes}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedNode.description}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EncodingDecisionTree;
