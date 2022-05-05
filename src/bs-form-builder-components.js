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

let bsComponentsDef = window.bsComponentsDef || [];
window.bsComponentsDef = bsComponentsDef;

bsComponentsDef.push(...[
    //提示
    {
        "name": "提示",
        "tag": "tips",
        "drag": {
            "title": "提示",
            "type": "assist",
            "index": 100,
            "iconClass": "bi bi-info-circle"
        },
        "propsfilter": ["id"],
        props: [
            {
                name: "title",
                type: "input",
                label: "提示内容",
                placeholder: "提示内容...",
                disabled: false,
                required: true,
            }
        ],
        "template": '<div class="bs-form-item" id="tips">' +
            '  <div class="form-group clearfix">' +
            '    <i class="d-inline-block bi bi-exclamation-circle"' +
            '      data-toggle="tooltip"' +
            '      data-placement="right"' +
            '      title="{{title}}"' +
            '    ></i>' +
            '  </div>' +
            '</div>',
    },

    //下拉菜单
    {
        "name": "下拉菜单",
        "tag": "select",
        "drag": {
            "title": "下拉菜单",
            "type": "base",
            "index": 100,
            "iconClass": "bi bi-card-checklist"
        },
        withOptions: true,
        defaultOptions: [
            {
                text: "选项1",
                value: "value1"
            },
            {
                text: "选项2",
                value: "value2"
            }
        ],
        "template": '<div class="bs-form-item">' +
            '  <div class="form-group clearfix">' +
            '    <div class="form-label-left">' +
            '      <legend class="col-form-label pt-0">{{label}}</legend>' +
            '    </div>' +
            '    <div class="flex-auto">' +
            '      <select class="custom-select">' +
            '        {{~for(let option of options)}}' +
            '        <option value="{{option.value}}">{{option.text}}</option>' +
            '        {{~end}}' +
            '      </select>' +
            '    </div>' +
            '  </div>' +
            '</div>',
    },

]);

