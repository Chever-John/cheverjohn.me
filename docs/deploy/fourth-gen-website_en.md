# Fourth Generation Website Deployment Plan

My fourth-generation website was a result of my impulsive decision. In 2022, I used HTML, CSS, and JS technologies to build the website, purely out of frustration. Currently, the website has been archived in a [subdirectory](https://github.com/Chever-John/cheverjohn.me/tree/main/old-website-styles).

Now, let's talk about my overall deployment strategy.

We won't discuss purchasing a server and domain name. Instead, let's focus on the deployment options. I will introduce three deployment options: Nginx + server deployment, Docker containerization deployment, and Apisix + server deployment.

## First: NGINX Configuration

Buy server and install Nginx.

Accommodation: ★★

Use **NGINX** as a reverse proxy server to reverse proxy the route to index.html and that's it. You can refer to this [link](https://www.vultr.com/zh/docs/how-to-install-and-configure-nginx-on-a-vultr-cloud-server/#:~:text=Encrypt%20guide%20here.-,Configure%20Nginx%20as%20a%20Reverse%20Proxy,-Nginx%20can%20work)for more information.

Run the following command to view my configuration.

```bash
cat /etc/nginx/conf.d/cheverjohn.me.conf
```

The configuration of my **NGINX** is as follows.

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

## Second: Docker

Install docker.

Accommodation: ★★★★

这其实是我最推荐的，如果你刚刚在一个新的环境里去部署网站，那就无疑用这个方法，先顶上，后边再慢慢添加新的骚操作功能。

### Steps

Some steps.

#### Step1: create Dockerfile

File content as following:

```dockerfile
FROM nginx:alpine
COPY ./static /usr/share/nginx/html
```

#### Step2: build image

Command as following:

```bash
docker build -t html-server-image:v1 .
```

Run it:

```bash
docker run -d -p 80:80 html-server-image:v1
```

## Third: API Gateway Deployment(Simple description of the method)

Accommodation: ★★★★

### Write the Dockerfile of static file

The content of Dockerfile as follows:

```dockerfile
FROM nginx:alpine
COPY ./static /usr/share/nginx/html
```

#### Build the images with the Dockerfile

Build command as follows:

```bash
docker build -t html-server-image:v1 .
```

Then run a container with the image build as the last command.

```bash
docker run -d -p 81:80 html-server-image:v1
```

```bash
docker run -d -p 82:80 html-server-image:v1
```

```bash
docker run -d -p 83:80 html-server-image:v1
```

```bash
docker run -d -p 84:80 html-server-image:v1
```

#### Install APISIX

You can refer to the Official website of Apache APISIX.

### :star2:A method that can absolutely reproducible deploy

What I can guarantee is that I can complete the deployment of the site according to the deployment method in this subsection.

#### Deployment architecture diagram of my personal website

![myPersonalWebsiteArch2](/Users/cheverjohn/Workspace/Opensource/github.com/Chever-John/cheverjohn.me/assets/excalidraw/myPersonalWebsiteArch3.png)

To briefly introduce in words, this time I tried to use Apache APISIX cloud-native gateway to deploy my personal website. Here Apache APISIX, Apache Dashboard, etcd, and html-server are all containers for Docker images to run. Among them, html-server is my own custom-created mirror container. The way to build it can be seen above.

#### Build the image

The Image is needed to build the API gateway upstream service deployment.

First clone this project from GitHub.

```bash
git clone git@github.com:Chever-John/SimpleWebsite.git
```

Then go into the repository.

```bash
cd SimpleWebsite
```

You must confirm that the Dockerfile is right.

```bash
cat Dockerfile
<<<!Output>>>
FROM nginx:alpine
COPY ./static /usr/share/nginx/html
```

Then build the image.

```bash
docker build -t html-server-image:v1 .
```

Then run a container with the image build as the last command.

```bash
docker run -d -p 81:80 html-server-image:v1
```

```bash
docker run -d -p 82:80 html-server-image:v1
```

```bash
docker run -d -p 83:80 html-server-image:v1
```

```bash
docker run -d -p 84:80 html-server-image:v1
```

#### Install APISIX/APISIX Dashboard

First clone the project from the Official GitHub repository.

```bash
git clone git@github.com:apache/apisix-docker.git
```

Then go into the directory.

```bash
cd apisix-docker/example
```

Since I need to change the default service port of the APISIX gateway from `9080` to `80`, we need to modify the `docker-compose.yml` file.

The intermediate changes are shown in the figure below.

![9080to80](/Users/cheverjohn/Workspace/Opensource/github.com/Chever-John/cheverjohn.me/assets/ScreenCut/9080to80.png)

As you can see, the original `9080:9080` is changed to `80:9080`, that's all.

After the modification, start running the container, the location of the run command should be in the directory where the Dockerfile file is located, the command is as follows.

```bash
docker-compose -p docker-apisix up -d
```

#### Configure Grafana(Optional)

This requires additional configuration and requires modifying the `apisix-docker/example/dashboard_conf/conf.yaml` file. Refer to the following figure for the specific changes.

![enableGrafana](/Users/cheverjohn/Workspace/Opensource/github.com/Chever-John/cheverjohn.me/assets/ScreenCut/enableGrafana.png)

Then everything is OK.

#### Configure Upstream of API Gateway

```json
{
  "nodes": [
    {
      "host": "xxx.xxx.xxx.xxx",
      "port": 81,
      "weight": 1
    },
    {
      "host": "xxx.xxx.xxx.xxx",
      "port": 82,
      "weight": 1
    },
    {
      "host": "xxx.xxx.xxx.xxx",
      "port": 83,
      "weight": 1
    },
    {
      "host": "xxx.xxx.xxx.xxx",
      "port": 84,
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

#### Configure Route of API Gateway

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
  "upstream_id": "418814452935164940",
  "status": 1
}
```

Then everything is OK.

## Version Updates

### docker-compose

If I update the site's content, for example, I added a blog, then we need to carry out the version of the site system iterative update ah. There is a lot of learning here, blue and green release la, canary release la, grayscale la, one said an I am not proficient in this, purely probably know that there are some of these concepts, but my site currently will only be the most straightforward "stop " to "restart".

We can use docker-compose to do quick iterative version updates.

The docker-compose file is located in this [directory] (.docker-compose.yaml)

Step 1: First, make a version with the following command.

```bash
export TAG=x.x.x
```

Step 2: Deploy. The deployment command is as follows.

```bash
docker-compose -p website up -d --build
```

Step 3 (optional): If you have already deployed, you must stop the container with the following command.

```bash
docker-compose -p website down
```

Then you can repeat the second step.
