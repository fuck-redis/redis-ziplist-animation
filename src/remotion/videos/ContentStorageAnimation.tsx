import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

const colors = {
  background: '#F8FAFC',
  integer: '#3B82F6',
  string: '#10B981',
  encoding: '#06B6D4',
  bits: '#F59E0B',
  text: '#1E293B',
  textMuted: '#64748B',
  byte: '#8B5CF6',
};

const BIT_SIZE = 28;

export const ContentStorageAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const duration = 300; // 10 seconds at 30fps
  const loopedFrame = frame % duration;

  // Timeline:
  // 0-30: Title
  // 30-120: Integer 42 encoding
  // 120-180: Transition
  // 180-270: String "Hello" encoding
  // 270-300: Summary

  const phase = loopedFrame < 120 ? 0 : loopedFrame < 180 ? 1 : 2;

  const titleOpacity = interpolate(loopedFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Integer animation
  const intAppear = interpolate(loopedFrame, [30, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const intBits = interpolate(loopedFrame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const intEncoding = interpolate(loopedFrame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // String animation
  const strAppear = interpolate(loopedFrame, [150, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const strBits = interpolate(loopedFrame, [180, 220], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const strEncoding = interpolate(loopedFrame, [220, 270], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Render a single bit
  const renderBit = (value: string, index: number, opacity: number, delay: number = 0) => {
    const bitOpacity = Math.max(0, Math.min(1, (opacity - delay) * 2));
    return (
      <div
        key={index}
        style={{
          width: BIT_SIZE,
          height: BIT_SIZE,
          backgroundColor: bitOpacity > 0 ? colors.bits : '#E2E8F0',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          color: bitOpacity > 0 ? '#FFFFFF' : colors.textMuted,
          opacity: bitOpacity > 0 ? 1 : 0.3,
          transform: `scale(${0.5 + bitOpacity * 0.5})`,
        }}
      >
        {value}
      </div>
    );
  };

  // Integer 42 = 00101010 in binary
  const int42Bits = ['0', '0', '1', '0', '1', '0', '1', '0'];

  // String "Hello" = 72 101 108 108 111 in decimal bytes
  const helloBytes = [72, 101, 108, 108, 111];
  const helloBinary = helloBytes.map(b => b.toString(2).padStart(8, '0'));

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, padding: 40 }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <div style={{
          fontSize: 42,
          fontWeight: 700,
          color: colors.text,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          内容二进制存储过程
        </div>
        <div style={{
          fontSize: 18,
          color: colors.textMuted,
          marginTop: 4,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          整数和字符串的编码方式
        </div>
      </div>

      {/* Integer 42 Section */}
      <div style={{
        position: 'absolute',
        top: 110,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: phase === 0 ? 1 : 0.3,
        transition: 'opacity 0.3s',
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: colors.integer,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          marginBottom: 20,
        }}>
          整数 42 的存储
        </div>

        {/* Value display */}
        <div style={{
          opacity: intAppear,
          transform: `translateY(${(1 - intAppear) * 20}px)`,
          marginBottom: 24,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{
              width: 80,
              height: 80,
              backgroundColor: colors.integer,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              42
            </div>
            <div style={{
              fontSize: 24,
              color: colors.textMuted,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              →
            </div>
            <div style={{
              display: 'flex',
              gap: 4,
            }}>
              {int42Bits.map((bit, i) => renderBit(bit, i, intBits, i * 0.05))}
            </div>
          </div>
        </div>

        {/* Encoding explanation */}
        <div style={{
          opacity: intEncoding,
          transform: `translateY(${(1 - intEncoding) * 20}px)`,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: colors.encoding,
            borderRadius: 8,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ color: '#FFFFFF', fontSize: 12, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              encoding
            </span>
            <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              00111110
            </span>
          </div>
          <div style={{
            fontSize: 14,
            color: colors.textMuted,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            1 字节表示 (value &lt; 64)
          </div>
        </div>

        <div style={{
          marginTop: 16,
          padding: '10px 24px',
          backgroundColor: `${colors.integer}15`,
          borderRadius: 8,
          fontSize: 14,
          color: colors.integer,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          总计: 1 字节 (encoding + value 合并存储)
        </div>
      </div>

      {/* String "Hello" Section */}
      <div style={{
        position: 'absolute',
        top: 340,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: phase === 2 ? 1 : 0.3,
        transition: 'opacity 0.3s',
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: colors.string,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          marginBottom: 20,
        }}>
          字符串 "Hello" 的存储
        </div>

        {/* Value display */}
        <div style={{
          opacity: strAppear,
          transform: `translateY(${(1 - strAppear) * 20}px)`,
          marginBottom: 24,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{
              padding: '12px 24px',
              backgroundColor: colors.string,
              borderRadius: 12,
              fontSize: 24,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              "Hello"
            </div>
            <div style={{
              fontSize: 24,
              color: colors.textMuted,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
            }}>
              →
            </div>
            <div style={{
              display: 'flex',
              gap: 8,
            }}>
              {helloBinary.map((byte, byteIdx) => (
                <div key={byteIdx} style={{ display: 'flex', gap: 2 }}>
                  {byte.split('').map((bit, bitIdx) =>
                    renderBit(bit, byteIdx * 8 + bitIdx, strBits, byteIdx * 0.1 + bitIdx * 0.03)
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Encoding explanation */}
        <div style={{
          opacity: strEncoding,
          transform: `translateY(${(1 - strEncoding) * 20}px)`,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: colors.encoding,
            borderRadius: 8,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: '#FFFFFF', fontSize: 11, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              encoding
            </span>
            <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              00111110
            </span>
          </div>
          <div style={{
            backgroundColor: colors.byte,
            borderRadius: 8,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: '#FFFFFF', fontSize: 11, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              len
            </span>
            <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              00000101
            </span>
          </div>
          <div style={{
            backgroundColor: colors.string,
            borderRadius: 8,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: '#FFFFFF', fontSize: 11, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              content
            </span>
            <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              48 65 6C 6C 6F
            </span>
          </div>
        </div>

        <div style={{
          marginTop: 16,
          padding: '10px 24px',
          backgroundColor: `${colors.string}15`,
          borderRadius: 8,
          fontSize: 14,
          color: colors.string,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          总计: 1 + 1 + 5 = 7 字节
        </div>
      </div>

      {/* Bottom Summary */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
      }}>
        <div style={{
          backgroundColor: colors.integer,
          color: '#FFFFFF',
          padding: '10px 24px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          整数: encoding + value (1B)
        </div>
        <div style={{
          backgroundColor: colors.string,
          color: '#FFFFFF',
          padding: '10px 24px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          字符串: encoding + len + content
        </div>
      </div>
    </AbsoluteFill>
  );
};
