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
  fieldBg: '#06B6D4',
  valueBg: '#8B5CF6',
};

const FRAME_DURATION = 600;

export const HashCommandsDemo: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % 300;

  // Animation phases
  // 0-60: Show initial hash structure
  // 60-120: HSET animation (add new field)
  // 120-180: Show continuous memory layout
  // 180-240: Show HGET operation
  // 240-300: Reset

  const fields = [
    { field: 'name', value: 'Alice' },
    { field: 'age', value: '30' },
    { field: 'city', value: 'NYC' },
  ];

  const showNewField = loopFrame >= 60 && loopFrame < 180;
  const showMemoryLayout = loopFrame >= 120 && loopFrame < 240;
  const showHGET = loopFrame >= 180 && loopFrame < 300;

  const hsetProgress = loopFrame >= 60 ? Math.min(1, (loopFrame - 60) / 30) : 0;
  const memoryProgress = loopFrame >= 120 ? Math.min(1, (loopFrame - 120) / 30) : 0;
  const hgetHighlight = loopFrame >= 180 ? Math.min(1, (loopFrame - 180) / 30) : 0;

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
        Hash Commands on ZipList
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
        }}>
          HSET
        </div>
        <div style={{
          backgroundColor: COLORS.secondary,
          color: 'white',
          padding: '8px 20px',
          borderRadius: 20,
          fontSize: 18,
          fontWeight: 600,
          opacity: loopFrame >= 180 && loopFrame < 300 ? 1 : 0.5,
        }}>
          HGET
        </div>
      </div>

      {/* Hash Field-Value Display */}
      <div style={{
        position: 'absolute',
        top: 150,
        left: 100,
        right: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
      }}>
        {fields.map((item, idx) => {
          const isNewField = idx === 2 && showNewField;
          const isHighlighted = idx === 1 && showHGET;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: idx < 2 || loopFrame < 180 ? 1 : 0,
                transform: `
                  ${isNewField ? `translateY(${-30 * (1 - hsetProgress)}px) scale(${hsetProgress})` : ''}
                  ${isHighlighted ? `scale(1.05)` : ''}
                `,
                transition: 'all 0.3s',
              }}
            >
              {/* Field */}
              <div style={{
                padding: '12px 20px',
                backgroundColor: COLORS.fieldBg,
                color: 'white',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                minWidth: 80,
                textAlign: 'center',
                boxShadow: isHighlighted ? `0 0 20px ${COLORS.secondary}` : 'none',
              }}>
                {item.field}
              </div>

              {/* Arrow */}
              <div style={{
                color: COLORS.textMuted,
                fontSize: 20,
              }}>
                →
              </div>

              {/* Value */}
              <div style={{
                padding: '12px 20px',
                backgroundColor: COLORS.valueBg,
                color: 'white',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                minWidth: 80,
                textAlign: 'center',
                boxShadow: isHighlighted ? `0 0 20px ${COLORS.secondary}` : 'none',
              }}>
                {item.value}
              </div>

              {/* Highlight for HGET */}
              {isHighlighted && (
                <div style={{
                  marginLeft: 10,
                  padding: '4px 12px',
                  backgroundColor: COLORS.accent,
                  color: 'white',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  opacity: hgetHighlight,
                }}>
                  FOUND
                </div>
              )}
            </div>
          );
        })}

        {/* New field being added */}
        {showNewField && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            opacity: hsetProgress,
            transform: `translateY(${-30 * (1 - hsetProgress)}px)`,
          }}>
            <div style={{
              padding: '12px 20px',
              backgroundColor: COLORS.fieldBg,
              color: 'white',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              minWidth: 80,
              textAlign: 'center',
            }}>
              email
            </div>
            <div style={{ color: COLORS.textMuted, fontSize: 20 }}>→</div>
            <div style={{
              padding: '12px 20px',
              backgroundColor: COLORS.valueBg,
              color: 'white',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              minWidth: 80,
              textAlign: 'center',
            }}>
              a@b.com
            </div>
          </div>
        )}
      </div>

      {/* Continuous Memory Layout */}
      <div style={{
        position: 'absolute',
        bottom: showMemoryLayout ? 100 : 300,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        opacity: showMemoryLayout ? memoryProgress : 0,
        transition: 'all 0.5s',
      }}>
        {['f', 'i', 'e', 'l', 'd', 'v', 'a', 'l'].map((byte, i) => (
          <div key={i} style={{
            width: 36,
            height: 36,
            backgroundColor: i % 2 === 0 ? COLORS.fieldBg : COLORS.valueBg,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'monospace',
          }}>
            {byte}
          </div>
        ))}
        <div style={{
          marginLeft: 20,
          padding: '8px 16px',
          backgroundColor: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          color: COLORS.text,
          fontSize: 14,
        }}>
          Continuous Memory
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
        <span style={{ color: COLORS.primary }}>HSET</span>: Set field-value pair |{' '}
        <span style={{ color: COLORS.secondary }}>HGET</span>: Get value by field |{' '}
        Stored as consecutive field-value entries
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
