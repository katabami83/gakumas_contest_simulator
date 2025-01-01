import EffectCalculator from '../calculator/EffectCalculator.js';
import { Clone, RandomGenerator } from '../../utils/helpers.js';
import Card from './Card.js';
import Condition from './Condition.js';
import Deck from './Deck.js';
import Effect from './Effect.js';
import Parameter from './Parameter.js';
import PItemBundle from './PItemBundle.js';
import PlayerLog from './PlayerLog.js';
import StatusEffectManager from './StatusEffectManager.js';
import TurnManager from './TurnManager.js';
import DataLoader from '../data/DataLoader.js';
import ActiveStatusEffect from './ActiveStatusEffect.js';
import PItem from './PItem.js';
import stageEffectManager from './stageEffectManager.js';

/**
 * プレイヤークラス
 */
export default class Player extends Clone {
  /**
   * Create a player.
   * @param {Object} data - ゲーム設定のデータ
   * @param {Object} data.playerData - playerに関するデータ
   * @param {Object} data.stageData - stageに関するデータ
   * @param {Array} data.cards - カード
   * @param {Array} data.pItemIds - PアイテムIDリスト
   * @param {Number} data.seed - シード値
   * @param {Array<Object>} data.stageEffects - ステージ効果
   */
  constructor({ playerData, stageData, cards, pItemIds, seed, stageEffects }) {
    super(['parameter', 'log']);
    /** 乱数器 @type {RandomGenerator} */
    this.random = new RandomGenerator(seed ?? 0);
    /** パラメータ @type {Parameter} */
    this.parameter = new Parameter(playerData.vocal, playerData.dance, playerData.visual);
    /** デッキ @type {Deck} */
    this.deck = new Deck(cards, this.random);
    /** Pアイテム @type {PItemBundle} */
    this.pItemBundle = new PItemBundle(pItemIds);
    /** ステータス @type {StatusEffectManager} */
    this.status = new StatusEffectManager();
    /** ターン @type {TurnManager} */
    this.turnManager = new TurnManager(stageData, this.random);
    /** 応援トラブル @type {stageEffectManager} */
    this.stageEffectManager = new stageEffectManager(stageEffects);
    /** 体力 @type {Number} */
    this.hp = playerData.hp;
    /** 最大体力 @type {Number} */
    this.maxHp = playerData.hp;
    /** プラン @type {String} */
    this.plan = playerData.plan;
    /** おすすめ効果 @type {String} */
    this.trend = playerData.trend;
    /** 元気 @type {Number} */
    this.genki = 0;
    /** スコア @type {Number} */
    this.score = 0;
    /** ゲームが終わったかどうか @type {Boolean} */
    this.isGameOver = false;
    /** カード使用数 @type {Number} */
    this.cardPlayCount = 0;
    /** 現在ターンのカード使用数 @type {Number} */
    this.currentTurnCardPlayCount = 0;
    /** 残りの再行動数 @type {Number} */
    this.remainExtraAction = 0;
    /** 消費したHP @type {Number} */
    this.consumedHp = 0;
    /** 累計全力値 @type {Number} */
    this.totalMantra = 0;
    /** 累計全力回数 @type {Number} */
    this.totalFullpower = 0;
    /** カード効果でHPを消費するか @type {Boolean} */
    this.isConsumeHpByCard = false;
    /** 効果2回発動 @type {Number} */
    this.dualCast = 0;
    /** 最後に使用したカードインデックス @type {Number} */
    this.lastPlayCardIndex = -1;
    /** フェーズ @type {Number} */
    this.phase = 0;
    /** ログ @type {PlayerLog} */
    this.log = new PlayerLog();
  }

  clone() {
    const copy = super.clone();
    copy.deck.setRandom(copy.random);
    copy.turnManager.setRandom(copy.random);
    copy.log = new PlayerLog();
    return copy;
  }

  /**
   * 初期化
   */
  init() {
    this.deck.init(this);
    this.status.add('好印象効果', 1);
    this.triggerEvent('start_game');
    this.startTurn(false);
  }

  /**
   * ターン開始時の動き
   * @param {Boolean} isDraw - 開始時ドローをするかどうか
   */
  startTurn(isDraw) {
    this.phase = 0;
    this.turnManager.startTurn();
    this.log.add(
      'turnStart',
      [
        this.turnManager.currentTurn,
        this.turnManager.currentTurnType,
        this.score,
        this.hp,
        this.genki,
      ].join(':')
    );
    if (isDraw) {
      this.drawCards(3);
    }
    // 指針
    if (this.status.getValue('全力値') >= 10) {
      this.log.add('box', `ステータス「指針」:awesome_forward_#007bff`);
      if (this.status.getValue('指針固定') == 0) {
        this.applyEffect(new Effect({ type: 'status', target: '全力値', value: -10 }), 'status');
      }
      this.applyEffect(new Effect({ type: 'status', target: '指針', value: 5 }), 'status');
      this.log.add('end');
    }
    this.triggerEvent('start_turn');
    this.triggerEvent('start_turn_interval');
    this.phase = 1;
  }

  drawCards(count) {
    this.deck.drawCards(count, this.log);
  }

  /**
   * ターン終了時の動き
   * @param {Boolean} isDiscard - 終了時捨てをするかどうか
   */
  endTurn(isDiscard) {
    this.triggerEvent('end_turn');
    this.triggerEvent('end_turn_goodImpression');
    if (isDiscard) {
      this.deck.discardAllHandCards();
    }
    this.status.decay();
    this.currentTurnCardPlayCount = 0;
    this.turnManager.endTurn();
    this.log.add('turnEnd');
  }

  /**
   * 休憩行動
   */
  rest() {
    this.log.add('box', '休憩:awesome_mug-saucer_#03af7a');
    this.applyEffect(new Effect({ type: 'heal', value: 2 }), 'rest');
    this.log.add('end');
  }

  /**
   * Player processes next step.
   * @param {Number} selectedHandIndex
   */
  next(selectedHandIndex) {
    if (selectedHandIndex == -1) {
      this.rest();
    } else {
      this.playCard(selectedHandIndex);
      // 再行動可能ならそのまま終了
      const extraAction = this.status.getValue('スキルカード使用数追加');
      if (extraAction > 0) {
        this.status.reduce('スキルカード使用数追加', 1);
        this.log.add('content', `スキルカード使用数追加${extraAction}→${extraAction - 1}(-1)`);
        return;
      }
    }
    this.endTurn(true);
    // 残りターンが0なら終了フラグを立てる
    if (this.turnManager.getRemainTurn() == 0) {
      this.isGameOver = true;
      return;
    }
    this.startTurn(true);
  }

  /**
   * Check condition
   * @param {Condition|undefined} condition
   * @return {Boolean}
   */
  checkCondition(condition) {
    if (!condition) {
      return true;
    }
    return condition.check(this);
  }

  /**
   * コストが支払い可能かを判定します。
   * @param {Effect} cost
   * @return {Boolean}
   */
  checkCost(cost) {
    const value = EffectCalculator.calcValue(cost, this);
    if (cost.type == 'hp') return this.hp + this.genki >= -value;
    if (cost.type == 'direct_hp') return this.hp >= -value;
    return this.status.getValue(cost.target) >= -value;
  }

  getActions() {
    const handCards = this.deck.getHandCards();
    const actions = [];
    const actionSet = new Set();
    for (let i = 0; i < handCards.length; i++) {
      const card = handCards[i];
      if (actionSet.has(card.name)) {
        continue;
      }
      if (this.checkCondition(card.condition) && this.checkCost(card.cost)) {
        actions.push({
          action: card,
          index: i,
        });
        actionSet.add(card.name);
      }
    }
    if (actions.length == 0) {
      actions.push({
        action: { name: '休憩' },
        index: -1,
      });
    }
    return actions;
  }

  getHandCardInfo() {
    const handCardIndex = this.deck.handCardIndexes;
    const result = [];
    for (const cardIndex of handCardIndex) {
      const card = this.deck.cards[cardIndex];
      result.push({
        card: card,
        cardIndex: cardIndex,
        available: this.checkCondition(card.condition) && this.checkCost(card.cost),
      });
    }
    return result;
  }

  /**
   * Get available effects from effects.
   * @param {Array<Effect>} effects
   * @return {Array<Effect>}
   */
  getAvailableEffects(effects) {
    const results = [];
    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];
      if (this.checkCondition(effect.condition)) {
        results.push(effect);
      }
    }
    return results;
  }

  /**
   * カードの使用
   * @param {Number} selectedHandIndex - 手札の番号
   */
  playCard(selectedHandIndex) {
    const card = this.deck.getHandCard(selectedHandIndex);
    this.log.add('box', `スキルカード「${card.name}」:card_${card.id}`);
    this.lastPlayCardIndex = this.deck.handCardIndexes[selectedHandIndex];
    this.cardPlayCount += 1;
    this.currentTurnCardPlayCount += 1;
    // コスト消費
    if (this.status.getValue('次に使用したスキルカードの消費体力を0にする') > 0) {
      this.status.reduce('次に使用したスキルカードの消費体力を0にする', 1);
      this.isConsumeHpByCard = true;
    }
    this.applyEffect(card.cost, 'card', card.name);
    if (this.status.getValue('指針') == 4) {
      this.applyEffect(new Effect({ type: 'fixed_direct_hp', value: -1 }), 'status');
    }
    // カード効果条件判定
    const availableEffects = this.getAvailableEffects(card.effects);
    // カード使用する時効果
    this.triggerEvent('before_play_card');
    // カード使用
    this.deck.playHandCard(selectedHandIndex);
    // カードの効果
    availableEffects.forEach((effect) => this.applyEffect(effect, 'card', card.name));
    // ワンモア効果
    if (this.dualCast > 0) {
      this.log.add('box', `ステータス「${card.name}」:card_${card.id}`);
      this.dualCast -= 1;
      availableEffects.forEach((effect) => this.applyEffect(effect, 'card', card.name));
      this.log.add('end');
    }
    this.isConsumeHpByCard = false;
    // カード使用後の効果
    this.triggerEvent('after_play_card');
    this.log.add('end');
  }

  /**
   * 行動にトリガーするイベントを起こす
   * @param {String} trigger - トリガータイミング
   */
  triggerEvent(trigger) {
    const turnItems = this.stageEffectManager.getItem(trigger, this);
    const pItemEvents = this.pItemBundle.getEvents(trigger, this);
    const statusEvents = this.status.getEvents(trigger, this);
    this.deck.triggerEvents(trigger, this, this.log);
    // ターン効果実行
    for (let i = 0; i < turnItems.length; i++) {
      const item = turnItems[i];
      this.log.add('box', `${item.name}`);
      item.effects.forEach((effect) => this.applyEffect(effect, 'system', item.name));
      this.log.add('end');
    }
    // Pアイテム実行
    for (let i = 0; i < pItemEvents.length; i++) {
      const event = pItemEvents[i];
      this.log.add('box', `Pアイテム「${event.name}」:pItem_${event.id}`);
      event.effects.forEach((effect) => this.applyEffect(effect, 'pItem', event.name));
      this.log.add('end');
    }
    // ステータス効果実行
    for (let i = 0; i < statusEvents.length; i++) {
      const event = statusEvents[i];
      if (event.id == -1) {
        this.log.add('box', `予約効果「${event.sourceName}」:awesome_link_#007bff`);
      } else {
        this.log.add('box', `ステータス「${event.sourceName}」:awesome_forward_#007bff`);
      }
      event.effects.forEach((effect) => this.applyEffect(effect, 'status', event.name));
      this.log.add('end');
    }
  }

  selectRetainCard(candidates) {
    const getScoreByCardIndex = (cardIndex) => {
      const card = this.deck.cards[cardIndex];
      let score = 0;
      for (let i = 0; i < card.effects.length; i++) {
        if (card.effects[i].type == 'score') {
          score += card.effects[i].value * card.effects[i].times;
        }
      }
      return score;
    };
    const compareFn = (a, b) => {
      const scoreA = getScoreByCardIndex(a);
      const scoreB = getScoreByCardIndex(b);
      if (scoreA < scoreB) {
        return 1;
      } else {
        return -1;
      }
    };

    const sortedCardIndexes = candidates.toSorted(compareFn);
    return sortedCardIndexes[0];
  }

  /**
   * EffectをPlayerに適用する
   * @param {Effect} effect
   * @param {String} sourceType
   * @param {String} sourceName
   * @returns
   */
  applyEffect(effect, sourceType, sourceName = sourceType) {
    const { type, target, options, delay, condition, times } = effect;

    if (delay) {
      if (delay == -1) {
        this.status.addDelayEffect('予約効果', sourceName, `remain_turn==1`, effect, 'end_turn');
        this.log.add('content', `予約効果[${sourceName}]：最終ターン終了後`);
      } else {
        this.status.addDelayEffect(
          '予約効果',
          sourceName,
          `turn==${this.turnManager.currentTurn + delay}`,
          effect
        );
        this.log.add('content', `予約効果[${sourceName}]：${delay}ターン後`);
      }

      return;
    }

    let value = EffectCalculator.calcValue(effect, this);
    const isTriggerEvent = sourceType == 'card';

    // console.log(`applyEffect: ${type}, ${target}, ${value}`);

    if (type == 'score') {
      const score = this.score;
      for (let i = 0; i < (times ?? 1); i++) {
        const effectValue = Math.ceil(
          value * this.parameter.getScale(this.turnManager.currentTurnType)
        );
        this.score += effectValue;
        this.log.add('content', `スコア：${score}→${this.score}(${effectValue})`);
        if (Number.isNaN(this.score)) {
          console.log(
            this,
            effect,
            sourceType,
            value,
            this.parameter.get(this.turnManager.currentTurnType)
          );
          throw new Error('era-');
        }
      }
      return;
    }
    if (type == 'heal') {
      const hp = this.hp;
      this.hp = Math.min(this.hp + value, this.maxHp);
      this.log.add('content', `HP：${hp}→${this.hp}(${this.hp - hp})`);
      return;
    }
    if (type == 'hp' || type == 'direct_hp' || type == 'fixed_direct_hp') {
      if (sourceType == 'card' && this.isConsumeHpByCard) {
        value = 0;
      }
      const hp = this.hp;
      const genki = this.genki;
      if (type == 'direct_hp' || type == 'fixed_direct_hp') {
        this.hp += value;
      } else if (this.genki < -value) {
        this.hp += this.genki + value;
        this.genki = 0;
      } else {
        this.genki += value;
      }
      this.hp = Math.max(this.hp, 0);

      if (this.genki < genki) {
        this.log.add('content', `元気：${genki}→${this.genki}(${this.genki - genki})`);
      }
      if (this.hp < hp) {
        this.consumedHp += hp - this.hp;
        this.log.add('content', `HP：${hp}→${this.hp}(${this.hp - hp})`);
      }
      if (isTriggerEvent && this.hp < hp) {
        // hp減少時
        this.triggerEvent('consume_hp');
      }
      return;
    }
    if (type == 'genki' || type == 'fixed_genki') {
      const genki = this.genki;
      this.genki += value;
      this.log.add('content', `元気：${genki}→${this.genki}(${this.genki - genki})`);
      return;
    }
    if (type == 'draw') {
      this.drawCards(value);
      return;
    }
    if (type == 'discard') {
      this.log.add('content', `全ての手札を捨てた`);
      this.deck.discardAllHandCards();
      return;
    }
    if (type == 'exchange') {
      const handCard = this.deck.handCardIndexes.length;
      this.log.add('content', `全ての手札を捨てた`);
      this.deck.discardAllHandCards();
      this.drawCards(handCard);
      return;
    }
    if (type == 'upgrade') {
      if (value == 0) {
        this.log.add('content', `全ての手札を強化した`);
        this.deck.upgradeAllHandCards();
      } else {
        this.log.add('content', `${value}枚の手札を強化した`);
        this.deck.upgradeRandomHandCards(value);
      }
      return;
    }
    if (type == 'generate') {
      if (target == 'ランダムな強化済みスキルカード') {
        const targetCardList = Array.from(DataLoader.cardMap.values()).filter(
          (item) =>
            (item.plan == 'free' || item.plan == this.plan) && // プラン指定
            item.id % 10 == 1 && // 強化カード
            item.id > 2000000 && // 基本カード削除
            String(item.id)[1] != '2' && // キャラ固有削除)
            String(item.id)[1] != '3' // サポ固有削除)
        );
        const targetCard = targetCardList[Math.floor(this.random.next() * targetCardList.length)];
        this.deck.addCard(targetCard, 'hand');
        this.log.add('content', `${targetCard.name}を手札に加えた`);
      }
      return;
    }
    if (type == 'retain') {
      let candidateIndexes = [];
      switch (target) {
        case '自身':
          candidateIndexes = [this.lastPlayCardIndex];
          break;
        case '手札':
          candidateIndexes = [].concat(this.deck.handCardIndexes);
          break;
        case '山札捨札':
          candidateIndexes = [].concat(this.deck.drawPileIndexes, this.deck.discardPileIndexes);
          break;
        case 'カード':
          candidateIndexes = this.deck.searchIndexesById(value);
          break;
        default:
          throw new Error(`effect.target=${target}は設定されていません`);
      }
      const retainIndex = this.selectRetainCard(candidateIndexes);
      if (typeof retainIndex !== 'undefined') {
        this.deck.retainCard(retainIndex);
        this.log.add('content', `${this.deck.cards[retainIndex].name}を保留に移動`);
      }
      return;
    }
    if (type == 'move') {
      let moveCards = [];
      moveCards = this.deck.searchIndexesByFixed(Number(target));
      if (moveCards.length == 0) return;
      const moveCard = moveCards[0];
      this.deck.moveCard(moveCard);
      return;
    }
    if (type == 'reinforcement') {
      if (target == '手札のパラメータ上昇回数増加') {
        this.deck.reinforceCards('handCard', 'add_score_times', value);
        this.log.add('content', `手札のカードを強化`);
      } else if (target == 'すべてのパラメータ値増加') {
        this.deck.reinforceCards('all', 'add_score', value);
        this.log.add('content', `全てのカードを強化`);
      } else if (target == '手札のパラメータ値増加') {
        this.deck.reinforceCards('handCard', 'add_score', value);
        this.log.add('content', `手札のカードを強化`);
      } else if (target == '保留のパラメータ値増加') {
        this.deck.reinforceCards('retainCard', 'add_score', value);
        this.log.add('content', `保留のカードを強化`);
      } else if (target == 'スターライトのパラメータ上昇回数増加') {
        this.deck.reinforceCards('スターライト', 'add_score_times', value);
        this.log.add('content', `スターライトを強化`);
      } else if (target == 'スターライトのパラメータ値増加') {
        this.deck.reinforceCards('スターライト', 'add_score', value);
        this.log.add('content', `スターライトを強化`);
      }
      return;
    }
    if (type == 'extra_turn') {
      const extraTurn = this.turnManager.extraTurn;
      this.turnManager.addExtraTurn(value);
      this.log.add('content', `追加ターン：${extraTurn}→${extraTurn + value}(${value})`);
      return;
    }
    if (type == 'dual_cast') {
      this.dualCast += 1;
      return;
    }
    if (type == 'status') {
      if (value >= 0) {
        if (this.status.has('低下状態無効') && this.status.getType(target) == 'debuff') {
          this.status.reduce('低下状態無効', 1);
          const _value = this.status.getValue('低下状態無効');
          this.log.add('content', `低下状態無効：${_value + 1}→${_value}(-1)`);
        } else {
          if (target == '全力値') {
            if (value > 0) {
              this.totalMantra += value;
            }
          }
          if (target == '指針') {
            const guideline = this.status.getValue(target);
            let isChangeGuideline = true;
            const guidelineTexts = [
              '無し',
              '温存:段階1',
              '温存:段階2',
              '強気:段階1',
              '強気:段階2',
              '全力',
            ];
            if (this.status.getValue('指針固定') > 0) {
              this.log.add('content', `指針：${guidelineTexts[guideline]}(指針固定)`);
            } else if (
              ((value == 1 || value == 2) && guideline == 2) ||
              ((value == 3 || value == 4) && guideline == 4) ||
              guideline == 5
            ) {
              this.log.add('content', `指針：${guidelineTexts[guideline]}(変化なし)`);
            } else {
              if (value == 3 || value == 4 || value == 5) {
                if (guideline == 1) {
                  this.applyEffect(
                    new Effect({ type: 'status', target: 'スキルカード使用数追加', value: 1 }),
                    'status'
                  );
                  this.applyEffect(
                    new Effect({ type: 'status', target: '熱意', value: 5 }),
                    'status'
                  );
                } else if (guideline == 2) {
                  this.applyEffect(
                    new Effect({ type: 'status', target: 'スキルカード使用数追加', value: 1 }),
                    'status'
                  );
                  this.applyEffect(new Effect({ type: 'genki', value: 5 }), 'status');
                  this.applyEffect(
                    new Effect({ type: 'status', target: '熱意', value: 8 }),
                    'status'
                  );
                }
              }
              let setValue = value;
              if (guideline == 1 && value == 1) {
                setValue = 2;
                isChangeGuideline = false;
              }
              if (guideline == 3 && value == 3) {
                setValue = 4;
                isChangeGuideline = false;
              }
              this.status.add('指針', setValue);
              this.log.add(
                'content',
                `指針：${guidelineTexts[guideline]}→${guidelineTexts[setValue]}`
              );
              if (setValue == 5) {
                this.totalFullpower += 1;
                this.applyEffect(
                  new Effect({ type: 'status', target: 'スキルカード使用数追加', value: 1 }),
                  'status'
                );
                if (this.deck.retainIndexes.length > 0) {
                  this.log.add(
                    'content',
                    `${this.deck.retainIndexes
                      .map((index) => this.deck.cards[index].name)
                      .join('と')}を手札に加えた`
                  );
                  this.deck.handCardIndexes.push(...this.deck.retainIndexes);
                  this.deck.retainIndexes = [];
                }
              }
              if (isChangeGuideline) {
                this.triggerEvent(`change_guideline`);
              }
            }
            return;
          }
          const _value = this.status.getValue(target);
          this.status.add(target, value, options, this.phase, sourceName);
          this.log.add('content', `${target}：${_value}→${_value + value}(${value})`);
          if (isTriggerEvent) {
            // ステータスアップにフック
            this.triggerEvent(`increased_status:${target}`);
          }
        }
      } else {
        const _value = this.status.getValue(target);
        this.status.reduce(target, -value);
        this.log.add('content', `${target}：${_value}→${_value + value}(${value})`);
      }
      return;
    }
    throw new Error(`effect.type=${effect.type}は設定されていません`);
  }
}
