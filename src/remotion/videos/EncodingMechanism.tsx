import React, { useEffect, useState } from 'react';
import { theme } from '../styles';

const BYTE_SIZE = 44;

interface EncodingDemoProps {
  label: string;
  value: string | number;
  encoding: string;
  encodingByte: string;
  totalBytes: number;
  color: string;
  startFrame: number;
  animationFrame: number;
}

const EncodingDemo: React.FC<EncodingDemoProps> = ({
  label,
  value,
  encoding,
  encodingByte,
  totalBytes,
  color,
  startFrame,
  animationFrame,
}) => {
  const appear = Math.min(1, Math.max(0, (animationFrame - startFrame) / 20));

  const contentBytes = typeof value === 'number'
    ? value >= -128 && value <= 127 ? 1 : value >= -32768 && value <= 32767 ? 2 : 4
    : new TextEncoder().encode(String(value)).length;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '16px 24px',
      backgroundColor: theme.colors.backgroundLight,
      borderRadius: 12,
      border: `2px solid ${color}`,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 30}px)`,
    }}>
      {/* Label */}
      <div style={{
        minWidth: 100,
        color: color,
        fontSize: 18,
        fontWeight: 700,
        fontFamily: theme.fonts.mono,
      }}>
        {label}
      </div>

      {/* Byte Visualization */}
      <div style={{ display: 'flex', gap: 4 }}>
        {/* encoding byte */}
        <div style={{
          width: BYTE_SIZE,
          height: BYTE_SIZE,
          backgroundColor: theme.colors.secondary,
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: theme.colors.text, fontSize: 11, fontFamily: theme.fonts.mono }}>enc</span>
          <span style={{ color: theme.colors.background, fontSize: 12, fontWeight: 700, fontFamily: theme.fonts.mono }}>
            {encodingByte}
          </span>
        </div>

        {/* content bytes */}
        {Array.from({ length: contentBytes }).map((_, i) => (
          <div
            key={i}
            style={{
              width: BYTE_SIZE,
              height: BYTE_SIZE,
              backgroundColor: color,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.background,
              fontSize: 14,
              fontFamily: theme.fonts.mono,
              fontWeight: 700,
            }}
          >
            {typeof value === 'number' ? (i === 0 ? Math.abs(value) % 100 : '') : String(value)[i] || ''}
          </div>
        ))}
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ color: theme.colors.text, fontSize: 16, fontFamily: theme.fonts.mono }}>
          值: <span style={{ color: theme.colors.highlight }}>{value}</span>
        </div>
        <div style={{ color: theme.colors.textMuted, fontSize: 13, fontFamily: theme.fonts.mono }}>
          编码: {encoding} | 字节数: {totalBytes}
        </div>
      </div>
    </div>
  );
};

export const EncodingMechanism: React.FC<{ title?: string }> = ({ title = '编码机制详解' }) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 240);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const titleAppear = Math.min(1, Math.max(0, animationFrame / 20));

  return (
    <div style={{
      backgroundColor: theme.colors.background,
      fontFamily: theme.fonts.sans,
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: 48,
        fontWeight: 700,
        opacity: titleAppear,
        transform: `scale(${titleAppear})`,
      }}>
        {title}
      </div>

      {/* Integer Encodings Section */}
      <div style={{
        position: 'absolute',
        top: 130,
        left: 60,
        right: 60,
      }}>
        <div style={{
          color: theme.colors.accent,
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 20,
        }}>
          整数编码 (Integer Encoding)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <EncodingDemo
            label="INT8"
            value={42}
            encoding="INT8"
            encodingByte="0xFE"
            totalBytes={2}
            color="#10b981"
            startFrame={15}
            animationFrame={animationFrame}
          />
          <EncodingDemo
            label="INT16"
            value={1000}
            encoding="INT16"
            encodingByte="0xC0"
            totalBytes={3}
            color="#059669"
            startFrame={45}
            animationFrame={animationFrame}
          />
          <EncodingDemo
            label="INT24"
            value={50000}
            encoding="INT24"
            encodingByte="0xF0"
            totalBytes={4}
            color="#047857"
            startFrame={75}
            animationFrame={animationFrame}
          />
        </div>
      </div>

      {/* String Encodings Section */}
      <div style={{
        position: 'absolute',
        top: 430,
        left: 60,
        right: 60,
      }}>
        <div style={{
          color: theme.colors.secondary,
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 20,
        }}>
          字符串编码 (String Encoding)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <EncodingDemo
            label="STR_6BIT"
            value="hi"
            encoding="STR_6BIT"
            encodingByte="0x02"
            totalBytes={3}
            color="#8b5cf6"
            startFrame={105}
            animationFrame={animationFrame}
          />
          <EncodingDemo
            label="STR_14BIT"
            value="hello world"
            encoding="STR_14BIT"
            encodingByte="0x40"
            totalBytes={13}
            color="#7c3aed"
            startFrame={135}
            animationFrame={animationFrame}
          />
        </div>
      </div>

      {/* Encoding Decision Tree */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: theme.colors.textMuted,
        fontSize: 14,
        fontFamily: theme.fonts.mono,
        padding: '0 40px',
      }}>
        <div style={{ marginBottom: 8, color: theme.colors.highlight }}>
          编码选择策略
        </div>
        <div>
          数字 → 判断范围选择最小编码 | 字符串 → 判断长度选择最小编码
        </div>
      </div>
    </div>
  );
};