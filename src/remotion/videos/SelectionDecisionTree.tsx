import React, { useEffect, useState } from 'react';

const FRAME_DURATION = 10 * 30; // 10 seconds at 30fps

export const SelectionDecisionTree: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const cycleFrame = frame % FRAME_DURATION;

  const colors = {
    background: '#F8FAFC',
    text: '#1E293B',
    textMuted: '#64748B',
    ziplist: '#3B82F6',
    quicklist: '#10B981',
    linkedlist: '#F59E0B',
    arrow: '#64748B',
    highlight: '#EF4444',
  };

  const getAnimationProgress = (start: number, duration: number) => {
    return Math.min(1, Math.max(0, (cycleFrame - start) / duration));
  };

  // Decision tree phases
  const phases = [
    {
      condition: '元素数量',
      value: '< 512',
      result: 'ZipList',
      color: colors.ziplist,
      description: '小数据集使用紧凑列表',
      duration: 120,
    },
    {
      condition: '元素数量',
      value: '512 - 10000',
      result: 'QuickList',
      color: colors.quicklist,
      description: '中等数据集使用链式列表',
      duration: 120,
    },
    {
      condition: '元素数量',
      value: '> 10000',
      result: 'LinkedList',
      color: colors.linkedlist,
      description: '大数据集使用标准链表',
      duration: 120,
    },
  ];

  const currentPhase = Math.floor(cycleFrame / 120) % 3;

  return (
    <div style={{
      backgroundColor: colors.background,
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 25,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.text,
        fontSize: 38,
        fontWeight: 700,
      }}>
        Redis 数据结构选择决策树
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 18,
      }}>
        根据元素数量自动选择最优数据结构
      </div>

      {/* Decision tree visualization */}
      <div style={{
        position: 'absolute',
        top: 140,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 60,
      }}>
        {/* Start node */}
        <div style={{
          position: 'absolute',
          left: 80,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: getAnimationProgress(0, 30),
        }}>
          <div style={{
            width: 100,
            height: 60,
            backgroundColor: colors.text,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            元素数量
          </div>
        </div>

        {/* Arrows from start */}
        {[0, 1, 2].map((idx) => {
          const arrowProgress = getAnimationProgress(20 + idx * 10, 20);
          const isActive = idx === currentPhase;

          return (
            <div key={idx} style={{
              position: 'absolute',
              left: 180,
              top: '50%',
              width: `${280 - idx * 30}px`,
              height: 40,
              opacity: arrowProgress,
            }}>
              {/* Horizontal line */}
              <div style={{
                position: 'absolute',
                top: 20,
                left: 0,
                width: '100%',
                height: 3,
                backgroundColor: isActive ? phases[idx].color : colors.arrow,
                transition: 'background-color 0.3s',
              }} />
              {/* Arrow head */}
              <div style={{
                position: 'absolute',
                right: -8,
                top: 14,
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: `16px solid ${isActive ? phases[idx].color : colors.arrow}`,
              }} />
            </div>
          );
        })}

        {/* Decision branches */}
        {phases.map((phase, idx) => {
          const branchProgress = getAnimationProgress(40 + idx * 30, 40);
          const isActive = idx === currentPhase;
          const xPos = 250 + idx * 280;

          return (
            <div key={idx} style={{
              position: 'absolute',
              left: xPos,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: branchProgress,
              width: 200,
            }}>
              {/* Condition box */}
              <div style={{
                backgroundColor: '#fff',
                border: `2px solid ${isActive ? phase.color : colors.arrow}`,
                borderRadius: 10,
                padding: '12px 16px',
                textAlign: 'center',
                marginBottom: 12,
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxShadow: isActive ? `0 0 20px ${phase.color}40` : 'none',
              }}>
                <div style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  marginBottom: 4,
                }}>
                  {phase.condition}
                </div>
                <div style={{
                  color: colors.text,
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {phase.value}
                </div>
              </div>

              {/* Arrow down */}
              <div style={{
                textAlign: 'center',
                height: 40,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translateX(-50%)',
                  width: 3,
                  height: 30,
                  backgroundColor: isActive ? phase.color : colors.arrow,
                }} />
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 0,
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: `12px solid ${isActive ? phase.color : colors.arrow}`,
                }} />
              </div>

              {/* Result box */}
              <div style={{
                backgroundColor: phase.color,
                borderRadius: 10,
                padding: '16px 20px',
                textAlign: 'center',
                boxShadow: `0 4px 20px ${phase.color}40`,
              }}>
                <div style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 6,
                }}>
                  {phase.result}
                </div>
                <div style={{
                  color: '#fff',
                  fontSize: 13,
                  opacity: 0.9,
                }}>
                  {phase.description}
                </div>
              </div>

              {/* Highlight pulse for active */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  border: `2px solid ${phase.color}`,
                  borderRadius: 16,
                  animation: 'pulse 1s infinite',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Active indicator */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 40,
        display: 'flex',
        gap: 8,
      }}>
        {[0, 1, 2].map((idx) => (
          <div key={idx} style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: idx === currentPhase ? phases[idx].color : '#E2E8F0',
            transition: 'background-color 0.3s',
          }} />
        ))}
      </div>

      {/* Bottom summary */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 14,
      }}>
        <span style={{ color: colors.ziplist, fontWeight: 600 }}>ZipList</span>
        {' < 512 | '}
        <span style={{ color: colors.quicklist, fontWeight: 600 }}>QuickList</span>
        {' 512-10000 | '}
        <span style={{ color: colors.linkedlist, fontWeight: 600 }}>LinkedList</span>
        {' > 10000'}
      </div>

      {/* Progress */}
      <div style={{
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 12,
      }}>
        {Math.floor((cycleFrame / FRAME_DURATION) * 10)}s / 10s
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};
