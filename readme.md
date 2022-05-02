# Bs-Form-Builder

一个基于 JQuery + Bootstrap (v4.x) 的表单构建工具。

## 使用方法

```html
<div id="builder"></div>
<script>
    $('#builder').bsFormBuilder({...});
</script>
```

在使用前，需要导入以下依赖的 css 和 js 文件。

```html

<link rel="stylesheet" href="example/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="example/bootstrap-icons/bootstrap-icons.css">

<script src="example/static/js/jquery.min.js"></script>
<script src="example/bootstrap/js/bootstrap.bundle.min.js"></script>

<!-- 导入 bs-form-builder 依赖-->
<link rel="stylesheet" href="bs-form-builder.min.css">
<script src="bs-form-builder.min.all.js"></script>
```

## Bs-Form-Builder 提供的方法和接口

### 1、初始化

通过 `$('#builder').bsFormBuilder({});` 进行初始化，`bsFormBuilder` 方法可以传入 options 配置，options 内容如下：

```json
{
    //组件配置
    components:{},
    
    //属性配置
    props:{},
    
    //属性渲染的 html 模板配置
    propTemplates:{},
    
    //初始化回调方法
    onInit:function(bsFormBuilder){},
}
```

### 2、方法调用

通过 `$('#builder').bsFormBuilder('methodName',arguments...);` 方法调用。

Bs-Form-Builder 支持的方法如下：

- init
- _initHtmlStructure： 初始化 builder 的结构
- _initComponents：初始化 bsFormBuilder 的 components 属性
- _initEvents：初始化 bsFormBuilder 的事件机制
- _initSortables：初始化 sortable 事件
- _initDragComponents：初始化拖动的控件
- render：通过 data 数据，来渲染出一个 html 内容
- renderDefault： 系统内置的默认渲染方法，当 component 未定义自己的 render 方法的时候，使用该方法进行渲染。
- deepCopy：深度拷贝工具类
- createComponentData：通过 component 来创建一个 data 数据
- genRandomId：生成一个随机的 id
- makeFormItemActive：设置选择状态
- deleteFormItem：删除一个 formItem
- copyFormItem：复制一个 formItem
- getDataByElementId：通过一个节点 id 获取 data 数据
- removeDataByElementId：通过节点 id 移除 data 数据
- getParentArrayByElementId：通过节点 id 获取其所在的 数组
- refreshDataIndex：刷新 data 的 index 属性
- renderPropertiesPanel：渲染（刷新）属性面板
- exportDataJson：导出 data 数据




### 3、组件扩展

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

### 4、属性扩展

### 5、交流社区
