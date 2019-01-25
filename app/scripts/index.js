$(function(){
  var width, height, top = 0;

  var windowWidth = $('body').width();

  function resize(){
    width = $('body').width();
    height = $(window).height();
    var panelLength = 0;
    if(width>768 || !$.browser.mobile){
      panelLength = width*0.33/849 * 363;
      $('.panels').css({'height': panelLength});
    }else{
      panelLength = width / 849 * 363;
      $('.panels .panel').css({'height': panelLength});
    }

    if(!$.browser.mobile){
      $('.banners').height(width/2.844444444);
    }

    // 设置移动端轮播图高度 1080*1400
    var section = document.getElementById('m-switch')
    if($.browser.mobile){
      section.style.height = width * 1380/750 + 'px'
      section.style.display = 'block';
    }else{
      section.style.display = 'none';
    }

    // 设置字体
    width = document.body.clientWidth;
    var targets = document.querySelectorAll('[data-font-size]');
    [].forEach.call(targets, function(target){
      target.style.fontSize = width/2560*100 + 'px';
    });
  }

  resize();
  if(width>768){
    $(window).resize(resize);
  }else{
    window.addEventListener('orientationchange', function(){
      setTimeout(function(){
        resize()
      }, 300);
    });
  }

  function scroll(event){
    globalScroll();

    top =  $(window).scrollTop();

    $('.banners').each(function(index, element){
      var self = $(element);
      if(top>=self.offset().top - 0.5*height){
        self.find('*').addClass('active');
      }
    });
  }



  $(window).scroll(scroll);
  scroll();
});
