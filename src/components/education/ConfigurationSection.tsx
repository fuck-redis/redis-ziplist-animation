import { useState } from 'react';
import { REDIS_CONFIG, CONVERSION_THRESHOLDS } from '@/config/redisConfig';
import { ConversionFlowchart } from '../visualization';
import { CodeBlock } from '../code';
import './ConfigurationSection.css';

function ConfigurationSection() {
  const [selectedListSize, setSelectedListSize] = useState(-2);

  return (
    <div className="configuration-section">
      <h1 className="config-title">⚙️ Redis 配置参数详解</h1>
      <p className="config-intro">
        Redis 提供了多个配置参数来控制 ZipList 的使用条件和行为。
        合理配置这些参数可以在内存使用和性能之间取得平衡。
      </p>

      {/* List 类型配置 */}
      <section className="config-section">
        <h2 className="section-heading">📋 List 类型配置</h2>

        <div className="config-card">
          <h3>list-max-ziplist-size</h3>
          <p className="config-description">
            控制 List 类型使用 ZipList 编码的节点大小阈值。当节点大小超过此值时，
            Redis 会将 ZipList 转换为 QuickList（多个 ZipList 组成的双向链表）。
          </p>

          <div className="config-values">
            <h4>可选值：</h4>
            <table className="config-table">
              <thead>
                <tr>
                  <th>值</th>
                  <th>含义</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {REDIS_CONFIG.list.maxZipListSize.map((item) => (
                  <tr
                    key={String(item.value)}
                    className={selectedListSize === item.value ? 'selected' : ''}
                    onClick={() => setSelectedListSize(item.value as number)}
                  >
                    <td><code>{item.value}</code></td>
                    <td>{item.label}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="config-example">
            <h4>配置示例：</h4>
            <CodeBlock language="bash" code={`# redis.conf
list-max-ziplist-size -2  # 单个ziplist最大8KB（推荐默认）

# 或者使用正数表示最大元素个数
list-max-ziplist-size 64  # 每个ziplist最多64个元素`} />
          </div>
        </div>
      </section>

      {/* Hash 类型配置 */}
      <section className="config-section">
        <h2 className="section-heading">#️⃣ Hash 类型配置</h2>

        <div className="config-grid">
          <div className="config-card">
            <h3>hash-max-ziplist-entries</h3>
            <p className="config-description">
              控制 Hash 类型使用 ZipList 编码的最大字段数量。当字段数量超过此值时，
              Redis 会将 ZipList 转换为 HashTable 编码。
            </p>
            <div className="config-value-display">
              <span className="value-label">默认值：</span>
              <span className="value-number">{REDIS_CONFIG.hash.maxZipListEntries}</span>
            </div>
          </div>

          <div className="config-card">
            <h3>hash-max-ziplist-value</h3>
            <p className="config-description">
              控制 Hash 类型使用 ZipList 编码时，字段值的最大字节数。当任何字段值
              超过此值时，Redis 会将 ZipList 转换为 HashTable 编码。
            </p>
            <div className="config-value-display">
              <span className="value-label">默认值：</span>
              <span className="value-number">{REDIS_CONFIG.hash.maxZipListValue} 字节</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sorted Set 类型配置 */}
      <section className="config-section">
        <h2 className="section-heading">🏆 Sorted Set 类型配置</h2>

        <div className="config-grid">
          <div className="config-card">
            <h3>zset-max-ziplist-entries</h3>
            <p className="config-description">
              控制 Sorted Set 类型使用 ZipList 编码的最大成员数量。当成员数量超过此值时，
              Redis 会将 ZipList 转换为 SkipList 编码（有序数组 + 哈希表）。
            </p>
            <div className="config-value-display">
              <span className="value-label">默认值：</span>
              <span className="value-number">{REDIS_CONFIG.sortedSet.maxZipListEntries}</span>
            </div>
          </div>

          <div className="config-card">
            <h3>zset-max-ziplist-value</h3>
            <p className="config-description">
              控制 Sorted Set 类型使用 ZipList 编码时，成员的最大字节数。当任何成员
              字符串长度超过此值时，Redis 会将 ZipList 转换为 SkipList 编码。
            </p>
            <div className="config-value-display">
              <span className="value-label">默认值：</span>
              <span className="value-number">{REDIS_CONFIG.sortedSet.maxZipListValue} 字节</span>
            </div>
          </div>
        </div>
      </section>

      {/* 转换阈值 */}
      <section className="config-section">
        <h2 className="section-heading">🔄 数据结构转换条件</h2>

        <ConversionFlowchart />

        <div className="conversion-flow">
          <div className="conversion-step">
            <div className="step-icon">📦</div>
            <h4>List 类型</h4>
            <div className="threshold-info">
              <p>元素数 &gt; {CONVERSION_THRESHOLDS.list.elementCountThreshold}</p>
              <p>或 单元素 &gt; {CONVERSION_THRESHOLDS.list.elementSizeThreshold} 字节</p>
            </div>
            <div className="arrow">↓</div>
            <div className="target">QuickList</div>
          </div>

          <div className="conversion-step">
            <div className="step-icon">#️⃣</div>
            <h4>Hash 类型</h4>
            <div className="threshold-info">
              <p>字段数 &gt; {CONVERSION_THRESHOLDS.hash.fieldCountThreshold}</p>
              <p>或 字段值 &gt; {CONVERSION_THRESHOLDS.hash.fieldValueThreshold} 字节</p>
            </div>
            <div className="arrow">↓</div>
            <div className="target">HashTable</div>
          </div>

          <div className="conversion-step">
            <div className="step-icon">🏆</div>
            <h4>Sorted Set 类型</h4>
            <div className="threshold-info">
              <p>成员数 &gt; {CONVERSION_THRESHOLDS.sortedSet.memberCountThreshold}</p>
              <p>或 成员 &gt; {CONVERSION_THRESHOLDS.sortedSet.memberSizeThreshold} 字节</p>
            </div>
            <div className="arrow">↓</div>
            <div className="target">SkipList</div>
          </div>
        </div>

        <div className="conversion-note">
          <h4>💡 重要说明：</h4>
          <ul>
            <li>转换是单向的，一旦转换为更复杂的结构，就不会自动转回</li>
            <li>可以使用 OBJECT ENCODING 命令查看当前编码类型</li>
            <li>可以使用 DEBUG OBJECT ENCODING 命令强制重新编码</li>
          </ul>
        </div>
      </section>

      {/* 查看编码类型 */}
      <section className="config-section">
        <h2 className="section-heading">🔍 查看编码类型</h2>

        <div className="command-example">
          <h4>使用 OBJECT ENCODING 命令：</h4>
          <CodeBlock language="bash" code={`# 查看 List 编码
> RPUSH mylist "a" "b" "c"
> OBJECT ENCODING mylist
"ziplist"

# 查看 Hash 编码
> HSET myhash field1 "value1"
> OBJECT ENCODING myhash
"ziplist"

# 查看 Sorted Set 编码
> ZADD myzset 1 "one"
> OBJECT ENCODING myzset
"ziplist"

# 超过阈值后
> RPUSH mylist $(seq -s ' ' 1 1000)
> OBJECT ENCODING mylist
"quicklist"`} />
        </div>
      </section>

      <div className="section-nav">
        <p>继续学习：</p>
        <a href="/comparison" className="nav-link">数据结构对比 →</a>
      </div>
    </div>
  );
}

export default ConfigurationSection;
