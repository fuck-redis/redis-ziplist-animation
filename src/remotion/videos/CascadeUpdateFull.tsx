import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

const colors = {
  background: '#F8FAFC',
  entry: '#3B82F6',
  largeEntry: '#F59E0B',
  updating: '#EF4444',
  fixed: '#10B981',
  text: '#1E293B',
  textMuted: '#64748B',
  encoding: '#06B6D4',
  prevlen: '#8B5CF6',
};

const BYTE_SIZE = 36;
const ENTRY_HEIGHT = 50;

interface EntryBoxProps {
  content: string;
  prevlen: number;
  totalSize: number;
  index: number;
  opacity: number;
  highlightColor?: string;
  isUpdating?: boolean;
  offsetY?: number;
}

const EntryBox: React.FC<EntryBoxProps> = ({
  content,
  prevlen,
  totalSize,
  index,
  opacity,
  highlightColor,
  isUpdating,
  offsetY = 0,
}) => {
  const prevlenSize = prevlen < 254 ? 1 : 5;
  const contentBytes = new TextEncoder().encode(content).length;
  const encodingSize = 1;

  const scale = isUpdating ? 1 + Math.sin(Date.now() / 100) * 0.03 : 1;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        border: `3px solid ${highlightColor || colors.entry}`,
        opacity,
        transform: `translateY(${-offsetY}px) scale(${scale})`,
        boxShadow: isUpdating ? `0 0 20px ${highlightColor}60` : `0 2px 8px rgba(0,0,0,0.1)`,
      }}
    >
      {/* Index */}
      <div style={{
        width: 40,
        color: colors.textMuted,
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
        fontWeight: 600,
      }}>
        [{index}]
      </div>

      {/* Entry Bytes */}
      <div style={{ display: 'flex', gap: 2 }}>
        {/* prevlen */}
        <div style={{
          width: prevlenSize * BYTE_SIZE,
          height: ENTRY_HEIGHT,
          backgroundColor: prevlenSize === 1 ? colors.prevlen : colors.updating,
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: '#FFFFFF', fontSize: 9, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
            prev
          </span>
          <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
            {prevlen}
          </span>
        </div>

        {/* encoding */}
        <div style={{
          width: encodingSize * BYTE_SIZE,
          height: ENTRY_HEIGHT,
          backgroundColor: colors.encoding,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: '#FFFFFF', fontSize: 10, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
            enc
          </span>
        </div>

        {/* content */}
        <div style={{
          width: Math.max(contentBytes * BYTE_SIZE, BYTE_SIZE),
          height: ENTRY_HEIGHT,
          backgroundColor: colors.largeEntry,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontWeight: 600,
        }}>
          {content.length > 6 ? content.slice(0, 5) + '...' : content}
        </div>
      </div>

      {/* Size */}
      <div style={{
        color: colors.textMuted,
        fontSize: 12,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
        minWidth: 60,
      }}>
        {totalSize}B
      </div>

      {/* Update indicator */}
      {isUpdating && (
        <div style={{
          padding: '4px 10px',
          backgroundColor: highlightColor || colors.updating,
          borderRadius: 12,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          UPDATE
        </div>
      )}
    </div>
  );
};

export const CascadeUpdateFull: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const duration = 450; // 15 seconds at 30fps
  const loopedFrame = frame % duration;

  // Timeline:
  // 0-30: Title
  // 30-90: Phase 1 - Initial state
  // 90-150: Phase 2 - Insert large node
  // 150-240: Phase 3 - First cascade
  // 240-330: Phase 4 - Continue cascade
  // 330-400: Phase 5 - Complete
  // 400-450: Summary

  const phase1End = 90;
  const phase2End = 150;
  const phase3End = 240;
  const phase4End = 330;
  const phase5End = 400;

  const currentPhase = loopedFrame < phase1End ? 0
    : loopedFrame < phase2End ? 1
    : loopedFrame < phase3End ? 2
    : loopedFrame < phase4End ? 3
    : loopedFrame < phase5End ? 4
    : 5;

  const titleOpacity = interpolate(loopedFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, padding: 40 }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 20,
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
          连锁更新完整时序
        </div>
        <div style={{
          fontSize: 16,
          color: colors.textMuted,
          marginTop: 4,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          分步骤展示 prevlen 扩展的连锁反应
        </div>
      </div>

      {/* Phase Indicators */}
      <div style={{
        position: 'absolute',
        top: 90,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
      }}>
        {['初始', '插入', '触发', '传播', '完成'].map((label, i) => (
          <div
            key={i}
            style={{
              padding: '6px 16px',
              backgroundColor: currentPhase >= i ? colors.entry : '#E2E8F0',
              borderRadius: 16,
              color: currentPhase >= i ? '#FFFFFF' : colors.textMuted,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {/* Entries Container */}
      <div style={{
        position: 'absolute',
        top: 140,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 500,
      }}>
        {/* Phase 0: Initial State */}
        {currentPhase === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontSize: 14,
              color: colors.fixed,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              marginBottom: 8,
            }}>
              初始状态: 所有节点 prevlen 只需 1 字节
            </div>
            <EntryBox content="a" prevlen={0} totalSize={4} index={0} opacity={1} />
            <EntryBox content="b" prevlen={4} totalSize={4} index={1} opacity={1} />
            <EntryBox content="c" prevlen={8} totalSize={4} index={2} opacity={1} />
          </div>
        )}

        {/* Phase 1: Insert large node */}
        {currentPhase === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontSize: 14,
              color: colors.largeEntry,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              marginBottom: 8,
            }}>
              在位置 1 插入 "hello" (4B → 13B)
            </div>
            <EntryBox content="a" prevlen={0} totalSize={4} index={0} opacity={1} />
            <EntryBox content="hello" prevlen={4} totalSize={13} index={1} opacity={1} highlightColor={colors.largeEntry} />
            <EntryBox content="b" prevlen={4} totalSize={5} index={2} opacity={0.5} />
            <EntryBox content="c" prevlen={8} totalSize={5} index={3} opacity={0.5} />
          </div>
        )}

        {/* Phase 2: First cascade */}
        {currentPhase === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontSize: 14,
              color: colors.updating,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              marginBottom: 8,
            }}>
              节点 [2] 的 prevlen=4 但前驱是 13B，需要扩展!
            </div>
            <EntryBox content="a" prevlen={0} totalSize={4} index={0} opacity={1} />
            <EntryBox content="hello" prevlen={4} totalSize={13} index={1} opacity={1} highlightColor={colors.largeEntry} />
            <EntryBox content="b" prevlen={4} totalSize={6} index={2} opacity={1} isUpdating highlightColor={colors.updating} />
            <EntryBox content="c" prevlen={8} totalSize={5} index={3} opacity={0.5} />
          </div>
        )}

        {/* Phase 3: Continue cascade */}
        {currentPhase === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontSize: 14,
              color: colors.updating,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              marginBottom: 8,
            }}>
              节点 [2] 变大后，节点 [3] 也需要更新
            </div>
            <EntryBox content="a" prevlen={0} totalSize={4} index={0} opacity={1} />
            <EntryBox content="hello" prevlen={4} totalSize={13} index={1} opacity={1} highlightColor={colors.largeEntry} />
            <EntryBox content="b" prevlen={4} totalSize={6} index={2} opacity={1} isUpdating highlightColor={colors.updating} />
            <EntryBox content="c" prevlen={13} totalSize={6} index={3} opacity={1} isUpdating highlightColor={colors.updating} />
          </div>
        )}

        {/* Phase 4: Complete */}
        {currentPhase >= 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontSize: 14,
              color: colors.fixed,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              marginBottom: 8,
            }}>
              连锁更新完成: 所有 prevlen 字段已更新
            </div>
            <EntryBox content="a" prevlen={0} totalSize={4} index={0} opacity={1} highlightColor={colors.fixed} />
            <EntryBox content="hello" prevlen={4} totalSize={13} index={1} opacity={1} highlightColor={colors.largeEntry} />
            <EntryBox content="b" prevlen={13} totalSize={6} index={2} opacity={1} highlightColor={colors.fixed} />
            <EntryBox content="c" prevlen={19} totalSize={6} index={3} opacity={1} highlightColor={colors.fixed} />
          </div>
        )}
      </div>

      {/* Explanation Box */}
      <div style={{
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          backgroundColor: `${colors.updating}15`,
          border: `2px solid ${colors.updating}`,
          borderRadius: 12,
          padding: '16px 32px',
          maxWidth: 600,
        }}>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: colors.updating,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            marginBottom: 6,
          }}>
            核心问题
          </div>
          <div style={{
            fontSize: 14,
            color: colors.text,
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.5,
          }}>
            当某个节点的 prevlen 字段无法表示新的前驱节点大小时，
            <br />
            Redis 需要扩展该字段 (1B → 5B)，导致节点变大，进而影响后续节点...
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: currentPhase >= 4 ? 1 : 0,
      }}>
        <div style={{
          backgroundColor: colors.fixed,
          color: '#FFFFFF',
          padding: '12px 32px',
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          最坏复杂度: O(n²) - 每次插入可能触发整个列表的连锁更新
        </div>
      </div>
    </AbsoluteFill>
  );
};
