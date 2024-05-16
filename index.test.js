import { expect, test} from 'vitest'
import Pipeline from './index'

test('It can chain pipes', () => {
  const pipeline = new Pipeline()
  const value = 'foo'
  const result = pipeline
    .send(value)
    .pipe((value, next) => next(value + ' '))
    .pipe((value, next) => next(value + 'bar'))
    .thenReturn()

  expect(result).toBe('foo bar')
})

test('It handles an array of pipes', () => {
  const pipeline = new Pipeline()
  const value = 'foo'
  const result = pipeline
    .send(value)
    .through([
      (value, next) => next(value + ' '),
      (value, next) => next(value + 'bar'),
    ])
    .thenReturn()

  expect(result).toBe('foo bar')
})

test('It can use classes as pipes', () => {
  const pipeline = new Pipeline()
  const value = 'foo'
  class PipeOne {
    handle(value, next) {
      return next(value + ' ')
    }
  }

  class PipeTwo {
    handle(value, next) {
      return next(value + 'bar')
    }
  }

  const result = pipeline.send('foo')
    .through([
      new PipeOne,
      new PipeTwo,
    ])
    .thenReturn()

  expect(result).toBe('foo bar')
})

test('It can use a custom via method', () => {
  const pipeline = new Pipeline()
  const value = 'foo'
  class PipeOne {
    transform(value, next) {
      return next(value + ' ')
    }
  }

  class PipeTwo {
    transform(value, next) {
      return next(value + 'bar')
    }
  }

  const result = pipeline.send('foo')
    .via('transform')
    .through([
      new PipeOne,
      new PipeTwo,
    ])
    .thenReturn()

  expect(result).toBe('foo bar')
})

test('It can use static classes as pipes', () => {
  const pipeline = new Pipeline()
  const value = 'foo'
  class PipeOne {
    static handle(value, next) {
      return next(value + ' ')
    }
  }

  class PipeTwo {
    static handle(value, next) {
      return next(value + 'bar')
    }
  }

  const result = pipeline.send('foo')
    .through([
      PipeOne,
      PipeTwo,
    ])
    .thenReturn()

  expect(result).toBe('foo bar')
})

test('It can use a custom via method with static classes', () => {
  const pipeline = new Pipeline()
  const value = 'foo'
  class PipeOne {
    static transform(value, next) {
      return next(value + ' ')
    }
  }

  class PipeTwo {
    static transform(value, next) {
      return next(value + 'bar')
    }
  }

  const result = pipeline.send('foo')
    .via('transform')
    .through([
      PipeOne,
      PipeTwo,
    ])
    .thenReturn()

  expect(result).toBe('foo bar')
})

test('It can use a static class with the pipe method and custom via method', () => {
  const pipeline = new Pipeline()
  const value = 'foo'
  class PipeOne {
    pipe(value, next) {
      return next(value + ' ')
    }
  }

  class PipeTwo {
    pipe(value, next) {
      return next(value + 'bar')
    }
  }

  const result = pipeline.send('foo')
    .via('pipe')
    .pipe(new PipeOne)
    .pipe(new PipeTwo)
    .thenReturn()

  expect(result).toBe('foo bar')
})

test('It can use the then() function with a callback', () => {
  const pipeline = new Pipeline()
  const value = 'foo'
  const result = pipeline.send('foo')
    .pipe((value, next) => next(value + ' '))
    .pipe((value, next) => next(value + 'bar'))
    .then((value) => value.toUpperCase())

  expect(result).toBe('FOO BAR')
})
