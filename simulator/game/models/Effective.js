import { Clone } from '../../utils/helpers.js';
import Condition from './Condition.js';
import Effect from './Effect.js';

export default class Effective extends Clone {
  constructor(data) {
    super(['condition', 'effects']);
    /** ID @type {Number} */
    this.id = data.id;
    /** 名前 @type {String} */
    this.name = data.name;
    /** 使用タイミング @type {String} */
    this.trigger = data.trigger;
    /** 使用条件 @type {Condition} */
    this.condition = new Condition(data.condition);
    /** 使用時効果 @type {Array<Effect>} */
    this.effects = data.effects?.map((effect) => new Effect(effect)) ?? [];
    /** 使用回数制限 @type {Number} */
    this.limit = data.limit;
  }

  use() {
    if (this.limit > 0) {
      this.limit -= 1;
    }
    return this.limit == 0;
  }
}
