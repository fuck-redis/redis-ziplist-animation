import { useState } from 'react';
import { REDIS_COMMANDS } from '@/config/redisCommands';
import { InlineVideo } from '../video/InlineVideo';
import { VideoEmbed } from '../video/VideoPlayer';
import { CommandEncoder } from '../visualization';
import { CodeBlock } from '../code';
import './CommandsSection.css';

function CommandsSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedCommand, setExpandedCommand] = useState<number | null>(null);

  const currentCommands = REDIS_COMMANDS[activeCategory].commands;

  const getVideoId = () => {
    switch (activeCategory) {
      case 0: return 'list-commands';
      case 1: return 'hash-commands';
      case 2: return 'zset-commands';
      default: return 'list-commands';
    }
  };

  return (
    <div className="commands-section">
      <h1 className="commands-title">⌨️ Redis 命令演示</h1>
      <p className="commands-intro">
        了解哪些 Redis 命令会使用 ZipList 存储，以及它们的工作原理。
      </p>

      <div className="section-hero">
        <VideoEmbed videoId={getVideoId()} title={`${REDIS_COMMANDS[activeCategory].name} 命令演示`} size="large" />
      </div>

      {/* 命令分类 */}
      <div className="command-tabs">
        {REDIS_COMMANDS.map((category, index) => (
          <button
            key={category.name}
            className={`tab-btn ${activeCategory === index ? 'active' : ''}`}
            onClick={() => setActiveCategory(index)}
          >
            <span className="tab-icon">{category.icon}</span>
            <span className="tab-name">{category.name}</span>
          </button>
        ))}
      </div>

      <CommandEncoder />

      {/* 命令列表 */}
      <div className="command-list">
        {currentCommands.map((cmd, index) => (
          <div
            key={cmd.command}
            className={`command-card ${expandedCommand === index ? 'expanded' : ''}`}
          >
            <div
              className="command-header"
              onClick={() => setExpandedCommand(expandedCommand === index ? null : index)}
            >
              <div className="command-info">
                <code className="command-name">{cmd.command}</code>
                <p className="command-desc">{cmd.description}</p>
              </div>
              <span className="expand-icon">{expandedCommand === index ? '−' : '+'}</span>
            </div>

            {expandedCommand === index && (
              <div className="command-details">
                <div className="detail-row">
                  <span className="detail-label">复杂度：</span>
                  <span className="detail-value">{cmd.complexity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ZipList 条件：</span>
                  <span className="detail-value ziplist-condition">{cmd.ziplistCondition}</span>
                </div>
                {cmd.relatedCommands && (
                  <div className="detail-row">
                    <span className="detail-label">相关命令：</span>
                    <span className="detail-value">
                      {cmd.relatedCommands.map((rc) => (
                        <code key={rc} className="related-command">{rc}</code>
                      ))}
                    </span>
                  </div>
                )}
                <div className="command-demo">
                  <h4>命令示例：</h4>
                  <CodeBlock language="bash" code={getCommandExample(REDIS_COMMANDS[activeCategory].name, cmd)} />
                </div>
                <InlineVideo videoType="traversal" title="命令执行" size="default" />
                {activeCategory === 0 && <InlineVideo videoType="lpush-demo" title="LPUSH" size="default" />}
                {activeCategory === 0 && <InlineVideo videoType="rpush-demo" title="RPUSH" size="default" />}
                {activeCategory === 1 && <InlineVideo videoType="hset-demo" title="HSET" size="default" />}
                {activeCategory === 1 && <InlineVideo videoType="hget-demo" title="HGET" size="default" />}
                {activeCategory === 2 && <InlineVideo videoType="zadd-demo" title="ZADD" size="default" />}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 编码检查 */}
      <section className="encoding-check">
        <h2 className="section-heading">🔍 OBJECT ENCODING 检查</h2>
        <p className="section-intro">
          使用 OBJECT ENCODING 命令可以查看 Redis 对象的底层编码类型：
        </p>

        <VideoEmbed videoId="encoding" title="编码机制详解" size="default" />

        <div className="encoding-examples">
          <div className="encoding-example">
            <div className="example-header">
              <code>OBJECT ENCODING mylist</code>
              <span className="encoding-value ziplist">ziplist</span>
            </div>
            <p className="example-desc">当列表元素少且值小时</p>
          </div>

          <div className="encoding-example">
            <div className="example-header">
              <code>OBJECT ENCODING mylist</code>
              <span className="encoding-value quicklist">quicklist</span>
            </div>
            <p className="example-desc">当列表元素多或值大时</p>
          </div>

          <div className="encoding-example">
            <div className="example-header">
              <code>OBJECT ENCODING myhash</code>
              <span className="encoding-value ziplist">ziplist</span>
            </div>
            <p className="example-desc">当 Hash 字段少且值小时</p>
          </div>

          <div className="encoding-example">
            <div className="example-header">
              <code>OBJECT ENCODING myhash</code>
              <span className="encoding-value hashtable">hashtable</span>
            </div>
            <p className="example-desc">当 Hash 字段多或值大时</p>
          </div>

          <div className="encoding-example">
            <div className="example-header">
              <code>OBJECT ENCODING myzset</code>
              <span className="encoding-value ziplist">ziplist</span>
            </div>
            <p className="example-desc">当 Sorted Set 成员少且值小时</p>
          </div>

          <div className="encoding-example">
            <div className="example-header">
              <code>OBJECT ENCODING myzset</code>
              <span className="encoding-value skiplist">skiplist</span>
            </div>
            <p className="example-desc">当 Sorted Set 成员多或值大时</p>
          </div>
        </div>
      </section>

      <div className="section-nav">
        <a href="/comparison" className="nav-link">← 数据结构对比</a>
        <a href="/concepts" className="nav-link">核心概念 →</a>
      </div>
    </div>
  );
}

// 获取命令示例
function getCommandExample(category: string, cmd: any): string {
  switch (category) {
    case 'List':
      if (cmd.command.startsWith('LPUSH')) return `127.0.0.1:6379> LPUSH mylist "hello"
(integer) 1

127.0.0.1:6379> LPUSH mylist "world"
(integer) 2

127.0.0.1:6379> LRANGE mylist 0 -1
1) "world"
2) "hello"`;
      if (cmd.command.startsWith('RPUSH')) return `127.0.0.1:6379> RPUSH mylist "start"
(integer) 1

127.0.0.1:6379> RPUSH mylist "end"
(integer) 2

127.0.0.1:6379> LRANGE mylist 0 -1
1) "start"
2) "end"`;
      if (cmd.command.startsWith('LPOP')) return `127.0.0.1:6379> LPOP mylist
"first"

127.0.0.1:6379> LPOP mylist
"second"`;
      if (cmd.command.startsWith('LINDEX')) return `127.0.0.1:6379> LINDEX mylist 0
"first"

127.0.0.1:6379> LINDEX mylist -1
"last"`;
      return `127.0.0.1:6379> ${cmd.command.split(' ')[0]} mylist "value"`;
    case 'Hash':
      if (cmd.command.startsWith('HSET')) return `127.0.0.1:6379> HSET user:1001 name "Alice" age "30"
(integer) 2

127.0.0.1:6379> HGET user:1001 name
"Alice"`;
      if (cmd.command.startsWith('HGET')) return `127.0.0.1:6379> HGET user:1001 name
"Alice"`;
      if (cmd.command.startsWith('HGETALL')) return `127.0.0.1:6379> HGETALL user:1001
1) "name"
2) "Alice"
3) "age"
4) "30"`;
      return `127.0.0.1:6379> ${cmd.command.split(' ')[0]} myhash field "value"`;
    case 'Sorted Set':
      if (cmd.command.startsWith('ZADD')) return `127.0.0.1:6379> ZADD scores 100 "Alice" 95 "Bob"
(integer) 2

127.0.0.1:6379> ZRANGE scores 0 -1 WITHSCORES
1) "Bob"
2) "95"
3) "Alice"
4) "100"`;
      if (cmd.command.startsWith('ZSCORE')) return `127.0.0.1:6379> ZSCORE scores "Alice"
"100"`;
      if (cmd.command.startsWith('ZRANGE')) return `127.0.0.1:6379> ZRANGE scores 0 -1
1) "Bob"
2) "Alice"`;
      return `127.0.0.1:6379> ${cmd.command.split(' ')[0]} myzset 1 "member"`;
    default:
      return '';
  }
}

export default CommandsSection;
