import { useMemo } from 'react';
import { getSnippet } from '@/algorithms/reverseLinkedList/codeSnippets';
import { DemoStep, Language, SolutionKey } from '@/types/demo';
import './CodePanel.css';

interface CodePanelProps {
  solution: SolutionKey;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  step: DemoStep;
}

const LANGS: Array<{ key: Language; label: string }> = [
  { key: 'java', label: 'Java' },
  { key: 'python', label: 'Python' },
  { key: 'go', label: 'Go' },
  { key: 'javascript', label: 'JavaScript' },
];

const KEYWORDS: Record<Language, string[]> = {
  java: ['class', 'public', 'return', 'if', 'null', 'while'],
  python: ['class', 'def', 'if', 'return', 'None', 'while', 'is', 'not'],
  go: ['func', 'return', 'if', 'nil', 'for', 'var'],
  javascript: ['var', 'let', 'const', 'return', 'if', 'null', 'while', 'function'],
};

function escapeHtml(raw: string): string {
  return raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrapKeywords(line: string, language: Language): string {
  const words = KEYWORDS[language];
  if (!words.length) {
    return line;
  }
  const pattern = new RegExp('\\b(' + words.join('|') + ')\\b', 'g');
  return line.replace(pattern, '<span class="tok-keyword">$1</span>');
}

function highlightLine(rawLine: string, language: Language): string {
  const escaped = escapeHtml(rawLine);
  let line = escaped;
  line = line.replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, '<span class="tok-string">$1</span>');
  line = line.replace(/\b(-?\d+)\b/g, '<span class="tok-number">$1</span>');
  line = wrapKeywords(line, language);
  return line;
}

function CodePanel({ solution, language, onLanguageChange, step }: CodePanelProps) {
  const code = getSnippet(solution, language);
  const currentLine = step.lineMap[language];

  const rawLines = useMemo(() => code.split('\n'), [code]);

  const inlineVars = useMemo(() => {
    const entries = Object.entries(step.variables);
    if (entries.length === 0) {
      return '';
    }
    return entries.map(([k, v]) => k + '=' + v).join(' | ');
  }, [step.variables]);

  return (
    <section className="code-panel">
      <div className="code-header">
        <h3>代码联动调试</h3>
        <div className="lang-switch">
          {LANGS.map((lang) => (
            <button
              key={lang.key}
              className={lang.key === language ? 'lang-btn active' : 'lang-btn'}
              type="button"
              onClick={() => onLanguageChange(lang.key)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="code-body">
        {rawLines.map((line, idx) => {
          const lineNo = idx + 1;
          const active = lineNo === currentLine;
          return (
            <div key={String(lineNo)} className={active ? 'code-line active' : 'code-line'}>
              <span className="line-no">{lineNo}</span>
              <span className="line-code" dangerouslySetInnerHTML={{ __html: highlightLine(line, language) || '&nbsp;' }} />
              {active && inlineVars && <span className="inline-vars">{'// ' + inlineVars}</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CodePanel;
