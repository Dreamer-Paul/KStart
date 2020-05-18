/* ----

# KStart
# By: Dreamer-Paul
# Last Update: 2020.5.18

一个简洁不失细节的起始页

本代码为奇趣保罗原创，并遵守 MIT 开源协议。欢迎访问我的博客：https://paugram.com

---- */

var obj = {
    header: {
        about: ks.select(".about-btn"),
        setting: ks.select(".setting-btn")
    },
    main: {
        select: ks.select(".search-select"),
        search: ks.select(".search-selector"),
        input: ks.select(".input-box input"),
        submit: ks.select(".input-box .btn"),
        sites: ks.select(".navi-items")
    },
    window: {
        wrap: ks.select("window"),
        item: ks(".the-window"),
        close: ks(".window-head button")
    },
    settings: {
        search: ks.select("[name=search]"),
        background: ks.select("[name=background]"),
        sites: ks.select("[name=sites]")
    },
    settingBtn: {
        reset: ks.select("[name=reset]"),
        output: ks.select("[name=output]")
    }
}

var data = {
    timer: "",
    window: 0,
    search_method: [
        {
            "name": "百度",
            "icon": "baidu",
            "url": "https://www.baidu.com/s?wd=%s"
        },
        {
            "name": "必应",
            "icon": "bing",
            "url": "https://cn.bing.com/search?q=%s"
        },
        {
            "name": "谷歌",
            "icon": "google",
            "url": "https://www.google.com/search?q=%s"
        },
        {
            "name": "360",
            "icon": "360so",
            "url": "https://www.so.com/s?q=%s"
        },
        {
            "name": "DuckDuckGo",
            "icon": "duckduckgo",
            "url": "https://duckduckgo.com/?q=%s"
        }
    ],
    user: {
        search: 0,
        background: false,
        sites: [],
        custom: []
    }
}


var methods = {
    get: function (webData) {
        var readData = JSON.parse(localStorage.getItem("paul-navi")) || webData;

        for(var item in readData){
            data.user[item] = readData[item];
        }
    },
    set: function () {
        if(data.sites){
            var sites = [];
            for(var site of data.sites){
                if(site.selected) sites.push(site.value);
            }
        }

        localStorage.setItem("paul-navi", JSON.stringify(data.user));
    },
    clear: function () {
        localStorage.clear("paul-navi");
        ks.notice("本地设置已清除，刷新页面后将读取默认配置", {color: "green", time: 5000});
    },
    output: function () {
        ks.notice("本功能制作中，敬请期待", {color: "yellow", time: 3000});
    },
    getUser: function () {
        var name = location.search.split("u=");

        return name ? name[1] : false;
    },
    changeSearch: function (key) {
        obj.main.search.classList.remove("active");
        data.user.search = key;
        if(data.search_method[key].icon) obj.main.select.innerHTML = `<i class="iconfont icon-${data.search_method[key].icon}"></i>`;
    },
    createItem: function (item) {
        var content = item.icon ? '<i class="' + item.icon + '"></i>' : item.name.substr(0, 1);

        return ks.create("a", {
            html: `<a class="item" href="${item.url}">
            <figure class="navi-icon" style="background: #${item.color || Math.random().toString(16).substr(-6)}">
                ${content}
            </figure>
            <p class="navi-title">${item.name}</p>
        </a>`
        });
    },
    openWindow: function (key) {
        data.window = key;
        obj.window.wrap.classList.add("active");
        obj.window.item[key].classList.add("active");
    },
    closeWindow: function () {
        data.timer = clearTimeout(methods.closeWindow);

        obj.window.item[data.window].classList.remove("closed");
        obj.window.item[data.window].classList.remove("active");

        obj.window.wrap.classList.remove("active");
    },
    closeWindow2: function () {
        if(!data.timer){
            data.timer = setTimeout(methods.closeWindow, 300);
        }

        obj.window.item[data.window].classList.add("closed");
    },

    form: {
        multiple: function (type, select, data) {
            // 读取表单转数组
            if(type == "get"){
                var selected = [];

                for(var item of select){
                    if(item.selected) selected.push(parseInt(item.value));
                }

                return selected;
            }
            // 读取数组转表单
            else{
                for(var item of data){
                    select[item].selected = true;
                }
            }
        }
    },

    setSetting: function () {
        var set = data.user;

        for(item in set){
            if(!obj.settings[item]) return;

            let type, i = item;

            switch(obj.settings[item].type){
                case "text": type = "value"; break;
                case "checkbox": type = "checked"; break;
                case "select-one": type = "value"; break;
                case "select-multiple": type = "options"; break;
            }

            if(type !== "options"){
                obj.settings[item][type] = set[item];

                obj.settings[item].onchange = function (ev) {
                    data.user[i] = ev.target[type];
    
                    methods.set();
                }
            }
            else{
                // 设置表单
                methods.form.multiple("set", obj.settings[item], set[item]);

                obj.settings[item].onchange = function (ev) {
                    // 读取表单
                    data.user[i] = methods.form.multiple("get", obj.settings[i], set[item]);

                    methods.set();
                }
            }
        }
    }
}

// 搜索
obj.main.select.onclick = function () {
    obj.main.search.classList.toggle("active");
}
obj.main.submit.onclick = (e) => {
    e.preventDefault();
    window.open(data.search_method[data.user.search].url.replace("%s", obj.main.input.value));
}

// 打开按钮
obj.header.about.onclick = function () {
    methods.openWindow(0);
}
obj.header.setting.onclick = function () {
    methods.openWindow(1);
}

// 关闭面板
obj.window.wrap.onclick = function (e) {
    if(e.target == obj.window.wrap){
        methods.closeWindow2();
    }
}

// 关闭按钮
obj.window.close.each((item) => {
    item.onclick = methods.closeWindow2;
})

data.search_method.forEach((item, key) => {
    var a = ks.create("div", {
        class: "item",
        text: item.name,
        parent: obj.main.search
    });
    a.onclick = () => methods.changeSearch(key);
})

// 重置按钮
obj.settingBtn.reset.onclick = methods.clear;
obj.settingBtn.output.onclick = methods.output;

// 初始化
fetch("https://dreamer-paul.github.io/KStart-Sites/site.json").then(res => res.json()).then((res) => {
    res.forEach((item, key) => {
        ks.create("option", {
            text: item.name,
            attr: {
                name: "value",
                value: key
            },
            parent: obj.settings.sites
        });
    });

    return res;
}).then((res) => {
    var url = "https://dreamer-paul.github.io/KStart-Sites/" + (methods.getUser() ? methods.getUser() : "default") + ".json";

    fetch(url).then(res => res.json()).then(json => {
        // 读取在线、本地或默认数据
        methods.get(json);

        // 用户自定义站点
        if(json.custom){
            json.custom.forEach((item) => {
                obj.main.sites.appendChild(methods.createItem(item));
            });
        }

        // 如果
        if(data.user.sites.length){
            data.user.sites.forEach((item) => {
                obj.main.sites.appendChild(methods.createItem(res[item]));
            });
        }
        else{
            console.error("这个一般不会触发吧？");
        }
    }).then(() => {

        methods.changeSearch(data.user.search);

        if(data.user.background){
            document.body.style.backgroundImage = "url(http://api.paugram.com/wallpaper?source=gt)";
        }

        data.search_method.forEach((item, key) => {
            ks.create("option", {
                text: item.name,
                attr: {
                    name: "value",
                    value: key
                },
                parent: obj.settings.search
            });
        });

        methods.setSetting();
    })
});
