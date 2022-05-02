function render(template, data) {
    let body = template.replace(/\'/g, "&#39;")
        .replace(/\"/g, "&quot;")
        .replace(/[\r\n\t]/g, "")
        .replace(/\{\{~end\}\}/g, "\"}\"")
        .replace(/\{\{~(.+?)\}\}/g, (_, p1) => {
            return '";' + p1 + '{ ret+="';
        })
        .replace(/\{\{(.+?)\}\}/g, (_, p1) => {
            return '"; ret+= "" +' + p1 + ' +""; ret+="';
        });
    body = 'let ret=""; ret += "' + body + '";return ret;';

    var paras = ["$data", "id", "label", "placeholder", "value"];
    let func = new Function(...paras, body);

    var values = paras.map(k => data[k] || "");
    values[0] = data;

    let ret = func(...values);

    return ret.replace(/&#39;/g, '\'').replace(/\&quot;/g, '"');
}


