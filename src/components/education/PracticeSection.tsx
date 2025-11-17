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
