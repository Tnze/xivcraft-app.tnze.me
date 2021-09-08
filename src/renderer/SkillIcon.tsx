import React from 'react';
import { Badge } from 'antd';
import IconCover from '../../assets/skill_icons/icon_cover_40.png';

const requireContext = require.context(
  '../../assets/skill_icons',
  true,
  /^\.\/.*\.png$/
);

interface Skill {
  name: string;
  cond?: string;
  // success: boolean;
}

const colorMap = new Map([
  ['normal', '#FFFFFF'],
  ['good', 'red'],
  ['centered', 'yellow'],
  ['sturdy', 'cyan'],
  ['pliant', 'green'],
  ['malleable', 'geekblue'],
  ['primed', 'purple'],
]);

function SkillIcon({ name, cond }: Skill) {
  return (
    <Badge dot color={colorMap.get(cond as string)} offset={[-10, 7]}>
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
          src={requireContext(`./${name}.png`).default}
          alt={name}
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
    </Badge>
  );
}

SkillIcon.defaultProps = {
  // name: null,
  cond: 'normal',
};

export default SkillIcon;
