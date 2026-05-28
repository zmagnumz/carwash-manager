export const PRESETS = [
  {
    id: 'p01',
    name: '기본 세차 코스',
    num: '01',
    emoji: '💧',
    color: '#E6F1FB',
    timeLabel: '1시간 40분',
    steps: [
      { name: '실내 매트 세척 및 사전 작업', min: 10, chemId: null },
      { name: '프리워시', min: 10, chemId: null },
      { name: '스노우폼', min: 10, chemId: null },
      { name: '휠 타이어 세척', min: 10, chemId: null },
      { name: '고압수', min: 5, chemId: null },
      { name: '미트 세차', min: 10, chemId: null },
      { name: '고압수', min: 5, chemId: null },
      { name: '드라잉', min: 10, chemId: null },
      { name: '실내세차', min: 15, chemId: null },
      { name: 'LSP', min: 15, chemId: null },
    ],
  },
];
