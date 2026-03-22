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

const ENCODINGS = [
  { name: 'ziplist', color: '#3B82F6', desc: 'Small hashes/lists' },
  { name: 'quicklist', color: '#8B5CF6', desc: 'Medium lists' },
  { name: 'hashtable', color: '#EF4444', desc: 'Large hashes' },
];

const FRAME_DURATION = 600;

export const EncodingCheckDemo: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % 300;

  // Animation phases
  // 0-60: Show OBJECT ENCODING command
  // 60-120: Show ziplist state (blue)
  // 120-180: Transition to quicklist (purple)
  // 180-240: Transition to hashtable (red)
  // 240-300: Reset

  const currentEncodingIndex = loopFrame < 60 ? 0 : loopFrame < 120 ? 0 : loopFrame < 180 ? 1 : loopFrame < 240 ? 2 : 0;
  const transitionProgress = loopFrame < 120 ? 0 : loopFrame < 180 ? (loopFrame - 120) / 30 : loopFrame < 240 ? (loopFrame - 180) / 30 : 0;

  const commandProgress = Math.min(1, loopFrame / 30);
  const encodingProgress = loopFrame >= 60 ? Math.min(1, (loopFrame - 60) / 30) : 0;

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
        OBJECT ENCODING Detection
      </div>

      {/* Command Input */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          backgroundColor: '#1E293B',
          color: '#10B981',
          padding: '16px 32px',
          borderRadius: 12,
          fontSize: 20,
          fontFamily: 'monospace',
          fontWeight: 600,
          opacity: commandProgress,
          transform: `scale(${0.9 + commandProgress * 0.1})`,
          transition: 'all 0.3s',
        }}>
          {'> OBJECT ENCODING mykey'}
        </div>
      </div>

      {/* Encoding States */}
      <div style={{
        position: 'absolute',
        top: 180,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 60,
      }}>
        {ENCODINGS.map((enc, idx) => {
          const isActive = idx === currentEncodingIndex;
          const isPast = idx < currentEncodingIndex;
          const scale = isActive ? 1.1 : 1;
          const opacity = isPast ? 0.4 : 1;

          return (
            <div
              key={enc.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                opacity,
                transform: `scale(${scale})`,
                transition: 'all 0.4s',
              }}
            >
              <div style={{
                width: 120,
                height: 120,
                backgroundColor: enc.color,
                borderRadius: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? `0 0 40px ${enc.color}80` : 'none',
                transition: 'box-shadow 0.4s',
              }}>
                <div style={{
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 700,
                }}>
                  {idx + 1}
                </div>
              </div>
              <div style={{
                color: COLORS.text,
                fontSize: 18,
                fontWeight: 700,
              }}>
                {enc.name}
              </div>
              <div style={{
                color: COLORS.textMuted,
                fontSize: 12,
                textAlign: 'center',
              }}>
                {enc.desc}
              </div>
              {isActive && (
                <div style={{
                  padding: '4px 12px',
                  backgroundColor: enc.color,
                  color: 'white',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  CURRENT
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transition Arrow */}
      {transitionProgress > 0 && transitionProgress < 1 && (
        <div style={{
          position: 'absolute',
          top: 240,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            padding: '8px 20px',
            backgroundColor: 'white',
            borderRadius: 20,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            color: COLORS.text,
            fontSize: 14,
            fontWeight: 600,
            opacity: transitionProgress,
            transform: `translateX(${(transitionProgress - 0.5) * 100}px)`,
          }}>
            Converting...
          </div>
        </div>
      )}

      {/* Result Display */}
      <div style={{
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          padding: '20px 40px',
          backgroundColor: ENCODINGS[currentEncodingIndex].color,
          color: 'white',
          borderRadius: 16,
          fontSize: 28,
          fontWeight: 700,
          opacity: encodingProgress,
          transform: `scale(${encodingProgress})`,
          transition: 'all 0.3s',
          boxShadow: `0 8px 30px ${ENCODINGS[currentEncodingIndex].color}60`,
        }}>
          "{ENCODINGS[currentEncodingIndex].name}"
        </div>
      </div>

      {/* Encoding Colors Legend */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 30,
      }}>
        {ENCODINGS.map(enc => (
          <div key={enc.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 16,
              height: 16,
              backgroundColor: enc.color,
              borderRadius: 4,
            }} />
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{enc.name}</span>
          </div>
        ))}
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
        Redis automatically converts encoding when size thresholds are exceeded
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
