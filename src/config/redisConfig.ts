/**
 * Redis ZipList 配置参数
 */

import { RedisConfig, RedisConfigItem } from '@/types/ziplist';

export const REDIS_CONFIG: RedisConfig = {
  list: {
    maxZipListSize: [
      { value: -5, label: '-5 (最大32KB)', description: '单个ziplist最大32KB，性能优先' },
      { value: -4, label: '-4 (最大16KB)', description: '单个ziplist最大16KB' },
      { value: -3, label: '-3 (最大8KB)', description: '单个ziplist最大8KB' },
      { value: -2, label: '-2 (最大4KB)', description: '单个ziplist最大4KB，默认推荐值' },
      { value: -1, label: '-1 (最大2KB)', description: '单个ziplist最大2KB，内存优先' },
      { value: 0, label: '0 (禁用)', description: '禁用ziplist，始终使用quicklist' },
      { value: 1, label: '1 (最大1项)', description: '每个ziplist最多1个元素' },
      { value: 2, label: '2 (最大2项)', description: '每个ziplist最多2个元素' },
    ] as RedisConfigItem[],
    maxZipListEntries: 512,
  },
  hash: {
    maxZipListEntries: 512,
    maxZipListValue: 64,
  },
  sortedSet: {
    maxZipListEntries: 128,
    maxZipListValue: 64,
  },
};

// 转换阈值说明
export const CONVERSION_THRESHOLDS = {
  list: {
    // 元素数量超过此值会考虑转换
    elementCountThreshold: 512,
    // 单个元素大小超过此值会考虑转换
    elementSizeThreshold: 64,
    // 当使用 quicklist 时的压缩深度配置
    quickListDepth: {
      min: 0,
      max: 50,
      default: 0,
    },
  },
  hash: {
    // 字段数量超过此值会转换
    fieldCountThreshold: 512,
    // 字段值大小超过此值会转换
    fieldValueThreshold: 64,
  },
  sortedSet: {
    // 成员数量超过此值会转换
    memberCountThreshold: 128,
    // 成员大小超过此值会转换
    memberSizeThreshold: 64,
  },
};

// 获取配置描述
export function getConfigDescription(configName: string): string {
  const descriptions: Record<string, string> = {
    'list-max-ziplist-size': '控制List类型使用ziplist的最大节点数或字节大小',
    'list-max-ziplist-entries': '已废弃，用list-max-ziplist-size代替',
    'hash-max-ziplist-entries': 'Hash类型使用ziplist的最大字段数',
    'hash-max-ziplist-value': 'Hash类型使用ziplist的字段值最大字节数',
    'zset-max-ziplist-entries': 'Sorted Set类型使用ziplist的最大成员数',
    'zset-max-ziplist-value': 'Sorted Set类型使用ziplist的成员最大字节数',
  };
  return descriptions[configName] || '未知配置';
}

// 编码优化说明
export const ENCODING_OPTIMIZATION = {
  smallInteger: {
    range: [-128, 127],
    encoding: 'INT8',
    bytes: 1,
    description: '小整数使用1字节存储',
  },
  mediumInteger: {
    range: [-32768, 32767],
    encoding: 'INT16',
    bytes: 2,
    description: '中等整数使用2字节存储',
  },
  largeInteger: {
    range: [-8388608, 8388607],
    encoding: 'INT24',
    bytes: 3,
    description: '较大整数使用3字节存储',
  },
  bigInteger: {
    range: [-2147483648, 2147483647],
    encoding: 'INT32',
    bytes: 4,
    description: '大整数使用4字节存储',
  },
  hugeInteger: {
    range: ['-2^63', '2^63-1'],
    encoding: 'INT64',
    bytes: 8,
    description: '超大整数使用8字节存储',
  },
};
