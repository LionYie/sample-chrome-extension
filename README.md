#### 快速上手开发[chrome浏览器](https://so.csdn.net/so/search?q=chrome%E6%B5%8F%E8%A7%88%E5%99%A8&spm=1001.2101.3001.7020)插件

* [写在前面](https://blog.csdn.net/wbw1021/article/details/132897864?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169664530116800182762045%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169664530116800182762045&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-132897864-null-null.142^v94^chatsearchT3_1&utm_term=%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E5%BC%80%E5%8F%91chrome%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6&spm=1018.2226.3001.4187#_1)
* [基于manifest V3的示例](https://blog.csdn.net/wbw1021/article/details/132897864?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169664530116800182762045%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169664530116800182762045&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-132897864-null-null.142^v94^chatsearchT3_1&utm_term=%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E5%BC%80%E5%8F%91chrome%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6&spm=1018.2226.3001.4187#manifest_V3_3)
* [代码调试与本地使用](https://blog.csdn.net/wbw1021/article/details/132897864?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169664530116800182762045%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169664530116800182762045&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-132897864-null-null.142^v94^chatsearchT3_1&utm_term=%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E5%BC%80%E5%8F%91chrome%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6&spm=1018.2226.3001.4187#_86)
* [扩展内容](https://blog.csdn.net/wbw1021/article/details/132897864?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169664530116800182762045%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169664530116800182762045&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-132897864-null-null.142^v94^chatsearchT3_1&utm_term=%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E5%BC%80%E5%8F%91chrome%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6&spm=1018.2226.3001.4187#_97)

## 写在前面

全文将通过一个示例教会大家如何开发chrome浏览器插件。经常和浏览器打交道的小伙伴们以后可以开发自己要用的插件啦

## 基于manifest V3的示例

下面做一个简单的示例为大家进行演示。插件功能是可以将用户当前打开的网页的标题复制到[剪贴板](https://so.csdn.net/so/search?q=%E5%89%AA%E8%B4%B4%E6%9D%BF&spm=1001.2101.3001.7020)中。

创建一个文件夹用于存放插件代码，文件夹目录如下：

* manifest.json
* popup.html
* popup.js

`manifest.json`内容如下（常用的配置项已进行标注）

```json
{
  "manifest_version": 3, // 注意这里Chrome已将扩展程序的manifest版本更为3 
  "name": "Copy Page Title", // 插件名
  "version": "1.0", // 插件版本
  "description": "Copies the title of the current page to the clipboard.", //插件描述
  "permissions": ["tabs"], // 用于声明插件所需的权限。这些权限允许插件访问浏览器的不同功能和 API
  "action": { // 用于指定当用户点击插件时要执行的操作
    "default_popup": "popup.html" // 指定插件的默认弹出窗口，用于在点击插件时打开
  }
}
```

`popup.html`内容如下

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Copy Page Title</title>
  <!-- 在这里引入popup要执行的代码逻辑 -->
  <script src="popup.js"></script>
</head>

<body>
  <h1>Copy Page Title</h1>
  <button id="copyButton">Copy Title</button>
</body>

</html>
```

```javascript
document.addEventListener("DOMContentLoaded", function () {
  const copyButton = document.getElementById("copyButton");
  copyButton.addEventListener("click", function () {
  	// 这里调用了chrome API -- chrome.tabs.query, 用于查询当前点击的标签页，返回标签页数组，取数组第一项即为当前点中的标签页
    chrome.tabs.query({ active: true }, (res) => {
      let title = res[0].title;
      copyTextToClipboard(title);
      alert("Copied title to clipboard!");
    });
  });
});

function copyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    let successful = document.execCommand("copy");
    let msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.error("Oops, unable to copy", err);
  }
  document.body.removeChild(textArea);
}
```

进入chrome扩展程序管理页，打开开发者模式

![在这里插入图片描述](https://img-blog.csdnimg.cn/ba0ed2eb5f984385b1f5c4f837c576a2.png)
点击【加载已解压的扩展程序】，选择存放插件代码的文件夹，这样我们的插件就成功加载进来，可以正常使用了。

如果想对代码进行调试，可点击插件的更多选项，然后选择【审查弹出内容】，这样就可以像普通的前端页面一样在浏览器进行调试了，`console.log`输出的内容同样会显示在控制台中。
![在这里插入图片描述](https://img-blog.csdnimg.cn/c250ddaf60284129b33ac50ca0a2b5f5.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/d5248cdfb6f545b6985446a349235cf7.png)
如果后续修改内容，只需点击【更新】，在文件存储路径不变的情况下会自动更新成最新的代码。
![在这里插入图片描述](https://img-blog.csdnimg.cn/461761c4dc8a44a6ab217980087497bb.png)

## 扩展内容

1、文档
很重要！上面内容只是抛砖引玉做了一个小示例教会大家如何快速上手开发chrome插件。chrome的开放能力有很多，大家可以根据自己的需求进行探索。
这里po一个官方的chrome插件API文档——[chrome插件API](https://developer.chrome.com/docs/extensions/reference/)

2、如何在chrome应用商店发布插件
需要注册Google Play开发者账号（付费的）
