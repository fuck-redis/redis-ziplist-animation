import { useNavigate } from 'react-router-dom';
import { HeaderFieldsInteractive, MemoryComparisonChart, EncodingRangeViz, EntryStructureD3, EncodingDecisionTree, PrevlenDecisionTree, SelectionDecisionTree, ConversionFlowchart } from '../visualization';
import { CodeBlock } from '../code';
import './IntroductionSection.css';

function IntroductionSection() {
  const navigate = useNavigate();

  return (
    <div className="introduction-section">
      {/* Hero 区域 - 使用 HeaderFieldsInteractive D3 组件 */}
      <div className="intro-hero">
        <h1 className="intro-title">什么是 ZipList？</h1>
        <p className="intro-subtitle">Redis内存优化的核心数据结构</p>
        <div className="hero-video">
          <HeaderFieldsInteractive />
        </div>
      </div>

      {/* 学习路径 */}
      <div className="learning-path">
        <h2 className="section-title">📚 学习路径</h2>
        <div className="path-steps">
          <div className="path-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>基础概念</h3>
              <p>了解ZipList是什么，为什么需要它</p>
            </div>
          </div>
          <div className="path-arrow">→</div>
          <div className="path-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>数据结构</h3>
              <p>掌握Header和Entry的组成</p>
              <EntryStructureD3 />
            </div>
          </div>
          <div className="path-arrow">→</div>
          <div className="path-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>内存布局</h3>
              <p>理解连续内存vs分散内存</p>
              <MemoryComparisonChart />
            </div>
          </div>
          <div className="path-arrow">→</div>
          <div className="path-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>编码策略</h3>
              <p>理解8种编码类型的选择</p>
              <EncodingDecisionTree />
            </div>
          </div>
          <div className="path-arrow">→</div>
          <div className="path-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>连锁更新</h3>
              <p>深入理解性能陷阱</p>
              <PrevlenDecisionTree />
            </div>
          </div>
        </div>
      </div>

      {/* 核心目标 - 使用 MemoryComparisonChart D3 组件 */}
      <div className="concept-section">
        <h2 className="section-title">🎯 核心目标：节省内存</h2>
        <div className="concept-row">
          <div className="concept-text">
            <p>ZipList 通过<strong>紧凑的连续内存布局</strong>和<strong>变长编码优化</strong>，相比普通链表可节省 <strong>40-60%</strong> 内存。</p>
            <ul>
              <li>无指针开销 - 不需要 prev/next 指针</li>
              <li>变长编码 - 根据数据大小选择最优存储方式</li>
              <li>CPU缓存友好 - 连续内存提高缓存命中率</li>
            </ul>
          </div>
          <div className="concept-chart">
            <MemoryComparisonChart />
          </div>
        </div>
      </div>

      {/* 数据结构 - 使用交互式 D3 组件 */}
      <div className="concept-section">
        <h2 className="section-title">📦 数据结构详解</h2>

        <div className="d3-section">
          <h3>Header 字段（点击查看详情）</h3>
          <HeaderFieldsInteractive />
        </div>

        <div className="d3-section">
          <h3>Entry 结构（点击分离查看）</h3>
          <EntryStructureD3 />
        </div>
      </div>

      {/* 编码类型 - 使用 EncodingRangeViz D3 组件 */}
      <div className="concept-section">
        <h2 className="section-title">🔢 编码类型详解</h2>
        <p className="section-intro">ZipList 使用变长编码，根据数据大小自动选择最优方案：</p>

        <div className="encoding-grid">
          <div className="encoding-card">
            <h4>整数编码（5种）</h4>
            <EncodingRangeViz />
            <div className="encoding-example-box">
              <div className="example-title">实际示例</div>
              <div className="example-row">
                <span className="example-value">42</span>
                <span className="arrow">→</span>
                <span className="example-encoding">INT8 (1字节)</span>
              </div>
              <div className="example-row">
                <span className="example-value">300</span>
                <span className="arrow">→</span>
                <span className="example-encoding">INT16 (2字节)</span>
              </div>
            </div>
          </div>

          <div className="encoding-card">
            <h4>字符串编码（3种）</h4>
            <table className="encoding-table">
              <thead>
                <tr>
                  <th>编码</th>
                  <th>长度范围</th>
                  <th>存储方式</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>STR_6BIT</code></td>
                  <td>0-63 字节</td>
                  <td>1字节编码 + 数据</td>
                </tr>
                <tr>
                  <td><code>STR_14BIT</code></td>
                  <td>64-16383 字节</td>
                  <td>2字节编码 + 数据</td>
                </tr>
                <tr>
                  <td><code>STR_32BIT</code></td>
                  <td>16384+ 字节</td>
                  <td>5字节编码 + 数据</td>
                </tr>
              </tbody>
            </table>
            <div className="encoding-example-box">
              <div className="example-title">实际示例</div>
              <div className="example-row">
                <span className="example-value">"Hello"</span>
                <span className="arrow">→</span>
                <span className="example-encoding">STR_6BIT (6字节)</span>
              </div>
              <div className="example-row">
                <span className="example-value">"Redis"</span>
                <span className="arrow">→</span>
                <span className="example-encoding">STR_6BIT (6字节)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用场景 */}
      <div className="concept-section">
        <h2 className="section-title">⚡ 使用场景</h2>
        <div className="scenarios-grid">
          <div className="scenario-card good">
            <h3>✅ 适合的场景</h3>
            <ul>
              <li><strong>少量元素</strong> (&lt;512个) - 如排行榜、最新评论</li>
              <li><strong>元素值较小</strong> (&lt;64字节) - 如标签、计数器</li>
              <li><strong>读多写少</strong> - 主要是 LRANGE、LINDEX 等读操作</li>
              <li><strong>内存敏感</strong> - 追求极致内存效率</li>
            </ul>
            <div className="scenario-example">
              <strong>实际案例：</strong>
              <p>存储用户的最近浏览记录、热门商品列表、缓存小对象等</p>
            </div>
          </div>

          <div className="scenario-card bad">
            <h3>❌ 不适合的场景</h3>
            <ul>
              <li><strong>大量元素</strong> (&gt;10000个) - 会影响插入性能</li>
              <li><strong>频繁插入/删除</strong> - 中间位置操作是 O(n)</li>
              <li><strong>元素值很大</strong> (&gt;64KB) - 会导致连锁更新</li>
              <li><strong>随机访问频繁</strong> - 每次都需要遍历</li>
            </ul>
            <div className="scenario-example">
              <strong>替代方案：</strong>
              <p>消息队列、实时数据流等场景使用 QuickList 更合适</p>
            </div>
          </div>
        </div>
        <div className="highlight-box">
          💡 <strong>经验法则</strong>：当你不确定是否该用 ZipList 时，如果数据量小、读多写少，就放心用！
        </div>
      </div>

      {/* 连锁更新决策树 */}
      <div className="concept-section">
        <h2 className="section-title">🔄 连锁更新机制</h2>
        <p className="section-intro">连锁更新是 ZipList 最容易产生性能问题的地方，理解它的机制至关重要：</p>
        <PrevlenDecisionTree />
        <div className="warning-box">
          ⚠️ 最坏情况下复杂度为 O(n²)，但实际中很少发生（大多数 entry 远小于 254 字节）
        </div>
      </div>

      {/* 选择指南 */}
      <div className="concept-section">
        <h2 className="section-title">🧭 数据结构选择</h2>
        <SelectionDecisionTree />
      </div>

      {/* 转换流程 */}
      <div className="concept-section">
        <h2 className="section-title">🔄 数据结构转换</h2>
        <ConversionFlowchart />
      </div>

      {/* 性能特点 */}
      <div className="concept-section">
        <h2 className="section-title">📊 性能特点</h2>
        <table className="performance-table">
          <thead>
            <tr>
              <th>操作</th>
              <th>平均复杂度</th>
              <th>最坏复杂度</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>lpush (头插)</td>
              <td>O(n)</td>
              <td>O(n²)</td>
              <td>需要移动所有后续节点</td>
            </tr>
            <tr>
              <td>rpush (尾插)</td>
              <td>O(1)</td>
              <td>O(n²)</td>
              <td>有 zltail 指针直接定位尾部</td>
            </tr>
            <tr>
              <td>lpop (头删)</td>
              <td>O(n)</td>
              <td>O(n)</td>
              <td>需要移动所有后续节点</td>
            </tr>
            <tr>
              <td>rpop (尾删)</td>
              <td>O(1)</td>
              <td>O(1)</td>
              <td>有 zltail 指针</td>
            </tr>
            <tr>
              <td>lindex (随机访问)</td>
              <td>O(n)</td>
              <td>O(n)</td>
              <td>需要从头部或尾部遍历</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Redis 应用 */}
      <div className="concept-section">
        <h2 className="section-title">🔗 在 Redis 中的应用</h2>
        <div className="redis-context">
          <div className="redis-example-card">
            <h4>List 类型</h4>
            <CodeBlock language="redis" code={`# 元素少时使用 ziplist
> RPUSH mylist "a" "b" "c"
> OBJECT ENCODING mylist
"ziplist"

# 元素多时转换为 quicklist
> RPUSH mylist $(seq 1 1000)
> OBJECT ENCODING mylist
"quicklist"`} />
            <div className="config-hint">
              配置项：list-max-ziplist-size
            </div>
          </div>

          <div className="redis-example-card">
            <h4>Hash 类型</h4>
            <CodeBlock language="redis" code={`# 小 hash 使用 ziplist
> HSET user:1 name "Alice" age "25"
> OBJECT ENCODING user:1
"ziplist"

# 配置项控制阈值
hash-max-ziplist-entries 512
hash-max-ziplist-value 64`} />
          </div>

          <div className="redis-example-card">
            <h4>Sorted Set 类型</h4>
            <CodeBlock language="redis" code={`# 小有序集合使用 ziplist
> ZADD scores 100 "Alice"
> OBJECT ENCODING scores
"ziplist"

# 配置项
zset-max-ziplist-entries 128
zset-max-ziplist-value 64`} />
          </div>
        </div>
      </div>

      {/* 下一步 */}
      <div className="next-steps">
        <h2 className="section-title">🚀 下一步</h2>
        <p>现在你已经了解了 ZipList 的基础知识，点击下方按钮继续学习：</p>
        <div className="next-buttons">
          <button className="next-btn demo" onClick={() => navigate('/demo')}>
            🎮 实战演示 - 亲手操作 ZipList
          </button>
          <button className="next-btn concepts" onClick={() => navigate('/concepts')}>
            🔬 核心概念 - 深入理解原理
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroductionSection;
