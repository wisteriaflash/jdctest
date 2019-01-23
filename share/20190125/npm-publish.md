# npm发布

## 提示
npm发布依赖[package.json](package.json.md)，请确保package.json中内容正确，否则即使npm发布，亦无法使用。

> 下面以模块名 `demo` 为例

## 新发布模块

写好一个模块，一切都就绪后，可以考虑发布到 npm 上了，可以通过以下步骤完成一个模块的新发布：

```
# 1. 初始化包的描述文件（其实是生成  package.json，如果已有这个文件，可跳过该步骤）
$ npm init --save

# 2. 验证账号
$ npm adduser

3. 发布
$ npm publish
```
以上，即可完成一个新包的发布了。

## 管理包权限
很多时候，一个模块往往不只是你一个人在管理的，这时需要给其他一起维护的同学开通发布的权限，如下：
```
# 查看模块 owner
$ npm owner ls demo

# 添加一个发布者
$ npm owner add xxx@yyy.com demo

# 删除一个发布者
$ npm owner rm xxx@yyy.com demo
```

## 更新版本
当模块有更新的时候，需要发布一个新版本，当所有需要更新的文件都`commit`完了后，就可以更新到`npm`了。

### 1. 发布一个新的稳定版本
```
# 更新版本号（major | minor | patch | premajor | preminor | prepatch | prerelease）
# 大版本并且不向下兼容时，使用 major
# 有新功能且向下兼容时，使用 major
# 修复一些问题、优化等，使用 patch
# 下面比如更新一个 patch 小版本号

$ npm version patch
$ npm publish
```

### 2. 预发布版本
很多时候一些新改动，并不能直接发布到稳定版本上（稳定版本的意思就是使用 npm install demo 即可下载的最新版本），这时可以发布一个 “预发布版本“，不会影响到稳定版本。

```
# 发布一个 prelease 版本，tag=beta
$ npm version prerelease
$ npm publish --tag beta
```
比如原来的版本号是`1.0.1`，那么以上发布后的版本是`1.0.1-0`，用户可以通过`npm install demo@beta` 或者 `npm install demo@1.0.1-0`来安装。

### 3.当 prerelease 版本稳定之后，可以把它设置为稳定版本
```
# 首先可以查看当前所有的最新版本，包括 prerelease 与稳定版本
$ npm dist-tag ls

# 设置 1.0.1-1 版本为稳定版本
$ npm dist-tag add demo@1.0.1-1 latest

# 或者通过 tag 来设置
$ npm dist-tag add demo@beta latest
```

> 当发现 BUG，也可以通过 `npm dist-tag` 命令回退。

这时候，latest 稳定版本已经是 `1.0.1-1` 了，用户可以直接通过 `npm install demo` 即可安装该版本。

## 查看模块的版本信息
可以通过 `npm info` 或者 `npm view` 来查看模块的详细信息。
```
$ npm info
```

# jnpm - [文档](http://npm.m.jd.com/)
## 重要提示
jnpm 用户名和密码跟erp无关联。

## publish
```
$ jnpm publish @jd/[name]
```
如果出现错误代码："ERR! code ENEEDAUTH" ， 错误消息: "ERR! need auth auth required for publishing", 那么请使用 `jnpm adduser` 或者 `jnpm login` 来为 publish 操作授权.

```
jnpm adduser --registry=http://registry.m.jd.com --scope=@jd
```
或者

```
jnpm login --registry=http://registry.m.jd.com --scope=@jd
```

