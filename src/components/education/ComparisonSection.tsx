import { VideoEmbed } from '../video/VideoPlayer';
import { SelectionDecisionTree, PerformanceBarChart } from '../visualization';
import './ComparisonSection.css';

function ComparisonSection() {
  return (
    <div className="comparison-section">
      <h1 className="comparison-title">🔬 数据结构对比</h1>
      <p className="comparison-intro">
        Redis 列表类型在不同阶段使用不同的底层数据结构。
        了解它们的优缺点有助于在实际应用中做出最佳选择。
      </p>

      <div className="hero-video">
        <VideoEmbed videoId="comparison" title="数据结构对比详解" size="large" />
      </div>

      {/* 内存布局对比 */}
      <section className="compare-section">
        <h2 className="section-heading">🧠 内存布局对比</h2>

        <div className="memory-compare">
          <div className="structure-card">
            <h3>ZipList</h3>
            <div className="memory-visual ziplist">
              <div className="memory-block header">Header<br/>(12B)</div>
              <div className="memory-block entry">Entry1</div>
              <div className="memory-block entry">Entry2</div>
              <div className="memory-block entry">Entry3</div>
              <div className="memory-block end">End</div>
            </div>
            <p className="structure-desc">连续内存，所有节点紧凑存储</p>
            <ul className="structure-features">
              <li>✓ 内存连续，CPU缓存友好</li>
              <li>✓ 无指针开销</li>
              <li>✗ 插入删除需要移动数据</li>
              <li>✗ 可能触发连锁更新</li>
            </ul>
          </div>

          <div className="structure-card">
            <h3>QuickList</h3>
            <div className="memory-visual quicklist">
              <div className="pointer-block">prev</div>
              <div className="ziplist-block">
                <div className="mini-header">ZIP</div>
                <div className="mini-entry">E1</div>
                <div className="mini-entry">E2</div>
              </div>
              <div className="pointer-block">next</div>
              <div className="ziplist-block">
                <div className="mini-header">ZIP</div>
                <div className="mini-entry">E3</div>
                <div className="mini-entry">E4</div>
              </div>
              <div className="pointer-block">next</div>
            </div>
            <p className="structure-desc">多个ZipList组成的双向链表</p>
            <ul className="structure-features">
              <li>✓ 结合ZipList和链表的优点</li>
              <li>✓ 头尾操作O(1)</li>
              <li>✓ 避免大连锁更新</li>
              <li>✗ 有指针开销</li>
            </ul>
          </div>

          <div className="structure-card">
            <h3>LinkedList</h3>
            <div className="memory-visual linkedlist">
              <div className="node-block">
                <div className="node-data">Entry1</div>
                <div className="node-arrow">→</div>
              </div>
              <div className="node-block">
                <div className="node-data">Entry2</div>
                <div className="node-arrow">→</div>
              </div>
              <div className="node-block">
                <div className="node-data">Entry3</div>
                <div className="node-arrow">→</div>
              </div>
              <div className="node-null">NULL</div>
            </div>
            <p className="structure-desc">经典双向链表，节点分散存储</p>
            <ul className="structure-features">
              <li>✓ 插入删除O(1)（已知位置）</li>
              <li>✓ 无需连续内存</li>
              <li>✗ 内存碎片多</li>
              <li>✗ 指针开销大（16B/节点）</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 性能对比 */}
      <section className="compare-section">
        <h2 className="section-heading">📊 性能对比</h2>

        <PerformanceBarChart />

        <div className="performance-table-wrapper">
          <table className="performance-table">
            <thead>
              <tr>
                <th>操作</th>
                <th>ZipList</th>
                <th>QuickList</th>
                <th>LinkedList</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LPUSH (头插)</td>
                <td className="medium">O(n)</td>
                <td className="good">O(1)*</td>
                <td className="good">O(1)</td>
              </tr>
              <tr>
                <td>RPUSH (尾插)</td>
                <td className="good">O(1)**</td>
                <td className="good">O(1)</td>
                <td className="good">O(1)</td>
              </tr>
              <tr>
                <td>LPOP (头删)</td>
                <td className="medium">O(n)</td>
                <td className="good">O(1)*</td>
                <td className="good">O(1)</td>
              </tr>
              <tr>
                <td>RPOP (尾删)</td>
                <td className="good">O(1)</td>
                <td className="good">O(1)</td>
                <td className="good">O(1)</td>
              </tr>
              <tr>
                <td>LINSERT (中间插入)</td>
                <td className="bad">O(n)</td>
                <td className="medium">O(n)*</td>
                <td className="medium">O(n)</td>
              </tr>
              <tr>
                <td>LINDEX (索引访问)</td>
                <td className="bad">O(n)</td>
                <td className="medium">O(n)*</td>
                <td className="bad">O(n)</td>
              </tr>
              <tr>
                <td>LRANGE (范围查询)</td>
                <td className="medium">O(n)</td>
                <td className="medium">O(n)</td>
                <td className="bad">O(n)</td>
              </tr>
              <tr>
                <td>内存占用</td>
                <td className="good">低</td>
                <td className="medium">中</td>
                <td className="bad">高</td>
              </tr>
              <tr>
                <td>CPU缓存</td>
                <td className="good">友好</td>
                <td className="medium">较友好</td>
                <td className="bad">不友好</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="table-note">
          * QuickList在中间位置操作时需要定位到具体的ZipList
          ** ZipList尾插O(1)是因为有zltail指针直接指向尾部
        </p>

        <div className="performance-legend">
          <span className="legend-item good">绿色 = 推荐</span>
          <span className="legend-item medium">黄色 = 可接受</span>
          <span className="legend-item bad">红色 = 不推荐</span>
        </div>
      </section>

      {/* 适用场景 */}
      <section className="compare-section">
        <h2 className="section-heading">🎯 适用场景</h2>

        <div className="scenario-grid">
          <div className="scenario-card ziplist">
            <div className="scenario-header">
              <span className="scenario-icon">📦</span>
              <h3>ZipList 最佳场景</h3>
            </div>
            <ul className="scenario-list">
              <li>少量元素（&lt; 512个）</li>
              <li>元素值较小（&lt; 64字节）</li>
              <li>读多写少（尤其是顺序读写）</li>
              <li>内存敏感环境</li>
            </ul>
            <div className="scenario-example">
              <strong>典型应用：</strong>
              <p>排行榜、最新评论、缓存小对象列表</p>
            </div>
          </div>

          <div className="scenario-card quicklist">
            <div className="scenario-header">
              <span className="scenario-icon">🚀</span>
              <h3>QuickList 最佳场景</h3>
            </div>
            <ul className="scenario-list">
              <li>中等规模数据（512 - 10000个）</li>
              <li>频繁的头尾操作</li>
              <li>需要避免连锁更新</li>
              <li>平衡性能和内存</li>
            </ul>
            <div className="scenario-example">
              <strong>典型应用：</strong>
              <p>消息队列、任务队列、活跃用户列表</p>
            </div>
          </div>

          <div className="scenario-card linkedlist">
            <div className="scenario-header">
              <span className="scenario-icon">🔗</span>
              <h3>LinkedList 场景</h3>
            </div>
            <ul className="scenario-list">
              <li>大量元素（&gt; 10000个）</li>
              <li>频繁的中间插入删除</li>
              <li>不在意内存开销</li>
            </ul>
            <div className="scenario-example">
              <strong>注意：</strong>
              <p>现代Redis几乎不使用LinkedList，QuickList是其改进</p>
            </div>
          </div>
        </div>
      </section>

      {/* 选择指南 */}
      <section className="compare-section">
        <h2 className="section-heading">🧭 如何选择？</h2>

        <div className="decision-tree">
          <SelectionDecisionTree />

          <div className="decision-step">
            <div className="step-question">元素数量？</div>
            <div className="step-branches">
              <div className="branch">
                <span className="branch-label">&lt; 512</span>
                <div className="branch-arrow">↓</div>
                <span className="branch-result ziplist">ZipList ✓</span>
              </div>
              <div className="branch">
                <span className="branch-label">512 - 10000</span>
                <div className="branch-arrow">↓</div>
                <span className="branch-result quicklist">QuickList ✓</span>
              </div>
              <div className="branch">
                <span className="branch-label">&gt; 10000</span>
                <div className="branch-arrow">↓</div>
                <span className="branch-result quicklist">QuickList ✓</span>
              </div>
            </div>
          </div>

          <div className="decision-note">
            <h4>💡 Redis 自动处理</h4>
            <p>
              实际上，Redis 会根据配置的阈值自动在 ZipList 和 QuickList 之间切换。
              你只需要合理配置 list-max-ziplist-size 参数即可。
            </p>
          </div>
        </div>
      </section>

      <div className="section-nav">
        <a href="/config" className="nav-link">← 配置参数</a>
        <a href="/commands" className="nav-link">Redis命令 →</a>
      </div>
    </div>
  );
}

export default ComparisonSection;
