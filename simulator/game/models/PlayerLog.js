import { Clone } from '../../utils/helpers.js';

export default class PlayerLog extends Clone {
  constructor() {
    super();
    this.result = [];
    this.currentTurn = 0;
  }

  pull() {
    const result = this.result;
    this.result = [];
    return result;
  }

  add(type, text) {
    this.result.push({ type, text });
  }
}
