import './ConceptsSection.css';

function ConceptsSection() {
  return (
    <div className="concepts-section">
      <h1 className="concepts-title">🔬 核心概念深入解析</h1>

      {/* Header字段详解 */}
      <section className="concept-detail">
        <h2 className="concept-heading">1. Header结构详解</h2>
        <div className="field-explanation">
          <div className="field-card">
            <div className="field-header">
              <span className="field-name">zlbytes</span>
              <span className="field-type">uint32_t (4字节)</span>
            </div>
            <div className="field-body">
              <p className="field-desc">
                <strong>作用</strong>：记录整个ZipList占用的总字节数
              </p>
              <p className="field-usage">
                <strong>用途</strong>：
              </p>
              <ul>
                <li>快速获取整个结构的大小，无需遍历</li>
                <li>内存管理时快速判断是否需要扩容</li>
                <li>Redis MEMORY命令获取对象大小</li>
              </ul>
              <div className="code-example">
                <pre><code>{`// 示例
初始状态: zlbytes = 13 (空列表)
插入42后: zlbytes = 16 (12+3+1)
  12字节Header + 3字节Entry + 1字节End`}</code></pre>
              </div>
            </div>
          </div>

          <div className="field-card">
            <div className="field-header">
              <span className="field-name">zltail</span>
              <span className="field-type">uint32_t (4字节)</span>
            </div>
            <div className="field-body">
              <p className="field-desc">
                <strong>作用</strong>：记录最后一个entry的偏移量
              </p>
              <p className="field-usage">
                <strong>用途</strong>：
              </p>
              <ul>
                <li>O(1)时间定位到最后一个节点</li>
                <li>支持从尾部快速插入（rpush）</li>
                <li>支持从尾部快速删除（rpop）</li>
                <li>反向遍历的起点</li>
              </ul>
              <div className="highlight-tip">
                💡 这是ZipList相比普通数组的优势之一
              </div>
            </div>
          </div>

          <div className="field-card">
            <div className="field-header">
              <span className="field-name">zllen</span>
              <span className="field-type">uint16_t (2字节)</span>
            </div>
            <div className="field-body">
              <p className="field-desc">
                <strong>作用</strong>：记录entry的数量
              </p>
              <p className="field-usage">
                <strong>特殊规则</strong>：
              </p>
              <ul>
                <li>当节点数 &lt; 65535时，存储真实数量</li>
                <li>当节点数 ≥ 65535时，值为65535，需要遍历计数</li>
              </ul>
              <div className="warning-tip">
                ⚠️ 这也是为什么Redis配置中list-max-ziplist-entries默认是512
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry结构详解 */}
      <section className="concept-detail">
        <h2 className="concept-heading">2. Entry结构详解</h2>
        
        <div className="entry-structure">
          <div className="structure-visual">
            <div className="struct-field prevlen">
              <div className="field-label">prevlen</div>
              <div className="field-size">1或5字节</div>
            </div>
            <div className="struct-arrow">+</div>
            <div className="struct-field encoding">
              <div className="field-label">encoding</div>
              <div className="field-size">1-5字节</div>
            </div>
            <div className="struct-arrow">+</div>
            <div className="struct-field content">
              <div className="field-label">content</div>
              <div className="field-size">N字节</div>
            </div>
          </div>

          <div className="field-details">
            <div className="detail-card">
              <h3>prevlen字段</h3>
              <p><strong>作用</strong>：记录前一个entry的长度，用于反向遍历</p>
              <div className="prevlen-rules">
                <div className="rule-item">
                  <div className="rule-condition">前一个entry &lt; 254字节</div>
                  <div className="rule-result">prevlen用1字节存储</div>
                  <div className="rule-example">
                    <code>prevlen = 42 → [0x2A]</code>
                  </div>
                </div>
                <div className="rule-item">
                  <div className="rule-condition">前一个entry ≥ 254字节</div>
                  <div className="rule-result">prevlen用5字节存储</div>
                  <div className="rule-example">
                    <code>prevlen = 300 → [0xFE][0x2C][0x01][0x00][0x00]</code>
                  </div>
                </div>
              </div>
              <div className="critical-note">
                🔥 这就是连锁更新的根源！当一个节点从&lt;254变成≥254时，
                后续所有节点的prevlen都可能需要扩展
              </div>
            </div>

            <div className="detail-card">
              <h3>encoding字段</h3>
              <p><strong>作用</strong>：指示如何解析content字段</p>
              <div className="encoding-types">
                <div className="encoding-category">
                  <h4>整数编码（5种）</h4>
                  <table className="encoding-table">
                    <thead>
                      <tr>
                        <th>编码</th>
                        <th>字节标识</th>
                        <th>取值范围</th>
                        <th>content大小</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>INT8</td>
                        <td>11111110</td>
                        <td>-128 ~ 127</td>
                        <td>1字节</td>
                      </tr>
                      <tr>
                        <td>INT16</td>
                        <td>11000000</td>
                        <td>-32768 ~ 32767</td>
                        <td>2字节</td>
                      </tr>
                      <tr>
                        <td>INT24</td>
                        <td>11110000</td>
                        <td>-8388608 ~ 8388607</td>
                        <td>3字节</td>
                      </tr>
                      <tr>
                        <td>INT32</td>
                        <td>11010000</td>
                        <td>-2^31 ~ 2^31-1</td>
                        <td>4字节</td>
                      </tr>
                      <tr>
                        <td>INT64</td>
                        <td>11100000</td>
                        <td>-2^63 ~ 2^63-1</td>
                        <td>8字节</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="encoding-category">
                  <h4>字符串编码（3种）</h4>
                  <table className="encoding-table">
                    <thead>
                      <tr>
                        <th>编码</th>
                        <th>字节标识</th>
                        <th>长度范围</th>
                        <th>encoding大小</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>STR_6BIT</td>
                        <td>00xxxxxx</td>
                        <td>0 ~ 63字节</td>
                        <td>1字节</td>
                      </tr>
                      <tr>
                        <td>STR_14BIT</td>
                        <td>01xxxxxx xxxxxxxx</td>
                        <td>0 ~ 16383字节</td>
                        <td>2字节</td>
                      </tr>
                      <tr>
                        <td>STR_32BIT</td>
                        <td>10xxxxxx + 4字节</td>
                        <td>0 ~ 2^32-1字节</td>
                        <td>5字节</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h3>content字段</h3>
              <p><strong>作用</strong>：存储实际数据</p>
              <div className="content-examples">
                <div className="example-item">
                  <div className="example-label">整数示例</div>
                  <div className="example-code">
                    <code>值: 42</code>
                    <code>encoding: INT8 (1字节)</code>
                    <code>content: [0x2A]</code>
                    <code>总大小: prevlen(1) + encoding(1) + content(1) = 3字节</code>
                  </div>
                </div>
                <div className="example-item">
                  <div className="example-label">字符串示例</div>
                  <div className="example-code">
                    <code>值: "Hello"</code>
                    <code>encoding: STR_6BIT (1字节，包含长度5)</code>
                    <code>content: [0x48][0x65][0x6C][0x6C][0x6F]</code>
                    <code>总大小: prevlen(1) + encoding(1) + content(5) = 7字节</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 连锁更新详解 */}
      <section className="concept-detail">
        <h2 className="concept-heading">3. 连锁更新机制深入</h2>
        
        <div className="cascade-explanation">
          <div className="cascade-intro">
            <p className="intro-text">
              连锁更新(Cascade Update)是ZipList最容易产生性能问题的地方。
              理解它的机制对于正确使用ZipList至关重要。
            </p>
          </div>

          <div className="cascade-steps">
            <h3>触发条件</h3>
            <div className="trigger-conditions">
              <div className="condition-box">
                <div className="condition-title">条件1：节点大小跨越254字节阈值</div>
                <p>当一个entry的大小从 &lt;254 变成 ≥254，或从 ≥254 变成 &lt;254</p>
              </div>
              <div className="condition-box">
                <div className="condition-title">条件2：有后续节点</div>
                <p>该节点后面还有其他节点（否则不需要更新prevlen）</p>
              </div>
            </div>

            <h3>更新过程</h3>
            <div className="update-process">
              <div className="process-step">
                <div className="step-num">步骤1</div>
                <div className="step-desc">
                  <strong>初始状态</strong>
                  <div className="state-visual">
                    <div className="entry-visual small">Entry A<br/>250B</div>
                    <div className="entry-visual small">Entry B<br/>100B<br/>prevlen: 1B</div>
                    <div className="entry-visual small">Entry C<br/>50B<br/>prevlen: 1B</div>
                  </div>
                </div>
              </div>

              <div className="process-step">
                <div className="step-num">步骤2</div>
                <div className="step-desc">
                  <strong>插入大节点</strong>
                  <div className="state-visual">
                    <div className="entry-visual small">Entry A<br/>250B</div>
                    <div className="entry-visual large">New<br/>300B</div>
                    <div className="entry-visual small">Entry B<br/>100B<br/>prevlen: ⚠️需要扩展</div>
                    <div className="entry-visual small">Entry C<br/>50B</div>
                  </div>
                </div>
              </div>

              <div className="process-step">
                <div className="step-num">步骤3</div>
                <div className="step-desc">
                  <strong>第一次连锁</strong>
                  <div className="state-visual">
                    <div className="entry-visual small">Entry A<br/>250B</div>
                    <div className="entry-visual large">New<br/>300B</div>
                    <div className="entry-visual medium">Entry B<br/>104B<br/>prevlen: 5B ✓</div>
                    <div className="entry-visual small">Entry C<br/>50B<br/>prevlen: ⚠️需要扩展</div>
                  </div>
                  <p className="cascade-note">
                    Entry B从100B扩展到104B，没有跨越254字节阈值，<br/>
                    但Entry C的prevlen需要记录104而不是100
                  </p>
                </div>
              </div>

              <div className="process-step">
                <div className="step-num">步骤4</div>
                <div className="step-desc">
                  <strong>最坏情况：继续连锁</strong>
                  <p>如果Entry B扩展后变成254B或更大，会触发Entry C的prevlen扩展...</p>
                  <div className="worst-case">
                    <p>理论最坏情况：O(n²)复杂度</p>
                    <p>实际情况：很少发生，因为大多数entry远小于254字节</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="avoidance-strategies">
            <h3>如何避免连锁更新</h3>
            <div className="strategies-grid">
              <div className="strategy-card">
                <h4>1. 控制节点大小</h4>
                <p>尽量让entry保持在250字节以下</p>
              </div>
              <div className="strategy-card">
                <h4>2. 使用QuickList</h4>
                <p>Redis 3.2+默认使用，结合了ziplist和linkedlist优点</p>
              </div>
              <div className="strategy-card">
                <h4>3. 避免中间插入</h4>
                <p>优先使用头插(lpush)或尾插(rpush)</p>
              </div>
              <div className="strategy-card">
                <h4>4. 配置阈值</h4>
                <p>合理配置list-max-ziplist-size参数</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 内存优化原理 */}
      <section className="concept-detail">
        <h2 className="concept-heading">4. 内存优化原理</h2>
        
        <div className="memory-comparison">
          <h3>与普通链表对比</h3>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>特性</th>
                  <th>普通链表</th>
                  <th>ZipList</th>
                  <th>节省</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>存储方式</td>
                  <td>分散内存 + 指针</td>
                  <td>连续内存</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>prev指针</td>
                  <td>8字节</td>
                  <td>1-5字节prevlen</td>
                  <td>3-7字节</td>
                </tr>
                <tr>
                  <td>next指针</td>
                  <td>8字节</td>
                  <td>无（连续存储）</td>
                  <td>8字节</td>
                </tr>
                <tr>
                  <td>数据存储</td>
                  <td>指针(8B) + 数据</td>
                  <td>直接存储</td>
                  <td>8字节</td>
                </tr>
                <tr>
                  <td>内存碎片</td>
                  <td>每个节点单独分配</td>
                  <td>一次性分配</td>
                  <td>减少碎片</td>
                </tr>
                <tr className="total-row">
                  <td><strong>总节省</strong></td>
                  <td colSpan={2}></td>
                  <td><strong>40-60%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="concrete-example">
            <h4>具体示例：存储5个整数 [1, 2, 3, 4, 5]</h4>
            <div className="example-comparison">
              <div className="linkedlist-example">
                <h5>普通链表</h5>
                <div className="mem-calc">
                  <p>每个节点：</p>
                  <ul>
                    <li>prev指针: 8字节</li>
                    <li>next指针: 8字节</li>
                    <li>数据指针: 8字节</li>
                    <li>数据本身: 8字节（long）</li>
                    <li><strong>= 32字节/节点</strong></li>
                  </ul>
                  <p className="total">5个节点 = 160字节</p>
                </div>
              </div>

              <div className="ziplist-example">
                <h5>ZipList</h5>
                <div className="mem-calc">
                  <p>Header: 12字节</p>
                  <p>每个节点：</p>
                  <ul>
                    <li>prevlen: 1字节</li>
                    <li>encoding: 1字节(INT8)</li>
                    <li>content: 1字节</li>
                    <li><strong>= 3字节/节点</strong></li>
                  </ul>
                  <p>5个节点: 15字节</p>
                  <p>End: 1字节</p>
                  <p className="total">总计 = 28字节</p>
                  <p className="savings">节省: <strong>82.5%</strong> 🎉</p>
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
