import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const BYTE_SIZE = 44;
const LOOP_DURATION = 300; // 10 seconds at 30fps

export const EntryStructure: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % LOOP_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    background: '#F8FAFC',
    prevlen: '#38BDF8',  // 浅蓝色
    encoding: '#A78BFA', // 紫色
    content: '#34D399',   // 绿色
    text: '#1E293B',
    subtext: '#64748B',
  };

  // Toggle between 1-byte and 5-byte prevlen modes
  const isFiveByte = Math.floor(frame / 150) % 2 === 1;
  const cycleFrame = frame % 150;

  const getAppear = (startFrame: number, duration: number = 30) => {
    return Math.min(1, Math.max(0, (cycleFrame - startFrame) / duration));
  };

  const getScale = (startFrame: number) => {
    const progress = Math.min(1, Math.max(0, (cycleFrame - startFrame) / 15));
    return 0.5 + progress * 0.5;
  };

  // Entry content
  const entryContent = 'hello';

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
        Entry 结构详解
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
        每个节点包含三个部分
      </div>

      {/* Entry Visualization */}
      <div style={{
        position: 'absolute',
        top: 180,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Entry Label */}
        <div style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 20,
          fontFamily: theme.fonts.mono,
        }}>
          Entry [0]
        </div>

        {/* Entry Container */}
        <div style={{
          display: 'flex',
          border: `3px solid ${colors.text}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          {/* prevlen */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              opacity: getAppear(10),
              transform: `scale(${getScale(10)})`,
              transition: 'all 0.2s',
            }}
          >
            {isFiveByte ? (
              // 5-byte mode: 0xFE + 4 bytes
              <>
                <div style={{
                  width: BYTE_SIZE,
                  height: BYTE_SIZE,
                  backgroundColor: colors.prevlen,
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
                  <div style={{ fontSize: 9, opacity: 0.8 }}>marker</div>
                </div>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: BYTE_SIZE,
                    height: BYTE_SIZE,
                    backgroundColor: '#7DD3FC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.text,
                    fontSize: 12,
                    fontFamily: theme.fonts.mono,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </>
            ) : (
              // 1-byte mode
              <div style={{
                width: BYTE_SIZE,
                height: BYTE_SIZE,
                backgroundColor: colors.prevlen,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.background,
                fontSize: 12,
                fontFamily: theme.fonts.mono,
                fontWeight: 700,
              }}>
                <div>prevlen</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>
                  {frame % 50 < 25 ? '<254' : '=12'}
                </div>
              </div>
            )}
          </div>

          {/* encoding */}
          <div style={{
            width: BYTE_SIZE,
            height: BYTE_SIZE,
            backgroundColor: colors.encoding,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.background,
            fontSize: 12,
            fontFamily: theme.fonts.mono,
            fontWeight: 700,
            opacity: getAppear(40),
            transform: `scale(${getScale(40)})`,
          }}>
            <div>enc</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>oding</div>
          </div>

          {/* content */}
          <div style={{
            width: BYTE_SIZE * entryContent.length,
            height: BYTE_SIZE,
            backgroundColor: colors.content,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text,
            fontSize: 16,
            fontFamily: theme.fonts.mono,
            fontWeight: 600,
            opacity: getAppear(70),
            transform: `scale(${getScale(70)})`,
          }}>
            {entryContent}
          </div>
        </div>

        {/* Size labels */}
        <div style={{
          display: 'flex',
          marginTop: 16,
          gap: isFiveByte ? 4 : 0,
        }}>
          <div style={{
            width: isFiveByte ? BYTE_SIZE * 5 : BYTE_SIZE,
            textAlign: 'center',
            color: colors.prevlen,
            fontSize: 14,
            fontFamily: theme.fonts.mono,
            opacity: getAppear(25),
          }}>
            {isFiveByte ? '5 bytes' : '1 byte'}
            <div style={{ fontSize: 11, color: colors.subtext }}>prevlen</div>
          </div>
          <div style={{
            width: BYTE_SIZE,
            textAlign: 'center',
            color: colors.encoding,
            fontSize: 14,
            fontFamily: theme.fonts.mono,
            opacity: getAppear(55),
          }}>
            1-5b
            <div style={{ fontSize: 11, color: colors.subtext }}>encoding</div>
          </div>
          <div style={{
            width: BYTE_SIZE * entryContent.length,
            textAlign: 'center',
            color: colors.content,
            fontSize: 14,
            fontFamily: theme.fonts.mono,
            opacity: getAppear(85),
          }}>
            N bytes
            <div style={{ fontSize: 11, color: colors.subtext }}>content</div>
          </div>
        </div>
      </div>

      {/* Mode Indicator */}
      <div style={{
        position: 'absolute',
        top: 160,
        right: 80,
        backgroundColor: isFiveByte ? '#F59E0B' : '#10B981',
        color: colors.background,
        padding: '8px 20px',
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 600,
        transition: 'background-color 0.3s',
      }}>
        {isFiveByte ? '5字节模式 (prevlen >= 254)' : '1字节模式 (prevlen < 254)'}
      </div>

      {/* Legend */}
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
          { color: colors.prevlen, label: 'prevlen', desc: '前节点长度' },
          { color: colors.encoding, label: 'encoding', desc: '编码方式' },
          { color: colors.content, label: 'content', desc: '实际数据' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20,
              height: 20,
              backgroundColor: item.color,
              borderRadius: 4,
            }} />
            <span style={{ color: colors.text, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
            <span style={{ color: colors.subtext, fontSize: 13 }}>({item.desc})</span>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.subtext,
        fontSize: 14,
        fontFamily: theme.fonts.mono,
      }}>
        当 prevlen {'<'} 254 时使用 1 字节，否则使用 5 字节 (0xFE + 4字节长度)
      </div>
    </div>
  );
};