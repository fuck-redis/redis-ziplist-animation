import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

const colors = {
  background: '#F8FAFC',
  header: '#3B82F6',
  zltail: '#06B6D4',
  entry: '#10B981',
  tail: '#F59E0B',
  text: '#1E293B',
  textMuted: '#64748B',
  arrow: '#EF4444',
};

export const ZltailO1Animation: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const duration = 240; // 8 seconds at 30fps
  const loopedFrame = frame % duration;

  // Timeline:
  // 0-30: Title appears
  // 30-90: Header appears with zltail highlighted
  // 90-150: Arrow animation jumps from zltail to tail entry
  // 150-210: Explanation of O(1) benefit
  // 210-240: Summary

  const titleOpacity = interpolate(loopedFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const headerOpacity = interpolate(loopedFrame, [30, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const zltailHighlight = interpolate(loopedFrame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Arrow appears and jumps
  const arrowAppear = interpolate(loopedFrame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrowJump = interpolate(loopedFrame, [110, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tail entry appears
  const tailAppear = interpolate(loopedFrame, [120, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const explanationOpacity = interpolate(loopedFrame, [150, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const summaryOpacity = interpolate(loopedFrame, [200, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Arrow offset for "jump" effect
  const arrowOffsetY = arrowJump * 40;
  const arrowOffsetX = arrowJump * 20;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, padding: 40 }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <div style={{
          fontSize: 42,
          fontWeight: 700,
          color: colors.text,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          zltail 实现 O(1) 尾部访问
        </div>
        <div style={{
          fontSize: 18,
          color: colors.textMuted,
          marginTop: 6,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          直接偏移定位，无需遍历整个列表
        </div>
      </div>

      {/* Header Box */}
      <div style={{
        position: 'absolute',
        top: 140,
        left: '50%',
        transform: `translateX(-50%) translateY(${(1 - headerOpacity) * -30}px)`,
        opacity: headerOpacity,
      }}>
        <div style={{
          backgroundColor: colors.header,
          borderRadius: 12,
          padding: '20px 40px',
          display: 'flex',
          gap: 30,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              marginBottom: 4,
            }}>
              zlbytes
            </div>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              00001234
            </div>
          </div>

          {/* zltail - highlighted */}
          <div style={{
            textAlign: 'center',
            backgroundColor: zltailHighlight > 0 ? `${colors.zltail}${Math.floor(zltailHighlight * 80).toString(16).padStart(2, '0')}` : 'transparent',
            borderRadius: 8,
            padding: '8px 16px',
            transform: `scale(${1 + zltailHighlight * 0.1})`,
            boxShadow: zltailHighlight > 0 ? `0 0 20px ${colors.zltail}80` : 'none',
          }}>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              marginBottom: 4,
            }}>
              zltail
            </div>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              00000050
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              marginBottom: 4,
            }}>
              zllen
            </div>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              0005
            </div>
          </div>
        </div>

        {/* Label */}
        <div style={{
          textAlign: 'center',
          marginTop: 12,
          color: colors.header,
          fontSize: 16,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontWeight: 600,
        }}>
          Header (12 bytes)
        </div>
      </div>

      {/* Arrow from zltail to tail */}
      <div style={{
        position: 'absolute',
        top: 280,
        left: '50%',
        transform: `translateX(-50%) translate(${-arrowOffsetX}px, ${arrowOffsetY}px)`,
        opacity: arrowAppear,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: 4,
          height: 60,
          backgroundColor: colors.arrow,
          borderRadius: 2,
        }} />
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: `16px solid ${colors.arrow}`,
        }} />
        <div style={{
          fontSize: 12,
          color: colors.arrow,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          marginTop: 8,
          fontWeight: 600,
        }}>
          offset: 0x50
        </div>
      </div>

      {/* Tail Entry */}
      <div style={{
        position: 'absolute',
        top: 360,
        left: '50%',
        transform: `translateX(-50%) translateY(${(1 - tailAppear) * 30}px)`,
        opacity: tailAppear,
      }}>
        <div style={{
          backgroundColor: colors.tail,
          borderRadius: 12,
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          boxShadow: `0 4px 20px ${colors.tail}40`,
        }}>
          <div>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              Entry 4 (Tail)
            </div>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              "World"
            </div>
          </div>
          <div style={{
            width: 4,
            height: 40,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: 2,
          }} />
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            prevlen: 15
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div style={{
        position: 'absolute',
        bottom: 160,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: explanationOpacity,
      }}>
        <div style={{
          backgroundColor: `${colors.entry}15`,
          border: `2px solid ${colors.entry}`,
          borderRadius: 12,
          padding: '20px 40px',
          maxWidth: 600,
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.entry,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            marginBottom: 8,
          }}>
            O(1) 复杂度
          </div>
          <div style={{
            fontSize: 15,
            color: colors.text,
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.6,
          }}>
            zltail 字段存储尾节点的偏移量，直接通过内存地址计算
            <br />
            <span style={{ color: colors.textMuted }}>
              ，无需像双向链表那样从头遍历
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: summaryOpacity,
      }}>
        <div style={{
          backgroundColor: colors.header,
          color: '#FFFFFF',
          padding: '12px 32px',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          传统双向链表: O(n) | ZipList with zltail: O(1)
        </div>
      </div>
    </AbsoluteFill>
  );
};
