# Pipeline.js

Laravel's Pipeline in JS form

## Installation

```bash
npm install pipeline.js
```

## Usage

Import the `Pipeline` class and create a new instance of it.

```js
import Pipeline from 'pipeline.js'

const pipeline = new Pipeline()

pipeline.send('foo')
  .through([
    (value) => value + 'bar',
    (value) => value + 'baz'
  ])
  .then((value) => {
    console.log(value) // foobarbaz
  })
```

## Methods

### send()

The `send()` method is used to send a value through the pipeline.

```js
let value = 'foo'

pipeline.send(value)
```

### through()

The `through()` method is used to define the pipeline's steps. This can be an anonoymous function or lambda. You may also use a JS Class, with a `handle()` method (this can be overridden with the `via()` method). You may choose to use a static method to handle the value, or an instance method.

```js
// Anonoymous function
const pipeOne = (value, stack) => {
  value = value + 'bar'

  return stack(value)
}

// Lambda
const pipeTwo = (value, stack) => stack(value + 'baz')

// Class
class PipeThree {
  handle(value, stack) {
    return stack(value + 'qux')
  }
}

// Static method
class PipeFour {
  static handle(value, stack) {
    return stack(value + 'quux')
  }
}

pipeline.send('foo')
  .through([
    pipeOne,
    pipeTwo,
    new PipeThree,
    PipeFour
  ])
```

### pipe()

The `pipe()` method is used to define a single step in the pipeline.

```js
pipeline.send('foo')
  .pipe((value) => value + 'bar')
  .pipe((value) => value + 'baz')
  .then((value) => {
    console.log(value) // foobarbaz
  })
```

### via()

The `via()` method is used to define the method to call on a class. This is useful if you want to use a class, but don't want to use the `handle()` method. For example, if you want to use a class with a `process()` method:

```js
class PipeFive {
  process(value, stack) {
    return stack(value + 'quuz')
  }
}

pipeline.send('foo')
  .through([
    new PipeFive
  ])
  .via('process')
```

### then()

The `then()` method is used to define the callback to run after the pipeline has finished.

```js
pipeline.send('foo')
  .through([
    (value) => value + 'bar',
    (value) => value + 'baz'
  ])
  .then((value) => {
    console.log(value) // foobarbaz
  })
```

### thenReturn()

The `thenReturn()` method is used to return the value after the pipeline has finished.

```js
const result = pipeline.send('foo')
  .through([
    (value) => value + 'bar',
    (value) => value + 'baz'
  ])
  .thenReturn()

console.log(result) // foobarbaz
```

## License

MIT
