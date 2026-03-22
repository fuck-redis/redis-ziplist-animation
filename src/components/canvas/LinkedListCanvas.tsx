import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { DemoStep, VisualNode } from '@/types/demo';
import './LinkedListCanvas.css';

interface LinkedListCanvasProps {
  step: DemoStep;
  stepIndex: number;
  stepCount: number;
}

function nodeMap(nodes: VisualNode[]): Record<string, VisualNode> {
  return Object.fromEntries(nodes.map((n) => [n.id, n]));
}

function curvePath(from: VisualNode, to: VisualNode): string {
  const sx = from.x + 35;
  const sy = from.y;
  const tx = to.x - 35;
  const ty = to.y;
  const delta = Math.max(32, Math.abs(tx - sx) * 0.4);
  return 'M ' + sx + ' ' + sy + ' C ' + (sx + delta) + ' ' + sy + ', ' + (tx - delta) + ' ' + ty + ', ' + tx + ' ' + ty;
}

function flowPath(from: VisualNode, to: VisualNode): string {
  const sx = from.x;
  const sy = from.y - 42;
  const tx = to.x;
  const ty = to.y - 42;
  return 'M ' + sx + ' ' + sy + ' L ' + tx + ' ' + ty;
}

function LinkedListCanvas({ step, stepIndex, stepCount }: LinkedListCanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const contentRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const centeredRef = useRef(false);

  const map = useMemo(() => nodeMap(step.nodes), [step.nodes]);

  useEffect(() => {
    if (!svgRef.current || !contentRef.current) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const content = d3.select(contentRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        content.attr('transform', event.transform.toString());
      });

    zoomRef.current = zoom;
    svg.call(zoom);
    svg.on('dblclick.zoom', null);

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !zoomRef.current || centeredRef.current) {
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const listCenterX = step.nodes.length > 0 ? (step.nodes[0].x + step.nodes[step.nodes.length - 1].x) / 2 : 260;
    const tx = rect.width / 2 - listCenterX;
    const ty = Math.max(40, rect.height / 2 - 180);
    const transform = d3.zoomIdentity.translate(tx, ty).scale(1);

    const zoomBehavior = zoomRef.current;
    if (!zoomBehavior) {
      return;
    }
    d3.select(svgRef.current).call(zoomBehavior.transform, transform);
    centeredRef.current = true;
  }, [step.nodes]);

  return (
    <section className="canvas-panel">
      <div className="canvas-header">
        <div>
          <h2>{step.title}</h2>
          <p>{step.description}</p>
        </div>
        <div className="step-badge">
          Step {stepIndex + 1} / {stepCount}
        </div>
      </div>

      <div className="canvas-body">
        <svg ref={svgRef} className="ll-svg">
          <defs>
            <marker id="arrow-edge" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#2563eb" />
            </marker>
            <marker id="arrow-flow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#ea580c" />
            </marker>
          </defs>

          <g ref={contentRef}>
            {step.edges.map((edge) => {
              const from = map[edge.from];
              const to = map[edge.to];
              if (!from || !to) {
                return null;
              }
              return (
                <g key={edge.from + '-' + edge.to}>
                  <path
                    d={curvePath(from, to)}
                    className={edge.isRewired ? 'edge-path rewired' : 'edge-path'}
                    markerEnd="url(#arrow-edge)"
                  />
                  <text x={(from.x + to.x) / 2} y={from.y - 16} className="edge-text">
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {step.dataFlows.map((flow, idx) => {
              if (!flow.fromId || !flow.toId) {
                return null;
              }
              const from = map[flow.fromId];
              const to = map[flow.toId];
              if (!from || !to) {
                return null;
              }
              return (
                <g key={flow.label + '-' + String(idx)}>
                  <path d={flowPath(from, to)} className="flow-path" markerEnd="url(#arrow-flow)" />
                  <text x={(from.x + to.x) / 2} y={from.y - 52} className="flow-text">
                    {flow.label}
                  </text>
                </g>
              );
            })}

            {step.nodes.map((node) => (
              <g key={node.id} transform={'translate(' + String(node.x) + ',' + String(node.y) + ')'}>
                <circle className={node.isNull ? 'll-node null-node' : node.isActive ? 'll-node active-node' : 'll-node'} r="34" />
                <text className="node-value" textAnchor="middle" dy="6">
                  {node.value}
                </text>
                <text className="node-id" textAnchor="middle" y="54">
                  {node.id}
                </text>
              </g>
            ))}

            {step.pointers.map((pointer) => {
              if (!pointer.targetId) {
                return null;
              }
              const target = map[pointer.targetId];
              if (!target) {
                return null;
              }
              return (
                <g key={pointer.name}>
                  <line
                    x1={target.x}
                    y1={target.y - 78}
                    x2={target.x}
                    y2={target.y - 40}
                    stroke={pointer.color}
                    strokeWidth="2.4"
                    markerEnd="url(#arrow-edge)"
                  />
                  <text x={target.x} y={target.y - 86} className="pointer-text" fill={pointer.color}>
                    {pointer.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {step.stackFrames.length > 0 && (
          <aside className="stack-panel">
            <h4>执行上下文</h4>
            <div className="stack-list">
              {step.stackFrames.map((frame) => (
                <div key={frame.id} className={'stack-frame ' + frame.state}>
                  <div className="frame-title">{frame.title}</div>
                  <div className="frame-locals">
                    {Object.entries(frame.locals).map(([k, v]) => (
                      <span key={k}>
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

export default LinkedListCanvas;
