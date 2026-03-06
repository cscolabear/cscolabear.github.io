---
title: "如何在 Json 中加入註解"
date: 2026-03-05
updated: 2026-03-06
description: "如何在 Json 中加入註解呢？ 可以在 Json 裡加入註解嗎？ Json (JavaScript Object Notation) 是目前最流行的資料交換格式，簡單、小巧且易用是他的特色。 但是一大串資料內，難免有需要加入註解(comment)的時候。這時候應該怎麼做呢? 當然官方是不建議這麼做的(www."
author: "Cola"
category: "Javascript"
tags: ["Javascript"]
keywords: ["Javascript","php","seo"]
readingTime: "2 min read"
readingMinutes: 2
permalink: "/json-comment"
slug: "json-comment"
issueId: 15
githubUrl: "https://github.com/cscolabear/cscolabear.github.io/issues/15"
labels: ["Javascript"]
---

# 如何在 Json 中加入註解

如何在 Json 中加入註解呢？ 可以在 Json 裡加入註解嗎？
Json (JavaScript Object Notation) 是目前最流行的資料交換格式，簡單、小巧且易用是他的特色。
但是一大串資料內，難免有需要加入註解(comment)的時候。這時候應該怎麼做呢?
當然官方是不建議這麼做的(www.json.org); 意同，最好的註解就是程式本身😅

 

 

## 如何在 json 內加入註解

以 firebase 的例子來看~

<img width="2860" height="1080" alt="Image" src="https://github.com/user-attachments/assets/d54fb363-3e73-4c4f-bda8-a3b28c390965" />


[https://github.com/firebase/quickstart-js/blob/master/messaging/manifest.json](https://github.com/firebase/quickstart-js/blob/master/messaging/manifest.json)

 

簡單，單純的加入一個新的 key
下面幾種方式也是常見的 key 值

```

    "//_comment1": "Some browsers will use this to enable push notifications.",
    "_comment1": "Some browsers will use this to enable push notifications.",

```

```

    "//": "Some browsers will use this to enable push notifications.",

```

```

    "//comment": "Some browsers will use this to enable push notifications.",

```

 

 

## 後記

當然，最好的註解就是沒有註解
json 裡本來就不適合有註解出現

不過在一些特殊情況下，或許可以參考上述方式加入一點簡單的說明
e.g.

```
{
    "//_comment1": "該資料將於下個版本棄用",
    "cola_type": "cola is pig",
    "//": "最後更新日期",
    "date": "2018-02-20 12:34:56"
}
```

 

參考：[https://stackoverflow.com/questions/244777/can-comments-be-used-in-json](https://stackoverflow.com/questions/244777/can-comments-be-used-in-json?ref=cola.workxplay.net)

---

## 💬 留言討論 (1 則)


<div class="comment-card">
<div class="comment-header">
<strong>@cscolabear</strong>
<span class="comment-date">2026/3/6 上午11:10</span>
</div>

待補 hero image~

</div>



---

<div class="github-discussion">
  <a href="https://github.com/cscolabear/cscolabear.github.io/issues/15" target="_blank" rel="noopener noreferrer">
    💬 在 GitHub 上討論這篇文章
  </a>
</div>
