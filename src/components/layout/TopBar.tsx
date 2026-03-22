import { Github, Star, Lightbulb } from 'lucide-react';
import { PROBLEM } from '@/config/problem';
import { useGitHubStars } from '@/hooks/useGitHubStars';
import './TopBar.css';

interface TopBarProps {
  onOpenIdea: () => void;
}

function TopBar({ onOpenIdea }: TopBarProps) {
  const repoUrl = __REPO_URL__;
  const { stars } = useGitHubStars(repoUrl);

  return (
    <header className="top-bar">
      <div className="top-left">
        <a className="hot-link" href={PROBLEM.hot100Url} target="_blank" rel="noreferrer">
          返回 LeetCode Hot 100
        </a>
      </div>

      <div className="top-center">
        <a className="title-link" href={PROBLEM.leetcodeUrl} target="_blank" rel="noreferrer">
          {PROBLEM.title} · {PROBLEM.englishTitle}
        </a>
      </div>

      <div className="top-right">
        <button className="idea-btn" type="button" onClick={onOpenIdea}>
          <Lightbulb size={16} />
          算法思路
        </button>
        <a
          className="github-link"
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          title="单击去 GitHub 仓库 Star 支持一下"
        >
          <Github size={18} />
        </a>
        <span className="star-count">
          <Star size={14} />
          {stars}
        </span>
      </div>
    </header>
  );
}

export default TopBar;
