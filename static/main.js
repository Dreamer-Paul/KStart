/* ----

# KStart
# By: Dreamer-Paul
# Last Update: 2024.7.29

一个简洁轻巧的起始页

本代码为奇趣保罗原创，并遵守 MIT 开源协议。欢迎访问我的博客：https://paugram.com

---- */

function KStart() {
  const obj = {
    header: {
      edit: ks.select(".action-btn.edit"),
      updated: ks.select(".action-btn.updated"),
      about: ks.select(".action-btn.about"),
      setting: ks.select(".action-btn.setting"),
    },
    main: {
      select: ks.select(".search-select"),
      search: ks.select(".search-selector"),
      input: ks.select(".input-box input"),
      submit: ks.select(".input-box .btn"),
      sites: ks.select(".navi-items"),
      bg: ks.select(".navi-background"),
    },
    window: {
      wrap: ks.select("window"),
      item: ks(".the-window, .the-drawer"),
    },
    settings: {
      search: ks.select("[name=search]"),
      background: ks.select("[name=background]"),
      background_preview: ks.select(".custom-background-preview"),
      background_input: ks.select("#custom-background-input"),
      sites: ks.select("[name=sites]"),
      auto_focus: ks.select("[name=auto_focus]"),
      low_animate: ks.select("[name=low_animate]")
    },
    settingBtn: {
      reset: ks.select("#set-reset"),
      input: ks.select("#set-input"),
      output: ks.select("#set-output"),
      file: ks.select("#set-file"),
    },
    drawer: {
      sites: ks.select(".the-drawer .sites")
    },

    // 不渲染的元素
    _internal: {
      link: ks.create("a"),
      dragFrom: null
    },
  };

  const data = {
    env: undefined,
    ver: "1.2.0",
    timer: "",
    window: 0,
    sites: [],
    db: undefined,
    custom_background: undefined,
    background_type: [
      {
        name: "无背景",
      },
      {
        name: "随机动漫壁纸",
        url: "https://api.paugram.com/wallpaper?source=gh",
        set: "bottom right/60% no-repeat",
      },
      {
        name: "必应每日壁纸",
        url: "https://api.paugram.com/bing",
        set: "center/cover no-repeat",
      },
      {
        name: "Unsplash 随机图片",
        url: "https://source.unsplash.com/random/1920x1080",
        set: "center/cover no-repeat",
      },
      {
        name: "自选本地图片",
        set: "center/cover no-repeat",
      },
    ],
    search_method: [
      {
        name: "百度",
        icon: "baidu",
        url: "https://www.baidu.com/s?wd=%s",
      },
      {
        name: "必应",
        icon: "bing",
        url: "https://cn.bing.com/search?q=%s",
      },
      {
        name: "谷歌",
        icon: "google",
        url: "https://www.google.com/search?q=%s",
      },
      {
        name: "360",
        icon: "360so",
        url: "https://www.so.com/s?q=%s",
      },
      {
        name: "搜狗",
        icon: "sogou",
        url: "https://www.sogou.com/web?query=%s",
      },
      {
        name: "Felo",
        icon: "felo-search",
        url: "https://felo.ai/?q=%s",
      },
      {
        name: "DuckDuckGo",
        icon: "duckduckgo",
        url: "https://duckduckgo.com/?q=%s",
      },
    ],
    motion_reduced_enum: [
      {
        name: "自适应",
      },
      {
        name: "开启",
      },
      {
        name: "关闭",
      },
    ],
    user_set: {
      search: 0,
      background: 0,
      auto_focus: false,
      low_animate: 0,
      sites: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 16, 28, 31, 35],
      custom: [],
    },
  };

  // 各种方法
  const methods = {
    // DB 相关
    initDB: () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("wallpaper", 1);

        request.onerror = (e) => {
          reject();
          console.error("Database error:", e.target.errorCode);
        };

        request.onsuccess = (e) => {
          data.db = e.target.result;
          resolve();
        };

        request.onupgradeneeded = (e) => {
          data.db = e.target.result;
          data.db.createObjectStore("images", { keyPath: "id" });
        };
      })
    },
    getCustomWallpaper: () => (
      new Promise((resolve, reject) => {
        if (data.custom_background) {
          resolve(data.custom_background);
        }

        const transaction = data.db.transaction(["images"], "readonly");
        const objectStore = transaction.objectStore("images");
        const getRequest = objectStore.get(1);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            data.custom_background = getRequest.result.data;
            resolve(getRequest.result.data);
          }
        };

        getRequest.onerror = () => {
          reject(new Error(transaction.error));
        }
      })
    ),

    // 存储相关
    getStorage: () => {
      const storage = localStorage.getItem("paul-userset");

      return storage ? JSON.parse(localStorage.getItem("paul-userset")) : undefined;
    },
    setStorage: () => {
      localStorage.setItem("paul-userset", JSON.stringify(data.user_set));
    },
    clearStorage: () => {
      localStorage.removeItem("paul-userset");
    },

    // 修改用户设置
    setUserSettings: (newData) => {
      data.user_set = { ...data.user_set, ...newData };
    },

    // 获取地址栏用户参数
    getUser: () => {
      const name = location.search.split("u=");

      return name ? name[1] : false;
    },

    createNaviItem: (item, key) => {
      const icon = item.icon ? `<i class="${item.icon}"></i>` : item.name.substr(0, 1);
      const color = item.color || Math.random().toString(16).substring(-6);

      const el = ks.create("a", {
        href: item.url,
        class: "item",
        attr: [
          {
            name: "data-id",
            value: key ?? -1,
          },
          {
            name: "target",
            value: "_blank",
          },
        ],
        html: (
          `<figure class="navi-icon" style="background: #${color}">
              ${icon}
          </figure>
          <p class="navi-title">${item.name}</p>`
        )
      });

      data.env === "local" && modifys.initDragNavi(el);

      return el;
    },

    // 弹窗和抽屉
    openWindow: (key) => {
      data.window = key;

      obj.window.wrap.classList.add("active");
      obj.window.item[key].classList.add("active");
      obj.window.item[key].classList.add("started");

      // 上次操作可能被取消，强制清除
      obj.window.item[key].classList.remove("closed");

      data.timer = clearTimeout(data.timer);
      data.timer = setTimeout(methods.openWindowEnd, 300);
    },
    openWindowEnd: () => {
      obj.window.item[data.window].classList.remove("started");
    },
    closeWindow: () => {
      obj.window.wrap.classList.remove("active");
      obj.window.item[data.window].classList.add("closed");

      // 上次操作可能被取消，强制清除
      obj.window.item[data.window].classList.remove("started");

      data.timer = clearTimeout(data.timer);
      data.timer = setTimeout(methods.closeWindowEnd, 300);
    },
    closeWindowEnd: () => {
      data.timer = clearTimeout(data.timer);

      obj.window.item[data.window].classList.remove("closed");
      obj.window.item[data.window].classList.remove("active");
      obj.window.wrap.classList.remove("active");
    },

    // 输入 Value 处理
    parseValue: (type, value) => {
      // Checkbox 直接返回 boolean
      if (type === "checked") {
        return value;
      }

      const _checkNumber = Number(value);

      return isNaN(_checkNumber) ? value : _checkNumber;
    },

    // 读取表单转数组
    getMulSelectValue: (el) => {
      let selected = [];

      for (const item of el) {
        item.selected && selected.push(parseInt(item.value));
      }

      return selected;
    },
    // 读取数组转表单
    setMulSelectValue: (el, value) => {
      for (const item of value) {
        el[item].selected = true;
      }
    },
  };

  // 涉及到 DOM 交互的操作
  const modifys = {
    // 全局委托，用于隐藏搜索下拉框
    onBodyClick: (ev) => {
      ev.target.className !== "search-select" && obj.main.search.classList.remove("active");
    },
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
    hideModifiedButton: () => {
      obj.header.edit.setAttribute("hidden", "");
      obj.header.setting.setAttribute("hidden", "");
    },
    editButton: () => {
      methods.openWindow(3);
    },
    updatedButton: () => {
      methods.openWindow(0);
      localStorage.setItem("paul-ver", data.ver);
      obj.header.updated.classList.remove("active");
    },
    aboutButton: () => {
      methods.openWindow(1);
    },
    settingButton: () => {
      methods.openWindow(2);
    },

    // 导航项点击，创建或删除已经设置的导航项目
    siteItemButton: (ev) => {
      const siteID = Number(ev.target.dataset.id);
      const siteIndex = data.user_set.sites.indexOf(siteID);

      ev.target.classList.toggle("active");

      // 删除
      if (siteIndex > -1) {
        data.user_set.sites.splice(siteIndex, 1);

        obj.main.sites.childNodes[siteIndex].remove();
      }
      // 添加
      else {
        data.user_set.sites.push(siteID);

        const newSiteItem = methods.createNaviItem(data.sites[siteID], siteID, true);

        obj.main.sites.appendChild(newSiteItem);
      }

      methods.setStorage();
    },

    // 设置里面的按钮
    clearButton: () => {
      methods.clearStorage();

      ks.notice("本地设置已清除，刷新页面后将读取默认配置！", { color: "green", time: 5000 });
    },
    inputButton: () => {
      obj.settingBtn.file.click();
    },
    outputButton: () => {
      const blob = new Blob([JSON.stringify(data.user_set, null, 2)], { type: "application/json" });

      obj._internal.link.href = URL.createObjectURL(blob);
      obj._internal.link.download = `userset-${parseInt(new Date().getTime() / 1000)}.json`;
      obj._internal.link.click();

      ks.notice("设置项已经导出，你可以将它上传到 GitHub 仓库以对外展示", { color: "yellow", time: 5000 });
    },
    fileInputChange: (e) => {
      const file = e.target.files && e.target.files[0];

      if (!file) {
        console.log("🔮 也许是不存在的操作？");
        return;
      }

      if (file.type !== "application/json") {
        ks.notice("导入的文件必须是 JSON 格式", { color: "red", time: 3000 });
        return;
      }

      file.text().then((text) => {
        try {
          const json = JSON.parse(text);

          data.user_set = json;
          methods.setStorage();

          ks.notice("导入成功，刷新页面后生效！", { color: "green", time: 5000 });
        }
        catch (e) {
          ks.notice("JSON 文件格式错误，请检查", { color: "red", time: 3000 });
          return;
        }
      });
    },

    // 拖拽导航项目
    onNaviDragStart: (ev) => {
      obj._internal.dragFrom = ev.target;
    },
    onNaviDragOver: (ev) => {
      ev.preventDefault();
    },
    onNaviDrop: (ev) => {
      const from = obj._internal.dragFrom;
      const to = ev.currentTarget;

      const toId = to.getAttribute("data-id");
      const set_sites = data.user_set.sites;

      const _fromIdValue = set_sites.indexOf(Number(from.getAttribute("data-id")));
      const _toIdValue = set_sites.indexOf(Number(toId));

      set_sites.splice(_toIdValue, 0, set_sites.splice(_fromIdValue, 1)[0]);

      if (_fromIdValue > _toIdValue) {
        from.parentElement.insertBefore(from, to);
      }
      else {
        from.parentElement.insertBefore(from, to.nextSibling);
      }

      methods.setStorage();
    },

    // 修改搜索方式
    changeSearch: (key) => {
      data.user_set.search = key;

      obj.main.input.placeholder = `使用 ${data.search_method[key].name} 搜索`;

      if (data.search_method[key].icon) {
        obj.main.select.innerHTML = `<i class="iconfont icon-${data.search_method[key].icon}"></i>`
      }
    },
    // 初始化背景和深色背景模式检测
    initBackground: async () => {
      if (data.user_set.background == 0) {
        obj.main.bg.style = "";

        return;
      }

      const img = new Image();
      img.crossOrigin = "Anonymous";

      const { url } = data.background_type[data.user_set.background];

      // 自定义图片
      if (data.user_set.background == 4) {
        img.src = await methods.getCustomWallpaper();
      }
      else {
        img.src = url;
      }

      // 深色背景增加深色模式
      img.onload = () => {
        obj.main.bg.classList.add(`type-${data.user_set.background}`);
        obj.main.bg.style.background = `url(${img.src}) ${data.background_type[data.user_set.background].set}`;
        obj.main.bg.classList.add("active");

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, 1, 1);

        const imgData = context.getImageData(0, 0, 1, 1).data;

        if (imgData[0] <= 180 || (imgData[1] <= 180) | (imgData[2] <= 180)) {
          document.body.classList.add("dark");
        }
        else {
          document.body.classList.remove("dark");
        }
      };
    },

    // 上传了新的背景图片
    customWallpaperInputChange: (e) => {
      const file = e.target.files[0];

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const imageDataUrl = e.target.result;
          const transaction = data.db.transaction(["images"], "readwrite");
          const objectStore = transaction.objectStore("images");
          objectStore.put({ id: 1, data: imageDataUrl });

          data.custom_background = imageDataUrl;
          obj.settings.background_preview.style.backgroundImage = `url(${imageDataUrl})`;

          modifys.initBackground();
        };

        reader.readAsDataURL(file);
      } else {
        ks.notice("请选择有效的图片文件", { color: "red", time: 3000 });
      }
    },

    // 自动聚焦到搜索框
    focusSearchInput: () => {
      obj.main.input.focus();
    },
    // 初始化媒体查询事件监听
    initMediaQueryListener: () => {
      // prefers-reduced-motion 事件监听
      window.matchMedia("(prefers-reduced-motion: reduce)").addListener((e) => {
        // 当 data.user_set.low_animate 不为 0(自适应) 时，不进行处理
        if(data.user_set.low_animate !== 0) return;

        if (e.matches) {
          document.body.classList.add("low-animate");
          ks.notice("检测到减弱动画模式，已为你减弱动画效果", { color: "green", time: 2000 });
        }
        else {
          document.body.classList.remove("low-animate");
          ks.notice("减弱动画模式关闭，已启用完整动画效果", { color: "green", time: 2000 });
        }
      });
    },
    // 减淡动画
    initLowAnimate: () => {
      // 兼容性处理：对旧配置中 boolean 类型的配置项进行转换
      if (data.user_set.low_animate === true) {
        data.user_set.low_animate = 1;
      }
      else if (data.user_set.low_animate === false) {
        data.user_set.low_animate = 2;
      }

      switch (data.user_set.low_animate) {
        case 1:
          // 开启
          document.body.classList.add("low-animate");
          break;
        case 2:
          // 关闭
          document.body.classList.remove("low-animate");
          break;
        default:
          // 自适应
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? document.body.classList.add("low-animate")
            : document.body.classList.remove("low-animate");
          break;
      }
    },

    // 设置项被修改
    onSettingChange: (name) => {
      if (name === "background") {
        modifys.initBackground();
      }
      else if (name === "search") {
        ks.notice("默认搜索引擎已修改，刷新后生效", { color: "green", time: 3000 });
      }
      else if (name === "low_animate") {
        modifys.initLowAnimate();
      }
    },

    // 初始化主体的元素（不受限于用户数据）
    initBody: () => {
      // 全局委托，用于隐藏搜索下拉框
      document.body.onclick = modifys.onBodyClick;

      // 搜索
      obj.main.select.onclick = modifys.selectSearchButton;
      obj.main.submit.onclick = modifys.submitSearchButton;

      data.search_method.forEach((item, key) => {
        const el = ks.create("div", {
          class: "item",
          html: `<i class="iconfont icon-${item.icon}"></i>${item.name}`,
          parent: obj.main.search
        });

        el.onclick = () => modifys.changeSearch(key);
      });

      // 打开按钮
      obj.header.edit.onclick = modifys.editButton;
      obj.header.updated.onclick = modifys.updatedButton;
      obj.header.about.onclick = modifys.aboutButton;
      obj.header.setting.onclick = modifys.settingButton;

      // 关闭面板
      obj.window.wrap.onclick = (e) => {
        const isCloseBtn = e.target.nodeName === "BUTTON" && e.target.dataset.type === "close";
        const isWindow = e.target == obj.window.wrap;

        (isWindow || isCloseBtn) && methods.closeWindow();
      };

      // 重置按钮
      obj.settingBtn.reset.onclick = modifys.clearButton;
      obj.settingBtn.input.onclick = modifys.inputButton;
      obj.settingBtn.output.onclick = modifys.outputButton;
      obj.settingBtn.file.onchange = modifys.fileInputChange;

      // 版本更新提示
      if (localStorage.getItem("paul-ver") !== data.ver) {
        obj.header.updated.classList.add("active");
      }
    },

    // 初始化导航项目
    initNavi: () => {
      const { sites, custom } = data.user_set;

      // 用户自定义站点
      if (custom && Array.isArray(custom)) {
        custom.forEach((item) => {
          obj.main.sites.appendChild(methods.createNaviItem(item));
        });
      }

      // 用户选中的预设站点
      if (sites && Array.isArray(sites)) {
        sites.forEach((item) => {
          obj.main.sites.appendChild(methods.createNaviItem(data.sites[item], item));
        });
      }
      else {
        console.error("这个一般不会触发吧？");
      }
    },

    // 初始化自定义背景相关逻辑
    initSettingBackground: () => {
      // 预览自定义图片
      methods.getCustomWallpaper().then((imgUrl) => {
        obj.settings.background_preview.style.backgroundImage = `url(${imgUrl})`;

        if (data.user_set.background === 4) {
          obj.settings.background_preview.hidden = false;
        }
      });

      obj.settings.background_preview.addEventListener("click", () => {
        obj.settings.background_input.click();
      });

      // 如果修改成自定义背景
      obj.settings.background.addEventListener("change", (ev) => {
        obj.settings.background_preview.hidden = ev.target.value != 4;
      });

      // 如果自定义背景被修改
      obj.settings.background_input.onchange = modifys.customWallpaperInputChange;
    },

    // 初始化设置表单项
    initSettingForm: () => {
      const set = data.user_set;

      const inputElements = ["INPUT", "SELECT", "TEXTAREA"];

      for (item in set) {
        if (!obj.settings[item]) {
          return;
        }

        if (!inputElements.includes(obj.settings[item].nodeName)) {
          return;
        }

        let type, i = item;

        switch (obj.settings[item].type) {
          case "text": type = "value"; break;
          case "checkbox": type = "checked"; break;
          case "select-one": type = "value"; break;
          // ! 暂时没有使用
          case "select-multiple": type = "options"; break;
        }

        // 是下拉框，遍历生成（只有 Select 才会有 key 这个东西）
        if (obj.settings[item].type.indexOf("select") === 0 && obj.settings[item].dataset.key) {
          data[obj.settings[item].dataset.key].forEach((sitem, key) => {
            ks.create("option", {
              text: sitem.name,
              attr: {
                name: "value",
                value: key,
              },
              parent: obj.settings[item],
            });
          });
        }

        // Input / Checkbox / Select
        if (type !== "options") {
          obj.settings[item][type] = set[item];

          obj.settings[item].onchange = (ev) => {
            data.user_set[i] = methods.parseValue(type, ev.target[type]);

            methods.setStorage();
            modifys.onSettingChange(i);
          };
        }
        // Multiple Select
        else {
          // 设置表单
          methods.setMulSelectValue(obj.settings[item], set[item]);

          obj.settings[item].onchange = () => {
            // 读取表单
            data.user_set[i] = methods.parseValue(type, methods.getMulSelectValue(obj.settings[i]));

            methods.setStorage();
            modifys.onSettingChange(i);
          };
        }
      }
    },

    // 初始化公共导航列表的拖拽功能
    initDragNavi: (el) => {
      if (el.dataset.id == -1) return;

      el.ondragstart = modifys.onNaviDragStart;
      el.ondragover = modifys.onNaviDragOver;
      el.ondrop = modifys.onNaviDrop;

      el.setAttribute("draggable", true);
    },

    // 初始化抽屉里面的导航项目
    initDrawerItems: () => {
      data.sites.forEach((site, key) => {
        const item = ks.create("span", {
          text: site.name,
          attr: {
            name: "data-id",
            value: key,
          },
          parent: obj.drawer.sites,
        });

        if (data.user_set.sites.includes(key)) {
          item.classList.add("active");
        }

        item.onclick = modifys.siteItemButton;
      });
    }
  };

  // 异步数据请求
  const services = {
    getSiteList: () => (
      fetch("site.json").then((res) => res.json())
    ),
    getUserSettings: (user) => {
      const url = `https://dreamer-paul.github.io/KStart-Sites/${user}.json`;

      return fetch(url).then((res) => res.json());
    },
  };

  // 从这里开始初始化
  modifys.initBody();

  services.getSiteList().then((res) => {
    data.sites = res;
  }).then(() => {
    const user = methods.getUser();

    // 读取在线或本地数据
    if (user) {
      return services.getUserSettings(user).then((res) => {
        data.env = "web";

        return res;
      }).catch((err) => {
        data.env = "local";
        ks.notice("获取数据出错啦", { color: "red" });

        return methods.getStorage();
      });
    }

    console.warn("Local mode");
    data.env = "local";

    return methods.getStorage();
  }).then((userData) => {
    userData && methods.setUserSettings(userData);
  }).then(methods.initDB).then(() => {
    modifys.initNavi();
    modifys.initBackground();
    modifys.initMediaQueryListener();
    modifys.initLowAnimate();

    data.env === "web" && modifys.hideModifiedButton();

    data.user_set.auto_focus && modifys.focusSearchInput();

    modifys.changeSearch(data.user_set.search);
    modifys.initSettingBackground();
    modifys.initSettingForm();
    modifys.initDrawerItems();
  });
}

KStart();
