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
  quicklistBg: '#06B6D4',
};

const FRAME_DURATION = 360; // 12 seconds at 30fps

export const ZipListToQuickList: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % FRAME_DURATION;

  // Animation phases (12 seconds = 360 frames at 30fps)
  // 0-60: Show large single ZipList
  // 60-120: ZipList starts to split
  // 120-240: Split into multiple smaller ZipLists with pointers
  // 240-300: Show final QuickList structure
  // 300-360: Reset

  const getPhase = () => {
    if (loopFrame < 60) return 0;
    if (loopFrame < 120) return 1;
    if (loopFrame < 240) return 2;
    if (loopFrame < 300) return 3;
    return 4;
  };

  const phase = getPhase();
  const isConverting = phase === 1;
  const isSplit = phase >= 2;

  // Generate ZipList entries
  const generateEntries = (count: number, content: string = 'A') => {
    return Array.from({ length: count }, (_, i) => ({
      content: content.repeat(i + 1),
      size: 3 + i,
    }));
  };

  const largeZipListEntries = generateEntries(8, 'M');
  const smallZipListEntries = generateEntries(3, 'S');

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
        ZipList to QuickList Conversion
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
        当 ZipList 超过阈值时，转换为 QuickList
      </div>

      {/* Phase indicator */}
      <div style={{
        position: 'absolute',
        top: 120,
        right: 60,
        backgroundColor: phase === 1 ? COLORS.warning : COLORS.accent,
        color: 'white',
        padding: '6px 16px',
        borderRadius: 16,
        fontSize: 13,
        fontWeight: 600,
      }}>
        {phase === 0 && 'Large ZipList'}
        {phase === 1 && 'Converting...'}
        {phase === 2 && 'Splitting...'}
        {phase === 3 && 'QuickList Created'}
        {phase === 4 && 'Reset'}
      </div>

      {/* Before: Single Large ZipList */}
      <div style={{
        position: 'absolute',
        top: 160,
        left: 60,
        right: 60,
        opacity: isSplit ? 0 : 1,
        transform: isSplit ? 'scale(0.8)' : 'scale(1)',
        transition: 'all 0.5s',
      }}>
        <div style={{
          textAlign: 'center',
          color: COLORS.textMuted,
          fontSize: 14,
          marginBottom: 12,
        }}>
          Before: Single Large ZipList
        </div>

        {/* Large ZipList */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          flexWrap: 'wrap',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            gap: 4,
            marginRight: 12,
          }}>
            {['zlbytes', 'zltail', 'zllen'].map(h => (
              <div key={h} style={{
                padding: '6px 10px',
                backgroundColor: COLORS.secondary,
                color: 'white',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 600,
              }}>
                {h}
              </div>
            ))}
          </div>

          {/* Entries */}
          {largeZipListEntries.map((entry, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: COLORS.ziplistBg,
                  color: 'white',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}>
                  prev
                </div>
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}>
                  {entry.content}
                </div>
              </div>
              {idx < largeZipListEntries.length - 1 && (
                <div style={{
                  color: COLORS.textMuted,
                  fontSize: 16,
                  margin: '0 2px',
                }}>
                  →
                </div>
              )}
            </React.Fragment>
          ))}

          {/* End marker */}
          <div style={{
            marginLeft: 12,
            padding: '6px 10px',
            backgroundColor: COLORS.error,
            color: 'white',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
          }}>
            FF
          </div>
        </div>

        {/* Size indicator */}
        <div style={{
          textAlign: 'center',
          marginTop: 12,
          color: COLORS.warning,
          fontSize: 14,
          fontWeight: 600,
        }}>
          Size: 2048 bytes (exceeds threshold)
        </div>
      </div>

      {/* After: QuickList */}
      <div style={{
        position: 'absolute',
        top: 160,
        left: 60,
        right: 60,
        opacity: isSplit ? 1 : 0,
        transform: isSplit ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.5s',
      }}>
        <div style={{
          textAlign: 'center',
          color: COLORS.textMuted,
          fontSize: 14,
          marginBottom: 12,
        }}>
          After: QuickList (多个小 ZipList 通过指针连接)
        </div>

        {/* QuickList */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}>
          {smallZipListEntries.map((_, zlIdx) => (
            <React.Fragment key={zlIdx}>
              {/* Mini ZipList */}
              <div style={{
                padding: 12,
                backgroundColor: COLORS.ziplistBg + '20',
                borderRadius: 8,
                border: `2px solid ${COLORS.ziplistBg}`,
              }}>
                <div style={{
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}>
                  {/* Header */}
                  <div style={{
                    padding: '4px 6px',
                    backgroundColor: COLORS.secondary,
                    color: 'white',
                    borderRadius: 3,
                    fontSize: 8,
                    fontWeight: 600,
                  }}>
                    H
                  </div>
                  {/* Entries */}
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
                      {String.fromCharCode(65 + eIdx)}
                    </div>
                  ))}
                  {/* End */}
                  <div style={{
                    padding: '4px 6px',
                    backgroundColor: COLORS.error,
                    color: 'white',
                    borderRadius: 3,
                    fontSize: 8,
                    fontWeight: 700,
                  }}>
                    FF
                  </div>
                </div>
              </div>

              {/* Pointer arrow */}
              {zlIdx < smallZipListEntries.length - 1 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <div style={{
                    width: 40,
                    height: 2,
                    backgroundColor: COLORS.quicklistBg,
                  }} />
                  <div style={{
                    padding: '2px 6px',
                    backgroundColor: COLORS.quicklistBg,
                    color: 'white',
                    borderRadius: 4,
                    fontSize: 8,
                    fontWeight: 600,
                  }}>
                    L0
                  </div>
                  <div style={{
                    width: 40,
                    height: 2,
                    backgroundColor: COLORS.quicklistBg,
                  }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Size indicator */}
        <div style={{
          textAlign: 'center',
          marginTop: 12,
          color: COLORS.accent,
          fontSize: 14,
          fontWeight: 600,
        }}>
          Each ZipList: ~256 bytes | Total: 3 × 256 = 768 bytes
        </div>
      </div>

      {/* Arrow between states */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: isConverting ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        <div style={{
          padding: '12px 24px',
          backgroundColor: COLORS.warning,
          color: 'white',
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 700,
          boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
        }}>
          →
        </div>
      </div>

      {/* Benefits panel */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        opacity: isSplit ? 1 : 0,
        transition: 'opacity 0.5s',
      }}>
        {[
          { label: 'Better Cache', value: '64B per entry' },
          { label: 'Faster Insert', value: 'O(1) head/tail' },
          { label: 'Memory Efficient', value: 'No overhead' },
        ].map(item => (
          <div key={item.label} style={{
            backgroundColor: 'white',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>{item.value}</div>
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
          { color: COLORS.ziplistBg, label: 'ZipList' },
          { color: COLORS.quicklistBg, label: 'Pointer' },
          { color: COLORS.secondary, label: 'Header' },
          { color: COLORS.error, label: 'End Marker' },
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
