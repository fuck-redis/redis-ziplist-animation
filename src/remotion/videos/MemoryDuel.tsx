import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

// Color palette - Bright flat design
const colors = {
  background: '#F8FAFC',
  ziplist: '#3B82F6',
  linkedlist: '#64748B',
  accent: '#F59E0B',
  success: '#10B981',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
};

// Entry data for ZipList: [1, 2, 3, 4, 5]
const ziplistEntries = [
  { value: '1', prevLen: 0 },
  { value: '2', prevLen: 1 },
  { value: '3', prevLen: 1 },
  { value: '4', prevLen: 1 },
  { value: '5', prevLen: 1 },
];

// Node data for LinkedList: [1, 2, 3, 4, 5]
const linkedlistNodes = [
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5' },
];

export const MemoryDuel: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  // Loop the animation
  const duration = 360; // 12 seconds at 30fps
  const loopedFrame = frame % duration;

  // Timeline:
  // 0-30: Title appears
  // 30-150: ZipList entries appear one by one
  // 150-270: LinkedList nodes appear one by one
  // 270-330: Percentage counter animates
  // 330-360: Final state with both totals

  const titleOpacity = interpolate(loopedFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ZipList animation (entries appear 30-150)
  const getZipEntryAppear = (idx: number) => {
    const startFrame = 30 + idx * 24;
    return interpolate(loopedFrame, [startFrame, startFrame + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };

  // LinkedList animation (nodes appear 150-270)
  const getLinkedNodeAppear = (idx: number) => {
    const startFrame = 150 + idx * 24;
    return interpolate(loopedFrame, [startFrame, startFrame + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };

  // Percentage counter (270-330)
  const percentageProgress = interpolate(loopedFrame, [270, 330], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const percentage = percentageProgress * 82.5;

  // ZipList total: ~28 bytes (12 header + ~3 bytes per entry * 5 + end marker)
  const ziplistTotal = 28;
  // LinkedList total: ~160 bytes (32 bytes per node * 5)
  const linkedlistTotal = 160;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
        transform: `scale(${0.8 + titleOpacity * 0.2})`,
      }}>
        <div style={{
          fontSize: 42,
          fontWeight: 700,
          color: colors.text,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          ZipList vs LinkedList
        </div>
        <div style={{
          fontSize: 24,
          fontWeight: 500,
          color: colors.textMuted,
          marginTop: 8,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          Memory Usage Comparison
        </div>
      </div>

      {/* Left Side - ZipList */}
      <div style={{
        position: 'absolute',
        top: 140,
        left: 60,
        width: 340,
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: colors.ziplist,
          marginBottom: 20,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          ZipList
        </div>
        <div style={{
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 16,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          Data: [1, 2, 3, 4, 5]
        </div>

        {/* Header Box */}
        <div style={{
          backgroundColor: colors.ziplist,
          borderRadius: 4,
          padding: '12px 16px',
          marginBottom: 12,
          opacity: getZipEntryAppear(0),
          transform: `translateY(${(1 - getZipEntryAppear(0)) * 20}px)`,
        }}>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            Header (12B)
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#FFFFFF',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            zlbytes | zltail | zllen
          </div>
        </div>

        {/* Entry Boxes */}
        {ziplistEntries.map((entry, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: colors.ziplist,
              borderRadius: 4,
              padding: '10px 16px',
              marginBottom: 8,
              opacity: getZipEntryAppear(idx),
              transform: `translateY(${(1 - getZipEntryAppear(idx)) * 20}px)`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'JetBrains Mono, Consolas, monospace',
              }}>
                Entry {idx}
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: 'JetBrains Mono, Consolas, monospace',
              }}>
                {entry.value}
              </div>
            </div>
            <div style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              ~3B
            </div>
          </div>
        ))}

        {/* End Marker */}
        <div style={{
          backgroundColor: colors.accent,
          borderRadius: 4,
          padding: '8px 16px',
          marginTop: 4,
          opacity: getZipEntryAppear(4),
          transform: `translateY(${(1 - getZipEntryAppear(4)) * 20}px)`,
        }}>
          <div style={{
            fontSize: 12,
            color: '#FFFFFF',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            End Marker (1B)
          </div>
        </div>

        {/* Total */}
        <div style={{
          marginTop: 20,
          padding: '16px 20px',
          backgroundColor: colors.success,
          borderRadius: 4,
          opacity: getZipEntryAppear(4),
          transform: `translateY(${(1 - getZipEntryAppear(4)) * 20}px)`,
        }}>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Total Memory
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            {ziplistTotal} bytes
          </div>
        </div>
      </div>

      {/* Center - Percentage Counter */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        textAlign: 'center',
        opacity: percentageProgress,
      }}>
        <div style={{
          fontSize: 14,
          color: colors.textMuted,
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: 8,
        }}>
          Memory Saved
        </div>
        <div style={{
          fontSize: 64,
          fontWeight: 700,
          color: colors.success,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          {percentage.toFixed(1)}%
        </div>
        <div style={{
          fontSize: 14,
          color: colors.textMuted,
          marginTop: 8,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          with ZipList
        </div>
      </div>

      {/* Right Side - LinkedList */}
      <div style={{
        position: 'absolute',
        top: 140,
        right: 60,
        width: 340,
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: colors.linkedlist,
          marginBottom: 20,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          LinkedList
        </div>
        <div style={{
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 16,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          Data: [1, 2, 3, 4, 5]
        </div>

        {/* LinkedList Nodes */}
        {linkedlistNodes.map((node, idx) => (
          <div
            key={idx}
            style={{
              opacity: getLinkedNodeAppear(idx),
              transform: `translateY(${(1 - getLinkedNodeAppear(idx)) * 20}px)`,
              marginBottom: 12,
            }}
          >
            {/* Node Box */}
            <div style={{
              backgroundColor: colors.linkedlist,
              borderRadius: 4,
              padding: '10px 16px',
            }}>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'JetBrains Mono, Consolas, monospace',
              }}>
                Node {idx}
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: 'JetBrains Mono, Consolas, monospace',
              }}>
                {node.value}
              </div>
            </div>

            {/* Pointer */}
            {idx < linkedlistNodes.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 16,
                gap: 8,
              }}>
                <div style={{
                  width: 2,
                  height: 20,
                  backgroundColor: colors.linkedlist,
                }} />
                <div style={{
                  fontSize: 10,
                  color: colors.textMuted,
                  fontFamily: 'JetBrains Mono, Consolas, monospace',
                }}>
                  next *
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Total */}
        <div style={{
          marginTop: 20,
          padding: '16px 20px',
          backgroundColor: colors.linkedlist,
          borderRadius: 4,
          opacity: getLinkedNodeAppear(4),
          transform: `translateY(${(1 - getLinkedNodeAppear(4)) * 20}px)`,
        }}>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Total Memory (32B x 5)
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            {linkedlistTotal} bytes
          </div>
        </div>

        {/* Breakdown */}
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          backgroundColor: colors.border,
          borderRadius: 4,
          opacity: getLinkedNodeAppear(4),
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontSize: 11,
          color: colors.textMuted,
        }}>
          <div>prev (8B) + next (8B)</div>
          <div>+ dataPtr (8B) + data (8B)</div>
        </div>
      </div>

      {/* VS Badge */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.15,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          VS
        </div>
      </div>

      {/* Bottom Label */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 14,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        64-bit pointer architecture assumed
      </div>
    </AbsoluteFill>
  );
};
