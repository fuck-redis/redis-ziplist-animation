import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const BYTE_SIZE = 32;
const ENTRY_HEIGHT = 50;

export const TraversalMechanism: React.FC<{ title?: string }> = ({ title = '遍历机制' }) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 240);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const titleAppear = Math.min(1, Math.max(0, animationFrame / 20));

  const entries = [
    { content: 'A', offset: 12, size: 4 },
    { content: 'B', offset: 16, size: 4 },
    { content: 'C', offset: 20, size: 5 },
    { content: 'D', offset: 25, size: 4 },
  ];

  // Forward traversal animation
  const currentForwardIndex = Math.min(entries.length - 1, Math.floor(animationFrame / 15));

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
        top: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: 44,
        fontWeight: 700,
        opacity: titleAppear,
        transform: `scale(${titleAppear})`,
      }}>
        {title}
      </div>

      {/* Forward Traversal Section */}
      <div style={{
        position: 'absolute',
        top: 120,
        left: 60,
        right: 60,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
        }}>
          <span style={{
            padding: '6px 16px',
            backgroundColor: theme.colors.primary,
            borderRadius: 20,
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: 700,
          }}>
            正向遍历
          </span>
          <span style={{ color: theme.colors.textMuted, fontSize: 15, fontFamily: theme.fonts.mono }}>
            从头部开始，通过偏移量顺序访问
          </span>
        </div>

        {/* Memory Layout */}
        <div style={{
          display: 'flex',
          gap: 2,
          marginBottom: 20,
          padding: '20px 24px',
          backgroundColor: theme.colors.backgroundLight,
          borderRadius: 12,
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 8,
          }}>
            <div style={{
              padding: '4px 12px',
              backgroundColor: theme.colors.byteHeader,
              borderRadius: 6,
              color: theme.colors.background,
              fontSize: 12,
              fontFamily: theme.fonts.mono,
              fontWeight: 700,
              marginBottom: 8,
            }}>
              Header (12B)
            </div>
            <div style={{
              width: 60,
              height: ENTRY_HEIGHT,
              backgroundColor: theme.colors.byteHeader,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.background,
              fontSize: 12,
              fontFamily: theme.fonts.mono,
            }}>
              zlbytes
              <br />
              zltail
              <br />
              zllen
            </div>
          </div>

          {/* Entries */}
          {entries.map((entry, i) => {
            const isActive = i === currentForwardIndex && animationFrame < 120;
            const isVisited = i < currentForwardIndex && animationFrame < 120;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginRight: 8,
                }}
              >
                <div style={{
                  padding: '4px 12px',
                  backgroundColor: isActive ? theme.colors.warning : theme.colors.byteEntry,
                  borderRadius: 6,
                  color: theme.colors.background,
                  fontSize: 12,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 700,
                  marginBottom: 8,
                  opacity: isVisited ? 0.5 : 1,
                  transform: isActive ? 'scale(1.1)' : undefined,
                  transition: 'all 0.2s',
                }}>
                  Entry {i} @ {entry.offset}
                </div>
                <div style={{
                  width: entry.size * BYTE_SIZE,
                  height: ENTRY_HEIGHT,
                  backgroundColor: isActive ? theme.colors.warning : theme.colors.byteEntry,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.text,
                  fontSize: 18,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 700,
                  opacity: isVisited ? 0.5 : 1,
                  transform: isActive ? 'scale(1.05)' : undefined,
                  boxShadow: isActive ? `0 0 20px ${theme.colors.warning}` : undefined,
                  transition: 'all 0.2s',
                }}>
                  {entry.content}
                </div>
              </div>
            );
          })}

          {/* End Marker */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{
              padding: '4px 12px',
              backgroundColor: theme.colors.error,
              borderRadius: 6,
              color: theme.colors.text,
              fontSize: 12,
              fontFamily: theme.fonts.mono,
              fontWeight: 700,
              marginBottom: 8,
            }}>
              End
            </div>
            <div style={{
              width: BYTE_SIZE,
              height: ENTRY_HEIGHT,
              backgroundColor: theme.colors.error,
              borderRadius: 6,
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
        </div>

        {/* Current Position Info */}
        {animationFrame < 120 && (
          <div style={{
            padding: '12px 20px',
            backgroundColor: `${theme.colors.warning}20`,
            borderRadius: 8,
            border: `2px solid ${theme.colors.warning}`,
            color: theme.colors.text,
            fontSize: 15,
            fontFamily: theme.fonts.mono,
          }}>
            当前访问: Entry {currentForwardIndex} | 偏移量: {entries[currentForwardIndex].offset} | 值: {entries[currentForwardIndex].content}
          </div>
        )}
      </div>

      {/* Backward Traversal Section */}
      {animationFrame >= 100 && (
        <div style={{
          position: 'absolute',
          top: 380,
          left: 60,
          right: 60,
          opacity: Math.min(1, (animationFrame - 100) / 30),
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
          }}>
            <span style={{
              padding: '6px 16px',
              backgroundColor: theme.colors.secondary,
              borderRadius: 20,
              color: theme.colors.text,
              fontSize: 16,
              fontWeight: 700,
            }}>
              反向遍历
            </span>
            <span style={{ color: theme.colors.textMuted, fontSize: 15, fontFamily: theme.fonts.mono }}>
              从尾部开始，通过 prevlen 回溯到前一个节点
            </span>
          </div>

          <div style={{
            padding: '16px 24px',
            backgroundColor: theme.colors.backgroundLight,
            borderRadius: 12,
            border: `2px solid ${theme.colors.secondary}`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              marginBottom: 16,
            }}>
              {/* Tail pointer explanation */}
              <div style={{
                padding: '12px 20px',
                backgroundColor: `${theme.colors.accent}20`,
                borderRadius: 8,
                border: `2px solid ${theme.colors.accent}`,
              }}>
                <div style={{ color: theme.colors.accent, fontSize: 14, marginBottom: 4 }}>zltail 指针</div>
                <div style={{ color: theme.colors.text, fontSize: 16, fontFamily: theme.fonts.mono }}>
                  直接定位到尾节点偏移量: {entries[entries.length - 1].offset}
                </div>
              </div>

              {/* prevlen explanation */}
              <div style={{
                padding: '12px 20px',
                backgroundColor: `${theme.colors.warning}20`,
                borderRadius: 8,
                border: `2px solid ${theme.colors.warning}`,
              }}>
                <div style={{ color: theme.colors.warning, fontSize: 14, marginBottom: 4 }}>prevlen 字段</div>
                <div style={{ color: theme.colors.text, fontSize: 16, fontFamily: theme.fonts.mono }}>
                  每个节点记录前一个节点的大小
                </div>
              </div>
            </div>

            {/* Backward traversal visualization */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ color: theme.colors.textMuted, fontSize: 14 }}>回溯路径:</span>
              {entries.map((_, i) => {
                const idx = entries.length - 1 - Math.floor((animationFrame - 120) / 20);
                const isCurrent = entries.length - 1 - i === idx;
                return (
                  <React.Fragment key={i}>
                    <div style={{
                      padding: '8px 16px',
                      backgroundColor: isCurrent ? theme.colors.secondary : theme.colors.background,
                      borderRadius: 6,
                      border: `2px solid ${isCurrent ? theme.colors.secondary : theme.colors.border}`,
                      color: isCurrent ? theme.colors.text : theme.colors.textMuted,
                      fontSize: 14,
                      fontFamily: theme.fonts.mono,
                      fontWeight: isCurrent ? 700 : 400,
                    }}>
                      [{entries.length - 1 - i}]
                    </div>
                    {i < entries.length - 1 && (
                      <span style={{ color: theme.colors.accent, fontSize: 18 }}>←</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Summary */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: theme.colors.textMuted,
        fontSize: 14,
        fontFamily: theme.fonts.mono,
      }}>
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: theme.colors.primary }}>正向</span>: 通过 offset 顺序访问 |{' '}
          <span style={{ color: theme.colors.secondary }}>反向</span>: 通过 prevlen 回溯
        </div>
        <div>
          ZipList 同时支持 O(1) 尾部访问和 O(n) 遍历
        </div>
      </div>
    </div>
  );
};