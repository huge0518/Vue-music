<template>
  <div class="sheetDetail">
    <!-- 歌单详情页 -->
    <div class="details" @scroll="lazyLoad()">
      <div class="details-title">
        <span @click="back()">《《返回</span>
      </div>
      <div class="sheet-details">
        <div class="top-box clearfix">
          <div class="sheet-img fl">
            <img class="auto-img" src="../assets/img/1.jpg" alt />
          </div>
          <div class="sheet-text fr">
            <p class="sheet-name"></p>
            <p class="sheet-description"></p>
          </div>
        </div>

        <div class="recommend-newsong-info">
          <div
            ref="newsongsListItem"
            :id="item.id"
            :data-id="item.id"
            :data-dt="item.dt"
            data-play="0"
            class="newsongs-list-item"
            v-for="(item, index) in sheetSongData"
            :key="index"
            @click="playMusic($event)"
          >
            <div class="newsongs-img">
              <img class="auto-img" :src="item.al.picUrl" />
            </div>
            <div class="newsongs-info">
              <div class="t1 one-text1 newsong-name">{{item.name}}</div>
              <div class="t2 one-text1 newsinger-name">{{item.ar[0].name}}</div>
            </div>
            <div class="newsongs-time">{{item.dt}}</div>
            <div class="playmusic">
              <img src="../assets/icons/play3.png" alt />
            </div>
          </div>
        </div>
        <p class="tip-text" v-if="!isHas">没有更多数据可加载了...</p>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { PublicFunction } from "../public/public.js";
export default {
  name: "MV",
  data() {
    return {
      sheetSongData: [],
      //请求数据长度
      dataLenght: 20,

      isHas: true,
      //存放滚动时产生的定时器
      timers: [],

      //新歌推荐栏里的播放图标切换
      play1: require("../assets/icons/play.png"),
      play2: require("../assets/icons/play2.png"),
      play3: require("../assets/icons/play3.png"),
      play4: require("../assets/icons/play4.png")
    };
  },

  created() {
    //开启加载提示
    this.$toast.loading({
      duration: 0,
      message: "加载中..."
    });

    let id = this.$route.params.id;

    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/playlist/detail?id=" + id
    })
      .then(result => {
        this.$toast.clear();

        $(".sheet-details .sheet-img>img").attr(
          "src",
          result.data.playlist.coverImgUrl
        );
        $(".sheet-text .sheet-name").text(result.data.playlist.name);
        $(".sheet-text .sheet-description").text(
          result.data.playlist.description
        );

        this.sheetSongData = result.data.playlist.tracks.slice(
          0,
          this.dataLenght
        );

        //处理一下时间格式
        for (let i = 0; i < this.sheetSongData.length; i++) {
          this.sheetSongData[i].dt = PublicFunction.FormatTime(
            this.sheetSongData[i].dt
          );
        }
      })
      .catch(err => {
        this.$toast.clear();
      });
  },

  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },

    //懒加载数据
    lazyLoad() {
      let self = this;

      if (!self.isHas) {
        return;
      }

      let timer = setTimeout(function() {
        for (let i = 1; i < self.timers.length; i++) {
          clearTimeout(self.timers[i]);
        }

        //获取底部播放器高度
        let tabbarHeight = document.querySelector(".controls").clientHeight;

        //获取底部最后一个元素
        let lastSongItem =
          self.$refs.newsongsListItem[self.$refs.newsongsListItem.length - 1];

        //获取底部最后一个元素 距离可视区域顶部的距离
        let songItemStyle = lastSongItem.getBoundingClientRect();
        let top = songItemStyle.top;
        //

        let songItemHeight = songItemStyle.height;

        //

        let isPass = innerHeight - tabbarHeight - songItemHeight + 50 >= top;

        console.log(isPass);

        if (self.isHas) {
          if (isPass) {
            //开启加载提示
            self.$toast.loading({
              duration: 0,
              message: "加载中..."
            });

            //截取路由参数
            let id = self.$route.params.id;

            //请求歌
            self
              .axios({
                method: "GET",
                url: "http://www.arthurdon.top:3000/playlist/detail?id=" + id
              })
              .then(result => {
                self.$toast.clear();

                console.log("result==>", result);

                //再截取歌曲
                let sliceSong = result.data.playlist.tracks.slice(
                  self.dataLenght,
                  self.dataLenght + 20
                );
                self.dataLenght += 20;

                if (sliceSong.length < 20) {
                  self.isHas = false;
                  console.log("没用更多歌曲了");
                }

                for (let i = 0; i < sliceSong.length; i++) {
                  //处理一下时间格式
                  sliceSong[i].dt = PublicFunction.FormatTime(sliceSong[i].dt);

                  self.sheetSongData.push(sliceSong[i]);
                }
              })
              .catch(err => {
                console.log("err");
              });
          }
        }

        self.timers = [];
      }, 1000);

      self.timers.push(timer);
    },

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
    }
  }
};
</script>

<style lang="less" scoped>
.sheetDetail {
  height: 100%;
  overflow-y: auto;
  .details {
    height: 100%;
    overflow-y: auto;
    color: black;

    .details-title {
      width: calc(100% - 20px);
      height: 24px;
      padding: 0 10px;
      background-color: #36d7b6;
      line-height: 24px;
      color: white;
      margin-top: 5px;
    }

    .sheet-details {
      padding: 10px 10px 0 10px;
      overflow: hidden;

      .top-box {
        margin-bottom: 10px;

        .sheet-img {
          width: 39%;
        }
        .sheet-text {
          width: 59%;
          .sheet-name {
            margin-top: 10px;
            font-size: 18px;
            font-weight: bold;
            max-width: 100%;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .sheet-description {
            margin-top: 10px;
            font-size: 14px;
            color: #aaa;
            max-width: 100%;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }

      .recommend-newsong-info {
        width: 100%;

        .newsongs-list-item {
          overflow: hidden;
          padding: 5px 0;
          width: 100%;
          height: 61px;
          margin-bottom: 3px;
          border-bottom: 1px solid rgb(221, 219, 219);

          & > div {
            float: left;
          }
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

      .tip-text {
        text-align: center;
      }
    }
  }
}
</style>