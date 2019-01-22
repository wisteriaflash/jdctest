# package.json  [参见](https://docs.npmjs.com/files/package.json)

## name
在package.json中，最重要的就是 `name` 和 `version` 字段。他们都是必须的，如果没有就无法`install`。

`name` 和 `version` 一起组成的标识在假设中是唯一的。改变包应该同时改变 `version`。

 * 不要把node或者js放在名字中。因为你写了package.json它就被假定成为了js，不过你可以用"engine"字段指定一个引擎。
 * 这个名字会作为在URL的一部分、命令行的参数或者文件夹的名字。任何non-url-safe的字符都是不能用的。
 * 这个名字可能会作为参数被传入require()，所以它应该比较短，但也要意义清晰。
 * 在你爱上你的名字之前，你可能要去 [`npm registry`](http://registry.npmjs.org/) 查看一下这个名字是否已经被使用了。

 ## version
 在package.json中，最重要的就是 `name` 和 `version` 字段。他们都是必须的，如果没有就无法`install`。

`name` 和 `version` 一起组成的标识在假设中是唯一的。改变包应该同时改变 `version`。

* version必须能被 [`node-semver`](https://github.com/npm/node-semver) 解析，它被包在npm的依赖中。

## description
简介，字符串。方便在`npm search`中搜索。

## keywords
关键字，数组、字符串。方便在`npm search`中搜索。

## homepage
项目官网的url。

## bugs
你项目的提交问题的url和（或）邮件地址。这对遇到问题的屌丝很有帮助。

```
{ "url" : "http://github.com/owner/project/issues"
, "email" : "project@hostname.com"
}
```
## license
你应该要指定一个许可证，让人知道使用的权利和限制的。

最简单的方法是，假如你用一个像BSD或者MIT这样通用的许可证，就只需要指定一个许可证的名字，像这样：

```
{ "license" : "MIT" }
```

## people fields: author, contributors
author是一个人。contributors是一堆人的数组。person是一个有name字段，可选的有url、email字段的对象，像这样：
```
{ "name" : "Barney Rubble"
, "email" : "b@rubble.com"
, "url" : "http://barnyrubble.tumblr.com/"
}
```
或者可以把所有的东西都放到一个字符串里，npm会给你解析：

```
"Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)
```

## files
files是一个包含项目中的文件的数组。如果命名了一个文件夹，那也会包含文件夹中的文件。（除非被其他条件忽略了）

你也可以提供一个.npmignore文件，让即使被包含在files字段中的文件也不被留下。其实就像.gitignore一样。

> 可以这样理解，files是npm发布的白名单目录，.npmignore是npm发布的黑名单目录

## main
main字段配置一个文件名指向模块的入口程序。如果你包的名字叫 `foo`，然后用户 `require("foo")`，main配置的模块的exports对象会被返回。

这应该是一个相对于根目录的文件路径。

## bin
很多包都有一个或多个可执行的文件希望被放到PATH中。实际上，就是这个功能让npm可执行的。

要用这个功能，给package.json中的`bin`字段一个命令名到文件位置的map。初始化的时候npm会将他链接到`prefix/bin`（全局初始化）或者`./node_modules/.bin/`（本地初始化）。

比如，npm有：
```
{ "bin" : { "npm" : "./cli.js" } }
```

所以，当你初始化npm，它会创建一个符号链接到cli.js脚本到/usr/local/bin/npm。

如果你只有一个可执行文件，并且名字和包名一样。那么你可以只用一个字符串，比如：

```
{ "name": "my-program"
, "version": "1.2.5"
, "bin": "./path/to/program" }
```
结果和这个一样：

```
{ "name": "my-program"
, "version": "1.2.5"
, "bin" : { "my-program" : "./path/to/program" } }
```

## repository
指定你的代码存放的地方。这个对希望贡献的人有帮助。如果git仓库在github上，那么npm docs命令能找到你。

```
"repository" :
  { "type" : "git"
  , "url" : "http://github.com/isaacs/npm.git"
  }

"repository" :
  { "type" : "svn"
  , "url" : "http://v8.googlecode.com/svn/trunk/"
  }
```

URL应该是公开的（即便是只读的）能直接被未经过修改的版本控制程序处理的url。

## scripts - [参见](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)
`scripts` 是一个由脚本命令组成的hash对象，他们在包不同的生命周期中被执行。key是生命周期事件，value是要运行的命令。

## dependencies
依赖是给一组包名指定版本范围的一个hash。这个版本范围是一个由一个或多个空格分隔的字符串。依赖还可以用tarball或者git URL。

> 请不要将测试或过渡性的依赖放在dependencieshash中。

* version 必须完全和version一致
* `>version`必须比version大
* `>=version`同上
* `<version` 必须比version小
* `<=version` 同上
* ~version 大约一样
* 1.2.x 1.2.0, 1.2.1, 等，但不包括1.3.0
* `*` 所有
* "" 空，同 `*`
* version1 - version2 同 >=version1 <=version2.
* range1 || range2 二选一。

## devDependencies
如果有人要使用你的模块，那么他们可能不需要你开发使用的外部测试或者文档框架。

在这种情况下，最好将这些附属的项目列在 `devDependencies` 中。

对于非特定平台的构建步骤，比如需要编译CoffeeScript，可以用`prepublish` 脚本去实现，并把它依赖的包放在devDependency中。
>注：`prepublish` 定义了在执行 `npm publish` 的时候先行执行的脚本

`prepublish` 脚本会在`publishing` 前运行，这样用户就不用自己去require来编译就能使用。并且在开发模式中（比如本地运行npm install）会运行这个脚本以便更好地测试。

## peerDependencies
在一些场景中，如在一个host中不必须进行 `require` 时候，你想表现你的package与一个host工具或者库的兼容关键。这一般用来引用插件。尤其是你的模块可能要暴露一个特定的接口，并由host文档来预期和指定。


## 依赖URL
可以指定一个tarball URL，这个tarball将在包被初始化的时候下载并初始化。