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
  ziplist: '#8B5CF6',
  quicklist: '#06B6D4',
};

const FRAME_DURATION = 300; // 10 seconds at 30fps

export const RedisAutoSwitch: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % FRAME_DURATION;

  // Animation phases (10 seconds = 300 frames at 30fps)
  // 0-50: Show ZipList state with threshold indicator
  // 50-100: Elements grow, approach threshold
  // 100-150: Convert to QuickList
  // 150-200: Show QuickList state
  // 200-250: Elements shrink below threshold
  // 250-300: Convert back to ZipList

  const getPhase = () => {
    if (loopFrame < 50) return 0;
    if (loopFrame < 100) return 1;
    if (loopFrame < 150) return 2;
    if (loopFrame < 200) return 3;
    if (loopFrame < 250) return 4;
    return 5;
  };

  const phase = getPhase();
  const isZipList = phase === 0 || phase === 1 || phase === 5;
  const isConverting = phase === 2 || phase === 5;

  const getElementCount = () => {
    if (phase === 0) return 5;
    if (phase === 1) return 15;
    if (phase === 2) return 20;
    if (phase === 3) return 20;
    if (phase === 4) return 8;
    return 5;
  };

  const getThreshold = () => 16; // list-max-ziplist-size = 2

  const elementCount = getElementCount();
  const threshold = getThreshold();
  const exceedsThreshold = elementCount > threshold;

  const getProgress = () => {
    if (phase === 2) return (loopFrame - 100) / 50;
    if (phase === 5) return (loopFrame - 250) / 50;
    return 0;
  };

  const progress = getProgress();

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
        Redis Auto-Switch
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
        Redis 根据阈值自动在 ZipList 和 QuickList 间切换
      </div>

      {/* Phase indicator */}
      <div style={{
        position: 'absolute',
        top: 120,
        right: 60,
        backgroundColor: isZipList ? COLORS.ziplist : COLORS.quicklist,
        color: 'white',
        padding: '6px 16px',
        borderRadius: 16,
        fontSize: 13,
        fontWeight: 600,
      }}>
        {phase === 0 && 'Small ZipList'}
        {phase === 1 && 'Growing...'}
        {phase === 2 && 'Converting to QuickList!'}
        {phase === 3 && 'QuickList State'}
        {phase === 4 && 'Shrinking...'}
        {phase === 5 && 'Converting to ZipList!'}
      </div>

      {/* Configuration info */}
      <div style={{
        position: 'absolute',
        top: 120,
        left: 60,
        backgroundColor: 'white',
        padding: '8px 16px',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>Configuration</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>
          list-max-ziplist-size: <span style={{ color: COLORS.warning }}>{threshold}</span>
        </div>
      </div>

      {/* Main visualization */}
      <div style={{
        position: 'absolute',
        top: 170,
        left: 60,
        right: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        {/* Element counter with threshold */}
        <div style={{
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{
            fontSize: 14,
            color: COLORS.textMuted,
          }}>
            Element Count: <span style={{
              fontSize: 28,
              fontWeight: 700,
              color: exceedsThreshold ? COLORS.warning : COLORS.accent,
            }}>
              {elementCount}
            </span>
          </div>

          {/* Threshold bar */}
          <div style={{
            width: '100%',
            height: 20,
            backgroundColor: '#F1F5F9',
            borderRadius: 10,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Fill */}
            <div style={{
              width: `${Math.min(100, (elementCount / threshold) * 100)}%`,
              height: '100%',
              backgroundColor: exceedsThreshold ? COLORS.warning : COLORS.accent,
              borderRadius: 10,
              transition: 'width 0.3s ease-out',
            }} />
            {/* Threshold line */}
            <div style={{
              position: 'absolute',
              left: '100%',
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: COLORS.error,
              transform: 'translateX(-50%)',
            }} />
          </div>

          {/* Labels */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: COLORS.textMuted,
          }}>
            <span>0</span>
            <span style={{ color: COLORS.error }}>Threshold: {threshold}</span>
            <span>{threshold * 2}</span>
          </div>
        </div>

        {/* Data structure visualization */}
        <div style={{
          padding: 24,
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          opacity: isConverting ? (1 - Math.abs(progress - 0.5) * 2) : 1,
          transform: `scale(${isConverting ? 1 + Math.abs(progress - 0.5) * 0.1 : 1})`,
          transition: 'all 0.3s',
        }}>
          {/* Current structure label */}
          <div style={{
            position: 'absolute',
            top: -12,
            left: 20,
            padding: '2px 8px',
            backgroundColor: isZipList ? COLORS.ziplist : COLORS.quicklist,
            color: 'white',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
          }}>
            {isZipList ? 'ZipList' : 'QuickList'}
          </div>

          {isZipList ? (
            // ZipList visualization
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
              {Array.from({ length: Math.min(elementCount, 20) }).map((_, idx) => (
                <div key={idx} style={{
                  width: 28,
                  height: 28,
                  backgroundColor: COLORS.ziplist,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  opacity: idx < elementCount ? 1 : 0.3,
                }}>
                  {String.fromCharCode(65 + (idx % 26))}
                </div>
              ))}
            </div>
          ) : (
            // QuickList visualization
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {Array.from({ length: Math.ceil(elementCount / 5) }).map((_, zlIdx) => (
                <React.Fragment key={zlIdx}>
                  {zlIdx > 0 && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}>
                      <div style={{
                        width: 30,
                        height: 2,
                        backgroundColor: COLORS.quicklist,
                      }} />
                      <div style={{
                        padding: '2px 6px',
                        backgroundColor: COLORS.quicklist,
                        color: 'white',
                        borderRadius: 3,
                        fontSize: 8,
                        fontWeight: 700,
                      }}>
                        L0
                      </div>
                    </div>
                  )}
                  <div style={{
                    padding: 8,
                    backgroundColor: COLORS.quicklist + '15',
                    borderRadius: 6,
                    border: `2px solid ${COLORS.quicklist}`,
                  }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[0, 1, 2].map(eIdx => (
                        <div key={eIdx} style={{
                          width: 20,
                          height: 20,
                          backgroundColor: COLORS.primary,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 8,
                          fontWeight: 700,
                        }}>
                          {String.fromCharCode(65 + eIdx + (zlIdx * 3) % 26)}
                        </div>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Arrow indicator during conversion */}
        {isConverting && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '12px 24px',
            backgroundColor: COLORS.warning,
            color: 'white',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 700,
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
          }}>
            {phase === 2 ? 'ZipList → QuickList' : 'QuickList → ZipList'}
          </div>
        )}
      </div>

      {/* Info panel */}
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
          { label: 'Auto Switch', desc: 'Redis automatic', color: COLORS.accent },
          { label: 'Threshold', desc: `${threshold} elements`, color: COLORS.warning },
          { label: 'Memory', desc: 'Optimized layout', color: COLORS.primary },
        ].map(item => (
          <div key={item.label} style={{
            backgroundColor: 'white',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{item.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.desc}</div>
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
          { color: COLORS.ziplist, label: 'ZipList' },
          { color: COLORS.quicklist, label: 'QuickList' },
          { color: COLORS.warning, label: 'Threshold' },
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
