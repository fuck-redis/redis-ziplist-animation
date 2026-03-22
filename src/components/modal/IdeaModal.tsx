import { PROBLEM } from '@/config/problem';
import './IdeaModal.css';

interface IdeaModalProps {
  open: boolean;
  onClose: () => void;
}

function IdeaModal({ open, onClose }: IdeaModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="idea-mask" onClick={onClose}>
      <div className="idea-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="idea-header">
          <h3>算法思路</h3>
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </div>
        <ul className="idea-list">
          {PROBLEM.idea.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default IdeaModal;
