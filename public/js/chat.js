$(function() {
  var socket = io.connect('192.168.31.156:3000');
  socket.on('send.message', function(msg,img,time,nickname,id) {
    var data = {
      msg:msg,
      img:img,
      time:time,
      nickname:nickname,
      id:id
    };
    vm.list.push(data);
    vm.$nextTick(function(){
      vm.scroll('bot');
    });
  });
  socket.on('leave',function(name){
    $.pop(name + '离开了聊天室',1);
  });
  socket.on('loginSuccess',function(id){
    vm.id = id;
  });
  socket.on('getcount',function(count){
    vm.count = count;
    vm.getChatList();
  });
  socket.on('sendlist',function(list,num){
    vm.list = list.concat(vm.list);
    vm.count = num;
    if(num > 0){
      vm.scrollstate = true;
    }
    vm.$nextTick(function(){
      vm.scroll();
      vm.scroller.scrollToElement(document.getElementById('li10'),0,0,-30)
    });
  });

  var name = localStorage.getItem('nickname') || '';

  socket.emit('login',name);
  socket.emit('count');


  var html = '<li :class="[\'message-reply-li f-x\',info.id == id ? \'me\':\'others\']" :id="\'li\'+index">';
  html += '<div class="message-reply-avatar" :style="{backgroundImage:\'url(\'+avatar+\')\'}"></div>';
  html += '<div class="message-reply-box f-x">';
  html += '<div class="message-reply-name">{{info.nickname}}</div>';
  html += '<div class="claer"></div>';
  html += '<div class="message-reply-content">{{info.msg}}<div class="message-reply-angle"></div></div>';
  html += '</div>';
  html += '</li>';

  Vue.component('chat-li',{
    template:html,
    props:['info','id','index'],
    computed:{
      avatar:function(){
        return 'http://www.3zsd.com:3000/img/'+ this.info.img+ '.png';
      }
    }
  });

  var vm = new Vue({
    el: '#chat',
    data: {
      content: '',
      img:localStorage.getItem('img'),
      list:[],
      id:'',
      scroller:'',
      count:'',
      scrollstate:true,
      focus:false
    },
    mounted:function(){
      this.scroll();
    },
    methods: {
      send: function() {
        if(!this.content){
          return;
        }
        socket.emit('send.message', this.content,this.img,new Date().getTime());
        this.content = '';
      },
      scroll:function (type) {
          var _this = this;
          if(this.scroller){
              this.scroller.refresh();
              if(type == 'bot' && (this.scroller.y - this.scroller.maxScrollY) < 200){
                this.scroller.scrollTo('0',this.scroller.maxScrollY,300);
              }

          }else{
              this.scroller = new BScroll(document.getElementById('wrapper'),{
                  probeType: 3,
                  click:true
              });
              this.scroller.on('scroll', function (pos) {
                  if (pos.y > 20) {
                      if (_this.scrollstate) {
                          _this.scrollstate = false;
                          setTimeout(function(){
                            _this.getChatList();
                          },1000)
                      }
                  }
                  // console.log(_this.scroller)
              });
          }

      },
      down:function(e){
        if(e.keyCode == '13'){
          this.send();
        }
      },
      getChatList:function(){
        socket.emit('getlist',this.count);
      },
      getfocus:function(){
        this.focus = true;
      },
      getblur:function(){
        this.focus = false;
      }
    }
  });
});
