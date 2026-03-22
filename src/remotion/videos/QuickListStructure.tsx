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
  ziplistBg: '#8B5CF6',
  pointer: '#06B6D4',
};

const FRAME_DURATION = 300; // 10 seconds at 30fps

export const QuickListStructure: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % FRAME_DURATION;

  // Animation phases (10 seconds = 300 frames at 30fps)
  // 0-50: Show initial QuickList structure
  // 50-100: Highlight forward pointers
  // 100-150: Highlight backward pointers
  // 150-250: Show traversal animation
  // 250-300: Reset

  const getPhase = () => {
    if (loopFrame < 50) return 0;
    if (loopFrame < 100) return 1;
    if (loopFrame < 150) return 2;
    if (loopFrame < 250) return 3;
    return 4;
  };

  const phase = getPhase();
  const showForward = phase === 1;
  const showBackward = phase === 2;
  const showTraversal = phase === 3;

  const ziplistCount = 4;
  const elementsPerList = ['A', 'B', 'C', 'D'];

  const getTraversePosition = () => {
    if (!showTraversal) return -1;
    const cycle = (loopFrame - 150) % 60;
    return Math.floor(cycle / 15);
  };

  const traversePos = getTraversePosition();

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
        QuickList Structure
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
        多个 ZipList 通过双向指针连接
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
        {phase === 0 && 'Structure'}
        {phase === 1 && 'Forward Pointers'}
        {phase === 2 && 'Backward Pointers'}
        {phase === 3 && 'Traversal'}
        {phase === 4 && 'Reset'}
      </div>

      {/* QuickList Visualization */}
      <div style={{
        position: 'absolute',
        top: 160,
        left: 60,
        right: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
      }}>
        {/* Forward pointers (L0) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: showBackward ? 0.3 : 1,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            padding: '4px 12px',
            backgroundColor: COLORS.pointer,
            color: 'white',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
          }}>
            HEAD
          </div>
          <div style={{ width: 30, height: 2, backgroundColor: COLORS.pointer }} />

          {Array.from({ length: ziplistCount }).map((_, idx) => (
            <React.Fragment key={idx}>
              {/* ZipList node */}
              <div style={{
                padding: 12,
                backgroundColor: COLORS.ziplistBg + '15',
                borderRadius: 8,
                border: `2px solid ${showTraversal && Math.floor(traversePos / 4) === idx ? COLORS.warning : COLORS.ziplistBg}`,
                boxShadow: showTraversal && Math.floor(traversePos / 4) === idx ? `0 0 20px ${COLORS.warning}60` : 'none',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}>
                  {elementsPerList.map((el, elIdx) => (
                    <div key={elIdx} style={{
                      width: 28,
                      height: 28,
                      backgroundColor: showTraversal && traversePos % 4 === elIdx && Math.floor(traversePos / 4) === idx
                        ? COLORS.warning
                        : COLORS.primary,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                    }}>
                      {el}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pointer */}
              {idx < ziplistCount - 1 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <div style={{
                    padding: '2px 8px',
                    backgroundColor: showForward ? COLORS.warning : COLORS.pointer,
                    color: 'white',
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    transition: 'background-color 0.3s',
                  }}>
                    L0
                  </div>
                  <div style={{
                    width: 40,
                    height: 2,
                    backgroundColor: showForward ? COLORS.warning : COLORS.pointer,
                    transition: 'background-color 0.3s',
                  }} />
                </div>
              )}
            </React.Fragment>
          ))}

          <div style={{ width: 30, height: 2, backgroundColor: COLORS.pointer }} />
          <div style={{
            padding: '4px 12px',
            backgroundColor: COLORS.error,
            color: 'white',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
          }}>
            TAIL
          </div>
        </div>

        {/* Backward pointers (L1) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: showForward ? 0.3 : 1,
          transition: 'opacity 0.3s',
        }}>
          <div style={{ width: 80 }} />

          {Array.from({ length: ziplistCount }).map((_, idx) => (
            <React.Fragment key={idx}>
              {/* Backward pointer */}
              {idx > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <div style={{
                    width: 40,
                    height: 2,
                    backgroundColor: showBackward ? COLORS.warning : COLORS.secondary,
                    transition: 'background-color 0.3s',
                  }} />
                  <div style={{
                    padding: '2px 8px',
                    backgroundColor: showBackward ? COLORS.warning : COLORS.secondary,
                    color: 'white',
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    transition: 'background-color 0.3s',
                  }}>
                    L1
                  </div>
                  <div style={{
                    width: 40,
                    height: 2,
                    backgroundColor: showBackward ? COLORS.warning : COLORS.secondary,
                    transition: 'background-color 0.3s',
                  }} />
                </div>
              )}

              <div style={{ width: 160 }} />
            </React.Fragment>
          ))}
        </div>

        {/* Index labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 60,
        }}>
          {Array.from({ length: ziplistCount }).map((_, idx) => (
            <div key={idx} style={{
              color: COLORS.textMuted,
              fontSize: 11,
              fontFamily: 'monospace',
            }}>
              ZipList[{idx}]
            </div>
          ))}
        </div>
      </div>

      {/* Traversal animation */}
      {showTraversal && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 60,
          right: 60,
          height: 2,
          backgroundColor: COLORS.warning + '30',
        }} />
      )}

      {/* Info panels */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
      }}>
        {[
          { label: 'L0', desc: 'Forward Pointer', color: COLORS.pointer },
          { label: 'L1', desc: 'Backward Pointer', color: COLORS.secondary },
        ].map(item => (
          <div key={item.label} style={{
            backgroundColor: 'white',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 36,
              height: 36,
              backgroundColor: item.color,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14,
              fontWeight: 700,
            }}>
              {item.label}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{item.desc}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>双向链表指针</div>
            </div>
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
          { color: COLORS.ziplistBg, label: 'ZipList Node' },
          { color: COLORS.pointer, label: 'L0 (forward)' },
          { color: COLORS.secondary, label: 'L1 (backward)' },
          { color: COLORS.warning, label: 'Traversal' },
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
