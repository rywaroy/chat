$(function(){
  $.set_font = function (size) {

      // 计算、转换布局单位
      var html = document.getElementsByTagName('html')[0];
      var designFontSize = 100,
          designWidth = size ? size : 750;

      function setFontSize() {
          var winWidth = document.documentElement.getBoundingClientRect().width;
          var fontSize = winWidth / designWidth * designFontSize;

          html.style.fontSize = fontSize + 'px';
      }

      setFontSize();
      window.addEventListener('resize', function () {
          setFontSize();
      });

      return this;
  }

  $.set_font()
  $.pop = function (msg, time, callback) {

      var html = '<div class="oppo">' + msg + '</div>';
      $('body').append(html);
      setTimeout(function () {
          $('.oppo').remove()
          if (typeof (callback) == 'function') {
              callback()
          } else {

          }
      }, (time ? time : 1) * 1000)
  }
})
