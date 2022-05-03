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
                name: "value",
                type: "input",
                label: "提示内容",
                placeholder: "提示内容...",
                disabled: false,
                required: true,
            }
        ],
        "template": ' <div class="bs-form-item" id="tips">' +
            '             <div class="form-group clearfix">' +
            '                 <i class="d-inline-block bi bi-exclamation-circle" data-toggle="tooltip"' +
            '                    data-placement="right" title="{{value}}"></i>' +
            '             </div>' +
            '          </div>',
    },

]);

