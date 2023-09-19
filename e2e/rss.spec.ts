import { test, expect } from "@playwright/test";

test("rss feed is returned", async ({ page, request }) => {
    // The RSS feed is generated on build (or during dev when `/` is visited)
    // so we fake a `/` visit here
    await page.goto("/");

    const text = await (await request.get('/feed.xml')).text()

    // Check an item exists with a snapshot of expected data
    expect(text).toContain(`<title>Chever John's Blog</title>`)
    expect(text).toContain(`<title><![CDATA[How to run go plugin runner with Apisix-Ingress-controller]]></title>`)
    expect(text).toContain(`<guid>https://blog.cheverjohn.me/how-to-run-go-plugin-runner-in-apisix-ingress</guid>`)
    expect(text).toContain(`<pubDate>Fri, 29 Apr 2022 00:00:00 GMT</pubDate>`)
    expect(text).toContain(`<description><![CDATA[While wandering around the community......]]></description>`)
    expect(text).toContain(`<author>cheverjonathan@gmail.com (Chenwei Jiang)</author>`)
});
