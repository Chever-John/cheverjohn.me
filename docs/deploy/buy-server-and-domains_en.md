# Buy Server And Domains

Initial ways.

## Buy A Domain

Just find a suitable domain name provider and buy it. Here we are looking for namesilo.

Then note that we just need to change the nameserver of namesilo. Change it to the following.

```yaml
ns1.vultr.com
ns2.vultr.com
```

These two domains are available on the server provider's side.

## Buy A Server

Find a reliable server provider and get a server. The one I'm looking for here is vultr.

After you buy the server, you need to pay attention to the fact that you can just use the DNS resolution service that comes with it and build it.

## Use Cloudflare

Use Cloudflare DNS server.

```sh
jaime.ns.cloudflare.com
selah.ns.cloudflare.com
```

Set DNS in Cloudflare as following:

| Type      | Name          | Content       | Proxy status | TTL  |
| :-------- | :------------ | :------------ | :----------- | :--- |
| **A**     | cheverjohn.me | 45.76.99.217  | Proxied      | Auto |
| **CNAME** | *             | cheverjohn.me | Proxied      | Auto |
| **CNAME** | www           | cheverjohn.me | Proxied      | Auto |
