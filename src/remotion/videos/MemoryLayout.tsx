import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const BYTE_SIZE = 28;

export const MemoryLayout: React.FC<{ title?: string }> = ({ title = '内存布局详解' }) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 180);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const titleAppear = Math.min(1, Math.max(0, animationFrame / 20));

  // Sample memory layout
  const memoryBytes = [
    // Header
    { offset: 0, value: 0x1F, label: 'zlbytes', section: 'header', desc: '总字节数=31' },
    { offset: 1, value: 0x0C, label: '', section: 'header' },
    { offset: 2, value: 0x00, label: '', section: 'header' },
    { offset: 3, value: 0x00, label: '', section: 'header' },
    { offset: 4, value: 0x10, label: 'zltail', section: 'header', desc: '尾偏移=16' },
    { offset: 5, value: 0x00, label: '', section: 'header' },
    { offset: 6, value: 0x00, label: '', section: 'header' },
    { offset: 7, value: 0x00, label: '', section: 'header' },
    { offset: 8, value: 0x02, label: 'zllen', section: 'header', desc: '2个节点' },
    { offset: 9, value: 0x00, label: '', section: 'header' },
    { offset: 10, value: 0x00, label: '', section: 'header' },
    { offset: 11, value: 0x00, label: '', section: 'header' },
    // Entry 0: "a"
    { offset: 12, value: 0x00, label: 'prevlen', section: 'entry', desc: '前置节点=0' },
    { offset: 13, value: 0xFE, label: 'encoding', section: 'entry', desc: 'INT8' },
    { offset: 14, value: 97, label: 'content', section: 'entry', desc: '"a"=97' },
    // Entry 1: "100"
    { offset: 15, value: 0x03, label: 'prevlen', section: 'entry', desc: '前置节点=3' },
    { offset: 16, value: 0xC0, label: 'encoding', section: 'entry', desc: 'INT16' },
    { offset: 17, value: 0x64, label: 'content', section: 'entry', desc: '100低字节' },
    { offset: 18, value: 0x00, label: '', section: 'entry', desc: '100高字节' },
    // End
    { offset: 19, value: 0xFF, label: 'end', section: 'end', desc: '结束标志' },
  ];

  const byteAppear = (idx: number) => Math.min(1, Math.max(0, (animationFrame - 20 - idx * 2) / 15));

  const hoveredByte = Math.min(memoryBytes.length - 1, Math.floor(animationFrame / 10));

  const getByteColor = (section: string) => {
    switch (section) {
      case 'header': return theme.colors.byteHeader;
      case 'entry': return theme.colors.byteEntry;
      case 'end': return theme.colors.error;
      default: return theme.colors.border;
    }
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

      {/* Memory Grid */}
      <div style={{
        position: 'absolute',
        top: 120,
        left: 60,
        right: 60,
      }}>
        <div style={{
          color: theme.colors.textMuted,
          fontSize: 16,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <span>字节级内存视图</span>
          <span style={{
            padding: '4px 12px',
            backgroundColor: theme.colors.backgroundLight,
            borderRadius: 12,
            fontSize: 13,
          }}>
            共 {memoryBytes.length} 字节
          </span>
        </div>

        {/* Byte Grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          padding: 24,
          backgroundColor: theme.colors.backgroundLight,
          borderRadius: 16,
          border: `2px solid ${theme.colors.border}`,
        }}>
          {memoryBytes.map((byte, i) => {
            const isHovered = i === hoveredByte;
            const appear = byteAppear(i);

            return (
              <div
                key={i}
                style={{
                  width: BYTE_SIZE,
                  height: BYTE_SIZE,
                  backgroundColor: getByteColor(byte.section),
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: byte.section === 'header' ? theme.colors.background : theme.colors.text,
                  fontSize: 9,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 600,
                  opacity: appear,
                  transform: `scale(${appear * 0.3 + 0.7})`,
                  boxShadow: isHovered ? `0 0 15px ${getByteColor(byte.section)}` : undefined,
                  transition: 'box-shadow 0.2s',
                  position: 'relative',
                }}
              >
                {byte.value.toString(16).toUpperCase().padStart(2, '0')}
              </div>
            );
          })}
        </div>

        {/* Section Labels */}
        <div style={{
          display: 'flex',
          gap: 20,
          marginTop: 16,
          justifyContent: 'center',
        }}>
          {[
            { label: 'Header', color: theme.colors.byteHeader, range: '0-11' },
            { label: 'Entry 0', color: theme.colors.byteEntry, range: '12-14' },
            { label: 'Entry 1', color: theme.colors.byteEntry, range: '15-18' },
            { label: 'End', color: theme.colors.error, range: '19' },
          ].map(section => (
            <div key={section.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 16,
                height: 16,
                backgroundColor: section.color,
                borderRadius: 4,
              }} />
              <span style={{ color: theme.colors.textMuted, fontSize: 13, fontFamily: theme.fonts.mono }}>
                {section.label} ({section.range})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hovered Byte Details */}
      <div style={{
        position: 'absolute',
        top: 420,
        left: 60,
        right: 60,
        padding: 20,
        backgroundColor: theme.colors.backgroundLight,
        borderRadius: 12,
        border: `2px solid ${getByteColor(memoryBytes[hoveredByte]?.section)}`,
      }}>
        <div style={{
          display: 'flex',
          gap: 40,
        }}>
          <div>
            <div style={{ color: theme.colors.textMuted, fontSize: 12, marginBottom: 4 }}>偏移量</div>
            <div style={{ color: theme.colors.text, fontSize: 28, fontWeight: 700, fontFamily: theme.fonts.mono }}>
              {hoveredByte}
            </div>
          </div>
          <div>
            <div style={{ color: theme.colors.textMuted, fontSize: 12, marginBottom: 4 }}>值 (Hex)</div>
            <div style={{ color: theme.colors.highlight, fontSize: 28, fontWeight: 700, fontFamily: theme.fonts.mono }}>
              0x{memoryBytes[hoveredByte]?.value.toString(16).toUpperCase().padStart(2, '0')}
            </div>
          </div>
          <div>
            <div style={{ color: theme.colors.textMuted, fontSize: 12, marginBottom: 4 }}>值 (Dec)</div>
            <div style={{ color: theme.colors.text, fontSize: 28, fontWeight: 700, fontFamily: theme.fonts.mono }}>
              {memoryBytes[hoveredByte]?.value}
            </div>
          </div>
          <div>
            <div style={{ color: theme.colors.textMuted, fontSize: 12, marginBottom: 4 }}>字段</div>
            <div style={{
              color: theme.colors.text,
              fontSize: 20,
              fontWeight: 600,
              fontFamily: theme.fonts.mono,
              textTransform: 'uppercase',
            }}>
              {memoryBytes[hoveredByte]?.label || '-'}
            </div>
          </div>
        </div>
        {memoryBytes[hoveredByte]?.desc && (
          <div style={{
            marginTop: 12,
            padding: '8px 16px',
            backgroundColor: `${getByteColor(memoryBytes[hoveredByte].section)}20`,
            borderRadius: 8,
            color: theme.colors.text,
            fontSize: 15,
            fontFamily: theme.fonts.mono,
          }}>
            {memoryBytes[hoveredByte].desc}
          </div>
        )}
      </div>

      {/* Little Endian Note */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: theme.colors.textMuted,
        fontSize: 14,
        fontFamily: theme.fonts.mono,
      }}>
        <span style={{ color: theme.colors.accent }}>小端序 (Little Endian)</span>: 多字节数字的低位在前存储
      </div>
    </div>
  );
};