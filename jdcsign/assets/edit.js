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
        preveiwNode.show();
        preveiwNode.parent().show();
        preveiwNode.text(data);
      });
      me.inputArr.on('blur', function(){
        var data = $(this).val();
        //preview
        var preStr = $(this).attr('data-preview');
        var preveiwNode = $('.preview '+preStr);
        //exclude
        if(preStr.match('mood')){
          return;
        }
        if(preStr.match('name')){
          if(data.length == 0){
            preveiwNode.hide();
          }
          return;
        }
        if(data.length==0){
          preveiwNode.parent().hide();
        }
      });
      //jobType
      $('#J_jobType').on('change',function(){
        var cls = $(this).val();
        cls = 'team-icon '+cls;
        $('.team-icon').attr('class', cls);
      });
      //teamType
      $('#J_teamType').on('change',function(){
        var str = $(this).find('option:selected').text();
        $('.team-type').text(str);
      });
      $('#J_teamOther input:checkbox').on('change', function(){
        var check = $(this).prop('checked');
        $('#J_teamType').prop('disabled', check);
        $('#J_teamOther input:text').prop('disabled', !check);
        //data
        if(check){
          $('#J_teamOther input:text').trigger('propertychange');
        }else{
          $('#J_teamType').change();
        }
      });
      //phoneNum
      $('#J_phoneNum').on('blur', function(){
        var str = $(this).val();
        var first = 3, second = 7, third = 11;
        var maxLen = third +2;
        if(str.length<third || str.length == maxLen){
          return;
        }
        var formatStr = str.substring(0,first)+"-"+
                        str.substring(first,second)+"-"+
                        str.substring(second,str.length);
        $(this).val(formatStr);
        $(this).trigger('propertychange');
      });
      //clear
      $('#J_clearContact').on('click', function(e){
        var contactArr = $('.edit .input-contact');
        contactArr.val('');
        contactArr.trigger('blur');
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
                me.renderAvatar(result.url);
                // var time = new Date().getTime();
                // $('.avatar img').attr("src",result.url+"?t="+time);
              }else{
                alert(result.msg);
              }
              //
              $('.upload-button').removeClass('disabled');
              $('#upload_image').show();
          }
      });
      //avatar-default
      $('#J_avatarDefault img').on('click', function(){
        var url = $(this).attr('src');
        me.renderAvatar(url);
      });
      //commponent
      $('.dropdown-toggle').on('click', function(){
        var parent = $(this).parent();
        var toggle = $(this).attr('data-toggle');
        var menuNode = parent.find('.'+toggle+'-menu');
        menuNode.toggle();
      });
      $('body').on('click', function(e){
        var target = $(e.target);
        if(target.hasClass('dropdown-toggle') || $(e.target).parents('.btn').length>0){
          return;
        }else{
          $('.dropdown-menu').hide();
        }
      });
    },
    renderAvatar: function(url){
      var time = new Date().getTime();
      $('.avatar img').attr("src",url+"?t="+time);
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
                  '<h4>生成图片<em>（在下方图片上点击右键“保存”即可）</em></h4>'+
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