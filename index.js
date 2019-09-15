const Minipass = require('minipass')
const _data = Symbol('_data')
const _length = Symbol('_length')
class Collect extends Minipass {
  constructor (options) {
    super(options)
    this[_data] = []
    this[_length] = 0
  }
  write (chunk, enc) {
    const c = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc)
    this[_data].push(c)
    this[_length] += c.length
    return true
  }
  end (chunk, enc) {
    if (chunk || enc)
      this.write(chunk, enc)
    const result = Buffer.concat(this[_data], this[_length])
    super.write(result)
    return super.end()
  }
}
module.exports = Collect

// it would be possible to DRY this a bit by doing something like
// this.collector = new Collect() and listening on its data event,
// but it's not much code, and we may as well save the extra obj
class CollectPassThrough extends Minipass {
  constructor (options) {
    super(options)
    this[_data] = []
    this[_length] = 0
  }
  write (chunk, enc) {
    const c = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc)
    this[_data].push(c)
    this[_length] += c.length
    return super.write(chunk, enc)
  }
  end (chunk, enc) {
    if (chunk || enc)
      this.write(chunk, enc)
    const result = Buffer.concat(this[_data], this[_length])
    this.emit('collect', result)
    return super.end()
  }
}
module.exports.PassThrough = CollectPassThrough
