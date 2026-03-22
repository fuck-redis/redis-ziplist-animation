import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const LOOP_DURATION = 300; // 10 seconds at 30fps

export const StringEncoding: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % LOOP_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    background: '#F8FAFC',
    str6bit: '#3B82F6',   // 蓝色
    str14bit: '#8B5CF6',  // 紫色
    str32bit: '#10B981',  // 绿色
    text: '#1E293B',
    subtext: '#64748B',
    highlight: '#F59E0B',
  };

  const encodingTypes = [
    { name: 'STR_6BIT', maxLen: 63, marker: '00', bits: 6, desc: '短字符串', color: colors.str6bit },
    { name: 'STR_14BIT', maxLen: 16383, marker: '01', bits: 14, desc: '中等字符串', color: colors.str14bit },
    { name: 'STR_32BIT', maxLen: 4294967295, marker: '10', bits: 32, desc: '长字符串', color: colors.str32bit },
  ];

  const cycleFrame = frame % LOOP_DURATION;
  const currentEncodingIndex = Math.floor(cycleFrame / 100) % encodingTypes.length;
  const phaseInCycle = cycleFrame % 100;

  // Sample strings of different lengths
  const sampleStrings = [
    { str: 'hello', length: 5 },
    { str: 'Hello, Redis!', length: 13 },
    { str: 'This is a much longer string that demonstrates the 32-bit encoding.', length: 67 },
  ];

  const currentStringIndex = Math.floor(cycleFrame / 33) % sampleStrings.length;
  const currentString = sampleStrings[currentStringIndex];

  // Determine which encoding would be used
  const getEncodingForLength = (len: number) => {
    if (len <= 63) return 0;
    if (len <= 16383) return 1;
    return 2;
  };

  const recommendedEncoding = getEncodingForLength(currentString.length);

  const getAppear = (startFrame: number, duration: number = 15) => {
    return Math.min(1, Math.max(0, (phaseInCycle - startFrame) / duration));
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
        top: 35,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.text,
        fontSize: 40,
        fontWeight: 700,
      }}>
        字符串编码 (String Encoding)
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute',
        top: 85,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.subtext,
        fontSize: 16,
      }}>
        根据字符串长度选择最优编码方式
      </div>

      {/* Current String Display */}
      <div style={{
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          backgroundColor: '#F1F5F9',
          borderRadius: 12,
          padding: '20px 40px',
          maxWidth: 500,
        }}>
          <div style={{ color: colors.subtext, fontSize: 14, marginBottom: 8, textAlign: 'center' }}>
            测试字符串
          </div>
          <div style={{
            fontSize: 24,
            fontWeight: 600,
            color: colors.text,
            fontFamily: theme.fonts.mono,
            wordBreak: 'break-all',
            textAlign: 'center',
          }}>
            "{currentString.str}"
          </div>
          <div style={{
            marginTop: 8,
            fontSize: 14,
            color: colors.subtext,
            fontFamily: theme.fonts.mono,
            textAlign: 'center',
          }}>
            长度: <span style={{ color: colors.highlight, fontWeight: 700 }}>{currentString.length}</span> 字符
          </div>
        </div>
      </div>

      {/* Encoding Types */}
      <div style={{
        position: 'absolute',
        top: 280,
        left: 40,
        right: 40,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
      }}>
        {encodingTypes.map((enc, idx) => {
          const isRecommended = idx === recommendedEncoding;
          const isActive = idx === currentEncodingIndex;
          const appear = getAppear(idx * 20);

          return (
            <div
              key={enc.name}
              style={{
                backgroundColor: isActive || isRecommended ? enc.color : '#E2E8F0',
                borderRadius: 16,
                padding: '24px 20px',
                textAlign: 'center',
                opacity: appear,
                transform: `scale(${isRecommended ? 1.02 : 1})`,
                transition: 'all 0.3s',
                boxShadow: isRecommended ? `0 8px 24px ${enc.color}40` : 'none',
                border: isRecommended ? `3px solid ${colors.highlight}` : '3px solid transparent',
              }}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div style={{
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: colors.highlight,
                  color: colors.background,
                  padding: '2px 12px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  推荐
                </div>
              )}

              {/* Type Name */}
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                color: isActive || isRecommended ? colors.background : colors.subtext,
                fontFamily: theme.fonts.mono,
                marginBottom: 12,
              }}>
                {enc.name}
              </div>

              {/* Marker */}
              <div style={{
                fontSize: 14,
                color: isActive || isRecommended ? colors.background : colors.text,
                fontFamily: theme.fonts.mono,
                marginBottom: 8,
                opacity: 0.9,
              }}>
                marker: <span style={{ fontWeight: 700 }}>{enc.marker}</span>
              </div>

              {/* Max Length */}
              <div style={{
                fontSize: 36,
                fontWeight: 800,
                color: isActive || isRecommended ? colors.background : colors.text,
                fontFamily: theme.fonts.mono,
              }}>
                {enc.maxLen.toLocaleString()}
              </div>
              <div style={{
                fontSize: 12,
                color: isActive || isRecommended ? colors.background : colors.subtext,
                opacity: 0.8,
              }}>
                最大长度
              </div>

              {/* Bits */}
              <div style={{
                marginTop: 12,
                fontSize: 14,
                color: isActive || isRecommended ? colors.background : colors.subtext,
                fontFamily: theme.fonts.mono,
              }}>
                {enc.bits} bits length field
              </div>

              {/* Description */}
              <div style={{
                marginTop: 8,
                fontSize: 13,
                color: isActive || isRecommended ? colors.background : colors.subtext,
                opacity: 0.9,
              }}>
                {enc.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Flow */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{
          backgroundColor: '#F1F5F9',
          borderRadius: 10,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ color: colors.subtext, fontSize: 14 }}>长度判断:</span>
          <span style={{
            fontSize: 16,
            fontWeight: 700,
            color: colors.text,
            fontFamily: theme.fonts.mono,
          }}>
            {currentString.length}
          </span>
        </div>

        <div style={{ color: colors.subtext, fontSize: 20 }}>{'?'}</div>

        <div style={{
          display: 'flex',
          gap: 8,
        }}>
          <div style={{
            backgroundColor: currentString.length <= 63 ? colors.str6bit : '#E2E8F0',
            color: currentString.length <= 63 ? colors.background : colors.subtext,
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: theme.fonts.mono,
            fontWeight: 600,
            transition: 'all 0.3s',
          }}>
            63
          </div>
          <div style={{ color: colors.subtext, fontSize: 16 }}>:</div>
          <div style={{
            backgroundColor: currentString.length > 63 && currentString.length <= 16383 ? colors.str14bit : '#E2E8F0',
            color: currentString.length > 63 && currentString.length <= 16383 ? colors.background : colors.subtext,
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: theme.fonts.mono,
            fontWeight: 600,
            transition: 'all 0.3s',
          }}>
            16383
          </div>
          <div style={{ color: colors.subtext, fontSize: 16 }}>:</div>
          <div style={{
            backgroundColor: currentString.length > 16383 ? colors.str32bit : '#E2E8F0',
            color: currentString.length > 16383 ? colors.background : colors.subtext,
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: theme.fonts.mono,
            fontWeight: 600,
            transition: 'all 0.3s',
          }}>
            more
          </div>
        </div>

        <div style={{ color: colors.subtext, fontSize: 20 }}>=</div>

        <div style={{
          backgroundColor: encodingTypes[recommendedEncoding].color,
          color: colors.background,
          padding: '8px 20px',
          borderRadius: 8,
          fontSize: 14,
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
        }}>
          {encodingTypes[recommendedEncoding].name}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
      }}>
        {encodingTypes.map(enc => (
          <div key={enc.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: enc.color,
              borderRadius: 3,
            }} />
            <span style={{ color: colors.subtext, fontSize: 13 }}>{enc.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};