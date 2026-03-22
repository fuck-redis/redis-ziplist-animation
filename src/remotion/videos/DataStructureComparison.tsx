import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

interface DataStructureProps {
  name: string;
  nodes: number;
  memoryUsage: number;
  overhead: number;
  color: string;
  startFrame: number;
  animationFrame: number;
  features: string[];
}

const DataStructureCard: React.FC<DataStructureProps> = ({
  name,
  nodes,
  memoryUsage,
  overhead,
  color,
  startFrame,
  animationFrame,
  features,
}) => {
  const appear = Math.min(1, Math.max(0, (animationFrame - startFrame) / 20));

  const scale = appear;

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: theme.colors.backgroundLight,
        borderRadius: 16,
        border: `3px solid ${color}`,
        opacity: appear,
        transform: `scale(${scale})`,
        width: 280,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 16px',
          backgroundColor: color,
          borderRadius: 8,
          color: theme.colors.background,
          fontSize: 18,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        {name}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.colors.textMuted, fontSize: 14 }}>节点数</span>
          <span style={{ color: theme.colors.text, fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.mono }}>
            {nodes}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.colors.textMuted, fontSize: 14 }}>内存占用</span>
          <span style={{ color: color, fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.mono }}>
            {memoryUsage}B
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.colors.textMuted, fontSize: 14 }}>指针开销</span>
          <span style={{ color: theme.colors.textMuted, fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.mono }}>
            {overhead}B/节点
          </span>
        </div>
      </div>

      {/* Visual comparison */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: theme.colors.textMuted, fontSize: 12, marginBottom: 8 }}>
          内存占用对比 (每节点)
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* Data portion */}
          <div
            style={{
              height: 24,
              backgroundColor: color,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: theme.colors.background, fontSize: 10, fontWeight: 700 }}>数据</span>
          </div>
          {/* Overhead portion */}
          {overhead > 0 && (
            <div
              style={{
                height: 24,
                width: overhead * 3,
                backgroundColor: theme.colors.border,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: theme.colors.textMuted, fontSize: 8 }}>ptr</span>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {features.map((feature, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: theme.colors.textMuted,
              fontSize: 13,
            }}
          >
            <span style={{ color: color }}>•</span>
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DataStructureComparison: React.FC<{ title?: string }> = ({ title = '数据结构对比' }) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 180);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const titleAppear = Math.min(1, Math.max(0, animationFrame / 20));

  const zipListMemory = 7; // 1 prevlen + 1 encoding + 4 content + 1 avg
  const linkedListOverhead = 16; // prev + next pointers on 64-bit system

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
      <div
        style={{
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
        }}
      >
        {title}
      </div>

      {/* Comparison Cards */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 30,
          padding: '0 40px',
        }}
      >
        <DataStructureCard
          name="ZipList"
          nodes={10}
          memoryUsage={zipListMemory * 10}
          overhead={0}
          color={theme.colors.primary}
          startFrame={15}
          animationFrame={animationFrame}
          features={['紧凑连续内存', '无指针开销', 'O(n) 随机访问', 'O(1) 头尾操作', '可能触发连锁更新']}
        />
        <DataStructureCard
          name="双向链表"
          nodes={10}
          memoryUsage={(zipListMemory + linkedListOverhead) * 10}
          overhead={linkedListOverhead}
          color={theme.colors.secondary}
          startFrame={45}
          animationFrame={animationFrame}
          features={['节点独立存储', '需要前后指针', 'O(n) 随机访问', 'O(1) 头尾操作', '无连锁更新问题']}
        />
        <DataStructureCard
          name="QuickList"
          nodes={10}
          memoryUsage={zipListMemory * 10 + 20}
          overhead={2}
          color={theme.colors.accent}
          startFrame={75}
          animationFrame={animationFrame}
          features={['ZipList 的链表', '结合两者优点', '可配置节点大小', '性能平衡', 'Redis 默认实现']}
        />
      </div>

      {/* Savings Highlight */}
      {animationFrame > 120 && (
        <div
          style={{
            position: 'absolute',
            top: 420,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '20px 40px',
            backgroundColor: `${theme.colors.accent}20`,
            borderRadius: 16,
            border: `3px solid ${theme.colors.accent}`,
            textAlign: 'center',
            opacity: Math.min(1, (animationFrame - 120) / 30),
          }}
        >
          <div style={{ color: theme.colors.accent, fontSize: 16, marginBottom: 8 }}>
            内存节省计算
          </div>
          <div
            style={{
              color: theme.colors.text,
              fontSize: 28,
              fontWeight: 700,
              fontFamily: theme.fonts.mono,
            }}
          >
            ZipList: {zipListMemory * 10}B vs 链表: {(zipListMemory + linkedListOverhead) * 10}B
          </div>
          <div
            style={{
              color: theme.colors.accent,
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
              fontFamily: theme.fonts.mono,
            }}
          >
            节省 {Math.round((linkedListOverhead * 10) / ((zipListMemory + linkedListOverhead) * 10) * 100)}%
          </div>
        </div>
      )}

      {/* When to Use */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '0 60px',
        }}
      >
        <div
          style={{
            color: theme.colors.textMuted,
            fontSize: 14,
            fontFamily: theme.fonts.mono,
            lineHeight: 1.8,
          }}
        >
          <span style={{ color: theme.colors.primary }}>ZipList 适用</span>: 小数据量、内存敏感、顺序访问为主
          <br />
          <span style={{ color: theme.colors.secondary }}>链表适用</span>: 大数据量、频繁中间操作、需 O(1) 随机删除
        </div>
      </div>
    </div>
  );
};