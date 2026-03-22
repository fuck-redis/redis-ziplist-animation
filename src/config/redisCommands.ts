/**
 * Redis ZipList 相关命令配置
 */

export interface RedisCommandConfig {
  command: string;
  description: string;
  ziplistCondition: string;
  complexity: string;
  relatedCommands?: string[];
}

export interface CommandCategory {
  name: string;
  icon: string;
  commands: RedisCommandConfig[];
}

// List 类型命令
const LIST_COMMANDS: RedisCommandConfig[] = [
  {
    command: 'LPUSH key value [value ...]',
    description: '将一个或多个值插入到列表头部（左侧）',
    ziplistCondition: '元素数 < list-max-ziplist-entries 且单个元素 < list-max-ziplist-size',
    complexity: 'O(1) 到 O(N)',
    relatedCommands: ['LPUSHX', 'LPOP', 'LLEN'],
  },
  {
    command: 'RPUSH key value [value ...]',
    description: '将一个或多个值插入到列表尾部（右侧）',
    ziplistCondition: '元素数 < list-max-ziplist-entries 且单个元素 < list-max-ziplist-size',
    complexity: 'O(1)',
    relatedCommands: ['RPUSHX', 'RPOP', 'LLEN'],
  },
  {
    command: 'LPOP key [count]',
    description: '移除并返回列表头部的第一个元素',
    ziplistCondition: '元素数 < list-max-ziplist-entries',
    complexity: 'O(1)',
    relatedCommands: ['RPOP', 'LPUSH', 'LLEN'],
  },
  {
    command: 'RPOP key [count]',
    description: '移除并返回列表尾部的最后一个元素',
    ziplistCondition: '元素数 < list-max-ziplist-entries',
    complexity: 'O(1)',
    relatedCommands: ['LPOP', 'RPUSH', 'LLEN'],
  },
  {
    command: 'LINDEX key index',
    description: '通过索引获取列表中的元素',
    ziplistCondition: '元素数 < list-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['LRANGE', 'LSET'],
  },
  {
    command: 'LINSERT key BEFORE|AFTER pivot value',
    description: '在列表中某个元素前或后插入新元素',
    ziplistCondition: '元素数 < list-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['LPUSH', 'RPUSH', 'LREM'],
  },
  {
    command: 'LLEN key',
    description: '获取列表长度',
    ziplistCondition: '始终使用ziplist',
    complexity: 'O(1)',
    relatedCommands: ['LPUSH', 'RPUSH'],
  },
  {
    command: 'LRANGE key start stop',
    description: '获取列表指定范围内的元素',
    ziplistCondition: '元素数 < list-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['LINDEX', 'LTRIM'],
  },
  {
    command: 'LSET key index value',
    description: '通过索引设置列表中元素的值',
    ziplistCondition: '元素数 < list-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['LINDEX', 'LINSERT'],
  },
];

// Hash 类型命令
const HASH_COMMANDS: RedisCommandConfig[] = [
  {
    command: 'HSET key field value [field value ...]',
    description: '设置hash字段的值',
    ziplistCondition: '字段数 < hash-max-ziplist-entries 且值大小 < hash-max-ziplist-value',
    complexity: 'O(1) 到 O(N)',
    relatedCommands: ['HMSET', 'HGET', 'HSETNX'],
  },
  {
    command: 'HGET key field',
    description: '获取hash字段的值',
    ziplistCondition: '字段数 < hash-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['HMGET', 'HGETALL'],
  },
  {
    command: 'HMGET key field [field ...]',
    description: '获取多个hash字段的值',
    ziplistCondition: '字段数 < hash-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['HGET', 'MGET'],
  },
  {
    command: 'HGETALL key',
    description: '获取hash中所有字段和值',
    ziplistCondition: '字段数 < hash-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['HKEYS', 'HVALS'],
  },
  {
    command: 'HLEN key',
    description: '获取hash的字段数量',
    ziplistCondition: '字段数 < hash-max-ziplist-entries',
    complexity: 'O(1)',
    relatedCommands: ['HDEL', 'HSET'],
  },
  {
    command: 'HEXISTS key field',
    description: '检查hash字段是否存在',
    ziplistCondition: '字段数 < hash-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['HGET', 'HSET'],
  },
  {
    command: 'HKEYS key',
    description: '获取hash中所有字段名',
    ziplistCondition: '字段数 < hash-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['HVALS', 'HGETALL'],
  },
  {
    command: 'HVALS key',
    description: '获取hash中所有值',
    ziplistCondition: '字段数 < hash-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['HKEYS', 'HGETALL'],
  },
];

// Sorted Set 类型命令
const SORTED_SET_COMMANDS: RedisCommandConfig[] = [
  {
    command: 'ZADD key score member [score member ...]',
    description: '向有序集合添加一个或多个成员',
    ziplistCondition: '成员数 < zset-max-ziplist-entries 且成员大小 < zset-max-ziplist-value',
    complexity: 'O(log N) 到 O(N)',
    relatedCommands: ['ZSCORE', 'ZRANGE', 'ZREM'],
  },
  {
    command: 'ZSCORE key member',
    description: '获取有序集合中成员的分数',
    ziplistCondition: '成员数 < zset-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['ZADD', 'ZRANGE'],
  },
  {
    command: 'ZRANGE key start stop [WITHSCORES]',
    description: '获取有序集合中指定范围的成员',
    ziplistCondition: '成员数 < zset-max-ziplist-entries',
    complexity: 'O(log N + M)',
    relatedCommands: ['ZREVRANGE', 'ZRANGEBYSCORE'],
  },
  {
    command: 'ZREVRANGE key start stop [WITHSCORES]',
    description: '获取有序集合中指定范围的成员（逆序）',
    ziplistCondition: '成员数 < zset-max-ziplist-entries',
    complexity: 'O(log N + M)',
    relatedCommands: ['ZRANGE', 'ZREVRANGEBYSCORE'],
  },
  {
    command: 'ZRANK key member',
    description: '获取有序集合中成员的索引（从小到大）',
    ziplistCondition: '成员数 < zset-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['ZREVRANK', 'ZSCORE'],
  },
  {
    command: 'ZREVRANK key member',
    description: '获取有序集合中成员的索引（从大到小）',
    ziplistCondition: '成员数 < zset-max-ziplist-entries',
    complexity: 'O(N)',
    relatedCommands: ['ZRANK', 'ZSCORE'],
  },
  {
    command: 'ZCARD key',
    description: '获取有序集合的成员数量',
    ziplistCondition: '始终使用ziplist',
    complexity: 'O(1)',
    relatedCommands: ['ZADD', 'ZREM'],
  },
];

// 导出所有命令分类
export const REDIS_COMMANDS: CommandCategory[] = [
  {
    name: 'List',
    icon: '📋',
    commands: LIST_COMMANDS,
  },
  {
    name: 'Hash',
    icon: '#️⃣',
    commands: HASH_COMMANDS,
  },
  {
    name: 'Sorted Set',
    icon: '🏆',
    commands: SORTED_SET_COMMANDS,
  },
];

// 命令模拟函数
export interface SimulatedCommand {
  type: 'lpush' | 'rpush' | 'lpop' | 'rpop' | 'linsert' | 'hset' | 'hget' | 'zadd' | 'zrange';
  args: string[];
  description: string;
}

export function simulateCommand(command: SimulatedCommand): string {
  const { type, args } = command;

  switch (type) {
    case 'lpush':
      return `LPUSH ${args[0]} ${args.slice(1).join(' ')} - O(1) 头插`;
    case 'rpush':
      return `RPUSH ${args[0]} ${args.slice(1).join(' ')} - O(1) 尾插`;
    case 'lpop':
      return `LPOP ${args[0]} - O(1) 头删`;
    case 'rpop':
      return `RPOP ${args[0]} - O(1) 尾删`;
    case 'linsert':
      return `LINSERT ${args[0]} ${args[1]} ${args[2]} ${args[3]} - O(n) 中间插入`;
    case 'hset':
      return `HSET ${args[0]} ${args[1]} ${args[2]} - O(1) 设置字段`;
    case 'hget':
      return `HGET ${args[0]} ${args[1]} - O(n) 获取字段`;
    case 'zadd':
      return `ZADD ${args[0]} ${args[1]} ${args[2]} - O(log n) 添加成员`;
    case 'zrange':
      return `ZRANGE ${args[0]} ${args[1]} ${args[2]} - O(log n + m) 范围查询`;
    default:
      return '未知命令';
  }
}
