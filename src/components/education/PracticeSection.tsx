import { useState } from 'react';
import './PracticeSection.css';

interface Question {
  id: number;
  type: 'single' | 'multiple' | 'judge' | 'fill';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const questions: Question[] = [
  {
    id: 1,
    type: 'single',
    difficulty: 'easy',
    question: 'ZipList的核心设计目标是什么？',
    options: [
      'A. 提高查询速度',
      'B. 节省内存空间',
      'C. 支持并发操作',
      'D. 简化代码逻辑',
    ],
    correctAnswer: 'B',
    explanation: 'ZipList的核心设计目标是节省内存空间。通过紧凑的连续内存布局和变长编码，相比普通链表可以节省40-60%的内存。',
  },
  {
    id: 2,
    type: 'multiple',
    difficulty: 'easy',
    question: 'ZipList的Header包含哪些字段？（多选）',
    options: [
      'A. zlbytes（总字节数）',
      'B. zltail（尾偏移）',
      'C. zllen（节点数量）',
      'D. zlhead（头指针）',
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'ZipList的Header包含3个字段：zlbytes（总字节数）、zltail（尾偏移）、zllen（节点数量）。没有zlhead字段。',
  },
  {
    id: 3,
    type: 'judge',
    difficulty: 'easy',
    question: 'prevlen字段始终占用1个字节',
    correctAnswer: '错误',
    explanation: 'prevlen字段的大小是可变的：当前一个entry小于254字节时占1字节，否则占5字节。',
  },
  {
    id: 4,
    type: 'single',
    difficulty: 'medium',
    question: '当插入一个值为42的整数时，ZipList会选择哪种编码？',
    options: [
      'A. INT8',
      'B. INT16',
      'C. INT32',
      'D. STR_6BIT',
    ],
    correctAnswer: 'A',
    explanation: '42在-128~127范围内，会选择INT8编码，只需1个字节存储。',
  },
  {
    id: 5,
    type: 'single',
    difficulty: 'medium',
    question: '什么是连锁更新（Cascade Update）？',
    options: [
      'A. 一次性更新所有节点的值',
      'B. prevlen扩展导致的连锁效应',
      'C. 自动压缩内存的过程',
      'D. 节点排序的过程',
    ],
    correctAnswer: 'B',
    explanation: '连锁更新是指当一个节点变大（≥254字节）时，导致后续节点的prevlen从1字节扩展到5字节，如果扩展后的节点也≥254字节，会继续触发下一个节点扩展，形成连锁反应。',
  },
  {
    id: 6,
    type: 'judge',
    difficulty: 'medium',
    question: 'ZipList适合存储大量数据（>10000个元素）',
    correctAnswer: '错误',
    explanation: 'ZipList适合存储少量数据（通常<512个元素）。大量数据会导致插入删除操作的O(n)复杂度影响性能，且可能触发连锁更新。',
  },
  {
    id: 7,
    type: 'single',
    difficulty: 'hard',
    question: '存储5个整数[1,2,3,4,5]，ZipList相比普通链表节省多少内存？',
    options: [
      'A. 约40%',
      'B. 约60%',
      'C. 约80%',
      'D. 约90%',
    ],
    correctAnswer: 'C',
    explanation: '普通链表每个节点需要32字节（prev+next+data指针+数据），5个节点=160字节。ZipList只需28字节（12字节Header+15字节Entries+1字节End），节省82.5%。',
  },
  {
    id: 8,
    type: 'multiple',
    difficulty: 'hard',
    question: '以下哪些情况可能触发连锁更新？（多选）',
    options: [
      'A. 在头部插入一个大节点（>250字节）',
      'B. 在尾部插入一个小节点（<100字节）',
      'C. 删除一个大节点',
      'D. 修改节点值导致大小跨越254字节阈值',
    ],
    correctAnswer: ['A', 'D'],
    explanation: '连锁更新的触发条件是节点大小跨越254字节阈值。头部插入大节点和修改值导致跨越阈值都可能触发。尾部插入小节点和删除大节点通常不会触发。',
  },
  // 配置参数相关
  {
    id: 9,
    type: 'single',
    difficulty: 'easy',
    question: 'Redis配置项 list-max-ziplist-size 默认为-2，表示什么含义？',
    options: [
      'A. 最大2个元素',
      'B. 单个ziplist最大8KB',
      'C. 压缩率2倍',
      'D. 2个ziplist组合',
    ],
    correctAnswer: 'B',
    explanation: '-2表示单个ziplist最大8KB，这是list-max-ziplist-size的推荐默认值。当节点大小超过8KB时，Redis会将ZipList转换为QuickList。',
  },
  {
    id: 10,
    type: 'single',
    difficulty: 'easy',
    question: 'hash-max-ziplist-entries 的默认配置值是多少？',
    options: [
      'A. 128',
      'B. 256',
      'C. 512',
      'D. 1024',
    ],
    correctAnswer: 'C',
    explanation: 'hash-max-ziplist-entries 的默认值是512，表示当Hash类型字段数超过512时，会从ZipList转换为Hashtable编码。',
  },
  // 转换机制相关
  {
    id: 11,
    type: 'single',
    difficulty: 'medium',
    question: '什么时候会将ZipList转换为QuickList？',
    options: [
      'A. 元素数量超过阈值',
      'B. 单个元素太大',
      'C. 既有A又有B',
      'D. 永远不会自动转换',
    ],
    correctAnswer: 'C',
    explanation: '当元素数量超过list-max-ziplist-entries配置或单个元素大小超过list-max-ziplist-size配置时，都会触发从ZipList到QuickList的转换。',
  },
  {
    id: 12,
    type: 'judge',
    difficulty: 'medium',
    question: 'Hash类型的编码可以从ziplist转换为hashtable，但不会从hashtable转回ziplist',
    correctAnswer: '正确',
    explanation: 'Redis的数据结构转换是单向的。一旦从简答的结构（ziplist）转换为更复杂的结构（hashtable），就不会自动转回。这是Redis为了避免频繁转换而设计的。',
  },
  // 更新操作相关
  {
    id: 13,
    type: 'judge',
    difficulty: 'medium',
    question: '更新节点值一定不会触发连锁更新',
    correctAnswer: '错误',
    explanation: '如果更新后的值导致节点大小跨越254字节阈值，仍会触发连锁更新。例如将一个小的值更新为很大的字符串，可能使节点从<254字节变成>=254字节。',
  },
  {
    id: 14,
    type: 'single',
    difficulty: 'medium',
    question: '更新ZipList中节点值时，如果新值导致编码类型变化，会发生什么？',
    options: [
      'A. 什么都不变',
      'B. 节点大小变化，可能触发连锁更新',
      'C. 整个ZipList重新创建',
      'D. 报错',
    ],
    correctAnswer: 'B',
    explanation: '当编码类型变化时，节点大小可能变化。如果新节点更大，可能导致后续节点的prevlen需要扩展，从而触发连锁更新。',
  },
  // 查找操作相关
  {
    id: 15,
    type: 'single',
    difficulty: 'easy',
    question: 'ZipList按索引查找的时间复杂度是？',
    options: ['A. O(1)', 'B. O(n)', 'C. O(log n)', 'D. O(n²)'],
    correctAnswer: 'B',
    explanation: 'ZipList是连续内存布局，没有指针，按索引查找需要从头遍历，平均复杂度O(n)。这与普通数组不同，因为需要通过累加每个节点的大小来定位。',
  },
  {
    id: 16,
    type: 'single',
    difficulty: 'medium',
    question: 'ZipList反向遍历依靠哪个字段？',
    options: ['A. next指针', 'B. prevlen字段', 'C. zlbytes', 'D. zllen'],
    correctAnswer: 'B',
    explanation: '每个entry的prevlen字段记录前一个节点的长度，依靠它可以从后向前遍历。这使得ZipList支持双向遍历，而不需要像普通链表那样存储next指针。',
  },
  // 遍历相关
  {
    id: 17,
    type: 'single',
    difficulty: 'medium',
    question: 'ZipList支持反向遍历，这个说法正确吗？',
    options: ['A. 正确', 'B. 错误', 'C. 只支持正向遍历', 'D. 需要额外配置'],
    correctAnswer: 'A',
    explanation: 'ZipList通过每个节点的prevlen字段支持反向遍历。从最后一个节点开始，通过prevlen可以找到前一个节点的位置，逐个回溯到头部。',
  },
  // 对比相关
  {
    id: 18,
    type: 'multiple',
    difficulty: 'hard',
    question: '相比普通链表，ZipList的优势包括？（多选）',
    options: [
      'A. 节省内存（无指针开销）',
      'B. CPU缓存友好（连续内存）',
      'C. 头尾操作O(1)',
      'D. 无连锁更新问题',
    ],
    correctAnswer: ['A', 'B'],
    explanation: 'ZipList优势在于内存节省（无8字节指针开销）和CPU缓存友好（连续内存提高缓存命中率）。但ZipList仍有连锁更新问题，且头尾操作在尾部是O(1)但头部插入仍是O(n)。',
  },
  // 命令相关
  {
    id: 19,
    type: 'single',
    difficulty: 'easy',
    question: '哪个命令会使用ZipList存储？',
    options: ['A. SET key value', 'B. HSET key f v', 'C. SADD key m', 'D. GET key'],
    correctAnswer: 'B',
    explanation: 'HSET用于Hash类型，当字段数和值大小在阈值内时使用ziplist存储。SET和GET用于String类型，SADD用于Set类型。',
  },
  {
    id: 20,
    type: 'single',
    difficulty: 'medium',
    question: '使用OBJECT ENCODING命令查看一个有很多元素的列表，返回什么编码？',
    options: ['A. ziplist', 'B. quicklist', 'C. linkedlist', 'D. array'],
    correctAnswer: 'B',
    explanation: '当列表元素数量超过list-max-ziplist-entries阈值时，Redis会将ZipList转换为QuickList。QuickList是多个ZipList组成的有序链表。',
  },
  // QuickList 相关
  {
    id: 21,
    type: 'single',
    difficulty: 'medium',
    question: 'QuickList数据结构是由什么组成的？',
    options: [
      'A. 多个ZipList组成的双向链表',
      'B. 多个普通链表组成的数组',
      'C. ZipList和数组的混合',
      'D. 特殊的B+树结构',
    ],
    correctAnswer: 'A',
    explanation: 'QuickList是Redis 3.2引入的数据结构，本质上是一个双向链表，每个节点存储一个ZipList。这样结合了ZipList的内存效率和链表的插入删除效率。',
  },
  {
    id: 22,
    type: 'judge',
    difficulty: 'medium',
    question: 'QuickList可以完全避免连锁更新问题',
    correctAnswer: '错误',
    explanation: 'QuickList中的每个ZipList节点仍然可能触发连锁更新。但由于每个ZipList都比较小（默认8KB），连锁更新的影响范围有限，不会像单个大ZipList那样造成严重性能问题。',
  },
  // ziplbytes 和 zltail
  {
    id: 23,
    type: 'single',
    difficulty: 'hard',
    question: 'zltail字段的作用是什么？',
    options: [
      'A. 记录ZipList总长度',
      'B. 记录最后一个节点的偏移量，用于O(1)时间定位尾部',
      'C. 记录节点总数',
      'D. 记录内存地址',
    ],
    correctAnswer: 'B',
    explanation: 'zltail记录最后一个entry的偏移量，使得从尾部进行操作（如RPUSH）可以O(1)时间定位到尾部，无需遍历整个列表。这是ZipList的重要优化。',
  },
  {
    id: 24,
    type: 'judge',
    difficulty: 'hard',
    question: 'zllen字段最大值是65535，当超过这个值时需要遍历计数',
    correctAnswer: '正确',
    explanation: 'zllen使用16位无符号整数，最大值为65535。当实际节点数超过65535时，zllen被设置为65535，表示实际数量需要遍历整个列表才能确定。这是一个空间-时间权衡的设计。',
  },
];

function PracticeSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = userAnswers[currentQuestion.id] !== undefined;

  const handleSingleChoice = (option: string) => {
    if (hasAnswered) return;
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: option,
    });
    setShowResult(true);
  };

  const handleMultipleChoice = (option: string) => {
    if (hasAnswered) return;

    const newSelected = selectedAnswers.includes(option)
      ? selectedAnswers.filter(a => a !== option)
      : [...selectedAnswers, option];
    
    setSelectedAnswers(newSelected);
  };

  const handleSubmitMultiple = () => {
    if (selectedAnswers.length === 0) {
      alert('请至少选择一个答案');
      return;
    }

    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: selectedAnswers,
    });
    setShowResult(true);
  };

  const handleJudge = (answer: string) => {
    if (hasAnswered) return;

    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer,
    });
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
      setSelectedAnswers([]);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowResult(false);
      setSelectedAnswers([]);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResult(false);
    setSelectedAnswers([]);
  };

  const isCorrect = () => {
    const userAnswer = userAnswers[currentQuestion.id];
    const correctAnswer = currentQuestion.correctAnswer;

    if (Array.isArray(correctAnswer)) {
      if (!Array.isArray(userAnswer)) return false;
      return correctAnswer.length === userAnswer.length &&
        correctAnswer.every(a => userAnswer.includes(a));
    }

    return userAnswer === correctAnswer;
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      if (!userAnswer) return;

      if (Array.isArray(q.correctAnswer)) {
        if (Array.isArray(userAnswer) &&
            q.correctAnswer.length === userAnswer.length &&
            q.correctAnswer.every(a => userAnswer.includes(a))) {
          correct++;
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          correct++;
        }
      }
    });

    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const allAnswered = questions.every(q => userAnswers[q.id] !== undefined);
  const score = allAnswered ? getScore() : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#666';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '';
    }
  };

  return (
    <div className="practice-section">
      <div className="practice-header">
        <h1 className="practice-title">✍️ 练习测验</h1>
        <p className="practice-subtitle">检验你对ZipList的理解程度</p>
      </div>

      {allAnswered && score && (
        <div className="score-card">
          <div className="score-icon">
            {score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="score-title">测验完成！</h2>
          <div className="score-result">
            <div className="score-number">{score.percentage}分</div>
            <div className="score-detail">
              答对 {score.correct} / {score.total} 题
            </div>
          </div>
          <div className="score-evaluation">
            {score.percentage >= 80 && '太棒了！你已经完全掌握了ZipList！🌟'}
            {score.percentage >= 60 && score.percentage < 80 && '不错！再复习一下就能完全掌握了！📚'}
            {score.percentage < 60 && '继续努力！建议重新学习基础知识模块！💪'}
          </div>
          <button className="reset-btn" onClick={handleReset}>
            重新开始测验
          </button>
        </div>
      )}

      <div className="practice-content">
        <div className="progress-bar">
          <div className="progress-info">
            <span>进度：{currentQuestionIndex + 1} / {questions.length}</span>
            <span>
              已答：{Object.keys(userAnswers).length} / {questions.length}
            </span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-card">
          <div className="question-header">
            <div className="question-number">第 {currentQuestionIndex + 1} 题</div>
            <div 
              className="question-difficulty"
              style={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty) }}
            >
              {getDifficultyLabel(currentQuestion.difficulty)}
            </div>
          </div>

          <h3 className="question-text">{currentQuestion.question}</h3>

          {currentQuestion.type === 'single' && (
            <div className="options">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  className={`option-btn ${
                    hasAnswered
                      ? option.startsWith(currentQuestion.correctAnswer as string)
                        ? 'correct'
                        : userAnswers[currentQuestion.id] === option.charAt(0)
                        ? 'wrong'
                        : ''
                      : ''
                  }`}
                  onClick={() => handleSingleChoice(option.charAt(0))}
                  disabled={hasAnswered}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multiple' && (
            <>
              <div className="options">
                {currentQuestion.options?.map((option) => {
                  const optionLetter = option.charAt(0);
                  const isSelected = selectedAnswers.includes(optionLetter);
                  const isCorrect = (currentQuestion.correctAnswer as string[]).includes(optionLetter);
                  
                  return (
                    <button
                      key={option}
                      className={`option-btn multiple ${
                        isSelected ? 'selected' : ''
                      } ${
                        hasAnswered
                          ? isCorrect
                            ? 'correct'
                            : isSelected
                            ? 'wrong'
                            : ''
                          : ''
                      }`}
                      onClick={() => handleMultipleChoice(optionLetter)}
                      disabled={hasAnswered}
                    >
                      {option}
                      {isSelected && !hasAnswered && <span className="check-mark">✓</span>}
                    </button>
                  );
                })}
              </div>
              {!hasAnswered && (
                <button 
                  className="submit-btn"
                  onClick={handleSubmitMultiple}
                  disabled={selectedAnswers.length === 0}
                >
                  提交答案
                </button>
              )}
            </>
          )}

          {currentQuestion.type === 'judge' && (
            <div className="judge-options">
              <button
                className={`judge-btn ${
                  hasAnswered
                    ? currentQuestion.correctAnswer === '正确'
                      ? 'correct'
                      : userAnswers[currentQuestion.id] === '正确'
                      ? 'wrong'
                      : ''
                    : ''
                }`}
                onClick={() => handleJudge('正确')}
                disabled={hasAnswered}
              >
                ✓ 正确
              </button>
              <button
                className={`judge-btn ${
                  hasAnswered
                    ? currentQuestion.correctAnswer === '错误'
                      ? 'correct'
                      : userAnswers[currentQuestion.id] === '错误'
                      ? 'wrong'
                      : ''
                    : ''
                }`}
                onClick={() => handleJudge('错误')}
                disabled={hasAnswered}
              >
                ✗ 错误
              </button>
            </div>
          )}

          {showResult && (
            <div className={`result-box ${isCorrect() ? 'correct' : 'wrong'}`}>
              <div className="result-icon">
                {isCorrect() ? '✓' : '✗'}
              </div>
              <div className="result-content">
                <div className="result-title">
                  {isCorrect() ? '回答正确！' : '回答错误'}
                </div>
                <div className="result-explanation">
                  <strong>解析：</strong>
                  {currentQuestion.explanation}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-btn"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            ← 上一题
          </button>
          <button
            className="nav-btn primary"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            下一题 →
          </button>
        </div>
      </div>

      <div className="practice-tips">
        <h3>💡 学习建议</h3>
        <ul>
          <li>建议先完成"📖 基础知识"和"🔬 核心概念"的学习</li>
          <li>每道题都有详细的解析，答错了一定要看解析</li>
          <li>可以多次练习，加深理解</li>
          <li>遇到不懂的题目，回到对应模块复习</li>
        </ul>
      </div>
    </div>
  );
}

export default PracticeSection;
