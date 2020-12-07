# React Router

## index
- [官网](https://reactrouter.com/web/guides/quick-start)
- [官方中文教程](https://react-guide.github.io/react-router-cn/docs/Introduction.html)
- [react-router v4 使用 history 控制路由跳转 #3](https://segmentfault.com/a/1190000011137828)
- [History及React Router详细解析](https://juejin.cn/post/6844904004598628366)
- [心中无路由，处处皆自由/react-router v4 动态路由](https://github.com/wayou/wayou.github.io/issues/16)

## History
常用的 history 有三种形式， 但是你也可以使用 React Router 实现自定义的 history。

- browserHistory
- hashHistory
- createMemoryHistory

其中`browserHistory`官方最推荐，但是要使用的话，服务器需要配置下。

`createMemoryHistory`通过用于非浏览器环境。还有一种神奇的用法的微前端中跨应用复用模块，见[基于微前端的大型中台项目融合方案 #41](https://github.com/brickspert/blog/issues/41)

## 动态路由
一句话来说就是组件当路由，比静态路由更加自由

静态路由：
```javascript
import { Router, Route, IndexRoute } from 'react-router'

const PrimaryLayout = props => (
  <div className="primary-layout">
    <header>
      Our React Router 3 App
    </header>
    <main>
      {props.children}
    </main>
  </div>
)

const HomePage =() => <div>Home Page</div>
const UsersPage = () => <div>Users Page</div>

const App = () => (
  <Router history={browserHistory}>
    <Route path="/" component={PrimaryLayout}>
      <IndexRoute component={HomePage} />
      <Route path="/users" component={UsersPage} />
    </Route>
  </Router>
)

render(<App />, document.getElementById('root'))
```

动态路由：
```javascript
import { BrowserRouter, Route } from 'react-router-dom'

const PrimaryLayout = () => (
  <div className="primary-layout">
    <header>
      Our React Router 4 App
    </header>
    <main>
      <Route path="/" exact component={HomePage} />
      <Route path="/users" component={UsersPage} />
    </main>
  </div>
)

const HomePage =() => <div>Home Page</div>
const UsersPage = () => <div>Users Page</div>

const App = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)

render(<App />, document.getElementById('root'))
```

