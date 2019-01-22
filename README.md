# middleware
js中间件

# API
- use: 注册需要运行的中间件
- unuse：取消需要运行的中间件
- run：运行中间件
- startWith：固定第一个中间件
- endWith：固定最后一个中间件

# 使用示例
```javascript
import Middleware from 's-middleware'
import axios from 'axios'

const httpMiddleware = new Middleware();

httpMiddleware
    .startWith((config, next) => {
        console.log("start a ajax request")
        return next(config)
    })
    .use(showLoading())
    .use((config, next) => {
        config.url += '?_=' + Date.now()
        return next(config)
    })
    .use(addTestData)
    .endWith((config) => {
        return axios.request(config)
    })
;

async function getResult() {
    const result = await httpMiddleware.run({
        url: '/test',
        data: {
            a: 'a'
        },
        method: 'post'
    })

    console.log(result)
}

getResult()

//删除addTestData调用
httpMiddleware.unuse(addTestData)


function addTestData(config, next) {
    config.data.test = 'test'
    return next(config)
}

function showLoading(){
    let times = 0
    let startTime = 0

    return (config, next) => {
        times++ && $(".loading").show()
        try{
            const result = next(config)
        } catch(e) {
            if(--times <= 0){
                $(".loading").hide()
                times = 0
            }

            throw new Error(e)
        }
    }
}

```