<template>
  <div class="root">

    <header>
      <div class="system-nav"></div>
      <div class="nav clearfix">
        <span class="user fl">
          <img class="auto-img" src="../assets/icons/user.png" alt />
        </span>
        <span>音乐时代</span>
        <span class="search fr" @click="goSearch()">
          <img class="auto-img" src="../assets/icons/search.png" alt />
        </span>
      </div>
      <div class="clearfix child-list">
        <span
          :class="item.name"
          v-for="(item, index) in tabbarData"
          :key="index"
          @click="changePage({name: item.name},$event)"
        >{{item.title}}</span>
      </div>
    </header>

    <!-- 二级路由 -->
    <div class="main-content">
      <!-- 缓存组件跳转的页面 -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>

      <!-- 非缓存组件跳转页面 -->
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>

    <!-- 底部 -->
    <div class="controls-box">
      <!-- 底部 -->
      <div class="controls" name="0">
        <div class="fl clearfix controls-img">
          <div class="singer-avatar fl" @click="goword()">
            <img class="auto-img" src="../assets/img/1.jpg" alt />
          </div>
          <div class="fl singer-info">
            <p class="song-name one-text">音乐时代</p>
            <p class="singer one-text">走近音乐</p>
          </div>
        </div>

        <div class="fr clearfix controls-icons">
          <span class="list-menu" @click="showlistPage()"></span>
          <span class="play" data-sign="0" @click="controlplaymusic()"></span>
          <span class="next" @click=" nextSong()"></span>
        </div>
      </div>
    </div>

    <!-- 列表页 -->
    <div class="listpage">
      <div class="listclose" @click.stop="hidelistPage()">
        <img class="auto-img" src="../assets/icons/close.png" alt />
      </div>
      <div class="list-box">
        <div
          class="list-item clearfix"
          :class="{play: item.dataPlay}"
          v-for="(item, index) in listData"
          :key="index"
        >
          <div class="list-num fl">
            <span>{{index+1>9?index+1:"0"+(index+1)}}</span>
          </div>
          <div
            class="list-songname fl"
            @click="ListSongPlay(item.id, item.songname, item.singername, item.singerimg, item.time)"
          >
            <span>{{item.songname}}</span>
          </div>
          <div class="list-del fr" @click="deleteListSong(index)">
            <img class="auto-img" src="../assets/icons/del.png" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { PublicFunction } from "../public/public.js";
import $ from "jquery";


export default {
  name: "root",

  data() {
    return {
      tabbarName: "Home",
      tabbarData: [
        {
          title: "推荐",
          name: "Home"
        },
        {
          title: "歌单",
          name: "SongSheet"
        },
        {
          title: "排行",
          name: "Ranking"
        },
        {
          title: "MV",
          name: "MV"
        },
        {
          title: "歌手",
          name: "Singer"
        }
      ],

      listData: PublicFunction.listsongData,

      scroll: "",


    };
  },

  // created() {
  //   this.listData = PublicFunction.listsongData;
  // },
  //获取需要加active的tabbar 类名
  mounted() {
    this.tabbarName = this.$route.name;
    console.log(this.tabbarName);
    $("." + this.tabbarName).addClass("active");
  },

  methods: {
    changePage(o, event) {
      if (this.$route.name == o.name) {
        return;
      }
      this.$router.push(o);

      //设置跳转改变导航active
      $(event.target)
        .siblings()
        .removeClass("active");
      $(event.target).addClass("active");
    },

    //控制台暂停与播放
    controlplaymusic() {
      var isHasUrl = audio.getAttribute("src");
      //如果不存url
      if (!isHasUrl) {
        console.log("音频不存在");
        return;
      }
      //暂停与播放
      PublicFunction.ToggleMusicStatus();
    },

    //点击 显示播放列表
    showlistPage() {
      $(".listpage").css({
        display: "block"
      });
      $(".listpage").animate(
        {
          bottom: "0"
        },
        300
      );
    },

    //点击 播放列表外部隐藏列表
    hidelistPage() {
      $(".listpage").animate(
        {
          bottom: "-100%"
        },
        300
      );
      $(".listpage").css({
        display: "none"
      });
    },

    //删除列表中选中的歌曲
    deleteListSong(num) {
      this.listData.splice(num, 1);
    },

    //点击列表中的音乐播放
    ListSongPlay(id, songname, singername, singerimg, time) {
      PublicFunction.PlayMusic(id, songname, singername, singerimg, time);
    },

    //点击下一首
    nextSong() {
      if (this.listData != "") {
        var num;
        for (let i = 0; i < this.listData.length; i++) {
          if (this.listData[i].dataPlay == 1) {
            num = i + 1;
          }
          this.listData[i].dataPlay = 0;
        }

        num = num > this.listData.length - 1 ? 0 : num;
        this.listData[num].dataPlay = 1;

        PublicFunction.PlayMusic(
          this.listData[num].id,
          this.listData[num].songname,
          this.listData[num].singername,
          this.listData[num].singerimg,
          this.listData[num].time
        );
      }
    },


    //点击头像，进入歌词页面
    goword(){
      let id =  $(".singer-avatar").data('id')
      let time =  $(".singer-avatar").data('time')
      this.$router.push({name:'word',params: {id: id,time: time}})
    },


    goSearch(){
      this.$router.push({name:'search'})
    }

   

  }
};
</script>

<style lang="less" scoped>
.root {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  color: #fff;
  right: 0px;
  header {
    position: sticky;
    top: 0;
  }
  .system-nav {
    height: 24px;
    background-color: #36d7b6;
  }
  .nav {
    padding: 0 10px;
    height: 44px;
    background-color: #36d7b6;
    text-align: center;
    line-height: 44px;
    font-size: 20px;

    .user {
      display: block;
      width: 25px;
      height: 100%;

      img {
        margin-top: 10px;
      }
    }

    .search {
      display: block;
      width: 25px;
      height: 100%;
      img {
        margin-top: 10px;
      }
    }
  }

  .child-list {
    font-size: 16px;
    height: 40px;
    background-color: white;
    display: flex;
    padding: 0 15px;
  }

  .child-list > span {
    display: block;
    color: #36d7b6;
    font-weight: 800;
    line-height: 40px;
    margin-left: auto;
    &.active {
      border-bottom: 4px solid #36d7b6;
      box-sizing: border-box;
    }
  }

  .child-list > span:first-child {
    margin-left: 0;
  }

  //二级路由
  .main-content {
    height: calc(100% - 84px - 61px - 24px);
  }

  // 底部
  .controls-box {
    height: 61px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;

    .controls {
      height: 61px;
      background-color: #36d7b6;
      padding: 0 10px;

      .controls-img {
        width: 65%;

        .singer-avatar {
          width: 55px;
          height: 55px;
          margin-top: 3px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #f5f5f5;
        }

        .singer-avatar.active {
          animation: avatar 15s linear 0s infinite;
        }

        @keyframes avatar {
          0% {
            transform: rotateZ(0deg);
          }

          100% {
            transform: rotateZ(360deg);
          }
        }
      }

      .singer-info {
        margin-top: 12.5px;
        margin-left: 10px;
        .song-name {
          font-size: 14px;
          height: 20px;
          line-height: 20px;
        }
        .singer {
          font-size: 12px;
          height: 16px;
          line-height: 16px;
        }
      }

      .controls-icons {
        margin-top: 12.5px;
        width: 115px;

        span {
          float: left;
          width: 24px;
          height: 24px;
          margin-top: 6px;
        }

        span:first-child {
          background: url("../assets/icons/menu1.png") no-repeat center center;
          background-size: 24px 24px;
        }

        span:last-child {
          background: url("../assets/icons/next.png") no-repeat center center;
          background-size: 24px 24px;
        }

        .play {
          width: 36px;
          height: 36px;
          margin: 0 15px;
          background: url("../assets/icons/play.png") no-repeat center center;
          background-size: 36px 36px;
        }
      }
    }
  }

  /* 列表页 */
  .listpage {
    display: none;
    position: absolute;
    bottom: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    color: #000;
    z-index: 5;
    background: rgba(0, 0, 0, 0.6);
    .listclose {
      width: 26px;
      height: 26px;
      position: absolute;
      top: 20px;
      left: 88%;
    }

    .list-box {
      background-color: #eee;
      width: 100%;
      max-height: 70%;
      min-height: 40%;
      position: absolute;
      left: 0;
      bottom: 0px;
      overflow-y: auto;

      .list-item {
        height: 36px;
        padding: 5px 10px;
        width: calc(100% - 20px);
        line-height: 36px;
        .list-num {
          font-size: 14px;
          margin-right: 10px;
        }
        .list-songname {
          width: calc(100% - 60px);
          font-size: 18px;
        }
        .list-del {
          margin-top: 7px;
          width: 26px;
          height: 26px;
        }
        &.play {
          color: #36d7b6;
        }
      }
    }
  }
}
</style>