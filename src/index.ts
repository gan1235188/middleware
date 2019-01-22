type nextType<T, K> = (opts: T) => K;
type middlewareType<T, K> = (opts: T, next?: nextType<T, K>) => K;
type endMiddleware<T, K> = (opts: T) => K;

export default class Middleware<T, K> {
    private middlewareQueue: Array<middlewareType<T, K>> = [];
    private end: endMiddleware<T, K> = (opts) => this.toType(opts);
    private start: middlewareType<T, K> = (opts, next) => next(opts);

    public use(...middlewareList: Array<middlewareType<T, K>>): this {
        middlewareList.forEach((middleware: middlewareType<T, K>) => {
            if (this.isFunction(middleware) && !this.isInMiddleware(middleware)) {
                this.middlewareQueue.push(middleware);
            }
        });
        return this;
    }

    public unuse(middleware: middlewareType<T, K>): boolean {
        const index = this.middlewareQueue.indexOf(middleware);

        if (index > -1) {
            this.middlewareQueue.splice(index, 1);
            return !this.isInMiddleware<T, K>(middleware);
        }

        return true;
    }

    public run(opts: T, index = 0): K | undefined {
        return this.start(opts, (nextOpts) => {
            return this.runMiddleware(nextOpts, index);
        });
    }

    public startWith(start: middlewareType<T, K>): this {
        this.start = start;
        return this;
    }

    public endWith(end: endMiddleware<T, K>): this {
        this.end = end;
        return this;
    }

    private runMiddleware(opts: T, index = 0): K | undefined{
        const toNextMiddleware = (nextOpts: T) => this.runMiddleware(nextOpts, index + 1);

        if (this.isFunction(this.middlewareQueue[index])) {
            return this.middlewareQueue[index](opts, toNextMiddleware);
        } else {
            return this.end(opts);
        }
    }

    private isInMiddleware<T, K>(middleware: middlewareType<T, K>, middlewareQueue: Array<middlewareType<T, K>> = []): boolean {
        return !middlewareQueue.every((item) => item !== middleware);
    }

    private isFunction(fn: Function): boolean {
        return typeof fn === 'function';
    }

    private toType<K>(obj: Object): K {
        return <K>obj;
    }
}