# minipass-collect

A Minipass stream that collects all the data into a single chunk

Note that this buffers ALL data written to it, so it's only good for
situations where you are sure the entire stream fits in memory.

## USAGE

```js
const Collect = require('minipass-collect')

const collector = new Collect()
collector.on('data', allTheData => {
  console.log('all the data!', allTheData)
})

someSourceOfData.pipe(colllector)
```

If you want to collect the data, but also act as a passthrough stream, then
use `Collect.PassThrough` instead (for example to memoize streaming
responses), and listen on the `collect` event.

```js
const Collect = require('minipass-collect')

const collector = new Collect.PassThrough()
collector.on('collect', allTheData => {
  console.log('all the data!', allTheData)
})

someSourceOfData.pipe(colllector).pipe(someOtherStream)
```

All [minipass options](http://npm.im/minipass) are supported.
