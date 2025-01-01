export const data = [
  {
    id: 1000010,
    name: '消費体力減少',
    valueType: 'number',
    type: 'buff',
    isDecay: true,
  },
  {
    id: 1000011,
    name: '消費体力増加',
    valueType: 'number',
    type: 'debuff',
    isDecay: true,
  },

  {
    id: 1000020,
    name: '消費体力削減',
    valueType: 'number',
    type: 'buff',
    isDecay: false,
  },
  {
    id: 1000021,
    name: '消費体力追加',
    valueType: 'number',
    type: 'debuff',
    isDecay: false,
  },

  {
    id: 1000030,
    name: '元気増加無効',
    valueType: 'number',
    type: 'debuff',
    isDecay: true,
  },
  {
    id: 1000040,
    name: '低下状態無効',
    valueType: 'number',
    type: 'buff',
    isDecay: false,
  },
  {
    id: 1000050,
    name: 'スキルカード使用数追加',
    valueType: 'number',
    type: 'buff',
    isDecay: true,
    isDecay_amount: 'all',
  },
  {
    id: 1000060,
    name: '次に使用したスキルカードの消費体力を0にする',
    valueType: 'number',
    type: 'buff',
    isDecay: false,
  },
  {
    id: 1100010,
    name: '好調',
    valueType: 'number',
    type: 'buff',
    isDecay: true,
  },
  {
    id: 1100011,
    name: '不調',
    valueType: 'number',
    type: 'debuff',
    isDecay: true,
  },
  {
    id: 1100020,
    name: '集中',
    valueType: 'number',
    type: 'buff',
    isDecay: false,
  },
  {
    id: 1100030,
    name: '絶好調',
    valueType: 'number',
    type: 'buff',
    isDecay: true,
  },

  {
    id: 1200010,
    name: '好印象',
    valueType: 'number',
    type: 'buff',
    isDecay: true,
  },
  {
    id: 1200020,
    name: 'やる気',
    valueType: 'number',
    type: 'buff',
    isDecay: false,
  },
  {
    id: 1300010,
    name: '指針',
    valueType: 'toggle',
    type: 'buff',
    isDecay: false,
  },
  {
    id: 1300011,
    name: '指針固定',
    valueType: 'number',
    type: 'debuff',
    isDecay: true,
  },
  {
    id: 1300020,
    name: '全力値',
    valueType: 'number',
    type: 'buff',
    isDecay: false,
  },
  {
    id: 1300030,
    name: '熱意',
    valueType: 'number',
    type: 'buff',
    isDecay: false,
  },

  {
    id: 1001010,
    name: 'パラメータ上昇量増加',
    valueType: 'list',
    type: 'buff',
    isDecay: true,
  },
  {
    id: 1001020,
    name: '次に使用するスキルカードの効果を発動',
    valueType: 'list',
    type: 'buff',
    trigger: 'before_play_card',
    condition: 'dual_cast==0',
    effects: [
      {
        type: 'dual_cast',
        value: 1,
      },
    ],
    isDecay: true,
  },
  {
    id: 1001021,
    name: '次に使用するアクティブスキルカードの効果を発動',
    valueType: 'list',
    type: 'buff',
    trigger: 'before_play_card',
    condition: 'card_type==active&dual_cast==0',
    effects: [
      {
        type: 'dual_cast',
        value: 1,
      },
    ],
    isDecay: true,
  },

  {
    id: 1010010,
    name: 'アクティブスキルカード使用時固定元気+2',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: 'card_type==active',
    effects: [
      {
        type: 'fixed_genki',
        value: 2,
      },
    ],
    isDecay: false,
  },
  {
    id: 1010020,
    name: 'アクティブスキルカード使用時、パラメータ+4',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: 'card_type==active',
    effects: [
      {
        type: 'score',
        value: 4,
      },
    ],
    isDecay: false,
  },
  {
    id: 1010021,
    name: 'アクティブスキルカード使用時、パラメータ+5',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: 'card_type==active',
    effects: [
      {
        type: 'score',
        value: 5,
      },
    ],
    isDecay: false,
  },

  {
    id: 1110010,
    name: 'アクティブスキルカード使用時集中+1',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: 'card_type==active',
    effects: [
      {
        type: 'status',
        target: '集中',
        value: 1,
      },
    ],
    isDecay: false,
  },
  {
    id: 1110020,
    name: 'ターン終了時、集中が3以上の場合、集中+2',
    valueType: 'number',
    type: 'buff',
    trigger: 'end_turn',
    condition: '集中>=3',
    effects: [
      {
        type: 'status',
        target: '集中',
        value: 2,
      },
    ],
    isDecay: false,
  },
  {
    id: 1110030,
    name: 'ターン終了時スコア+4',
    valueType: 'list',
    type: 'buff',
    trigger: 'end_turn',
    condition: '',
    effects: [{ type: 'score', value: 4 }],
    isDecay: true,
  },
  {
    id: 1110040,
    name: '以降、ターン開始時、好調2ターン',
    valueType: 'number',
    type: 'buff',
    trigger: 'start_turn',
    condition: '',
    effects: [
      {
        type: 'status',
        target: '好調',
        value: 2,
      },
    ],
    isDecay: false,
  },

  {
    id: 1210010,
    name: 'メンタルスキルカード使用時好印象+1',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: 'card_type==mental',
    effects: [
      {
        type: 'status',
        target: '好印象',
        value: 1,
      },
    ],
    isDecay: false,
  },
  {
    id: 1210020,
    name: 'メンタルスキルカード使用時やる気+1',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: 'card_type==mental',
    effects: [
      {
        type: 'status',
        target: 'やる気',
        value: 1,
      },
    ],
    isDecay: false,
  },
  {
    id: 1210030,
    name: 'ターン終了時、好印象+1',
    valueType: 'number',
    type: 'buff',
    trigger: 'end_turn',
    condition: '',
    effects: [
      {
        type: 'status',
        target: '好印象',
        value: 1,
      },
    ],
    isDecay: false,
  },
  {
    id: 1210040,
    name: 'ターン終了時、好印象が3以上の場合、好印象+3',
    valueType: 'number',
    type: 'buff',
    trigger: 'end_turn',
    condition: '好印象>=3',
    effects: [
      {
        type: 'status',
        target: '好印象',
        value: 3,
      },
    ],
    isDecay: false,
  },
  {
    id: 1210050,
    name: 'スキルカード使用時、好印象の30%分パラメータ',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: '',
    effects: [
      {
        type: 'score',
        value: 0,
        options: [
          {
            type: 'increase_by_percentage',
            target: '好印象',
            value: 30,
          },
        ],
      },
    ],
    isDecay: false,
  },
  {
    id: 1210051,
    name: 'スキルカード使用時、好印象の50%分パラメータ',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: '',
    effects: [
      {
        type: 'score',
        value: 0,
        options: [
          {
            type: 'increase_by_percentage',
            target: '好印象',
            value: 50,
          },
        ],
      },
    ],
    isDecay: false,
  },
  {
    id: 1210052,
    name: 'スキルカード使用時、好印象の50%分パラメータ・好印象+1',
    valueType: 'number',
    type: 'buff',
    trigger: 'before_play_card',
    condition: '',
    effects: [
      {
        type: 'score',
        value: 0,
        options: [
          {
            type: 'increase_by_percentage',
            target: '好印象',
            value: 50,
          },
        ],
      },
      { type: 'status', target: '好印象', value: 1 },
    ],
    isDecay: false,
  },
  {
    id: 1210060,
    name: '元気効果のスキルカード使用後、好印象+1',
    valueType: 'number',
    type: 'buff',
    trigger: 'after_play_card',
    condition: 'card_contains_effect==genki|card_contains_effect==fixed_genki',
    effects: [
      {
        type: 'status',
        target: '好印象',
        value: 1,
      },
    ],
    isDecay: false,
  },
  {
    id: 1210070,
    name: '好印象効果のスキルカード使用後、好印象の30%分のパラメータ',
    valueType: 'number',
    type: 'buff',
    trigger: 'after_play_card',
    condition: 'card_contains_effect==好印象',
    effects: [
      {
        type: 'score',
        value: 0,
        options: [
          {
            type: 'increase_by_percentage',
            target: '好印象',
            value: 30,
          },
        ],
      },
    ],
    isDecay: false,
  },
  {
    id: 1210080,
    name: '好印象効果のスキルカード使用後、好印象の50%分のパラメータ',
    valueType: 'number',
    type: 'buff',
    trigger: 'after_play_card',
    condition: 'card_contains_effect==好印象',
    effects: [
      {
        type: 'score',
        value: 0,
        options: [
          {
            type: 'increase_by_percentage',
            target: '好印象',
            value: 50,
          },
        ],
      },
    ],
    isDecay: false,
  },
  {
    id: 1210090,
    name: '残り3ターン以内のターン終了時、好印象の140%分のパラメータ上昇',
    valueType: 'number',
    type: 'buff',
    trigger: 'end_turn',
    condition: 'remain_turn<=3',
    effects: [
      {
        type: 'score',
        value: 0,
        options: [
          {
            type: 'increase_by_percentage',
            target: '好印象',
            value: 140,
          },
        ],
      },
    ],
    isDecay: false,
  },
  {
    id: 1210091,
    name: '残り3ターン以内のターン終了時、好印象の180%分のパラメータ上昇',
    valueType: 'number',
    type: 'buff',
    trigger: 'end_turn',
    condition: 'remain_turn<=3',
    effects: [
      {
        type: 'score',
        value: 0,
        options: [
          {
            type: 'increase_by_percentage',
            target: '好印象',
            value: 180,
          },
        ],
      },
    ],
    isDecay: false,
  },
  {
    id: 1310010,
    name: '以降、ターン開始時、いずれかの指針の場合、すべてのスキルカードのパラメータ値増加+4',
    valueType: 'number',
    type: 'buff',
    trigger: 'start_turn',
    condition: '指針!=0',
    effects: [{ type: 'reinforcement', target: 'すべてのパラメータ値増加', value: 4 }],
    isDecay: false,
  },

  {
    id: 9210010,
    name: '好印象効果',
    valueType: 'number',
    type: 'buff',
    trigger: 'end_turn_goodImpression',
    condition: '好印象>0',
    effects: [
      {
        type: 'score',
        value: 0,
        options: [
          {
            type: 'increase_by_percentage',
            target: '好印象',
            value: 100,
          },
        ],
      },
    ],
    isDecay: false,
  },
];
