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
