import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const BYTE_SIZE = 36;
const LOOP_DURATION = 300; // 10 seconds at 30fps

export const PrevlenExpansion: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % LOOP_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    background: '#F8FAFC',
    prevlen: '#38BDF8',   // 浅蓝色
    prevlenExpanded: '#F87171', // 红色 (扩展后)
    encoding: '#A78BFA', // 紫色
    content: '#34D399',  // 绿色
    text: '#1E293B',
    subtext: '#64748B',
    highlight: '#EF4444', // 红色高亮
  };

  const cycleFrame = frame % LOOP_DURATION;

  // Animation phases:
  // 0-60: Show 3 entries, middle one small
  // 60-120: Middle entry grows (content changes)
  // 120-180: Expansion animation - prevlen highlights and expands
  // 180-240: Show expanded state
  // 240-300: Reset

  const phase = Math.floor(cycleFrame / 60);

  const getAppear = (startFrame: number, duration: number = 20) => {
    return Math.min(1, Math.max(0, (cycleFrame - startFrame) / duration));
  };

  const isExpanding = phase >= 2;
  const highlightPrevlen = phase === 2 && cycleFrame % 60 > 30 && cycleFrame % 60 < 50;

  // Middle entry content changes size
  const middleEntrySize = phase === 0 ? 5 : phase === 1 ? 20 : 30;
  const middleEntryContent = 'x'.repeat(Math.min(middleEntrySize, 10));

  const entries = [
    { content: 'hello', prevlen: 0 },
    { content: middleEntryContent, prevlen: phase >= 1 ? 254 : 12 },
    { content: 'world', prevlen: 0 },
  ];

  return (
    <div style={{
      backgroundColor: colors.background,
      fontFamily: theme.fonts.sans,
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.text,
        fontSize: 38,
        fontWeight: 700,
      }}>
        Prevlen 扩展机制
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.subtext,
        fontSize: 16,
      }}>
        当前一个节点长度 {'>='} 254 时，prevlen 需要扩展
      </div>

      {/* Entries Row */}
      <div style={{
        position: 'absolute',
        top: 150,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
      }}>
        {entries.map((entry, idx) => {
          const prevlenSize = entry.prevlen >= 254 ? 5 : 1;
          const isMiddle = idx === 1;
          const entryScale = isMiddle ? (phase >= 1 ? 1 + (phase - 1) * 0.15 : 1) : 1;
          const appear = getAppear(idx * 15);

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: appear,
                transform: `translateY(${(1 - appear) * 20}px) scale(${entryScale})`,
              }}
            >
              {/* Entry Label */}
              <div style={{
                color: colors.subtext,
                fontSize: 14,
                fontFamily: theme.fonts.mono,
                marginBottom: 8,
              }}>
                Entry [{idx}]
              </div>

              {/* Entry Box */}
              <div style={{
                border: `3px solid ${isMiddle && isExpanding ? colors.highlight : colors.text}`,
                borderRadius: 10,
                overflow: 'hidden',
                boxShadow: isMiddle && isExpanding ? `0 0 20px ${colors.highlight}60` : '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
              }}>
                {/* prevlen */}
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: highlightPrevlen && isMiddle ? colors.highlight : colors.prevlen,
                    transition: 'background-color 0.2s',
                  }}
                >
                  {prevlenSize === 1 ? (
                    <div style={{
                      width: BYTE_SIZE,
                      height: BYTE_SIZE,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.background,
                      fontSize: 11,
                      fontFamily: theme.fonts.mono,
                      fontWeight: 700,
                    }}>
                      <div>{entry.prevlen}</div>
                      <div style={{ fontSize: 8, opacity: 0.8 }}>1B</div>
                    </div>
                  ) : (
                    <>
                      <div style={{
                        width: BYTE_SIZE,
                        height: BYTE_SIZE,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.background,
                        fontSize: 11,
                        fontFamily: theme.fonts.mono,
                        fontWeight: 700,
                      }}>
                        <div>0xFE</div>
                        <div style={{ fontSize: 8, opacity: 0.8 }}>mark</div>
                      </div>
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{
                          width: BYTE_SIZE * 0.8,
                          height: BYTE_SIZE,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: highlightPrevlen && isMiddle ? colors.background : colors.text,
                          fontSize: 11,
                          fontFamily: theme.fonts.mono,
                          fontWeight: 600,
                          backgroundColor: highlightPrevlen && isMiddle ? colors.highlight : '#7DD3FC',
                          transition: 'background-color 0.2s',
                        }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* encoding */}
                <div style={{
                  width: '100%',
                  height: BYTE_SIZE,
                  backgroundColor: colors.encoding,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.background,
                  fontSize: 12,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 700,
                }}>
                  enc
                </div>

                {/* content */}
                <div style={{
                  width: isMiddle ? BYTE_SIZE * 3 : BYTE_SIZE * entry.content.length,
                  height: BYTE_SIZE,
                  backgroundColor: colors.content,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.text,
                  fontSize: entry.content.length > 6 ? 10 : 14,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 600,
                }}>
                  {entry.content}
                </div>
              </div>

              {/* Size label */}
              <div style={{
                marginTop: 8,
                color: colors.subtext,
                fontSize: 12,
                fontFamily: theme.fonts.mono,
              }}>
                prevlen: {prevlenSize} {prevlenSize === 1 ? 'byte' : 'bytes'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase Indicator */}
      <div style={{
        position: 'absolute',
        top: 120,
        right: 60,
        backgroundColor: isExpanding ? colors.highlight : '#10B981',
        color: colors.background,
        padding: '6px 16px',
        borderRadius: 16,
        fontSize: 13,
        fontWeight: 600,
        transition: 'background-color 0.3s',
      }}>
        {phase === 0 && '初始状态'}
        {phase === 1 && '节点扩展中...'}
        {phase === 2 && 'Prevlen 扩展!'}
        {phase === 3 && '扩展完成'}
        {phase === 4 && '新 Entry 添加'}
      </div>

      {/* Byte Counter */}
      <div style={{
        position: 'absolute',
        bottom: 140,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 60,
      }}>
        <div style={{
          textAlign: 'center',
          opacity: phase < 2 ? 1 : 0.4,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            fontSize: 36,
            fontWeight: 700,
            color: colors.prevlen,
            fontFamily: theme.fonts.mono,
          }}>
            1
          </div>
          <div style={{ color: colors.subtext, fontSize: 14 }}>字节</div>
          <div style={{ color: colors.subtext, fontSize: 12 }}>(prevlen {'<'} 254)</div>
        </div>

        <div style={{
          fontSize: 36,
          color: colors.subtext,
          display: 'flex',
          alignItems: 'center',
        }}>
          {'->'}
        </div>

        <div style={{
          textAlign: 'center',
          opacity: phase >= 2 ? 1 : 0.4,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            fontSize: 36,
            fontWeight: 700,
            color: colors.highlight,
            fontFamily: theme.fonts.mono,
          }}>
            5
          </div>
          <div style={{ color: colors.subtext, fontSize: 14 }}>字节</div>
          <div style={{ color: colors.subtext, fontSize: 12 }}>(prevlen &gt;= 254)</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
      }}>
        {[
          { color: colors.prevlen, label: 'prevlen (1B)' },
          { color: colors.highlight, label: 'prevlen (5B)' },
          { color: colors.encoding, label: 'encoding' },
          { color: colors.content, label: 'content' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 16,
              height: 16,
              backgroundColor: item.color,
              borderRadius: 3,
            }} />
            <span style={{ color: colors.subtext, fontSize: 13 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.highlight,
        fontSize: 14,
        fontFamily: theme.fonts.mono,
        fontWeight: 600,
      }}>
        {highlightPrevlen && '注意: 扩展 prevlen 需要重新编码后续所有 Entry!'}
      </div>
    </div>
  );
};