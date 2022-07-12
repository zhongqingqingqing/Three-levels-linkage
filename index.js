(async function () {
  /**
   * 远程获取省市区数据，当获取完成后，得到一个数组
   * @returns Promise
   */
  async function getDatas() {
    return fetch("https://study.duyiedu.com/api/citylist")
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }
  /**
   * 初始化
   * 拿到数据
   * 生成很多li，加入到对应的ul中
   */

  // 拿到需要操作的DOM元素
  const doms = {
    selProvince: document.getElementById("selProvince"),
    selCity: document.getElementById("selCity"),
    selArea: document.getElementById("selArea"),
  };

  //拿到所有数据
  const datas = await getDatas();

  //填充省份数据
  fillSelect(doms.selProvince, datas);
  fillSelect(doms.selCity, []); //一开始没办法填充数据
  fillSelect(doms.selArea, []);

  /**
   * 根据传入的数组，填充数据到对应的下拉列表
   * @param {*} select 要填充的下拉列表
   * @param {*} list   被填充的数据（数组）
   * 当传入的数组为空时，表示不能填充数据
   */
  function fillSelect(select, list) {
    //1、判断是否可以填充数据，并设置对应select样式
    select.className = `select ${list.length ? "" : "disabled"}`;

    //2、设置提示文字
    const span = select.querySelector(".title span");
    const tipName = select.dataset.name;
    span.innerText = `请选择${tipName}`;

    select.datas = list; //把填充的数据存入对应dom中，方便后续读取

    //3、生成数据对应的li,渲染到ul中
    const ul = select.querySelector("ul");
    ul.innerHTML = list.map((item) => `<li>${item.label}</li>`).join("");
  }

  /**
   * 交互
   */

  //1、注册事件
  regCommonEvent(doms.selProvince);
  regCommonEvent(doms.selCity);
  regCommonEvent(doms.selArea);
  regProvinceEvent();
  regCityEvent();

  /**
   * 注册公共通用事件处理
   * @param {*} select 下拉列表
   */
  function regCommonEvent(select) {
    //1.title点击事件
    const title = select.querySelector(".title");

    //1.1.注册点击事件，切换自己的ul（展开或关闭）
    title.addEventListener("click", () => {
      //1.2禁用状态不做任何操作
      if (select.classList.contains("disabled")) {
        return;
      }

      const selectArr = document.querySelectorAll(".select.expand"); //全部已展开的下拉列表

      //1.3、关闭除了自己以外的下拉列表
      for (const item of selectArr) {
        if (item !== select) {
          item.classList.remove("expand");
        }
      }

      //1.4、切换自己的ul
      select.classList.toggle("expand");
    });

    //2.ul的点击事件
    const ul = select.querySelector(".options");
    ul.addEventListener("click", (e) => {
      //2.1、点击的不是li时，不做处理
      if (e.target.tagName !== "LI") {
        return;
      }
      const li = e.target;

      //2.2、清除之前li的点击的样式
      const beforeActive = ul.querySelector("li.active");
      beforeActive && beforeActive.classList.remove("active");

      //2.3、给添加点击样式
      li.classList.add("active");

      //2.4、title的文本随之改变
      const span = select.querySelector(".title span");
      span.innerText = li.innerText;

      //2.5、点击后，收起ul
      select.classList.remove("expand");
    });
  }

  /**
   * 注册省份的特殊点击事件
   */
  function regProvinceEvent() {
    //给省份下的ul添加点击事件
    const ul = doms.selProvince.querySelector(".options");

    ul.addEventListener("click", (e) => {
      if (e.target.tagName !== "LI") {
        return; //点击的不是li就不做处理
      }

      const li = e.target;

      //找到对应的省份数据
      const pro = doms.selProvince.datas.find(
        (item) => item.label === li.innerText
      );

      //根据点击的省份，填充城市数据
      fillSelect(doms.selCity, pro.children);
      fillSelect(doms.selArea, []); //城市禁用
    });
  }

  /**
   * 注册城市的特殊点击事件
   */
  function regCityEvent() {
    //给ul添加点击事件
    const ul = doms.selCity.querySelector(".options");

    ul.addEventListener("click", (e) => {
      if (e.target.tagName !== "LI") {
        return; //点击的不是li就不做处理
      }

      const li = e.target;

      //找到点击对应的城市数据
      const city = doms.selCity.datas.find(
        (item) => item.label === li.innerText
      );

      //填充城市数据
      fillSelect(doms.selArea, city.children);
    });
  }
})();
