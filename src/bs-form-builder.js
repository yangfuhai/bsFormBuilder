/**
 * Copyright (c) 2016-2020, Michael Yang 杨福海 (fuhai999@gmail.com).
 * <p>
 * Licensed under the GNU Lesser General Public License (LGPL) ,Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.gnu.org/licenses/lgpl-3.0.txt
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {

    //默认配置
    var defaultOptions = {
        mode: "builder", // 模式 builder,view
        useComponents: [], //使用的组件 use components
        buttons: [
            {
                text: '导出',
                mainClass: 'btn-primary',
                iconClass: 'bi bi-arrow-up pr-1',
                onclick: ''
            },
            {
                text: '预览',
                mainClass: 'btn-primary',
                iconClass: 'bi bi-eye pr-1',
                onclick: ''
            },
            {
                text: '删除',
                mainClass: 'btn-danger',
                iconClass: 'bi bi-trash pr-1',
                onclick: ''
            },
        ],
        buttonTemplate: '<button type="button" class="btn btn-sm {{mainClass}}" onclick="{{onclick}}">' +
            '  <i class="{{iconClass}}"></i>{{text}}' +
            '</button>',
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
                '             {{~ if(required)}}' +
                '             <span class="red required">*</span>' +
                '             {{~end}}' +
                '              <label for="{{id}}">{{label}}</label>' +
                '        </div>' +
                '        <div class="flex-auto">' +
                '             <input id="{{id}}" type="text" data-attr="{{name}}" class="onkeyup form-control" value="{{value}}">' +
                '        </div>' +
                '    </div>';
        },
        select: function () {
            return '<div class="form-group clearfix">' +
                '       <div class="form-label-left">' +
                '            <legend class="col-form-label pt-0">{{label}}</legend>' +
                '        </div>' +
                '        <div class="flex-auto">' +
                '            <select class="custom-select onchange" data-attr="{{name}}">' +
                '                   {{~for (let option of options)}}' +
                '                   <option value="{{option.value}}" {{~if(option.value == value)}}selected=""{{~end}}>{{option.text}}</option>' +
                '                   {{~end}}' +
                '             </select>' +
                '        </div>' +
                '    </div>'
        },
        number: function () {
            return '<div class="form-group clearfix">' +
                '  <div class="form-label-left">' +
                '    <label for="{{id}}">{{label}}</label>' +
                '  </div>' +
                '  <div class="flex-auto">' +
                '    <input type="number" data-attr="{{name}}" class="form-control onchange onkeyup" value="{{value}}" />' +
                '  </div>' +
                '</div>';
        },
        switch: function () {
            return '<div class="form-group clearfix">' +
                '  <div class="form-label-left">' +
                '    <legend class="col-form-label pt-0" for="{{id}}">{{label}}</legend>' +
                '  </div>' +
                '  <div class="flex-auto">' +
                '    <div class="custom-control custom-switch">' +
                '      <input type="checkbox" value="true" {{~if(value)}} checked {{~end}} data-attr="{{name}}" ' +
                '           class="custom-control-input onchange" id="{{id}}" />' +
                '      <label class="custom-control-label" for="{{id}}"></label>' +
                '    </div>' +
                '  </div>' +
                '</div>';
        },
        checkbox: function () {
            return '<div class="form-group clearfix">' +
                '  <div class="form-label-left">' +
                '    <legend class="col-form-label pt-0">{{label}}</legend>' +
                '  </div>' +
                '  <div class="flex-auto">' +
                '    {{~ for(let option of options)}}' +
                '    <div class="form-check form-check-inline">' +
                '      <input class="form-check-input onchange" {{~ if(value.indexOf(option.value) >=0 )}} checked {{~end}} ' +
                '           type="checkbox" data-attr="{{name}}" data-type="array"' +
                '           id="{{option.value}}-{{id}}" value="{{option.value}}" />' +
                '      <label class="form-check-label" for="{{option.value}}-{{id}}">{{option.text}}</label>' +
                '    </div>' +
                '    {{~end}}' +
                '  </div>' +
                '</div>';
        },
        radio: function () {
            return '<div class="form-group clearfix">' +
                '  <div class="form-label-left">' +
                '    <legend class="col-form-label pt-0">{{label}}</legend>' +
                '  </div>' +
                '  <div class="flex-auto">' +
                '    {{~ for(let option of options)}}' +
                '    <div class="form-check form-check-inline">' +
                '      <input class="form-check-input onchange" name="{{id}}" type="radio" ' +
                '           {{~ if(value == option.value )}} checked {{~end}} ' +
                '           data-attr="{{name}}" id="{{option.value}}-{{id}}" value="{{option.value}}" />' +
                '      <label class="form-check-label" for="{{option.value}}-{{id}}">{{option.text}}</label>' +
                '    </div>' +
                '    {{~end}}' +
                '  </div>' +
                '</div>';
        },
        options: function () {
            return '<div class="option-box options">' +
                '  <div class="divider-title option-filtered">选项</div>' +
                '  {{~for (let option of options)}}' +
                '  <div class="form-group form-check-inline clearfix option-item">' +
                '    <i class="bi bi-arrows-move pointer pr-2 option-handle"></i>' +
                '    <input type="text" value="{{option.text}}" class="form-control mr-2 option-input text" />' +
                '    <input type="text" value="{{option.value}}" class="form-control mr-2 option-input value" />' +
                '    <i class="bi bi-dash-square pointer option-delete"></i>' +
                '  </div>' +
                '  {{~end}}' +
                '  <div class="text-center option-filtered">' +
                '    <button type="button" class="btn btn-primary btn-sm option-add">添 加</button>' +
                '  </div>' +
                '</div>';
        },
    }

    //bsFormBuilder 内置组件
    var defaultComponents = [
        //单行输入框定义
        {
            "name": "输入框",
            "tag": "input",
            "drag": {
                "title": "输入框",
                "type": "base",
                "index": 100,
                "iconClass": "bi bi-terminal"
            },
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
                    type: "number",
                    label: "行数",
                    placeholder: "请输入行数...",
                    defaultValue: 3,
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
                    type: "radio",
                    label: "栅格数",
                    defaultValue: 2,
                    options: [
                        {
                            value: 2,
                            text: 2
                        },
                        {
                            value: 3,
                            text: 3
                        },
                        {
                            value: 4,
                            text: 4
                        }
                    ],
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
            "onAdd": function (bsFormBuilder, data) {
                var $row = $('#' + data.elementId).children(".form-group").children();
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
                var $row = $('#' + currentData.elementId).children(".form-group").children();
                var gridCount = $row.children().length;

                // 当前存在 grid 数量大于设置的数据，需要移除最后的几个 grid
                if (gridCount > intValue) {
                    for (let i = 0; i < gridCount - intValue; i++) {
                        var $lastCol = $row.children(":last");
                        var bsItemSortable = $lastCol.data("bsItemSortable");

                        //销毁 sortable
                        if (bsItemSortable) {
                            bsItemSortable.destroy();
                        }

                        var index = $lastCol.attr("data-index");

                        //移除 data 里的 children 数据
                        if (currentData.children && currentData.children[index]) {
                            delete currentData.children[index];
                        }

                        $lastCol.remove();
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

        //bsFormBuilder 配置信息
        this.options = $.extend(defaultOptions, options);

        //每个组件的默认属性
        this.defaultProps = $.extend(defaultProps, options.props);

        //每个 prop 显示的 html 模板
        this.propTemplates = $.extend(defaultPropTemplates, options.propTemplates);

        //当前的开启的组件
        this.useComponents = options.useComponents || [];

        //根节点元素
        this.$rootEl = $(element);

        //设计容器 div
        this.$container = null;

        //设计的占位 div
        this.$containerPlaceHolder = null;

        //属性面板
        this.$propsPanel = null;

        //所有的组件, map(key== tag, value == component)
        this.components = {};

        //渲染的数据, map(key == id, value == component)
        this.datas = [];

        //当前获得焦点的组件
        this.currentData = null;

        //组件序号记录器，用于在添加组件的时候，生成组件的 name
        this.componentCounter = 1;

        //初始化
        if (this.options.mode === "view") {
            this._initViewMode();
        } else {
            this._initBuilderMode();
        }
    }


    //BsFormBuilder 方法定义
    BsFormBuilder.prototype = {

        /**
         * 初始化 view
         * @private
         */
        _initViewMode: function () {
            //初始化 view 的 html 结构
            this._initViewStructure();

            this.$container = this.$rootEl.find('.bsFormContainer');

            //初始化默认的组件库
            this._initComponents();

            //初始化 data 数据
            this._initData(this.options.datas, true);

            //渲染 view 的数据到 html
            this._refreshViewContainer();

            //onInit 回调
            this._invokeOnInitCallback();
        },

        /**
         * 初始化 Builder
         */
        _initBuilderMode: function () {
            //初始化 html 基础结构
            this._initBuilderStructure();

            this.$container = this.$rootEl.find('.bsFormContainer');
            this.$containerPlaceHolder = this.$rootEl.find('.placeholder-box');
            this.$propsPanel = this.$rootEl.find("#component-props-content");

            //初始化默认的组件库
            this._initComponents();

            //初始化操作按钮
            this._initFormActionButtons();

            //初始化拖动的组件
            this._initDragComponents();

            //初始化 data 数据
            this._initData(this.options.datas, true);

            //初始化 options 导入的 data 的数据
            this._refreshBuilderContainer();

            //初始化表单事件监听
            this._initEvents();

            //初始化拖动组件
            this._initSortables();

            //onInit 回调
            this._invokeOnInitCallback();

        },

        /**
         * 回调 onInit
         * @private
         */
        _invokeOnInitCallback: function () {
            if (typeof this.options.onInit === "function") {
                this.options.onInit(this);
            }
        },


        /**
         * 初始化 options.datas 的 mode 的数据
         * @private
         */
        _initData: function (array, pushToRoot) {
            if (!array || array.length === 0) {
                return;
            }

            //根据 index 对 dataArray 进行升序排序
            //越小越靠前
            array.sort((a, b) => a.index - b.index);

            for (let data of array) {
                //此时的 data 是没有和 component 绑定的
                let component = this.components[data.tag];
                if (!component) {
                    console.warn("Can not find tag: " + data.tag);
                    continue;
                }


                //为 data 设置 component 的默认数据
                if (component.props) {
                    for (const prop of component.props) {
                        if (prop.defaultValue && !data[prop.name]) {
                            data[prop.name] = prop.defaultValue;
                        }
                    }
                }

                //初次导入的 data 是没有 component 和 elementId 属性的
                //需要为 data 添加 component 和 elementId 属性
                data.component = component;
                data.elementId = this.genRandomId();

                if (data.children) {
                    for (let arr of Object.values(data.children)) {
                        this._initData(arr, false)
                    }
                }

                //把 data 数据添加到 bsFormBuilder 的 datas 属性里
                if (pushToRoot) {
                    this.datas.push(data);
                }
            }
        },


        /**
         * 渲染 view 的数据
         * @private
         */
        _refreshViewContainer: function () {
            $(".bsFormContainer").children(".bs-form-item").remove();
            for (let data of this.datas) {
                var html = this.render(data, false).outerHTML;
                this.$container.append(html)
            }
        },


        /**
         * 初始化 view 的 html 结构
         * @private
         */
        _initViewStructure: function () {
            this.$rootEl.append('<div class="row bsFormViewRoot"><div class="col-12 bsFormContainer"></div></div>');
        },

        /**
         * 初始化 builder 的 html 结构
         * @private
         */
        _initBuilderStructure: function () {
            this.$rootEl.append(' <div class="row bsFormBuilderRoot">' +
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
                '                <div class="w-100 pd10 border-bottom text-right pt-1 pb-1 bsFormActions">' +
                '                </div>' +
                '                <div style="width: 100%;" class="bsFormContainer">' +
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


        _initFormActionButtons: function () {
            let template = this.options.buttonTemplate;
            if (!template || template === "") {
                return;
            }

            let body = this._getRenderMethodBody(template);

            let buttons = this.options.buttons || [];
            for (let button of buttons) {
                let paras = ["$button", "text", "mainClass", "iconClass", "onclick"];

                let values = paras.map(k => button[k] || "");
                values[0] = button;

                let html = new Function(...paras, body)(...values)
                    .replace(/\&#39;/g, '\'').replace(/\&quot;/g, '"');

                $(".bsFormActions").append(html);
            }
        },

        /**
         * 初始化系统组件
         * @private
         */
        _initComponents: function () {
            var useComponents = this.options.useComponents;
            if (!useComponents) useComponents = [];

            for (let component of defaultComponents) {
                if (component && (useComponents.length === 0 || useComponents.indexOf(component.tag) > -1)) {
                    this.components[component.tag] = component;
                }
            }

            //插件定义的 components 定义
            if (window.bsComponentsDef) {
                for (let component of window.bsComponentsDef) {
                    if (component && (useComponents.length === 0 || useComponents.indexOf(component.tag) > -1)) {
                        this.components[component.tag] = component;
                    }
                }
            }


            //用户自定义组件
            var customComponents = this.options.components;
            if (typeof customComponents === "function") {
                customComponents = customComponents();
            } else {
                customComponents = customComponents || [];
            }

            //用户自定义的 component 继承来自已经存在的 component
            //这样，用户可以不用配置系统已经存在的配置信息
            for (let component of customComponents) {
                component = $.extend(this.components[component.tag], component);
                this.components[component.tag] = component;
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
         * 渲染初始化的数据
         */
        _refreshBuilderContainer: function () {
            $(".bsFormContainer").children(".bs-form-item").remove();
            if (!this.datas || this.datas.length === 0) {
                this.$containerPlaceHolder.show();
            } else {
                this.$containerPlaceHolder.hide();
                for (let data of this.datas) {
                    var html = this.render(data, false).outerHTML;
                    this.$container.append(html);
                    this._invokeComponentOnAdd(data);
                }
            }
        },

        /**
         * 初始化 bsFormBuilder 的事件机制
         * @private
         */
        _initEvents: function () {
            var bsFormBuilder = this;
            //container 下的每个 item 的点击事件
            $(".bsFormContainer").on("click", ".bs-form-item", function (event) {
                console.log("bs-form-item click >>>>>>", event)
                event.stopPropagation();
                bsFormBuilder.makeFormItemActive($(this).attr('id'));
            })


            //container 下的每个 item 的 复制按钮 的点击事件
            $(".bsFormContainer").on("click", ".bs-item-copy", function (event) {
                event.stopPropagation();
                var currentId = $(this).closest('.bs-form-item').attr('id');
                bsFormBuilder.copyFormItem(currentId);
            })

            //container 下的每个 item 的 复制按钮 的删除事件
            $(".bsFormContainer").on("click", ".bs-item-del", function (event) {
                event.stopPropagation();
                var $bsFormItem = $(this).closest('.bs-form-item');
                bsFormBuilder.deleteFormItem($bsFormItem.attr("id"));
            })

            //props 事件
            var propsEventFunction = function (event) {
                var attr = $(this).attr('data-attr');
                var value = $(this).val();

                //数据类型
                var type = $(this).attr("data-type");

                //数据类型如果是数组
                if (type === "array") {
                    var oldValue = bsFormBuilder.currentData[attr] || [];
                    var index = oldValue.indexOf(value);
                    if (event.currentTarget.type === "checkbox") {
                        //添加
                        if (event.currentTarget.checked && index == -1) {
                            oldValue.push(value)
                        }
                        //移除
                        else if (!event.currentTarget.checked && index >= 0) {
                            oldValue.splice(index, 1)
                        }
                    }
                    value = oldValue;
                } else {
                    // 若是 checkbox，value 值是 checkbox 的选中状态
                    if (event.currentTarget.type === "checkbox") {
                        value = event.currentTarget.checked;
                    }
                }


                //没有选中的组件，理论上不存在这种情况
                if (!bsFormBuilder.currentData) {
                    console.error("error: Current data not exits!!!")
                } else {
                    bsFormBuilder.updateDataAttr(bsFormBuilder.currentData, attr, value)
                }
            }

            //监听属性面板的输入框的输入事件
            this.$propsPanel.on("keyup", ".onkeyup", propsEventFunction);
            this.$propsPanel.on("change", ".onchange", propsEventFunction);


            this.$propsPanel.on("keyup", ".option-input", function () {
                bsFormBuilder._syncCurrentDataOptionsFromPropSetting();
            });

            //删除 item
            this.$propsPanel.on("click", ".option-delete", function (event) {
                $(this).closest(".option-item").remove();
                bsFormBuilder._syncCurrentDataOptionsFromPropSetting();
            });

            //添加 item
            this.$propsPanel.on("click", ".option-add", function (event) {
                var options = bsFormBuilder.currentData.options || [];
                options.push({text: "选项", value: "值"})

                bsFormBuilder.updateDataAttr(bsFormBuilder.currentData, "options", options);
                bsFormBuilder.refreshPropsPanel();
            });


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

            new Sortable(document.querySelector('.bsFormContainer'), {
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
            if ($to.is(".bsFormContainer")) {
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
            this._invokeComponentOnAdd(data);


            //让当前的组件处于选中状态
            this.makeFormItemActive(data.elementId);
            this.refreshDataIndex($to);
        },


        /**
         * 执行 component 的 onAdd 方法
         * @private
         */
        _invokeComponentOnAdd: function (data) {
            if (data.component && typeof data.component.onAdd === "function") {
                data.component.onAdd(this, data);
            }
        },


        /**
         * 监听 container 拖动组件
         * @param evt
         * @private
         */
        _onDragEnd: function (evt) {
            this.refreshDataIndex($(evt.from))
        },


        /**
         * 获取渲染方法
         * @param template
         * @private
         */
        _getRenderMethodBody: function (template) {
            let body = template.replace(/\'/g, "&#39;")
                .replace(/\"/g, "&quot;")
                .replace(/[\r\n\t]/g, "")
                .replace(/\{\{.+\&#39;*.\}\}/g, x => {
                    return x.replace(/\&#39;/g, "\'")
                })
                .replace(/\{\{.+\&quot;*.\}\}/g, x => {
                    return x.replace(/\&quot;/g, '"')
                })
                .replace(/\{\{~\s*end\s*\}\}/g, "\"}ret+=\"")
                .replace(/\{\{~\s*else\s*\}\}/g, () => {
                    return '";}else{ ret+="';
                })
                .replace(/\{\{~\s*elseif.+?\}\}/g, x => {
                    return x.replace("elseif", "}else if")
                })
                .replace(/\{\{~(.+?)\}\}/g, (_, x) => {
                    return '";' + x + '{ ret+="';
                })
                .replace(/\{\{(.+?)\}\}/g, (_, x) => {
                    return '"; ret+= ' + x + '; ret+="';
                });
            return 'let ret=""; ret += "' + body + '";return ret;';
        },


        /**
         * 初始化 data 的 options
         * @param data
         * @private
         */
        _initDataOptionsIfNecessary: function (data) {
            if (data.component.withOptions && !data.options) {
                var defaultOptions = data.component.defaultOptions;
                if (typeof defaultOptions === "function") {
                    defaultOptions = data.component.defaultOptions(this, data);
                }
                data.options = defaultOptions || [];
            }
        },

        /**
         * 获取属性模板
         * @param type
         * @returns {*}
         * @private
         */
        _getPropTemplateByType: function (type) {
            let template = this.propTemplates[type];
            if (typeof template === "function") {
                template = template();
            }
            return template;
        },


        /**
         * 同步 currentData 的 options
         * @private
         */
        _syncCurrentDataOptionsFromPropSetting: function () {
            var options = [];
            var optionItems = this.$propsPanel.children(".options").children(".option-item");
            optionItems.each(function (index, item) {
                var text = $(item).children(".option-input.text").val();
                var value = $(item).children(".option-input.value").val();
                options.push({text, value});
            });
            this.updateDataAttr(this.currentData, "options", options);
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

            let children = [];
            if (typeof data.children === "object") {
                for (let key of Object.keys(data.children)) {
                    let childArray = data.children ? data.children[key] : [];
                    let htmlContent = "";
                    if (childArray) {
                        for (let item of childArray) {
                            let html = this.render(item, false);
                            if (html) htmlContent += html.outerHTML;
                        }
                    }
                    children[key] = htmlContent;
                }
            }

            let childrenProxy = new Proxy(children, {
                get: function (target, attr) {
                    return target[attr] || "";
                }
            })


            let body = this._getRenderMethodBody(data.component.template);

            // 若 data 中不存在 options 数据，
            // 那么查看下组件是否有 defaultOptions 配置
            this._initDataOptionsIfNecessary(data);


            //default props + component.props + "value" + "placeholder" +"options"
            var allPropNames = this.defaultProps.map(prop => prop.name).concat(["value", "placeholder", "options"]);
            if (data.component.props) {
                allPropNames = allPropNames.concat(data.component.props.map(prop => prop.name));
            }

            var paras = ["$builder", "$component", "$data", "$children"].concat(allPropNames);

            var values = paras.map(k => data[k] || "");
            values[0] = this;
            values[1] = data.component;
            values[2] = data;
            values[3] = childrenProxy;

            return new Function(...paras, body)(...values)
                .replace(/\&#39;/g, '\'').replace(/\&quot;/g, '"');
        },


        /**
         * 深度拷贝
         * @param target 拷贝目标
         * @param withNewElementIdAndId 是否为 elementId 和 id 设置新的值
         * @returns {*[]}
         * @private
         */
        deepCopy: function (target, withNewElementIdAndId) {
            var newObject = Array.isArray(target) ? [] : {};
            if (target && typeof target === "object") {
                for (let key in target) {
                    if (target.hasOwnProperty(key)) {
                        if (target[key] && typeof target[key] === "object") {
                            newObject[key] = this.deepCopy(target[key], withNewElementIdAndId);
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
                    template = component.render(this, component, data);
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


            this.refreshPropsPanel();
        },

        /**
         * 删除组件
         * @param id
         */
        deleteFormItem: function (elementId) {
            if (this.currentData && this.currentData.elementId === elementId) {
                this.currentData = null;
                this.refreshPropsPanel();
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
            this._invokeComponentOnAdd(newData);


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
         * @param array
         * @param elementId
         * @returns {null|*}
         */
        getDataByElementIdInArray: function (array, elementId) {
            if (!array || array.length === 0) {
                return null;
            }

            for (let item of array) {
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
         * @param array 要删除的数组
         * @param elementId 根据 elementId 来删除
         */
        removeDataByElementIdInArray: function (array, elementId) {
            if (!array || array.length === 0) {
                return;
            }

            for (let i = 0; i < array.length; i++) {
                let item = array[i];
                if (item && item.elementId === elementId) {
                    array.splice(i, 1);
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
         * @param array
         * @param elementId
         */
        getParentArrayByElementIdInArray: function (array, elementId) {
            if (!array || array.length === 0) {
                return null;
            }

            for (let i = 0; i < array.length; i++) {
                let item = array[i];
                if (item && item.elementId === elementId) {
                    return array;
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
         * @param $parentEl
         */
        refreshDataIndex: function ($parentEl) {
            var bsFormBuilder = this;
            $parentEl.children(".bs-form-item").each(function (index, item) {
                var id = $(item).attr("id");
                var data = bsFormBuilder.getDataByElementId(id);
                data['index'] = index;
            })
        },


        /**
         * 刷新右侧的属性面板
         */
        refreshPropsPanel: function () {
            if (!this.currentData) {
                return;
            }

            let component = this.currentData.component;

            //销毁旧的 sortable
            var oldSortable = this.$propsPanel.children(".options").data("sortable");
            if (oldSortable) oldSortable.destroy();


            this.$propsPanel.html('');

            //组件定义的 "私有" 属性
            var componentProps = typeof component.props === "object" ?
                component.props : [];

            //组件定义的过滤器
            let propsfilter = typeof component.propsfilter === "function"
                ? component.propsfilter(this, this.currentData)
                : (typeof component.propsfilter === "object" ? component.propsfilter : []);


            // 全部属性
            var allProps = this.defaultProps.concat(componentProps);


            for (let prop of allProps) {
                // 若组件定义了 propsfilter 过滤
                // 那么，定义的 propsfilter 只有包含 prop，prop 才能正常被渲染
                // ps：只有系统定义的 props 才会被过滤，组件自己的 props 不会被过滤
                if (componentProps.indexOf(prop) < 0
                    && propsfilter && propsfilter.length > 0
                    && propsfilter.indexOf(prop.name) < 0) {
                    continue;
                }

                var template = this._getPropTemplateByType(prop.type);

                var newProp = this.deepCopy(prop, false);
                newProp["id"] = this.genRandomId();
                newProp["value"] = this.currentData[prop.name];

                var html = this.renderPropTemplate(newProp, this.currentData, template);
                this.$propsPanel.append(html);
            }

            // 渲染 options 功能
            if (this.currentData.options || this.currentData.component.withOptions) {
                let prop = {
                    id: this.genRandomId(),
                    options: this.currentData.options || [],
                }

                let template = this._getPropTemplateByType("options");
                let html = this.renderPropTemplate(prop, this.currentData, template);
                this.$propsPanel.append(html);

                this._initOptionsSortable();

            }
        },

        /**
         * 初始化 Options 的 dragable 组件
         */
        _initOptionsSortable: function () {
            var $optionsEl = this.$propsPanel.children(".options");
            var sortable = new Sortable($optionsEl[0], {
                handle: '.option-handle', // handle's class
                filter: '.filtered', // 'filtered' class is not draggable
                animation: 150,
                onEnd: () => this._syncCurrentDataOptionsFromPropSetting(),
            });
            $optionsEl.data("sortable", sortable);
        },


        /**
         * 渲染属性模板
         * @param prop
         * @param data
         * @param template
         * @returns {*}
         */
        renderPropTemplate: function (prop, data, template) {

            var body = this._getRenderMethodBody(template);

            var paras = ["$prop", "$data"].concat(Object.keys(prop));

            var values = paras.map(k => prop[k] || "");
            values[0] = prop;
            values[1] = data;

            try {
                return new Function(...paras, body)(...values)
                    .replace(/\&#39;/g, '\'').replace(/\&quot;/g, '"');
            } catch (err) {
                console.error(err);
                console.error("template >>>", template);
                return "";
            }

        },


        /**
         * 导出 json
         */
        exportToJson: function () {
            var exportData = this.deepCopy(this.datas, false);
            this._arrangeExportData(exportData);
            return JSON.stringify(exportData);
        },


        /**
         * 整理导出数据
         * 1、删除 component 数据
         * 2、删除 element 数据
         * 3、对 dataArray 根据 index 进行排序
         * @param array
         * @private
         */
        _arrangeExportData: function (array) {
            if (!array || array.length === 0) {
                return;
            }

            //根据 index 对 dataArray 进行升序排序
            //越小越靠前
            array.sort((a, b) => a.index - b.index);

            for (let data of array) {
                delete data.component;
                delete data.elementId;
                if (data.children) {
                    for (let arr of Object.values(data.children)) {
                        this._arrangeExportData(arr);
                    }
                }
            }
        },

        /**
         * 获取 datas 数据，并可以对其进行修改
         */
        getDatas: function () {
            return this.datas;
        },

        /**
         * 添加 data 数据到 跟节点容器
         * @param data
         */
        addDataToRoot: function (data) {
            this.addDatasToRoot([data]);
        },

        /**
         * 添加一个 data 数组到跟节点容器
         * @param array
         */
        addDatasToRoot: function (array) {
            this._initData(array, true);

            if (this.isBuilderMode()) {
                this._refreshBuilderContainer();
            } else if (this.isViewMode()) {
                this._refreshViewContainer();
            }
        },
        /**
         * 添加 data 数据到子容器节点
         * @param data
         */
        addDataToContainer: function (data, containerElementId, index) {
            this.addDatasToContainer([data], containerElementId, index);
        },

        /**
         * 添加一个 data 数组到子容器节点
         * @param array
         */
        addDatasToContainer: function (array, containerElementId, index) {

            this._initData(array, false);

            var parentData = this.getDataByElementId(containerElementId);
            if (!parentData) {
                console.error("Can not find data by elementId: " + containerElementId);
                return;
            }

            if (!parentData.children) {
                parentData.children = {};
            }

            if (!parentData.children[index]) {
                parentData.children[index] = [];
            }

            parentData.children[index].push(...array);

            this.refreshDataElement(parentData);
        },

        /**
         * 刷新数据到 html 显示
         * @param data
         */
        refreshDataElement: function (data) {
            var newHtml = this.render(data, true);
            $("#" + data.elementId).replaceWith(newHtml);
        },

        /**
         * 更新 data 属性，并同步到 html
         * @param data
         * @param attr
         * @param value
         */
        updateDataAttr: function (data, attr, value) {
            if (!data) {
                console.error("data must not be null.");
                return;
            }

            //若没有传入 value 值，设置为默认值
            if ((!value || value === "") && data.component.defaultValue) {
                value = data.component.defaultValue;
            }


            if (value === "true") value = true;
            else if (value === "false") value = false;

            //更新组件的 data 数据
            data[attr] = value;

            //当前组件定义了 onPropChange 监听方法，并且该方法执行成功了
            //那么，可以理解为该方法会去更新 html 内容，而不通过系统继续渲染了
            if (data.component && typeof data.component.onPropChange === "function"
                && data.component.onPropChange(this, data, attr, value)) {
                return;
            }

            this.refreshDataElement(data);
        },

        /**
         * 是否是视图模式
         */
        isViewMode: function () {
            return this.options.mode === "view";
        },


        /**
         * 是否是构建工具模式
         */
        isBuilderMode: function () {
            return this.options.mode === "builder";
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
