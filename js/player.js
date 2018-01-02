// 存储全局变量
var lyricWords="[by:文斯莫克-山治]\n[00:00.00] 作曲 : 朱贺\n[00:01.00] 作词 : 朱贺\n[00:03.64]编曲 : 王柏鸿\n[00:19.04]今天妆令人特别着迷\n[00:21.00]oh我说baby\n[00:23.02]出门前换上新的心情\n[00:25.27]oh我的lady\n[00:27.13]你喜欢有小情绪\n[00:30.31]像晴天的乌云\n[00:35.24]头发长见识短的惊奇\n[00:37.56]表情丰富令人着迷\n[00:39.86]你的一切我都好奇像秘密\n[00:43.54]安全带系好带你去旅行\n[00:47.55]穿过风和雨\n[00:51.53]我想要带你去浪漫的土耳其\n[00:55.47]然后一起去东京和巴黎\n[00:59.58]其实我特别喜欢迈阿密\n[01:04.00]和有黑人的洛杉矶\n[01:08.59]其实亲爱的你不必太过惊奇\n[01:12.14]一起去繁华的上海和北京\n[01:16.36]还有云南的大理保留着回忆\n[01:20.63]这样才有意义\n[01:43.30]今天妆令人特别着迷\n[01:45.58]oh我说baby\n[01:47.23]出门前换上新的心情\n[01:50.21]oh我的lady\n[01:51.17]你喜欢有小情绪\n[01:54.84]像晴天的乌云\n[01:59.52]头发长见识短的惊奇\n[02:02.47]表情丰富令人着迷\n[02:04.23]你的一切我都好奇像秘密\n[02:07.86]安全带系好带你去旅行\n[02:11.74]穿过风和雨\n[02:15.76]我想要带你去浪漫的土耳其\n[02:19.58]然后一起去东京和巴黎\n[02:23.61]其实我特别喜欢迈阿密\n[02:27.83]和有黑人的洛杉矶\n[02:32.06]其实亲爱的你不必太过惊奇\n[02:36.39]一起去繁华的上海和北京\n[02:40.41]还有云南的大理保留着回忆\n[02:45.19]这样才有意义\n[02:49.26]我想要带你去浪漫的土耳其\n[02:53.18]然后一起去东京和巴黎\n[02:57.21]其实我特别喜欢迈阿密\n[03:01.48]和有黑人的洛杉矶\n[03:06.15]其实亲爱的你不必太过惊奇\n[03:10.23]一起去繁华的上海和北京\n[03:14.36]还有云南的大理保留着回忆\n[03:18.79]这样才有意义\n[03:28.05]还有云南的大理保留着回忆\n[03:36.05]\n[03:36.85]缩混：王柏鸿\n[03:37.02]监制：三千\n[03:38.32]制作人：王柏鸿+朱贺\n[03:39.63]和声/和声编写：王柏鸿\n[03:40.93]录音室：Hot Music Studio\n[03:41.20]混音室：Hot Music Studio\n[03:42.59]OP/SP：千和世纪\n";
var gblps = [];
/**
 * webTitle 记录页面原本的标题
 * audio 音乐标签对象$("#myAudio")
 * paused 是否暂停
 * music_bar 音乐进度条对象new MKPGB("#music-progress", 0, mBcallback)
 * lyricArea 歌词区域对象$("#lyric")
 */
$(function(){
	gblps.webTitle = document.title;      // 记录页面原本的标题
	initProgress();     // 初始化//音量条、进度条（进度条初始化要在 Audio 前，别问我为什么……）
	initAudio();
	
	$(".btn-play").click(function(){
		pause();
	});
//	var count = 0;
//	var timer = setInterval(function(){
//		if($(".lrc-item").eq(count+1).attr('data-no')){
//			$(".lrc-item").eq(count).removeClass("lplaying");
//			count++;
//			//alert(count);
//			$(".lrc-item").eq(count).addClass("lplaying");
////			console.log("count:"+count);
////			console.log("$('.lyric').height() / 2:"+$(".lyric").height() / 2);
//			var scroll = ($("#lyric").children().height() * count) - ($("#lyric").height() / 2);
////			console.log("scroll:"+scroll);
//			if(scroll>0)
//  			$("#lyric").stop().animate({scrollTop: scroll}, 1000);
//		}
//	},1000);
	initLyric();
	
	
});

function initLyric(){
	gblps.lyric = parseLyric(lyricWords);    // 解析获取到的歌词
	// 显示全部歌词
    var i = 0;
    gblps.lyricArea = $("#lyric");
    for(var k in gblps.lyric){
        var txt = gblps.lyric[k];
        if(!txt) txt = "&nbsp;";
        var li = $("<li data-no='"+i+"' class='lrc-item'>"+txt+"</li>");
        gblps.lyricArea.append(li);
        i++;
    }
}


function initAudio(){
	gblps.audio = $("#myAudio");
	// 为 video 元素添加 ontimeupdate 事件，如果当前播放位置改变则执行函数 
	gblps.audio[0].addEventListener("timeupdate", updateProgress);
	gblps.audio[0].addEventListener("play", audioPlay);// 开始播放了
	gblps.audio[0].addEventListener("pause",audioPause); // 暂停
	gblps.audio[0].addEventListener("ended",nextMusic);// 播放结束
	gblps.audio[0].addEventListener("error",audioErr);// 播放器错误处理
	//获取audio的时间设为audioTime
	gblps.audio[0].addEventListener("canplay",function(){
		var time = formatTime(gblps.audio[0].duration);
		$(".totalTime").text(time);
	});
	
}

function audioPlay(){
	gblps.paused = false;
	$(".btn-play").addClass("btn-state-paused");// 恢复暂停
	music_bar.lock(false);// 取消进度条锁定
	//$("#music-progress .mkpgb-dot").addClass("dot-move");   // 小点闪烁效果
}

function audioPause(){
	console.log("audio pause");
	gblps.paused = true;// 更新状态（已暂停）
	$(".btn-play").removeClass("btn-state-paused");// 取消暂停
	//$("#music-progress .dot-move").removeClass("dot-move");   // 小点闪烁效果
}
function prevMusic(){}

function nextMusic(){
	console.log("audio end and next music");
}

function audioErr(){
	
}

function pause(){
	//console.log(gblps.audio[0]);
	if(gblps.paused === false){
		gblps.audio[0].pause();
	}else{
		gblps.audio[0].play();
	}
}

// 歌曲时间变动回调函数
function updateProgress(){
	//console.log(gblps.audio[0].currentTime);
    // 暂停状态不管
    if(gblps.paused !== false) 
    	return true;
    // 同步进度条
	music_bar.goto(gblps.audio[0].currentTime / gblps.audio[0].duration);
    // 同步歌词显示	
	scrollLyric(gblps.audio[0].currentTime);
	//修改时间进度条有右边music-time的时间
	$(".curTime").text(formatTime(gblps.audio[0].currentTime));
}

// 音乐进度条拖动回调函数
function mBcallback(newVal) {
	var newTime = gblps.audio[0].duration * newVal;
	//修改时间进度条有右边music-time的时间
	$(".curTime").text(formatTime(newTime));
	//console.log("newTime:"+newTime);
	//console.log("gblps.audioTime:"+gblps.audioTime);
  // 应用新的进度
	gblps.audio[0].currentTime = newTime;
//	console.log(gblps.audio[0].currentTime);
	//refreshLyric(newTime);  // 强制滚动歌词到当前进度
	scrollLyric(newTime);   // 强制滚动歌词到当前进度
}

//下面是进度条处理
var initProgress = function(){
	music_bar = new MKPGB("#music-progress", 0, mBcallback);
	music_bar.lock(true);//未播放时锁定不让拖动
	//初始化音量设定
	//.....
}


/**
 * mk(MakeProgressBar)进度条插件
 * @param bar 		:进度条框 id
 * @param percent	:初始量
 * @param callback	:回调函数
 */
MKPGB = function(bar, percent, callback){
	this.bar = bar;
	this.percent = percent;
	this.callback = callback;
	this.locked = true;
	this.init();
}

MKPGB.prototype ={
	init:function(){
		var mk = this, mdown = false;
		//加载进度条html元素
		$(mk.bar).html('<div class="mkpgb-bar"></div><div class="mkpgb-cur"></div><div class="mkpgb-dot"></div>');
		//$(mk.bar).attr("ondragstart","return false");//设置成禁止拖动，可以消除某些时候mouseup时mdown依然等于true的问题
		// 获取偏移量
		mk.minLength = $(mk.bar).offset().left;
		//console.log("mk.minLength:"+mk.minLength);
		mk.maxLength = $(mk.bar).width()+mk.minLength;
		//窗口大小改变偏移量重置
		$(window).resize(function(){
			mk.minLength = $(mk.bar).offset().left;
			mk.maxLength = $(mk.bar).width()+mk.minLength;
		});
		// 监听小点的鼠标按下事件
		$(mk.bar+" .mkpgb-dot").mousedown(function(e){
			e.preventDefault();// 取消原有事件的默认动作
		});
		// 监听进度条整体的鼠标按下事件
        $(mk.bar).mousedown(function(e){
            if(!mk.locked) 
            	mdown = true;
         	barMove(e);
        });
        // 监听鼠标移动事件，用于拖动
        $("html").mousemove(function(e){
            barMove(e);
        });
        // 监听鼠标弹起事件，用于释放拖动
        $("html").mouseup(function(e){
            mdown = false;
        });
        function barMove(e) {
            if(!mdown) return;
            var percent = 0;
            if(e.clientX < mk.minLength){ 
                percent = 0; 
            }else if(e.clientX > mk.maxLength){ 
                percent = 1;
            }else{  
                percent = (e.clientX - mk.minLength) / (mk.maxLength - mk.minLength);
            	//console.log("percent:"+percent);
            }
            mk.callback(percent);
            mk.goto(percent);
            return true;
        }
        mk.goto(mk.percent);
        return true;
	},
	// 跳转至某处
    goto : function(percent) {
        if(percent > 1) percent = 1;
        if(percent < 0) percent = 0;
        this.percent = percent;
        $(this.bar + " .mkpgb-dot").css("left", (percent*100) +"%"); 
        $(this.bar + " .mkpgb-cur").css("width", (percent*100)+"%");
        return true;
    },
    // 锁定进度条
    lock : function(islock) {
        if(islock) {
            this.locked = true;
            $(this.bar).addClass("mkpgb-locked");
        } else {
            this.locked = false;
            $(this.bar).removeClass("mkpgb-locked");
        }
        return true;
    }
}

/** 将时间格式化为 00:00 的格式
 * @param time : 原始时间
 */
function formatTime(time){    
	var hour,minute,second;
	hour = String(parseInt(time/3600,10));
	if(hour.length == 1) hour='0' + hour;
	
	minute=String(parseInt((time%3600)/60,10));
	if(minute.length == 1) minute='0'+minute;
	
	second=String(parseInt(time%60,10));
	if(second.length == 1) second='0'+second;
	
	if(hour > 0) {
	    return hour + ":" + minute + ":" + second;
	} else {
	    return minute + ":" + second;
	}
}

/**	解析歌词
 * 这一函数来自 https://github.com/TivonJJ/html5-music-player
 * @param lrc: 原始歌词文件
 */
function parseLyric(lrc) {
    if(lrc === '') return '';
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;//或则/\[\d*:\d*\.\d*\]/g
        var timeRegExpArr = lyric.match(timeReg);	//同一行可能有多个时间
        if(!timeRegExpArr)continue;					//如果是空行就跳出
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),	//i为忽略大小写
                sec = Number(String(t.match(/\:\d*\.\d*/i)).slice(1));
            var time = min * 60 + parseInt(sec);
            if(sec%1>=0.5){				// 即四舍五入
            	time++;
            }
            lrcObj[time] = clause;
            //console.log(time+":"+clause);
        }
    }
    return lrcObj;
}

/**滚动歌词到指定句
 *  @param time :当前播放时间（单位：秒）
 *	注：本代码还可以优化
 */
function scrollLyric(time) {
    if(gblps.lyric === '' || gblps.lyric === undefined) return false;	//没有歌词就直接返回
    
    time = parseInt(time);  // 时间取整
    
    var k_before;
    var i=0;   // 获取当前歌词是在第几行
    for(var k in gblps.lyric){
        if(k==time){		//这个if可以去掉，只留else if，这样写容易理解(一般timeupdate的时候使用，下面那个if是在点击滚动条的时候使用)
        	break;
        }else if(k>time){	//用于判断time在gblps.lyric中没有的时候（点击滚动条的事件会发生）
        	i--;			//那就定位于上一条
        	time = k_before;
        	break;
        }
        k_before = k;
        i++;
    }
     
    if(gblps.lastLyric == time) return true;  // 歌词没发生改变
    
    gblps.lastLyric = time;  // 记录方便下次使用
    $(".lplaying").removeClass("lplaying");     // 移除其余句子的正在播放样式
    $(".lrc-item[data-no='" + i + "']").addClass("lplaying");    // 加上正在播放样式
    
    var scroll = (gblps.lyricArea.children().height() * (i+1)) - ($("#lyric").height() / 2); 
    console.log(scroll);
    gblps.lyricArea.stop().animate({scrollTop: scroll}, 1000);  // 平滑滚动到当前歌词位置(更改这个数值可以改变歌词滚动速度，单位：毫秒)
    
}