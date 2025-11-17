import { useNavigate } from 'react-router-dom';
import './IntroductionSection.css';

function IntroductionSection() {
  const navigate = useNavigate();

  return (
    <div className="introduction-section">
      <div className="intro-hero">
        <h1 className="intro-title">什么是 ZipList？</h1>
        <p className="intro-subtitle">Redis内存优化的核心数据结构</p>
      </div>

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
            </div>
          </div>
          <div className="path-arrow">→</div>
          <div className="path-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>编码策略</h3>
              <p>理解8种编码类型的选择</p>
            </div>
          </div>
          <div className="path-arrow">→</div>
          <div className="path-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>连锁更新</h3>
              <p>深入理解性能陷阱</p>
            </div>
          </div>
        </div>
      </div>

      <div className="concept-grid">
        <div className="concept-card">
          <div className="card-icon">🎯</div>
          <h3>核心目标</h3>
          <p><strong>节省内存</strong></p>
          <ul>
            <li>紧凑的连续内存布局</li>
            <li>无指针开销</li>
            <li>变长编码优化</li>
          </ul>
          <div className="highlight-box">
            相比普通链表可节省 <strong>40-60%</strong> 内存
          </div>
        </div>

        <div className="concept-card">
          <div className="card-icon">📦</div>
          <h3>数据结构</h3>
          <div className="structure-diagram">
            <div className="struct-part header">
              <div className="part-label">Header (12字节)</div>
              <div className="part-fields">
                <span>zlbytes</span>
                <span>zltail</span>
                <span>zllen</span>
              </div>
            </div>
            <div className="struct-arrow">↓</div>
            <div className="struct-part entries">
              <div className="part-label">Entries (N个)</div>
              <div className="part-fields">
                <span>prevlen</span>
                <span>encoding</span>
                <span>content</span>
              </div>
            </div>
            <div className="struct-arrow">↓</div>
            <div className="struct-part end">
              <div className="part-label">End (1字节)</div>
              <div className="part-fields">
                <span>0xFF</span>
              </div>
            </div>
          </div>
        </div>

        <div className="concept-card">
          <div className="card-icon">🔢</div>
          <h3>编码类型</h3>
          <div className="encoding-list">
            <div className="encoding-item">
              <span className="encoding-name">INT8/16/24/32/64</span>
              <span className="encoding-desc">整数编码</span>
            </div>
            <div className="encoding-item">
              <span className="encoding-name">STR_6BIT</span>
              <span className="encoding-desc">短字符串 (≤63B)</span>
            </div>
            <div className="encoding-item">
              <span className="encoding-name">STR_14BIT</span>
              <span className="encoding-desc">中等字符串 (≤16KB)</span>
            </div>
            <div className="encoding-item">
              <span className="encoding-name">STR_32BIT</span>
              <span className="encoding-desc">长字符串</span>
            </div>
          </div>
        </div>

        <div className="concept-card">
          <div className="card-icon">⚡</div>
          <h3>使用场景</h3>
          <div className="scenarios">
            <div className="scenario good">
              <div className="scenario-title">✅ 适用场景</div>
              <ul>
                <li>少量元素 (&lt;512个)</li>
                <li>元素值较小</li>
                <li>读多写少</li>
                <li>内存敏感</li>
              </ul>
            </div>
            <div className="scenario bad">
              <div className="scenario-title">❌ 不适用场景</div>
              <ul>
                <li>大量元素</li>
                <li>频繁插入/删除</li>
                <li>元素值很大 (&gt;64KB)</li>
                <li>随机访问频繁</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="concept-card">
          <div className="card-icon">🔄</div>
          <h3>连锁更新机制</h3>
          <p><strong>什么是连锁更新？</strong></p>
          <p className="explanation">
            当插入大节点时，可能导致后续节点的prevlen字段从1字节扩展到5字节，
            如果扩展后的节点本身也变成大节点（≥254B），就会触发下一个节点的扩展，
            形成连锁反应。
          </p>
          <div className="warning-box">
            ⚠️ 这是ZipList的性能陷阱，最坏情况下复杂度为O(n²)
          </div>
        </div>

        <div className="concept-card">
          <div className="card-icon">📊</div>
          <h3>性能特点</h3>
          <table className="performance-table">
            <thead>
              <tr>
                <th>操作</th>
                <th>平均复杂度</th>
                <th>最坏复杂度</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>lpush (头插)</td>
                <td>O(n)</td>
                <td>O(n²)</td>
              </tr>
              <tr>
                <td>rpush (尾插)</td>
                <td>O(1)</td>
                <td>O(n²)</td>
              </tr>
              <tr>
                <td>lpop/rpop</td>
                <td>O(n)</td>
                <td>O(n)</td>
              </tr>
              <tr>
                <td>lindex</td>
                <td>O(n)</td>
                <td>O(n)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="key-points">
        <h2 className="section-title">🎯 核心要点</h2>
        <div className="points-grid">
          <div className="point-card">
            <div className="point-number">1</div>
            <h4>连续内存</h4>
            <p>所有数据存储在一块连续的内存中，无需指针，CPU缓存友好</p>
          </div>
          <div className="point-card">
            <div className="point-number">2</div>
            <h4>变长编码</h4>
            <p>根据数据类型和大小自动选择最优编码，最大化节省空间</p>
          </div>
          <div className="point-card">
            <div className="point-number">3</div>
            <h4>双向遍历</h4>
            <p>通过prevlen字段支持反向遍历，无需额外的prev指针</p>
          </div>
          <div className="point-card">
            <div className="point-number">4</div>
            <h4>快速定位</h4>
            <p>通过zltail字段可以O(1)时间定位到最后一个节点</p>
          </div>
        </div>
      </div>

      <div className="redis-context">
        <h2 className="section-title">🔗 在Redis中的应用</h2>
        <div className="context-content">
          <div className="redis-example">
            <h4>List类型</h4>
            <pre><code>{`# 当列表元素较少时使用ziplist
RPUSH mylist "a" "b" "c"
OBJECT ENCODING mylist  # 返回 "ziplist"

# 超过阈值后转换为quicklist
list-max-ziplist-size -2  # 配置项`}</code></pre>
          </div>
          <div className="redis-example">
            <h4>Hash类型</h4>
            <pre><code>{`# 小hash使用ziplist
HSET user:1 name "Alice" age "25"
OBJECT ENCODING user:1  # 返回 "ziplist"

# 配置项
hash-max-ziplist-entries 512
hash-max-ziplist-value 64`}</code></pre>
          </div>
          <div className="redis-example">
            <h4>Sorted Set类型</h4>
            <pre><code>{`# 小有序集合使用ziplist
ZADD scores 100 "Alice" 95 "Bob"
OBJECT ENCODING scores  # 返回 "ziplist"

# 配置项
zset-max-ziplist-entries 128
zset-max-ziplist-value 64`}</code></pre>
          </div>
        </div>
      </div>

      <div className="next-steps">
        <h2 className="section-title">🚀 下一步</h2>
        <p>现在你已经了解了ZipList的基础知识，点击下方按钮继续学习：</p>
        <div className="next-buttons">
          <button className="next-btn demo" onClick={() => navigate('/demo')}>
            🎮 实战演示 - 亲手操作ZipList
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
