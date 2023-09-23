// 使用了 useRouter 和 useEffect 两个 hook，来监听路由变化，然后
// 使用 Next.js 中自带的 Script 组件，来插入 GoatCounter 计数器脚本代码。
import { useRouter } from "next/router";
import { useEffect } from "react";
import Script from "next/script";

// 全局声明语句中，表明了 window 对象中有一个 goatcounter 属性，它的类型是 any。
declare global {
    interface Window {
      goatcounter: any
    }
  }

// 定义了一个 GCScript 函数组件，它接收一个对象参数：siteUrl，和一个可选的对象参数：scriptSrc。
// 在组建内部，使用了 useRouter 和 useEffect 两个 hook，来监听路由变化
// 并使用赋值语句将组建内部的 handleRouteChange 回调函数，绑定到路由的 routeChangeComplete 事件上。
// Almost a direct copy of https://github.com/haideralipunjabi/next-goatcounter
export function GCScript({ siteUrl, scriptSrc = "//gc.zgo.at/count.js" }) {
    const router = useRouter();
    // useEffect hook 用于在组件渲染时，执行一些副作用操作。
    // 这是一个钩子函数，它将该函数绑定到 router.events 的 routeChangeComplete 事件上。
    // 当路由变化事件完成时，就会调用该函数。
    useEffect(() => {
        const handleRouteChange = (url) => {
            // 如果 window.goatcounter 不存在，就直接返回。
            if (!window.goatcounter) return;
            // 如果 window.goatcounter 存在，就调用它的 count 方法，来统计页面访问量。
            window.goatcounter.count({
                path: url.slice(1),
                event: false,
            });
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);
    // 在组件返回时，使用 Script 组件引入 GoatCounter 计数器脚本代码。
    return (
        <Script
            data-goatcounter={siteUrl}
            src={scriptSrc}
            strategy="afterInteractive"
        />
    );
}

// 在每个页面的渲染过程中，GCScript 组件会被渲染出来，它会在组件返回时，使用 Script 组件引入 GoatCounter 计数器脚本代码。
// 使用 data-goatcounter 属性，将 GoatCounter 计数器脚本的网站 URL 传递给了 Script 组件（计数器）。

// 因为 handleRouteChange 回调函数是绑定到全局路由变化事件上的，所以可以在整个生命周期中实现对每个页面的访问量计数。
// 无需在每个页面都手动注册行为。