/**
 * ZipList 数据结构类型定义
 * Redis ZipList 是一种紧凑的双向链表实现，用于节省内存
 */

// 节点编码类型
export enum EntryEncoding {
  // 整数编码
  INT8 = 'int8',       // 8位整数 (-128 ~ 127)
  INT16 = 'int16',     // 16位整数 (-32768 ~ 32767)
  INT24 = 'int24',     // 24位整数 (-8388608 ~ 8388607)
  INT32 = 'int32',     // 32位整数 (-2147483648 ~ 2147483647)
  INT64 = 'int64',     // 64位整数
  
  // 字符串编码
  STR_6BIT = 'str_6bit',    // 长度用6bit表示 (最大63字节)
  STR_14BIT = 'str_14bit',  // 长度用14bit表示 (最大16383字节)
  STR_32BIT = 'str_32bit',  // 长度用32bit表示 (最大4GB)
}

// 编码字节标识
export const ENCODING_BYTES = {
  [EntryEncoding.INT8]: 0xFE,   // 11111110
  [EntryEncoding.INT16]: 0xC0,  // 11000000
  [EntryEncoding.INT24]: 0xF0,  // 11110000
  [EntryEncoding.INT32]: 0xD0,  // 11010000
  [EntryEncoding.INT64]: 0xE0,  // 11100000
  [EntryEncoding.STR_6BIT]: 0x00,   // 00xxxxxx
  [EntryEncoding.STR_14BIT]: 0x40,  // 01xxxxxx xxxxxxxx
  [EntryEncoding.STR_32BIT]: 0x80,  // 10xxxxxx ...
} as const;

// ZipList 头部信息
export interface ZipListHeader {
  zlbytes: number;    // 整个ZipList占用的内存字节数 (4字节)
  zltail: number;     // 最后一个节点的偏移量 (4字节)
  zllen: number;      // 节点数量 (4字节, 当值为65535时需要遍历整个列表才能确定实际长度)
}

// ZipList 节点
export interface ZipListEntry {
  index: number;              // 节点索引 (逻辑索引，非偏移量)
  prevlen: number;            // 前一个节点的长度
  prevlenSize: number;        // prevlen字段的字节数 (1或5)
  encoding: EntryEncoding;    // 编码类型
  encodingByte: number;       // 编码字节的实际值
  content: string | number;   // 节点内容
  contentSize: number;        // 内容占用的字节数
  totalSize: number;          // 节点总大小 (prevlen + encoding + content)
  offset: number;             // 在ZipList中的字节偏移量
  
  // 动画状态标识
  isNew?: boolean;            // 是否为新插入的节点
  isUpdating?: boolean;       // 是否在更新中
  isDeleting?: boolean;       // 是否正在删除
  isHighlighted?: boolean;    // 是否高亮显示
  animationPhase?: string;    // 当前动画阶段
}

// 内存字节表示 (用于字节级可视化)
export interface MemoryByte {
  byteIndex: number;          // 字节索引 (全局偏移量)
  value: number;              // 字节值 (0-255)
  hexValue: string;           // 十六进制表示
  binaryValue: string;        // 二进制表示
  
  // 归属信息
  belongsTo: 'header' | 'entry' | 'end';  // 属于哪个部分
  entryIndex?: number;        // 如果属于entry，是哪个节点
  fieldType?: 'zlbytes' | 'zltail' | 'zllen' | 'prevlen' | 'encoding' | 'content';  // 字段类型
  
  // 显示状态
  isHighlighted?: boolean;    // 是否高亮
  highlightColor?: string;    // 高亮颜色
  tooltip?: string;           // 悬浮提示信息
}

// 完整的 ZipList 状态
export interface ZipListState {
  header: ZipListHeader;
  entries: ZipListEntry[];
  end: number;                // 结束标志 0xFF (1字节)
  memoryBlocks: MemoryByte[]; // 字节级内存表示
  totalBytes: number;         // 总字节数
  createdAt: number;          // 创建时间戳
}

// 操作类型
export type ZipListOperation = 
  | 'create'          // 创建ZipList
  | 'insert'          // 在指定位置插入节点
  | 'push'            // 在尾部推入节点
  | 'pop'             // 从尾部弹出节点
  | 'delete'          // 删除指定节点
  | 'update'          // 更新节点内容
  | 'cascadeUpdate'   // 连锁更新演示
  | 'batchOperation'  // 批量操作
  | 'clear';          // 清空ZipList

// 操作参数
export interface OperationParams {
  position?: number;                    // 插入/删除位置
  value?: string | number;              // 节点值
  values?: (string | number)[];         // 批量值
  operationType?: 'head' | 'tail' | 'random';  // 操作位置类型
  forceEncoding?: EntryEncoding;        // 强制使用的编码类型 (用于编码实验)
  animationSpeed?: number;              // 动画速度倍率 (1.0为正常速度)
  showStepByStep?: boolean;             // 是否逐步显示
}

// 操作结果
export interface OperationResult {
  success: boolean;
  newState: ZipListState;
  message: string;
  affectedEntries: number[];            // 受影响的节点索引
  cascadeUpdateCount?: number;          // 连锁更新次数
  bytesAdded?: number;                  // 新增字节数
  bytesRemoved?: number;                // 移除字节数
  animationSteps?: AnimationStep[];     // 动画步骤
}

// 动画步骤
export interface AnimationStep {
  id: string;
  type: 'move' | 'write' | 'delete' | 'highlight' | 'update';
  duration: number;                     // 持续时间 (ms)
  description: string;                  // 步骤描述
  affectedBytes?: number[];             // 受影响的字节索引
  affectedEntries?: number[];           // 受影响的节点索引
  data?: any;                           // 额外数据
}

// 编码决策信息 (用于编码实验室)
export interface EncodingDecision {
  input: string | number;
  inputType: 'string' | 'number';
  testedEncodings: {
    encoding: EntryEncoding;
    isValid: boolean;
    reason: string;
    bytesNeeded: number;
  }[];
  selectedEncoding: EntryEncoding;
  encodingByte: number;
  totalBytes: number;
}

// 连锁更新信息
export interface CascadeUpdateInfo {
  triggerEntry: number;                 // 触发连锁更新的节点
  affectedEntries: number[];            // 受影响的节点
  updateChain: {
    entryIndex: number;
    oldPrevlenSize: number;
    newPrevlenSize: number;
    oldTotalSize: number;
    newTotalSize: number;
  }[];
  totalBytesAdded: number;
  updateCount: number;
}

// 统计信息
export interface ZipListStatistics {
  entryCount: number;                   // 节点数量
  totalBytes: number;                   // 总字节数
  headerBytes: number;                  // 头部字节数
  entriesBytes: number;                 // 节点字节数
  avgEntrySize: number;                 // 平均节点大小
  memoryEfficiency: number;             // 内存效率 (相比普通链表)
  cascadeUpdateCount: number;           // 发生的连锁更新次数
  encodingDistribution: {               // 编码类型分布
    [key in EntryEncoding]?: number;
  };
}

// 对比数据 (与其他数据结构对比)
export interface ComparisonData {
  ziplist: {
    memoryUsage: number;
    nodeCount: number;
  };
  linkedList: {
    memoryUsage: number;
    nodeCount: number;
    overhead: number;                   // 指针开销
  };
  savingsPercentage: number;            // 节省百分比
}

// 教育性提示
export interface EducationalHint {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'tip';
  relatedConcept?: string;              // 相关概念
  codeExample?: string;                 // 代码示例
}

// 可视化配置
export interface VisualizationConfig {
  showByteView: boolean;                // 显示字节视图
  showStructureView: boolean;           // 显示结构视图
  showMemoryLayout: boolean;            // 显示内存布局
  showStatistics: boolean;              // 显示统计信息
  animationSpeed: number;               // 动画速度
  highlightDuration: number;            // 高亮持续时间
  colorScheme: 'default' | 'dark' | 'colorblind';  // 色彩方案
}
