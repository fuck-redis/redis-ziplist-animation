import React from 'react';
import { Player } from '@remotion/player';
import { ZipListStructure } from '../../remotion/videos/ZipListStructure';
import { EncodingMechanism } from '../../remotion/videos/EncodingMechanism';
import { CascadeUpdate } from '../../remotion/videos/CascadeUpdate';
import { TraversalMechanism } from '../../remotion/videos/TraversalMechanism';
import { MemoryLayout } from '../../remotion/videos/MemoryLayout';
import { DataStructureComparison } from '../../remotion/videos/DataStructureComparison';
import { ConversionTrigger } from '../../remotion/videos/ConversionTrigger';
import { ConfigStructureOverview } from '../../remotion/videos/ConfigStructureOverview';
import { MemoryLayoutComparison } from '../../remotion/videos/MemoryLayoutComparison';
import { PerformanceComparison } from '../../remotion/videos/PerformanceComparison';
import { SelectionDecisionTree } from '../../remotion/videos/SelectionDecisionTree';
import { ListCommandsDemo } from '../../remotion/videos/ListCommandsDemo';
import { HashCommandsDemo } from '../../remotion/videos/HashCommandsDemo';
import { EncodingCheckDemo } from '../../remotion/videos/EncodingCheckDemo';
import { CommandComplexity } from '../../remotion/videos/CommandComplexity';
import { HeaderFields } from '../../remotion/videos/HeaderFields';
import { EntryStructure } from '../../remotion/videos/EntryStructure';
import { PrevlenExpansion } from '../../remotion/videos/PrevlenExpansion';
import { IntegerEncoding } from '../../remotion/videos/IntegerEncoding';
import { StringEncoding } from '../../remotion/videos/StringEncoding';
import { MemoryOptimization } from '../../remotion/videos/MemoryOptimization';
import './VideoSection.css';

export type VideoType =
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
  | 'complexity';

interface VideoConfig {
  id: VideoType;
  title: string;
  description: string;
  component: React.FC<{ title?: string }>;
  duration: number;
  relatedPage?: string;
}

const videoConfigs: VideoConfig[] = [
  {
    id: 'structure',
    title: 'ZipList 内存结构',
    description: '了解 ZipList 的头部、节点和尾部结构',
    component: ZipListStructure,
    duration: 180,
    relatedPage: 'concepts',
  },
  {
    id: 'encoding',
    title: '编码机制详解',
    description: '整数编码和字符串编码的原理与选择策略',
    component: EncodingMechanism,
    duration: 240,
    relatedPage: 'concepts',
  },
  {
    id: 'cascade',
    title: '连锁更新原理',
    description: '理解 Redis 连锁更新的触发条件和传播机制',
    component: CascadeUpdate,
    duration: 300,
    relatedPage: 'concepts',
  },
  {
    id: 'traversal',
    title: '遍历机制',
    description: '正向遍历与反向遍历的实现原理',
    component: TraversalMechanism,
    duration: 240,
    relatedPage: 'demo',
  },
  {
    id: 'memory',
    title: '内存布局详解',
    description: '字节级理解 ZipList 的内存组织方式',
    component: MemoryLayout,
    duration: 210,
    relatedPage: 'demo',
  },
  {
    id: 'comparison',
    title: '数据结构对比',
    description: 'ZipList、链表和 QuickList 的对比分析',
    component: DataStructureComparison,
    duration: 270,
    relatedPage: 'comparison',
  },
  // New videos from Remotion Dev Agents
  {
    id: 'header',
    title: 'Header 字段详解',
    description: 'zlbytes、zltail、zllen 字段的作用',
    component: HeaderFields,
    duration: 180,
    relatedPage: 'concepts',
  },
  {
    id: 'entry',
    title: 'Entry 结构详解',
    description: 'prevlen、encoding、content 三部分结构',
    component: EntryStructure,
    duration: 180,
    relatedPage: 'concepts',
  },
  {
    id: 'prevlen',
    title: 'Prevlen 扩展机制',
    description: 'prevlen 字段从 1 字节扩展到 5 字节的过程',
    component: PrevlenExpansion,
    duration: 180,
    relatedPage: 'concepts',
  },
  {
    id: 'int-encoding',
    title: '整数编码详解',
    description: 'INT8、INT16、INT24、INT32、INT64 编码',
    component: IntegerEncoding,
    duration: 180,
    relatedPage: 'concepts',
  },
  {
    id: 'str-encoding',
    title: '字符串编码详解',
    description: 'STR_6BIT、STR_14BIT、STR_32BIT 编码',
    component: StringEncoding,
    duration: 180,
    relatedPage: 'concepts',
  },
  {
    id: 'memory-opt',
    title: '内存优化原理',
    description: 'ZipList 相比链表的内存优化',
    component: MemoryOptimization,
    duration: 180,
    relatedPage: 'concepts',
  },
  {
    id: 'conversion',
    title: '转换触发条件',
    description: 'ZipList 转换为其他结构的条件',
    component: ConversionTrigger,
    duration: 300,
    relatedPage: 'concepts',
  },
  {
    id: 'config',
    title: '配置参数详解',
    description: 'Redis.conf 中 ZipList 相关配置',
    component: ConfigStructureOverview,
    duration: 300,
    relatedPage: 'config',
  },
  {
    id: 'memory-layout',
    title: '内存布局对比',
    description: '不同数据结构的内存布局对比',
    component: MemoryLayoutComparison,
    duration: 360,
    relatedPage: 'comparison',
  },
  {
    id: 'performance',
    title: '性能对比分析',
    description: '各操作在不同数据结构中的复杂度',
    component: PerformanceComparison,
    duration: 360,
    relatedPage: 'comparison',
  },
  {
    id: 'decision',
    title: '选择决策树',
    description: 'Redis 自动选择数据结构的决策流程',
    component: SelectionDecisionTree,
    duration: 300,
    relatedPage: 'comparison',
  },
  {
    id: 'list-cmds',
    title: 'List 命令演示',
    description: 'LPUSH、RPUSH、LPOP 等命令的执行过程',
    component: ListCommandsDemo,
    duration: 300,
    relatedPage: 'commands',
  },
  {
    id: 'hash-cmds',
    title: 'Hash 命令演示',
    description: 'HSET、HGET 等命令的执行过程',
    component: HashCommandsDemo,
    duration: 300,
    relatedPage: 'commands',
  },
  {
    id: 'encoding-check',
    title: '编码检查演示',
    description: 'OBJECT ENCODING 命令的使用',
    component: EncodingCheckDemo,
    duration: 300,
    relatedPage: 'commands',
  },
  {
    id: 'complexity',
    title: '命令复杂度',
    description: '各命令的时间复杂度对照表',
    component: CommandComplexity,
    duration: 300,
    relatedPage: 'commands',
  },
];

interface VideoSectionProps {
  videos?: VideoType[];
  title?: string;
  compact?: boolean;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videos = ['structure', 'encoding', 'cascade'],
  title = '原理讲解视频',
  compact = false,
}) => {
  const selectedVideos = videoConfigs.filter(v => videos.includes(v.id));

  if (compact) {
    return (
      <div className="video-section video-section--compact">
        <div className="video-section__grid">
          {selectedVideos.map(video => (
            <div key={video.id} className="video-section__card">
              <div className="video-section__card-player">
                <Player
                  component={video.component}
                  durationInFrames={video.duration}
                  fps={30}
                  compositionWidth={640}
                  compositionHeight={360}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  controls
                  loop
                />
              </div>
              <div className="video-section__card-info">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="video-section">
      <div className="video-section__header">
        <h3>{title}</h3>
        <span className="video-section__badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {selectedVideos.length} 个教学视频
        </span>
      </div>

      <div className="video-section__grid">
        {selectedVideos.map(video => (
          <div
            key={video.id}
            className="video-section__card"
          >
            <div className="video-section__card-player">
              <Player
                component={video.component}
                durationInFrames={video.duration}
                fps={30}
                compositionWidth={960}
                compositionHeight={540}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                loop
              />
            </div>
            <div className="video-section__card-info">
              <h4>{video.title}</h4>
              <p>{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
