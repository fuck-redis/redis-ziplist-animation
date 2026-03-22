import React, { useEffect, useState } from 'react';

const FRAME_DURATION = 10 * 30; // 10 seconds at 30fps

export const ConversionTrigger: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const cycleFrame = frame % FRAME_DURATION;

  // Colors as specified
  const colors = {
    background: '#F8FAFC',
    text: '#1E293B',
    textMuted: '#64748B',
    listColor: '#3B82F6',    // Blue for List
    hashColor: '#8B5CF6',    // Purple for Hash
    zsetColor: '#F59E0B',    // Amber for Sorted Set
    arrowColor: '#EF4444',   // Red arrows
    success: '#10B981',      // Green
  };

  const getAnimationProgress = (start: number, duration: number) => {
    return Math.min(1, Math.max(0, (cycleFrame - start) / duration));
  };

  // Three conversion stages
  const conversions = [
    {
      type: 'List',
      from: 'ZipList',
      to: 'QuickList',
      trigger: 'list-max-ziplist-size 超出',
      color: colors.listColor,
      x: 80,
    },
    {
      type: 'Hash',
      from: 'ZipList',
      to: 'HashTable',
      trigger: 'hash-max-ziplist-entries/value 超出',
      color: colors.hashColor,
      x: 480,
    },
    {
      type: 'Sorted Set',
      from: 'ZipList',
      to: 'SkipList',
      trigger: 'zset-max-ziplist-entries/value 超出',
      color: colors.zsetColor,
      x: 880,
    },
  ];

  return (
    <div style={{
      backgroundColor: colors.background,
      fontFamily: 'Inter, system-ui, sans-serif',
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
        fontSize: 42,
        fontWeight: 700,
      }}>
        ZipList 转换为其他结构的触发条件
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute',
        top: 85,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 20,
      }}>
        当配置参数超过阈值时，Redis 自动转换数据结构
      </div>

      {/* Conversions */}
      {conversions.map((conv, idx) => {
        const baseStart = idx * 100;
        const arrowProgress = getAnimationProgress(baseStart + 30, 40);
        const isHighlighted = cycleFrame >= baseStart + 30 && cycleFrame < baseStart + 90;

        return (
          <div key={conv.type} style={{
            position: 'absolute',
            top: 160,
            left: conv.x,
            width: 320,
          }}>
            {/* Type Badge */}
            <div style={{
              backgroundColor: conv.color,
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: 16,
              boxShadow: isHighlighted ? `0 0 20px ${conv.color}40` : 'none',
              transition: 'box-shadow 0.3s',
            }}>
              {conv.type}
            </div>

            {/* From Box */}
            <div style={{
              backgroundColor: '#fff',
              border: `2px solid ${conv.color}`,
              borderRadius: 12,
              padding: '20px 24px',
              textAlign: 'center',
              marginBottom: 12,
              opacity: getAnimationProgress(idx * 100, 30),
              transform: `scale(${0.9 + getAnimationProgress(idx * 100, 30) * 0.1})`,
            }}>
              <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 4 }}>
                当前结构
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: conv.color }}>
                {conv.from}
              </div>
            </div>

            {/* Arrow */}
            <div style={{
              textAlign: 'center',
              height: 50,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                opacity: arrowProgress,
              }}>
                <div style={{
                  width: 40,
                  height: 4,
                  backgroundColor: colors.arrowColor,
                  marginBottom: 4,
                }} />
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: `12px solid ${colors.arrowColor}`,
                  margin: '0 auto',
                }} />
              </div>
            </div>

            {/* Trigger Text */}
            <div style={{
              backgroundColor: colors.arrowColor + '15',
              border: `1px solid ${colors.arrowColor}30`,
              borderRadius: 8,
              padding: '8px 12px',
              textAlign: 'center',
              marginBottom: 12,
              opacity: arrowProgress,
              transform: `translateY(${(1 - arrowProgress) * 20}px)`,
            }}>
              <div style={{ fontSize: 12, color: colors.arrowColor, fontWeight: 600 }}>
                触发条件
              </div>
              <div style={{ fontSize: 14, color: colors.text, marginTop: 4 }}>
                {conv.trigger}
              </div>
            </div>

            {/* Arrow 2 */}
            <div style={{
              textAlign: 'center',
              height: 50,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                opacity: getAnimationProgress(baseStart + 70, 30),
              }}>
                <div style={{
                  width: 40,
                  height: 4,
                  backgroundColor: colors.arrowColor,
                  marginBottom: 4,
                }} />
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: `12px solid ${colors.arrowColor}`,
                  margin: '0 auto',
                }} />
              </div>
            </div>

            {/* To Box */}
            <div style={{
              backgroundColor: '#fff',
              border: `2px solid ${colors.success}`,
              borderRadius: 12,
              padding: '20px 24px',
              textAlign: 'center',
              opacity: getAnimationProgress(baseStart + 80, 20),
              transform: `scale(${0.9 + getAnimationProgress(baseStart + 80, 20) * 0.1})`,
            }}>
              <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 4 }}>
                转换后
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.success }}>
                {conv.to}
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Legend */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: colors.listColor, borderRadius: 4 }} />
          <span style={{ color: colors.textMuted, fontSize: 14 }}>List</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: colors.hashColor, borderRadius: 4 }} />
          <span style={{ color: colors.textMuted, fontSize: 14 }}>Hash</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: colors.zsetColor, borderRadius: 4 }} />
          <span style={{ color: colors.textMuted, fontSize: 14 }}>Sorted Set</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 12,
      }}>
        {Math.floor((cycleFrame / FRAME_DURATION) * 10)}s / 10s
      </div>
    </div>
  );
};
