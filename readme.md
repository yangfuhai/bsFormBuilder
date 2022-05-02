# Bs-Form-Builder

一个基于 Bootstrap 的表单构建工具。

## 使用方法

```html

<div id="builder" class="row"></div>
<script>
    $('#builder').bsFormBuilder({});
</script>

```

需要导入以下 css 和 js

```html

<link rel="stylesheet" href="example/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="bootstrap-font/bootstrap-icons.css">
<link rel="stylesheet" href="bs-form-builder.css">

<script src="example/static/js/jquery.min.js"></script>
<script src="example/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="example/static/js/sortable.min.js"></script>
<script src="bs-form-builder.js"></script>
```

## Bs-Form-Builder 提供的方法和接口

### 1、初始化

通过 `$('#builder').bsFormBuilder({});` 进行初始化，`bsFormBuilder` 方法可以传入 option 配置，option内容 如下：

### 2、方法调用

通过 `$('#builder').bsFormBuilder('methodName',arguments...);` 方法调用。

Bs-Form-Builder 支持的方法如下：

#### 2.1 addComponent 添加组件

```javascript
$('#builder').bsFormBuilder('addComponent', {
    "name": "输入框",
    "tag": "input",
    "drag": {
        "title": "输入框",
        "type": "base",
        "index": 100,
        "iconClass": "bi bi-terminal"
    },
    "data": "......"
})
```

**如何定义一个组件？**

在 bs-form-builder 中，组件是通过一个 json 内容来定义的，一个完整的组件的 json 内容
如下：

```json
{
  "name": "输入框",
  "tag": "input",
  "drag": {
    "title": "输入框",
    "type": "base",
    "index": 100,
    "iconClass": "bi bi-terminal"
  },
  "data": {
    "index": 0,
    "tag": "radio",
    "name": {
      "data_type": "string",
      "data_default": "radio_0",
      "prop": {
        "text": "name",
        "element": "input",
        "placeholder": "请输入"
      }
    },
    "label": {
      "data_type": "string",
      "data_default": "输入框",
      "prop": {
        "text": "name",
        "tag": "input",
        "placeholder": "请输入"
      }
    },
    "labelwidth": 110,
    "width": 100,
    "disabled": false,
    "labelhide": false,
    "options": {
      "data_type": "array",
      "data_default": [
        {
          "title": "男",
          "value": "1",
          "checked": true
        },
        {
          "title": "女",
          "value": "0",
          "checked": false
        }
      ]
    }
  },
  "template": "<div></div>",
  "onAddBefore": ""
}
```
