import Effective from './Effective.js';

export default class stageEffect extends Effective {
  /**
   * Create a stage effect.
   * @param {Object<String, any>} data
   */
  constructor(data) {
    data.trigger = 'start_turn';
    data.condition = (data.condition ? `${data.condition}&` : '') + `turn==${data.turn}`;
    data.name = data.type == 'support' ? '応援' : 'トラブル';
    super(data);
  }
}
