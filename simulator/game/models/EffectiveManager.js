import { Clone } from '../../utils/helpers.js';
import Player from './Player.js';
import Effective from './Effective.js';

/**
 * Effective item管理クラス
 */
export default class EffectiveManager extends Clone {
  /**
   * Effective manager
   */
  constructor() {
    super();
    /** All effective items @type {Map<String, Array<Effective>>} */
    this.itemTriggerMap = new Map();
  }

  /**
   * Effective itemをMapに登録します。
   * @param {String} trigger
   * @param {Effective} item
   */
  register(trigger, item) {
    if (!this.itemTriggerMap.has(trigger)) {
      this.itemTriggerMap.set(trigger, []);
    }
    this.itemTriggerMap.get(trigger).push(item);
  }

  /**
   * 現在のプレイヤー条件で使用可能なPアイテムを返します。
   * @param {String} trigger
   * @param {Player} player
   * @return {Array<Effective>}
   */
  getItem(trigger, player) {
    const items = this.itemTriggerMap.get(trigger) ?? [];
    const results = [];
    const remains = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.condition || item.condition.check(player)) {
        results.push(item);
        if (item.use()) {
          remains.push(item);
        }
      } else {
        remains.push(item);
      }
    }
    this.itemTriggerMap.set(trigger, remains);
    return results;
  }
}
