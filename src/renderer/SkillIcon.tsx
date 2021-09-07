import React from 'react';
import IconCover from '../../assets/skill_icons/icon_cover_40.png';

const requireContext = require.context(
  '../../assets/skill_icons',
  true,
  /^\.\/.*\.png$/
);

export default function SkillIcon({ skill }: { skill: string | null }) {
  return (
    <div
      style={{
        display: 'block',
        width: '48px',
        height: '48px',
        position: 'relative',
      }}
    >
      <img
        style={{
          top: '2px',
          left: '4px',
          width: '40px',
          height: '40px',
          position: 'absolute',
        }}
        src={skill ? requireContext(`./${skill}.png`).default : null}
        alt={skill !== null ? skill : undefined}
      />
      <div
        style={{
          top: 0,
          left: 0,
          width: '48px',
          height: '48px',
          position: 'absolute',
          background: `url(${IconCover}) center center / cover no-repeat`,
        }}
      />
    </div>
  );
}
