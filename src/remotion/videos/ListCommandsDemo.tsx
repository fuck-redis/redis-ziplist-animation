import React, { useEffect, useState } from 'react';

const COLORS = {
  background: '#F8FAFC',
  text: '#1E293B',
  textMuted: '#64748B',
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  headerBg: '#06B6D4',
  entryBg: '#8B5CF6',
  endMarker: '#EF4444',
};

const FRAME_DURATION = 600; // 10 seconds at 60fps

export const ListCommandsDemo: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % 300;

  // Animation phases
  // 0-60: Show initial ziplist with 3 elements
  // 60-120: LPUSH animation (add to head)
  // 120-180: RPUSH animation (add to tail)
  // 180-240: Show complexity info
  // 240-300: Reset

  const getAnimatedElements = () => {
    if (loopFrame < 60) return ['world', '100', 'hello'];
    if (loopFrame < 120) return ['new', 'world', '100', 'hello'];
    if (loopFrame < 180) return ['new', 'world', '100', 'hello', 'added'];
    return ['world', '100', 'hello'];
  };

  const elements = getAnimatedElements();
  const showLPUSHEffect = loopFrame >= 60 && loopFrame < 120;
  const showRPUSHEffect = loopFrame >= 120 && loopFrame < 180;
  const showComplexity = loopFrame >= 180 && loopFrame < 240;

  const lpushProgress = showLPUSHEffect ? Math.min(1, (loopFrame - 60) / 30) : 0;
  const rpushProgress = showRPUSHEffect ? Math.min(1, (loopFrame - 120) / 30) : 0;

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
        List Commands on ZipList
      </div>

      {/* Command badges */}
      <div style={{
        position: 'absolute',
        top: 85,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
      }}>
        <div style={{
          backgroundColor: COLORS.primary,
          color: 'white',
          padding: '8px 20px',
          borderRadius: 20,
          fontSize: 18,
          fontWeight: 600,
          opacity: loopFrame < 240 ? 1 : 0,
          transform: `scale(${loopFrame < 240 ? 1 : 0.8})`,
          transition: 'all 0.3s',
        }}>
          LPUSH
        </div>
        <div style={{
          backgroundColor: COLORS.secondary,
          color: 'white',
          padding: '8px 20px',
          borderRadius: 20,
          fontSize: 18,
          fontWeight: 600,
          opacity: loopFrame >= 120 && loopFrame < 240 ? 1 : 0.5,
          transform: `scale(${loopFrame >= 120 && loopFrame < 240 ? 1 : 0.9})`,
          transition: 'all 0.3s',
        }}>
          RPUSH
        </div>
      </div>

      {/* ZipList Visualization */}
      <div style={{
        position: 'absolute',
        top: 150,
        left: 100,
        right: 100,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
        }}>
          {['zlbytes', 'zltail', 'zllen'].map((field, i) => (
            <div key={field} style={{
              padding: '10px 16px',
              backgroundColor: COLORS.headerBg,
              color: 'white',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              opacity: loopFrame > 20 ? 1 : 0,
              transform: `translateY(${loopFrame > 20 ? 0 : -20}px)`,
              transition: 'all 0.4s',
              transitionDelay: `${i * 50}ms`,
            }}>
              {field}
            </div>
          ))}
        </div>

        {/* Entries */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          minHeight: 80,
        }}>
          {elements.map((elem, idx) => (
            <React.Fragment key={idx}>
              {/* Entry container */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: idx < 3 || loopFrame < 180 ? 1 : 0,
                transform: `
                  ${showLPUSHEffect && idx === 0 ? `translateX(${-40 * (1 - lpushProgress)}px) scale(${lpushProgress})` : ''}
                  ${showRPUSHEffect && idx === elements.length - 1 ? `translateX(${40 * (1 - rpushProgress)}px) scale(${rpushProgress})` : ''}
                `,
                transition: 'all 0.3s',
              }}>
                {/* prevlen */}
                <div style={{
                  width: 40,
                  height: 24,
                  backgroundColor: idx === 0 ? COLORS.accent : COLORS.warning,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  marginBottom: 4,
                }}>
                  prevlen
                </div>
                {/* content */}
                <div style={{
                  padding: '16px 24px',
                  backgroundColor: COLORS.entryBg,
                  color: 'white',
                  borderRadius: 8,
                  fontSize: 18,
                  fontWeight: 600,
                  minWidth: 80,
                  textAlign: 'center',
                }}>
                  {elem}
                </div>
                {/* index label */}
                <div style={{
                  marginTop: 8,
                  color: COLORS.textMuted,
                  fontSize: 12,
                }}>
                  [{idx}]
                </div>
              </div>
              {/* Arrow */}
              {idx < elements.length - 1 && (
                <div style={{
                  color: COLORS.textMuted,
                  fontSize: 24,
                  marginTop: -30,
                }}>
                  {'→'}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* End marker */}
        <div style={{
          position: 'absolute',
          right: -60,
          top: 20,
          width: 40,
          height: 40,
          backgroundColor: COLORS.endMarker,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 18,
          fontWeight: 700,
          opacity: loopFrame > 40 ? 1 : 0,
        }}>
          FF
        </div>
      </div>

      {/* Complexity Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
        opacity: showComplexity ? 1 : 0,
        transform: `translateY(${showComplexity ? 0 : 30}px)`,
        transition: 'all 0.4s',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px 30px',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 8 }}>
            LPUSH / RPUSH
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.accent,
          }}>
            O(1)
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
            Head/Tail insert
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px 30px',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 8 }}>
            LINSERT
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.warning,
          }}>
            O(n)
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
            Middle insert
          </div>
        </div>
      </div>

      {/* Bottom explanation */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 14,
      }}>
        <span style={{ color: COLORS.accent }}>LPUSH</span>: Insert at head |{' '}
        <span style={{ color: COLORS.secondary }}>RPUSH</span>: Insert at tail |{' '}
        prevlen updates when needed
      </div>

      {/* Animation indicator */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        fontSize: 12,
        color: COLORS.textMuted,
      }}>
        Loop: {Math.floor(frame / 300) + 1}/2
      </div>
    </div>
  );
};
