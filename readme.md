# Bs-Form-Builder

一个基于 JQuery + Bootstrap (v4.x) 的表单构建工具。

## 使用方法

```html

<div id="builder"></div>
<script>
    $('#builder').bsFormBuilder({...});
</script>
```

在使用前，需要导入 bootstrap 和 jquery 的相关文件。

```html

<link href="path/bootstrap.min.css" rel="stylesheet">
<link href="path/bootstrap-icons.css" rel="stylesheet">

<script src="path/jquery.min.js"></script>
<script src="path/bootstrap.bundle.min.js"></script>

<!-- 导入 bs-form-builder 依赖-->
<link href="path/bs-form-builder.min.css" rel="stylesheet">
<script src="path/bs-form-builder.min.all.js"></script>
```

## Bs-Form-Builder 提供的方法和接口

### 1、初始化

通过 `$('#builder').bsFormBuilder({options...});` 进行初始化，`bsFormBuilder` 方法可以传入 options 配置，options 内容如下：

```javascript
{
  //模式: "view" 渲染结果,"builder" 构建工具
  mode: "view",
  //使用哪些组件
  useComponents:[],    
  //初始化数据
  datas: [],
  //组件扩展配置，配置的内容可以覆盖掉系统的配置
  components: {},
  //属性扩展配置
  props: {},
  //属性渲染的 html 模板配置
  propTemplates: {},
  //初始化回调方法
  onInit: function(bsFormBuilder){},
}
```

### 2、方法调用

通过 `$('#builder').bsFormBuilder('methodName',arguments...);` 方法调用。

Bs-Form-Builder 支持的方法如下：

- init： 初始化
- render(data, withActive)：通过 data 数据，来渲染出一个 html 内容
- renderDefault(data)： 系统内置的默认渲染方法，当 component 未定义自己的 render 方法的时候，使用该方法进行渲染。
- deepCopy(target, withNewElementIdAndId)：深度拷贝工具类
- createComponentData(component)：通过 component 来创建 data 数据
- genRandomId()：生成一个随机的 id
- makeFormItemActive(elementId)：设置选择状态
- deleteFormItem(elementId)：删除一个 formItem
- copyFormItem(elementId)：复制一个 formItem
- getDataByElementId(elementId)：通过一个节点 id 获取 data 数据
- removeDataByElementId(elementId)：通过节点 id 移除 data 数据
- getParentArrayByElementId(elementId)：通过节点 id 获取其所在的 数组
- refreshDataIndex($parentElement)：刷新 data 的 index 属性
- refreshPropsPanel()：渲染（刷新）属性面板
- exportToJson()：导出 data 数据
- getDatas()：获取 datas 数据，并可以对其进行修改
- addDataToRoot(data)：添加一个 data 到根节点
- addDatasToRoot(array)：添加一个 data 数组到根节点
- addDataToContainer(data, containerElementId, index)：添加一个 data 到一个子container
- addDatasToContainer(array, containerElementId, index)：添加一个 data 数组到一个子container
- updateDataAttr(data, attr, value)：更新一个 data 的属性，并同步到 html 显示
- refreshDataElement(data)：刷新 data 数据到 html
- isViewMode()：是否是视图模式
- isBuilderMode()：是否是构建模式（构建工具）

### 3、组件扩展

在 bs-form-builder 中，组件是通过一个 json 内容来定义的，一个完整的组件的 json 内容
如下：

```javascript
{
    "name": "输入框",
    "tag": "input",
    "drag": {
        "title": "输入框",
        "type": "base",
        "index": 100,
        "iconClass": "bi bi-terminal"
    },
    "props": [],
    "propsfilter":[],
    "template": '<div class="bs-form-item">' +
        '           <div class="form-group clearfix">' +
        '               <div class="form-label-left">' +
        '                   <label for="label">{{label}}</label>' +
        '               </div>' +
        '               <div class="flex-auto">' +
        '                   <input type="text" class="form-control" id="{{id}}" placeholder="{{placeholder}}" value="{{value}}">' +
        '               </div>' +
        '           </div>' +
         '          </div>' +
        '       </div>',
    onAdd:function (bsFormBuilder, data) {},
    onPropChange:function (bsFormBuilder, data, propName, value) {},
    render:function (bsFormBuilder, component, data) {},

}
```

**组件属性描述**
- name：组件名称
- tag:  组件 tag，全局唯一，若用户定义的组件 tag 与系统一样，则会覆盖系统的组件定义。
- drag：右侧显示的内容
- props：组件支持的属性配置
- propsfilter：系统属性过滤配置，若为配置则显示系统存在的 props 定义
- template：模板，可以是一个 string 字符串，也可以是一个返回一个 string 的 function(component, data)。
- onAdd：当组件被添加到 html 的时候回调，或者被拖动的时候，注意：当组件从一个子容器被拖动到另一个子容器，也会调用此方法。
- onPropChange：当属性被修改的时候，回调。
- render：组件自定义的模板渲染方法，默认情况下无需定义。

> **注意**：默认情况下，无需配置 onAdd、onPropChange、render 方法。除非您已经了解的其作用。

**props 属性描述**

bsFormBuilder 已经内置了 4 个属性：tag、id、name、label，任何组件都包含有这 4 个属性（除非定义了 propsfilter），然而，一个复杂的组件除了这 4 个属性以外，还应该有其他的属性，比如 textarea 应该有行数 rows。

所以，textarea 组件的定义如下：

```javascript
{
    "name": "多行输入框",
    "tag": "textarea",
    "drag": {
        "title": "多行输入框",
        "type": "base",
        "index": 100,
        "iconClass": "bi bi-textarea-resize"
    },
    "props": [
        {
            name: "rows",
            type: "input",
            label: "行数",
            placeholder: "请输入行数...",
            defaultValue: 5,
            disabled: false,
            required: true,
        }
    ],
    "template": '<div class="bs-form-item">' +
        '                   <div class="form-group clearfix">' +
        '                       <div class="form-label-left">' +
        '                           <label for="{{id}}">{{label}}</label>' +
        '                       </div>' +
        '                       <div class="flex-auto">' +
        '                           <textarea name="{{name}}" class="form-control" id="{{id}}" rows="{{rows}}"' +
        '                                     placeholder="{{placeholder}}">{{value}}</textarea>' +
        '                       </div>' +
        '                   </div>' +
        '               </div>',
}
```

**template 语法：**

- 变量名称：{{propName}} 
- for循环：{{~ for(let item of array)}}  --  {{~end}}
- if循环：{{~ if( x === "string")}}  --  {{~end}}

**template 内置变量：**
- $bsFormBuilder : bsFormBuilder 实例
- $component：component 实例
- $data：当前 component 的数据
- $children：html 数组，若当前是一个容器，那么该容器下的 html 内容。



### 4、属性扩展

### 5、交流社区
