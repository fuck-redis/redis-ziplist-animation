import { SAMPLE_INPUTS } from '@/config/problem';
import SolutionTabs from '@/components/layout/SolutionTabs';
import './InputRow.css';

interface InputRowProps {
  rawInput: string;
  validationMessage: string;
  onChangeInput: (value: string) => void;
  onApply: () => void;
  onRandom: () => void;
  onUseSample: (sample: string) => void;
}

function InputRow({
  rawInput,
  validationMessage,
  onChangeInput,
  onApply,
  onRandom,
  onUseSample,
}: InputRowProps) {
  return (
    <section className="input-row">
      <div className="row-left">
        <SolutionTabs />
      </div>

      <div className="row-center">
        <input
          className="data-input"
          value={rawInput}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder="输入链表，例如 1,2,3,4,5"
        />
        <button className="row-btn apply" type="button" onClick={onApply}>
          应用输入
        </button>
        <button className="row-btn random" type="button" onClick={onRandom}>
          随机数据
        </button>
      </div>

      <div className="row-right">
        <div className="samples">
          {SAMPLE_INPUTS.map((sample) => (
            <button key={sample} className="sample-chip" type="button" onClick={() => onUseSample(sample)}>
              {sample}
            </button>
          ))}
        </div>
        <span className="validation-text">{validationMessage}</span>
      </div>
    </section>
  );
}

export default InputRow;
