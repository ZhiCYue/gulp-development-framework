var windowTop = 0, oldTop = 0, height, width;
var scrollTop = 0;

$(function(){
  // header
  $('#nav-btn').on('click',function(){
    $(this).toggleClass('act');
    $('#nav').toggleClass('show');
    if($('html, body').hasClass('scroll-lock')){
      $('html, body').removeClass('scroll-lock').scrollTop(scrollTop);
    }else{
      scrollTop = $(window).scrollTop();
      $('html, body').addClass('scroll-lock').css('top', - scrollTop);
    }
    return false
  });

  $('body').click(function(){
    $('#nav-btn').removeClass('act');
    $('#nav').removeClass('show');
    if($('html, body').hasClass('scroll-lock')){
      $('html, body').removeClass('scroll-lock').scrollTop(scrollTop);
    }
  });

  $('#nav>ul>li').hover(function(){
    if($(this).find('ul').length>0){
      $('.second-nav-bg').show();
      $(this).find('ul').stop().animate({
        height: 170
      });
    }
  }, function(){
    $('.second-nav-bg').hide();
    $(this).find('ul').stop().animate({
      height: 0
    });
  });

  // footer
  $('#wechat').on('mouseenter', function(){
      $(this).find('img').stop().fadeIn();
  }).on('mouseleave', function(){
      $(this).find('img').stop().fadeOut();
  });

  // load images for pc or mobile
  function resize(){
    height = $(window).height();
    width = $('body').width();

    var width = $(window).width();
    if(width<768 && $.browser.mobile){
      $('[data-src].m-show').each(function(i, e){
        $(e).attr('src', $(e).data('src'));
      });
    }else{
      $('[data-src].pc-show').each(function(i, e){
        $(e).attr('src', $(e).data('src'));
      });

      $('[data-pc-bg]').each(function(i, e){
        $(e).css({'background-image': 'url(\''+$(e).data('pc-bg')+'\')'});
      });
    }
  }

  $(window).resize(resize);
  resize();

  if($.browser.mobile){
    $('body').addClass('mobile');
  }else{
    $('body').addClass('pc');
  }

  $('[data-href]').click(function(){
    location.href = $(this).data('href');
  });

  $('#loading').hide();

  $('.quick-nav ul a').click(function(e){
    var href = $(this).attr('href');
    var offsetTop = $(href).offset().top - 60;
    $('html, body').stop().animate({
        scrollTop: offsetTop
    }, 'normal', 'swing');
    e.preventDefault();
  });
});

function globalScroll(event){
  windowTop =  $(window).scrollTop();
  var direction;

  if(windowTop>oldTop){
    direction = 'down';
  }else{
    direction = 'up';
  }

  if(windowTop>100){
    $('header').hide();
    $('.quick-nav').show();
  }else{
    $('header').show();
    $('.quick-nav').hide();
  }

  $('[data-scroll]').each(function(index, element){
    var self = $(element);

    if(windowTop+height>=self.offset().top){
      self.addClass('active').find('*').addClass('active');
    }
    if(direction=='up'){
      self.find('*').removeClass('down').addClass('up');
    }else{
      self.find('*').removeClass('up').addClass('down');
    }
  });

  oldTop = windowTop;
}
