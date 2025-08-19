---
layout: doc
outline:
  level: 7
---

# 快速开始指南

本指南将帮助你在几分钟内启动并运行一个简单的项目，无论你是初学者还是有经验的开发者。

## 环境要求

在开始之前，请确保你的本地环境已满足以下要求：

* Node.js >= 18
* npm 或 yarn
* 推荐使用 VS Code 作为编辑器

## 步骤一：初始化项目

在命令行中运行以下命令以创建一个新项目目录：

```bash
mkdir my-project
cd my-project
npm init -y
```

你也可以使用 `pnpm` 或 `yarn`，根据你个人习惯选择。

## 步骤二：安装依赖

我们以 Vite 为例进行快速启动：

```bash
npm install vite --save-dev
```

添加一个简单的启动脚本到 `package.json` 中：

```json
"scripts": {
  "dev": "vite"
}
```

## 步骤三：创建基础结构

创建一个简单的 HTML 和 JS 文件：

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hello Vite</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

**main.js**

```js
console.log('Welcome to your new project!');
```

## 步骤四：启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:5173]() 即可看到效果。

## 后续建议

* 使用 TypeScript 替代 JavaScript
* 添加 Eslint 和 Prettier 保持代码风格一致
* 配置 Git 与 GitHub 进行版本管理

