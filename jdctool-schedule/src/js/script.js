$(function(){
var schedule = {
    dataObj: null,
    teamData: null,
    userDataChange: false,
    defaultWorkday: 5,
    msFormat: 24*60*60*1000,
    weekDayTxt: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    editArea: $('#J_editArea'),
    init: function(){
        var me = this; 
        me.initData();
        me.bindHandler();
    },
    initData: function(){
        var me = this;
        me.initDateTime();
        me.getjsonData();
    },
    bindHandler: function(){
        var me = this;
        //dataTime
        $('#J_startTime').on('changeDate', function(e){
            me.rendWorkdayList();
            $('#J_endTime').datetimepicker('setStartDate',$('#J_startTime').val());
        });
        $('#J_endTime').on('changeDate', function(e){
            me.rendWorkdayList();
        });
        //type
        $('#J_teamType').on('change', function(e){
            me.renderTeamUser();
        });
        //userManager
        $('#J_editUsers').on('click', function(e){
            $('#J_teamUsers').toggleClass('hide');
        });
        $('#J_saveUsers').on('click', function(e){
            var dataStr = JSON.stringify(me.dataObj);
            $.ajax({
                url: 'data.php',
                data: {type: 'save', datas: dataStr},
                type: 'POST',
                success: function(data){
                    if(data == 'ok'){
                        $('#J_saveUsers').addClass('hide');
                    }
                }
            });
        });
        $('#J_teamUsers').on('click', '.team-user-item', function(e){
            var item = $(this);
            var data = item.data('data');
            var index = item.index();
            me.editUserItem(data, index);
        });
        $('#J_teamUsers').on('click', '.team-user-item .btn-del', function(e){
            e.stopPropagation();
            var item = $(this).parent();
            var index = item.index();
            item.remove();
            me.editArea.find('.user-item').eq(index).remove();
            //data
            me.teamData.splice(index,1);
            //sign
            me.userDataChange = true;
            $('#J_saveUsers').removeClass('hide');
        });
        $('#J_userAdd').on('click', function(e){
            var popupNode = $('#J_userPopup');
            popupNode.find('input').val('');
            popupNode.attr('data-type','new');
            popupNode.find('.modal-title').text('新增成员');
        });
        //userManager-popup
        $('#J_userPopup .btn-save').on('click', function(e){
            var popupNode = $('#J_userPopup');
            var type = popupNode.attr('data-type');
            var index = popupNode.attr('data-index');
            var inputArr = popupNode.find('.form-control');
            var obj = type == 'edit' ? me.teamData[index] : {};
            var item;
            for(var i=0, len=inputArr.length; i<len; i++){
                item = $(inputArr[i]);
                obj[item.attr('name')] = item.val();
            }
            //switchType
            if(type == 'edit'){
                me.editTeamUserItem(obj,index);
            }else if(type == 'new'){
                me.renderTeamUserItem(obj);
                me.teamData.push(obj);
            }
            //close
            popupNode.modal('hide');
            me.userDataChange = true;
            $('#J_saveUsers').removeClass('hide');
        });
        //schedule-add
        me.editArea.on('click', '.schedule-btn-add', function(e){
            var node = $('#J_tpl .schedule-item').clone();
            node.insertBefore($(this));
        });
        //schedule-del
        me.editArea.on('click', '.schedule-btn-del', function(e){
            var parent = $(this).parents('.schedule-item');
            parent.remove();
        });
        //generator
        $('#J_generator').on('click', function(e){
            me.renderTable();
        });
        $('#J_result .btn').on('click', function(e){
            me.selectTable();
        });
    },
    initDateTime: function(){
        var me = this;
        var dateTimeConf = {
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            minView: 3,
            forceParse: 0,
            startDate: new Date()
        }
        var type = 1;
        //startTime
        var time = me.getMondayDate(new Date(), type);
        $('#J_startTime').val(time);
        $('#J_startTime').datetimepicker(dateTimeConf);
        //endTime
        time = new Date(time).getTime() + (me.defaultWorkday-1)*me.msFormat;
        time = new Date(time);
        time = me.getFormatDate(time, type);
        $('#J_endTime').val(time);
        $('#J_endTime').datetimepicker(dateTimeConf);
        $('#J_endTime').datetimepicker('setStartDate',$('#J_startTime').val());
        //
        me.rendWorkdayList();
    },
    getMondayDate: function(date,type){
        var me = this;
        var day = date.getDay();
        if(day !=0){
            var time = date.getTime() + (7-day+1)*me.msFormat;
            date = new Date(time);
        }
        var str = me.getFormatDate(date, type);
        return str;
    },
    getFormatDate: function(date, type){
        var me = this;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month<9 ? '0'+month : month;
        var day = date.getDate();
        day = day<9 ? '0'+day : day;
        var weekDay = me.weekDayTxt[date.getDay()];
        switch(type){
            case 1: str = year + '-' + month + '-'+ day; break;
            case 2: str = weekDay+'('+ (date.getMonth() + 1)+'月'+ date.getDate() +'日'+')'; break;
            case 3: str = month + '.' + day; break;
        }
        return str;
    },
    rendWorkdayList: function(){
        var me = this;
        var startTime = $('#J_startTime').val();
        startTime = new Date(startTime).getTime();
        var endTime = $('#J_endTime').val();
        endTime = new Date(endTime).getTime();
        var days = (endTime - startTime)/me.msFormat;
        var tpl = $('#J_tpl .days-item');
        var item, itemStr, itemNode;
        //clean
        $('#J_weekDays').html('');
        //render
        for(var i=0; i<=days; i++){
            item = startTime + i*me.msFormat;
            item = new Date(item);
            itemStr = me.getFormatDate(item,2);
            itemNode = tpl.clone();
            itemNode.find('input').data('date',item);
            itemNode.find('.txt').text(itemStr);
            $('#J_weekDays').append(itemNode);
        }
    },
    //getjsonData
    getjsonData: function(){
        var me = this;
        $.ajax({
            url: 'data.php',
            data: {type: 'get'},
            dataType: 'jsonp',
            success: function(data){
                me.dataObj = data;
                me.renderTeamUser();
                me.editArea.find('.form-group').removeClass('hide');
            }
        });
    },
    //render
    renderTeamUser: function(){
        var me = this;
        var team = $('#J_teamType').val();
        //clean
        me.editArea.find('.user-item').remove();
        $('#J_teamUsers .team-user-item').remove();
        //
        var userArr = me.dataObj[team];
        me.teamData = userArr;
        var userTpl = $('#J_tpl .user-item');
        var itemData;
        for(var i=0, len=userArr.length; i<len; i++){
            item = userArr[i];
            me.renderTeamUserItem(item);
        }
    },
    renderTeamUserItem: function(data){
        var me = this;
        var itemNode = $('#J_tpl .user-item').clone();
        itemNode.find('.control-label').text(data.name);
        // me.editArea.append(itemNode);
        itemNode.insertBefore(me.editArea.find('.form-group').last());
        //usersManage
        itemNode = $('#J_tpl .team-user-item').clone();
        itemNode.find('.txt').text(data.name);
        itemNode.data('data',data);
        itemNode.insertBefore($('#J_userAdd'));
    },
    editTeamUserItem: function(data, index){
        var me = this;
        var nameStr = data.name;
        me.editArea.find('.user-item').eq(index).find('.control-label').text(nameStr);
        //usersManage
        $('#J_teamUsers .team-user-item').eq(index).find('.txt').text(nameStr);
    },
    //usersManage
    editUserItem: function(data, index){
        var me = this;
        var popupNode = $('#J_userPopup');
        var inputArr = popupNode.find('.form-control');
        var item, itemName;
        for(var i=0, len=inputArr.length; i<len; i++){
            item = $(inputArr[i]);
            itemName = item.attr('name');
            item.val(data[itemName]);
        }
        //show
        popupNode.find('.modal-title').text('编辑成员');
        popupNode.attr({
            'data-type': 'edit',
            'data-index': index
        });
        popupNode.modal('show');
    },
    //table
    renderTable: function(){
        var me = this;
        var tableNode = $('#J_result table');
        var dateArr = $('#J_weekDays input:checked');
        var offsetCol = 3;
        var offsetArr = ['姓名', '座机', '手机'];
        var totalCol = offsetCol + dateArr.length;
        //head
        var headPre = '上海设计部';
        var headStr = $('#J_teamType option:selected').text();
        headStr = headPre + headStr+'工作计划';
        // headDate
        var year = new Date().getFullYear();
        var first = $(dateArr[0]).data('date');
        var last = dateArr[dateArr.length-1];
        last = $(last).data('date');
        var headDate = '(' + year +'.' + me.getFormatDate(first,3)
                        + '~' + me.getFormatDate(last,3) + ')';
        headStr += '<em class="data">'+headDate+'</em>';
        tableNode.find('thead th').html(headStr)
                 .attr('colspan', totalCol);
        //title
        var titleNode = tableNode.find('.title');
        titleNode.html('');
        var titleItem = null, index;
        for(var i=0; i<totalCol; i++){
            titleItem = $('<td>');
            if(i>0 && i<totalCol-offsetCol+1){
                index = i-1;
                titleItem.text($(dateArr[index]).parent().text());
            }else{
                index = i>0 ?  i-dateArr.length : i;
                titleItem.text(offsetArr[index]);
            }
            titleNode.append(titleItem);
        }
        //users
        var userData, scheduleData;
        tableNode.find('.table-user').remove(); //clean
        for(i=0, len=me.teamData.length; i<len; i++){
            userData = me.teamData[i];
            scheduleData = me.editArea.find('.user-item').eq(i).find('.schedule-item');
            me.renderUserRow(userData, scheduleData);
        }
        //show
        $('#J_result').removeClass('hide');
    },
    renderUserRow: function(userData, scheduleData){
        var me = this;
        var tableNode = $('#J_result table');
        var dateArr = $('#J_weekDays input:checked');
        var offsetCol = 3;
        var offsetArr = ['name', 'tel', 'mobile'];
        var totalCol = offsetCol + dateArr.length;
        var rowTotal = offsetCol + scheduleData.length;
        //row
        var rowNode = $('<tr>').attr('class','table-user');
        var colNum = 0;
        var item, index;
        var tmp, content, num, color;
        for(var i=0; i<rowTotal; i++){
            item = $('<td>');
            if(i>0 && i<rowTotal-offsetCol+1){
                index = i-1;
                tmp = $(scheduleData[index]);
                content = tmp.find('.content').val();
                num = tmp.find('.num').val();
                num = parseInt(num);
                num = isNaN(num) ? 1 : num;
                color = tmp.find('select').val();
                item.text(content)
                    .attr({
                        'colspan': num,
                        'class': color+'-td schedule'
                    });
                colNum += num;
            }else{
                index = i>0 ?  i-scheduleData.length : i;
                content = userData[offsetArr[index]];
                item.text(content)
                    .attr('class', offsetArr[index]);
                colNum++;
            }
            rowNode.append(item);
        }
        if(colNum<totalCol){
            item = $('<td>');
            item.attr('colspan', totalCol-colNum);
            item.insertBefore(rowNode.find('.tel').last());
        }
        tableNode.append(rowNode);
    },
    selectTable: function(){
        var me = this;
        var range = document.createRange();
        var table = $('#J_result table')[0];
        range.selectNode(table);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
};


//init
schedule.init();


});