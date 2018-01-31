const map = require('callbag-map');
const filter = require('callbag-filter');
const take = require('callbag-take');
const skip = require('callbag-skip');
const interval = require('callbag-interval');
const fromEvent = require('callbag-from-event');
const fromPromise = require('callbag-from-promise');
const combine = require('callbag-combine');
const merge = require('callbag-merge');
const scan = require('callbag-scan');
const concat = require('callbag-concat');
const share = require('callbag-share');

class Observable {
  constructor(subscribeOrSource, firstArgIsSource = false) {
    if (firstArgIsSource) {
      this._source = subscribeOrSource;
    } else {
      this._source = (start, sink) => {
        if (start !== 0) return;
        let subscription;
        const talkback = (t, d) => {
          if (t === 2) subscription.unsubscribe();
        }
        sink(0, talkback);
        subscription = subscribeOrSource({
          next: x => sink(1, x),
          error: e => sink(2, e),
          complete: () => sink(2),
        });
      }
    }
  }

  static create(subscribe) {
    return new Observable(subscribe);
  }

  static interval(period) {
    return new Observable(interval(period), true)
  }

  static fromEvent(node, name) {
    return new Observable(fromEvent(node, name), true)
  }

  static fromPromise(promise) {
    return new Observable(fromPromise(promise), true)
  }

  static combineLatest(...observables) {
    const f = observables.pop();
    const g = arr => f(...arr);
    const sources = observables.map(obs => obs._source);
    return new Observable(map(g)(combine(...sources)), true);
  }

  static merge(...observables) {
    const sources = observables.map(obs => obs._source);
    return new Observable(merge(...sources), true);
  }

  static concat(...observables) {
    const sources = observables.map(obs => obs._source);
    return new Observable(concat(...sources), true);
  }

  toCallbag() {
    return this._source;
  }

  map(f) {
    return new Observable(map(f)(this._source), true);
  }

  scan(f, seed) {
    return new Observable(scan(f, seed)(this._source), true);
  }

  filter(f) {
    return new Observable(filter(f)(this._source), true);
  }

  take(max) {
    return new Observable(take(max)(this._source), true);
  }

  skip(max) {
    return new Observable(skip(max)(this._source), true);
  }

  share() {
    return new Observable(share(this._source), true);
  }

  subscribe(observer) {
    this._source(0, (type, data) => {
      if (type === 1) observer.next(data);
      else if (type === 2 && typeof data !== 'undefined') {
        observer.error(data);
      } else if (type === 2) {
        observer.complete();
      }
    });
  }
}

module.exports = Observable;

