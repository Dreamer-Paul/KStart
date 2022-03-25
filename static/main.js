/* ----

# KStart
# By: Dreamer-Paul
# Last Update: 2022.3.25

一个简洁轻巧的起始页

本代码为奇趣保罗原创，并遵守 MIT 开源协议。欢迎访问我的博客：https://paugram.com

---- */

const obj = {
    header: {
        updated: ks.select(".action-btn.updated"),
        about: ks.select(".action-btn.about"),
        setting: ks.select(".action-btn.setting")
    },
    main: {
        select: ks.select(".search-select"),
        search: ks.select(".search-selector"),
        input: ks.select(".input-box input"),
        submit: ks.select(".input-box .btn"),
        sites: ks.select(".navi-items"),
        bg: ks.select(".navi-background")
    },
    window: {
        wrap: ks.select("window"),
        item: ks(".the-window")
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

const data = {
    ver: "1.1.0",
    timer: "",
    window: 0,
    background_type: [
        {
            "name": "无背景"
        },
        {
            "name": "随机动漫壁纸",
            "url": "https://api.paugram.com/wallpaper?source=gh",
            "set": "bottom right/60% no-repeat"
        },
        {
            "name": "必应每日壁纸",
            "url": "https://api.paugram.com/bing",
            "set": "center/cover no-repeat"
        }
    ],
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
            "name": "搜狗",
            "icon": "sogou",
            "url": "https://www.sogou.com/web?query=%s"
        },
        {
            "name": "DuckDuckGo",
            "icon": "duckduckgo",
            "url": "https://duckduckgo.com/?q=%s"
        }
    ],
    user_set: {
        search: 0,
        background: 0,
        sites: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 16, 28, 31, 35],
        custom: []
    }
}

// 各种方法
const methods = {
    // 存储相关
    getStorage: () => {
        const storage = localStorage.getItem("paul-userset");

        return storage ? JSON.parse(localStorage.getItem("paul-userset")) : undefined;
    },
    setStorage: () => {
        if(data.sites){
            var sites = [];

            for(var site of data.sites){
                if(site.selected) sites.push(site.value);
            }
        }

        localStorage.setItem("paul-userset", JSON.stringify(data.user_set));

        ks.notice("设置已保存至本地！", { color: "green", time: 3000 });
    },
    clearStorage: () => {
        localStorage.removeItem("paul-userset");

        ks.notice("本地设置已清除，刷新页面后将读取默认配置！", { color: "green", time: 5000 });
    },

    // 修改用户设置
    setUserSettings: (newData) => {
        data.user_set = { ...data.user_set, ...newData };
    },

    // 获取地址栏用户参数
    getUser: () => {
        var name = location.search.split("u=");

        return name ? name[1] : false;
    },

    createItem: (item, key) => {
        var content = item.icon ? '<i class="' + item.icon + '"></i>' : item.name.substr(0, 1);

        return ks.create("a", {
            href: item.url,
            class: "item",
            attr: [
                {
                    name: "data-id",
                    value: key
                },
                {
                    name: "target",
                    value: "_blank"
                }
            ],
            html: `<figure class="navi-icon" style="background: #${item.color || Math.random().toString(16).substr(-6)}">
                ${content}
            </figure>
            <p class="navi-title">${item.name}</p>`
        });
    },
    openWindow: (key) => {
        data.window = key;
        obj.window.wrap.classList.add("active");
        obj.window.item[key].classList.add("active");
    },
    closeWindow: () => {
        data.timer = clearTimeout(methods.closeWindow);

        obj.window.item[data.window].classList.remove("closed");
        obj.window.item[data.window].classList.remove("active");

        obj.window.wrap.classList.remove("active");
    },
    closeWindow2: () => {
        if(!data.timer){
            data.timer = setTimeout(methods.closeWindow, 300);
        }

        obj.window.item[data.window].classList.add("closed");
    },

    // 读取表单转数组
    getMulSelectValue: (el) => {
        let selected = [];

        for(var item of el){
            item.selected && selected.push(parseInt(item.value));
        }

        return selected;
    },
    // 读取数组转表单
    setMulSelectValue: (el, value) => {
        for(var item of value){
            el[item].selected = true;
        }
    }
}

// 涉及到 DOM 交互的操作
const modifys = {
    // 搜索里面的按钮
    selectSearchButton: () => {
        const { search } = obj.main;

        search.classList.toggle("active");
    },
    submitSearchButton: (e) => {
        e.preventDefault();
        window.open(data.search_method[data.user_set.search].url.replace("%s", obj.main.input.value));
    },

    // 右上方的按钮
    hideSettingsButton: () => {
        obj.header.setting.setAttribute("hidden", "");
    },
    updatedButton: () => {
        methods.openWindow(0);
        localStorage.setItem("paul-ver", data.ver);
        obj.header.updated.classList.remove("active");
    },

    // 设置里面的按钮
    clearButton: () => {
        methods.clearStorage();
    },
    outputButton: () => {
        ks.notice("本功能制作中，敬请期待~", { color: "yellow", time: 3000 });
    },

    // 修改搜索方式
    changeSearch: (key) => {
        const { search } = obj.main;

        search.classList.remove("active");
        data.user_set.search = key;

        data.search_method[key].icon && (
            obj.main.select.innerHTML = `<i class="iconfont icon-${data.search_method[key].icon}"></i>`
        )
    },

    // 初始化主体的元素
    initBody: () => {
        // 搜索
        obj.main.select.onclick = modifys.selectSearchButton;
        obj.main.submit.onclick = modifys.submitSearchButton;

        data.search_method.forEach((item, key) => {
            var a = ks.create("div", {
                class: "item",
                text: item.name,
                parent: obj.main.search
            });

            a.onclick = () => modifys.changeSearch(key);
        })

        // 打开按钮
        obj.header.updated.onclick = modifys.updatedButton;
        obj.header.about.onclick = () => {
            methods.openWindow(1);
        }
        obj.header.setting.onclick = () => {
            methods.openWindow(2);
        }

        // 关闭面板
        obj.window.wrap.onclick = (e) => {
            const isCloseBtn = e.target.nodeName === "BUTTON" && e.target.dataset.type === "close";
            const isWindow = e.target == obj.window.wrap;

            (isWindow || isCloseBtn) && methods.closeWindow2();
        }

        // 重置按钮
        obj.settingBtn.reset.onclick = modifys.clearButton;
        obj.settingBtn.output.onclick = methods.outputButton;

        // 版本更新提示
        if(localStorage.getItem("paul-ver") !== data.ver){
            obj.header.updated.classList.add("active");
        }
    },

    // 初始化设置表单项
    initSettingForm: () => {
        var set = data.user_set;

        for(item in set){
            if(!obj.settings[item]) return;

            let type, i = item;

            switch(obj.settings[item].type){
                case "text": type = "value"; break;
                case "checkbox": type = "checked"; break;
                case "select-one": type = "value"; break;
                case "select-multiple": type = "options"; break;
            }

            // 是下拉框，遍历生成
            if(obj.settings[item].type.indexOf("select") === 0 && obj.settings[item].dataset.key){
                data[obj.settings[item].dataset.key].forEach((sitem, key) => {
                    ks.create("option", {
                        text: sitem.name,
                        attr: {
                            name: "value",
                            value: key
                        },
                        parent: obj.settings[item]
                    });
                });
            }

            if(type !== "options"){
                obj.settings[item][type] = set[item];

                obj.settings[item].onchange = (ev) => {
                    data.user_set[i] = ev.target[type];

                    methods.setStorage();
                }
            }
            else{
                // 设置表单
                methods.setMulSelectValue(obj.settings[item], set[item]);

                obj.settings[item].onchange = () => {
                    // 读取表单
                    data.user_set[i] = methods.getMulSelectValue(obj.settings[i]);

                    methods.setStorage();
                }
            }
        }
    },

    // 深色背景模式检测
    checkDarkMode: () => {
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = data.background_type[data.user_set.background].url;

        // 深色背景增加深色模式
        img.onload = () => {
            obj.main.bg.style.background = `url(${img.src}) ${data.background_type[data.user_set.background].set}`;
            obj.main.bg.classList.add("active");

            var canvas = document.createElement("canvas");

            var context = canvas.getContext("2d");
            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, 1, 1);

            var imgData = context.getImageData(0, 0, 1, 1).data;

            if(imgData[0] <= 180 || imgData[1] <= 180 | imgData[2] <= 180){
                document.body.classList.add("dark");
            }
        }
    }
}

modifys.initBody();

// 初始化，先获取预设站点数据
fetch("site.json").then(res => res.json()).then((res) => {
    data.sites = res;
}).then(() => {
    const user = methods.getUser();

    // 读取在线或本地数据
    if(user){
        const url = `https://dreamer-paul.github.io/KStart-Sites/${user}.json`;

        console.warn("Web mode");

        modifys.hideSettingsButton();

        return fetch(url).then(res => res.json());
    }

    console.warn("Local mode");

    return false;
}).then((webData) => {
    const storage = webData || methods.getStorage();

    storage && methods.setUserSettings(storage);

    const { sites, custom } = data.user_set;

    // 用户自定义站点
    if(custom && Array.isArray(custom)){
        custom.forEach(item => {
            obj.main.sites.appendChild(methods.createItem(item));
        });
    }

    // 用户选中的预设站点
    if(sites && Array.isArray(sites)){
        sites.forEach(item => {
            obj.main.sites.appendChild(methods.createItem(data.sites[item], item));
        });
    }
    else{
        console.error("这个一般不会触发吧？");
    }

    data.user_set.background && modifys.checkDarkMode();

    modifys.changeSearch(data.user_set.search);
    modifys.initSettingForm();
});
