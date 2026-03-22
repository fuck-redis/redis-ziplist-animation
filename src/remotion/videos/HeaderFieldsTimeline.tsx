import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

const colors = {
  background: '#F8FAFC',
  zlbytes: '#3B82F6',
  zltail: '#06B6D4',
  zllen: '#F59E0B',
  text: '#1E293B',
  textMuted: '#64748B',
};

const BYTE_SIZE = 52;
const HEADER_FIELDS = [
  { name: 'zlbytes', size: 4, color: colors.zlbytes, desc: '总字节数' },
  { name: 'zltail', size: 4, color: colors.zltail, desc: '尾节点偏移' },
  { name: 'zllen', size: 2, color: colors.zllen, desc: '节点数量' },
];

export const HeaderFieldsTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const duration = 300; // 10 seconds at 30fps
  const loopedFrame = frame % duration;

  // Timeline:
  // 0-30: Title appears
  // 30-150: Each field appears sequentially
  // 150-240: Byte boxes appear within each field
  // 240-300: Summary appears

  const titleOpacity = interpolate(loopedFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleScale = interpolate(loopedFrame, [0, 20], [0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const getFieldAppear = (fieldIndex: number) => {
    const startFrame = 30 + fieldIndex * 40;
    return interpolate(loopedFrame, [startFrame, startFrame + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };

  const getByteAppear = (fieldIndex: number, byteIndex: number) => {
    const fieldStart = 30 + fieldIndex * 40;
    const byteStart = fieldStart + 50 + byteIndex * 5;
    return interpolate(loopedFrame, [byteStart, byteStart + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };

  const summaryOpacity = interpolate(loopedFrame, [240, 270], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, padding: 40 }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
        transform: `scale(${titleScale})`,
      }}>
        <div style={{
          fontSize: 44,
          fontWeight: 700,
          color: colors.text,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}>
          Header 区域字节布局
        </div>
        <div style={{
          fontSize: 20,
          color: colors.textMuted,
          marginTop: 8,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          ZipList 头部包含 3 个元数据字段，共 12 字节
        </div>
      </div>

      {/* Header Fields Visualization */}
      <div style={{
        position: 'absolute',
        top: 160,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 60,
      }}>
        {HEADER_FIELDS.map((field, fieldIdx) => {
          const appear = getFieldAppear(fieldIdx);

          return (
            <div
              key={field.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: appear,
                transform: `translateY(${(1 - appear) * 30}px)`,
              }}
            >
              {/* Field Name */}
              <div style={{
                color: field.color,
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
                marginBottom: 16,
                backgroundColor: `${field.color}15`,
                padding: '8px 20px',
                borderRadius: 8,
                border: `2px solid ${field.color}`,
              }}>
                {field.name}
              </div>

              {/* Bytes */}
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: field.size }).map((_, i) => {
                  const byteAppear = getByteAppear(fieldIdx, i);
                  const byteValue = ['00', '01', '02', '03'][i % 4];

                  return (
                    <div
                      key={i}
                      style={{
                        width: BYTE_SIZE,
                        height: BYTE_SIZE,
                        backgroundColor: field.color,
                        border: `3px solid ${colors.background}`,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.background,
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, Consolas, monospace',
                        fontWeight: 700,
                        opacity: byteAppear,
                        transform: `scale(${0.5 + byteAppear * 0.5})`,
                        boxShadow: `0 4px 16px ${field.color}50`,
                      }}
                    >
                      {byteValue}
                    </div>
                  );
                })}
              </div>

              {/* Size Label */}
              <div style={{
                color: colors.text,
                fontSize: 16,
                marginTop: 12,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
                fontWeight: 600,
              }}>
                {field.size} bytes
              </div>

              {/* Description */}
              <div style={{
                color: colors.textMuted,
                fontSize: 14,
                marginTop: 6,
                textAlign: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>
                {field.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: summaryOpacity,
      }}>
        <div style={{
          backgroundColor: '#10B981',
          color: colors.background,
          padding: '16px 40px',
          borderRadius: 12,
          fontSize: 22,
          fontWeight: 700,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          boxShadow: '0 4px 20px #10B98140',
        }}>
          总计: 4 + 4 + 2 = 10 bytes (不含 endmarker 2B)
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
        {HEADER_FIELDS.map(field => (
          <div key={field.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 20,
              height: 20,
              backgroundColor: field.color,
              borderRadius: 6,
            }} />
            <span style={{ color: colors.textMuted, fontSize: 16, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              {field.name}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
