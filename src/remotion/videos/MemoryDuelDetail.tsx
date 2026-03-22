import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

const colors = {
  background: '#F8FAFC',
  ziplist: '#3B82F6',
  linkedlist: '#64748B',
  ziplistLight: '#60A5FA',
  linkedlistLight: '#94A3B8',
  accent: '#F59E0B',
  success: '#10B981',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
};

const DATA = [1, 2, 3, 4, 5];

export const MemoryDuelDetail: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const duration = 360; // 12 seconds at 30fps
  const loopedFrame = frame % duration;

  // Timeline:
  // 0-30: Title
  // 30-150: ZipList side animation
  // 150-270: LinkedList side animation
  // 270-330: Comparison animation
  // 330-360: Final summary

  const titleOpacity = interpolate(loopedFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ZipList entries appear
  const getZipAppear = (idx: number) => {
    const startFrame = 30 + idx * 24;
    return interpolate(loopedFrame, [startFrame, startFrame + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };

  // LinkedList nodes appear
  const getLinkedAppear = (idx: number) => {
    const startFrame = 150 + idx * 24;
    return interpolate(loopedFrame, [startFrame, startFrame + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };

  // Comparison phase
  const compareOpacity = interpolate(loopedFrame, [270, 300], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Memory values
  const ziplistMemory = 32; // 12 header + 5*3 entry + 2 endmarker + overhead
  const linkedlistMemory = 160; // 5 nodes * 32 bytes each

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 25,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <div style={{
          fontSize: 40,
          fontWeight: 700,
          color: colors.text,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          内存布局对比
        </div>
        <div style={{
          fontSize: 18,
          color: colors.textMuted,
          marginTop: 4,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          存储 [1, 2, 3, 4, 5] 的内存占用对比
        </div>
      </div>

      {/* Left: ZipList */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 40,
        width: 360,
      }}>
        <div style={{
          fontSize: 22,
          fontWeight: 700,
          color: colors.ziplist,
          marginBottom: 6,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          ZipList
        </div>
        <div style={{
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 20,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          连续内存布局
        </div>

        {/* Header */}
        <div style={{
          backgroundColor: colors.ziplist,
          borderRadius: 8,
          padding: '14px 20px',
          marginBottom: 10,
          opacity: getZipAppear(0),
          transform: `translateY(${(1 - getZipAppear(0)) * 15}px)`,
        }}>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            marginBottom: 4,
          }}>
            Header (12B)
          </div>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#FFFFFF',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            zlbytes | zltail | zllen
          </div>
        </div>

        {/* Entries */}
        {DATA.map((val, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: colors.ziplist,
              borderRadius: 6,
              padding: '10px 16px',
              marginBottom: 6,
              opacity: getZipAppear(idx),
              transform: `translateY(${(1 - getZipAppear(idx)) * 15}px)`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.6)',
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
                {val}
              </div>
            </div>
            <div style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              textAlign: 'right',
            }}>
              prev | enc | val
              <br />
              ~4B
            </div>
          </div>
        ))}

        {/* End Marker */}
        <div style={{
          backgroundColor: colors.accent,
          borderRadius: 6,
          padding: '8px 16px',
          marginTop: 4,
          opacity: getZipAppear(4),
          transform: `translateY(${(1 - getZipAppear(4)) * 15}px)`,
        }}>
          <div style={{
            fontSize: 11,
            color: '#FFFFFF',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            End Marker (1B)
          </div>
        </div>

        {/* Total */}
        <div style={{
          marginTop: 16,
          padding: '16px 20px',
          backgroundColor: colors.success,
          borderRadius: 8,
          opacity: getZipAppear(4),
          transform: `translateY(${(1 - getZipAppear(4)) * 15}px)`,
        }}>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            总内存
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            {ziplistMemory} bytes
          </div>
        </div>

        {/* Breakdown */}
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          backgroundColor: colors.border,
          borderRadius: 6,
          fontSize: 11,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          color: colors.textMuted,
          opacity: getZipAppear(4),
        }}>
          <div>Header: 12B</div>
          <div>5 entries: ~20B</div>
          <div>End marker: 1B</div>
        </div>
      </div>

      {/* Right: LinkedList */}
      <div style={{
        position: 'absolute',
        top: 100,
        right: 40,
        width: 360,
      }}>
        <div style={{
          fontSize: 22,
          fontWeight: 700,
          color: colors.linkedlist,
          marginBottom: 6,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          LinkedList
        </div>
        <div style={{
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 20,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          分散内存 + 指针开销
        </div>

        {/* LinkedList Nodes */}
        {DATA.map((val, idx) => (
          <div
            key={idx}
            style={{
              opacity: getLinkedAppear(idx),
              transform: `translateY(${(1 - getLinkedAppear(idx)) * 15}px)`,
              marginBottom: 8,
            }}
          >
            {/* Node */}
            <div style={{
              backgroundColor: colors.linkedlist,
              borderRadius: 8,
              padding: '12px 16px',
            }}>
              <div style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'JetBrains Mono, Consolas, monospace',
              }}>
                Node {idx} (32B)
              </div>
              <div style={{
                display: 'flex',
                gap: 8,
                marginTop: 6,
              }}>
                <div style={{
                  backgroundColor: colors.linkedlistLight,
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 9,
                  color: '#FFFFFF',
                  fontFamily: 'JetBrains Mono, Consolas, monospace',
                }}>
                  prev*
                </div>
                <div style={{
                  backgroundColor: colors.linkedlistLight,
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: 'JetBrains Mono, Consolas, monospace',
                }}>
                  {val}
                </div>
                <div style={{
                  backgroundColor: colors.linkedlistLight,
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 9,
                  color: '#FFFFFF',
                  fontFamily: 'JetBrains Mono, Consolas, monospace',
                }}>
                  next*
                </div>
              </div>
            </div>

            {/* Pointer arrow */}
            {idx < DATA.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 20,
                gap: 6,
              }}>
                <div style={{
                  width: 2,
                  height: 16,
                  backgroundColor: colors.linkedlist,
                }} />
                <div style={{
                  fontSize: 9,
                  color: colors.textMuted,
                  fontFamily: 'JetBrains Mono, Consolas, monospace',
                }}>
                  next ptr (8B)
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Total */}
        <div style={{
          marginTop: 16,
          padding: '16px 20px',
          backgroundColor: colors.linkedlist,
          borderRadius: 8,
          opacity: getLinkedAppear(4),
          transform: `translateY(${(1 - getLinkedAppear(4)) * 15}px)`,
        }}>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            总内存 (32B x 5)
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            {linkedlistMemory} bytes
          </div>
        </div>

        {/* Breakdown */}
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          backgroundColor: colors.border,
          borderRadius: 6,
          fontSize: 11,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          color: colors.textMuted,
          opacity: getLinkedAppear(4),
        }}>
          <div>prev (8B) + next (8B)</div>
          <div>+ value (8B) + ptr (8B)</div>
        </div>
      </div>

      {/* Center Comparison */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        opacity: compareOpacity,
      }}>
        <div style={{
          fontSize: 14,
          color: colors.textMuted,
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: 8,
        }}>
          内存节省
        </div>
        <div style={{
          fontSize: 56,
          fontWeight: 700,
          color: colors.success,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          {((1 - ziplistMemory / linkedlistMemory) * 100).toFixed(0)}%
        </div>
        <div style={{
          fontSize: 14,
          color: colors.textMuted,
          marginTop: 4,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          ZipList 效率
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: compareOpacity,
      }}>
        <div style={{
          display: 'inline-flex',
          gap: 20,
          backgroundColor: colors.border,
          padding: '12px 28px',
          borderRadius: 8,
        }}>
          <span style={{
            fontSize: 14,
            color: colors.textMuted,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            64-bit 指针架构假设
          </span>
          <span style={{
            fontSize: 14,
            color: colors.text,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            fontWeight: 600,
          }}>
            {ziplistMemory}B vs {linkedlistMemory}B
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
