# CheverJohn's website

"I have the Chinese version, which you can find at this [URL](./README-zh.md)."

## Background

People who know me well would know that I've had several personal websites. The one that lasted the longest was probably the [previous one](https://www.cheverjohn.xyz/), which I built using Docusaurus. It held up for over six months. I consider myself someone who truly enjoys putting thoughts into words. I like sharing what I've learned, constantly engaging with others, and exploring various things, not just limited to technology. So, this is the essence of having a personal website for me. Oh, by the way, the website is Still accessible ✅. It's just that I no longer actively maintain it. Its continued operation is all thanks to the amazing Vercel!

## Personal Official Website History Museum

My experience in building personal websites has followed a diverse technical journey as detailed below:

| Time                  | Domain             | Technology Stack                          | General Purpose                                              | Status       |
| --------------------- | ------------------ | ----------------------------------------- | ------------------------------------------------------------ | ------------ |
| 2020.02-2020.06       | mr8god.cn          | hexo/travi ci/GitHub action               | Writing technical articles, understanding the importance of CI tools. | No longer accessible ❌ |
| 2020.07 ～ 2021.06    | mr8god.cn          | Python / Django / Supervisor / CICD / Vue | This was an extensive project where I accomplished **front-end and back-end separation**, **CICD**, and built a **blog community system** among many other exciting things. | No longer accessible ❌ |
| 2021.10 ～ 2022.06    | cheverjohn.xyz     | Docusaurus / React /vercel                | Utilizing an **open-source project Docusaurus** from **meta**. While commonly used in open-source communities for documentation, I found it sufficient for my personal blog. Even though I prefer more self-defined formatting, even if each blog post ends up with a different format. | Still accessible ✅ |
| 2022.07.17 ～ 2023.08 | cheverjohn.me      | Html / nginx / js / query                 | "Time to make a big move!" (responding after a long time)—I couldn't keep going. It turns out that writing pure HTML and CSS is so tiring, it's like doing repetitive work all the time. I'd rather use a renderer to render Markdown. That's why I ended up not maintaining this website! | No longer accessible ❌ |
| 2023.09.18 ~ now      | blog.cheverjohn.me | Vercel / Next.js                          | The style of this blog is inspired by a Vercel "coder" named [Healeycodes](https://healeycodes.com/about). I am grateful to him. Moving forward, I plan to focus on content related to both English and technical abilities. Later on, I intend to add a button to the website for switching between Chinese and English. | Still accessible ✅ |

In short, I have high hopes for the latest blog. It always needs someone to tinker a bit, doesn't it~

## TODO

### Website Main Plan

I have outlined the following plans for [blog.cheverjohn.me](http://blog.cheverjohn.me/):

| Feature                                                      | Planned Time | Completion Time |
| ------------------------------------------------------------ | ------------ | --------------- |
| Add tag functionality, allowing articles to be tagged and filtered by tags on the article page. | 9.23 ~ 9.24  |                 |
| Implement the ability to switch between Chinese and English for articles, requiring comprehensive analysis to determine how to best execute this feature. For now, I will focus on accumulating technical content. |              |                 |

### Cloud-Native

- [x] Docker Deployment: Packaging the front-end project and deploying it as a Docker image.
- [ ] Try cluster deployment based on the completion of the front-end tasks.

#### API Gateway Selection

- [x] Explore the feasibility of and need for API gateways.

### Font-end

- [x] Unify the html style of the blog.
- [x] Go ~~ pit ~~ Kun Kun, let Kun Kun help me to get the front-end style architecture.

### O&M

#### CICD

- [x] Setup automatic deployment so that whenever I push local code, the deployment server automatically pulls the code.
  - [x] Select CI tool.
    - [x] Chose Vercel
  - [x] Implement on the cloud server.
    - [x] Chose Vercel

#### Grayscale Release / Canary Release

- [ ] As the subheading, to do a good **grayscale release** with Nginx.
