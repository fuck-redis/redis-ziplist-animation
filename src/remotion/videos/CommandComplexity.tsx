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
};

const COMPLEXITY = {
  O1: { color: '#10B981', label: 'O(1)', desc: 'Constant' },
  On: { color: '#F59E0B', label: 'O(n)', desc: 'Linear' },
  On2: { color: '#EF4444', label: 'O(n²)', desc: 'Quadratic' },
};

const COMMAND_CATEGORIES = [
  {
    category: 'List Commands',
    color: '#3B82F6',
    commands: [
      { name: 'LPUSH', complexity: 'O1' },
      { name: 'RPUSH', complexity: 'O1' },
      { name: 'LPOP', complexity: 'O1' },
      { name: 'RPOP', complexity: 'O1' },
      { name: 'LINDEX', complexity: 'On' },
      { name: 'LINSERT', complexity: 'On' },
    ],
  },
  {
    category: 'Hash Commands',
    color: '#8B5CF6',
    commands: [
      { name: 'HSET', complexity: 'O1' },
      { name: 'HGET', complexity: 'O1' },
      { name: 'HDEL', complexity: 'On' },
      { name: 'HGETALL', complexity: 'On' },
      { name: 'HEXISTS', complexity: 'O1' },
    ],
  },
  {
    category: 'Sorted Set Commands',
    color: '#F59E0B',
    commands: [
      { name: 'ZADD', complexity: 'Olog(n)' },
      { name: 'ZREM', complexity: 'Olog(n)' },
      { name: 'ZRANGE', complexity: 'Olog(n)+On' },
      { name: 'ZRANK', complexity: 'Olog(n)' },
      { name: 'ZSCORE', complexity: 'O1' },
    ],
  },
];

const FRAME_DURATION = 600;

export const CommandComplexity: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % 300;

  // Animation: Category by category reveal
  const categoriesToShow = Math.floor(loopFrame / 80) + 1;
  const categoryProgress = (loopFrame % 80) / 80;

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
        top: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: COLORS.text,
        fontSize: 32,
        fontWeight: 700,
      }}>
        Command Time Complexity
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: 65,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 30,
      }}>
        {Object.entries(COMPLEXITY).map(([key, val]) => (
          <div key={key} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 24,
              height: 24,
              backgroundColor: val.color,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 10,
              fontWeight: 700,
            }}>
              {val.label}
            </div>
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>
              {val.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Command Categories */}
      <div style={{
        position: 'absolute',
        top: 110,
        left: 40,
        right: 40,
        display: 'flex',
        gap: 20,
      }}>
        {COMMAND_CATEGORIES.map((cat, catIdx) => {
          const isVisible = catIdx < categoriesToShow;
          const progress = isVisible ? (catIdx === categoriesToShow - 1 ? categoryProgress : 1) : 0;

          return (
            <div
              key={cat.category}
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                opacity: progress,
                transform: `translateY(${(1 - progress) * 30}px)`,
                transition: 'all 0.3s',
              }}
            >
              {/* Category Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: `2px solid ${cat.color}30`,
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: cat.color,
                  borderRadius: '50%',
                }} />
                <div style={{
                  color: COLORS.text,
                  fontSize: 16,
                  fontWeight: 700,
                }}>
                  {cat.category}
                </div>
              </div>

              {/* Commands */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                {cat.commands.map((cmd, cmdIdx) => {
                  const cmdDelay = cmdIdx * 50;
                  const cmdProgress = Math.max(0, Math.min(1, (progress * 500 - cmdDelay) / 200));
                  const complexityInfo = COMPLEXITY[cmd.complexity as keyof typeof COMPLEXITY] || COMPLEXITY.On;

                  return (
                    <div
                      key={cmd.name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: cmdProgress,
                        transform: `translateX(${(1 - cmdProgress) * -20}px)`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        color: COLORS.text,
                        fontSize: 14,
                        fontFamily: 'monospace',
                        fontWeight: 600,
                      }}>
                        {cmd.name}
                      </div>
                      <div style={{
                        padding: '4px 10px',
                        backgroundColor: complexityInfo.color,
                        color: 'white',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        {cmd.complexity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 14,
      }}>
        <span style={{ color: COLORS.accent }}>O(1)</span>: Instant |{' '}
        <span style={{ color: COLORS.warning }}>O(n)</span>: Linear to elements |{' '}
        <span style={{ color: COLORS.error }}>O(n²)</span>: Grows quadratically
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
