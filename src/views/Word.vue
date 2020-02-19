<template>
  <div class="word">
    <div class="song-word">
      <div class="song-word-box"></div>
      <div class="song-word-content">
        <!-- 头部 -->
        <div class="header">
          <div class="header-system"></div>
          <div class="sn">
            <span class="sname"></span>
            <span class="header-colse" @click="back()"></span>
          </div>
        </div>

        <!-- 歌词 -->
        <div class="words">
          <div class="words-box"></div>
        </div>

        <!-- 控制条 -->
        <div class="ctrl">
          <!-- 进度条 -->
          <div class="progress-box">
            <div class="clearfix audio-time">
              <span class="fl currenttime">00:00</span>
              <span class="fr duration"></span>
            </div>
            <div class="progress">
              <div class="active-progress"></div>
              <div class="mask"></div>
              <div class="layer"></div>
            </div>
          </div>

          <div class="ctrl-box">
            <div class="ctrl-content">
              <span class="arrow prev"></span>
              <span class="header-play"></span>
              <span class="arrow next"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import $ from "jquery";
import { PublicFunction } from "../public/public.js";
var TIME
$(function() {
  //防止按下拖拽时出现卡音
  var isPress = false;

  //歌词面板
  window.index = 0;

  //控制条的进度条百分比
  window.percent = 0;

  //获取progress-box的宽度
  var progressBoxWidth = $(".progress-box").width();

  //获取mask宽度
  var maskWidth = $(".mask").width();
  console.log("maskWidth ==> ", maskWidth);

  //mask移动范围
  var minLeft = 0;

  var maxLeft = progressBoxWidth - maskWidth;

  var wordsBoxTop = parseFloat($(".words-box").css("top"));
  // console.log('wordsBoxTop ==> ', wordsBoxTop);

  //监听音频实时变化
  audio.ontimeupdate = function() {
    if (isPress) {
      return;
    }

    var thisT = this.currentTime;
    var dt = $(".singer-avatar").data("dt") / 1000;
    var percent1 = thisT / dt;
    $(".currenttime").text(PublicFunction.FormatTime(thisT * 1000));

    //移动滑块
    $(".mask").css({
      left: maxLeft * percent1 + "px"
    });

    //激活进度条
    $(".active-progress").css({
      width: maxLeft * percent1 + maskWidth / 2 + "px"
    });

    //移动歌词

    var $ps = $(".words-box>p");

    //获取p高度
    var pHeight = $($ps[0]).height();
    // console.log('pHeight ==> ', pHeight);

    for (var i = index; i < $ps.length; i++) {
      //获取当前p的时间
      var t1 = Number($($ps[i]).attr("name"));

      //获取下一个p时间
      //防止越界
      var t2 = 0;
      if ($ps[i + 1]) {
        t2 = Number($($ps[i + 1]).attr("name"));
      } else {
        t2 = Number.MAX_VALUE;
      }

      //如果满足条件，歌词处于 $ps[i]
      if (thisT >= t1 && thisT < t2) {
        index = i;

        // console.log('进来');

        $($ps[i])
          .addClass("active")
          .prev()
          .removeClass("active");

        //words-box移动top
        var top = wordsBoxTop - pHeight * i;
        // console.log('top ==> ', top);

        $(".words-box").animate(
          {
            top: top + "px"
          },
          60
        );

        break;
      }
    }
  };



  function move(e) {
    //获取相对于整个页面的x坐标
    var pageX = e.changedTouches[0].pageX;
    // console.log('pageX ==> ', pageX);

    var left = pageX - maskWidth / 2;

    left = left <= minLeft ? minLeft : left >= maxLeft ? maxLeft : left;

    //移动mask
    $(".mask").css({
      left: left + "px"
    });

    //激活进度条
    $(".active-progress").css({
      width: left + "px"
    });

    //设置音频进度
    percent = left / maxLeft;
  }

  //手指开始触碰屏幕
  $(".layer").on("touchstart", function(e) {
    isPress = true;
    move(e);
  });

  //手指在屏幕移动时
  $(".layer").on("touchmove", function(e) {
    move(e);
  });

  //手指离开屏幕时
  $(".layer").on("touchend", function() {
    var ct = audio.duration * percent;
    audio.currentTime = ct;
    $(".currenttime").text(PublicFunction.FormatTime(ct * 1000));

    isPress = false;
  });
});

export default {
  name: "word",
  data() {
    return {
    };
  },

  created() {
    let id = this.$route.params.id;
    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/lyric?id=" + id
    })
      .then(result => {
        console.log(result);
        console.log("歌词加载完毕");

        //获取歌词
        var lrc = result.data.lrc.lyric;

        lrc = lrc.split(/[\n\r]/);

        //去除最后一个空值
        lrc.splice(-1, 1);
        // console.log('lrc ==> ', lrc);

        //保存歌词和歌词时间
        // var lrcData = [];

        for (var i = 0; i < lrc.length; i++) {
          // var o = {};

          var lrcItem = lrc[i].split(/\]/);
          // console.log('lrcItem ==> ', lrcItem);

          //当前歌词的时间
          var songCt = lrcItem[0].slice(1);

          //歌词时间
          var time = songCt.split(/:/);

          //获取分钟
          var minute = Number(time[0]) * 60;

          //获取秒钟
          var second = Number(time[1]);

          //当前歌词的时刻
          var t0 = minute + second;

          //创建歌词列表
          var p = $(`<p class='pword' name="${t0}">${lrcItem[1]}</p>`);
          $(".words-box").append(p);
        }
      })
      .catch(err => {
        console.log("err");
      });
  },

  mounted() {
    TIME= this.$route.params.time;
    let time = this.$route.params.time;
    console.log("word time", time);
    $(".duration").text(PublicFunction.FormatTime(time));
  },

  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>


<style lang="less" scoped>
.word {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  color: #000;
  right: 0px;

  .song-word-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .song-word-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .header {
    height: calc(24px + 56px);
    background-color: #36d7b6;
    /* background-color: #666; */
  }

  .header-system {
    height: 24px;
    /* background-color: #000; */
  }

  .sn {
    text-align: center;
    height: 56px;
    line-height: 56px;
    position: relative;
    font-size: 24px;
    letter-spacing: 3px;
  }

  .header-colse {
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    margin: auto 0;
    background: url("../assets/icons/back2.png") no-repeat center center;
    background-size: 30px 30px;
  }

  .words {
    height: calc(100% - 56px - 24px - 150px);
    /* background-color: #eee; */
    overflow-y: hidden;
    position: relative;
  }

  .ctrl {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150px;
    /* background-color: #aaa; */
  }

  .progress-box {
    font-size: 12px;
    height: 29px;
    margin-bottom: 10px;
  }

  .audio-time {
    padding: 0 10px;
    height: 15px;
    line-height: 15px;
  }

  .progress {
    height: 4px;
    background-color: #aaa;
    margin-top: 10px;
    position: relative;
  }

  .active-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 4px;
    width: 0;
    background-color: #83f7d2;
  }

  .mask {
    position: absolute;
    left: 0;
    top: -4px;
    height: 12px;
    width: 12px;
    background-color: #999;
    border-radius: 50%;
  }

  .layer {
    position: absolute;
    top: -4px;
    height: 12px;
    width: 100%;
  }

  .ctrl-box {
    height: 111px;
    position: relative;
    background-color: #36d7b6;
  }

  .ctrl-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 170px;
  }
  .ctrl-content > span {
    float: left;
  }

  .ctrl-content > span.arrow {
    width: 30px;
    height: 30px;
    margin-top: 10px;
  }

  .ctrl-content > .header-play {
    width: 50px;
    height: 50px;
    margin: 0 30px;
  }

  .ctrl-content > span:nth-child(1) {
    background: url("../assets/icons/prev.png") no-repeat center center;
    background-size: 30px 30px;
  }

  .ctrl-content > span:nth-child(2) {
    background: url("../assets/icons/play.png") no-repeat center center;
    background-size: 50px 50px;
  }

  .ctrl-content > span:nth-child(3) {
    background: url("../assets/icons/next1.png") no-repeat center center;
    background-size: 30px 30px;
  }

  .words-box {
    position: absolute;
    top: 160px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 16px;
    .pword {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
    &.active {
      color: #83f7d2;
      font-size: 18px;
    }
  }

  .pword {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px !important;
  }
}
</style>