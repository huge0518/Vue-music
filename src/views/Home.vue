<template>
  <div class="home">
    <!-- 推荐 -->
    <div class="recommend">
      <div class="recommend-banner">
        <img class="auto-img" src="../assets/img/banner.jpg" alt />
      </div>

      <!-- 推荐歌单 -->
      <div class="recommend-sheet">
        <div class="sheet-text">
          <div class="sheet-title fl">
            <span>推荐歌单</span>
          </div>
          <span class="sheet-more fr">更多歌单>></span>
        </div>
        <div class="recommend-info clearfix">
          <div
            :id="item.id"
            class="info-item"
            v-for="(item, index) in recommendSheetData"
            :key="index"
            @click="viewSheetDetail({name: 'SheetDetail', params: {id: item.id}})"
          >
            <div class="recommend-info-layer">
              <div class="fr">
                <span class="fl listen-icon"></span>
                <span class="fl listen-count">{{(item.playCount / 10000).toFixed(1)}}万</span>
              </div>
            </div>
            <div class="info-img">
              <img class="auto-img" :src="item.picUrl" alt />
            </div>
            <div class="recommend-info-text two-text">{{item.name}}</div>
          </div>
        </div>
      </div>

      <!-- 推荐新歌 -->
      <div class="recommend-newsong">
        <div class="newsong-text clearfix">
          <div class="newsong-title fl">
            <span>新歌推荐</span>
          </div>
        </div>

        <div class="recommend-newsong-info">
          <div
            ref="newsongs-list-item"
            class="newsongs-list-item"
            v-for="(item, index) in newsongData"
            :key="index"
            :data-dt='item.id'
            :data-id="item.id"
            data-play="0"
            @click="playMusic($event)"
          >
            <div class="newsongs-img">
              <img class="auto-img" :src="item.song.album.blurPicUrl" />
            </div>
            <div class="newsongs-info">
              <div class="t1 one-text1 newsong-name">{{item.name}}</div>
              <div class="t2 one-text1 newsinger-name">{{item.song.artists[0].name}}</div>
            </div>
            <div class="newsongs-time">{{item.song.hMusic.playTime}}</div>
            <div class="playmusic">
              <img src="../assets/icons/play3.png" alt />
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

export default {
  name: "home",
  data() {
    return {
      //新歌推荐数据
      newsongData: [],
      //歌单推荐数据
      recommendSheetData: [],

      //新歌推荐栏里的播放图标切换
      play1: require("../assets/icons/play.png"),
      play2: require("../assets/icons/play2.png"),
      play3: require("../assets/icons/play3.png"),
      play4: require("../assets/icons/play4.png"),

      baseAudioUrl: "http://www.arthurdon.top:3000/song/url?id="
    };
  },

  mounted() {
    //请求新歌
    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/personalized/newsong"
    })
      .then(result => {
        this.newsongData = result.data.result;

        //处理时间格式
        for (let i = 0; i < this.newsongData.length; i++) {
          this.newsongData[i].song.hMusic.playTime = PublicFunction.FormatTime(
            this.newsongData[i].song.hMusic.playTime
          );
        }
      })
      .catch(err => {
        console.log("err");
      });

    //请求推荐歌单
    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/personalized"
    })
      .then(result => {
        this.recommendSheetData = result.data.result.slice(0, 9);
      })
      .catch(err => {
        console.log("err");
      });
  },

  methods: {
    //点击播放新歌
    playMusic(event) {
      console.log($(event.currentTarget));

      let _this = $(event.currentTarget);

      if (_this.data("play") == "0") {
        _this
          .siblings(".active")
          .find(".playmusic img")
          .attr("src", this.play3);
        _this.siblings(".active").data("play", "0");
        _this.siblings(".active").removeClass("active");

        _this.data("play", "1");
        _this.addClass("active");
        _this.find(".playmusic img").attr("src", this.play4);
        $(".singer-info>.song-name").text("加载中...");
        $(".singer-info>.singer").text("");

        let sid = _this.data("id");
        let sname = _this.find(".newsong-name").text();
        let aname = _this.find(".newsinger-name").text();
        let simg = _this.find(".newsongs-img img").attr("src");
        let time = _this.data("dt");

        PublicFunction.PlayMusic(sid, sname, aname, simg, time);
      } else {
        _this.data("play", "0");
        _this.removeClass("active");
        _this.find(".playmusic img").attr("src", this.play3);

        PublicFunction.PauseMusic();
      }
    },

    //点击跳转到歌单详情
    viewSheetDetail(o) {
      this.$router.push(o);
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  overflow-y: auto;
  .recommend {
    height: 100%;
    overflow-y: auto;

    //歌单推荐
    .recommend-sheet {
      padding: 10px;

      .sheet-text {
        font-size: 17px;
        height: 26px;
        width: 100%;
        line-height: 26px;
        margin-bottom: 5px;
        position: relative;
        color: black;

        .sheet-title {
          width: 90px;
          border-left: 3px solid #36d7b6;
          text-align: center;
        }

        .sheet-more {
          display: block;
          font-size: 14px;
          color: #36d7b6;
        }
      }

      .recommend-info {
        & > div {
          float: left;
          width: calc(100% / 3 - 10px + 10px / 3);
          margin-right: 10px;
          margin-bottom: 10px;
          position: relative;
        }
        & > div:nth-child(3n) {
          margin-right: 0;
        }

        .recommend-info-layer {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          height: 24px;

          .listen-icon {
            width: 16px;
            height: 16px;
            margin-top: 4px;
            background: url("../assets/icons/erji.png") no-repeat center center;
            background-size: 16px 16px;
          }

          .listen-count {
            font-size: 12px;
            line-height: 24px;
            color: #f5f5f5;
            margin: 0 6px;
          }
        }

        .info-img {
          height: 115px;
        }

        .recommend-info-text {
          height: 32px;
          font-size: 12px;
          color: black;
        }
      }
    }

    // 新歌推荐
    .recommend-newsong {
      padding: 0 10px;

      .newsongs-list-item > div {
        float: left;
      }

      .newsong-text {
        font-size: 16px;
        height: 26px;
        width: 100%;
        line-height: 26px;
        margin-bottom: 5px;
        position: relative;
        color: black;

        .newsong-title {
          width: 90px;
          border-left: 3px solid #36d7b6;
          text-align: center;
        }
      }

      .recommend-newsong-info {
        width: 100%;

        .newsongs-list-item {
          padding: 5px 0;
          width: 100%;
          height: 61px;
          margin-bottom: 3px;
          border-bottom: 1px solid rgb(221, 219, 219);

          .newsongs-img {
            width: 61px;
            height: 61px;

            img {
              border-radius: 0.05rem;
            }
          }
        }

        .newsongs-list-item.active {
          background-color: #eee;
        }

        .newsongs-info {
          width: calc(100% - 60px - 50px - 30px - 20px - 20px);
          margin: 0 10px;
          height: 51px;
          margin-top: 10px;
        }

        .t1 {
          height: 24px;
          font-size: 18px;
          line-height: 24px;
          color: #000;
        }

        .t2 {
          height: 16px;
          font-size: 14px;
          line-height: 16px;
          color: rgb(156, 154, 154);
        }

        .newsongs-time {
          width: 50px;
          height: 61px;
          line-height: 61px;
          font-size: 14px;
          color: #aaa;
          text-align: center;
        }

        .playmusic {
          height: 100%;
          line-height: 61px;
          margin-left: 10px;

          img {
            width: 18px;
            height: 18px;
            margin-top: 21px;
          }
        }
      }
    }
  }
}
</style>