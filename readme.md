# callbag-pseudo-rxjs

This is a proof of concept to demonstrate how an RxJS-style API can be built using callbags under the hood. It shows that the [Callbag spec](https://github.com/callbag/callbag) does not dictate the API you find in [callbag-basics](https://github.com/staltz/callbag-basics). Check the source code for this repo and you'll find that we use callbags as implementation, but the external API mimics RxJS.

`npm install callbag-pseudo-rxjs`

## example

Pick the first 5 odd numbers from a clock that ticks every second, then subscribe to it:

```js
const Observable = require('callbag-pseudo-rxjs');

Observable.interval(1000)
  .map(x => x + 1)
  .filter(x => x % 2)
  .take(5)
  .subscribe({
    next: x => console.log(x),
    error: e => {},
    complete: () => {}
  });

// 1
// 3
// 5
// 7
// 9
```

Log XY coordinates of click events on `<button>` elements:

```js
const Observable = require('callbag-pseudo-rxjs');

Observable.fromEvent(document, 'click')
  .filter(ev => ev.target.tagName === 'BUTTON')
  .map(ev => ({x: ev.clientX, y: ev.clientY}))
  .subscribe({
    next: x => console.log(x),
    error: e => {},
    complete: () => {}
  });

// {x: 110, y: 581}
// {x: 295, y: 1128}
// ...
```
