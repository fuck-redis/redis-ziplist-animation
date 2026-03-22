import React, { useEffect, useState } from 'react';

const COLORS = {
  background: '#F8FAFC',
  text: '#1E293B',
  textMuted: '#64748B',
  primary: '#3B82F6',
  secondary: '#06B6D4',
  accent: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  nodeBg: '#8B5CF6',
  pointer: '#06B6D4',
};

const FRAME_DURATION = 300; // 10 seconds at 30fps

export const LinkedListScattered: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % FRAME_DURATION;

  // Animation phases (10 seconds = 300 frames at 30fps)
  // 0-60: Show scattered nodes in memory
  // 60-120: Show pointer connections
  // 120-180: Highlight traversal path
  // 180-240: Show cache miss visualization
  // 240-300: Reset

  const getPhase = () => {
    if (loopFrame < 60) return 0;
    if (loopFrame < 120) return 1;
    if (loopFrame < 180) return 2;
    if (loopFrame < 240) return 3;
    return 4;
  };

  const phase = getPhase();
  const showPointers = phase >= 1;
  const showTraversal = phase === 2;
  const showCacheMiss = phase === 3;

  // Scattered node positions (simulating memory addresses)
  const nodes = [
    { id: 0, x: 120, y: 180, addr: '0x1000', content: 'A' },
    { id: 1, x: 350, y: 280, addr: '0x2050', content: 'B' },
    { id: 2, x: 200, y: 350, addr: '0x1820', content: 'C' },
    { id: 3, x: 500, y: 200, addr: '0x3200', content: 'D' },
    { id: 4, x: 400, y: 380, addr: '0x2400', content: 'E' },
  ];

  const getTraverseNode = () => {
    if (!showTraversal) return -1;
    const cycle = (loopFrame - 120) % 40;
    return Math.floor(cycle / 8);
  };

  const traverseNode = getTraverseNode();

  return (
    <div style={{
      backgroundColor: COLORS.background,
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: COLORS.text,
        fontSize: 36,
        fontWeight: 700,
      }}>
        LinkedList Memory Layout
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 16,
      }}>
        节点分散在内存各处，通过指针连接
      </div>

      {/* Phase indicator */}
      <div style={{
        position: 'absolute',
        top: 120,
        right: 60,
        backgroundColor: COLORS.accent,
        color: 'white',
        padding: '6px 16px',
        borderRadius: 16,
        fontSize: 13,
        fontWeight: 600,
      }}>
        {phase === 0 && 'Scattered Nodes'}
        {phase === 1 && 'Pointer Connections'}
        {phase === 2 && 'Traversal Path'}
        {phase === 3 && 'Cache Misses'}
        {phase === 4 && 'Reset'}
      </div>

      {/* Memory area background */}
      <div style={{
        position: 'absolute',
        top: 150,
        left: 60,
        right: 60,
        bottom: 120,
        backgroundColor: '#1E293B10',
        borderRadius: 12,
        border: '2px dashed #CBD5E1',
      }}>
        {/* Memory address labels */}
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          color: COLORS.textMuted,
          fontSize: 10,
          fontFamily: 'monospace',
        }}>
          Memory Space
        </div>
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: COLORS.textMuted,
          fontSize: 10,
          fontFamily: 'monospace',
        }}>
          0x0000 - 0x4000
        </div>

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const isTraversing = showTraversal && traverseNode === idx;
          const isPast = showTraversal && traverseNode > idx;

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                opacity: isPast ? 0.4 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              {/* Node */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}>
                {/* Address */}
                <div style={{
                  padding: '2px 6px',
                  backgroundColor: COLORS.textMuted + '20',
                  borderRadius: 4,
                  fontSize: 9,
                  fontFamily: 'monospace',
                  color: COLORS.textMuted,
                }}>
                  {node.addr}
                </div>

                {/* Node box */}
                <div style={{
                  padding: '10px 16px',
                  backgroundColor: isTraversing ? COLORS.warning : COLORS.nodeBg,
                  borderRadius: 8,
                  boxShadow: isTraversing ? `0 0 20px ${COLORS.warning}60` : '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s',
                }}>
                  <div style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 700,
                  }}>
                    {node.content}
                  </div>
                </div>

                {/* Pointer to next */}
                {idx < nodes.length - 1 && showPointers && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: isTraversing ? COLORS.warning : COLORS.pointer,
                    fontSize: 10,
                    fontFamily: 'monospace',
                    transition: 'color 0.2s',
                  }}>
                    next →
                  </div>
                )}
              </div>

              {/* Pointer line to next node */}
              {idx < nodes.length - 1 && showPointers && (
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                >
                  <path
                    d={`M ${node.x + 30} ${node.y + 60}
                        Q ${node.x + 60} ${node.y + 100},
                          ${nodes[idx + 1].x} ${nodes[idx + 1].y + 20}`}
                    fill="none"
                    stroke={isTraversing ? COLORS.warning : COLORS.pointer}
                    strokeWidth="2"
                    strokeDasharray={showTraversal && (traverseNode === idx || traverseNode > idx) ? "5,5" : "none"}
                  />
                </svg>
              )}

              {/* Cache miss indicator */}
              {showCacheMiss && idx > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 24,
                  height: 24,
                  backgroundColor: COLORS.error,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                }}>
                  !
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cache miss info */}
      {showCacheMiss && (
        <div style={{
          position: 'absolute',
          top: 120,
          left: 60,
          backgroundColor: COLORS.error + '15',
          border: `2px solid ${COLORS.error}`,
          borderRadius: 8,
          padding: '8px 16px',
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.error,
          }}>
            Cache Miss!
          </div>
          <div style={{
            fontSize: 10,
            color: COLORS.error,
          }}>
            每个节点都在不同内存页
          </div>
        </div>
      )}

      {/* Info panel */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
      }}>
        {[
          { label: 'Scattered', desc: 'Nodes in random memory' },
          { label: 'Pointer Chain', desc: 'Next pointer connects nodes' },
          { label: 'Cache Miss', desc: 'Each access is slow' },
        ].map(item => (
          <div key={item.label} style={{
            backgroundColor: 'white',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{item.label}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
      }}>
        {[
          { color: COLORS.nodeBg, label: 'Node' },
          { color: COLORS.pointer, label: 'Pointer' },
          { color: COLORS.warning, label: 'Current' },
          { color: COLORS.error, label: 'Cache Miss' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: item.color,
              borderRadius: 3,
            }} />
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
