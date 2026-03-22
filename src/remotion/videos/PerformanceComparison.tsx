import React, { useEffect, useState } from 'react';

const FRAME_DURATION = 12 * 30; // 12 seconds at 30fps

export const PerformanceComparison: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAME_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const cycleFrame = frame % FRAME_DURATION;

  const colors = {
    background: '#F8FAFC',
    text: '#1E293B',
    textMuted: '#64748B',
    o1: '#10B981',      // O(1) - Green
    on: '#F59E0B',       // O(n) - Yellow/Orange
    on2: '#EF4444',      // O(n²) - Red
    ziplist: '#3B82F6',
    quicklist: '#8B5CF6',
    linkedlist: '#EC4899',
  };

  const getAnimationProgress = (start: number, duration: number) => {
    return Math.min(1, Math.max(0, (cycleFrame - start) / duration));
  };

  // Operations with their complexities for each structure
  const operations = [
    { name: 'LPUSH/RPUSH', o1: 'O(1)', on: '-', on2: '-', highlight: 'O(1)' },
    { name: 'LPOP/RPOP', o1: 'O(1)', on: '-', on2: '-', highlight: 'O(1)' },
    { name: 'LINDEX', o1: '-', on: 'O(n)', on2: '-', highlight: 'O(n)' },
    { name: 'LINSERT', o1: '-', on: 'O(n)', on2: '-', highlight: 'O(n)' },
    { name: 'LRANGE', o1: '-', on: 'O(n)', on2: '-', highlight: 'O(n)' },
    { name: 'HSET/HGET', o1: 'O(1)', on: '-', on2: '-', highlight: 'O(1)' },
    { name: 'HGETALL', o1: '-', on: 'O(n)', on2: '-', highlight: 'O(n)' },
    { name: 'ZADD', o1: 'O(log n)', on: '-', on2: '-', highlight: 'O(log n)' },
  ];

  // Bar chart data
  const complexityBars = [
    { label: 'O(1)', value: 15, color: colors.o1, desc: '常量时间' },
    { label: 'O(log n)', value: 50, color: colors.on, desc: '对数时间' },
    { label: 'O(n)', value: 100, color: colors.on, desc: '线性时间' },
    { label: 'O(n²)', value: 200, color: colors.on2, desc: '平方时间' },
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
        top: 25,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.text,
        fontSize: 38,
        fontWeight: 700,
      }}>
        各操作在不同数据结构的复杂度
      </div>

      {/* Left side - Complexity bar chart */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 50,
        width: 280,
      }}>
        <div style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 20,
        }}>
          复杂度等级
        </div>

        {complexityBars.map((bar, idx) => {
          const barProgress = getAnimationProgress(idx * 30 + 10, 40);
          const maxWidth = 200;

          return (
            <div key={bar.label} style={{
              marginBottom: 20,
              opacity: barProgress,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
                <span style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {bar.label}
                </span>
                <span style={{ color: colors.textMuted, fontSize: 14 }}>
                  {bar.desc}
                </span>
              </div>
              <div style={{
                height: 24,
                backgroundColor: '#E2E8F0',
                borderRadius: 6,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: (bar.value / 200) * maxWidth * barProgress,
                  height: '100%',
                  backgroundColor: bar.color,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 12,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 12,
                }}>
                  {bar.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right side - Operation table */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 380,
        right: 50,
      }}>
        <div style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 20,
        }}>
          操作复杂度对照表
        </div>

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: 12,
          padding: '12px 16px',
          backgroundColor: colors.text,
          borderRadius: '8px 8px 0 0',
        }}>
          <div style={{ color: '#fff', fontWeight: 600 }}>操作</div>
          <div style={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>ZipList</div>
          <div style={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>QuickList</div>
          <div style={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>LinkedList</div>
        </div>

        {/* Rows */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #E2E8F0',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden',
        }}>
          {operations.map((op, idx) => {
            const rowProgress = getAnimationProgress(80 + idx * 20, 20);
            const isEven = idx % 2 === 0;

            return (
              <div key={op.name} style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                gap: 12,
                padding: '14px 16px',
                backgroundColor: isEven ? '#F8FAFC' : '#fff',
                borderBottom: idx < operations.length - 1 ? '1px solid #E2E8F0' : 'none',
                opacity: rowProgress,
                transform: `translateX(${(1 - rowProgress) * 30}px)`,
              }}>
                <div style={{
                  color: colors.text,
                  fontWeight: 500,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 14,
                }}>
                  {op.name}
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '4px 8px',
                  borderRadius: 4,
                  backgroundColor: op.o1 !== '-' ? colors.o1 + '20' : 'transparent',
                  color: op.o1 !== '-' ? colors.o1 : colors.textMuted,
                  fontWeight: op.o1 !== '-' ? 600 : 400,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                }}>
                  {op.o1}
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '4px 8px',
                  borderRadius: 4,
                  backgroundColor: op.on !== '-' ? colors.on + '20' : 'transparent',
                  color: op.on !== '-' ? colors.on : colors.textMuted,
                  fontWeight: op.on !== '-' ? 600 : 400,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                }}>
                  {op.on}
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '4px 8px',
                  borderRadius: 4,
                  backgroundColor: op.on2 !== '-' ? colors.on2 + '20' : 'transparent',
                  color: op.on2 !== '-' ? colors.on2 : colors.textMuted,
                  fontWeight: op.on2 !== '-' ? 600 : 400,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                }}>
                  {op.on2}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
          <div style={{ width: 16, height: 16, backgroundColor: colors.o1, borderRadius: 4 }} />
          <span style={{ color: colors.textMuted, fontSize: 14 }}>O(1) - 最优</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: colors.on, borderRadius: 4 }} />
          <span style={{ color: colors.textMuted, fontSize: 14 }}>O(n) - 一般</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: colors.on2, borderRadius: 4 }} />
          <span style={{ color: colors.textMuted, fontSize: 14 }}>O(n²) - 避免</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 12,
      }}>
        {Math.floor((cycleFrame / FRAME_DURATION) * 12)}s / 12s
      </div>
    </div>
  );
};
