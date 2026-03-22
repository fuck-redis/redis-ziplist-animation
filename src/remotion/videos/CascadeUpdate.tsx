import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const BYTE_SIZE = 36;
const ENTRY_HEIGHT = 60;

interface EntryVisualizationProps {
  content: string;
  prevlen: number;
  totalSize: number;
  index: number;
  startFrame: number;
  animationFrame: number;
  highlightColor?: string;
  isUpdating?: boolean;
}

const EntryVisualization: React.FC<EntryVisualizationProps> = ({
  content,
  prevlen,
  totalSize,
  index,
  startFrame,
  animationFrame,
  highlightColor,
  isUpdating,
}) => {
  const appear = Math.min(1, Math.max(0, (animationFrame - startFrame) / 20));

  const updatePulse = isUpdating ? Math.sin((animationFrame - startFrame) * 0.1) * 0.5 + 0.5 : 0;

  const prevlenSize = prevlen < 254 ? 1 : 5;
  const contentBytes = new TextEncoder().encode(content).length;
  const encodingSize = contentBytes <= 63 ? 1 : 2;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 20px',
        backgroundColor: theme.colors.backgroundLight,
        borderRadius: 10,
        border: `3px solid ${highlightColor || theme.colors.border}`,
        opacity: appear,
        transform: `translateX(${(1 - appear) * -30}px)`,
        boxShadow: isUpdating ? `0 0 20px ${highlightColor}40` : undefined,
      }}
    >
      {/* Index */}
      <div style={{
        width: 50,
        color: theme.colors.textMuted,
        fontSize: 16,
        fontFamily: theme.fonts.mono,
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
          backgroundColor: theme.colors.accent,
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isUpdating ? `scale(${1 + updatePulse * 0.1})` : undefined,
        }}>
          <span style={{ color: theme.colors.background, fontSize: 10, fontFamily: theme.fonts.mono }}>prevlen</span>
          <span style={{ color: theme.colors.background, fontSize: 12, fontWeight: 700, fontFamily: theme.fonts.mono }}>
            {prevlen}
          </span>
        </div>

        {/* encoding */}
        <div style={{
          width: encodingSize * BYTE_SIZE,
          height: ENTRY_HEIGHT,
          backgroundColor: theme.colors.secondary,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: theme.colors.text, fontSize: 11, fontFamily: theme.fonts.mono }}>enc</span>
        </div>

        {/* content */}
        <div style={{
          width: contentBytes * BYTE_SIZE,
          height: ENTRY_HEIGHT,
          backgroundColor: theme.colors.primary,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.text,
          fontSize: 16,
          fontFamily: theme.fonts.mono,
          fontWeight: 600,
        }}>
          {content}
        </div>
      </div>

      {/* Size */}
      <div style={{
        color: theme.colors.textMuted,
        fontSize: 14,
        fontFamily: theme.fonts.mono,
        minWidth: 80,
      }}>
        {totalSize} bytes
      </div>

      {/* Update indicator */}
      {isUpdating && (
        <div style={{
          padding: '4px 12px',
          backgroundColor: highlightColor,
          borderRadius: 20,
          color: theme.colors.background,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: theme.fonts.mono,
        }}>
          UPDATING
        </div>
      )}
    </div>
  );
};

export const CascadeUpdate: React.FC<{ title?: string }> = ({ title = '连锁更新原理' }) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 300);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const titleAppear = Math.min(1, Math.max(0, animationFrame / 20));

  // Phase control
  const phase1End = 45;
  const phase2End = 120;
  const phase3End = 200;
  const phase4End = 280;

  const currentPhase = animationFrame < phase1End ? 0
    : animationFrame < phase2End ? 1
    : animationFrame < phase3End ? 2
    : animationFrame < phase4End ? 3
    : 4;

  return (
    <div style={{
      backgroundColor: theme.colors.background,
      fontFamily: theme.fonts.sans,
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: 44,
        fontWeight: 700,
        opacity: titleAppear,
        transform: `scale(${titleAppear})`,
      }}>
        {title}
      </div>

      {/* Phase Indicator */}
      <div style={{
        position: 'absolute',
        top: 90,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
      }}>
        {['初始状态', '插入大节点', '触发更新', '连锁传播', '完成'].map((phase, i) => (
          <div
            key={phase}
            style={{
              padding: '8px 20px',
              backgroundColor: currentPhase >= i ? theme.colors.primary : theme.colors.backgroundLight,
              borderRadius: 20,
              color: currentPhase >= i ? theme.colors.text : theme.colors.textMuted,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: theme.fonts.mono,
              border: `2px solid ${currentPhase >= i ? theme.colors.primary : theme.colors.border}`,
            }}
          >
            {i + 1}. {phase}
          </div>
        ))}
      </div>

      {/* Entries Visualization */}
      <div style={{
        position: 'absolute',
        top: 150,
        left: 60,
        right: 60,
      }}>
        {currentPhase === 0 && (
          <>
            <div style={{ color: theme.colors.textMuted, fontSize: 16, marginBottom: 16 }}>
              初始状态：所有节点的 prevlen 都可以用 1 字节表示
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <EntryVisualization content="a" prevlen={0} totalSize={4} index={0} startFrame={10} animationFrame={animationFrame} />
              <EntryVisualization content="b" prevlen={4} totalSize={4} index={1} startFrame={20} animationFrame={animationFrame} />
              <EntryVisualization content="c" prevlen={8} totalSize={4} index={2} startFrame={30} animationFrame={animationFrame} />
            </div>
          </>
        )}

        {currentPhase >= 1 && (
          <>
            <div style={{ color: theme.colors.warning, fontSize: 16, marginBottom: 16 }}>
              在位置 1 插入一个大节点 "hello world"，大小从 4 变成 15 字节
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <EntryVisualization content="a" prevlen={0} totalSize={4} index={0} startFrame={10} animationFrame={animationFrame} />
              <EntryVisualization
                content="hello world"
                prevlen={4}
                totalSize={15}
                index={1}
                startFrame={20}
                highlightColor={theme.colors.warning}
                animationFrame={animationFrame}
              />
              <EntryVisualization
                content="b"
                prevlen={4}
                totalSize={5}
                index={2}
                startFrame={30}
                highlightColor={currentPhase >= 2 ? theme.colors.error : undefined}
                isUpdating={currentPhase >= 2}
                animationFrame={animationFrame}
              />
              <EntryVisualization
                content="c"
                prevlen={8}
                totalSize={5}
                index={3}
                startFrame={35}
                highlightColor={currentPhase >= 3 ? theme.colors.error : undefined}
                isUpdating={currentPhase >= 3}
                animationFrame={animationFrame}
              />
            </div>
          </>
        )}

        {currentPhase >= 2 && (
          <div style={{
            marginTop: 20,
            padding: '16px 24px',
            backgroundColor: `${theme.colors.error}20`,
            borderRadius: 10,
            border: `2px solid ${theme.colors.error}`,
          }}>
            <div style={{ color: theme.colors.error, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              问题：节点 [2] 的 prevlen=4，但实际前驱节点大小为 15！
            </div>
            <div style={{ color: theme.colors.text, fontSize: 15, fontFamily: theme.fonts.mono }}>
              需要将 prevlen 字段从 1 字节扩展到 5 字节
            </div>
          </div>
        )}

        {currentPhase >= 3 && (
          <div style={{
            marginTop: 16,
            padding: '16px 24px',
            backgroundColor: `${theme.colors.warning}20`,
            borderRadius: 10,
            border: `2px solid ${theme.colors.warning}`,
          }}>
            <div style={{ color: theme.colors.warning, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              连锁传播：节点 [2] 变大后，影响节点 [3] 的 prevlen
            </div>
            <div style={{ color: theme.colors.text, fontSize: 15, fontFamily: theme.fonts.mono }}>
              prevlen: 4 → 6 (+2 字节)，节点 [3] 连锁变大
            </div>
          </div>
        )}
      </div>

      {/* Bottom Explanation */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '0 60px',
      }}>
        <div style={{
          color: theme.colors.textMuted,
          fontSize: 15,
          fontFamily: theme.fonts.mono,
          lineHeight: 1.6,
        }}>
          <span style={{ color: theme.colors.highlight }}>核心原理</span>: 当某个节点的 prevlen 字段无法表示新的前驱节点大小时，
          <br />
          Redis 需要扩展该字段（1字节 → 5字节），这会导致该节点变大，进而可能影响后续节点...
        </div>
      </div>
    </div>
  );
};