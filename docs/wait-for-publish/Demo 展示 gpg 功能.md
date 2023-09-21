# Demo: 展示 gpg 功能

本篇文章主要是在实践，然后会简单介绍一下原理。

整篇文章，前期会讲一个**简单原理**，然后会从**如何创建 gpg 密钥**、**如何管理自己的密钥（管理密钥相关命令）**、**实战：使用自己创建的 gpg 密钥去解密传输的加密文件**三个部分开始讲完整个文章。

## 原理简介

使用 GPG Encrypting and decrypting doc 的原理其实就像文档中的一段话，如下

> The procedure for encrypting and decrypting documents is straightforward with this mental model. If you want to encrypt a message to Alice, you encrypt it using Alice's public key, and she decrypts it with her private key. If Alice wants to send you a message, she encrypts it using your public key, and you decrypt it with your key.

整个过程就是，我拿我的私钥加密我想要发给你的文件。然后你拿我的公钥，解密我想要发给你的，但是被我加密的文件。

这么一个过程。

这篇文章主要就是，简单快速过一下 gpg 是如何加密文档内容的。

本篇文章分为两部分，首先是创建一个可用的 gpg 密钥。

## 如何创建 gpg 密钥

```shell
[Se] gpg --list-keys
gpg: checking the trustdb
gpg: no ultimately trusted keys found
```

首先 list 一下我的机器当前是否有个 gpg key。可以看到是没有的，此处主要是指有没有 gpg public key。同样看看 private key。

```shell
[Se] gpg --list-secret-keys
[Se]
```

啥也没有。

### 一个命令搞定一切

开始创建。

详细步骤从一个 `gpg --full-generate-key` 开始，命令如下：

```shell
[Se] gpg --full-generate-key
gpg (GnuPG) 2.4.0; Copyright (C) 2021 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (9) ECC (sign and encrypt) *default*
  (10) ECC (sign only)
  (14) Existing key from card
Your selection? 1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 0
Key does not expire at all
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: Chenwei Jiang
Email address: cheverjonathan@gmail.com
Comment: Used for learning
You selected this USER-ID:
    "Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

gpg: revocation certificate stored as '/home/cheverjohn/.gnupg/openpgp-revocs.d/D1DED33E8FE9CA4B315A488968CC99424BF9EF81.rev'
public and secret key created and signed.

pub   rsa4096 2023-09-19 [SC]
      D1DED33E8FE9CA4B315A488968CC99424BF9EF81
uid                      Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com>
sub   rsa4096 2023-09-19 [E]
```

### 详细分阶段解释一下命令

想了想，还是需要简单分全阶段讲一下发生了什么。

#### 第一阶段：选择加密签名用算法

第一阶段，可以看到需要你选择加密算法。而我选择了 1，这表示加密和签名都适用了 RSA 算法。

```shell
[Se] gpg --full-generate-key
gpg (GnuPG) 2.4.0; Copyright (C) 2021 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (9) ECC (sign and encrypt) *default*
  (10) ECC (sign only)
  (14) Existing key from card
Your selection? 1
```

哦对了，还有一段版权声明。

#### 第二阶段：选择密钥的长度

密钥越长越安全，我这边选择了 4096。

```shell
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072) 4096
Requested keysize is 4096 bits
```

#### 第三阶段：设定密钥的有效期

设定有效期。

```shell
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 0
Key does not expire at all
Is this correct? (y/N) y
```

这边演示的话，配置了 `Key does not expire at all`。

#### 第四阶段：个人信息

这一部分会最终用来生成你的 user id。

```shell
GnuPG needs to construct a user ID to identify your key.

Real name: Chenwei Jiang
Email address: cheverjonathan@gmail.com
Comment: Used for learning
You selected this USER-ID:
    "Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
```

这边我设置了我的 `Real name` 为 “Chenwei Jiang”，我的 `Email address` 为 “cheverjonathan@gmail.com“。以及一个 `comment`。这些都是我常用的一些基本信息，此处主要就是用来演示。

得到的结果 —— 一个 USER-ID 为     "Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com>"。

## 如何管理自己的密钥（管理密钥相关命令）

这边讲了我该如何在一台宿主机上，管理我的很多密钥呢。

### 列出密钥

列出密钥分两种，一种是公钥，一种是私钥。

```shell
[Se] gpg --list-keys
gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
/home/cheverjohn/.gnupg/pubring.kbx
-----------------------------------
pub   rsa4096 2023-09-19 [SC]
      D1DED33E8FE9CA4B315A488968CC99424BF9EF81
uid           [ultimate] Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com>
sub   rsa4096 2023-09-19 [E]
```

上面的命令显示了。

其中仔细的部分。

```shell
/home/cheverjohn/.gnupg/pubring.kbx
-----------------------------------
pub   rsa4096 2023-09-19 [SC]
      D1DED33E8FE9CA4B315A488968CC99424BF9EF81
uid           [ultimate] Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com>
sub   rsa4096 2023-09-19 [E]
```

其中第一行，显示公钥文件名。

| 值                                                           | 解释                                                     |      |
| ------------------------------------------------------------ | -------------------------------------------------------- | ---- |
| /home/cheverjohn/.gnupg/pubring.kbx                          | 第一行显示公钥文件名（pubring.kbx）                      |      |
| pub   rsa4096 2023-09-19 [SC]<br/>      D1DED33E8FE9CA4B315A488968CC99424BF9EF81 | 第二行显示公钥特性（4096 位，Hash 字符串以及生成的时间。 |      |
| uid           [ultimate] Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com> | 第三行显示“用户 ID”。                                    |      |
| sub   rsa4096 2023-09-19 [E]                                 | 第四行显示私钥特征。                                     |      |

### 输出密钥

公钥文件位于 `~/.gnupg/pubring.kbx` 以二进制形式存储，使用 armor 参数可以将其转换为 ASCII 码显示。

使用命令，展示输出为 `public-key.txt` 和 `private-key.txt`，命令如下：

```shell
[gpg] pwd
/home/cheverjohn/Se/gpg
[gpg] ls
[gpg] ls -la
total 0
drwxr-xr-x. 1 cheverjohn cheverjohn  0 Sep 19 23:36 .
drwxr-xr-x. 1 cheverjohn cheverjohn 34 Sep 19 23:36 ..
[gpg] gpg --armor --output public-key.txt --export 'Chenwei Jiang (used for learning) <cheverjonathan@gmail.com>'
[gpg] ls
public-key.txt
[gpg] cat public-key.txt
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBGUJt+QBEADAzoLPAdK8GfJ/5Ouxh2rOrMsClMmoOznMm2GOBcqSaQsdmP4G
................................................................
oM3YFFujtMxK/cQ/KkbmwAtlMkWx5x8RT/dJ
=NMtR
-----END PGP PUBLIC KEY BLOCK-----
[gpg]
```

如上图所示，这是展示 `public-key.txt` 的步骤，详细命令如下：

```shell
gpg --armor --output public-key.txt --export 'Chenwei Jiang (used for learning) <cheverjonathan@gmail.com>'
```

下面是展示 `private-key.txt` 的步骤，详细步骤如下：

```shell
[gpg] ls
public-key.txt
[gpg] gpg --armor --output private-key.txt --export-secret-keys
[gpg] ls
private-key.txt  public-key.txt
[gpg]
```

其中如果之前设置了密码的话，这个操作是需要密码的，需要密码的命令如下：

```shell
gpg --armor --output private-key.txt --export-secret-keys
```

### 上传公钥

公钥服务器是网络上专门存储用户公钥的服务器。`--send-keys` 子命令可以实现。

公钥服务器没有检查机制，任何人都可以用你的名义上传公钥，所以没法保证服务器上的公钥的可靠性。

一般我们在自己的网站上公布一个公钥指纹，用来让别人核对下载的公钥是否为真。`--fingerprint` 子命令可以生成公钥指纹。

## 实战/实践出真知

这一部分我将按照导出公钥，使用私钥加密，在另外一台设备上使用公钥进行解密。

此处我将展示如何加密一个内容为 “hello world” 的文件，然后在异地进行解密。

步骤，将分为加密、解密

详细步骤如下

1. 创建文件，命令如下：

   ```shell
   [gpg] touch demo.txt
   echo "hello world" > demo.txt
   [gpg] ls
   demo.txt  private-key.txt  public-key.txt
   [gpg] cat demo.txt
   hello world
   [gpg]
   ```

   其中，创建文件的命令如下，可复制直接使用：

   ```shell
   touch demo.txt
   echo "hello world" > demo.txt
   ```

   然后我们就得到了一个 demo.txt 文件，里边的内容就是 hello world。

2. 对该文件加密，加密过程如下：

   ```shell
   [gpg] ls
   demo.txt  private-key.txt  public-key.txt
   [gpg] gpg --recipient 'cheverjonathan@gmail.com' --output demo.gpg --encrypt demo.txt
   [gpg] ls
   demo.gpg  demo.txt  private-key.txt  public-key.txt
   [gpg] cat demo.gpg
   �
   ..............
   �&5p�.�)I�槹iQ%
   [gpg]
   ```

   加密命令如下：

   ```shell
   gpg --recipient 'cheverjonathan@gmail.com' --output demo.gpg --encrypt demo.txt
   ```

   这边可以看到 demo.gpg 文件就是已经加密好之后的文件。

3. 对该文件解密，解密过程如下：

   ```shell
   [gpg] gpg --output demo --decrypt demo.gpg
   gpg: encrypted with rsa4096 key, ID 13C117D5FEC4F051, created 2023-09-19
         "Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com>"
   [gpg] ls
   demo  demo.gpg  demo.txt  private-key.txt  public-key.txt
   [gpg] cat demo
   hello world
   [gpg]
   ```

   解密命令如下：

   ```shell
   gpg --output demo --decrypt demo.gpg
   ```

   输入这行命令之后，需要输入之前的密码，然后就能得到文件。

   上面主要是在本机上使用本地的密钥加密文件，并在本地解密的过程。

   接下来开始，
   
   ### 在其他电脑上获取到文件并解密
   
   其实整个过程在官方网站上的文档里讲的很清楚，我现在要睡觉了，就不写啦～明早再写。
   
   其实上面出现的文件是 demo.gpg 文件，
   
   首先我们将 public.txt 传到其他主机，这边你可以通过 GitHub 的功能将文件上下传，我这边省事，将上面过程得出的如下文件树：
   
   ```Shell
   cheverjohn@Dell-G33579 git:(doc/test-gpg*)% tree ~/workspace/Opensource/github.com/Chever-John/cheverjohn.me/docs/wait-for-publish/gpg
   .
   ├── demo
   ├── demo.gpg
   ├── demo.txt
   ├── private-key.txt
   └── public-key.txt
   ```
   
   中的 private-key.txt 删除后，将文件上传到 GitHub 上。
   
   
   
   https://www.gnupg.org/gph/en/manual/x110.html
   
   ```shell
   [wait-for-publish] gpg --output hello --decrypt hello.gpg                                                          git:(doc/test-gpg)
   gpg: encrypted with rsa4096 key, ID 13C117D5FEC4F051, created 2023-09-19
         "Chenwei Jiang (Used for learning) <cheverjonathan@gmail.com>"
   [wait-for-publish] ls                                                                                           git:(doc/test-gpg*)  ✱
   hello  hello.gpg
   [wait-for-publish] cat hello                                                                                    git:(doc/test-gpg*)  ✱
   hello world from macos
   [wait-for-publish]
   ```
   
   
   
   ## 相关文章
   
   - [gnupg.org 官方手册](https://www.gnupg.org/gph/en/manual/x110.html)