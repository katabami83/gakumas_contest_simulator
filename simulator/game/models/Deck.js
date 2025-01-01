import DataLoader from '../data/DataLoader.js';
import { Clone, createRange, RandomGenerator } from '../../utils/helpers.js';
import Card from './Card.js';
import Player from './Player.js';
/**
 * カード管理クラス
 */
export default class Deck extends Clone {
  /**
   * Create a deck.
   * @param {Array<Number>} cardList - デッキに入れるカードリスト
   * @param {RandomGenerator} random - 乱数器
   */
  constructor(cardList, random) {
    super(['random']);
    /** デッキ内全カード @type {Array<Card>} */
    this.cards = cardList.map((card) => new Card(card));
    /** 保持のインデックス @type {Array<Number>} */
    this.retainIndexes = [];
    /** 山札のインデックス @type {Array<Number>} */
    this.drawPileIndexes = [];
    /** 手札のインデックス @type {Array<Number>} */
    this.handCardIndexes = [];
    /** 捨札のインデックス @type {Array<Number>} */
    this.discardPileIndexes = [];
    /** 廃棄札のインデックス @type {Array<Number>} */
    this.exhaustedPileIndexes = [];
    /** 乱数器 @type {RandomGenerator} */
    this.random = random;
    this.growthEffectMap = new Map();
  }

  setRandom(random) {
    this.random = random;
  }

  searchIndexesById(id) {
    const fixedId = Math.floor(id / 10) * 10;
    const indexes = [];
    for (let i = 0; i < this.cards.length; i++) {
      if (Math.floor(this.cards[i].id / 10) * 10 == fixedId) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  searchIndexesByFixed(id) {
    const indexes = [];
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].id == id) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  /**
   * Shuffle a array.
   * @param {Array<any>} array - シャッフルされる配列
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.random.next() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  triggerEvents(trigger, player, log) {
    const targets = this.growthEffectMap.get(trigger);
    if (!targets) {
      return [];
    }
    const remains = [];
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (!target.condition || target.condition.check(player)) {
        const targetCard = this.cards[target.cardIndex];
        log.add('box', `成長「${targetCard.name}」:card_${targetCard.id}`);
        target.effects.forEach((effect) => {
          this.reinforceCard(target.cardIndex, effect.type, effect.value, log);
        });
        log.add('end');
        if (target.use()) {
          remains.push(target);
        }
      } else {
        remains.push(target);
      }
    }
    this.growthEffectMap.set(trigger, remains);
  }

  reinforceCards(position, type, value) {
    let targetCardIndexes = [];
    if (position == 'handCard') {
      targetCardIndexes = this.handCardIndexes;
    } else if (position == 'all') {
      targetCardIndexes = [].concat(
        this.handCardIndexes,
        this.discardPileIndexes,
        this.drawPileIndexes,
        this.retainIndexes
      );
    } else if (position == 'retainCard') {
      targetCardIndexes = this.retainIndexes;
    } else if (position == 'スターライト') {
      targetCardIndexes = this.searchIndexesById(2013020);
    }
    targetCardIndexes.forEach((index) => this.reinforceCard(index, type, value));
  }

  reinforceCard(index, type, value, log) {
    const targetCard = this.cards[index];
    if (type == 'add_score') {
      targetCard.effects.forEach((cardEffect, index) => {
        if (cardEffect.type == 'score') {
          log?.add(
            'content',
            `スコア上昇量：${targetCard.effects[index].value}→${
              targetCard.effects[index].value + value
            }(${value})`
          );
          targetCard.effects[index].value += value;
        }
      });
    } else if (type == 'reduce_cost') {
      log?.add(
        'content',
        `コスト：${targetCard.cost.value}→${targetCard.cost.value + value}(${value})`
      );
      targetCard.cost.value += value;
    } else if (type == 'add_score_times') {
      targetCard.effects.forEach((cardEffect, index) => {
        if (cardEffect.type == 'score') {
          log?.add(
            'content',
            `スコア発動回数：${targetCard.effects[index].times}→${
              targetCard.effects[index].times + value
            }(${value})`
          );
          targetCard.effects[index].times += value;
        }
      });
    }
  }

  /**
   * Init a deck and apply pre-effect to player.
   * @param {Player} player - プレイヤー
   */
  init(player) {
    const initCardIndexes = createRange(0, this.cards.length);
    this.shuffle(initCardIndexes);
    const drawPileIndexes = [];
    const topDrawPileIndexes = [];

    // preeffects
    for (let i = 0; i < initCardIndexes.length; i += 1) {
      const growths = this.cards[initCardIndexes[i]]['growths'];
      if (growths) {
        growths.forEach((growth) => {
          const trigger = growth.trigger;
          if (!this.growthEffectMap.has(trigger)) {
            this.growthEffectMap.set(trigger, []);
          }
          growth.setCardIndex([initCardIndexes[i]]);
          this.growthEffectMap.get(trigger).push(growth);
        });
      }
      // 「レッスン開始時手札に入る」カードを手札に入れる
      // 6枚目以降はデッキトップに置く
      const pre_effects = this.cards[initCardIndexes[i]]['preEffects'];
      if (!pre_effects) {
        drawPileIndexes.push(initCardIndexes[i]);
        continue;
      }
      if (pre_effects.map((effect) => effect.type).includes('レッスン開始時手札に入る')) {
        if (this.handCardIndexes.length < 5) {
          this.handCardIndexes.push(initCardIndexes[i]);
        } else {
          topDrawPileIndexes.push(initCardIndexes[i]);
        }
      } else {
        drawPileIndexes.push(initCardIndexes[i]);
        continue;
      }
    }

    this.drawPileIndexes = drawPileIndexes.concat(topDrawPileIndexes);
    player.log?.add(
      'deck',
      this.drawPileIndexes
        .concat(this.handCardIndexes.toReversed())
        .map((index) => this.cards[index].id)
        .reverse()
        .join(':')
    );
    this.drawCards(3 - this.handCardIndexes.length, player.log);
  }

  /**
   * Move a card from draw pile to hand.
   */
  drawCard(log) {
    // 山札が0なら捨て札をシャッフルして山札にする
    if (this.drawPileIndexes.length == 0) {
      if (this.discardPileIndexes.length == 0) {
        return;
      } // 山札と捨て札が両方0ならドローできない
      this.drawPileIndexes = this.discardPileIndexes;
      this.discardPileIndexes = [];
      this.shuffle(this.drawPileIndexes);
      log?.add(
        'deck',
        this.drawPileIndexes
          .map((index) => this.cards[index].id)
          .reverse()
          .join(':')
      );
    }
    // 手札が5枚未満ならドロー
    // 5枚以上なら捨て札に置く
    const cardIndex = this.drawPileIndexes.pop();
    if (typeof cardIndex === 'undefined') {
      return;
    }
    if (this.handCardIndexes.length < 5) {
      this.handCardIndexes.push(cardIndex);
      log?.add('content', `${this.cards[cardIndex].name}を引いた`);
    } else {
      this.discardPileIndexes.push(cardIndex);
      log?.add('content', `${this.cards[cardIndex].name}を捨て札に送った`);
    }
  }

  /**
   * Move cards from draw pile to hand.
   * @param {Number} count - 引く枚数
   */
  drawCards(count, log) {
    if (this.handCardIndexes.length >= 5) {
      log?.add('content', `カードを引けなかった（手札上限）`);
      return;
    }
    for (let i = 0; i < count; i++) {
      this.drawCard(log);
    }
  }

  /**
   * Add a card into the deck.
   * @param {Number} card - 追加するカード
   * @param {String} place - 追加する場所
   */
  addCard(card, place) {
    const additionalCard = new Card(card);
    this.cards.push(additionalCard);
    const additionalCardIndex = this.cards.length - 1;
    switch (place) {
      case 'draw':
        this.drawPileIndexes.push(additionalCardIndex);
        break;
      case 'hand':
        this.handCardIndexes.push(additionalCardIndex);
        break;
      case 'discard':
        this.discardPileIndexes.push(additionalCardIndex);
        break;
      case 'exhausted':
        this.exhaustedPileIndexes.push(additionalCardIndex);
        break;
    }
  }

  /**
   * 手札を強化する
   * @param {Number} index - カードのインデックス
   */
  upgradeHandCard(index) {
    const targetCard = this.cards[index];
    if (
      Number(targetCard.id) % 10 == 0 && // 未強化カード
      DataLoader.cardMap.has(Number(targetCard.id) + 1) // 強化が存在する
    ) {
      this.cards[index] = new Card(DataLoader.cardMap.get(Number(targetCard.id) + 1));
    }
  }

  getCanUpgradeHandCards() {
    return this.handCardIndexes.filter((index) => {
      const card = this.cards[index];
      return Number(card.id) % 10 == 0 && DataLoader.cardMap.has(Number(card.id) + 1);
    });
  }

  upgradeRandomHandCards(count) {
    const canUpgradeHandCards = this.getCanUpgradeHandCards();
    this.shuffle(canUpgradeHandCards);
    const loop = Math.min(canUpgradeHandCards.length, count);
    for (let i = 0; i < loop; i++) {
      this.upgradeHandCard(canUpgradeHandCards[i]);
    }
  }

  /**
   * 全ての手札を強化する
   */
  upgradeAllHandCards() {
    this.handCardIndexes.forEach((index) => this.upgradeHandCard(index));
  }

  /**
   * 手札のカードを使用する
   * @param {Number} handIndex - 手札の番号
   */
  playHandCard(handIndex) {
    const targetCard = this.cards[this.handCardIndexes[handIndex]];
    if (targetCard.limit > 0) {
      targetCard.limit -= 1;
      if (targetCard.limit == 0) {
        this.exhaustedHandCard(handIndex);
        return;
      }
    }
    this.discardHandCard(handIndex);
  }

  /**
   * 手札の番号からカードを取得する
   * @param {Number} handIndex - 手札の番号
   * @return {Card} カード
   */
  getHandCard(handIndex) {
    return this.cards[this.handCardIndexes[handIndex]];
  }

  /**
   * 手札のカードを取得する
   * @return {Array<Card>} 手札のカード配列
   */
  getHandCards() {
    return this.handCardIndexes.map((index) => this.cards[index]);
  }

  /**
   * 手札から廃棄札にカードを移動する
   * @param {Number} handIndex - 手札の番号
   */
  exhaustedHandCard(handIndex) {
    this.exhaustedPileIndexes.push(this.handCardIndexes.splice(handIndex, 1)[0]);
  }

  /**
   * 手札から捨札にカードを移動する
   * @param {Number} handIndex - 手札の番号
   */
  discardHandCard(handIndex) {
    this.discardPileIndexes.push(this.handCardIndexes.splice(handIndex, 1)[0]);
  }

  /**
   * 全ての手札を捨札に移動する
   */
  discardAllHandCards() {
    this.handCardIndexes.forEach((index) => this.discardPileIndexes.push(index));
    this.handCardIndexes = [];
  }

  moveCard(index) {
    if (this.handCardIndexes.length >= 5) {
      return;
    }
    const array = [].concat(
      this.discardPileIndexes.map((value, index) => {
        return { index: value, pos: 'discard', posIndex: index };
      }),
      this.drawPileIndexes.map((value, index) => {
        return { index: value, pos: 'draw', posIndex: index };
      })
    );
    let indexPosition = null;
    for (let i = 0; i < array.length; i++) {
      if (array[i].index == index) {
        indexPosition = array[i];
      }
    }
    if (!indexPosition) {
      return;
    }
    let target = null;
    switch (indexPosition.pos) {
      case 'draw':
        target = this.drawPileIndexes;
        break;
      case 'hand':
        target = this.handCardIndexes;
        break;
      case 'discard':
        target = this.discardPileIndexes;
        break;
      case 'exhausted':
        target = this.exhaustedPileIndexes;
        break;
      case 'retain':
        target = this.retainIndexes;
        break;
    }
    if (target.splice(indexPosition.posIndex, 1)[0] != index) {
      throw new Error(`Removed index doesnot match moved index`);
    }
    this.handCardIndexes.push(index);
  }

  retainCard(index) {
    const array = [].concat(
      this.handCardIndexes.map((value, index) => {
        return { index: value, pos: 'hand', posIndex: index };
      }),
      this.discardPileIndexes.map((value, index) => {
        return { index: value, pos: 'discard', posIndex: index };
      }),
      this.drawPileIndexes.map((value, index) => {
        return { index: value, pos: 'draw', posIndex: index };
      })
      // this.retainIndexes.map((value, index) => {
      //   return { index: value, pos: 'retain', posIndex: index };
      // })
    );
    let indexPosition = null;
    for (let i = 0; i < array.length; i++) {
      if (array[i].index == index) {
        indexPosition = array[i];
      }
    }
    if (!indexPosition) {
      return;
    }
    let target = null;
    switch (indexPosition.pos) {
      case 'draw':
        target = this.drawPileIndexes;
        break;
      case 'hand':
        target = this.handCardIndexes;
        break;
      case 'discard':
        target = this.discardPileIndexes;
        break;
      case 'exhausted':
        target = this.exhaustedPileIndexes;
        break;
      case 'retain':
        target = this.retainIndexes;
        break;
    }
    if (target.splice(indexPosition.posIndex, 1)[0] != index) {
      throw new Error(`Removed index doesnot match moved index`);
    }
    this.retainIndexes.push(index);
    if (this.retainIndexes.length > 2) {
      const index = this.retainIndexes.shift();
      this.discardPileIndexes.push(index);
    }
  }

  /**
   * プリント
   */
  print() {
    const name_list = [
      'drawPileIndexes',
      'handCardIndexes',
      'discardPileIndexes',
      'exhaustedPileIndexes',
    ];
    try {
      for (const name of name_list) {
        const cards = this[name].map((index) => this.cards[index]);
        console.log(`${name.padEnd(18, ' ')}: ${cards.map((card) => card.name).join(', ')}`);
      }
    } catch (e) {
      console.log('deck error', e);
      for (const name of name_list) {
        console.log(this[name]);
      }
    }
  }
}
