import { InlineVideo } from '../video/InlineVideo';
import { HeaderFieldsInteractive, EntryStructureD3, EncodingRangeViz, MemoryComparisonChart } from '../visualization';
import { CodeBlock } from '../code';
import './ConceptsSection.css';

function ConceptsSection() {
  return (
    <div className="concepts-section">
      <h1 className="concepts-title">🔬 核心概念深入解析</h1>

      {/* Header字段详解 */}
      <section className="concept-detail section-block">
        <h2 className="concept-heading">1. Header 结构详解</h2>
        <div className="section-intro">
          <p>ZipList 的 Header 占用 10 字节，包含 3 个字段，用于管理整个结构。</p>
        </div>

        <div className="d3-interactive">
          <HeaderFieldsInteractive />
        </div>

        <div className="field-cards">
          <div className="field-card">
            <div className="field-header">
              <span className="field-name">zlbytes</span>
              <span className="field-type">uint32_t (4字节)</span>
            </div>
            <div className="field-body">
              <p><strong>作用：</strong>记录整个 ZipList 占用的总字节数</p>
              <ul>
                <li>快速获取整个结构的大小，无需遍历</li>
                <li>内存管理时快速判断是否需要扩容</li>
                <li>Redis MEMORY 命令获取对象大小</li>
              </ul>
              <div className="code-example">
                <CodeBlock language="bash" code={`初始状态: zlbytes = 13 (空列表)
插入42后: zlbytes = 16 (12+3+1)
  12字节Header + 3字节Entry + 1字节End`} />
              </div>
            </div>
          </div>

          <div className="field-card">
            <div className="field-header">
              <span className="field-name">zltail</span>
              <span className="field-type">uint32_t (4字节)</span>
            </div>
            <div className="field-body">
              <p><strong>作用：</strong>记录最后一个 entry 的偏移量</p>
              <ul>
                <li>O(1) 时间定位到最后一个节点</li>
                <li>支持从尾部快速插入（rpush）</li>
                <li>支持从尾部快速删除（rpop）</li>
              </ul>
              <div className="highlight-tip">
                💡 这是 ZipList 相比普通数组的优势之一
              </div>
            </div>
          </div>

          <div className="field-card">
            <div className="field-header">
              <span className="field-name">zllen</span>
              <span className="field-type">uint16_t (2字节)</span>
            </div>
            <div className="field-body">
              <p><strong>作用：</strong>记录 entry 的数量</p>
              <ul>
                <li>当节点数 &lt; 65535 时，存储真实数量</li>
                <li>当节点数 ≥ 65535 时，值为 65535，需要遍历计数</li>
              </ul>
              <div className="warning-tip">
                ⚠️ 当节点数超过 65535 时，zllen 无法表示真实数量
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry结构详解 */}
      <section className="concept-detail section-block">
        <h2 className="concept-heading">2. Entry 结构详解</h2>

        <div className="d3-interactive">
          <EntryStructureD3 />
        </div>

        <div className="entry-details">
          <div className="detail-card">
            <h3>prevlen 字段</h3>
            <p><strong>作用：</strong>记录前一个 entry 的长度，用于反向遍历</p>
            <div className="prevlen-rules">
              <div className="rule-item">
                <div className="rule-condition">前一个 entry &lt; 254 字节</div>
                <div className="rule-result">prevlen 用 1 字节存储</div>
                <code>prevlen = 42 → [0x2A]</code>
              </div>
              <div className="rule-item">
                <div className="rule-condition">前一个 entry ≥ 254 字节</div>
                <div className="rule-result">prevlen 用 5 字节存储</div>
                <code>prevlen = 300 → [0xFE][0x2C][0x01][0x00][0x00]</code>
              </div>
            </div>
            <div className="critical-note">
              🔥 这就是连锁更新的根源！
            </div>
          </div>

          <div className="detail-card">
            <h3>encoding 字段</h3>
            <p><strong>作用：</strong>指示如何解析 content 字段</p>
            <div className="encoding-categories">
              <div className="encoding-section">
                <h4>整数编码（5种）</h4>
                <EncodingRangeViz />
              </div>
              <div className="encoding-section">
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
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>content 字段</h3>
            <p><strong>作用：</strong>存储实际数据</p>
            <div className="content-examples">
              <div className="example-item">
                <div className="example-label">整数示例：42</div>
                <div className="example-detail">
                  <code>encoding: INT8 (1字节)</code>
                  <code>content: [0x2A]</code>
                  <code>总大小: prevlen(1) + encoding(1) + content(1) = 3字节</code>
                </div>
              </div>
              <div className="example-item">
                <div className="example-label">字符串示例："Hello"</div>
                <div className="example-detail">
                  <code>encoding: STR_6BIT (1字节，包含长度5)</code>
                  <code>content: [0x48][0x65][0x6C][0x6C][0x6F]</code>
                  <code>总大小: prevlen(1) + encoding(1) + content(5) = 7字节</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 连锁更新详解 */}
      <section className="concept-detail section-block">
        <h2 className="concept-heading">3. 连锁更新机制深入</h2>

        <div className="cascade-intro">
          <p className="intro-text">
            连锁更新(Cascade Update)是 ZipList 最容易产生性能问题的地方。
            理解它的机制对于正确使用 ZipList 至关重要。
          </p>
          <div className="cascade-animation">
            <InlineVideo videoType="cascade" title="连锁更新动画演示" size="xlarge" />
          </div>
        </div>

        <div className="cascade-content">
          <div className="trigger-section">
            <h3>触发条件</h3>
            <div className="trigger-conditions">
              <div className="condition-box">
                <div className="condition-title">条件1：节点大小跨越 254 字节阈值</div>
                <p>当一个 entry 的大小从 &lt;254 变成 ≥254，或从 ≥254 变成 &lt;254</p>
              </div>
              <div className="condition-box">
                <div className="condition-title">条件2：有后续节点</div>
                <p>该节点后面还有其他节点（否则不需要更新 prevlen）</p>
              </div>
            </div>
          </div>

          <div className="update-section">
            <h3>更新过程示例</h3>
            <div className="update-steps">
              <div className="process-step">
                <div className="step-num">1</div>
                <div className="step-content">
                  <strong>初始状态</strong>
                  <div className="state-visual">
                    <div className="entry-box small">A: 250B</div>
                    <div className="entry-arrow">→</div>
                    <div className="entry-box small">B: 100B<br/><span className="prevlen">prevlen: 1B</span></div>
                    <div className="entry-arrow">→</div>
                    <div className="entry-box small">C: 50B<br/><span className="prevlen">prevlen: 1B</span></div>
                  </div>
                </div>
              </div>

              <div className="process-step highlight">
                <div className="step-num">2</div>
                <div className="step-content">
                  <strong>插入大节点（300B）到 A 前面</strong>
                  <div className="state-visual">
                    <div className="entry-box large">New: 300B</div>
                    <div className="entry-arrow">→</div>
                    <div className="entry-box small">A: 250B</div>
                    <div className="entry-arrow">→</div>
                    <div className="entry-box warning">B: 100B<br/><span className="prevlen">⚠️ 需要扩展!</span></div>
                    <div className="entry-arrow">→</div>
                    <div className="entry-box small">C: 50B</div>
                  </div>
                </div>
              </div>

              <div className="process-step">
                <div className="step-num">3</div>
                <div className="step-content">
                  <strong>第一次连锁 - B 扩展</strong>
                  <div className="state-visual">
                    <div className="entry-box large">New: 300B</div>
                    <div className="entry-arrow">→</div>
                    <div className="entry-box small">A: 250B</div>
                    <div className="entry-arrow">→</div>
                    <div className="entry-box medium">B: 104B<br/><span className="prevlen">prevlen: 5B ✓</span></div>
                    <div className="entry-arrow">→</div>
                    <div className="entry-box warning">C: 50B<br/><span className="prevlen">⚠️ 也需要扩展!</span></div>
                  </div>
                  <p className="cascade-note">
                    B 从 100B 扩展到 104B（因为要记录 New=300B 的大小），没有跨越 254 阈值，<br/>
                    但 C 需要更新 prevlen 来记录 B 的新大小
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="avoidance-section">
            <h3>如何避免连锁更新</h3>
            <div className="strategies-grid">
              <div className="strategy-card">
                <h4>1. 控制节点大小</h4>
                <p>尽量让 entry 保持在 250 字节以下</p>
              </div>
              <div className="strategy-card">
                <h4>2. 使用 QuickList</h4>
                <p>Redis 3.2+ 默认使用，结合了 ziplist 和 linkedlist 优点</p>
              </div>
              <div className="strategy-card">
                <h4>3. 避免中间插入</h4>
                <p>优先使用头插(lpush)或尾插(rpush)</p>
              </div>
              <div className="strategy-card">
                <h4>4. 配置阈值</h4>
                <p>合理配置 list-max-ziplist-size 参数</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 内存优化原理 */}
      <section className="concept-detail section-block">
        <h2 className="concept-heading">4. 内存优化原理</h2>

        <div className="memory-content">
          <div className="memory-comparison">
            <h3>与普通链表对比</h3>
            <MemoryComparisonChart />
          </div>

          <div className="concrete-example">
            <h3>具体计算示例</h3>
            <p>存储 5 个整数 [1, 2, 3, 4, 5]：</p>

            <div className="example-comparison">
              <div className="comparison-card linkedlist">
                <h4>普通链表</h4>
                <div className="mem-calc">
                  <p className="calc-title">每个节点需要：</p>
                  <ul>
                    <li>prev 指针: 8字节</li>
                    <li>next 指针: 8字节</li>
                    <li>数据指针: 8字节</li>
                    <li>数据本身: 8字节（long）</li>
                  </ul>
                  <p className="calc-total">= 32字节/节点</p>
                  <p className="calc-result">5个节点 = <strong>160字节</strong></p>
                </div>
              </div>

              <div className="comparison-card ziplist">
                <h4>ZipList</h4>
                <div className="mem-calc">
                  <p className="calc-title">结构组成：</p>
                  <ul>
                    <li>Header: 12字节</li>
                    <li>每个节点: prevlen(1) + encoding(1) + content(1) = 3字节</li>
                    <li>5个节点: 15字节</li>
                    <li>End: 1字节</li>
                  </ul>
                  <p className="calc-total">= 28字节总计</p>
                  <p className="calc-result">节省 <strong>82.5%</strong> 🎉</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ConceptsSection;
