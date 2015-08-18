//edit
$(function(){
  var edit = {
    inputArr: $('.edit input'),
    isGenerate: false,
    cropObj: {},
    init: function(){
      var me = this;
      me.resizeView();
      me.bindHandler();
    },
    resizeView: function(){
      var me = this;
      //clean
      $('body').attr('style','');
      //resize
      var bodyOffset = $('body').css('padding-bottom');
      bodyOffset = Number(bodyOffset.replace('px',''));
      var totalH = $(document).height();
      var bodyH = $('body').height()+bodyOffset;
      if(bodyH<totalH){
        $('body').height(totalH-bodyOffset);
      }
      $('.feedback').css('display','block');
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
        if(preStr && preStr.match('mood')){
          return;
        }
        if(preStr && preStr.match('name')){
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
      $('.file_image').fileupload({
          url: 'uploadPic.php',
          dataType: 'json',
          autoUpload: true,
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
          maxFileSize: 5000000, // 5 MB
          start: function(e){
            $(this).parents('.upload-button').addClass('disabled');
            $(this).hide();
          },
          done: function(e, data){
              var result = data.result;
              if(result.status == 'success'){
                var node = $('.avatar img');
                if($(this).attr('name') == 'upload_logo'){
                  node = $('.logo img');
                  me.renderImage(result.url, node);
                }else{//avatar
                  me.renderCropPopup(result);
                  me.showCrop();
                }
              }else{
                alert(result.msg);
              }
              $(this).parents('.upload-button').removeClass('disabled');
              $(this).show();
          }
      });
      //avatar-default
      $('#J_avatarDefault img').on('click', function(){
        var url = $(this).attr('src');
        var node = $('.avatar img');
        me.renderImage(url,node);
      });     
      //crop-event
      $('#J_imageCropPopup').on('click', function(e){
        var target = $(e.target);
        if(target.hasClass('popup')){
          //close
          $('#J_imageCropPopup .btn-close').click();
        }
      });
      $('#J_imageCropPopup .btn-close').on('click', function(e){
        $('#J_imageCropPopup').stop().fadeOut(200);
      });
      $('#J_imageCropPopup .btn-confirm').on('click', function(e){
        var data = $('#J_imgTarget').data('cropData');
        if(!data || data.w==0){
          $('#J_imageCropPopup .alert').fadeIn();
          return;
        }
        var imgUrl = $('#J_imgTarget').attr('src');
        //send data
        $.ajax({
          url: 'uploadPic.php',
          type: 'POST',
          dataType: 'json',
          data: {type: 'crop', data: data, img: imgUrl},
          success: function(data){
            console.log(data,data.url);
            var node = $('.avatar img');
            me.renderImage(data.url, node);
          }
        })
        //close
        $('#J_imageCropPopup .btn-close').click();
      });
      
      //logo-default
      $('#J_logoDefault img').on('click', function(){
        var url = $(this).attr('src');
        var node = $('.logo img');
        me.renderImage(url,node);
      });
      //commponent
      $('.dropdown-toggle').on('click', function(){
        //clean
        $('.dropdown-menu').hide();
        //
        var parent = $(this).parent();
        var toggle = $(this).attr('data-toggle');
        var menuNode = parent.find('.'+toggle+'-menu');
        menuNode.toggle();
      });
      $('body').on('click', function(e){
        var target = $(e.target);
        if(target.hasClass('dropdown-toggle') || $(e.target).parents('.dropdown-toggle').length>0){
          return;
        }else{
          $('.dropdown-menu').hide();
        }
      });
    },
    renderImage: function(url, node){
      var time = new Date().getTime();
      node.attr("src",url+"?t="+time);
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
            setTimeout(function(){
              me.resizeView();
            },450);
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
    },
    renderCropPopup: function(data){
      var me = this;
      $('#J_imageCropPopup .crop-container img').attr({
        src: data.url,
        width: data.width,
        height: data.height,
        style: ''
      });
      me.cropObj.cropW = data.width;
      me.cropObj.cropH = data.height;
    },
    showCrop: function(){
      var me = this;
      //jcrop
      if(me.cropObj.jcropApi){
        me.cropObj.jcropApi.destroy();
      }
      $('#J_imgTarget').Jcrop({
        aspectRatio: 1,
        onChange: me.showCropPreveiw,
        onSelect: me.showCropPreveiw,
        onRelease: function(){
          $('.crop-preview').stop().fadeOut();
        }
      }, function(){
        me.cropObj.jcropApi = this;
      });
      //show
      $('#J_imageCropPopup').stop().show();
      $('#J_imageCropPopup .alert').stop().hide();
      $('.crop-preview').stop().hide();
    },
    // showCropPreveiw:
    showCropPreveiw: function(coords){
      var me = edit;
      //preview
      if(parseInt(coords.w) > 0){
        var rx = 75 / coords.w;
        var ry = 75 / coords.h;

        $('.crop-preview img').css({
          width: Math.round(rx * me.cropObj.cropW) + 'px',
          height: Math.round(ry * me.cropObj.cropH) + 'px',
          marginLeft: '-' + Math.round(rx * coords.x) + 'px',
          marginTop: '-' + Math.round(ry * coords.y) + 'px'
        });
        $('.crop-preview').show();
      }
      //data
      $('#J_imgTarget').data('cropData',coords);
    }
  }
  //init
  edit.init();
});