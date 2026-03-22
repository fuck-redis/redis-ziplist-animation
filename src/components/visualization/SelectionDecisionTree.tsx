import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import './SelectionDecisionTree.css';

interface DataStructureInfo {
  id: string;
  name: string;
  color: string;
  description: string;
  bestFor: string[];
  complexity: {
    access: string;
    search: string;
    insert: string;
    delete: string;
  };
}

const dataStructures: DataStructureInfo[] = [
  {
    id: 'ziplist',
    name: 'ZipList',
    color: '#3B82F6',
    description: 'Compact memory-efficient list for small datasets',
    bestFor: ['< 512 elements', '< 64B per element', 'Sequential access'],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' }
  },
  {
    id: 'quicklist',
    name: 'QuickList',
    color: '#06B6D4',
    description: 'Linked list of ziplists for larger datasets',
    bestFor: ['> 512 elements', 'Frequent head/tail ops', 'Large lists'],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)*', delete: 'O(1)*' }
  },
  {
    id: 'skiplist',
    name: 'SkipList',
    color: '#10B981',
    description: 'Sorted structure with O(log n) range operations',
    bestFor: ['Sorted data', 'Range queries', 'Leaderboards'],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' }
  },
  {
    id: 'hashtable',
    name: 'HashTable',
    color: '#EC4899',
    description: 'Key-value store with O(1) average access',
    bestFor: ['Key-value lookups', 'Large datasets', 'Counters'],
    complexity: { access: 'O(1)*', search: 'O(1)*', insert: 'O(1)*', delete: 'O(1)*' }
  }
];

interface DecisionNode {
  id: string;
  question: string;
  yes: string | DecisionNode | DataStructureInfo;
  no: string | DecisionNode | DataStructureInfo;
}

const decisionTree: DecisionNode = {
  id: 'root',
  question: 'Do you need sorted order?',
  yes: {
    id: 'sorted-check',
    name: 'Sorted',
    color: '#10B981',
    description: 'Use SkipList for sorted data with O(log n) operations'
  } as DataStructureInfo,
  no: {
    id: 'size-check',
    question: 'Is dataset small (< 512 items, < 64B each)?',
    yes: {
      id: 'sequential-check',
      question: 'Mostly sequential access?',
      yes: {
        id: 'ziplist',
        name: 'ZipList',
        color: '#3B82F6',
        description: 'Compact layout for small, frequently accessed data'
      } as DataStructureInfo,
      no: {
        id: 'hashtable',
        name: 'HashTable',
        color: '#EC4899',
        description: 'Fast O(1) key-value lookups for unstructured data'
      } as DataStructureInfo
    },
    no: {
      id: 'quicklist',
      name: 'QuickList',
      color: '#06B6D4',
      description: 'Linked list of ziplists for large lists with O(1) head/tail ops'
    } as DataStructureInfo
  }
};

export const SelectionDecisionTree: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedStructure, setSelectedStructure] = useState<DataStructureInfo | null>(null);
  const [currentNode, setCurrentNode] = useState<DecisionNode | null>(null);
  const [path, setPath] = useState<string[]>([]);

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (!currentNode) return;

    const next = answer === 'yes' ? currentNode.yes : currentNode.no;

    if (typeof next === 'object' && 'question' in next) {
      setPath([...path, currentNode.id, answer]);
      setCurrentNode(next);
    } else {
      setPath([...path, currentNode.id, answer]);
      setSelectedStructure(next as DataStructureInfo);
    }
  };

  const resetDecision = () => {
    setCurrentNode(null);
    setSelectedStructure(null);
    setPath([]);
    setCurrentNode(decisionTree);
  };

  useEffect(() => {
    setCurrentNode(decisionTree);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 700;
    const height = 450;

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    if (selectedStructure) {
      // Show result
      const resultGroup = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2 - 40})`);

      resultGroup.append('rect')
        .attr('x', -150)
        .attr('y', -60)
        .attr('width', 300)
        .attr('height', 160)
        .attr('rx', 12)
        .attr('fill', selectedStructure.color)
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .attr('opacity', 1);

      resultGroup.append('text')
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '22px')
        .attr('font-weight', '700')
        .attr('opacity', 0)
        .text(selectedStructure.name)
        .transition()
        .delay(200)
        .duration(300)
        .attr('opacity', 1);

      resultGroup.append('text')
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.9)')
        .attr('font-size', '12px')
        .attr('opacity', 0)
        .text(selectedStructure.description)
        .transition()
        .delay(300)
        .duration(300)
        .attr('opacity', 1);

      // Complexity badges
      const complexities = ['access', 'search', 'insert', 'delete'];
      complexities.forEach((op, i) => {
        const x = -120 + i * 80;
        resultGroup.append('rect')
          .attr('x', x)
          .attr('y', 45)
          .attr('width', 70)
          .attr('height', 35)
          .attr('rx', 4)
          .attr('fill', 'rgba(255,255,255,0.2)')
          .attr('opacity', 0)
          .transition()
          .delay(400 + i * 100)
          .duration(300)
          .attr('opacity', 1);

        resultGroup.append('text')
          .attr('x', x + 35)
          .attr('y', 58)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '10px')
          .attr('opacity', 0)
          .text(op.toUpperCase())
          .transition()
          .delay(400 + i * 100)
          .duration(300)
          .attr('opacity', 1);

        resultGroup.append('text')
          .attr('x', x + 35)
          .attr('y', 73)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .attr('opacity', 0)
          .text(selectedStructure.complexity[op as keyof typeof selectedStructure.complexity])
          .transition()
          .delay(450 + i * 100)
          .duration(300)
          .attr('opacity', 1);
      });

    } else if (currentNode) {
      // Draw question node
      const nodeX = width / 2;
      const nodeY = height / 2 - 20;

      const questionGroup = svg.append('g')
        .attr('transform', `translate(${nodeX}, ${nodeY})`);

      questionGroup.append('rect')
        .attr('x', -200)
        .attr('y', -50)
        .attr('width', 400)
        .attr('height', 100)
        .attr('rx', 10)
        .attr('fill', 'white')
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 3)
        .attr('opacity', 0)
        .attr('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))')
        .transition()
        .duration(400)
        .attr('opacity', 1);

      questionGroup.append('text')
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1E293B')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .attr('opacity', 0)
        .text(currentNode.question)
        .transition()
        .delay(200)
        .duration(300)
        .attr('opacity', 1);

      // Yes button
      questionGroup.append('rect')
        .attr('x', -180)
        .attr('y', 20)
        .attr('width', 80)
        .attr('height', 36)
        .attr('rx', 6)
        .attr('fill', '#10B981')
        .attr('opacity', 0)
        .style('cursor', 'pointer')
        .on('click', () => handleAnswer('yes'))
        .transition()
        .delay(300)
        .duration(300)
        .attr('opacity', 1);

      questionGroup.append('text')
        .attr('x', -140)
        .attr('y', 43)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('opacity', 0)
        .text('YES')
        .transition()
        .delay(400)
        .duration(300)
        .attr('opacity', 1);

      // No button
      questionGroup.append('rect')
        .attr('x', 100)
        .attr('y', 20)
        .attr('width', 80)
        .attr('height', 36)
        .attr('rx', 6)
        .attr('fill', '#EF4444')
        .attr('opacity', 0)
        .style('cursor', 'pointer')
        .on('click', () => handleAnswer('no'))
        .transition()
        .delay(300)
        .duration(300)
        .attr('opacity', 1);

      questionGroup.append('text')
        .attr('x', 140)
        .attr('y', 43)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('opacity', 0)
        .text('NO')
        .transition()
        .delay(400)
        .duration(300)
        .attr('opacity', 1);

      // Question mark icon
      questionGroup.append('text')
        .attr('y', -28)
        .attr('text-anchor', 'middle')
        .attr('fill', '#3B82F6')
        .attr('font-size', '24px')
        .attr('font-weight', '700')
        .text('?');
    }

  }, [currentNode, selectedStructure]);

  return (
    <div className="selection-decision-tree">
      <div className="tree-header">
        <h3>Data Structure Selection Guide</h3>
        <p className="tree-description">
          Answer questions to find the best Redis data structure for your use case
        </p>
      </div>

      <svg ref={svgRef} className="tree-svg" />

      {selectedStructure ? (
        <button className="reset-button" onClick={resetDecision}>
          Start Over
        </button>
      ) : (
        <div className="decision-path">
          <span className="path-label">Your choices:</span>
          <div className="path-steps">
            {path.map((step, i) => (
              <span key={i} className={`path-step ${i % 2 === 0 ? 'question' : step}`}>
                {i % 2 === 0 ? 'Q' : step.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="structure-legend">
        <h4>Available Structures</h4>
        <div className="legend-grid">
          {dataStructures.map(ds => (
            <div key={ds.id} className="legend-item">
              <span className="legend-color" style={{ background: ds.color }}></span>
              <span className="legend-name">{ds.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectionDecisionTree;
