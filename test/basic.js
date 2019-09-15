const Collect = require('../')
const {PassThrough} = Collect
const t = require('tap')

t.test('writes with empty end()', t => {
  const c = new Collect()
  let sawData = false
  c.on('data', data => {
    t.notOk(sawData, 'should only see one data event')
    sawData = true
    t.equal(data.toString(), 'hello, world\n')
  })

  let sawWriteCB = false
  c.write('hel', () => {
    t.equal(sawWriteCB, false, 'see write cb only one time')
    sawWriteCB = true
  })
  c.write(Buffer.from('lo,'))
  c.write(Buffer.from(' wo').toString('hex'), 'hex')
  c.write('rld', 'utf8')
  c.write('\n')
  c.end(() => {
    t.ok(sawData, 'should see one data event')
    t.ok(sawWriteCB, 'saw write cb')
    t.end()
  })
})

t.test('writes with full end()', t => {
  const c = new Collect()
  let sawData = false
  c.on('data', data => {
    t.notOk(sawData, 'should only see one data event')
    sawData = true
    t.equal(data.toString(), 'hello, world\n')
  })

  c.write('hel')
  c.write('lo,')
  c.write(' wo')
  c.write('rld')
  c.end('\n', () => {
    t.ok(sawData, 'should see one data event')
    t.end()
  })
})

t.test('collect what passes through, empty end', t => {
  const c = new Collect()
  let sawData = false
  c.on('data', data => {
    t.notOk(sawData, 'should only see one data event')
    sawData = true
    t.equal(data.toString(), 'hello, world\n')
  })
  c.on('end', () => {
    t.ok(sawData, 'should see one data event')
  })

  const p = new PassThrough()
  p.on('collect', data => {
    t.equal(data.toString(), 'hello, world\n')
  })

  p.pipe(c)

  let sawWriteCB = false
  p.write('hel', () => {
    t.equal(sawWriteCB, false, 'see write cb only one time')
    sawWriteCB = true
  })
  p.write(Buffer.from('lo,'))
  p.write(Buffer.from(' wo').toString('hex'), 'hex')
  p.write('rld')
  p.write('\n')
  p.end(() => {
    t.equal(sawWriteCB, true, 'saw write cb')
    t.end()
  })
})

t.test('collect what passes through, empty end', t => {
  const c = new Collect()
  let sawData = false
  c.on('data', data => {
    t.notOk(sawData, 'should only see one data event')
    sawData = true
    t.equal(data.toString(), 'hello, world\n')
  })
  c.on('end', () => t.ok(sawData, 'should see one data event'))

  const p = new PassThrough()
  p.on('collect', data => {
    t.equal(data.toString(), 'hello, world\n')
  })

  p.pipe(c)
  p.write('hel')
  p.write('lo,')
  p.write(' wo')
  p.write('rld')
  p.end('\n', () => t.end())
})
