import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

const colors = {
  background: '#F8FAFC',
  small: '#10B981',    // Small prevlen (1 byte)
  large: '#EF4444',     // Large prevlen (5 bytes)
  entry: '#3B82F6',
  warning: '#F59E0B',
  text: '#1E293B',
  textMuted: '#64748B',
  encoding: '#06B6D4',
};

const BYTE_SIZE = 40;

export const PrevlenExpansionDetail: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const duration = 360; // 12 seconds at 30fps
  const loopedFrame = frame % duration;

  // Timeline:
  // 0-30: Title
  // 30-90: Show 1-byte prevlen state
  // 90-150: Show expansion trigger
  // 150-240: Show expansion animation
  // 240-330: Show cascading effect
  // 330-360: Summary

  const titleOpacity = interpolate(loopedFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 1: Small state (1-byte prevlen)
  const smallStateOpacity = interpolate(loopedFrame, [30, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 2: Expansion trigger
  const triggerOpacity = interpolate(loopedFrame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 3: Expansion animation
  const expansionProgress = interpolate(loopedFrame, [150, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 4: Cascading
  const cascadeOpacity = interpolate(loopedFrame, [240, 270], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const summaryOpacity = interpolate(loopedFrame, [320, 350], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Render a byte box
  const renderByte = (color: string, label: string, index: number, opacity: number, scale: number = 1) => (
    <div
      key={index}
      style={{
        width: BYTE_SIZE * scale,
        height: BYTE_SIZE,
        backgroundColor: color,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
        boxShadow: `0 2px 8px ${color}40`,
      }}
    >
      <span style={{
        color: colors.background,
        fontSize: 10,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
        fontWeight: 600,
      }}>
        {label}
      </span>
    </div>
  );

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
          fontSize: 40,
          fontWeight: 700,
          color: colors.text,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          prevlen 字段扩展过程
        </div>
        <div style={{
          fontSize: 18,
          color: colors.textMuted,
          marginTop: 6,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          从 1 字节扩展到 5 字节的连锁反应
        </div>
      </div>

      {/* Phase 1: Initial 1-byte state */}
      <div style={{
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: smallStateOpacity,
      }}>
        <div style={{
          fontSize: 16,
          color: colors.small,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontWeight: 600,
          marginBottom: 16,
        }}>
          初始状态: prevlen = 0 (1 字节足够)
        </div>

        {/* Entry with 1-byte prevlen */}
        <div style={{
          backgroundColor: colors.entry,
          borderRadius: 12,
          padding: '20px 30px',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}>
          {/* prevlen */}
          <div style={{ display: 'flex', gap: 2 }}>
            {renderByte(colors.small, 'prev', 0, 1, 1)}
          </div>
          {/* encoding */}
          {renderByte(colors.encoding, 'enc', 1, 1, 1)}
          {/* content */}
          <div style={{
            width: BYTE_SIZE * 2,
            height: BYTE_SIZE,
            backgroundColor: colors.warning,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: colors.text,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}>
            "a"
          </div>
        </div>

        <div style={{
          marginTop: 16,
          padding: '8px 20px',
          backgroundColor: `${colors.small}20`,
          borderRadius: 20,
          fontSize: 14,
          color: colors.small,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          当 prevlen &lt; 254 时，只需 1 字节
        </div>
      </div>

      {/* Phase 2: Trigger */}
      <div style={{
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: triggerOpacity,
      }}>
        <div style={{
          fontSize: 18,
          color: colors.large,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontWeight: 700,
          marginBottom: 16,
        }}>
          触发扩展: 前驱节点变大，prevlen 需要表示更大的值
        </div>

        <div style={{
          backgroundColor: `${colors.large}15`,
          border: `2px solid ${colors.large}`,
          borderRadius: 12,
          padding: '16px 32px',
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          <span style={{ color: colors.textMuted }}>前驱节点: </span>
          <span style={{ color: colors.large, fontWeight: 700 }}>"hello world"</span>
          <span style={{ color: colors.textMuted, marginLeft: 20 }}>大小: 15 bytes</span>
        </div>
      </div>

      {/* Phase 3: Expansion animation */}
      <div style={{
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: expansionProgress > 0 ? 1 : 0,
      }}>
        <div style={{
          fontSize: 18,
          color: colors.text,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontWeight: 700,
          marginBottom: 16,
        }}>
          扩展动画
        </div>

        {/* Before -> After comparison */}
        <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
          {/* Before */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 14,
              color: colors.textMuted,
              marginBottom: 8,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              扩展前
            </div>
            <div style={{
              backgroundColor: colors.entry,
              borderRadius: 12,
              padding: '16px 24px',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}>
              {renderByte(colors.small, '1B', 0, 1, 1)}
              {renderByte(colors.encoding, 'enc', 1, 1, 1)}
              <div style={{
                width: BYTE_SIZE * 1.5,
                height: BYTE_SIZE,
                backgroundColor: colors.warning,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: colors.text,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
              }}>
                "a"
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}>
            <div style={{
              fontSize: 24,
              color: colors.large,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              fontWeight: 700,
            }}>
              →
            </div>
          </div>

          {/* After */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 14,
              color: colors.textMuted,
              marginBottom: 8,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              扩展后
            </div>
            <div style={{
              backgroundColor: colors.entry,
              borderRadius: 12,
              padding: '16px 24px',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              transform: `scale(${1 + expansionProgress * 0.05})`,
              boxShadow: `0 0 30px ${colors.large}${Math.floor(expansionProgress * 60).toString(16).padStart(2, '0')}`,
            }}>
              {/* 5 bytes for prevlen */}
              <div style={{ display: 'flex', gap: 2 }}>
                {renderByte(colors.large, '1', 0, expansionProgress, 1)}
                {renderByte(colors.large, '2', 1, expansionProgress, 1)}
                {renderByte(colors.large, '3', 2, expansionProgress, 1)}
                {renderByte(colors.large, '4', 3, expansionProgress, 1)}
                {renderByte(colors.large, '5', 4, expansionProgress, 1)}
              </div>
              {renderByte(colors.encoding, 'enc', 5, 1, 1)}
              <div style={{
                width: BYTE_SIZE * 1.5,
                height: BYTE_SIZE,
                backgroundColor: colors.warning,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: colors.text,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
              }}>
                "a"
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 20,
          padding: '12px 24px',
          backgroundColor: `${colors.large}20`,
          borderRadius: 8,
          fontSize: 16,
          color: colors.large,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontWeight: 600,
        }}>
          节点整体变大 +4 字节
        </div>
      </div>

      {/* Phase 4: Cascade effect */}
      <div style={{
        position: 'absolute',
        top: 300,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: cascadeOpacity,
      }}>
        <div style={{
          fontSize: 18,
          color: colors.warning,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontWeight: 700,
          marginBottom: 12,
        }}>
          连锁反应
        </div>
        <div style={{
          fontSize: 15,
          color: colors.text,
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          当前节点变大后，其后续节点的 prevlen 可能也需要更新...
          <br />
          <span style={{ color: colors.large, fontWeight: 600 }}>
            如果后续节点原本刚好能容纳 prevlen，扩展后会连锁触发更多扩展
          </span>
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
          backgroundColor: colors.entry,
          color: '#FFFFFF',
          padding: '16px 40px',
          borderRadius: 12,
          fontSize: 18,
          fontWeight: 600,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          1 字节 → 5 字节: 最坏情况下的连锁更新
        </div>
      </div>
    </AbsoluteFill>
  );
};
