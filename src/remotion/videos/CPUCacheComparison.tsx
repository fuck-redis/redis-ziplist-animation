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
  cacheLine: '#8B5CF6',
  hit: '#10B981',
  miss: '#EF4444',
};

const FRAME_DURATION = 360; // 12 seconds at 30fps

export const CPUCacheComparison: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const loopFrame = frame % FRAME_DURATION;

  // Animation phases (12 seconds = 360 frames at 30fps)
  // 0-60: Show ZipList with cache line hits
  // 60-120: Show LinkedList with cache line misses
  // 120-180: Side by side comparison
  // 180-300: Detailed comparison animation
  // 300-360: Reset

  const getPhase = () => {
    if (loopFrame < 60) return 0;
    if (loopFrame < 120) return 1;
    if (loopFrame < 180) return 2;
    if (loopFrame < 300) return 3;
    return 4;
  };

  const phase = getPhase();
  const showZipList = phase === 0 || phase === 2 || phase === 3;
  const showLinkedList = phase === 1 || phase === 2 || phase === 3;

  const getCacheAccess = () => {
    if (!showZipList && !showLinkedList) return -1;
    if (phase === 0 || phase === 1) {
      return Math.floor((loopFrame % 60) / 10);
    }
    return Math.floor((loopFrame % 60) / 15);
  };

  const cacheAccess = getCacheAccess();

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
        CPU Cache Comparison
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
        ZipList 连续内存 vs LinkedList 分散内存
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
        {phase === 0 && 'ZipList Cache Hits'}
        {phase === 1 && 'LinkedList Cache Misses'}
        {phase === 2 && 'Side by Side'}
        {phase === 3 && 'Comparison'}
        {phase === 4 && 'Reset'}
      </div>

      <div style={{
        position: 'absolute',
        top: 150,
        left: 60,
        right: 60,
        display: 'flex',
        gap: 40,
      }}>
        {/* ZipList Side */}
        <div style={{
          flex: 1,
          opacity: showZipList ? 1 : 0.3,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.primary,
            marginBottom: 16,
          }}>
            ZipList
          </div>

          {/* Cache visualization */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            {/* Cache line */}
            <div style={{
              backgroundColor: COLORS.cacheLine + '20',
              border: `2px solid ${COLORS.cacheLine}`,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11,
                color: COLORS.textMuted,
                marginBottom: 8,
              }}>
                Cache Line (64 bytes)
              </div>
              <div style={{
                display: 'flex',
                gap: 4,
              }}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} style={{
                    width: 32,
                    height: 32,
                    backgroundColor: cacheAccess >= idx ? COLORS.hit : COLORS.cacheLine + '30',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700,
                    transition: 'background-color 0.2s',
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                ))}
                <div style={{
                  width: 32,
                  height: 32,
                  backgroundColor: COLORS.textMuted + '30',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.textMuted,
                  fontSize: 10,
                }}>
                  ...
                </div>
              </div>
            </div>

            {/* Memory layout */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              marginBottom: 12,
            }}>
              {Array.from({ length: 20 }).map((_, idx) => (
                <div key={idx} style={{
                  width: 16,
                  height: 16,
                  backgroundColor: Math.floor(idx / 6) === Math.floor(cacheAccess / 6) && cacheAccess >= 0
                    ? COLORS.hit
                    : COLORS.primary + '40',
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                }} />
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
            }}>
              <div style={{
                padding: '8px 16px',
                backgroundColor: COLORS.hit + '15',
                borderRadius: 8,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.hit }}>HIT</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>Cache Line 0</div>
              </div>
            </div>
          </div>
        </div>

        {/* LinkedList Side */}
        <div style={{
          flex: 1,
          opacity: showLinkedList ? 1 : 0.3,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.secondary,
            marginBottom: 16,
          }}>
            LinkedList
          </div>

          {/* Cache visualization */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            {/* Multiple cache lines (showing misses) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              {Array.from({ length: 4 }).map((_, lineIdx) => (
                <div key={lineIdx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: cacheAccess === lineIdx ? COLORS.miss : COLORS.textMuted + '20',
                    borderRadius: 4,
                    fontSize: 10,
                    color: cacheAccess === lineIdx ? 'white' : COLORS.textMuted,
                    fontFamily: 'monospace',
                  }}>
                    Line {lineIdx}
                  </div>
                  <div style={{
                    width: 80,
                    height: 24,
                    backgroundColor: cacheAccess === lineIdx ? COLORS.miss + '40' : COLORS.textMuted + '20',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cacheAccess === lineIdx ? COLORS.miss : COLORS.textMuted,
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    {cacheAccess === lineIdx ? 'MISS!' : '---'}
                  </div>
                </div>
              ))}
            </div>

            {/* Memory layout - scattered */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 16,
              marginBottom: 12,
            }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    backgroundColor: cacheAccess === idx ? COLORS.miss : COLORS.secondary + '40',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700,
                    transition: 'background-color 0.2s',
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div style={{
                    fontSize: 8,
                    color: COLORS.textMuted,
                    fontFamily: 'monospace',
                  }}>
                    @0x{1000 + idx * 0x500}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
            }}>
              <div style={{
                padding: '8px 16px',
                backgroundColor: COLORS.miss + '15',
                borderRadius: 8,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.miss }}>MISS</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>Different Lines</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance comparison */}
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
          { label: 'Cache Hits', ziplist: '90%', linkedlist: '25%', color: COLORS.hit },
          { label: 'Access Time', ziplist: '~1ns', linkedlist: '~100ns', color: COLORS.warning },
          { label: 'Prefetch', ziplist: 'Yes', linkedlist: 'No', color: COLORS.accent },
        ].map(item => (
          <div key={item.label} style={{
            backgroundColor: 'white',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center',
            minWidth: 140,
          }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>{item.label}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 600 }}>ZipList</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.ziplist}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.secondary, fontWeight: 600 }}>Linked</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.linkedlist}</div>
              </div>
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
          { color: COLORS.hit, label: 'Cache Hit' },
          { color: COLORS.miss, label: 'Cache Miss' },
          { color: COLORS.cacheLine, label: 'Cache Line' },
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
