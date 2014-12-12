//edit
$(function(){
  var edit = {
    inputArr: $('.edit input'),
    isGenerate: false,
    init: function(){
      var me = this;
      me.bindHandler();
    },
    bindHandler: function(){
      var me = this;
      me.inputArr.on('input propertychange', function(){
        var data = $(this).val();
        //preview
        var preStr = $(this).attr('data-preview');
        var preveiwNode = $('.preview '+preStr);
        preveiwNode.text(data);
      });
      //teamType
      $('#J_teamType').on('change',function(){
        var cls = $(this).val();
        cls = 'team-icon '+cls;
        $('.team-icon').attr('class', cls);
      });
      //generate
      $('#J_getSignImg').on('click', function(e){
        e.preventDefault();
        if(me.isGenerate){
          return;
        }
        //disabled
        me.isGenerate = true;
        $(this).text('正在生成签名...');
        $(this).addClass('disabled');
        me.generateImg();
      });
      //upload avastar
      $('#upload_image').fileupload({
          url: 'uploadPic.php',
          dataType: 'json',
          autoUpload: true,
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
          maxFileSize: 5000000, // 5 MB
          start: function(e){
            $('.upload-button').addClass('disabled');
            $('#upload_image').hide();
              $('#J_uploadDownload').addClass('loading');
          },
          done: function(e, data){
              var result = data.result;
              if(result.status == 'success'){
                var time = new Date().getTime();
                $('.avatar img').attr("src",result.url+"?t="+time);
              }else{
                alert(result.msg);
              }
              //
              $('.upload-button').removeClass('disabled');
              $('#upload_image').show();
          }
      });
    },
    generateImg: function(){
      var me = this;
      var url = 'generateSign.php';
      $.ajax({
          url: url,
          type: 'POST',
          data: {content: $('.sign-content').html()},
          success: function(data){
            me.renderSignImg(data);
            me.recoverBtn();
          }
      });
    },
    renderSignImg: function(url){
      var me = this;
      var node = $('.result');
      if(node.length == 0){
        node = $('<div class="result clearfix">'+
                  '<h4>生成图片</h4>'+
                  '<span class="col-sm-2"></span>'+
                  '<div class="col-sm-10"><img src="'+url+'"></div>'+
              '</div>');
        node.css('display','none');
        node.insertBefore('.preview');
        setTimeout(function(){
          node.slideDown(300);
        },100);
      }
      node.find('img').attr('src', url);
    },
    recoverBtn: function(){
      var me = this;
      me.isGenerate = false;
      var node = $('#J_getSignImg');
      node.text('生成签名');
      node.removeClass('disabled');
    }
  }
  //init
  edit.init();
});