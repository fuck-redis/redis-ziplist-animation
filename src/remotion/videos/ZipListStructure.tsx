import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const BYTE_SIZE = 40;
const HEADER_START_X = 100;
const HEADER_START_Y = 200;
const ENTRY_START_Y = 360;

export const ZipListStructure: React.FC<{ title?: string }> = ({ title = 'ZipList 内存结构' }) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 180);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const headerBytes = [
    { name: 'zlbytes', size: 4, desc: '总字节数' },
    { name: 'zltail', size: 4, desc: '尾节点偏移' },
    { name: 'zllen', size: 4, desc: '节点数量' },
  ];

  const sampleEntries = [
    { content: 'hello', prevlen: 0 },
    { content: '100', prevlen: 8 },
    { content: 'world', prevlen: 11 },
  ];

  const byteOpacity = (byteIndex: number) => {
    const appear = Math.min(1, Math.max(0, (animationFrame - byteIndex * 2) / 15));
    return appear;
  };

  return (
    <div style={{
      backgroundColor: theme.colors.background,
      fontFamily: theme.fonts.sans,
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: 48,
        fontWeight: 700,
      }}>
        {title}
      </div>

      {/* Header Section */}
      <div style={{
        position: 'absolute',
        top: HEADER_START_Y,
        left: HEADER_START_X,
      }}>
        <div style={{ color: theme.colors.textMuted, fontSize: 20, marginBottom: 16 }}>
          头部信息 (12 字节)
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {headerBytes.map((byte, byteIdx) => (
            <div key={byte.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                color: theme.colors.byteHeader,
                fontSize: 14,
                marginBottom: 4,
                fontFamily: theme.fonts.mono,
              }}>
                {byte.name}
              </div>
              <div style={{ display: 'flex' }}>
                {Array.from({ length: byte.size }).map((_, i) => {
                  const opacity = byteOpacity(byteIdx * byte.size + i);
                  return (
                    <div
                      key={i}
                      style={{
                        width: BYTE_SIZE,
                        height: BYTE_SIZE,
                        backgroundColor: theme.colors.byteHeader,
                        border: `2px solid ${theme.colors.background}`,
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.colors.background,
                        fontSize: 12,
                        fontFamily: theme.fonts.mono,
                        fontWeight: 700,
                        opacity: opacity,
                        transform: `scale(${0.5 + opacity * 0.5})`,
                      }}
                    >
                      {String.fromCharCode(65 + (byteIdx * byte.size + i) % 26)}
                    </div>
                  );
                })}
              </div>
              <div style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 4 }}>
                {byte.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Entries Section */}
      <div style={{
        position: 'absolute',
        top: ENTRY_START_Y,
        left: HEADER_START_X,
      }}>
        <div style={{ color: theme.colors.textMuted, fontSize: 20, marginBottom: 16 }}>
          节点区域
        </div>

        {sampleEntries.map((entry, entryIdx) => {
          const entryAppear = Math.min(1, Math.max(0, (animationFrame - 40 - entryIdx * 20) / 20));

          const prevlenSize = entry.prevlen < 254 ? 1 : 5;
          const contentBytes = new TextEncoder().encode(entry.content).length;
          const encodingSize = contentBytes <= 63 ? 1 : contentBytes <= 16383 ? 2 : 5;
          const totalSize = prevlenSize + encodingSize + contentBytes;

          return (
            <div
              key={entryIdx}
              style={{
                display: 'flex',
                marginBottom: 12,
                opacity: entryAppear,
                transform: `translateX(${(1 - entryAppear) * -50}px)`,
              }}
            >
              <div style={{
                width: 60,
                color: theme.colors.textMuted,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                fontFamily: theme.fonts.mono,
              }}>
                [{entryIdx}]
              </div>

              <div style={{ display: 'flex', border: `2px solid ${theme.colors.byteEntry}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'flex' }}>
                  {prevlenSize === 1 ? (
                    <div style={{
                      width: BYTE_SIZE,
                      height: BYTE_SIZE,
                      backgroundColor: theme.colors.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.colors.background,
                      fontSize: 11,
                      fontFamily: theme.fonts.mono,
                    }}>
                      prevlen
                    </div>
                  ) : (
                    <>
                      <div style={{
                        width: BYTE_SIZE,
                        height: BYTE_SIZE,
                        backgroundColor: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.colors.background,
                        fontSize: 11,
                        fontFamily: theme.fonts.mono,
                      }}>
                        0xFE
                      </div>
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{
                          width: BYTE_SIZE,
                          height: BYTE_SIZE,
                          backgroundColor: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.colors.background,
                          fontSize: 10,
                          fontFamily: theme.fonts.mono,
                        }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div style={{
                  width: BYTE_SIZE * encodingSize,
                  height: BYTE_SIZE,
                  backgroundColor: theme.colors.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.text,
                  fontSize: 12,
                  fontFamily: theme.fonts.mono,
                }}>
                  enc
                </div>

                <div style={{
                  width: BYTE_SIZE * contentBytes,
                  height: BYTE_SIZE,
                  backgroundColor: theme.colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.text,
                  fontSize: 14,
                  fontFamily: theme.fonts.mono,
                }}>
                  {entry.content}
                </div>
              </div>

              <div style={{
                marginLeft: 16,
                color: theme.colors.textMuted,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                fontFamily: theme.fonts.mono,
              }}>
                ({totalSize} bytes)
              </div>
            </div>
          );
        })}
      </div>

      {/* End Marker */}
      <div style={{
        position: 'absolute',
        top: ENTRY_START_Y + 200,
        left: HEADER_START_X,
        opacity: animationFrame > 100 ? 1 : 0,
      }}>
        <div style={{ color: theme.colors.textMuted, fontSize: 20, marginBottom: 8 }}>
          结束标志
        </div>
        <div style={{
          width: BYTE_SIZE,
          height: BYTE_SIZE,
          backgroundColor: theme.colors.error,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.text,
          fontSize: 14,
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
        }}>
          FF
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
        gap: 40,
      }}>
        {[
          { color: theme.colors.byteHeader, label: 'Header' },
          { color: theme.colors.accent, label: 'prevlen' },
          { color: theme.colors.secondary, label: 'encoding' },
          { color: theme.colors.primary, label: 'content' },
          { color: theme.colors.error, label: 'End' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20,
              height: 20,
              backgroundColor: item.color,
              borderRadius: 4,
            }} />
            <span style={{ color: theme.colors.textMuted, fontSize: 14 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Explanation Text */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: theme.colors.textMuted,
        fontSize: 16,
        fontFamily: theme.fonts.mono,
      }}>
        <span style={{ color: theme.colors.accent }}>prevlen</span>: 前一个节点的字节数 |{' '}
        <span style={{ color: theme.colors.secondary }}>encoding</span>: 编码方式 |{' '}
        <span style={{ color: theme.colors.primary }}>content</span>: 实际数据
      </div>
    </div>
  );
};
