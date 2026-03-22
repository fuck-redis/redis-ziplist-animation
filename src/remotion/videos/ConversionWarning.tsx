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
};

const FRAME_DURATION = 240; // 8 seconds at 30fps

export const ConversionWarning: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % FRAME_DURATION;

  // Animation phases (8 seconds = 240 frames at 30fps)
  // 0-60: Show valid configuration
  // 60-120: Show warning state (value approaching boundary)
  // 120-180: Show error state (value out of bounds)
  // 180-240: Reset

  const getPhase = () => {
    if (loopFrame < 60) return 0;
    if (loopFrame < 120) return 1;
    if (loopFrame < 180) return 2;
    return 3;
  };

  const phase = getPhase();
  const isWarning = phase === 1;
  const isError = phase === 2;
  const blinkOn = Math.floor(loopFrame / 10) % 2 === 0;

  const getBorderColor = () => {
    if (phase === 0) return COLORS.accent;
    if (phase === 1) return COLORS.warning;
    return COLORS.error;
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
        Configuration Warning
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
        配置值越界时的警告提示
      </div>

      {/* Config panels */}
      <div style={{
        position: 'absolute',
        top: 140,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        width: 500,
      }}>
        {/* list-max-ziplist-size */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          border: `3px solid ${getBorderColor()}`,
          boxShadow: (isWarning || isError) && blinkOn ? `0 0 30px ${getBorderColor()}60` : '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'all 0.2s',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.text,
            }}>
              list-max-ziplist-size
            </div>
            <div style={{
              padding: '4px 12px',
              backgroundColor: phase === 0 ? COLORS.accent : phase === 1 ? COLORS.warning : COLORS.error,
              color: 'white',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              opacity: blinkOn || phase === 0 ? 1 : 0.5,
            }}>
              {phase === 0 ? 'VALID' : phase === 1 ? 'WARNING' : 'ERROR'}
            </div>
          </div>

          {/* Value slider visualization */}
          <div style={{
            position: 'relative',
            height: 40,
            backgroundColor: '#F1F5F9',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            {/* Valid range */}
            <div style={{
              position: 'absolute',
              left: '30%',
              width: '40%',
              height: '100%',
              backgroundColor: COLORS.accent + '30',
              borderLeft: `3px solid ${COLORS.accent}`,
              borderRight: `3px solid ${COLORS.accent}`,
            }} />
            <div style={{
              position: 'absolute',
              left: '30%',
              width: '40%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.accent,
              fontSize: 10,
              fontWeight: 600,
            }}>
              Valid Range: -2 ~ 0
            </div>

            {/* Current value marker */}
            <div style={{
              position: 'absolute',
              left: phase === 0 ? '35%' : phase === 1 ? '85%' : '95%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 20,
              height: 20,
              backgroundColor: getBorderColor(),
              borderRadius: '50%',
              boxShadow: `0 0 10px ${getBorderColor()}`,
              transition: 'left 0.5s ease-out',
            }} />
          </div>

          {/* Current value */}
          <div style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
              Current Value:
            </div>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: getBorderColor(),
              fontFamily: 'monospace',
            }}>
              {phase === 0 ? -2 : phase === 1 ? 1 : 3}
            </div>
          </div>
        </div>

        {/* Error message */}
        {isError && (
          <div style={{
            backgroundColor: COLORS.error + '10',
            border: `2px solid ${COLORS.error}`,
            borderRadius: 8,
            padding: 16,
            textAlign: 'center',
            opacity: blinkOn ? 1 : 0.5,
            animation: 'pulse 0.5s infinite',
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: COLORS.error,
              marginBottom: 4,
            }}>
              Invalid Configuration!
            </div>
            <div style={{
              fontSize: 13,
              color: COLORS.error,
            }}>
              Value must be between -2 and 0
            </div>
          </div>
        )}

        {/* Warning message */}
        {isWarning && (
          <div style={{
            backgroundColor: COLORS.warning + '10',
            border: `2px solid ${COLORS.warning}`,
            borderRadius: 8,
            padding: 16,
            textAlign: 'center',
            opacity: blinkOn ? 1 : 0.5,
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: COLORS.warning,
              marginBottom: 4,
            }}>
              Warning: Approaching Boundary
            </div>
            <div style={{
              fontSize: 13,
              color: COLORS.warning,
            }}>
              Value 1 is outside valid range -2 ~ 0
            </div>
          </div>
        )}
      </div>

      {/* Phase indicator */}
      <div style={{
        position: 'absolute',
        top: 120,
        right: 60,
        backgroundColor: getBorderColor(),
        color: 'white',
        padding: '6px 16px',
        borderRadius: 16,
        fontSize: 13,
        fontWeight: 600,
        opacity: blinkOn || phase === 0 ? 1 : 0.5,
      }}>
        {phase === 0 && 'Valid State'}
        {phase === 1 && 'Warning State'}
        {phase === 2 && 'Error State'}
        {phase === 3 && 'Reset'}
      </div>

      {/* Explanation */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
      }}>
        {[
          { color: COLORS.accent, label: 'Valid', desc: '-2 ~ 0' },
          { color: COLORS.warning, label: 'Warning', desc: 'near boundary' },
          { color: COLORS.error, label: 'Error', desc: 'out of range' },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: item.color,
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{item.label}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom info */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 13,
      }}>
        list-max-ziplist-size: 控制 ZipList 转为 QuickList 的阈值<br/>
        正值 = 最大元素数, 负值 = 最大字节数 (通常为 -2 表示 8KB)
      </div>
    </div>
  );
};
