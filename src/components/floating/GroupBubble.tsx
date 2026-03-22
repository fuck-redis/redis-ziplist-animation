import qrImage from '@/assets/leetcode-group-qr.png';
import './GroupBubble.css';

function GroupBubble() {
  return (
    <div className="group-bubble">
      <div className="bubble-btn">交流群</div>
      <div className="bubble-pop">
        <img src={qrImage} alt="算法交流群二维码" />
        <p>微信扫码发送“leetcode”加入算法交流群</p>
      </div>
    </div>
  );
}

export default GroupBubble;
