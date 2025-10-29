---
layout: page
---

# Markdown语法演示

## TOC

[[toc]]

## 基本语法

### 标题（Heading）

使用 `#` 在行首创建标题，数量代表标题级别（1~6 级）。  
也可以在文本下方使用 `=` 表示一级标题，`-` 表示二级标题。

#### 语法示例

# 标题一级
## 标题二级
### 标题三级
#### 标题四级
##### 标题五级
###### 标题六级

一级标题
================

二级标题
----------------

### 段落（Paragraph）

使用空行分隔文本来创建段落。  
不要在段落前添加空格或制表符。

#### 语法示例

我非常喜欢使用 Markdown。

我想从现在开始用它来格式化我所有的文档。

### 换行（Line Break）

在行末添加两个或多个空格并回车即可换行。  
也可使用 `<br>` 标签来实现换行。

#### 语法示例

这是第一行。  
这是第二行。

这是第三行。<br>
这是第四行。

### 强调（Emphasis）

使用星号 `*` 或下划线 `_` 为文本添加强调效果。  
一个符号表示斜体，两个表示粗体，三个表示粗斜体。

#### 语法示例

**粗体（Bold）**

我真的很喜欢 **粗体文字**。  
我真的很喜欢 __粗体文字__。  
爱**是**粗体。

*斜体（Italic）*

这段文字是 *斜体*。  
这段文字是 _斜体_。  
一只*猫*叫声。

***粗斜体（Bold + Italic）***

这段文字 ***非常重要***。  
这段文字 ___非常重要___。  
这段文字 **_非常重要_**。  
这段文字是 really***very***important text。

### 引用（Blockquote）

使用 `>` 在段落前创建引用。  
可包含多个段落、嵌套引用或其他 Markdown 元素。

#### 语法示例

> Dorothy followed her through many of the beautiful rooms in her castle.  
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

### 列表（List）

使用数字加句点创建有序列表，使用 `-`、`*` 或 `+` 创建无序列表。  
缩进可实现嵌套结构，列表项中可包含段落、引用、代码块或图片。

#### 有序列表示例

1. 第一项  
2. 第二项  
3. 第三项 
4. 第四项

#### 无序列表示例

- 第一项  
- 第二项  
- 第三项
- 第四项

### 代码（Code）

使用反引号 `` ` `` 包裹文本表示行内代码。  
使用缩进或围栏符号创建代码块。

#### 语法示例

在命令提示符中输入 `nano`。

``Use `code` in your Markdown file.``

### 分隔线（Horizontal Rule）

使用三条或以上的 `*`、`-` 或 `_` 创建分隔线。  
为了兼容性，分隔线前后应有空行。

#### 语法示例

***

---

___

### 链接（Link）

使用 `[文本](URL "title")` 创建超链接。  
可选 title 会在鼠标悬停时显示。  
也可用尖括号直接生成可点击的 URL 或 Email。  
支持加粗、斜体或代码格式化的链接文本。  
可使用引用式链接将 URL 与文本分离以提高可读性。

#### 语法示例

这是一个链接 [Markdown中文网](https://markdown.com.cn)。  

这是一个带 title 的链接 [Markdown中文网](https://markdown.com.cn "最好的Markdown教程")。  

直接显示 URL 或 Email：  
<https://markdown.com.cn>  
<fake@example.com>  

带格式化的链接：  
I love supporting the **[EFF](https://eff.org)**.  
This is the *[Markdown Guide](https://www.markdownguide.org)*.  
See the section on [`code`](#代码)。

引用类型链接示例：

[hobbit-hole][1]

[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"

### 图片（Image）

使用 `![alt文本](图片链接 "title")` 添加图片。  
可选 title 会在鼠标悬停时显示。  
图片也可以作为链接包裹在 `[ ]()` 中。

#### 语法示例

![Magic Gardens](/assets/mountain.jpg "Magic Gardens")  

[![Shiprock](/assets/mountain.jpg "Shiprock")](https://markdown.com.cn)

### 转义字符（Escaping Characters）

使用反斜杠 `\` 转义原本用于 Markdown 的特殊字符，使其作为普通字符显示。  
Markdown 会自动转义 `<` 和 `&` 符号，保证 HTML 渲染安全。

#### 语法示例

\* 这是一个带反斜杠的星号，不会变成列表符号。  

可转义字符示例：  
\\  `  *  _  { }  [ ]  ( )  #  +  -  .  !  |  

自动转义 HTML 特殊字符：  
4 < 5 显示为 4 &lt; 5  
AT&T 显示为 AT&amp;T  

插入版权符号示例：  
&copy;

### 内嵌 HTML（Inline HTML）

Markdown 支持直接在文档中使用 HTML 标签。  
行级标签如 `<span>`、`<cite>`、`<del>` 可以与 Markdown 语法混用。  
区块标签如 `<div>`、`<table>`、`<pre>`、`<p>` 需要前后空行，且区块内 Markdown 语法不会生效。

#### 语法示例

行级标签示例：  
This **word** is bold. This <em>word</em> is italic.

## 扩展语法

### 表格（Table）

使用管道 `|` 分隔列，使用三个或更多连字符 `---` 创建表头。  
可设置列对齐方式：左对齐 `:---`、居中 `:---:`、右对齐 `---:`。  
表格内可使用 Markdown 强调、链接或行内代码。  
不可使用标题、列表、块引用、分隔线、图片或 HTML 标签。  
管道字符可使用 HTML 实体 `&#124;` 转义。

#### 语法示例

| Syntax      | Description | Test Text     |
| :---        | :---:       | ---:          |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

表格内加格式化文本示例：

| Feature       | Example                        |
| ------------- | ------------------------------ |
| Bold          | **Bold Text**                  |
| Italic        | *Italic Text*                  |
| Inline Code   | `code`                         |
| Link          | [Markdown中文网](https://markdown.com.cn) |

### 围栏代码块（Fenced Code Block）

使用三个反引号 ``` 或三个波浪号 ~~~ 创建代码块，无需缩进。  
可在开头指定语言，实现语法高亮。

#### 语法示例

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

普通代码块示例：

```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

### 脚注（Footnote）<span style="color: var(--vpj-c-brand-1)">（孩子们这个不被`vitepress`支持）</span>

使用 `[^标识符]` 创建脚注引用，脚注内容放在文档任意位置，用 `[^标识符]: 内容` 定义。  
标识符可以是数字或单词，不可包含空格。支持多段落和代码块。

#### 语法示例

Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.

### 标题编号（Heading ID）

Markdown 支持为标题添加自定义 ID，方便直接链接和 CSS 样式控制。  
在标题行末使用 `{#custom-id}` 定义 ID。

#### 语法示例

### My Great Heading {#custom-id}

链接到自定义标题 ID：  
[Heading IDs](#custom-id)

### 定义列表（Definition List）

使用术语行后跟一行以冒号 `:` 开头的定义来创建定义列表。  
可以为同一术语添加多条定义。

#### 语法示例

First Term  
: This is the definition of the first term.

Second Term  
: This is one definition of the second term.  
: This is another definition of the second term.

### 删除线（Strikethrough）

使用两个波浪号 `~~` 包裹文本实现删除线效果。

#### 语法示例

~~世界是平坦的。~~ 我们现在知道世界是圆的。

### 任务列表（Task List）<span style="color: var(--vpj-c-brand-1)">（孩子们这个不被`vitepress`支持）</span>

使用 `- [ ]` 创建未完成任务，`- [x]` 创建已完成任务。  
在支持任务列表的 Markdown 应用程序中，会显示复选框。

#### 语法示例

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

### Emoji 表情（Emoji）

Markdown 支持直接粘贴表情符号，或使用简码 `:shortcode:` 插入表情。

#### 语法示例

去露营了！ :tent: 很快回来。  
真好笑！ :joy:

### 自动网址链接（Autolink）

Markdown 可自动将 URL 转为超链接。  
若不希望自动链接，可使用反引号包裹 URL。

#### 语法示例

自动链接：  
http://www.example.com

禁用自动链接：  
`http://www.example.com`

## `vitepress`专属

### 自定义容器（Custom Container）

VitePress 支持通过 `:::` 创建自定义容器，可指定类型如 `info`、`tip`、`warning`、`danger`、`details`。  
容器会自动渲染对应样式和标题。类型后可添加文本作为自定义标题。

#### 语法示例

默认标题：

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

自定义标题：

::: danger STOP
危险区域，请勿继续
:::

::: details 点我查看代码
```js
console.log('Hello, VitePress!')
```

:::

raw 容器（防止样式或路由冲突）：

::: raw
Wraps in a `<div class="vp-raw">`
:::

### GitHub 风格的警报（GFM-style Alerts）

VitePress 支持 GitHub 风格的标注警报，使用 `>` 引用加 `[!TYPE]` 标识。渲染方式类似自定义容器。

#### 语法示例

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。


### VitePress 代码块扩展语法

VitePress 使用 Shiki 提供语法高亮，并支持多种扩展功能，如行高亮、聚焦、diff、警告/错误标记及行号。

#### 基本语法高亮

```js
export default {
  name: 'MyComponent'
}
```

#### 行高亮

使用 `{lines}` 或 `// [!code highlight]` 注释：

```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: 'Highlighted!' // [!code highlight]
    }
  }
}
```

#### 聚焦代码行

使用 `// [!code focus]` 或指定多行：

```js
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```

#### diff 风格

使用 `// [!code ++]` 或 `// [!code --]`：

```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```

#### 错误/警告高亮

```js
export default {
  data () {
    return {
      msg: 'Error',   // [!code error]
      msg: 'Warning'  // [!code warning]
    }
  }
}
```

#### 行号

全局或局部启用行号，可自定义起始行号：

```ts:line-numbers {1}
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers=2 {1}
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

### VitePress 代码组

可以用代码组展示相同功能在不同语言或不同配置下的实现。

输入

```` markdown

::: code-group

```py [config.py]
# Python 配置示例
config = {
    "site_name": "MySite",
    "theme": "default"
}
```

```json [config.json]
{
  "site_name": "MySite",
  "theme": "default"
}
```

```yaml [config.yaml]
site_name: MySite
theme: default
```

:::

````

输出

::: code-group

```python [config.py]
# Python 配置示例
config = {
    "site_name": "MySite",
    "theme": "default"
}
```

```json [config.json]
{
  "site_name": "MySite",
  "theme": "default"
}
```

```yaml [config.yaml]
site_name: MySite
theme: default
```

:::