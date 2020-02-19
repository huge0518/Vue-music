<template>
  <div class="search">
    <div class="header">
      <div class="header-system"></div>
      <div class="sn">
        <span class="header-colse" @click="back()"></span>
      </div>
    </div>
    <div class="searchbox">
      <input class="inp" type="text" ref="inp"/>
      <button class="btn" @click="search()">搜索</button>
    </div>
    <div class="recommend-newsong-info">
      <div
        ref="newsongsListItem"
        :id="item.id"
        :data-id="item.id"
        :data-dt="item.dt"
        data-play="0"
        class="newsongs-list-item"
        v-for="(item, index) in searchData"
        :key="index"
        @click="playMusic($event)"
      >
        <div class="newsongs-img">
          <img class="auto-img" :src="item.album.artist.img1v1Url" />
        </div>
        <div class="newsongs-info">
          <div class="t1 one-text1 newsong-name">{{item.name}}</div>
          <div class="t2 one-text1 newsinger-name">{{item.artists[0].name}}</div>
        </div>
        <div class="newsongs-time">{{item.dt}}</div>
        <div class="playmusic">
          <img src="../assets/icons/play3.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { PublicFunction } from "../public/public.js";
export default {
  name: "search",
  data() {
    return {
        searchData:[],


          //新歌推荐栏里的播放图标切换
      play1: require("../assets/icons/play.png"),
      play2: require("../assets/icons/play2.png"),
      play3: require("../assets/icons/play3.png"),
      play4: require("../assets/icons/play4.png"),
    };
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    search() {
        let keyword = this.$refs.inp.value
      this.axios({
        method: "GET",
        url: "http://www.arthurdon.top:3000/search?keywords= " + keyword
      })
        .then(result => {
          console.log(result);
        this.searchData = result.data.result.songs
        })
        .catch(err => {
          console.log("err");
        });
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
    },
  }
};
</script>

<style lang="less" scoped>
.search {
    position:absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
  .header {
      width: 100%;
    height: calc(24px + 56px);
    background-color: #36d7b6;
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
    }
  }
  .searchbox {
    width: 100%;
    overflow: hidden;
    // padding: 10px;
    .inp {
      float: left;
      display: block;
      width: 280px;
      height: 30px;
      border: 1px solid black;
      border-radius: 15px;
    }
    .btn {
      float: left;
      display: block;
      height: 30px;
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
}
</style>