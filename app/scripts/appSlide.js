(function($){
  $.fn.appSlide = function(params) {
    var defaultParams = {
      slideTime: 3000,
      isShowArrow: true,
      isShowIndicator: $(this).has('.indicator')
    };
    params = jQuery.extend({}, defaultParams, params);

    var self = $(this);
    var number = self.find('.items .item').length;
    var timer;
    var timeout = params.slideTime;
    var isShowIndicator = params.isShowIndicator;
    var isShowArrow = params.isShowArrow;
    var width = self.width();

    var slideFun = function() {
      var index = self.find('.items .item').index(self.find('.items .current'));
      index++;
      index = index>=number ? 0 : index;

      changePosition(index, 'right')
    };

    function changePosition(position, direction) {

      var current = self.find('.items .item').index(self.find('.items .current'));
      if(current==position){
        return false;
      }

      if(direction===undefined){
        if(current<position){
          direction = 'right';
        }else{
          direction = 'left';
        }
      }

      if(direction=='right'){
        var left = - width;
        var item = self.find('.items .item').removeClass('current').eq(position);
        self.find('.slides').append(item.clone());
        item.addClass('current');

        self.find('.slides').animate({
          left: left + 'px'
        }, 800, function(){
          self.find('.slides .item').eq(0).remove();
          self.find('.slides .item').addClass('current');
          self.find('.slides').css({left: 0});
        });
      }else{
        var item = self.find('.items .item').removeClass('current').eq(position);
        self.find('.slides').prepend(item.clone());
        item.addClass('current');
        self.find('.slides').css({left: - width});

        self.find('.slides').animate({
          left: 0
        }, 800, function(){
          self.find('.slides .item').eq(1).remove();
          self.find('.slides .item').addClass('current');
        });
      }

      if(isShowIndicator){
        self.find('.indicator .item').removeClass('current');
        self.find('.indicator .item .bg').remove();
        self.find('.indicator .item').eq(position).addClass('current');
      }
    }

    function right(){
      var index = self.find('.items .item').index(self.find('.items .current'));
      index++;
      index = index>=number ? 0 : index;

      changePosition(index, 'right')
    }

    function left(){
      var index = self.find('.items .item').index(self.find('.items .current'));
      index--;
      index = index<0 ? number-1 : index;

      changePosition(index, 'left')
    }

    self.hover(function(){
      clearInterval(timer);
    }, function() {
      timer = setInterval(slideFun, timeout);
    });

    if(isShowIndicator){
      self.find('.indicator .item').click(function(){
        var index = self.find('.indicator .item').index($(this));

        changePosition(index)
      });
    }

    if(isShowArrow){
      self.find('.left-arrow').click(left);
      self.find('.right-arrow').click(right);
    }

    $(window).resize(function(){
      width = self.find('.content').width();
      self.find('.content .item').width(width);
    });

    self.find('.content .item').width(width);
    if(!self.is('.content .slides')){
      self.find('.content').append('<div class="slides"></div>').find('.slides').append(self.find('.items .item').eq(0).clone());
    }

    self.find('.items .item').eq(0).addClass('current');
    timer = setInterval(slideFun, timeout);

    // 增加移动端滑动
    var startX, endX;
    var mlen;
    self.on('touchstart', function(e){
      // e.cancelable && e.preventDefault();
      var touch = e.originalEvent.changedTouches[0];
      startX = touch.pageX;
    }).on('touchend', function(e){
      // e.cancelable && e.preventDefault();
      var _touch = e.originalEvent.changedTouches[0];
      endX = _touch.pageX,
      mlen = endX - startX;
      if(mlen > 0){
        left();
      }else if(mlen < 0 ){
        right();
      }
    })
  };

  $(function(){
    $('[data-slide]').each(function(){
      $(this).appSlide();
    });
  });
})(jQuery);

