window.addEventListener("DOMContentLoaded", () => {
  commonInit();
  
});
window.addEventListener("load", () => {
  layoutFunc();
});

$(function() {
})

/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf("samsung") > -1) {
    browserAdd("samsung");
  }

  if (
    navigator.platform.indexOf("Win") > -1 ||
    navigator.platform.indexOf("win") > -1
  ) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }

  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/*
  resize
*/
function resizeAction(callback){
  let windowWid = 0;
  window.addEventListener("resize",()=>{
    if(window.innerWidth !== windowWid){
      if(callback){
        callback();
      }
    }
    windowWid = window.innerWidth;
  });
}

/**
 * 레이아웃
 */
function layoutFunc() {
  const header_wrap = document.querySelector(".header_wrap");
  const hgroup_pix_inner = document.querySelector(".hgroup_pix_inner");
  const toplogo = document.querySelector(".toplogo");
  const hgroup_util_wrap = document.querySelector(".hgroup_util_wrap");
  const nav_menu = document.querySelectorAll(".nav_menu");
  const nav_depth_list_wrap = document.querySelector(".nav_depth_list_wrap");
  const btn_hgroup_menu = document.querySelector(".btn_hgroup_menu");
  const hgroup_util_toggle_item = document.querySelectorAll(".hgroup_util_toggle_item");
  let between_margin = 20;
  
  mbTotal();
  action();
  mapMenu();
  pcMenuFunc();
  utilFunc();

  
  resizeAction(()=>{
    action();
  });

  function utilFunc(){
    if(!!hgroup_util_toggle_item){
      hgroup_util_toggle_item.forEach((item)=>{
        item.addEventListener("click",(e)=>{
          e.preventDefault();
          e.currentTarget.classList.toggle("active");
        });
      });
      document.addEventListener("click", function(e) {
        if (!e.target.closest(".hgroup_util_toggle_item")) {
          hgroup_util_toggle_item.forEach(function(elem) {
            elem.classList.remove("active");
          });
        }
  
        // submenu_one_active.classList.remove("active");
        // submenu_two_list_wrap_active.style.height = "0px";
        // timerid = setTimeout(function(){
        //   submenu_two_list_wrap_active.classList.remove("active");
        // },510);
      }, false);
    }
  }

  function action(){
    let toplogoWidth = !!toplogo ? toplogo.getBoundingClientRect().width : 0;
    let hgroupUtilWrapWidth = !!hgroup_util_wrap ? hgroup_util_wrap.getBoundingClientRect().width : 0;
    
    if(!!hgroup_pix_inner){
      if(window.innerWidth > 1023){
        hgroup_pix_inner.style.paddingLeft = (toplogoWidth+between_margin) + 'px';
        hgroup_pix_inner.style.paddingRight = (hgroupUtilWrapWidth+between_margin) + 'px';
      }else{
        hgroup_pix_inner.style.paddingLeft = '0px';
        hgroup_pix_inner.style.paddingRight = '0px';
      }
    }
  }
  // mobile total
  function mbTotal() {
    var touchstart = "ontouchstart" in window;
    var btn_mb_menu = document.querySelector(".btn_mb_menu"),
      mobile_mainmenu_zone = document.querySelector(".mobile_mainmenu_zone"),
      mainmenu_dim = document.querySelector(".mainmenu_dim"),
      btn_mbmenuclose = document.querySelector(".btn_mbmenuclose"),
      domHtml = document.querySelector("html"),
      domBody = document.querySelector("body");

    // init 
    if (mobile_mainmenu_zone === null) {
      return;
    }
    btn_mb_menu.addEventListener("click", function(e) {
      e.preventDefault();
      totalOpen();
    }, false);
    btn_mbmenuclose.addEventListener("click", function(e) {
      e.preventDefault();
      totalClose();
    }, false);
    mainmenu_dim.addEventListener("click", function(e) {
      e.preventDefault();
      totalClose();
    }, false);

    function totalOpen() {
      mobile_mainmenu_zone.classList.add("active")
      setTimeout(function() {
        mobile_mainmenu_zone.classList.add("motion");
        if (touchstart) {
          domBody.setAttribute("data-scr", window.pageYOffset);
          domBody.style.marginTop = -window.pageYOffset + "px";
          domHtml.classList.add("touchDis");
        }
      }, 30);
    }

    function totalClose() {
      mobile_mainmenu_zone.classList.remove("motion");
      setTimeout(function() {
        mobile_mainmenu_zone.classList.remove("active");
        domHtml.classList.remove("touchDis");
        domBody.style.marginTop = 0;
        window.scrollTo(0, parseInt(domBody.getAttribute("data-scr")));
      }, 500);
    }
  }
  // sub
  function mapMenu() {
    var submenu_one = document.querySelectorAll(".submenu_one");
    var submenu_item_list = document.querySelector(".submenu_item_list");
    var submenu_item = document.querySelectorAll(".submenu_item:not(.define_home)");
    var submenu_two_list_wrap = document.querySelectorAll(".submenu_two_list_wrap");
    var currentItem = null;
    if(submenu_item.length<2){
      if(submenu_item_list !== null){
        submenu_item_list.classList.add("type2");
      }
    }
 
    submenu_one.forEach(function(elem, index) {
      if(!siblings(elem).length){
        elem.classList.add("only_text");
      }
      elem.addEventListener("click", function(e) {
        var thisitem = e.currentTarget;
        var thisitem_two = siblings(thisitem);
        
        if(currentItem && currentItem !== thisitem){
          currentItem.classList.remove("active");
          twodepNonActive(siblings(currentItem));
        }
        if(!thisitem_two.length){
          return;
        }
        thisitem.classList.toggle("active");
        twodepActive(thisitem_two,thisitem);
        currentItem = thisitem;
      }, false);
    });
    function twodepActive(twomenu_list,one){
      var timerid = 0;
      twomenu_list.forEach(function(elem) {
        var childrenHeight = 0;
        if (elem.classList.contains("submenu_two_list_wrap")) {
          if (timerid) {
            clearTimeout(timerid)
          }
          if (one.classList.contains("active")) {
            elem.classList.add("active");
            childrenHeight = elem.children[0].offsetHeight;
            timerid = setTimeout(function() {
              elem.style.height = childrenHeight + "px";
            }, 30);
          } else {
            elem.style.height = "0px";
            timerid = setTimeout(function() {
              elem.classList.remove("active");
            }, 500);
          }
        }
      });
    }
    function twodepNonActive(twomenu_list){
      var timerid2 = 0;
      twomenu_list.forEach(function(elem) {
        if (elem.classList.contains("submenu_two_list_wrap")) {
          if (timerid2) {
            clearTimeout(timerid2)
          }
          elem.style.height = "0px";
          timerid2 = setTimeout(function() {
            elem.classList.remove("active");
          }, 500);
        }
      });
    }

    document.addEventListener("click", function(e) {
      var timerid = 0;
      if (!e.target.closest(".submenu_item")) {
        submenu_one.forEach(function(elem) {
          elem.classList.remove("active");
        });
        submenu_two_list_wrap.forEach(function(elem) {
          elem.style.height = "0px";
          timerid = setTimeout(function() {
            elem.classList.remove("active");
          }, 510);
        });
      }

      // submenu_one_active.classList.remove("active");
      // submenu_two_list_wrap_active.style.height = "0px";
      // timerid = setTimeout(function(){
      //   submenu_two_list_wrap_active.classList.remove("active");
      // },510);
    }, false);
  }
  // gotop
  function goTop() {
    var btn_topgo = document.querySelector(".btn_topgo");
    var domHtml = document.querySelector("html");
    if(btn_topgo == null){return;}
    btn_topgo.addEventListener("click", function(e) {
      e.preventDefault();
      
    }, false);
    window.addEventListener("scroll", function() {
     
    });
  }

  // pc menu
  function pcMenuFunc(){
    if(!!btn_hgroup_menu){
      btn_hgroup_menu.addEventListener("click",()=>{
        nav_depth_list_wrap.classList.toggle("active");
      })
    }
    if(!!nav_menu){
      nav_menu.forEach((item)=>{
        item.addEventListener("mouseenter",()=>{
          nav_depth_list_wrap.classList.add("active");
        });
      })
    }
    if(!!header_wrap){
      header_wrap.addEventListener("mouseleave",()=>{
        nav_depth_list_wrap.classList.remove("active");
      });
    }
  }
}

/**
 * menu rock
 */
function menuRock(target) {
  const targetDom = document.querySelector(target);
  if (!!targetDom) {
    targetDom.classList.add("active");
  }
}

function siblings(t) {
  var children = t.parentElement.children;
  var tempArr = [];

  for (var i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function(e) {
    return e != t;
  });
}

/* popup */
function DesignPopup(option) {
  this.option = option;
  this.selector = this.option.selector;
  if (this.selector !== undefined) {
    this.selector = document.querySelector(this.option.selector);
  }
  
  this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.layer_wrap_parent = null;
  this.btn_closeTrigger = null;
  this.btn_close = null;
  this.bg_design_popup = null;
  this.scrollValue = 0;

  this.btn_closeTrigger = null;
  this.btn_close = null;

  const popupGroupCreate = document.createElement("div");
  popupGroupCreate.classList.add("layer_wrap_parent");

  
  
  if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
    this.pagewrap.append(popupGroupCreate);
  }

  this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

  // console.log(this.selector.querySelectorAll(".close_trigger"));

  this.bindEvent();
}

DesignPopup.prototype.dimCheck = function() {
  const popupActive = document.querySelectorAll(".popup_wrap.active");
  if (!!popupActive[0]) {
    popupActive[0].classList.add("active_first");
  }
  if (popupActive.length > 1) {
    this.layer_wrap_parent.classList.add("has_active_multi");
  } else {
    this.layer_wrap_parent.classList.remove("has_active_multi");
  }
};
DesignPopup.prototype.popupShow = function() {
  this.design_popup_wrap_active =
    document.querySelectorAll(".popup_wrap.active");

  if (this.selector == null) {
    return;
  }
  this.domHtml.classList.add("touchDis");

  this.selector.classList.add("active");
  setTimeout(() => {
    this.selector.classList.add("motion_end");
  }, 30);
  if ("beforeCallback" in this.option) {
    this.option.beforeCallback();
  }

  if ("callback" in this.option) {
    this.option.callback();
  }
  if (!!this.design_popup_wrap_active) {
    this.design_popup_wrap_active.forEach((element, index) => {
      if (this.design_popup_wrap_active !== this.selector) {
        element.classList.remove("active");
      }
    });
  }
  //animateIng = true;

  this.layer_wrap_parent.append(this.selector);

  this.dimCheck();

  // this.layer_wrap_parent

  // ****** 주소 해시 설정 ****** //
  // location.hash = this.selector.id
  // modalCount++
  // modalHash[modalCount] = '#' + this.selector.id
};
DesignPopup.prototype.popupHide = function() {
  var target = this.option.selector;
  if (target !== undefined) {
    this.selector.classList.remove("motion");
    if ("beforeClose" in this.option) {
      this.option.beforeClose();
    }
    //remove
    this.selector.classList.remove("motion_end");
    setTimeout(() => {
      this.selector.classList.remove("active");
    }, 400);
    this.design_popup_wrap_active =
      document.querySelectorAll(".popup_wrap.active");
    this.dimCheck();
    if ("closeCallback" in this.option) {
      this.option.closeCallback();
    }
    if (this.design_popup_wrap_active.length == 1) {
      this.domHtml.classList.remove("touchDis");
    }
  }
};

DesignPopup.prototype.bindEvent = function() {
  this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
  this.bg_design_popup = this.selector.querySelector(".bg_dim");
  var closeItemArray = [...this.btn_close];

  // this.selector.querySelector(".popup_content_row").addEventListener("scroll",(e)=>{
  //   console.log(this.selector.querySelector(".popup_content_row").scrollTop)
  // });
  if (!!this.selector.querySelectorAll(".close_trigger")) {
    this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
    closeItemArray.push(...this.btn_closeTrigger);
  }
  // if (!!this.bg_design_popup) {
  //   closeItemArray.push(this.bg_design_popup);
  // }
  if (closeItemArray.length) {
    closeItemArray.forEach((element) => {
      element.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          this.popupHide(this.selector);
        },
        false
      );
    });
  }
};

/**
 * 디자인 모달
 * @param {*} option
 */
function DesignModal(option) {
  this.title = option.title;
  this.message = option.message;
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.design_modal_wrap = null;
  this.btn_dmsmidentify = null;
  this.btn_dmsmcancel = null;
  this.duration = option.duration !== undefined ? option.duration : 400;
  this.initShow(option);
}

DesignModal.prototype.initShow = function(option) {
  var innerPublish = "";
  var objThis = this;
  let confirmPublish =
    option.type === "confirm" ?
    `취소` :
    `닫기`;
  /* 
  innerPublish += "<div class='design_modal_wrap'>";
  innerPublish += "  <div class='bg_design_modal'></div>";
  innerPublish += "  <div class='design_modal_w'>";
  innerPublish += "          <div class='design_modal'>";

  innerPublish += "              <div class='design_modal_cont_w'><div class='design_modal_text'></div></div>";
  innerPublish += "              <div class='btn_dmsm_wrap'>";
  if (option.type === "confirm") {
    innerPublish += "              <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>취소</a>";
  }
  innerPublish += "                  <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>";
  innerPublish += "              </div>";
  innerPublish += "          </div>";
  innerPublish += "  </div>";
  innerPublish += "</div>";
 */
  innerPublish = `
  <div class='design_modal_wrap'>
    <div class='design_modal_tb'>
      <div class='design_modal_td'>
        <div class='bg_design_modal'></div>
        <div class='design_modal'>
          <div class='design_modal_cont_w'>
            <div class='design_modal_maintext'></div>
            <div class='design_modal_subtext'></div>
          </div>
          <div class='btn_dmsm_wrap'>
          
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>${confirmPublish}</a>
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>
          </div>
          <a href='javascript:;' class='btn_modal_close'><span class='hdtext'>닫기</span></a>
        </div>
      </div>
    </div>
  </div>
  `;

  this.modalparent = document.createElement("div");
  this.pagewrap.appendChild(this.modalparent);
  this.modalparent.classList.add("design_modal_insert_wrap");
  this.modalparent.innerHTML = innerPublish;
  this.closetrigger = document.querySelectorAll(".close_dmtrigger");
  this.design_modal_wrap = document.querySelector(".design_modal_wrap");
  this.btn_modal_close = document.querySelector(".btn_modal_close");

  if (option.type === "confirm" || option.type === "alert") {
    this.design_modal_tit = document.querySelector(".design_modal_tit");
    this.design_modal_text = document.querySelector(".design_modal_maintext");
    this.design_modal_subtext = document.querySelector(".design_modal_subtext");
    this.btn_dmsmidentify = document.querySelector(".btn_dmsmidentify");

    if(!!option.main_message){
      this.design_modal_text.innerHTML = option.main_message;
    }else{
      this.design_modal_text.remove();
    }

    if(!!option.sub_message){
      this.design_modal_subtext.innerHTML = option.sub_message;

    }else{
      this.design_modal_subtext.remove();
    }
  }
  if (option.type === "confirm") {
    this.btn_dmsmcancel = document.querySelector(".btn_dmsmcancel");
  }
  if (option.type === "title") {
    this.design_modal_tit.innerHTML = option.title;
  }

  this.bindEvent(option);
};
DesignModal.prototype.show = function() {
  this.pagewrap.style.zIndex = 0;
  this.domHtml.classList.add("touchDis");

  this.design_modal_wrap.classList.add("active");
  setTimeout(() => {
    this.design_modal_wrap.classList.add("motion");
  }, 30);
};
DesignModal.prototype.hide = function() {
  var objThis = this;
  this.design_modal_wrap.classList.remove("motion");
  setTimeout(function() {
    objThis.design_modal_wrap.classList.remove("active");
    document.querySelector(".design_modal_insert_wrap").remove();
    objThis.design_modal_wrap.remove();
    objThis.domHtml.classList.remove("touchDis");
  }, 530);
};
DesignModal.prototype.bindEvent = function(option) {
  var objThis = this;
  let btn_close_item = [this.btn_modal_close, ...this.closetrigger];
  btn_close_item.forEach((element, index) => {
    element.addEventListener(
      "click",
      function() {
        objThis.hide();
      },
      false
    );
  });
  if (this.btn_dmsmidentify !== null) {
    this.btn_dmsmidentify.addEventListener(
      "click",
      function() {
        if (option.identify_callback !== undefined) {
          option.identify_callback();
        }
      },
      false
    );
  }
  if (this.btn_dmsmcancel !== null) {
    this.btn_dmsmcancel.addEventListener(
      "click",
      function() {
        if (option.cancel_callback !== undefined) {
          option.cancel_callback();
        }
      },
      false
    );
  }
};


function getpayBoxFunc(){
  const getpay_box_cols = document.querySelectorAll(".getpay_box_cols");
  const getpay_box_title_row = document.querySelectorAll(".getpay_box_title_row");
  
  let title_array = [];
  getpay_box_title_row.forEach((item)=>{
    title_array.push(item.getBoundingClientRect().height);
  });
  getpay_box_title_row.forEach((item)=>{
    item.style.minHeight = Math.max.apply(null,title_array) +"px";
  });

  if(!!getpay_box_cols){
    getpay_box_cols.forEach((item)=>{
      const thisItemCols = item;
      const thisDetailItem = thisItemCols.querySelectorAll(".getpay_detail_item");
      thisDetailItem.forEach((item,index)=>{
        item.setAttribute("data-compare",index);
      });
      for(var i=0; i<thisDetailItem.length; i++){
        compareFunc(i);
      }
    });
  }

  function compareFunc(count){
    const dataCompare = document.querySelectorAll("[data-compare='"+count+"']");
    let compareArray = [];
    dataCompare.forEach((item)=>{
      compareArray.push(item.getBoundingClientRect().height);
    })
    dataCompare.forEach((item)=>{
      item.style.minHeight = Math.max.apply(null,compareArray) + 'px'; 
    })
  }
  
  /* 

  const dataCompare0 = document.querySelectorAll("[data-compare='0']");
  let compareArray = [];
  dataCompare0.forEach((item,index)=>{
    compareArray.push(item.getBoundingClientRect().height);
  })
  dataCompare0.forEach((item,index)=>{
    item.style.minHeight = Math.max.apply(null,compareArray) + 'px'; 
  })

  const dataCompare1 = document.querySelectorAll("[data-compare='1']");
  let compareArray1 = [];
  dataCompare1.forEach((item,index)=>{
    compareArray1.push(item.getBoundingClientRect().height);
  })
  dataCompare1.forEach((item,index)=>{
    item.style.minHeight = Math.max.apply(null,compareArray1) + 'px'; 
  })

 */
}


function maxHeightFunc(targetGroup){
  groupAction();
  resizeAction(()=>{
    groupAction();
  })
  
  function groupAction(){
    [...targetGroup].forEach((item)=>{
      elementFunc(item);
    });
  }

  function elementFunc(target){
    const heightTarget = document.querySelectorAll(target);
    let heightArray = [];
    heightTarget.forEach((item)=>{
      item.removeAttribute("style");
    });
    heightTarget.forEach((item)=>{
      heightArray.push(item.getBoundingClientRect().height);
    });
    if(window.innerWidth >= 1024){
      heightTarget.forEach((item)=>{
        item.style.height = Math.max.apply(null,heightArray) + "px";
      });
    }
  }
}


function toggleListFunc(){
  const board_toggle_bar = document.querySelectorAll(".board_toggle_bar");
  board_toggle_bar.forEach((item) => {
    item.addEventListener("click",(e)=>{
      e.preventDefault();
      e.currentTarget.closest(".board_toggle_item").classList.toggle("active");
    });
  });
}



function noticePopup(){
  var notice_popup_wrap = document.querySelector(".notice_popup_wrap");
  var notice_popup_cols = document.querySelectorAll(".notice_popup_cols");
  var btn_popup_close = document.querySelectorAll(".notice_popup_wrap .btn_popup_close");
  var btn_popup_close_trigger = document.querySelectorAll(".notice_popup_wrap .close_trigger");
  var today_check_trigger = document.querySelectorAll(".notice_popup_wrap .today_check");
  var notice_popup_cols_length = notice_popup_cols.length;
  
  
  // cookie 조회
  if(document.cookie.length){
    var parseCookie = str =>
      str
      .split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
    }, {});
    var getCookie = parseCookie(document.cookie);
  }
  notice_popup_cols_length = document.querySelectorAll(".notice_popup_cols").length;
  if(notice_popup_cols_length ===0){return;}
  today_check_trigger.forEach(function(element,index){
    if(document.cookie.length===0){return;}
    var parent_target = element.closest(".notice_popup_cols");
    if(getCookie.hasOwnProperty(element.getAttribute("id"))){
      closePopup(parent_target);
    }
  });

  if(document.querySelectorAll(".notice_popup_cols").length==1){
    notice_popup_wrap.classList.add("only_one");
  }else if(document.querySelectorAll(".notice_popup_cols").length>1){
    notice_popup_wrap.classList.remove("only_one");
  }else{
    return;
  }
  
  notice_popup_wrap.classList.add("active");

  btn_popup_close.forEach(function(element){
    element.addEventListener("click",function(e){
      e.preventDefault();
      var parent_target = e.currentTarget.closest(".notice_popup_cols");
      closePopup(parent_target);
    });
  });

  btn_popup_close_trigger.forEach(function(element){
    element.addEventListener("click",function(e){
      e.preventDefault();
      var parent_target = e.currentTarget.closest(".notice_popup_cols");
      closePopup(parent_target);
    });
  });

  today_check_trigger.forEach(function(element){
    element.addEventListener("click",function(e){
      var currentTarget = e.currentTarget;
      var parent_target = currentTarget.closest(".notice_popup_cols");
      if(currentTarget.checked){
        setTimeout(function(){
          closePopup(parent_target);
          setCookie(currentTarget.getAttribute("id"),"true",1);
        },200);
      }
    });
  });

  function closePopup(target){
    var target_element = target;
    notice_popup_cols = document.querySelectorAll(".notice_popup_cols");
    notice_popup_cols_length = notice_popup_cols.length;
    if(notice_popup_cols_length == 1){
      notice_popup_wrap.classList.remove("active");
    }
    target_element.remove();
  }
  var setCookie = function(name, value, exp) {      
    var date = new Date();      
    date.setTime(date.getTime() + exp*24*60*60*1000);      
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';  
  };
}