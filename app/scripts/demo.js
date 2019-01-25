;(function(win, dom){

  // 去除对 jQuery 的依赖

  var width, height, top = 0;
  var stickSectionTargets;

  function addEvent(element, type, handler){
    if(element.addEventListener){
      element.addEventListener(type, handler, false);
    }else if(element.attchEvent){
      element.attachEvent('on' + type, handler);
    }
  }

  function initStickySection(){
    height = win.screen.height;
    stickSectionTargets = dom.querySelectorAll('.sticky-section');

    [].forEach.call(stickSectionTargets, function(target){
      var opacityBg = target.querySelector('.opacity-bg'),
             sticky = target.querySelector('.sticky'),
             bg = target.querySelector('.bg');

      opacityBg.style.height = height * 1.5 + 'px';
      bg.style.height = height + 80 + 'px';
      sticky.style.height = height + 40 + 'px';
      target.style.height = height * 1.5 + 'px';
    })
  }

  function updateStickySection(){
    height = win.screen.height;
    top = typeof win.scrollY === 'undefined' ? win.pageYOffset : win.scrollY;
    stickSectionTargets = dom.querySelectorAll('.sticky-section');

    [].forEach.call(stickSectionTargets, function(target){
      var h = target.getBoundingClientRect ? target.getBoundingClientRect().height : getComputedStyle(target).height;
      var t = target.offsetTop;

      var opacityBg = target.querySelector('.opacity-bg'),
             sticky = target.querySelector('.sticky'),
             bg = target.querySelector('.bg');

      if(top <= t){
        opacityBg.style.opacity = 0;
      }else if(top >= t + h){
        opacityBg.style.opacity = 0.7;
      }else {
        var opacity =  (top - t) / h *  8;
        opacity = opacity> 0.7 ? 0.7 : opacity;
        opacityBg.style.opacity = opacity;
      }

      if(top <= t){
          sticky.style.position = 'static';

          bg.style.top = '-20px';
          bg.style.bottom = 'auto';
      }else {
        if(top + height < t + h){
          sticky.style.position = 'fixed';

        }else{
          sticky.style.position = 'static';

          bg.style.bottom = '-20px';
          bg.style.top = 'auto';
        }
      }
    });
  }

  function resize(){
    width = dom.body.clientWidth;

    var targets = dom.querySelectorAll('[data-font-size]');
    [].forEach.call(targets, function(target){
      target.style.fontSize = width/900*100 + 'px';
    });

    initStickySection();
  }

  function scroll(){
    height = win.screen.height;
    if(globalScroll) globalScroll();
    updateStickySection();
  }

  function init(){
    addEvent(win, 'scroll', scroll);
    addEvent(win, 'resize', resize);

    setTimeout(function(){
      resize();
      scroll();
    }, 0);
  }

  init();
})(window, document);
