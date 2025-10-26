import React from 'react';
import { CoffeeBean } from '../../types';

interface CardContentProps {
  coffeeBean: CoffeeBean;
  showName: boolean;
  showFlavor: boolean;
  showIntensity: boolean;
  showBlend: boolean;
  fontClass: string;
  displayName: string;
  scaleFactor: number;
}

const CardContent: React.FC<CardContentProps> = ({
  coffeeBean,
  showName,
  showFlavor,
  showIntensity,
  showBlend,
  fontClass,
  displayName,
  scaleFactor,
}) => {
  const getScaledStyle = (baseSize: number) => ({
    fontSize: `${baseSize * scaleFactor}px`,
  });

  const getScaledMargin = (baseMargin: number) => `${baseMargin * scaleFactor}px`;
  const getScaledWidth = (baseWidth: number) => `${baseWidth * scaleFactor}px`;
  const getScaledHeight = (baseHeight: number) => `${baseHeight * scaleFactor}px`;

  return (
    <>
      {showName && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: '72px',
            textAlign: 'left',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
            maxWidth: `80%`,
          }}
        >
          <h3
            className={fontClass}
            style={{
              color: 'white',
              ...getScaledStyle(116),
              fontWeight: 'bold',
              lineHeight: '1.2',
            }}
          >
            {displayName}
          </h3>
          {showBlend && coffeeBean.originType === 'blending' && (
            <div style={{ marginTop: getScaledMargin(24) }}>
              <ul style={{ listStyle: 'none', padding: 0, color: 'white', ...getScaledStyle(36) }}>
                {coffeeBean.blend.components.map((c, i) => (
                  <li key={i}>{c.country}: {c.ratio}%</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {showFlavor && coffeeBean.flavorNotes.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            left: '72px',
            textAlign: 'left',
          }}
        >
          <p style={{ color: 'white',
            ...getScaledStyle(38) }}>
            {coffeeBean.flavorNotes.slice(0, 5).map((note, idx) => (
              <span key={idx} style={{ display: 'block', whiteSpace: 'nowrap' }}># {note}</span>
            ))}
          </p>
        </div>
      )}
      {showIntensity && (
        <div
          style={{
            position: 'absolute',
            right: '72px',
            bottom: '72px',
          }}
        >
          <div style={{ marginTop: getScaledMargin(24) }}>
            <span style={{ color: 'white', ...getScaledStyle(36), fontWeight: 500, display: 'block', marginBottom: getScaledMargin(12) }}>Acidity</span>
            <div style={{ width: getScaledWidth(384), height: getScaledHeight(6), background: 'rgba(255,255,255,0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'white', borderRadius: '9999px', width: `${(coffeeBean.intensity.acidity / 10) * 100}%` }} />
            </div>
          </div>
          <div style={{ marginTop: getScaledMargin(24) }}>
            <span style={{ color: 'white', ...getScaledStyle(36), fontWeight: 500, display: 'block', marginBottom: getScaledMargin(12) }}>Sweetness</span>
            <div style={{ width: getScaledWidth(384), height: getScaledHeight(6), background: 'rgba(255,255,255,0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'white', borderRadius: '9999px', width: `${(coffeeBean.intensity.sweetness / 10) * 100}%` }} />
            </div>
          </div>
          <div style={{ marginTop: getScaledMargin(24) }}>
            <span style={{ color: 'white', ...getScaledStyle(36), fontWeight: 500, display: 'block', marginBottom: getScaledMargin(12) }}>Body</span>
            <div style={{ width: getScaledWidth(384), height: getScaledHeight(6), background: 'rgba(255,255,255,0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'white', borderRadius: '9999px', width: `${(coffeeBean.intensity.body / 10) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardContent;
