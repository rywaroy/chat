$(function(){
  var vm = new Vue({
    el:'#index',
    data:{
      nickname:'',
      img:1,
      name:''
    },
    mounted:function(){
      if(localStorage.getItem('nickname')){
        this.nickname = localStorage.getItem('nickname');
      }
      if(localStorage.getItem('img')){
        this.img = localStorage.getItem('img');
      }
    },
    computed:{
      url:function(){
        return 'http://www.3zsd.com:3000/img/' + this.img + '.png';
      }
    },
    methods:{
      login:function(){
        if(this.nickname){
          localStorage.setItem('nickname',this.nickname);
        }
        localStorage.setItem('img',this.img);
        window.location.href = 'chat.html';
      },
      sub:function(){
        var _this = this;
        if(!this.name){
          return;
        }
        $.ajax({
          url:'http://www.3zsd.com/impression/put',
          type:'post',
          data:{
            title:_this.name
          }
        }).done(function(res){
           if(res.state == '1'){
             $.pop('提交成功');
             _this.name = '';
           }
        })
      }
    }
  });
});
