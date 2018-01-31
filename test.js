const test = require('tape');
const Observable = require('./index');

test('it does interval->map->filter->take', t => {
  t.plan(12);

  const expected = [1, 3, 5, 7, 9];

  Observable.interval(10)
    .map(x => x + 1)
    .filter(x => x % 2)
    .take(5)
    .subscribe({
      next: x => {
        t.true(expected.length > 0);
        const e = expected.shift();
        t.equals(x, e);
      },
      error: e => {},
      complete: () => {}
    });

  setTimeout(() =>{
    t.pass('nothing else happens');
    t.equals(expected.length, 0);
    t.end();
  }, 300);
});

test('it does combineLatest', (t) => {
  t.plan(6);

  const expected = ['a1', 'a2', 'a3', 'b3', 'b4'];

  const first = Observable.interval(230).take(2).map(i => ['a', 'b'][i]);
  const second = Observable.interval(100).take(5);
  Observable.combineLatest(first, second, (f, s) => `${f}${s}`)
    .subscribe({
      next: x => {
        const e = expected.shift();
        t.equals(x, e, 'downwards data is expected: ' + JSON.stringify(e));
      },
      error: e => {},
      complete: () => {}
    });

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});
