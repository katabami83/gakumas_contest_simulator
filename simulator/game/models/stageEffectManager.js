import TurnEffect from './stageEffect.js';
import EffectiveManager from './EffectiveManager.js';
import Effective from './Effective.js';

/**
 * 応援/トラブル管理クラス
 */
export default class stageEffectManager extends EffectiveManager {
  /**
   * Create a stageEffectManager.
   * @param {Array<Object>} list - stageEffects
   */
  constructor(list) {
    super();
    /** 全Pアイテム @type {Array<Effective>} */
    for (let i = 0; i < list.length; i++) {
      const stageEffectList = list[i].list;
      for (let j = 0; j < stageEffectList.length; j++) {
        const turnEffect = new TurnEffect(stageEffectList[j]);
        this.register(turnEffect.trigger, turnEffect);
      }
    }
  }
}
