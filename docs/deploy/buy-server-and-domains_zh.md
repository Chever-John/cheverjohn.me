# 购买服务器和域名部署方式

这边采用了最原始的方案，简直是原始社会了简直是。

## 最简单

找到一个合适的域名提供商购买即可。这边找的是 namesilo。

然后需要注意的是，我们只需要更改 namesilo 的 nameserver 即可。将其更改为如下：

```sh
ns1.vultr.com
ns2.vultr.com
```

这两个域名可以在服务器提供商那边获得。

## 使用了 Cloudflare 服务

此处我使用了 Cloudflare 的服务所以，此处的 DNS nameserver 应该替换为如下：

```sh
jaime.ns.cloudflare.com
selah.ns.cloudflare.com
```

当然你也要注意将 Cloudflare 中的 DNS 设置成如下：

| Type      | Name          | Content       | Proxy status | TTL  |
| :-------- | :------------ | :------------ | :----------- | :--- |
| **A**     | cheverjohn.me | 45.76.99.217  | Proxied      | Auto |
| **CNAME** | *             | cheverjohn.me | Proxied      | Auto |
| **CNAME** | www           | cheverjohn.me | Proxied      | Auto |

## 购买服务器

找一个靠谱的服务器提供商，获得一个服务器。这边找的是 vultr。

买了服务器之后，需要注意的是，直接使用自带的 DNS 解析服务，构建一下即可。
