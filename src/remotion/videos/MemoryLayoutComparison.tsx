import React, { useEffect, useState } from 'react';

const FRAME_DURATION = 12 * 30; // 12 seconds at 30fps

export const MemoryLayoutComparison: React.FC = () => {
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
    ziplist: '#3B82F6',
    quicklist: '#10B981',
    linkedlist: '#F59E0B',
    arrow: '#EF4444',
    memory: '#E2E8F0',
  };

  const getAnimationProgress = (start: number, duration: number) => {
    return Math.min(1, Math.max(0, (cycleFrame - start) / duration));
  };

  // Memory blocks for each structure
  const structures = [
    {
      name: 'ZipList',
      description: '连续内存块，紧密排列',
      color: colors.ziplist,
      x: 60,
      blocks: [
        { size: 60, label: 'H' },
        { size: 60, label: 'E1' },
        { size: 80, label: 'E2' },
        { size: 60, label: 'E3' },
        { size: 40, label: 'END' },
      ],
      animationStart: 0,
    },
    {
      name: 'QuickList',
      description: '多个小ZipList用指针串联',
      color: colors.quicklist,
      x: 420,
      blocks: [
        { size: 40, label: 'H1', isArrow: false },
        { size: 40, label: 'E1', isArrow: false },
        { size: 30, label: '→', isArrow: true },
        { size: 40, label: 'H2', isArrow: false },
        { size: 40, label: 'E2', isArrow: false },
        { size: 30, label: '→', isArrow: true },
        { size: 40, label: 'H3', isArrow: false },
        { size: 40, label: 'E3', isArrow: false },
      ],
      animationStart: 120,
    },
    {
      name: 'LinkedList',
      description: '分散节点，prev/next指针连接',
      color: colors.linkedlist,
      x: 820,
      blocks: [
        { size: 50, label: 'N1', isArrow: false },
        { size: 30, label: '→', isArrow: true },
        { size: 50, label: 'N2', isArrow: false },
        { size: 30, label: '→', isArrow: true },
        { size: 50, label: 'N3', isArrow: false },
      ],
      animationStart: 240,
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
        top: 25,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.text,
        fontSize: 38,
        fontWeight: 700,
      }}>
        三种数据结构的内存布局对比
      </div>

      {/* Structures */}
      {structures.map((struct) => {
        const structProgress = getAnimationProgress(struct.animationStart, 50);
        const blocksStart = struct.animationStart + 40;
        const arrowStart = struct.animationStart + 80;

        return (
          <div key={struct.name} style={{
            position: 'absolute',
            top: 110,
            left: struct.x,
            width: 340,
            opacity: structProgress,
            transform: `translateY(${(1 - structProgress) * 30}px)`,
          }}>
            {/* Structure name */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}>
              <div style={{
                width: 24,
                height: 24,
                backgroundColor: struct.color,
                borderRadius: 6,
              }} />
              <span style={{
                color: colors.text,
                fontSize: 22,
                fontWeight: 700,
              }}>
                {struct.name}
              </span>
            </div>

            {/* Description */}
            <div style={{
              color: colors.textMuted,
              fontSize: 16,
              marginBottom: 20,
            }}>
              {struct.description}
            </div>

            {/* Memory blocks */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexWrap: 'wrap',
              minHeight: 80,
            }}>
              {struct.blocks.map((block, blockIdx) => {
                const blockProgress = getAnimationProgress(
                  blocksStart + blockIdx * 8,
                  15
                );
                const isArrow = 'isArrow' in block && block.isArrow;

                if (isArrow) {
                  const arrowProgress = getAnimationProgress(
                    arrowStart + blockIdx * 5,
                    10
                  );
                  return (
                    <div key={blockIdx} style={{
                      opacity: arrowProgress,
                      color: colors.arrow,
                      fontSize: 20,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      margin: '0 4px',
                    }}>
                      →
                    </div>
                  );
                }

                return (
                  <div key={blockIdx} style={{
                    width: block.size,
                    height: 50,
                    backgroundColor: struct.color,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, monospace',
                    opacity: blockProgress,
                    transform: `scale(${0.5 + blockProgress * 0.5})`,
                    boxShadow: blockIdx === 0 ? `0 4px 12px ${struct.color}40` : 'none',
                  }}>
                    {block.label}
                  </div>
                );
              })}
            </div>

            {/* Memory address indicator */}
            <div style={{
              marginTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              color: colors.textMuted,
              fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              <span>0x0000</span>
              <span>0xFFFF</span>
            </div>

            {/* Memory bar visualization */}
            <div style={{
              marginTop: 8,
              height: 8,
              backgroundColor: colors.memory,
              borderRadius: 4,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: '10%',
                right: '10%',
                top: 0,
                bottom: 0,
                backgroundColor: struct.color + '30',
                borderRadius: 4,
              }} />
            </div>
          </div>
        );
      })}

      {/* Bottom Legend */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, backgroundColor: colors.ziplist, borderRadius: 4 }} />
          <div>
            <div style={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>ZipList</div>
            <div style={{ color: colors.textMuted, fontSize: 11 }}>连续紧凑</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, backgroundColor: colors.quicklist, borderRadius: 4 }} />
          <div>
            <div style={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>QuickList</div>
            <div style={{ color: colors.textMuted, fontSize: 11 }}>链式紧凑</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, backgroundColor: colors.linkedlist, borderRadius: 4 }} />
          <div>
            <div style={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>LinkedList</div>
            <div style={{ color: colors.textMuted, fontSize: 11 }}>分散节点</div>
          </div>
        </div>
      </div>

      {/* Memory efficiency indicator */}
      <div style={{
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 12,
      }}>
        内存效率: ZipList {'>'} QuickList {'>'} LinkedList
      </div>
    </div>
  );
};
