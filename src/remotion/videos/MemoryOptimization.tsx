import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const LOOP_DURATION = 360; // 12 seconds at 30fps

export const MemoryOptimization: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % LOOP_DURATION);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    background: '#F8FAFC',
    linkedList: '#EF4444',    // 红色 - LinkedList
    ziplist: '#10B981',       // 绿色 - ZipList
    pointer: '#8B5CF6',       // 紫色 - 指针
    text: '#1E293B',
    subtext: '#64748B',
    saved: '#3B82F6',         // 蓝色 - 节省
  };

  const cycleFrame = frame % LOOP_DURATION;

  // Phases:
  // 0-60: Show LinkedList structure
  // 60-120: Show ZipList structure
  // 120-240: Comparison
  // 240-360: Counter animation

  const phase = Math.floor(cycleFrame / 90);

  const getAppear = (startFrame: number, duration: number = 20) => {
    return Math.min(1, Math.max(0, (cycleFrame - startFrame) / duration));
  };

  const getFade = (startFrame: number, duration: number = 30) => {
    const progress = (cycleFrame - startFrame) / duration;
    if (progress < 0) return 1;
    if (progress > 1) return 0;
    return 1 - progress;
  };

  // Memory calculations
  const nodeCount = 5;
  const prevSize = 8;
  const nextSize = 8;
  const dataSize = 8;

  const linkedListTotal = nodeCount * (prevSize + nextSize + dataSize); // Without pointers for fair comparison

  // ZipList: compact, no pointers
  const ziplistPerNode = 1 + 1 + 8; // prevlen + encoding + data (approx)
  const ziplistTotal = nodeCount * ziplistPerNode + 12 + 1; // + header + end marker

  const savings = ((linkedListTotal - ziplistTotal) / linkedListTotal * 100).toFixed(1);

  // Animated counter
  const counterProgress = phase === 3 ? Math.min(1, (cycleFrame - 270) / 90) : phase > 3 ? 1 : 0;
  const displaySavings = (parseFloat(savings) * counterProgress).toFixed(1);

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
        top: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.text,
        fontSize: 38,
        fontWeight: 700,
      }}>
        内存优化对比
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute',
        top: 78,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.subtext,
        fontSize: 15,
      }}>
        LinkedList vs ZipList 内存占用对比
      </div>

      {/* LinkedList Section */}
      <div style={{
        position: 'absolute',
        top: 120,
        left: 40,
        width: '38%',
        opacity: getFade(0, 30),
        transform: `translateX(${getFade(0, 30) * -50}px)`,
      }}>
        <div style={{
          color: colors.linkedList,
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 12,
          fontFamily: theme.fonts.mono,
        }}>
          LinkedList
        </div>

        {/* Node visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: nodeCount }).map((_, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                opacity: getAppear(10 + idx * 10),
              }}
            >
              {/* Node box */}
              <div style={{
                display: 'flex',
                border: `3px solid ${colors.linkedList}`,
                borderRadius: 8,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  backgroundColor: '#FEE2E2',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.linkedList,
                  fontSize: 9,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 600,
                }}>
                  <div>prev</div>
                  <div style={{ fontSize: 8, opacity: 0.7 }}>{prevSize}B</div>
                </div>
                <div style={{
                  width: 36,
                  height: 36,
                  backgroundColor: '#FECACA',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.linkedList,
                  fontSize: 9,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 600,
                }}>
                  <div>data</div>
                  <div style={{ fontSize: 8, opacity: 0.7 }}>{dataSize}B</div>
                </div>
                <div style={{
                  width: 36,
                  height: 36,
                  backgroundColor: '#FEE2E2',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.linkedList,
                  fontSize: 9,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 600,
                }}>
                  <div>next</div>
                  <div style={{ fontSize: 8, opacity: 0.7 }}>{nextSize}B</div>
                </div>
              </div>

              {/* Pointer arrow */}
              {idx < nodeCount - 1 && (
                <div style={{
                  color: colors.pointer,
                  fontSize: 18,
                  fontFamily: theme.fonts.mono,
                }}>
                  {'->'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          marginTop: 16,
          backgroundColor: '#FEE2E2',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: colors.linkedList, fontSize: 14, fontWeight: 600 }}>
            每节点总计:
          </span>
          <span style={{
            color: colors.linkedList,
            fontSize: 22,
            fontWeight: 800,
            fontFamily: theme.fonts.mono,
          }}>
            {prevSize + dataSize + nextSize}B
          </span>
        </div>
      </div>

      {/* VS */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: Math.min(1, (cycleFrame - 60) / 30),
      }}>
        <div style={{
          fontSize: 36,
          fontWeight: 800,
          color: colors.subtext,
          fontFamily: theme.fonts.mono,
        }}>
          VS
        </div>
      </div>

      {/* ZipList Section */}
      <div style={{
        position: 'absolute',
        top: 120,
        right: 40,
        width: '38%',
        opacity: getFade(60, 30),
        transform: `translateX(${getFade(60, 30) * 50}px)`,
      }}>
        <div style={{
          color: colors.ziplist,
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 12,
          fontFamily: theme.fonts.mono,
        }}>
          ZipList
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          border: `3px solid ${colors.ziplist}`,
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 4,
        }}>
          {[
            { name: 'zlbytes', size: 4, color: '#34D399' },
            { name: 'zltail', size: 4, color: '#6EE7B7' },
            { name: 'zllen', size: 2, color: '#A7F3D0' },
          ].map((field, idx) => (
            <div key={idx} style={{
              width: field.size * 9,
              height: 36,
              backgroundColor: field.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text,
              fontSize: 9,
              fontFamily: theme.fonts.mono,
              fontWeight: 600,
            }}>
              {field.name}
            </div>
          ))}
        </div>

        {/* Compact entries */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          marginBottom: 4,
        }}>
          {Array.from({ length: nodeCount }).map((_, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                border: `2px solid ${colors.ziplist}`,
                borderRadius: 6,
                overflow: 'hidden',
                opacity: getAppear(70 + idx * 8),
              }}
            >
              <div style={{
                width: 24,
                height: 28,
                backgroundColor: '#A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.ziplist,
                fontSize: 8,
                fontFamily: theme.fonts.mono,
                fontWeight: 600,
              }}>
                prev
              </div>
              <div style={{
                width: 16,
                height: 28,
                backgroundColor: '#6EE7B7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.ziplist,
                fontSize: 8,
                fontFamily: theme.fonts.mono,
                fontWeight: 600,
              }}>
                enc
              </div>
              <div style={{
                width: 28,
                height: 28,
                backgroundColor: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.background,
                fontSize: 10,
                fontFamily: theme.fonts.mono,
                fontWeight: 600,
              }}>
                data
              </div>
            </div>
          ))}
        </div>

        {/* End marker */}
        <div style={{
          width: 28,
          height: 28,
          backgroundColor: '#F87171',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.background,
          fontSize: 11,
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
        }}>
          FF
        </div>

        {/* Total */}
        <div style={{
          marginTop: 16,
          backgroundColor: '#D1FAE5',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: colors.ziplist, fontSize: 14, fontWeight: 600 }}>
            每节点平均:
          </span>
          <span style={{
            color: colors.ziplist,
            fontSize: 22,
            fontWeight: 800,
            fontFamily: theme.fonts.mono,
          }}>
            ~{ziplistPerNode}B
          </span>
        </div>
      </div>

      {/* Savings Counter */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 0.5s',
      }}>
        <div style={{
          backgroundColor: colors.saved,
          color: colors.background,
          padding: '16px 48px',
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            内存节省
          </div>
          <div style={{
            fontSize: 64,
            fontWeight: 800,
            fontFamily: theme.fonts.mono,
          }}>
            {displaySavings}%
          </div>
        </div>

        <div style={{
          marginTop: 12,
          color: colors.subtext,
          fontSize: 14,
          fontFamily: theme.fonts.mono,
        }}>
          {linkedListTotal}B (LinkedList) vs {ziplistTotal}B (ZipList)
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
        gap: 32,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, backgroundColor: colors.linkedList, borderRadius: 4 }} />
          <span style={{ color: colors.subtext, fontSize: 14 }}>LinkedList (双向指针)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, backgroundColor: colors.ziplist, borderRadius: 4 }} />
          <span style={{ color: colors.subtext, fontSize: 14 }}>ZipList (紧凑无指针)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, backgroundColor: colors.pointer, borderRadius: 4 }} />
          <span style={{ color: colors.subtext, fontSize: 14 }}>指针开销</span>
        </div>
      </div>

      {/* Phase Indicator */}
      <div style={{
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.subtext,
        fontSize: 12,
        fontFamily: theme.fonts.mono,
      }}>
        {phase === 0 && '阶段 1: LinkedList 结构'}
        {phase === 1 && '阶段 2: ZipList 结构'}
        {phase === 2 && '阶段 3: 对比分析'}
        {phase === 3 && '阶段 4: 节省计算'}
      </div>
    </div>
  );
};