class Pipeline {
  constructor() {
    this.passable = null;
    this.pipes = [];
    this.method = 'handle';
  }

  /**
   * Set the object being sent throught the pipeline.
   *
   * @param   {mixed}  passable
   * @return  {this}
   */
  send(passable) {
    this.passable = passable;

    return this;
  }

  /**
   * Set the array of pipes.
   *
   * @param   {array}  pipes
   * @return  {this}
   */
  through(pipes) {
    this.pipes = Array.isArray(pipes) ? pipes : Array.prototype.slice.call(arguments);

    return this;
  }

  /**
   * Push additional pipes onto the pipeline.
   *
   * @param   {array|mixed}  method
   * @return  {this}
   */
  pipe(pipes) {
    this.pipes = this.pipes.concat(
      Array.isArray(pipes) ? pipes : Array.prototype.slice.call(arguments)
    );

    return this;
  }

  /**
   * Set the method to call on the pipes.
   *
   * @param   {string}  method
   * @return  {this}
   */
  via(method) {
    this.method = method;

    return this;
  }

  /**
   * Run the pipeline with a final destination callback.
   *
   * @param   {function}  destination
   * @return  {mixed}
   */
  then(destination) {
    let pipeline = this.pipes
      .slice()
      .reverse()
      .reduce(
        this.#carry(), this.#prepareDestination(destination)
      );

    return pipeline(this.passable);
  }

  /**
   * Run the pipeline and return the result.
   *
   * @return  {mixed}
   */
  thenReturn() {
    return this.then(passable => passable);
  }

  /**
   * Get the final piece of the Closure onion.
   *
   * @param   {function}  destination
   * @return  {function}
   */
  #prepareDestination(destination) {
    return passable => {
      try {
        return destination(passable);
      } catch (e) {
        return this.#handleException(passable, e);
      }
    };
  }

  /**
   * Get a Closure that represents a slice of the application onion.
   *
   * @return  {function}
   */
  #carry() {
    return (stack, pipe) => passable => {
      try {
        if (typeof pipe === 'function' && !pipe.prototype) {
          return pipe(passable, stack);
        } else if (typeof pipe === 'object' && !pipe[this.method]) {
          throw new Error(`${pipe.constructor.name} was instantiated, but called with static method`)
        } else if (!pipe[this.method]) {
          throw new Error(`${pipe.name ?? pipe.constructor.name} does not have a ${this.method} method`);
        }

        return pipe[this.method](passable, stack);
      } catch (e) {
        return this.#handleException(passable, e);
      }
    };
  }

  /**
   * Handle an exception thrown during pipeline execution.
   *
   * @param   {mixed}  passable
   * @param   {Error}  e
   * @return  {mixed}
   */
  #handleException(passable, e) {
    throw e;
  }
}

export default Pipeline;
