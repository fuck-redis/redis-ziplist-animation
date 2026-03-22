import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const LOOP_DURATION = 300; // 10 seconds at 30fps

export const IntegerEncoding: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % LOOP_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    background: '#F8FAFC',
    int8: '#3B82F6',    // 蓝色
    int16: '#8B5CF6',   // 紫色
    int24: '#EC4899',   // 粉色
    int32: '#F59E0B',   // 橙色
    int64: '#10B981',   // 绿色
    text: '#1E293B',
    subtext: '#64748B',
    highlight: '#EF4444',
  };

  const encodingTypes = [
    { name: 'INT8', bits: 8, marker: '00', range: '-128 ~ 127', max: 127, color: colors.int8 },
    { name: 'INT16', bits: 16, marker: '01', range: '-32768 ~ 32767', max: 32767, color: colors.int16 },
    { name: 'INT24', bits: 24, marker: '10', range: '-8M ~ 8M', max: 8388607, color: colors.int24 },
    { name: 'INT32', bits: 32, marker: '110', range: '-2G ~ 2G', max: 2147483647, color: colors.int32 },
    { name: 'INT64', bits: 64, marker: '111', range: '-9E ~ 9E', max: Number.MAX_SAFE_INTEGER, color: colors.int64 },
  ];

  const cycleFrame = frame % LOOP_DURATION;
  const currentEncodingIndex = Math.floor(cycleFrame / 60) % encodingTypes.length;
  const phaseInCycle = cycleFrame % 60;

  // Sample values to display
  const sampleValues = [42, 1000, 100000, 1000000000, 9999999999];

  const getAppear = (startFrame: number, duration: number = 15) => {
    return Math.min(1, Math.max(0, (phaseInCycle - startFrame) / duration));
  };

  const currentValue = sampleValues[currentEncodingIndex];
  const currentEncoding = encodingTypes[currentEncodingIndex];

  // Calculate bits needed for current value
  const bitsNeeded = Math.ceil(Math.log2(Math.abs(currentValue) + 1)) + 1;

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
        整数编码 (Integer Encoding)
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
        ZipList 使用 5 种整数编码方式，根据数值大小选择最优编码
      </div>

      {/* Encoding Types Grid */}
      <div style={{
        position: 'absolute',
        top: 130,
        left: 40,
        right: 40,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 12,
      }}>
        {encodingTypes.map((enc, idx) => {
          const isActive = idx === currentEncodingIndex;
          const appear = getAppear(idx * 8);

          return (
            <div
              key={enc.name}
              style={{
                backgroundColor: isActive ? enc.color : '#E2E8F0',
                borderRadius: 12,
                padding: '16px 12px',
                textAlign: 'center',
                opacity: appear * (isActive ? 1 : 0.5),
                transform: `scale(${isActive ? 1.05 : 1})`,
                transition: 'all 0.3s',
                boxShadow: isActive ? `0 8px 24px ${enc.color}40` : 'none',
              }}
            >
              {/* Type Name */}
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: isActive ? colors.background : colors.subtext,
                fontFamily: theme.fonts.mono,
                marginBottom: 8,
              }}>
                {enc.name}
              </div>

              {/* Marker Bits */}
              <div style={{
                fontSize: 14,
                color: isActive ? colors.background : colors.text,
                fontFamily: theme.fonts.mono,
                marginBottom: 6,
                opacity: 0.9,
              }}>
                marker: <span style={{ fontWeight: 700 }}>{enc.marker}</span>
              </div>

              {/* Bits */}
              <div style={{
                fontSize: 28,
                fontWeight: 800,
                color: isActive ? colors.background : colors.text,
                fontFamily: theme.fonts.mono,
              }}>
                {enc.bits}
              </div>
              <div style={{
                fontSize: 12,
                color: isActive ? colors.background : colors.subtext,
                opacity: 0.8,
              }}>
                bits
              </div>

              {/* Range */}
              <div style={{
                marginTop: 12,
                fontSize: 11,
                color: isActive ? colors.background : colors.subtext,
                fontFamily: theme.fonts.mono,
                opacity: 0.9,
              }}>
                {enc.range}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Value Display */}
      <div style={{
        position: 'absolute',
        top: 340,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          color: colors.subtext,
          fontSize: 16,
          marginBottom: 8,
        }}>
          当前数值
        </div>
        <div style={{
          fontSize: 56,
          fontWeight: 800,
          color: currentEncoding.color,
          fontFamily: theme.fonts.mono,
          textShadow: `0 4px 12px ${currentEncoding.color}40`,
          transition: 'all 0.3s',
        }}>
          {currentValue.toLocaleString()}
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 14,
          color: colors.subtext,
          fontFamily: theme.fonts.mono,
        }}>
          推荐编码: <span style={{
            color: currentEncoding.color,
            fontWeight: 700,
          }}>
            {currentEncoding.name}
          </span>
        </div>
      </div>

      {/* Bit Calculation */}
      <div style={{
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
      }}>
        <div style={{
          backgroundColor: '#F1F5F9',
          borderRadius: 12,
          padding: '16px 32px',
          textAlign: 'center',
        }}>
          <div style={{ color: colors.subtext, fontSize: 13 }}>所需位数</div>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.text,
            fontFamily: theme.fonts.mono,
          }}>
            ~{bitsNeeded} bits
          </div>
        </div>

        <div style={{
          backgroundColor: '#F1F5F9',
          borderRadius: 12,
          padding: '16px 32px',
          textAlign: 'center',
        }}>
          <div style={{ color: colors.subtext, fontSize: 13 }}>实际编码</div>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            color: currentEncoding.color,
            fontFamily: theme.fonts.mono,
          }}>
            {currentEncoding.bits} bits
          </div>
        </div>

        <div style={{
          backgroundColor: '#F1F5F9',
          borderRadius: 12,
          padding: '16px 32px',
          textAlign: 'center',
        }}>
          <div style={{ color: colors.subtext, fontSize: 13 }}>marker</div>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.text,
            fontFamily: theme.fonts.mono,
          }}>
            {currentEncoding.marker}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        {encodingTypes.map(enc => (
          <div key={enc.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: enc.color,
              borderRadius: 3,
            }} />
            <span style={{ color: colors.subtext, fontSize: 12 }}>{enc.name}</span>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
      }}>
        {encodingTypes.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: idx === currentEncodingIndex ? encodingTypes[idx].color : '#CBD5E1',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
};