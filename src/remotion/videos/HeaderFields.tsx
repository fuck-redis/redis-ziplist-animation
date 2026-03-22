import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const BYTE_SIZE = 48;
const LOOP_DURATION = 300; // 10 seconds at 30fps

export const HeaderFields: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % LOOP_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    background: '#F8FAFC',
    zlbytes: '#3B82F6',  // 蓝色
    zltail: '#06B6D4',   // 青色
    zllen: '#F59E0B',    // 橙色
    text: '#1E293B',
    subtext: '#64748B',
  };

  const headerFields = [
    { name: 'zlbytes', size: 4, color: colors.zlbytes, value: '00001234' },
    { name: 'zltail', size: 4, color: colors.zltail, value: '00000050' },
    { name: 'zllen', size: 2, color: colors.zllen, value: '0010' },
  ];

  const getFieldAppear = (fieldIndex: number) => {
    const startFrame = fieldIndex * 25;
    return Math.min(1, Math.max(0, (frame - startFrame) / 20));
  };

  const getByteAppear = (fieldIndex: number, byteIndex: number) => {
    const startFrame = fieldIndex * 25 + byteIndex * 3;
    return Math.min(1, Math.max(0, (frame - startFrame) / 10));
  };

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
        top: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.text,
        fontSize: 42,
        fontWeight: 700,
      }}>
        Header 区域布局 (12 字节)
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute',
        top: 95,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.subtext,
        fontSize: 18,
      }}>
        ZipList 头部包含 3 个元数据字段
      </div>

      {/* Header Fields */}
      <div style={{
        position: 'absolute',
        top: 180,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 40,
      }}>
        {headerFields.map((field, fieldIdx) => {
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
                fontSize: 18,
                fontWeight: 700,
                fontFamily: theme.fonts.mono,
                marginBottom: 12,
                backgroundColor: `${field.color}15`,
                padding: '4px 16px',
                borderRadius: 6,
              }}>
                {field.name}
              </div>

              {/* Bytes */}
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: field.size }).map((_, i) => {
                  const byteAppear = getByteAppear(fieldIdx, i);
                  const byteValue = field.value.slice(i * 2, i * 2 + 2);

                  return (
                    <div
                      key={i}
                      style={{
                        width: BYTE_SIZE,
                        height: BYTE_SIZE,
                        backgroundColor: field.color,
                        border: `3px solid ${colors.background}`,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.background,
                        fontSize: 14,
                        fontFamily: theme.fonts.mono,
                        fontWeight: 700,
                        opacity: byteAppear,
                        transform: `scale(${0.5 + byteAppear * 0.5})`,
                        boxShadow: `0 4px 12px ${field.color}40`,
                      }}
                    >
                      {byteValue}
                    </div>
                  );
                })}
              </div>

              {/* Size Label */}
              <div style={{
                color: colors.subtext,
                fontSize: 14,
                marginTop: 8,
                fontFamily: theme.fonts.mono,
              }}>
                {field.size} 字节
              </div>

              {/* Description */}
              <div style={{
                color: colors.subtext,
                fontSize: 13,
                marginTop: 4,
                textAlign: 'center',
                maxWidth: 120,
              }}>
                {fieldIdx === 0 && '总字节数'}
                {fieldIdx === 1 && '尾节点偏移'}
                {fieldIdx === 2 && '节点数量'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Bytes Indicator */}
      <div style={{
        position: 'absolute',
        bottom: 180,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: frame > 180 ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        <div style={{
          backgroundColor: '#10B981',
          color: colors.background,
          padding: '12px 32px',
          borderRadius: 8,
          fontSize: 20,
          fontWeight: 700,
          fontFamily: theme.fonts.mono,
        }}>
          总计: 12 字节 = 4 + 4 + 2 + 2 (endmarker)
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
      }}>
        {headerFields.map(field => (
          <div key={field.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 16,
              height: 16,
              backgroundColor: field.color,
              borderRadius: 4,
            }} />
            <span style={{ color: colors.subtext, fontSize: 14 }}>{field.name}</span>
          </div>
        ))}
      </div>

      {/* Frame indicator */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.subtext,
        fontSize: 12,
        fontFamily: theme.fonts.mono,
      }}>
        Frame: {frame} / {LOOP_DURATION}
      </div>
    </div>
  );
};