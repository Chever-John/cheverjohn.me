# Next.JS: Custom App

文档：https://nextjs.org/docs/pages/building-your-application/routing/custom-app
官方对其的定义

> Next.js uses the `App` component to initialize pages. You can override it and control the page initialization and:
>
> - Create a shared layout between page changes
> - Inject additional data into pages
> - [Add global CSS](https://nextjs.org/docs/pages/building-your-application/styling)

这边写得更加通俗一点，App 组件支持：

- 被覆盖，通过写一个 `_app.tsx`  进行覆盖；
- 控制页面的初始化；
- 创建一个 shared layout 在每次页面切换之间；
- 注入一些额外的 data 到每个页面；
- 添加 Global CSS。

接下来，我会将整篇文章分成五个模块，讲完上面的内容。

## 覆盖

这个不需要讲了我觉得暂时，至少我目前的认知里，这个的含义就是 “创建一个 `_app.tsx` 文件。

## 控制页面的初始化

这边我将会给一个例子去解释这个含义。

