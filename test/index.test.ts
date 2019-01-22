import Middleware from 'src/index';

const addOne = (data: number, next: Function): number => next(data + 1);

test('test Middleware method: use', () => {
    const middleware = new Middleware<number, number>();

    middleware.use(addOne);
    expect(middleware.run(0)).toBe(1);
})

test('test Middleware method: unuse', () => {
    const middleware = new Middleware<number, number>();

    middleware.use(addOne);
    expect(middleware.unuse(addOne)).toBe(true);
    expect(middleware.run(10)).toBe(10);
})

test('test Middleware method: startWith', () => {
    const middleware = new Middleware<number, number>();
    const startMiddleware = (data: number, next: Function) => next(data * 0);

    middleware.startWith(startMiddleware);
    middleware.use(addOne);

    expect(middleware.run(10)).toBe(1);
})


test('test Middleware method: endWith', () => {
    const middleware = new Middleware<number, number>();
    const endWith = (data: number) => 1000;

    middleware.endWith(endWith);
    middleware.use(addOne);

    expect(middleware.run(10)).toBe(1000);
})

test('test Middleware for two Type', () => {
    interface Request {
        url: string,
        method: string,
        data: string
    }

    const middleware = new Middleware<Request, string>();
    const startWith = (data: Request, next: Function) => next(data);
    const endWith = (data: Request) => data.url + data.data;
    const url = '/test';
    const data = '?a=1';
    let request: Request = {
        url, 
        data,
        method: 'GET'
    }

    const response = middleware
        .startWith(startWith)
        .endWith(endWith)
        .use((opts, next) => {
            opts.data += '&_=1';
            let response = next(opts);
            return response += '#test';
        })
        .run(request)
    ;

    expect(response).toBe(url + data + '&_=1#test')
})