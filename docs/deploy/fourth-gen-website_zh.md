# 第四代网站部署方案

我的第四代网站，就是我脑抽，在 2022 年还使用 HTML、CSS、JS 技术写的网站，纯粹是给自己找不开心了纯粹是。目前网站已被 Archive 到一个[子目录](https://github.com/Chever-John/cheverjohn.me/tree/main/old-website-styles)了。

开始整体，讲一下我的搭建思路。

购买服务器和购买域名我们就不说了。直接说部署方案。这边介绍了三种部署方案，分别为 Nginx + 服务器部署、Docker 容器化部署和 Apisix + 服务器部署。

## 第一种方案：服务器下 Nginx 部署

其实就是买下服务器后，然后安装 Nginx 之后，进行部署。

推荐指数：两颗星

原因就是如果需要更改配置就很麻烦了，而且还需要重启。

### 步骤

使用 **NGINX** 作为反向代理服务器，将路由反向代理到 index.html，仅此而已。可以参考这个[链接](https://www.vultr.com/zh/docs/how-to-install-and-configure-nginx-on-a-vultr-cloud-server/#:~:text=Encrypt%20guide%20here.-,Configure%20Nginx%20as%20a%20Reverse%20Proxy,-Nginx%20can%20work)，获取更多的信息。

运行如下命令查看我的配置：

```bash
cat /etc/nginx/conf.d/cheverjohn.me.conf
```

我的 **NGINX** 的配置如下：

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name cheverjohn.me www.cheverjohn.me;

    root /home/vultrchever/website/static;

    index index.html;

    access_log /var/log/nginx/cheverjohn.me.access.log;
    error_log /var/log/nginx/cheverjohn.me.error.log;

    location / {
        try_files $uri $uri/ =404;
    }

}
```

## 第二种方案：Docker 一下你就知道

推荐指数：四颗星

这其实是我最推荐的，如果你刚刚在一个新的环境里去部署网站，那就无疑用这个方法，先顶上，后边再慢慢添加新的骚操作功能。

### 方案二步骤

#### 编写个人网站的 Dockerfile

Dockerfile 文件内容如下：

```dockerfile
FROM nginx:alpine
COPY ./static /usr/share/nginx/html
```

#### 将个人网站打包成镜像

打包镜像命令如下：

```bash
docker build -t html-server-image:v1 .
```

然后直接用这个命令，注意开放服务器端口 80，即可正常运行网站，运行命令如下：

```bash
docker run -d -p 80:80 html-server-image:v1
```

## 第三种方案：APISIX 云原生网关部署

### 第三种部署方式：APISIX 云原生网关部署

推荐指数：四颗星

好啦好啦，上面讲的这些，绝对是不可能让你跟我一样，完全搭建出我的[网站](http://cheverjohn.me/)的。接下来输出干货。

#### 我的网站的整体部署架构

![myPersonalWebsiteArch2](/Users/cheverjohn/Workspace/Opensource/github.com/Chever-John/cheverjohn.me/assets/excalidraw/myPersonalWebsiteArch3.png)

简单用言语介绍一下，这一次我尝试使用了 Apache APISIX 云原生网关来部署我的个人网站。这里边 Apache APISIX、Apache Dashboard、etcd、html-server 都是 Docker 镜像运行的容器。其中 html-server 是我自己自定义创建的镜像容器。其构建的方法可以往上看。

#### 构建后端服务镜像（html-server）

首先 clone 我存放在 GitHub 上的项目。

```bash
git clone git@github.com:Chever-John/SimpleWebsite.git
```

然后进入到仓库里。

```bash
cd SimpleWebsite
```

查看 Dockerfile 文件确认无误。

```bash
cat Dockerfile
<<<!Output>>>
FROM nginx:alpine
COPY ./static /usr/share/nginx/html
```

确认无误后运行镜像构建命令。

```bash
docker build -t html-server-image:v1 .
```

此处，我可以随意改变镜像的版本，比如我想构建 v2 版本的镜像，那么命令就是：

```sh
docker build -t html-server-image:v2 .
```

#### 安装 APISIX、APISIX Dashboard

官方自带的 APISIX-Docker 项目，我这边直接复制过来了其中 example 的文件夹，并将该文件夹魔改了一下放在本项目的根目录下。其中魔改的部分，这边做一下解释。

##### 魔改内容：修改 APISIX 服务端口

clone 官方提供的 APISIX-Docker 项目。

```bash
git clone git@github.com:apache/apisix-docker.git
```

然后进入到 example 的目录里。

```bash
cd apisix-docker/example
```

由于这边我需要修改 APISIX 这个网关的默认服务端口，从 9080 改到 80，所以我们需要修改一下 docker-compose.yml 文件。并将该文件的主要部分，包含 APISIX、Dashboard 等项目的 Services 复制到本项目根目录的 Dockerfile。

这中间的改动如图所示：

![9080to80](/Users/cheverjohn/Workspace/Opensource/github.com/Chever-John/cheverjohn.me/assets/ScreenCut/9080to80.png)

可以看见，只是将原先的 `9080:9080` 改为 `80:9080`，~~仅此而已~~。

##### 魔改内容：修改网络配置（重点🌟）

不，此处还需要加一个网络配置。因为我本次项目涉及到的软件主要分为两大部分，第一部分是 APISIX 及其衍生项目，第二部分是个人网站项目。而我的 Dockerfile 中间，分别为两个项目配置了不同的网络。如下面的文件演示：

```yml
networks:
  website:
    driver: bridge
  apisix:
    driver: bridge
```

上面的配置，表示我在 Docker 种创建了两个网络。

```yml
services:
  webservice81:
    image: html-server-image:${TAG}
    restart: always
    ports:
      - "81:80/tcp"
    networks:
      website:

  webservice82:
    image: html-server-image:${TAG}
    restart: always
    ports:
      - "82:80/tcp"
    networks:
      website:
```

上面是我个人网站项目的部署文件，可以看到 networks 设置为 website。

```yml
 apisix-dashboard:
    image: apache/apisix-dashboard:2.13-alpine
    restart: always
    volumes:
    - ./apisix_config/dashboard_conf/conf.yaml:/usr/local/apisix-dashboard/conf/conf.yaml
    ports:
    - "9000:9000"
    networks:
      apisix:

  apisix:
    image: apache/apisix:2.14.1-alpine
    restart: always
    volumes:
      - ./apisix_config/apisix_log:/usr/local/apisix/logs
      - ./apisix_config/apisix_conf/config.yaml:/usr/local/apisix/conf/config.yaml:ro
    depends_on:
      - etcd
    ##network_mode: host
    ports:
      - "80:9080/tcp"
      - "9091:9091/tcp"
      - "9443:9443/tcp"
      - "9092:9092/tcp"
    networks:
      - apisix
      - website
```

重头戏来了，这边可以看到，我 APISIX 及其衍生项目的 networks 都设置为 apisix。但是我的 APISIX 额外被设置了 website 的网络。这个设置就意味着让 APISIX 同时处于 Docker 中的两个网络配置中。这样，我的 APISIX 就能既能被 apisix 网络中的 dashboard 进行配置，也能代理上游的 website 网络中的个人网站项目服务。

#### 运行项目

因为我的项目需要版本。所以我们需要先打一个环境变量，让我的 Dockerfile 能够读取到我的环境变量。命令如下：

```sh
export TAG=v2
```

然后构建我的后端服务镜像，命令如下：

```sh
docker build -t html-server-image:v2 .
```

修改完之后，开始运行容器，运行命令的位置应该是在 Dockerfile 文件所在的目录下，命令如下：

```bash
docker-compose -p docker-apisix up -d
```

#### 配置 Grafana（可选项）

这个需要额外配置，需要修改一下 `apisix-docker/example/dashboard_conf/conf.yaml` 文件。具体修改部分参照下图：

![enableGrafana](/Users/cheverjohn/Workspace/Opensource/github.com/Chever-John/cheverjohn.me/assets/ScreenCut/enableGrafana.png)

然后 APISIX-Dashboard 就可以正常显示了。

此处注意，frame-src 后边要设置好正确的域名地址，此处是 198.13.62.15，如果你买了新的服务器，它会提供这个地址给你。对，就是 IPv4 地址。

#### 然后配置上游

```json
 {
  "nodes": [
    {
      "host": "webservice83",
      "port": 80,
      "weight": 1
    },
    {
      "host": "webservice84",
      "port": 80,
      "weight": 1
    },
    {
      "host": "webservice81",
      "port": 80,
      "weight": 1
    },
    {
      "host": "webservice82",
      "port": 80,
      "weight": 1
    }
  ],
  "timeout": {
    "connect": 6,
    "send": 6,
    "read": 6
  },
  "type": "roundrobin",
  "scheme": "http",
  "pass_host": "pass",
  "name": "websiteUpstream",
  "keepalive_pool": {
    "idle_timeout": 60,
    "requests": 1000,
    "size": 320
  }
}
```

#### 配置路由

```json
{
  "uri": "/*",
  "name": "websiteRoute",
  "methods": [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "HEAD",
    "OPTIONS",
    "CONNECT",
    "TRACE"
  ],
  "hosts": [
    "*.cheverjohn.me",
    "www.cheverjohn.me",
    "cheverjohn.me"
  ],
  "upstream_id": "429171766888235719",
  "status": 1
}
```

然后一切应该就正常了。

## 版本迭代更新

这部分讲的是，如何为网站进行版本的迭代更新。

### docker-compose（部分内容可能废弃⚠️）

如果我更新了网站的内容，比如说我增加了一篇博客，那我们需要进行网站系统的版本迭代更新啊，这里边有很多学问，蓝绿发布啦、金丝雀发布啦、灰度啦，有一说一我对此不精通，纯粹是大概知道有这么些概念，但我网站目前采用的只会是最简单的“停止”到“重启”。

我们可以使用 docker-compose 来进行版本的快速迭代更新。

docker-compose 文件位于该[目录](.docker-compose.yaml)

第一步：首先制定版本，命令如下：

```bash
export TAG=x.x.x
```

第二步：部署，部署命令如下：

```bash
docker-compose -p website up -d --build
```

第三步（可选）：如果已经部署了，需要先停止容器，命令如下：

```bash
docker-compose -p website down
```

然后可以重复第二步了。
