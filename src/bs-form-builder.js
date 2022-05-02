(function ($) {

    //默认配置
    var defaultOptions = {
        prevId: 'prevBtn',
        prevText: 'Previous',
        nextId: 'nextBtn',
        nextText: 'Next'
        //……
    };

    //每个组件(component) 的默认属性
    var defaultProps = [
        //tag 类型
        {
            name: "tag",
            type: "input",
            label: "组件类型",
            placeholder: "",
            disabled: true,
            required: true,
        },
        {
            name: "id",
            type: "input",
            label: "id",
            placeholder: "",
            disabled: false,
            required: true,
        },
        {
            name: "name",
            type: "input",
            label: "name",
            placeholder: "",
            disabled: false,
            required: true,
        },
        {
            name: "label",
            type: "input",
            label: "标签名",
            placeholder: "",
            disabled: false,
            required: false,
        },
    ]


    //每个属性类型（type）对于的渲染模板
    // key: prop.type  value:html
    var defaultPropTemplates = {
        input: function () {
            return '<div class="form-group clearfix">' +
                '       <div class="form-label-left">' +
                '             <span class="red required">*</span>' +
                '              <label></label>' +
                '        </div>' +
                '        <div class="flex-auto">' +
                '             <input type="text" class="form-control">' +
                '        </div>' +
                '    </div>'
        },
        select: function () {
        },
        number: function () {
        },
        switch: function () {
        },
        checkbox: function () {
        },
        radio: function () {
        },
    }

    //bsFormBuilder 内置组件
    var defaultComponents = [
        //当行输入框
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
            "template": '<div class="bs-form-item">' +
                '                   <div class="form-group clearfix">' +
                '                       <div class="form-label-left">' +
                '                           <label for="label">{{label}}</label>' +
                '                       </div>' +
                '                       <div class="flex-auto">' +
                '                           <input type="text" class="form-control" id="{{id}}" placeholder="{{placeholder}}" value="{{value}}">' +
                '                       </div>' +
                '                   </div>' +
                '               </div>',
            "onAddBefore": ""
        },

        //多行输入框
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
            "onAddBefore": ""
        },


        //栅格布局
        {
            "name": "栅格布局",
            "tag": "grid",
            "drag": {
                "title": "栅格布局",
                "type": "container",
                "index": 100,
                "iconClass": "bi bi-textarea-resize"
            },
            "props": [
                {
                    name: "grid",
                    type: "input",
                    label: "栅格数",
                    placeholder: "请输入行数...",
                    defaultValue: 2,
                    disabled: false,
                    required: true,
                }
            ],
            "template": '<div class="bs-form-item">' +
                '               <div class="form-group clearfix">' +
                '                     <div class="row pdlr-15">' +
                '                           {{~for (var i=0;i<$data.grid;i++)}}' +
                '                           <div class="col-{{12/$data.grid}} bs-form-container">{{$children[i]}}</div>' +
                '                           {{~end}}' +
                '                      </div>' +
                '                </div>' +
                '        </div>',
            "onDataCreate": function () {
                // childrenCount 必须等于 grid 的数量
                return {"childrenCount": 2}
            },
            "onAdd": function (bsFormBuilder, data) {
                var $row = $('#' + data.elementId).find(".row");
                $row.children().each(function (index, item) {
                    $(this).attr('data-index', index);
                    var sortable = $(this).data('bsItemSortable');
                    if (!sortable) {
                        sortable = new Sortable($(this)[0], {
                            group: 'shared',
                            animation: 150,
                            onAdd: function (evt) {
                                bsFormBuilder._onDragAdd(evt);
                            },
                            onEnd: function (evt) {
                                bsFormBuilder._onDragEnd(evt);
                            },
                        });
                        $(this).data('bsItemSortable', sortable);
                    }
                });
            },
            "onPropChange": function (bsFormBuilder, data, propName, value) {
                if (propName !== "grid") {
                    return false;
                }
                var currentData = bsFormBuilder.currentData;
                var intValue = Number.parseInt(value);
                var $row = $('#' + currentData.elementId).find(".row");
                var gridCount = $row.children().length;

                data.childrenCount = intValue;

                // 当前存在 grid 数量大于设置的数据，需要移除最后的几个 grid
                if (gridCount > intValue) {
                    for (let i = 0; i < gridCount - intValue; i++) {
                        var $lastElement = $row.find(":last");
                        var bsItemSortable = $lastElement.data("bsItemSortable");
                        if (bsFormBuilder) {
                            //销毁 bsItemSortable
                            bsItemSortable.destroy();
                        }
                        $lastElement.remove();
                    }
                }

                // 设置的 grid 数量大于当前存在的 grid 数量，需要在最后面添加 div
                if (intValue > gridCount) {
                    for (let i = 0; i < intValue - gridCount; i++) {
                        $row.append('<div class="bs-form-container"></div>')
                    }
                }

                $row.children().each(function (index, item) {
                    $(this).attr('data-index', index);
                    var sortable = $(this).data('bsItemSortable');
                    if (!sortable) {
                        sortable = new Sortable($(this)[0], {
                            group: 'shared',
                            animation: 150,
                            onAdd: function (evt) {
                                bsFormBuilder._onDragAdd(evt);
                            },
                            onEnd: function (evt) {
                                bsFormBuilder._onDragEnd(evt);
                            },
                        });
                        $(this).data('bsItemSortable', sortable);
                    }
                });

                $row.children().attr("class", "bs-form-container col-" + 12 / Number.parseInt(value));
                return true;
            }
        },
    ];


    //BsFormBuilder 类的定义以及初始化
    var BsFormBuilder = function (element, options) {
        this.$rootElement = $(element);
        this.options = $.extend(defaultOptions, options);

        //每个组件的默认属性
        this.defaultProps = $.extend(defaultProps, options.props);

        //每个 prop 显示的 html 模板
        this.propTemplates = $.extend(defaultPropTemplates, options.propTemplates);

        //设计容器 div
        this.$container = null;

        //设计的占位 div
        this.$containerPlaceHolder = null;

        //属性面板
        this.$propsPanel = null;

        //所有的组件, map(key== tag, value == component)
        this.components = {};

        //渲染的数据, map(key == id, value == component)
        // this.containerComponents = {};
        this.datas = [];

        //当前获得焦点的组件
        // this.currentComponent = null;
        this.currentData = null;

        //组件序号记录器，用于在添加组件的时候，生成组件的 name
        this.componentCounter = 1;

        //初始化
        this.init();
    }


    //BsFormBuilder 方法定义
    BsFormBuilder.prototype = {

        /**
         * 初始化
         */
        init: function () {

            //初始化 html 基础结构
            this._initHtmlStructure();

            this.$container = this.$rootElement.find('.bsFormBuilderContainer');
            this.$containerPlaceHolder = this.$rootElement.find('.placeholder-box');
            this.$propsPanel = this.$rootElement.find("#component-props-content");

            //初始化默认的组件库
            this._initComponents();

            //初始化拖动的组件
            this._initDragComponents();

            //初始化表单事件监听
            this._initEvents();

            //初始化拖动组件
            this._initSortables();

            //onInit 回调
            if (typeof this.options.onInit === "function") {
                this.options.onInit(this);
            }

        },


        /**
         * 初始化 html 基础结构
         * @private
         */
        _initHtmlStructure: function () {
            this.$rootElement.append(' <div class="row bsFormBuilderRoot">' +
                '            <!--左侧拖拽区域-->' +
                '            <div class="col-md-3 col-sm-4 ">' +
                '                <div class="bs-drag-panel pd10 border-right">' +
                '                    <ul class="nav nav-tabs mb-2" id="formTab" role="tablist">' +
                '                        <li class="nav-item w-50">' +
                '                            <a class="nav-link active" id="component-tab" data-toggle="tab" href="#component" role="tab"' +
                '                               aria-controls="component" aria-selected="true">表单组件</a>' +
                '                        </li>' +
                '                        <li class="nav-item w-50">' +
                '                            <a class="nav-link" id="module-tab" data-toggle="tab" href="#template" role="tab"' +
                '                               aria-controls="module" aria-selected="false">表单模板</a>' +
                '                        </li>' +
                '                    </ul>' +
                '                    <div class="tab-content">' +
                '                        <div class="tab-pane fade show active" id="component" role="tabpanel"' +
                '                             aria-labelledby="component-tab">' +
                '                            <div class="component-title">' +
                '                                表单组件' +
                '                            </div>' +
                '                            <div class="component-group d-flex align-items-center base-drags">' +
                '                            </div>' +
                '                            <div class="component-title">' +
                '                                辅助组件' +
                '                            </div>' +
                '                            <div class="component-group d-flex align-items-center assist-drags">' +
                '                            </div>' +
                '                            <div class="component-title">' +
                '                                布局组件' +
                '                            </div>' +
                '                            <div class="component-group d-flex align-items-center container-drags">' +
                '                            </div>' +
                '                        </div>' +
                '                        <div class="tab-pane fade" id="template" role="tabpanel" aria-labelledby="module-tab">' +
                '                            <div id="item-list" class="item-list">' +
                '                                <div class="text-center">没有更多了</div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <!-- 中间内容 -->' +
                '            <div class="bs-container-panel col-md-6  col-sm-4">' +
                '                <div class="w-100 pd10 border-bottom text-right pt-1 pb-1">' +
                '                    <button type="button" class="btn btn-primary btn-sm btn-export mr-2">' +
                '                        <i class="bi bi-box-arrow-in-up pr-1"></i>导出' +
                '                    </button>' +
                '                    <button type="button" class="btn btn-primary btn-sm btn-import mr-2">' +
                '                        <i class="bi bi-box-arrow-in-down pr-1"></i>导入' +
                '                    </button>' +
                '                    <button type="button" class="btn btn-primary btn-sm btn-component mr-2">' +
                '                        <i class="bi bi-eye pr-1"></i>预览' +
                '                    </button>' +
                '                    <button type="button" class="btn btn-sm btn-danger btn-clear">' +
                '                        <i class="bi bi-trash pr-1"></i>清空' +
                '                    </button>' +
                '                </div>' +
                '                <div style="width: 100%;" class="bsFormBuilderContainer">' +
                '                    <div class="placeholder-box">从左侧拖入组件进行表单设计</div>' +
                '                </div>' +
                '            </div>' +
                '            <!-- 属性内容 -->' +
                '            <div class="col-md-3  col-sm-4">' +
                '                <div class="bs-props-panel pd10 border-left">' +
                '                    <ul class="nav nav-tabs mb-2" id="formAttrTab" role="tablist">' +
                '                        <li class="nav-item w-50">' +
                '                            <a class="nav-link active" id="component-props-tab" data-toggle="tab"' +
                '                               href="#component-props-content"' +
                '                               role="tab" aria-controls="component" aria-selected="true">组件属性</a>' +
                '                        </li>' +
                '                        <li class="nav-item w-50">' +
                '                            <a class="nav-link" id="form-props-tab" data-toggle="tab"' +
                '                               href="#form-props-content"' +
                '                               role="tab"' +
                '                               aria-controls="module" aria-selected="false">表单属性</a>' +
                '                        </li>' +
                '                    </ul>' +
                '                    <div class="tab-content pt-3">' +
                '                        <div class="tab-pane fade show active" id="component-props-content" role="tabpanel"' +
                '                             aria-labelledby="component-props-tab">' +
                '                        </div>' +
                '                        <div class="tab-pane fade" id="form-props-content" role="tabpanel"' +
                '                             aria-labelledby="form-props-tab">' +
                '                              <div class="form-group clearfix">' +
                '                                    <div class="form-label-left">' +
                '                                        <span class="red">*</span>' +
                '                                        <label for="formItemId">表单id</label>' +
                '                                    </div>' +
                '                                    <div class="flex-auto">' +
                '                                        <input type="text" class="form-control" id="formItemId" value="formItem"' +
                '                                               disabled>' +
                '                                    </div>' +
                '                            </div>' +
                '                            <div class="form-group clearfix">' +
                '                                <div class="form-label-left">' +
                '                                    <label for="label">表单类型</label>' +
                '                                </div>' +
                '                                <div class="flex-auto">' +
                '                                    <div class="form-check form-check-inline">' +
                '                                        <input class="form-check-input" type="radio" name="formtype" id="radio1"' +
                '                                               value="option1" checked>' +
                '                                        <label class="form-check-label" for="radio1">内置</label>' +
                '                                    </div>' +
                '                                    <div class="form-check form-check-inline">' +
                '                                        <input class="form-check-input" type="radio" name="formtype" id="radio2"' +
                '                                               value="option2">' +
                '                                        <label class="form-check-label" for="radio2">弹窗</label>' +
                '                                    </div>' +
                '                                </div>' +
                '                            </div>' +
                '                            <div class="form-group clearfix">' +
                '                                <div class="form-label-left">' +
                '                                    <label for="label">表单按钮</label>' +
                '                                </div>' +
                '                                <div class="flex-auto">' +
                '                                    <div class="form-check form-check-inline">' +
                '                                        <input class="form-check-input" type="radio" name="postBtn" id="radioBtn1"' +
                '                                               value="option1" checked>' +
                '                                        <label class="form-check-label" for="radioBtn1">开启</label>' +
                '                                    </div>' +
                '                                    <div class="form-check form-check-inline">' +
                '                                        <input class="form-check-input" type="radio" name="postBtn" id="radioBtn2"' +
                '                                               value="option2">' +
                '                                        <label class="form-check-label" for="radioBtn2">关闭</label>' +
                '                                    </div>' +
                '                                </div>' +
                '                            </div>' +
                '                            <div class="form-group clearfix">' +
                '                                <div class="form-label-left">' +
                '                                    <label for="name">表单宽度</label>' +
                '                                </div>' +
                '                                <div class="flex-auto">' +
                '                                    <input type="number" min="1" class="form-control jp-range"' +
                '                                           value="254">' +
                '                                    <span>-</span>' +
                '                                    <input type="number" min="1" class="form-control jp-range"' +
                '                                           value="254">' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '        </div>')
        },

        /**
         * 初始化系统组件
         * @private
         */
        _initComponents: function () {
            //用户自定义组件
            var customComponents = this.options.components
            && typeof this.options.components == "object"
                ? this.options.components : [];

            for (let component of defaultComponents) {
                if (component) {
                    this.components[component.tag] = component;
                }
            }

            //支持用户自定义的 component 覆盖系统默认的 component
            for (let component of customComponents) {
                if (component) {
                    this.components[component.tag] = component;
                }
            }
        },


        /**
         * 渲染拖动的组件库
         */
        _initDragComponents: function () {
            if (!this.components || this.components.length === 0) {
                return;
            }

            //基础组件
            var baseDrags = [];

            //辅助组件
            var assistDrags = [];

            //容器组件
            var containerDrags = [];

            for (let component of Object.values(this.components)) {
                if (component && component.drag && component.drag.type) {
                    //copy component.tag to drag.tag
                    component.drag['tag'] = component.tag;
                    if (component.drag.type === 'base') {
                        baseDrags.push(component.drag);
                    } else if (component.drag.type === 'assist') {
                        assistDrags.push(component.drag)
                    } else if (component.drag.type === 'container') {
                        containerDrags.push(component.drag);
                    }
                } else {
                    console.error("Component define error! it must need drag.type. component content:", component);
                }
            }

            //根据 index 进行排序
            baseDrags.sort((a, b) => a.index = b.index);
            assistDrags.sort((a, b) => a.index = b.index);
            containerDrags.sort((a, b) => a.index = b.index);


            var $baseDragsDiv = $('.base-drags');
            for (let drag of baseDrags) {
                $baseDragsDiv.append('<ol data-tag="' + drag.tag + '"><div class="component-icon"><i class="' + drag.iconClass + '"></i></div><div class="form-name">' + drag.title + '</div></ol>');
            }


            var $assistDragsDiv = $('.assist-drags');
            for (let drag of assistDrags) {
                $assistDragsDiv.append('<ol data-tag="' + drag.tag + '"><div class="component-icon"><i class="' + drag.iconClass + '"></i></div><div class="form-name">' + drag.title + '</div></ol>');
            }


            var $containerDragsDiv = $('.container-drags');
            for (let drag of containerDrags) {
                $containerDragsDiv.append('<ol data-tag="' + drag.tag + '"><div class="component-icon"><i class="' + drag.iconClass + '"></i></div><div class="form-name">' + drag.title + '</div></ol>');
            }
        },


        /**
         * 初始化 bsFormBuilder 的事件机制
         * @private
         */
        _initEvents: function () {
            var bsFormBuilder = this;
            //container 下的每个 item 的点击事件
            $(".bsFormBuilderContainer").on("click", ".bs-form-item", function (event) {
                console.log("bs-form-item click >>>>>>", event)
                event.stopPropagation();
                bsFormBuilder.makeFormItemActive($(this).attr('id'));
            })


            //container 下的每个 item 的 复制按钮 的点击事件
            $(".bsFormBuilderContainer").on("click", ".bs-item-copy", function (event) {
                event.stopPropagation();
                var currentId = $(this).closest('.bs-form-item').attr('id');
                bsFormBuilder.copyFormItem(currentId);
            })

            //container 下的每个 item 的 复制按钮 的删除事件
            $(".bsFormBuilderContainer").on("click", ".bs-item-del", function (event) {
                event.stopPropagation();
                var $bsFormItem = $(this).closest('.bs-form-item');
                bsFormBuilder.deleteFormItem($bsFormItem.attr("id"));
            })

            //监听属性面板的输入框的输入事件
            $("#component-props-content").on("keyup", "  .form-control", function (event) {
                console.log("#component-props-tab keyup >>>>>>", event)
                var tag = $(this).attr('data-tag');
                var value = $(this).val();

                //没有选中的组件，理论上不存在这种情况
                if (!bsFormBuilder.currentData) {
                    console.error("error: Current data not exits!!!")
                    return;
                }

                //更新组件的 data 数据
                bsFormBuilder.currentData[tag] = value;

                //当前组件定义了 onPropChange 监听方法，并且该方法执行成功了
                //那么，可以理解为该方法会去更新 html 内容，而不通过系统继续渲染了
                if (typeof bsFormBuilder.currentData.component.onPropChange === "function"
                    && bsFormBuilder.currentData.component.onPropChange(bsFormBuilder
                        , bsFormBuilder.currentData, tag, value)) {
                    return;
                }

                //更新 html 内容
                var newHtml = bsFormBuilder.render(bsFormBuilder.currentData, true);
                $("#" + bsFormBuilder.currentData.elementId).replaceWith(newHtml);
            })
        },


        /**
         * 初始化 sortable
         * @private
         */
        _initSortables: function () {
            var bsFormBuilder = this;
            var drags = ['.base-drags', '.assist-drags', '.container-drags'];
            for (let drag of drags) {
                var element = document.querySelector(drag);
                new Sortable(element, {
                    group: {
                        name: 'shared',
                        pull: 'clone',
                        put: false
                    },
                    animation: 150,
                    sort: false,
                    onStart: function (evt) {
                        if (bsFormBuilder.$containerPlaceHolder) {
                            bsFormBuilder.$containerPlaceHolder.hide();
                        }
                    },
                    onEnd: function (evt) {
                        if (bsFormBuilder.datas.length === 0) {
                            bsFormBuilder.$containerPlaceHolder.show();
                        }
                    }
                });
            }

            new Sortable(document.querySelector('.bsFormBuilderContainer'), {
                group: 'shared',
                animation: 150,
                onAdd: function (evt) {
                    bsFormBuilder._onDragAdd(evt);
                },
                onEnd: function (evt) {
                    bsFormBuilder._onDragEnd(evt);
                },
            });
        },


        /**
         * 监听 container 添加组件
         * @param evt
         * @private
         */
        _onDragAdd: function (evt) {
            console.log(">>>> onDragAdd: ", evt, this)

            var data = null;

            var $item = $(evt.item);
            var tag = $item.attr("data-tag");

            //从左边的组件库移动过来的
            if (tag) {
                //根据 component 来创建 data
                data = this.createComponentData(this.components[tag]);

                //渲染 component template
                var template = this.render(data, false);
                $(evt.item).replaceWith(template);
            }

            //从一个容器移动到另一个容器
            else {
                data = this.getDataByElementId($item.attr("id"));
            }

            //从原有的数组中移除
            this.removeDataByElementId(data.elementId);

            var $to = $(evt.to);

            //拖动到 root 容器
            if ($to.is(".bsFormBuilderContainer")) {
                delete data.parentDataId;
                delete data.parentDataIndex;
                this.datas.push(data);
            }

            //拖动到子容器
            else {
                var newParentId = $to.closest(".bs-form-item").attr("id");
                var dataIndex = $to.closest(".bs-form-container").attr("data-index");

                var newParent = this.getDataByElementId(newParentId);

                if (typeof newParent.children === "undefined") {
                    newParent.children = {};
                }

                if (typeof newParent.children[dataIndex] === "undefined") {
                    newParent.children["" + dataIndex] = [];
                }

                data.parentDataId = newParent.id;
                data.parentDataIndex = dataIndex;
                newParent.children[dataIndex].push(data);
            }


            // component 定义了自己的 onAdd 方法
            if (typeof data.component.onAdd === "function") {
                data.component.onAdd(this, data);
            }

            //让当前的组件处于选中状态
            this.makeFormItemActive(data.elementId);
            this.refreshDataIndex($to);
        },


        /**
         * 监听 container 拖动组件
         * @param evt
         * @private
         */
        _onDragEnd: function (evt) {
            console.log(">>>> onDragEnd: ", evt)

            this.refreshDataIndex($(evt.from))
        },


        /**
         * 初始化 component 的 data 数据
         * @param component
         * @private
         */
        createComponentData: function (component) {
            var data = component.onDataCreate && typeof component.onDataCreate === "function"
                ? component.onDataCreate() : {};

            //组件的 id
            data.elementId = this.genRandomId();

            //input 表单的id，用户可以通过属性面板进行修改
            data.id = this.genRandomId();


            data.tag = component.tag;
            data.component = component;

            if (!data.label) {
                data.label = component.name;
            }

            if (!data.name) {
                data.name = component.tag + "_" + this.componentCounter++;
            }

            //组件定义的属性，为 data 配置上： data.属性名 = 属性默认值
            if (component.props) {
                for (const prop of component.props) {
                    if (prop.defaultValue && !data[prop.name]) {
                        data[prop.name] = prop.defaultValue;
                    }
                }
            }

            return data;
        },


        /**
         * 生成一个随机的 ID
         * @private
         */
        genRandomId: function () {
            var idArray = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 10; i++) {
                idArray[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            return idArray.join("");
        },


        /**
         * 渲染模板，替换掉模板里的 {{xxx}} 数据
         * @param data 数据
         * @private
         */
        renderDefault: function (data) {

            //有子节点 component
            var children = [];

            //container 类型必须定义 childrenCount 数据
            if (data.childrenCount && data.childrenCount > 0) {
                for (let i = 0; i < data.childrenCount; i++) {
                    let childArray = data.children ? data.children[i] : [];
                    let htmlContent = "";
                    if (childArray) {
                        for (let item of childArray) {
                            let html = this.render(item, false);
                            if (html) htmlContent += html.outerHTML;
                        }
                    }
                    children[i] = htmlContent;
                }
            }


            let template = data.component.template;
            let body = template.replace(/\'/g, "&#39;")
                .replace(/\"/g, "&quot;")
                .replace(/[\r\n\t]/g, "")
                .replace(/\{\{~end\}\}/g, "\"}\"")
                .replace(/\{\{~(.+?)\}\}/g, (_, p1) => {
                    return '";' + p1 + '{ ret+="';
                })
                .replace(/\{\{(.+?)\}\}/g, (_, p1) => {
                    return '"; ret+= ' + p1 + '; ret+="';
                });
            body = 'let ret=""; ret += "' + body + '";return ret;';

            var paras = ["$builder", "$component", "$data", "$children"
                , "id", "type", "name", "rows", "style", "label", "placeholder", "value"];
            let func = new Function(...paras, body);

            var values = paras.map(k => data[k] || "");
            values[0] = this;
            values[1] = data.component;
            values[2] = data;
            values[3] = children;

            return func(...values).replace(/\&#39;/g, '\'').replace(/\&quot;/g, '"');
        },


        /**
         * 深度拷贝
         * @param target 拷贝目标
         * @param wthNewElementIdAndId 是否为 elementId 和 id 设置新的值
         * @returns {*[]}
         * @private
         */
        deepCopy: function (target, wthNewElementIdAndId) {
            var newObject = Array.isArray(target) ? [] : {};
            if (target && typeof target === "object") {
                for (let key in target) {
                    if (target.hasOwnProperty(key)) {
                        if (target[key] && typeof target[key] === "object") {
                            newObject[key] = this.deepCopy(target[key], wthNewElementIdAndId);
                        } else {
                            var value = target[key];
                            if (key === "elementId" || key === "id") {
                                value = this.genRandomId();
                            }
                            newObject[key] = value;
                        }
                    }
                }
            }
            return newObject;
        },


        /**
         * 渲染 component 的模板内容
         * @param data 组件内容
         * @param withActive 是否让当前的组件处于 "选中" 状态
         * @returns {*}
         * @private
         */
        render: function (data, withActive) {
            var component = data.component;
            var template = null;

            //若组件定义的 template 是一个方法，而非字符串，则只需这个方法来获取模板数据
            if (typeof component.template === "function") {
                template = component.template(component, data);
            } else {
                //若模板未定义 renderDefault 函数，或者定义的 renderDefault 并不是一个函数
                //则使用 bsFormBuilder 自己的 renderDefault 函数
                if (component.render && typeof component.render === "function") {
                    template = component.render(component, component.template, data);
                } else {
                    template = this.renderDefault(data);
                }
            }

            var $template = $(template).attr("id", data.elementId);

            if (withActive) {
                $template.append('<div class="bs-item-tools">' +
                    '               <i class="bi bi-card-image bs-item-copy" title="复制"></i>' +
                    '               <i class="bi bi-trash bs-item-del" title="删除"></i>' +
                    '           </div>')
                    .addClass('active')
            }

            //为 template 配置 id 属性，让 id 的值和 component 的 id 值一致
            //这样，用户点击这个 template div 的时候，才能通过其 id 去查找 component 数据
            return $template[0];
        },


        /**
         * 让某个组件处于选中状态
         * @param elementId
         */
        makeFormItemActive: function (elementId) {

            if (this.currentData && this.currentData.elementId === elementId) {
                return;
            }

            this.currentData = this.getDataByElementId(elementId);

            this.$container.find(".bs-form-item.active").removeClass("active");
            this.$container.find(".bs-item-tools").remove();


            $("#" + elementId).append('<div class="bs-item-tools">' +
                '               <i class="bi bi-card-image bs-item-copy" title="复制"></i>' +
                '               <i class="bi bi-trash bs-item-del" title="删除"></i>' +
                '           </div>')
                .addClass('active');


            this.renderPropertiesPanel();
        },

        /**
         * 删除组件
         * @param id
         */
        deleteFormItem: function (elementId) {
            if (this.currentData && this.currentData.elementId === elementId) {
                this.currentData = null;
                this.renderPropertiesPanel();
            }

            this.removeDataByElementId(elementId);
            $("#" + elementId).remove();
        },


        /**
         * 复制组件
         * @param elementId
         */
        copyFormItem: function (elementId) {
            var orignalData = this.getDataByElementId(elementId);
            if (!orignalData) {
                return;
            }

            //复制数据，并重新初始化数据的 elementId 和 id 属性
            var newData = this.deepCopy(orignalData, true);

            //通过 data 来渲染 html
            var html = this.render(newData, false);

            //复制的 element
            var $orignalElement = $("#" + elementId);
            $orignalElement.after(html);

            //追加 html 后，回调 component 的 onAdd 方法
            if (typeof newData.component.onAdd === "function") {
                newData.component.onAdd(this, newData);
            }

            //追加数据到 array 里
            var parentArray = this.getParentArrayByElementId(elementId);
            parentArray.push(newData);

            this.refreshDataIndex($orignalElement.parent())
        },


        /**
         * 根据 elementId 来查找容器里的 data 数据
         * @param elementId
         */
        getDataByElementId: function (elementId) {
            return this.getDataByElementIdInArray(this.datas, elementId);
        },


        /**
         * 根据 elementId 来查询
         * @param dataArray
         * @param elementId
         * @returns {null|*}
         */
        getDataByElementIdInArray: function (dataArray, elementId) {
            if (!dataArray || dataArray.length === 0) {
                return null;
            }

            for (let item of dataArray) {
                if (item && item.elementId === elementId) {
                    return item;
                } else if (item.children && typeof item.children === "object") {
                    for (let childArray of Object.values(item.children)) {
                        let ret = this.getDataByElementIdInArray(childArray, elementId);
                        if (ret) return ret;
                    }
                }
            }

            return null;
        },

        /**
         * 根据 elementId 来删除 data 里的数据
         * @param elementId
         */
        removeDataByElementId: function (elementId) {
            return this.removeDataByElementIdInArray(this.datas, elementId);
        },


        /**
         * 根据 elementId 来删除梳理里的 data 数据
         * @param dataArray 要删除的数组
         * @param elementId 根据 elementId 来删除
         */
        removeDataByElementIdInArray: function (dataArray, elementId) {
            if (!dataArray || dataArray.length === 0) {
                return;
            }

            for (let i = 0; i < dataArray.length; i++) {
                let item = dataArray[i];
                if (item && item.elementId === elementId) {
                    dataArray.splice(i, 1);
                    break;
                } else if (item.children && typeof item.children === "object") {
                    for (let childArray of Object.values(item.children)) {
                        this.removeDataByElementIdInArray(childArray, elementId);
                    }
                }
            }
        },


        /**
         * 根据 elementId 来获取其所在的数组
         * @param elementId
         * @returns {*}
         */
        getParentArrayByElementId: function (elementId) {
            return this.getParentArrayByElementIdInArray(this.datas, elementId);
        },


        /**
         * 根据 elementId 来获取其所在的数组
         * @param dataArray
         * @param elementId
         */
        getParentArrayByElementIdInArray: function (dataArray, elementId) {
            if (!dataArray || dataArray.length === 0) {
                return null;
            }

            for (let i = 0; i < dataArray.length; i++) {
                let item = dataArray[i];
                if (item && item.elementId === elementId) {
                    return dataArray;
                } else if (item.children && typeof item.children === "object") {
                    for (let childArray of Object.values(item.children)) {
                        let ret = this.getParentArrayByElementIdInArray(childArray, elementId);
                        if (ret) return ret;
                    }
                }
            }

            return null;
        },

        /**
         * 刷新 data 的 index 数据
         * @param $parentElement
         */
        refreshDataIndex: function ($parentElement) {
            var bsFormBuilder = this;
            $parentElement.children(".bs-form-item").each(function (index, item) {
                var id = $(item).attr("id");
                bsFormBuilder.getDataByElementId(id)['index'] = index;
            })
        },


        /**
         * 渲染属性设置组件
         */
        renderPropertiesPanel: function () {
            if (!this.currentData) {
                return;
            }

            this.$propsPanel.html('');

            //组件定义的 "私有" 属性
            var componentProps = typeof this.currentData.component.props === "object" ?
                this.currentData.component.props : [];

            //全部属性
            var allProps = this.defaultProps.concat(componentProps);

            for (let prop of allProps) {
                var template = this.propTemplates[prop.type];
                if (typeof template === "function") {
                    template = template();
                }

                var id = this.genRandomId();
                var $template = $(template);
                var input = $template.find('.form-control');
                input.attr("id", id);
                input.attr("disabled", prop.disabled);
                input.attr("data-tag", prop.name);

                var value = this.currentData[prop.name];
                if (!value && typeof prop.defaultValue !== "undefined") {
                    value = prop.defaultValue;
                }
                if (value) {
                    input.val(value);
                }


                $template.find("label").attr("for", id).text(prop.label);
                this.$propsPanel.append($template[0]);
            }


            console.log(">>>>>>>renderPropertiesPanel")
        },

        /**
         * 导出 json
         */
        exportToJson: function () {

        },


    }


    $.fn.bsFormBuilder = function (option) {
        var arg = arguments,
            options = typeof option == 'object' && option;

        return this.each(function () {
            var $this = $(this),
                component = $this.data('bsFormBuilder');

            if (!component) {
                $this.data('bsFormBuilder', (component = new BsFormBuilder(this, options)));
            }
            if (typeof option === 'string') {
                var method = component[option];
                if (!method) {
                    console.error("BsFormBuilder has not the method: " + option);
                    return;
                }
                if (arg.length > 1) {
                    method.apply(component, Array.prototype.slice.call(arg, 1));
                } else {
                    method();
                }
            }
        });
    }
})(jQuery);
