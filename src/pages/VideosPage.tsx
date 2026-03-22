import { VideoPlayer } from '../components/video/VideoPlayer';

export const VideosPage: React.FC = () => {
  return (
    <div style={{
      padding: '40px',
      maxWidth: '1600px',
      margin: '0 auto',
    }}>
      <div style={{
        marginBottom: 32,
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          color: 'var(--text-primary, #f8fafc)',
          margin: '0 0 12px 0',
        }}>
          ZipList 教学视频库
        </h1>
        <p style={{
          fontSize: 16,
          color: 'var(--text-muted, #94a3b8)',
          margin: 0,
        }}>
          通过动画视频深入理解 ZipList 的核心概念与原理
        </p>
      </div>

      <VideoPlayer />
    </div>
  );
};

export default VideosPage;
