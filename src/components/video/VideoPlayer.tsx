import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { ZipListStructure } from '../../remotion/videos/ZipListStructure';
import { EncodingMechanism } from '../../remotion/videos/EncodingMechanism';
import { CascadeUpdate } from '../../remotion/videos/CascadeUpdate';
import { TraversalMechanism } from '../../remotion/videos/TraversalMechanism';
import { MemoryLayout } from '../../remotion/videos/MemoryLayout';
import { DataStructureComparison } from '../../remotion/videos/DataStructureComparison';
import { HeaderFields } from '../../remotion/videos/HeaderFields';
import { EntryStructure } from '../../remotion/videos/EntryStructure';
import { IntegerEncoding } from '../../remotion/videos/IntegerEncoding';
import { StringEncoding } from '../../remotion/videos/StringEncoding';
import { CascadeTimeline } from '../../remotion/videos/CascadeTimeline';
import { MemoryOptimization } from '../../remotion/videos/MemoryOptimization';
import { ListCommandsDemo } from '../../remotion/videos/ListCommandsDemo';
import { HashCommandsDemo } from '../../remotion/videos/HashCommandsDemo';
import { ZsetCommandsDemo } from '../../remotion/videos/ZsetCommandsDemo';
import { QuickListStructure } from '../../remotion/videos/QuickListStructure';
import { LinkedListScattered } from '../../remotion/videos/LinkedListScattered';
import { CPUCacheComparison } from '../../remotion/videos/CPUCacheComparison';
import { EncodingCheckDemo } from '../../remotion/videos/EncodingCheckDemo';
import { CommandComplexity } from '../../remotion/videos/CommandComplexity';
import { ConfigStructureOverview } from '../../remotion/videos/ConfigStructureOverview';
import { PerformanceComparison } from '../../remotion/videos/PerformanceComparison';
import { ConversionTrigger } from '../../remotion/videos/ConversionTrigger';
import { SelectionDecisionTree } from '../../remotion/videos/SelectionDecisionTree';
import { MemoryLayoutComparison } from '../../remotion/videos/MemoryLayoutComparison';
import { MemoryDuel } from '../../remotion/videos/MemoryDuel';
import { HeaderFieldsTimeline } from '../../remotion/videos/HeaderFieldsTimeline';
import { ZltailO1Animation } from '../../remotion/videos/ZltailO1Animation';
import { PrevlenExpansion } from '../../remotion/videos/PrevlenExpansion';
import { PrevlenExpansionDetail } from '../../remotion/videos/PrevlenExpansionDetail';
import { ContentStorageAnimation } from '../../remotion/videos/ContentStorageAnimation';
import { CascadeTriggerDemo } from '../../remotion/videos/CascadeTriggerDemo';
import { CascadeUpdateFull } from '../../remotion/videos/CascadeUpdateFull';
import { ConversionWarning } from '../../remotion/videos/ConversionWarning';
import { RedisAutoSwitch } from '../../remotion/videos/RedisAutoSwitch';
import { ZipListToQuickList } from '../../remotion/videos/ZipListToQuickList';
import './VideoPlayer.css';

interface VideoInfo {
  id: string;
  title: string;
  description: string;
  component: React.FC<{ title?: string }>;
  duration: number;
}

const videos: VideoInfo[] = [
  {
    id: 'structure',
    title: 'ZipList 内存结构',
    description: '了解 ZipList 的头部、节点和尾部结构',
    component: ZipListStructure,
    duration: 180,
  },
  {
    id: 'encoding',
    title: '编码机制详解',
    description: '整数编码和字符串编码的原理与选择策略',
    component: EncodingMechanism,
    duration: 240,
  },
  {
    id: 'cascade',
    title: '连锁更新原理',
    description: '理解 Redis 连锁更新的触发条件和传播机制',
    component: CascadeUpdate,
    duration: 300,
  },
  {
    id: 'traversal',
    title: '遍历机制',
    description: '正向遍历与反向遍历的实现原理',
    component: TraversalMechanism,
    duration: 240,
  },
  {
    id: 'memory',
    title: '内存布局详解',
    description: '字节级理解 ZipList 的内存组织方式',
    component: MemoryLayout,
    duration: 210,
  },
  {
    id: 'comparison',
    title: '数据结构对比',
    description: 'ZipList、链表和 QuickList 的对比分析',
    component: DataStructureComparison,
    duration: 270,
  },
  {
    id: 'header-fields',
    title: 'Header 字段详解',
    description: 'zlbytes、zltail、zllen 三个字段的作用',
    component: HeaderFields,
    duration: 180,
  },
  {
    id: 'entry-structure',
    title: 'Entry 结构详解',
    description: 'prevlen、encoding、content 三部分解析',
    component: EntryStructure,
    duration: 200,
  },
  {
    id: 'int-encoding',
    title: '整数编码详解',
    description: 'INT8/16/24/32/64 编码范围与选择',
    component: IntegerEncoding,
    duration: 220,
  },
  {
    id: 'str-encoding',
    title: '字符串编码详解',
    description: 'STR_6BIT/14BIT/32BIT 编码解析',
    component: StringEncoding,
    duration: 200,
  },
  {
    id: 'cascade-timeline',
    title: '连锁更新时序',
    description: '连锁更新的四个阶段分解演示',
    component: CascadeTimeline,
    duration: 280,
  },
  {
    id: 'memory-opt',
    title: '内存优化原理',
    description: 'ZipList 如何节省内存的原理',
    component: MemoryOptimization,
    duration: 200,
  },
  {
    id: 'list-commands',
    title: 'List 命令演示',
    description: 'LPUSH、RPUSH、LPOP 等命令的执行过程',
    component: ListCommandsDemo,
    duration: 250,
  },
  {
    id: 'hash-commands',
    title: 'Hash 命令演示',
    description: 'HSET、HGET 等命令的执行过程',
    component: HashCommandsDemo,
    duration: 220,
  },
  {
    id: 'zset-commands',
    title: 'ZSet 命令演示',
    description: 'ZADD、ZRANGE 等命令的执行过程',
    component: ZsetCommandsDemo,
    duration: 240,
  },
  {
    id: 'quicklist',
    title: 'QuickList 结构',
    description: '多个 ZipList 组成的双向链表',
    component: QuickListStructure,
    duration: 200,
  },
  {
    id: 'linkedlist',
    title: 'LinkedList 分散结构',
    description: '节点分散存储的内存布局',
    component: LinkedListScattered,
    duration: 180,
  },
  {
    id: 'cpu-cache',
    title: 'CPU 缓存对比',
    description: '连续内存 vs 分散内存的缓存命中对比',
    component: CPUCacheComparison,
    duration: 220,
  },
  {
    id: 'encoding-check',
    title: '编码检查演示',
    description: 'OBJECT ENCODING 命令的执行过程',
    component: EncodingCheckDemo,
    duration: 180,
  },
  {
    id: 'command-complexity',
    title: '命令复杂度分析',
    description: '各命令的时间复杂度和性能特点',
    component: CommandComplexity,
    duration: 200,
  },
  {
    id: 'config-overview',
    title: '配置参数总览',
    description: 'Redis ZipList 配置参数详解',
    component: ConfigStructureOverview,
    duration: 180,
  },
  {
    id: 'performance-compare',
    title: '性能对比分析',
    description: 'ZipList vs QuickList vs LinkedList 性能对比',
    component: PerformanceComparison,
    duration: 240,
  },
  {
    id: 'conversion-trigger',
    title: '转换触发条件',
    description: '数据结构转换的触发条件和阈值',
    component: ConversionTrigger,
    duration: 200,
  },
  {
    id: 'selection-tree',
    title: '选择决策树',
    description: '何时使用 ZipList 的决策流程',
    component: SelectionDecisionTree,
    duration: 180,
  },
  {
    id: 'memory-layout-compare',
    title: '内存布局对比',
    description: '不同数据结构的内存布局详细对比',
    component: MemoryLayoutComparison,
    duration: 220,
  },
  {
    id: 'memory-duel',
    title: '内存节省对比',
    description: 'ZipList 相比链表的内存节省演示',
    component: MemoryDuel,
    duration: 200,
  },
  {
    id: 'header-timeline',
    title: 'Header 字段时序',
    description: 'Header 字段的详细解析和时序变化',
    component: HeaderFieldsTimeline,
    duration: 180,
  },
  {
    id: 'zltail-o1',
    title: 'zltail O(1)定位',
    description: '通过 zltail 字段快速定位尾部节点',
    component: ZltailO1Animation,
    duration: 160,
  },
  {
    id: 'prevlen-expansion',
    title: 'prevlen 扩展详解',
    description: 'prevlen 字段从 1 字节扩展到 5 字节的过程',
    component: PrevlenExpansion,
    duration: 200,
  },
  {
    id: 'prevlen-detail',
    title: 'prevlen 扩展详情',
    description: 'prevlen 扩展的字节级详细解析',
    component: PrevlenExpansionDetail,
    duration: 220,
  },
  {
    id: 'content-storage',
    title: 'content 存储原理',
    description: 'content 字段的存储方式和编码',
    component: ContentStorageAnimation,
    duration: 180,
  },
  {
    id: 'cascade-trigger-demo',
    title: '连锁触发演示',
    description: '连锁更新触发条件的动画演示',
    component: CascadeTriggerDemo,
    duration: 200,
  },
  {
    id: 'cascade-full',
    title: '连锁更新完整过程',
    description: '连锁更新从触发到完成的完整过程',
    component: CascadeUpdateFull,
    duration: 300,
  },
  {
    id: 'conversion-warning',
    title: '转换警告机制',
    description: '何时会触发数据结构的转换',
    component: ConversionWarning,
    duration: 180,
  },
  {
    id: 'redis-auto-switch',
    title: 'Redis 自动切换',
    description: 'Redis 自动在 ZipList 和 QuickList 之间切换',
    component: RedisAutoSwitch,
    duration: 220,
  },
  {
    id: 'ziplist-to-quicklist',
    title: 'ZipList 转 QuickList',
    description: 'ZipList 转换为 QuickList 的过程演示',
    component: ZipListToQuickList,
    duration: 250,
  },
];

// Simple embeddable video player for education pages
interface VideoEmbedProps {
  videoId: string;
  title?: string;
  size?: 'default' | 'large' | 'full';
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoId, title, size = 'default' }) => {
  const video = videos.find(v => v.id === videoId);

  if (!video) {
    return <div className="video-embed-error">Video not found: {videoId}</div>;
  }

  return (
    <div className={`video-embed video-embed--${size}`}>
      {title && <div className="video-embed__title">{title}</div>}
      <div className="video-embed__player">
        <Player
          component={video.component}
          durationInFrames={video.duration}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          loop
        />
      </div>
    </div>
  );
};

// Full video player with sidebar
interface VideoPlayerProps {
  defaultVideoId?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ defaultVideoId = 'structure' }) => {
  const [currentVideo, setCurrentVideo] = useState<VideoInfo>(
    videos.find(v => v.id === defaultVideoId) || videos[0]
  );

  const handleVideoSelect = (video: VideoInfo) => {
    setCurrentVideo(video);
  };

  return (
    <div className="video-player">
      <div className="video-player__sidebar">
        <div className="video-player__sidebar-header">
          <h3>教学视频</h3>
          <span className="video-player__count">{videos.length} 个视频</span>
        </div>
        <div className="video-player__list">
          {videos.map(video => (
            <button
              key={video.id}
              className={`video-player__item ${currentVideo.id === video.id ? 'active' : ''}`}
              onClick={() => handleVideoSelect(video)}
            >
              <div className="video-player__item-title">{video.title}</div>
              <div className="video-player__item-desc">{video.description}</div>
              <div className="video-player__item-duration">
                {Math.round(video.duration / 30)}s
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="video-player__main">
        <div className="video-player__canvas">
          <Player
            component={currentVideo.component}
            durationInFrames={currentVideo.duration}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls
            loop
          />
        </div>

        <div className="video-player__info">
          <h2 className="video-player__title">{currentVideo.title}</h2>
          <p className="video-player__description">{currentVideo.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
