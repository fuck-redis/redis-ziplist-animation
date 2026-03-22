import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

// Bright flat design colors
const COLORS = {
  background: '#F8FAFC',
  entry: '#3B82F6',
  header: '#06B6D4',
  secondary: '#8B5CF6',
  highlight: '#EF4444',
  warning: '#EF4444',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#CBD5E1',
  accent: '#10B981',
};

const BYTE_SIZE = 28;
const ENTRY_HEIGHT = 44;
const INITIAL_ENTRY_SIZE = 250;

interface EntryData {
  content: string;
  prevlen: number;
  size: number;
}

interface EntryProps {
  entry: EntryData;
  index: number;
  isHighlighted: boolean;
  isUpdating: boolean;
  updateProgress: number;
  prevlenExpanded: boolean;
}

// Individual Entry component showing byte layout
const Entry: React.FC<EntryProps> = ({
  entry,
  index,
  isHighlighted,
  isUpdating,
  updateProgress,
  prevlenExpanded,
}) => {
  const prevlenSize = prevlenExpanded ? 5 : 1;
  const contentBytes = new TextEncoder().encode(entry.content).length;
  const encodingSize = contentBytes <= 63 ? 1 : 2;

  const pulseScale = isUpdating ? 1 + Math.sin(updateProgress * 0.3) * 0.08 : 1;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        backgroundColor: isHighlighted ? `${COLORS.highlight}15` : '#FFFFFF',
        borderRadius: 4,
        border: `2px solid ${isHighlighted ? COLORS.highlight : COLORS.border}`,
        boxShadow: isUpdating
          ? `0 0 20px ${isHighlighted ? COLORS.highlight : COLORS.entry}40`
          : '0 1px 3px rgba(0,0,0,0.05)',
        transform: `scale(${pulseScale})`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Index badge */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 4,
          backgroundColor: COLORS.header,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}
      >
        {index}
      </div>

      {/* Byte visualization */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* prevlen */}
        <div
          style={{
            width: prevlenSize * BYTE_SIZE,
            height: ENTRY_HEIGHT,
            backgroundColor: prevlenExpanded ? COLORS.warning : COLORS.accent,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.3s ease-out, background-color 0.3s ease-out',
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: 8, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
            prevlen
          </span>
          <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
            {entry.prevlen}
          </span>
        </div>

        {/* encoding */}
        <div
          style={{
            width: encodingSize * BYTE_SIZE,
            height: ENTRY_HEIGHT,
            backgroundColor: COLORS.secondary,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: 10, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
            enc
          </span>
        </div>

        {/* content */}
        <div
          style={{
            width: Math.max(contentBytes * BYTE_SIZE, 60),
            height: ENTRY_HEIGHT,
            backgroundColor: COLORS.entry,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: 12,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            fontWeight: 600,
          }}
        >
          {entry.content}
        </div>
      </div>

      {/* Size label */}
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 12,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          minWidth: 70,
        }}
      >
        {entry.size} B
      </div>

      {/* Update indicator */}
      {isUpdating && (
        <div
          style={{
            padding: '4px 10px',
            backgroundColor: isHighlighted ? COLORS.highlight : COLORS.entry,
            borderRadius: 12,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
          }}
        >
          UPDATING
        </div>
      )}
    </div>
  );
};

export const CascadeTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Generate 10 initial entries
  const initialEntries: EntryData[] = Array.from({ length: 10 }, (_, i) => ({
    content: `data${i}`,
    prevlen: i === 0 ? 0 : INITIAL_ENTRY_SIZE - 11,
    size: INITIAL_ENTRY_SIZE,
  }));

  // Calculate current phase based on frame
  const phase1End = 60;
  const phase2End = 150;
  const phase3End = 250;
  const phase4End = 350;

  const currentPhase =
    frame < phase1End ? 1
    : frame < phase2End ? 2
    : frame < phase3End ? 3
    : frame < phase4End ? 4
    : 5;

  // Animation progress within current phase
  const phaseProgress =
    currentPhase === 1 ? frame
    : currentPhase === 2 ? frame - phase1End
    : currentPhase === 3 ? frame - phase2End
    : currentPhase === 4 ? frame - phase3End
    : frame - phase4End;

  // Determine which entries are being updated
  const updatingEntryIndex =
    currentPhase === 2 ? 0
    : currentPhase === 3 ? 1
    : currentPhase === 4 ? 2
    : currentPhase >= 5 ? 3
    : -1;

  // Entry states for animation
  const getEntries = (): EntryData[] => {
    const entries = [...initialEntries];

    if (currentPhase >= 2) {
      // First entry updated to 300 bytes
      entries[0] = { ...entries[0], size: 300, prevlen: 0, content: 'updated' };
    }

    if (currentPhase >= 3) {
      // Second entry prevlen expands
      entries[1] = { ...entries[1], prevlen: 300, size: entries[1].size + 4 };
    }

    if (currentPhase >= 4) {
      // Third entry prevlen expands
      entries[2] = { ...entries[2], prevlen: entries[1].size, size: entries[2].size + 4 };
    }

    if (currentPhase >= 5) {
      // Fourth entry prevlen expands
      entries[3] = { ...entries[3], prevlen: entries[2].size, size: entries[3].size + 4 };
    }

    return entries;
  };

  const entries = getEntries();

  // Title animation
  const titleAppear = Math.min(1, Math.max(0, frame / 15));

  // Phase descriptions
  const phaseLabels = ['初始状态', 'Entry[0] 更新', 'Entry[1] 扩展', 'Entry[2] 连锁', '连锁继续...'];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: COLORS.text,
          fontSize: 40,
          fontWeight: 700,
          fontFamily: 'Inter, system-ui, sans-serif',
          opacity: titleAppear,
          transform: `translateY(${(1 - titleAppear) * -20}px)`,
        }}
      >
        连锁更新完整时序动画
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {phaseLabels.map((label, i) => (
          <div
            key={i}
            style={{
              padding: '6px 16px',
              backgroundColor: currentPhase > i ? COLORS.entry : '#E2E8F0',
              borderRadius: 20,
              color: currentPhase > i ? '#FFFFFF' : COLORS.textMuted,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'all 0.3s ease-out',
            }}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {/* Entries visualization */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: 60,
          right: 60,
        }}
      >
        {/* Phase description */}
        <div
          style={{
            marginBottom: 16,
            padding: '12px 20px',
            backgroundColor: currentPhase === 1 ? '#EFF6FF' : `${COLORS.highlight}10`,
            borderRadius: 8,
            border: `1px solid ${currentPhase === 1 ? COLORS.entry : COLORS.highlight}`,
            color: COLORS.text,
            fontSize: 15,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {currentPhase === 1 && '初始状态：10个Entry，每个约250字节，prevlen都占用1字节'}
          {currentPhase === 2 && (
            <>
              <span style={{ color: COLORS.highlight, fontWeight: 700 }}>Entry[0] 更新：</span>
              大小从250字节扩展到300字节，触发连锁更新
            </>
          )}
          {currentPhase === 3 && (
            <>
              <span style={{ color: COLORS.warning, fontWeight: 700 }}>连锁传播：</span>
              Entry[1]的prevlen从1字节扩展到5字节（需要表示300），Entry[1]变大
            </>
          )}
          {currentPhase === 4 && (
            <>
              <span style={{ color: COLORS.warning, fontWeight: 700 }}>继续连锁：</span>
              Entry[2]的prevlen需要更新，Entry[2]变大，继续影响后续Entry
            </>
          )}
          {currentPhase === 5 && (
            <>
              <span style={{ color: COLORS.highlight, fontWeight: 700 }}>O(n) 连锁效应：</span>
              每个Entry的更新都可能影响后续所有Entry，时间复杂度 O(n)
            </>
          )}
        </div>

        {/* Entry list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.slice(0, 6).map((entry, i) => (
            <Entry
              key={i}
              entry={entry}
              index={i}
              isHighlighted={updatingEntryIndex === i}
              isUpdating={updatingEntryIndex >= i && currentPhase >= 2}
              updateProgress={phaseProgress}
              prevlenExpanded={
                (currentPhase >= 3 && i >= 1) ||
                (currentPhase >= 4 && i >= 2) ||
                (currentPhase >= 5 && i >= 3)
              }
            />
          ))}

          {/* Show "more entries" indicator */}
          {entries.length > 6 && (
            <div
              style={{
                padding: '8px 16px',
                color: COLORS.textMuted,
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
                textAlign: 'center',
              }}
            >
              ... 还有 {entries.length - 6} 个 Entry
            </div>
          )}
        </div>
      </div>

      {/* Warning panel */}
      {currentPhase >= 3 && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 60,
            right: 60,
            padding: '16px 24px',
            backgroundColor: `${COLORS.highlight}15`,
            borderRadius: 8,
            border: `2px solid ${COLORS.highlight}`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.highlight,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            !
          </div>
          <div>
            <div
              style={{
                color: COLORS.highlight,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'Inter, system-ui, sans-serif',
                marginBottom: 4,
              }}
            >
              时间复杂度警告：O(n)
            </div>
            <div
              style={{
                color: COLORS.text,
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
              }}
            >
              连锁更新最坏情况需要更新所有后续Entry，时间复杂度为 O(n)
            </div>
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: COLORS.textMuted,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}
      >
        ZipList 连锁更新演示 | 帧: {frame} / {durationInFrames}
      </div>

      {/* Loop indicator */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '4px 12px',
          backgroundColor: COLORS.accent,
          borderRadius: 12,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        }}
      >
        LOOP
      </div>
    </AbsoluteFill>
  );
};
