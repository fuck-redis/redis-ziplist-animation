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
  scoreBg: '#F59E0B',
  memberBg: '#8B5CF6',
};

const FRAME_DURATION = 600; // 10 seconds at 60fps

export const ZsetCommandsDemo: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % 300;

  // Animation phases
  // 0-60: Show initial ziplist with 3 zset entries
  // 60-120: ZADD animation (add new score-member pair)
  // 120-180: Show sorted order by score
  // 180-240: Show ZRANGE operation
  // 240-300: Reset

  const getEntries = () => {
    if (loopFrame < 60) {
      return [
        { score: 1.0, member: 'apple' },
        { score: 2.5, member: 'banana' },
        { score: 3.0, member: 'cherry' },
      ];
    }
    if (loopFrame < 120) {
      return [
        { score: 1.0, member: 'apple' },
        { score: 2.5, member: 'banana' },
        { score: 3.0, member: 'cherry' },
      ];
    }
    return [
      { score: 0.5, member: 'apricot' },
      { score: 1.0, member: 'apple' },
      { score: 2.5, member: 'banana' },
      { score: 3.0, member: 'cherry' },
    ];
  };

  const entries = getEntries();
  const showNewEntry = loopFrame >= 60 && loopFrame < 180;
  const showZrange = loopFrame >= 180 && loopFrame < 240;
  const zaddProgress = loopFrame >= 60 ? Math.min(1, (loopFrame - 60) / 30) : 0;
  const zrangeProgress = loopFrame >= 180 ? Math.min(1, (loopFrame - 180) / 30) : 0;

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
        Sorted Set Commands on ZipList
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
          opacity: loopFrame < 180 ? 1 : 0,
          transform: `scale(${loopFrame < 180 ? 1 : 0.8})`,
          transition: 'all 0.3s',
        }}>
          ZADD
        </div>
        <div style={{
          backgroundColor: COLORS.secondary,
          color: 'white',
          padding: '8px 20px',
          borderRadius: 20,
          fontSize: 18,
          fontWeight: 600,
          opacity: loopFrame >= 180 && loopFrame < 300 ? 1 : 0.5,
          transform: `scale(${loopFrame >= 180 && loopFrame < 300 ? 1 : 0.9})`,
          transition: 'all 0.3s',
        }}>
          ZRANGE
        </div>
      </div>

      {/* ZipList Visualization with Zset entries */}
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
              backgroundColor: COLORS.secondary,
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

        {/* Zset Entries */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
        }}>
          {entries.map((entry, idx) => {
            const isNewEntry = idx === 0 && showNewEntry && loopFrame >= 60 && loopFrame < 120;
            const isHighlighted = showZrange && idx >= 1 && idx <= 2;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: idx < 3 || loopFrame < 180 ? 1 : 0,
                  transform: `
                    ${isNewEntry ? `translateY(${-40 * (1 - zaddProgress)}px) scale(${zaddProgress})` : ''}
                    ${isHighlighted ? `scale(1.05)` : ''}
                  `,
                  transition: 'all 0.3s',
                }}
              >
                {/* Index */}
                <div style={{
                  width: 32,
                  height: 32,
                  backgroundColor: isHighlighted ? COLORS.secondary : COLORS.textMuted + '30',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isHighlighted ? 'white' : COLORS.textMuted,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {idx}
                </div>

                {/* Score */}
                <div style={{
                  padding: '12px 20px',
                  backgroundColor: COLORS.scoreBg,
                  color: 'white',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  minWidth: 80,
                  textAlign: 'center',
                  boxShadow: isHighlighted ? `0 0 15px ${COLORS.secondary}60` : 'none',
                }}>
                  {entry.score}
                </div>

                {/* Arrow */}
                <div style={{
                  color: COLORS.textMuted,
                  fontSize: 20,
                }}>
                  →
                </div>

                {/* Member */}
                <div style={{
                  padding: '12px 24px',
                  backgroundColor: COLORS.memberBg,
                  color: 'white',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  minWidth: 100,
                  textAlign: 'center',
                  boxShadow: isHighlighted ? `0 0 15px ${COLORS.secondary}60` : 'none',
                }}>
                  {entry.member}
                </div>

                {/* Highlight for ZRANGE */}
                {isHighlighted && (
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: COLORS.accent,
                    color: 'white',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: zrangeProgress,
                  }}>
                    RANGE
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* End marker */}
        <div style={{
          position: 'absolute',
          right: -60,
          top: 20,
          width: 40,
          height: 40,
          backgroundColor: COLORS.error,
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

      {/* Sorted by score indicator */}
      <div style={{
        position: 'absolute',
        top: 130,
        right: 80,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: COLORS.textMuted,
        fontSize: 12,
        opacity: loopFrame > 100 ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        <span>sorted by score</span>
        <span style={{ color: COLORS.accent }}>ascending</span>
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
        opacity: showZrange ? 1 : 0,
        transform: `translateY(${showZrange ? 0 : 30}px)`,
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
            ZADD
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.accent,
          }}>
            O(log n)
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
            Add with score
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
            ZRANGE
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.secondary,
          }}>
            O(log n + m)
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
            Range query (m = count)
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
        <span style={{ color: COLORS.primary }}>ZADD</span>: Add score-member pair (sorted by score) |{' '}
        <span style={{ color: COLORS.secondary }}>ZRANGE</span>: Get members by rank range
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
