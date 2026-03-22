import React, { useState, useEffect } from 'react';
import './InlineVideo.css';

interface InlineVideoProps {
  videoType:
    | 'structure'
    | 'encoding'
    | 'cascade'
    | 'traversal'
    | 'memory'
    | 'comparison'
    | 'header'
    | 'entry'
    | 'prevlen'
    | 'int-encoding'
    | 'str-encoding'
    | 'memory-opt'
    | 'conversion'
    | 'config'
    | 'memory-layout'
    | 'performance'
    | 'decision'
    | 'list-cmds'
    | 'hash-cmds'
    | 'encoding-check'
    | 'complexity'
    // New structure animations (6)
    | 'header-bytes'
    | 'entry-breakdown'
    | 'entry-encoding'
    | 'zlbytes-change'
    | 'zltail-jump'
    | 'zllen-count'
    // New encoding animations (8)
    | 'int8-range'
    | 'int16-range'
    | 'int24-range'
    | 'int32-range'
    | 'int64-range'
    | 'str6bit-demo'
    | 'str14bit-demo'
    | 'str32bit-demo'
    // New cascade animations (6)
    | 'cascade-phase1'
    | 'cascade-phase2'
    | 'cascade-phase3'
    | 'cascade-phase4'
    | 'cascade-trigger'
    | 'cascade-memory'
    // New memory animations (5)
    | 'memory-allocate'
    | 'memory-save'
    | 'memory-byte'
    | 'cache-hit'
    | 'cache-miss'
    // New command animations (6)
    | 'lpush-demo'
    | 'rpush-demo'
    | 'lpop-demo'
    | 'hset-demo'
    | 'hget-demo'
    | 'zadd-demo'
    // New config animations (4)
    | 'threshold-warning'
    | 'compress-depth'
    | 'convert-flow'
    | 'encoding-result';
  title?: string;
  autoPlay?: boolean;
  size?: 'small' | 'default' | 'large' | 'xlarge';
}

// Simplified inline video component - small, embedded style
export const InlineVideo: React.FC<InlineVideoProps> = ({
  videoType,
  title,
  autoPlay = true,
  size = 'default',
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const renderVideoContent = () => {
    switch (videoType) {
      // Existing animations
      case 'structure':
        return <StructureAnimation isPlaying={isPlaying} />;
      case 'encoding':
        return <EncodingAnimation isPlaying={isPlaying} />;
      case 'cascade':
        return <CascadeAnimation isPlaying={isPlaying} />;
      case 'traversal':
        return <TraversalAnimation isPlaying={isPlaying} />;
      case 'memory':
        return <MemoryAnimation isPlaying={isPlaying} />;
      case 'comparison':
        return <ComparisonAnimation isPlaying={isPlaying} />;
      case 'header':
        return <HeaderFieldsAnimation isPlaying={isPlaying} />;
      case 'entry':
        return <EntryStructureAnimation isPlaying={isPlaying} />;
      case 'prevlen':
        return <PrevlenAnimation isPlaying={isPlaying} />;
      case 'int-encoding':
        return <IntEncodingAnimation isPlaying={isPlaying} />;
      case 'str-encoding':
        return <StrEncodingAnimation isPlaying={isPlaying} />;
      case 'memory-opt':
        return <MemoryOptAnimation isPlaying={isPlaying} />;
      case 'conversion':
        return <ConversionAnimation isPlaying={isPlaying} />;
      case 'config':
        return <ConfigAnimation isPlaying={isPlaying} />;
      case 'memory-layout':
        return <MemoryLayoutAnimation isPlaying={isPlaying} />;
      case 'performance':
        return <PerformanceAnimation isPlaying={isPlaying} />;
      case 'decision':
        return <DecisionAnimation isPlaying={isPlaying} />;
      case 'list-cmds':
        return <ListCmdsAnimation isPlaying={isPlaying} />;
      case 'hash-cmds':
        return <HashCmdsAnimation isPlaying={isPlaying} />;
      case 'encoding-check':
        return <EncodingCheckAnimation isPlaying={isPlaying} />;
      case 'complexity':
        return <ComplexityAnimation isPlaying={isPlaying} />;
      // New structure animations
      case 'header-bytes':
        return <HeaderBytesAnimation isPlaying={isPlaying} />;
      case 'entry-breakdown':
        return <EntryBreakdownAnimation isPlaying={isPlaying} />;
      case 'entry-encoding':
        return <EntryEncodingAnimation isPlaying={isPlaying} />;
      case 'zlbytes-change':
        return <ZlbytesChangeAnimation isPlaying={isPlaying} />;
      case 'zltail-jump':
        return <ZltailJumpAnimation isPlaying={isPlaying} />;
      case 'zllen-count':
        return <ZllenCountAnimation isPlaying={isPlaying} />;
      // New encoding animations
      case 'int8-range':
        return <Int8RangeAnimation isPlaying={isPlaying} />;
      case 'int16-range':
        return <Int16RangeAnimation isPlaying={isPlaying} />;
      case 'int24-range':
        return <Int24RangeAnimation isPlaying={isPlaying} />;
      case 'int32-range':
        return <Int32RangeAnimation isPlaying={isPlaying} />;
      case 'int64-range':
        return <Int64RangeAnimation isPlaying={isPlaying} />;
      case 'str6bit-demo':
        return <Str6bitDemoAnimation isPlaying={isPlaying} />;
      case 'str14bit-demo':
        return <Str14bitDemoAnimation isPlaying={isPlaying} />;
      case 'str32bit-demo':
        return <Str32bitDemoAnimation isPlaying={isPlaying} />;
      // New cascade animations
      case 'cascade-phase1':
        return <CascadePhase1Animation isPlaying={isPlaying} />;
      case 'cascade-phase2':
        return <CascadePhase2Animation isPlaying={isPlaying} />;
      case 'cascade-phase3':
        return <CascadePhase3Animation isPlaying={isPlaying} />;
      case 'cascade-phase4':
        return <CascadePhase4Animation isPlaying={isPlaying} />;
      case 'cascade-trigger':
        return <CascadeTriggerAnimation isPlaying={isPlaying} />;
      case 'cascade-memory':
        return <CascadeMemoryAnimation isPlaying={isPlaying} />;
      // New memory animations
      case 'memory-allocate':
        return <MemoryAllocateAnimation isPlaying={isPlaying} />;
      case 'memory-save':
        return <MemorySaveAnimation isPlaying={isPlaying} />;
      case 'memory-byte':
        return <MemoryByteAnimation isPlaying={isPlaying} />;
      case 'cache-hit':
        return <CacheHitAnimation isPlaying={isPlaying} />;
      case 'cache-miss':
        return <CacheMissAnimation isPlaying={isPlaying} />;
      // New command animations
      case 'lpush-demo':
        return <LPushDemoAnimation isPlaying={isPlaying} />;
      case 'rpush-demo':
        return <RPushDemoAnimation isPlaying={isPlaying} />;
      case 'lpop-demo':
        return <LPopDemoAnimation isPlaying={isPlaying} />;
      case 'hset-demo':
        return <HSetDemoAnimation isPlaying={isPlaying} />;
      case 'hget-demo':
        return <HGetDemoAnimation isPlaying={isPlaying} />;
      case 'zadd-demo':
        return <ZAddDemoAnimation isPlaying={isPlaying} />;
      // New config animations
      case 'threshold-warning':
        return <ThresholdWarningAnimation isPlaying={isPlaying} />;
      case 'compress-depth':
        return <CompressDepthAnimation isPlaying={isPlaying} />;
      case 'convert-flow':
        return <ConvertFlowAnimation isPlaying={isPlaying} />;
      case 'encoding-result':
        return <EncodingResultAnimation isPlaying={isPlaying} />;
      default:
        return null;
    }
  };

  return (
    <div className={`inline-video inline-video--${size}`}>
      <div className="inline-video__player" onClick={() => setIsPlaying(!isPlaying)}>
        {renderVideoContent()}
        <div className="inline-video__overlay">
          <span className="inline-video__icon">{isPlaying ? '⏸' : '▶'}</span>
        </div>
      </div>
      {title && <div className="inline-video__title">{title}</div>}
    </div>
  );
};

// ============ EXISTING ANIMATIONS ============

const StructureAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const opacity = Math.min(1, frame / 20);

  return (
    <div className="anim-structure">
      <div className="anim-header" style={{ opacity }}>
        <span className="anim-label">Header</span>
        <div className="anim-blocks">
          <div className="anim-block header">zlbytes</div>
          <div className="anim-block header">zltail</div>
          <div className="anim-block header">zllen</div>
        </div>
      </div>
      <div className="anim-arrow" style={{ opacity }}>↓</div>
      <div className="anim-entries" style={{ opacity }}>
        <div className="anim-entry">
          <div className="anim-block entry">prevlen</div>
          <div className="anim-block entry">encoding</div>
          <div className="anim-block entry content">"A"</div>
        </div>
        <div className="anim-entry">
          <div className="anim-block entry">prevlen</div>
          <div className="anim-block entry">encoding</div>
          <div className="anim-block entry content">"B"</div>
        </div>
      </div>
      <div className="anim-arrow" style={{ opacity }}>↓</div>
      <div className="anim-end" style={{ opacity }}>
        <div className="anim-block end">FF</div>
      </div>
    </div>
  );
};

const EncodingAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const values = [
    { v: 42, enc: 'INT8', bytes: 2 },
    { v: 1000, enc: 'INT16', bytes: 3 },
    { v: 'hi', enc: 'STR_6BIT', bytes: 3 },
  ];
  const idx = Math.floor(frame / 30);
  const current = values[idx] || values[0];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">编码选择: <strong>{current.enc}</strong></div>
      <div className="anim-encoding__demo">
        <div className="anim-block enc">enc</div>
        <div className="anim-block content">{typeof current.v === 'number' ? current.v : current.v}</div>
      </div>
      <div className="anim-encoding__info">
        值: {current.v} → {current.bytes} 字节
      </div>
    </div>
  );
};

const CascadeAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 120), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30);

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">阶段 {phase + 1}: {phase === 0 ? '初始状态' : phase === 1 ? '插入大节点' : phase === 2 ? '触发更新' : '连锁传播'}</div>
      <div className="anim-cascade__entries">
        <div className="anim-entry small">
          <div className="anim-block entry">A</div>
        </div>
        {phase >= 1 && (
          <div className="anim-entry large">
            <div className="anim-block entry highlight">NEW</div>
          </div>
        )}
        <div className="anim-entry small">
          <div className={`anim-block entry ${phase >= 2 ? 'warning' : ''}`}>B</div>
        </div>
        <div className="anim-entry small">
          <div className={`anim-block entry ${phase >= 3 ? 'warning' : ''}`}>C</div>
        </div>
      </div>
      {phase >= 2 && (
        <div className="anim-cascade__warning">⚠️ prevlen 需要扩展!</div>
      )}
    </div>
  );
};

const TraversalAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const idx = Math.floor(frame / 15) % 4;
  const direction = frame > 45 ? '反向' : '正向';

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">遍历方向: <strong>{direction}</strong></div>
      <div className="anim-traversal__path">
        {['A', 'B', 'C', 'D'].map((v, i) => (
          <React.Fragment key={i}>
            <div className={`anim-block ${i === idx ? 'active' : ''}`}>{v}</div>
            {i < 3 && <span className="anim-traversal__arrow">{direction === '正向' ? '→' : '←'}</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="anim-traversal__info">当前: Entry {idx} = {['A', 'B', 'C', 'D'][idx]}</div>
    </div>
  );
};

const MemoryAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const idx = Math.floor(frame / 6) % 12;

  return (
    <div className="anim-memory">
      <div className="anim-memory__grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`anim-memory__byte ${i === idx ? 'active' : ''} ${i < 4 ? 'header' : i < 10 ? 'entry' : 'end'}`}
          >
            {i.toString(16).toUpperCase()}
          </div>
        ))}
      </div>
      <div className="anim-memory__info">
        偏移量: <strong>{idx}</strong> | 值: <strong>0x{Math.floor(Math.random() * 256).toString(16).toUpperCase()}</strong>
      </div>
    </div>
  );
};

const ComparisonAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 3;
  const structures = ['ZipList', 'QuickList', 'LinkedList'];
  const current = structures[phase];

  return (
    <div className="anim-comparison">
      <div className="anim-comparison__title">对比: <strong>{current}</strong></div>
      <div className="anim-comparison__bars">
        <div className="anim-bar" style={{ width: `${100 - phase * 25}%`, background: '#3b82f6' }}>
          {100 - phase * 25}%
        </div>
        <div className="anim-bar-label">内存效率</div>
      </div>
      <div className="anim-comparison__features">
        <span className={phase === 0 ? 'active' : ''}>紧凑</span>
        <span className={phase === 1 ? 'active' : ''}>平衡</span>
        <span className={phase === 2 ? 'active' : ''}>灵活</span>
      </div>
    </div>
  );
};

const HeaderFieldsAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const opacity = Math.min(1, frame / 20);

  return (
    <div className="anim-structure">
      <div className="anim-header" style={{ opacity }}>
        <span className="anim-label">Header Fields</span>
        <div className="anim-blocks">
          <div className="anim-block header">zlbytes</div>
          <div className="anim-block header">zltail</div>
          <div className="anim-block header">zllen</div>
        </div>
      </div>
      <div className="anim-arrow" style={{ opacity }}>↓</div>
      <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center' }}>
        Each 4 bytes | Total 12 bytes
      </div>
    </div>
  );
};

const EntryStructureAnimation: React.FC<{ isPlaying: boolean }> = () => {
  return (
    <div className="anim-structure">
      <div className="anim-entry">
        <div className="anim-block entry" style={{ background: '#10b981' }}>prevlen</div>
        <div className="anim-block entry" style={{ background: '#8b5cf6' }}>enc</div>
        <div className="anim-block entry content">content</div>
      </div>
      <div style={{ fontSize: 10, color: '#64748b', marginTop: 8 }}>
        prevlen + encoding + content
      </div>
    </div>
  );
};

const PrevlenAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 3;
  const isExpanded = phase >= 1;

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">Prevlen: {isExpanded ? '5 bytes (0xFE + 4)' : '1 byte'}</div>
      <div className="anim-cascade__entries">
        <div className="anim-entry small">
          <div className="anim-block entry">A</div>
        </div>
        {isExpanded && (
          <div className="anim-entry large">
            <div className="anim-block entry highlight">0xFE</div>
          </div>
        )}
        <div className="anim-entry small">
          <div className={`anim-block entry ${isExpanded ? 'warning' : ''}`}>B</div>
        </div>
      </div>
      {isExpanded && (
        <div className="anim-cascade__warning">Expansion triggered!</div>
      )}
    </div>
  );
};

const IntEncodingAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const values = [
    { v: 42, enc: 'INT8', bytes: 1 },
    { v: 1000, enc: 'INT16', bytes: 2 },
    { v: 100000, enc: 'INT24', bytes: 3 },
  ];
  const idx = Math.floor(frame / 30) % values.length;
  const current = values[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">Integer: <strong>{current.enc}</strong></div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#3b82f6' }}>{current.v}</div>
        <span style={{ color: '#64748b' }}>=&gt;</span>
        <div className="anim-block enc">{current.bytes}B</div>
      </div>
    </div>
  );
};

const StrEncodingAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const strings = [
    { v: 'hi', enc: 'STR_6BIT', bytes: 1 },
    { v: 'hello', enc: 'STR_14BIT', bytes: 2 },
    { v: 'hello world', enc: 'STR_32BIT', bytes: 5 },
  ];
  const idx = Math.floor(frame / 30) % strings.length;
  const current = strings[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">String: <strong>{current.enc}</strong></div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#8b5cf6' }}>"{current.v}"</div>
        <span style={{ color: '#64748b' }}>=&gt;</span>
        <div className="anim-block enc">{current.bytes}B</div>
      </div>
    </div>
  );
};

const MemoryOptAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 45) % 2;
  const savings = phase === 0 ? '36 bytes' : '75%';

  return (
    <div className="anim-comparison">
      <div className="anim-comparison__title">Memory Savings</div>
      <div className="anim-comparison__bars">
        <div className="anim-bar" style={{ width: phase === 0 ? '60%' : '25%', background: '#10b981' }}>
          {savings}
        </div>
        <div className="anim-bar-label">Overhead Reduction</div>
      </div>
    </div>
  );
};

const ConversionAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 3;
  const conversions = [
    { from: 'ZipList', to: 'QuickList', type: 'List' },
    { from: 'ZipList', to: 'HashTable', type: 'Hash' },
    { from: 'ZipList', to: 'SkipList', type: 'ZSet' },
  ];
  const current = conversions[phase];

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">{current.type}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <div className="anim-block entry">{current.from}</div>
        <span style={{ color: '#64748b' }}>{'\u2192'}</span>
        <div className="anim-block entry" style={{ background: '#10b981' }}>{current.to}</div>
      </div>
    </div>
  );
};

const ConfigAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const configs = [
    { name: 'hash-max-ziplist-value', value: 64 },
    { name: 'list-max-ziplist-entries', value: 512 },
    { name: 'zset-max-ziplist-value', value: 64 },
  ];
  const idx = Math.floor(frame / 20) % configs.length;
  const current = configs[idx];

  return (
    <div className="anim-memory">
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{current.name}</div>
      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>{current.value}</div>
    </div>
  );
};

const MemoryLayoutAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 45) % 3;
  const structures = ['ZipList', 'QuickList', 'LinkedList'];
  const current = structures[phase];

  return (
    <div className="anim-comparison">
      <div className="anim-comparison__title">Layout: <strong>{current}</strong></div>
      <div className="anim-memory__grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`anim-memory__byte ${i === Math.floor(frame / 10) % 8 ? 'active' : ''} ${i < 2 ? 'header' : i < 6 ? 'entry' : 'end'}`}
          >
            {i.toString(16).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};

const PerformanceAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const ops = [
    { name: 'LPUSH', complexity: 'O(1)' },
    { name: 'LINDEX', complexity: 'O(n)' },
    { name: 'HSET', complexity: 'O(1)' },
  ];
  const idx = Math.floor(frame / 30) % ops.length;
  const current = ops[idx];

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">Command: <strong>{current.name}</strong></div>
      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>{current.complexity}</div>
    </div>
  );
};

const DecisionAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 3;
  const decisions = [
    { cond: 'entries &lt; 512', result: 'ZipList' },
    { cond: '512 &lt;= entries &lt; 10000', result: 'QuickList' },
    { cond: 'entries &gt;= 10000', result: 'LinkedList' },
  ];
  const current = decisions[phase];

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">Condition</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{current.cond}</div>
      <div style={{ marginTop: 8 }}>
        <div className="anim-block entry" style={{ background: '#10b981' }}>{current.result}</div>
      </div>
    </div>
  );
};

const ListCmdsAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const cmds = ['LPUSH', 'RPUSH', 'LPOP', 'RPOP'];
  const idx = Math.floor(frame / 22) % cmds.length;
  const current = cmds[idx];

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">List Command</div>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#3b82f6' }}>{current}</div>
      <div className="anim-traversal__info">O(1) operation</div>
    </div>
  );
};

const HashCmdsAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const cmds = ['HSET', 'HGET', 'HDEL', 'HGETALL'];
  const idx = Math.floor(frame / 22) % cmds.length;
  const current = cmds[idx];

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">Hash Command</div>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#8b5cf6' }}>{current}</div>
      <div className="anim-traversal__info">{current === 'HGETALL' ? 'O(n)' : 'O(1)'} operation</div>
    </div>
  );
};

const EncodingCheckAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const encodings = ['ziplist', 'quicklist', 'hashtable'];
  const colors = ['#3b82f6', '#8b5cf6', '#ef4444'];
  const idx = Math.floor(frame / 30) % encodings.length;
  const current = encodings[idx];

  return (
    <div className="anim-comparison">
      <div style={{ fontSize: 11, color: '#94a3b8' }}>OBJECT ENCODING</div>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: colors[idx] }}>"{current}"</div>
    </div>
  );
};

const ComplexityAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const complexities = [
    { label: 'O(1)', color: '#10b981', desc: 'Constant' },
    { label: 'O(log n)', color: '#f59e0b', desc: 'Logarithmic' },
    { label: 'O(n)', color: '#ef4444', desc: 'Linear' },
  ];
  const idx = Math.floor(frame / 30) % complexities.length;
  const current = complexities[idx];

  return (
    <div className="anim-comparison">
      <div className="anim-comparison__title">Complexity: <strong style={{ color: current.color }}>{current.label}</strong></div>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>{current.desc} time</div>
    </div>
  );
};

// ============ NEW STRUCTURE ANIMATIONS ============

const HeaderBytesAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const fields = [
    { name: 'zlbytes', bytes: 4, value: '00 00 00 2A' },
    { name: 'zltail', bytes: 4, value: '00 00 00 10' },
    { name: 'zllen', bytes: 2, value: '00 05' },
  ];
  const idx = Math.floor(frame / 30) % fields.length;
  const current = fields[idx];

  return (
    <div className="anim-structure anim-header-bytes">
      <div className="anim-header" style={{ opacity: 1 }}>
        <span className="anim-label">Header Bytes</span>
        <div className="anim-blocks">
          <div className="anim-block header" style={{ width: 80, fontSize: 10 }}>
            <span>{current.name}</span>
            <span style={{ opacity: 0.7 }}>{current.bytes}B</span>
          </div>
        </div>
      </div>
      <div className="anim-header__bytes">
        <div className="byte-display">{current.value}</div>
      </div>
      <div style={{ fontSize: 10, color: '#64748b' }}>
        Field {idx + 1} of 3
      </div>
    </div>
  );
};

const EntryBreakdownAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 3;
  const parts = [
    { name: 'prevlen', color: '#10b981', desc: '前一个entry长度' },
    { name: 'encoding', color: '#8b5cf6', desc: '内容编码方式' },
    { name: 'content', color: '#3b82f6', desc: '实际数据' },
  ];

  return (
    <div className="anim-structure">
      <div className="anim-entry-breakdown">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <div
              className="anim-block entry"
              style={{
                background: i <= phase ? part.color : '#94a3b8',
                opacity: i <= phase ? 1 : 0.4,
                width: i === 2 ? 48 : 36,
                height: 28,
                fontSize: 9,
              }}
            >
              {part.name}
            </div>
            {i < 2 && <span className="anim-breakdown-plus" style={{ opacity: i <= phase ? 1 : 0.3 }}>+</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="anim-breakdown-desc">
        {parts[phase].desc}
      </div>
    </div>
  );
};

const EntryEncodingAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const encodings = [
    { value: 42, enc: 'INT8', marker: '11111110', content: '2A' },
    { value: 1000, enc: 'INT16', marker: '11000000', content: '03 E8' },
    { value: 'hi', enc: 'STR_6BIT', marker: '00xxxxxx', content: '68 69' },
  ];
  const idx = Math.floor(frame / 30) % encodings.length;
  const current = encodings[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">Value: <strong>{current.value}</strong></div>
      <div className="anim-encoding__demo" style={{ flexDirection: 'column', gap: 6 }}>
        <div className="anim-block enc" style={{ width: 70, fontSize: 9 }}>{current.marker}</div>
        <div style={{ fontSize: 10, color: '#64748b' }}>= {current.enc}</div>
        <div className="anim-block entry" style={{ fontSize: 10 }}>{current.content}</div>
      </div>
    </div>
  );
};

const ZlbytesChangeAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const sizes = [13, 16, 22, 28, 35];
  const idx = Math.floor(frame / 18) % sizes.length;
  const current = sizes[idx];

  return (
    <div className="anim-memory">
      <div className="anim-memory__zlbytes">
        <span className="zlbytes-label">zlbytes</span>
        <span className="zlbytes-value" style={{ color: '#10b981', fontWeight: 'bold', fontSize: 18 }}>{current}</span>
        <span className="zlbytes-unit">bytes</span>
      </div>
      <div className="anim-memory__info">
        插入数据后自动更新
      </div>
    </div>
  );
};

const ZltailJumpAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const offset = Math.floor(frame / 10) % 5;

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">zltail offset: <strong>{offset * 4}</strong></div>
      <div className="anim-traversal__path">
        {['H', 'E1', 'E2', 'E3', 'E4'].map((v, i) => (
          <React.Fragment key={i}>
            <div
              className={`anim-block ${i === offset ? 'active' : ''}`}
              style={{ background: i === 0 ? '#06b6d4' : i === 5 ? '#ef4444' : '#3b82f6' }}
            >
              {v}
            </div>
            {i < 4 && <span className="anim-traversal__arrow">→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="anim-traversal__info">O(1) 直接定位尾部!</div>
    </div>
  );
};

const ZllenCountAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 3;
  const counts = [5, 100, 65535];
  const current = counts[phase];

  return (
    <div className="anim-structure">
      <div className="anim-zllen">
        <span className="zllen-label">zllen</span>
        <span
          className="zllen-value"
          style={{
            color: phase === 2 ? '#ef4444' : '#10b981',
            fontWeight: 'bold',
            fontSize: 20
          }}
        >
          {current}
        </span>
      </div>
      <div style={{ fontSize: 10, color: '#64748b' }}>
        {phase === 2 ? '⚠️ 需遍历计数!' : '直接读取'}
      </div>
    </div>
  );
};

// ============ NEW ENCODING ANIMATIONS ============

const Int8RangeAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const values = [-128, -64, 0, 64, 127];
  const idx = Math.floor(frame / 12) % values.length;
  const current = values[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">INT8 Range</div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#3b82f6' }}>{current}</div>
      </div>
      <div className="anim-encoding__info">-128 ~ 127 | 1 byte</div>
    </div>
  );
};

const Int16RangeAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const values = [-32768, -1000, 0, 1000, 32767];
  const idx = Math.floor(frame / 12) % values.length;
  const current = values[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">INT16 Range</div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#8b5cf6' }}>{current}</div>
      </div>
      <div className="anim-encoding__info">-32768 ~ 32767 | 2 bytes</div>
    </div>
  );
};

const Int24RangeAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const values = [-8388608, -100000, 0, 100000, 8388607];
  const idx = Math.floor(frame / 12) % values.length;
  const current = values[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">INT24 Range</div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#f59e0b' }}>{current}</div>
      </div>
      <div className="anim-encoding__info">-8M ~ 8M | 3 bytes</div>
    </div>
  );
};

const Int32RangeAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const values = [-2147483648, -1000000000, 0, 1000000000, 2147483647];
  const idx = Math.floor(frame / 12) % values.length;
  const current = values[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">INT32 Range</div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 11, fontWeight: 'bold', color: '#10b981' }}>{current}</div>
      </div>
      <div className="anim-encoding__info">-2.1B ~ 2.1B | 4 bytes</div>
    </div>
  );
};

const Int64RangeAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 45) % 2;

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">INT64 Range</div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ef4444' }}>
          {phase ? '9223372036854775807' : '-9223372036854775808'}
        </div>
      </div>
      <div className="anim-encoding__info">±9.2×10^18 | 8 bytes</div>
    </div>
  );
};

const Str6bitDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const strings = ['a', 'hi', 'cat', 'test', 'hello!'];
  const idx = Math.floor(frame / 18) % strings.length;
  const current = strings[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">STR_6BIT</div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#8b5cf6' }}>"{current}"</div>
        <span style={{ color: '#64748b' }}>=&gt;</span>
        <div className="anim-block enc">{current.length}B</div>
      </div>
      <div className="anim-encoding__info">0-63 bytes | 1 byte encoding</div>
    </div>
  );
};

const Str14bitDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const strings = ['Hello world', 'Redis zip list', 'Data structure', 'Compression'];
  const idx = Math.floor(frame / 22) % strings.length;
  const current = strings[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">STR_14BIT</div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 11, fontWeight: 'bold', color: '#8b5cf6' }}>"{current}"</div>
        <span style={{ color: '#64748b' }}>=&gt;</span>
        <div className="anim-block enc">{current.length}B</div>
      </div>
      <div className="anim-encoding__info">0-16KB | 2 byte encoding</div>
    </div>
  );
};

const Str32bitDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const strings = ['This is a very long string', 'Lorem ipsum dolor sit amet'];
  const idx = Math.floor(frame / 45) % strings.length;
  const current = strings[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">STR_32BIT</div>
      <div className="anim-encoding__demo">
        <div style={{ fontSize: 10, fontWeight: 'bold', color: '#8b5cf6', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          "{current}"
        </div>
        <span style={{ color: '#64748b' }}>=&gt;</span>
        <div className="anim-block enc">{current.length}B</div>
      </div>
      <div className="anim-encoding__info">0-4GB | 5 byte encoding</div>
    </div>
  );
};

// ============ NEW CASCADE ANIMATIONS ============

const CascadePhase1Animation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const idx = Math.floor(frame / 20) % 3;

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">Phase 1: 初始状态</div>
      <div className="anim-cascade__entries">
        {[0, 1, 2].map(i => (
          <div key={i} className="anim-entry small">
            <div
              className="anim-block entry"
              style={{
                background: i === idx ? '#10b981' : '#3b82f6',
                transform: i === idx ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          </div>
        ))}
      </div>
      <div className="anim-cascade__info" style={{ fontSize: 10, color: '#94a3b8' }}>
        Entry {idx} 被选中
      </div>
    </div>
  );
};

const CascadePhase2Animation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const isExpanded = frame > 30;

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">Phase 2: 插入大节点</div>
      <div className="anim-cascade__entries">
        <div className="anim-entry small">
          <div className="anim-block entry">A</div>
        </div>
        <div className="anim-entry large">
          <div
            className="anim-block entry highlight"
            style={{ opacity: isExpanded ? 1 : 0.5 }}
          >
            NEW
          </div>
        </div>
        <div className="anim-entry small">
          <div className={`anim-block entry ${isExpanded ? 'warning' : ''}`}>B</div>
        </div>
      </div>
      {isExpanded && (
        <div className="anim-cascade__warning">⚠️ B的prevlen需要扩展!</div>
      )}
    </div>
  );
};

const CascadePhase3Animation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 3;

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">Phase 3: 连锁传播</div>
      <div className="anim-cascade__entries">
        <div className="anim-entry small">
          <div className="anim-block entry">A</div>
        </div>
        <div className="anim-entry large">
          <div className="anim-block entry highlight">NEW</div>
        </div>
        <div className="anim-entry small">
          <div className="anim-block entry" style={{ background: phase >= 1 ? '#10b981' : '#3b82f6' }}>B</div>
        </div>
        <div className="anim-entry small">
          <div className={`anim-block entry ${phase >= 2 ? 'warning' : ''}`}>C</div>
        </div>
      </div>
      <div className="anim-cascade__info" style={{ fontSize: 10, color: '#f59e0b' }}>
        {phase === 0 ? 'B更新完成' : phase === 1 ? 'C开始更新...' : '继续传播!'}
      </div>
    </div>
  );
};

const CascadePhase4Animation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const complete = frame > 30;

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">Phase 4: 完成</div>
      <div className="anim-cascade__entries">
        <div className="anim-entry small">
          <div className="anim-block entry">A</div>
        </div>
        <div className="anim-entry large">
          <div className="anim-block entry highlight">NEW</div>
        </div>
        <div className="anim-entry small">
          <div className="anim-block entry" style={{ background: '#10b981' }}>B</div>
        </div>
        <div className="anim-entry small">
          <div className="anim-block entry" style={{ background: '#10b981' }}>C</div>
        </div>
      </div>
      <div className="anim-cascade__info" style={{ fontSize: 11, color: complete ? '#10b981' : '#94a3b8' }}>
        {complete ? '✓ 连锁更新完成' : '更新中...'}
      </div>
    </div>
  );
};

const CascadeTriggerAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const thresholds = [
    { size: 250, status: 'OK' },
    { size: 253, status: 'OK' },
    { size: 254, status: 'TRIGGER!' },
    { size: 260, status: '连锁中' },
  ];
  const idx = Math.floor(frame / 22) % thresholds.length;
  const current = thresholds[idx];

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">触发动画</div>
      <div className="anim-cascade__entries">
        <div className="anim-entry small">
          <div className="anim-block entry">A</div>
        </div>
        <div className="anim-entry large">
          <div
            className="anim-block entry"
            style={{
              background: current.status === 'TRIGGER!' ? '#ef4444' :
                current.status === '连锁中' ? '#f59e0b' : '#3b82f6',
              animation: current.status !== 'OK' ? 'pulse 0.5s infinite' : 'none'
            }}
          >
            {current.size}B
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: current.status === 'OK' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
        {current.status}
      </div>
      <div className="anim-cascade__warning" style={{ fontSize: 9 }}>
        阈值: 254 bytes
      </div>
    </div>
  );
};

const CascadeMemoryAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 4;
  const sizes = [100, 104, 108, 112];
  const current = sizes[phase];

  return (
    <div className="anim-memory">
      <div className="anim-memory__grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`anim-memory__byte ${i < 4 ? 'header' : i < 14 ? 'entry' : 'end'} ${i >= 4 && i < 4 + (phase + 1) ? 'active' : ''}`}
            style={{ width: 18, height: 18, fontSize: 7 }}
          >
            {i.toString(16).toUpperCase()}
          </div>
        ))}
      </div>
      <div className="anim-memory__info">
        内存重分配: {current} bytes
      </div>
    </div>
  );
};

// ============ NEW MEMORY ANIMATIONS ============

const MemoryAllocateAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const allocated = Math.min(12, Math.floor(frame / 7));

  return (
    <div className="anim-memory">
      <div className="anim-memory__grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`anim-memory__byte ${i < 4 ? 'header' : i < 10 ? 'entry' : 'end'} ${i < allocated ? 'active' : ''}`}
            style={{ opacity: i < allocated ? 1 : 0.3 }}
          >
            {i.toString(16).toUpperCase()}
          </div>
        ))}
      </div>
      <div className="anim-memory__info">
        已分配: <strong>{allocated * 4}</strong> bytes
      </div>
    </div>
  );
};

const MemorySaveAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const savings = [0, 25, 50, 75];
  const idx = Math.floor(frame / 22) % savings.length;

  return (
    <div className="anim-comparison">
      <div className="anim-comparison__title">Memory Savings</div>
      <div className="anim-comparison__bars">
        <div className="anim-bar" style={{ width: `${savings[idx]}%`, background: '#10b981' }}>
          {savings[idx]}%
        </div>
      </div>
      <div className="anim-comparison__features">
        <span className={savings[idx] >= 50 ? 'active' : ''}>节省</span>
        <span>{savings[idx] * 2} bytes saved</span>
      </div>
    </div>
  );
};

const MemoryByteAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const bytes = ['2A', '01', '00', '04', '00', '00', '00', '00', '00', 'FF'];

  return (
    <div className="anim-memory">
      <div className="anim-memory__grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {bytes.map((b, i) => (
          <div
            key={i}
            className={`anim-memory__byte ${i === 0 ? 'header' : i === 9 ? 'end' : 'entry'} ${i === Math.floor(frame / 6) % 10 ? 'active' : ''}`}
            style={{ width: 24, height: 24, fontSize: 10 }}
          >
            {b}
          </div>
        ))}
      </div>
      <div className="anim-memory__info">
        字节级视图: <strong>HEX</strong>
      </div>
    </div>
  );
};

const CacheHitAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const hit = frame > 30;

  return (
    <div className="anim-memory">
      <div className="anim-cache-display">
        <div className="cache-line" style={{ background: hit ? '#10b981' : '#3b82f6' }}>
          Cache Line
        </div>
        <div className="cache-data" style={{ opacity: hit ? 1 : 0.5 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="cache-byte" style={{ background: '#06b6d4' }} />
          ))}
        </div>
      </div>
      <div className="anim-memory__info" style={{ color: hit ? '#10b981' : '#3b82f6' }}>
        {hit ? '✓ Cache Hit!' : '查找中...'}
      </div>
    </div>
  );
};

const CacheMissAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 3;

  return (
    <div className="anim-memory">
      <div className="anim-cache-display">
        {phase < 2 && (
          <div className="cache-line" style={{ background: '#94a3b8' }}>
            Cache Line {phase === 0 ? 'A' : 'B'}
          </div>
        )}
        {phase === 2 && (
          <div className="cache-line" style={{ background: '#ef4444', animation: 'pulse 0.5s infinite' }}>
            Cache Miss!
          </div>
        )}
      </div>
      <div className="anim-memory__info" style={{ color: phase === 2 ? '#ef4444' : '#94a3b8' }}>
        {phase === 0 ? '查找 L1...' : phase === 1 ? '查找 L2...' : '✗ 需访问主存'}
      </div>
    </div>
  );
};

// ============ NEW COMMAND ANIMATIONS ============

const LPushDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const elements = ['', 'A', 'B', 'C', 'D'];
  const count = Math.min(4, Math.floor(frame / 20));
  const current = elements.slice(0, count + 1);

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">LPUSH 操作</div>
      <div className="anim-traversal__path">
        {current.map((v, i) => (
          <React.Fragment key={i}>
            <div className={`anim-block ${i === 0 ? 'active' : ''}`} style={{ background: '#3b82f6' }}>
              {v || 'X'}
            </div>
            {i < current.length - 1 && <span className="anim-traversal__arrow">←</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="anim-traversal__info">头部插入 O(1)</div>
    </div>
  );
};

const RPushDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const elements = ['A', 'B', 'C', 'D', ''];
  const count = Math.min(4, Math.floor(frame / 20));
  const shown = elements.slice(5 - count - 1);

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">RPUSH 操作</div>
      <div className="anim-traversal__path">
        {shown.map((v, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="anim-traversal__arrow">→</span>}
            <div className={`anim-block ${i === shown.length - 1 ? 'active' : ''}`} style={{ background: '#8b5cf6' }}>
              {v || 'X'}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="anim-traversal__info">尾部插入 O(1)</div>
    </div>
  );
};

const LPopDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const elements = ['A', 'B', 'C', 'D'];
  const removed = Math.floor(frame / 30) % 2;
  const shown = removed ? elements.slice(1) : elements;

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">LPOP 操作</div>
      <div className="anim-traversal__path">
        {shown.map((v, i) => (
          <React.Fragment key={i}>
            <div className={`anim-block ${i === 0 ? 'active' : ''}`} style={{ background: '#ef4444' }}>
              {v}
            </div>
            {i < shown.length - 1 && <span className="anim-traversal__arrow">→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="anim-traversal__info">
        {removed ? '✓ 已移除 A' : '移除头部 O(1)'}
      </div>
    </div>
  );
};

const HSetDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const fields = [
    { field: 'name', value: 'Alice' },
    { field: 'age', value: '30' },
    { field: 'city', value: 'NYC' },
  ];
  const idx = Math.floor(frame / 30) % fields.length;

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">HSET 操作</div>
      <div className="anim-hash-demo">
        <div className="hash-field">
          <span className="hash-key">{fields[idx].field}</span>
          <span className="hash-arrow">=</span>
          <span className="hash-value">{fields[idx].value}</span>
        </div>
      </div>
      <div className="anim-encoding__info">O(1) 操作</div>
    </div>
  );
};

const HGetDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const fields = [
    { key: 'name', value: 'Alice' },
    { key: 'age', value: '30' },
    { key: 'city', value: 'NYC' },
  ];
  const idx = Math.floor(frame / 30) % fields.length;
  const current = fields[idx];

  return (
    <div className="anim-traversal">
      <div className="anim-traversal__dir">HGET 操作</div>
      <div className="anim-hash-demo">
        <div style={{ fontSize: 11, color: '#94a3b8' }}>HGET hash {current.key}</div>
        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>"{current.value}"</div>
      </div>
      <div className="anim-traversal__info">O(1) 查找</div>
    </div>
  );
};

const ZAddDemoAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const members = [
    { score: 100, member: 'Alice' },
    { score: 95, member: 'Bob' },
    { score: 88, member: 'Charlie' },
  ];
  const idx = Math.floor(frame / 30) % members.length;
  const current = members[idx];

  return (
    <div className="anim-encoding">
      <div className="anim-encoding__label">ZADD 操作</div>
      <div className="anim-zset-demo">
        <div className="zset-score">{current.score}</div>
        <div className="zset-member">"{current.member}"</div>
      </div>
      <div className="anim-encoding__info">添加 member</div>
    </div>
  );
};

// ============ NEW CONFIG ANIMATIONS ============

const ThresholdWarningAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const values = [32, 64, 128, 256, 512, 513];
  const idx = Math.floor(frame / 15) % values.length;
  const current = values[idx];
  const overThreshold = current > 512;

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">阈值检查</div>
      <div style={{ fontSize: 16, fontWeight: 'bold', color: overThreshold ? '#ef4444' : '#10b981' }}>
        {current}
      </div>
      {overThreshold && (
        <div className="anim-cascade__warning">⚠️ 超过阈值! 需转换</div>
      )}
      <div style={{ fontSize: 10, color: '#94a3b8' }}>
        阈值: 512
      </div>
    </div>
  );
};

const CompressDepthAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const depth = Math.floor(frame / 30) % 4;

  return (
    <div className="anim-memory">
      <div className="anim-compress-depth">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`compress-level ${i < depth ? 'compressed' : i === depth ? 'active' : ''}`}
          >
            {i === 0 ? 'Head' : i === 3 ? 'Tail' : `L${i}`}
          </div>
        ))}
      </div>
      <div className="anim-memory__info">
        压缩深度: <strong>{depth}</strong>
      </div>
    </div>
  );
};

const ConvertFlowAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 120), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const phase = Math.floor(frame / 30) % 4;
  const stages = ['ZipList', 'QuickList', 'HashTable', 'SkipList'];

  return (
    <div className="anim-cascade">
      <div className="anim-cascade__phase">转换流程</div>
      <div className="anim-convert-flow">
        {stages.map((s, i) => (
          <React.Fragment key={i}>
            <div
              className="anim-block entry"
              style={{
                background: i <= phase ? '#10b981' : '#94a3b8',
                opacity: i <= phase ? 1 : 0.4,
                fontSize: 9,
                width: 36,
                height: 24,
              }}
            >
              {s}
            </div>
            {i < 3 && <span style={{ color: i <= phase ? '#10b981' : '#94a3b8' }}>→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="anim-cascade__info" style={{ fontSize: 10, color: '#94a3b8' }}>
        {phase === 0 ? '当前: ZipList' : `转换中: ${stages[phase - 1]} → ${stages[phase]}`}
      </div>
    </div>
  );
};

const EncodingResultAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 90), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const results = [
    { type: 'ziplist', encoding: 'ziplist', color: '#3b82f6' },
    { type: 'quicklist', encoding: 'quicklist', color: '#8b5cf6' },
    { type: 'hashtable', encoding: 'hashtable', color: '#ef4444' },
    { type: 'skiplist', encoding: 'skiplist', color: '#f59e0b' },
  ];
  const idx = Math.floor(frame / 22) % results.length;
  const current = results[idx];

  return (
    <div className="anim-comparison">
      <div style={{ fontSize: 10, color: '#94a3b8' }}>OBJECT ENCODING</div>
      <div style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: current.color,
        padding: '4px 12px',
        background: `${current.color}22`,
        borderRadius: 4,
        border: `1px solid ${current.color}`
      }}>
        "{current.encoding}"
      </div>
      <div style={{ fontSize: 10, color: '#94a3b8' }}>
        类型: {current.type}
      </div>
    </div>
  );
};

export default InlineVideo;
