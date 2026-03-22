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
  byte1: '#38BDF8',
  byte5: '#F87171',
};

const FRAME_DURATION = 300; // 10 seconds at 30fps

export const CascadeTriggerDemo: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % FRAME_DURATION;

  // Animation phases (10 seconds = 300 frames at 30fps)
  // 0-50: Show initial ziplist with small prevlen (1 byte)
  // 50-100: Middle entry grows, needs 5-byte prevlen
  // 100-180: Cascade animation - entries shift right one by one
  // 180-250: Show final state with all entries having expanded prevlen
  // 250-300: Reset

  const getEntries = () => {
    if (loopFrame < 50) {
      return [
        { content: 'A', prevlen: 0, prevlenSize: 1 },
        { content: 'BB', prevlen: 1, prevlenSize: 1 },
        { content: 'CCC', prevlen: 2, prevlenSize: 1 },
        { content: 'DD', prevlen: 3, prevlenSize: 1 },
      ];
    }
    if (loopFrame < 100) {
      return [
        { content: 'A', prevlen: 0, prevlenSize: 1 },
        { content: 'BBBBB', prevlen: 1, prevlenSize: 1 },
        { content: 'CCC', prevlen: 5, prevlenSize: 1 },
        { content: 'DD', prevlen: 3, prevlenSize: 1 },
      ];
    }
    if (loopFrame < 180) {
      const cascadePhase = Math.floor((loopFrame - 100) / 20);
      return [
        { content: 'A', prevlen: 0, prevlenSize: cascadePhase >= 0 ? 5 : 1 },
        { content: 'BBBBB', prevlen: 1, prevlenSize: cascadePhase >= 1 ? 5 : 1 },
        { content: 'CCC', prevlen: 5, prevlenSize: cascadePhase >= 2 ? 5 : 1 },
        { content: 'DD', prevlen: 3, prevlenSize: cascadePhase >= 3 ? 5 : 1 },
      ];
    }
    return [
      { content: 'A', prevlen: 0, prevlenSize: 5 },
      { content: 'BBBBB', prevlen: 1, prevlenSize: 5 },
      { content: 'CCC', prevlen: 5, prevlenSize: 5 },
      { content: 'DD', prevlen: 3, prevlenSize: 5 },
    ];
  };

  const entries = getEntries();
  const showCascade = loopFrame >= 100 && loopFrame < 180;
  const cascadeIndex = showCascade ? Math.floor((loopFrame - 100) / 20) : -1;
  const phase = loopFrame < 50 ? 0 : loopFrame < 100 ? 1 : loopFrame < 180 ? 2 : loopFrame < 250 ? 3 : 4;

  const getAppear = (startFrame: number, duration: number = 15) => {
    return Math.min(1, Math.max(0, (loopFrame - startFrame) / duration));
  };

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
        Cascade Trigger Effect
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
        当 prevlen 需要扩展时，后续所有 Entry 都需重新移动
      </div>

      {/* Phase Indicator */}
      <div style={{
        position: 'absolute',
        top: 120,
        right: 60,
        backgroundColor: phase === 2 ? COLORS.warning : COLORS.accent,
        color: 'white',
        padding: '6px 16px',
        borderRadius: 16,
        fontSize: 13,
        fontWeight: 600,
        transition: 'background-color 0.3s',
      }}>
        {phase === 0 && '初始状态'}
        {phase === 1 && 'Entry 增长中...'}
        {phase === 2 && '连锁扩展!'}
        {phase === 3 && '扩展完成'}
        {phase === 4 && '重置'}
      </div>

      {/* ZipList Visualization */}
      <div style={{
        position: 'absolute',
        top: 160,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
        }}>
          {['zlbytes', 'zltail', 'zllen'].map((field, i) => (
            <div key={field} style={{
              padding: '8px 14px',
              backgroundColor: COLORS.secondary,
              color: 'white',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              opacity: getAppear(i * 10),
            }}>
              {field}
            </div>
          ))}
        </div>

        {/* Entries Row */}
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}>
          {entries.map((entry, idx) => {
            const isCascading = showCascade && idx <= cascadeIndex;
            const prevlenColor = entry.prevlenSize === 1 ? COLORS.byte1 : COLORS.byte5;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: getAppear(idx * 10),
                  transform: isCascading ? `translateX(${(idx - cascadeIndex) * 30}px)` : 'none',
                  transition: 'transform 0.3s ease-out',
                }}
              >
                {/* Entry Box */}
                <div style={{
                  border: `3px solid ${isCascading ? COLORS.warning : COLORS.text}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: isCascading ? `0 0 20px ${COLORS.warning}60` : '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                }}>
                  {/* prevlen */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: prevlenColor,
                  }}>
                    {entry.prevlenSize === 1 ? (
                      <div style={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 10,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}>
                        <div>{entry.prevlen}</div>
                        <div style={{ fontSize: 7, opacity: 0.8 }}>1B</div>
                      </div>
                    ) : (
                      <>
                        <div style={{
                          width: 32,
                          height: 32,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 10,
                          fontFamily: 'monospace',
                          fontWeight: 700,
                        }}>
                          <div>FE</div>
                          <div style={{ fontSize: 7, opacity: 0.8 }}>mark</div>
                        </div>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: 24,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 10,
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            backgroundColor: isCascading ? COLORS.warning : '#7DD3FC',
                          }}>
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* content */}
                  <div style={{
                    padding: '10px 16px',
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}>
                    {entry.content}
                  </div>
                </div>

                {/* Size label */}
                <div style={{
                  marginTop: 6,
                  color: COLORS.textMuted,
                  fontSize: 10,
                  fontFamily: 'monospace',
                }}>
                  prevlen: {entry.prevlenSize}B
                </div>
              </div>
            );
          })}
        </div>

        {/* End marker */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 10,
        }}>
          <div style={{
            width: 36,
            height: 36,
            backgroundColor: COLORS.error,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 14,
            fontWeight: 700,
            opacity: getAppear(50),
          }}>
            FF
          </div>
        </div>
      </div>

      {/* Explanation panel */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>
            小 prevlen (1B)
          </div>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.byte1,
            fontFamily: 'monospace',
          }}>
            {'<'} 254
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          color: COLORS.textMuted,
          fontSize: 20,
        }}>
          →
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>
            大 prevlen (5B)
          </div>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.byte5,
            fontFamily: 'monospace',
          }}>
            {'>='} 254
          </div>
        </div>
      </div>

      {/* Warning message */}
      {showCascade && (
        <div style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: COLORS.warning,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'monospace',
        }}>
          注意: 每个 Entry 的扩展都可能触发后续所有 Entry 的重新移动!
        </div>
      )}

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
          { color: COLORS.byte1, label: 'prevlen (1B)' },
          { color: COLORS.byte5, label: 'prevlen (5B)' },
          { color: COLORS.primary, label: 'content' },
          { color: COLORS.warning, label: 'cascade' },
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
