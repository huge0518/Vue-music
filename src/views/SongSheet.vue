<template>
  <div class="songsheet" @scroll="lazyLoad()">
    <div class="Sheetlist-title">
      <span>精选歌单>></span>
    </div>

    <div class="songSheet-info clearfix">
      <div
        :id="item.id"
        class="Sheetinfo-item"
        ref="SheetinfoItem"
        v-for="(item, index) in songsheetData"
        :key="index"
        @click="viewSheetDetail({name: 'SheetDetail', params: {id: item.id}})"
      >
        <div class="Sheetinfo-info-layer">
          <div class="fr">
            <span class="fl listen-icon"></span>
            <span class="fl listen-count">{{(item.playCount / 10000).toFixed(1)}}万</span>
          </div>
        </div>
        <div class="info-img">
          <img class="auto-img" :src="item.coverImgUrl" alt="加载失败" />
        </div>
        <div class="Sheetinfo-text two-text">{{item.name}}</div>
      </div>
    </div>
    <p class="tip-text" v-if="!isHas">没有更多数据可加载了...</p>
  </div>
</template>

<script>
import $ from "jquery";
import { PublicFunction } from "../public/public.js";
export default {
  name: "songsheet",
  data() {
    return {
      //保存歌单的数组
      songsheetData: [],

      //请求数据长度
      dataLenght: 21,

      isHas: true,
      //存放滚动时产生的定时器
      timers: []
    };
  },

  created() {
    //请求歌单
    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/top/playlist?limit=100&order=hot"
    })
      .then(result => {
        this.songsheetData = result.data.playlists.slice(0, 21);
      })
      .catch(err => {
        console.log("err");
      });
  },

  methods: {
    //点击跳转到歌单详情
    viewSheetDetail(o) {
      this.$router.push(o);
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
        let lastSheetItem =
          self.$refs.SheetinfoItem[self.$refs.SheetinfoItem.length - 1];

        //获取底部最后一个元素 距离可视区域顶部的距离
        let songItemStyle = lastSheetItem.getBoundingClientRect();
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

            //请求歌
            self
              .axios({
                method: "GET",
                url:
                  "http://www.arthurdon.top:3000/top/playlist?limit=100&order=hot"
              })
              .then(result => {
                self.$toast.clear();
                console.log("result==>", result);

                //再截取歌曲
                let sliceSong = result.data.playlists.slice(
                  self.dataLenght,
                  self.dataLenght + 21
                );
                self.dataLenght += 21;

                if (sliceSong.length < 21) {
                  self.isHas = false;
                  console.log("没用更多歌曲了");
                }

                for (let i = 0; i < sliceSong.length; i++) {
                  self.songsheetData.push(sliceSong[i]);
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
    }
  }
};
</script>

<style lang="less" scoped>
.songsheet {
  height: 100%;
  overflow-y: auto;
  color: black;
  .Sheetlist-title {
    width: calc(100% - 20px);
    height: 24px;
    padding: 0 10px;
    background-color: #36d7b6;
    line-height: 24px;
    color: white;
    margin-top: 5px;
  }

  .songSheet-info {
    padding: 10px;

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

    .Sheetinfo-item {
      .Sheetinfo-info-layer {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 24px;
        background-color: rgba(0, 0, 0, 0.5);

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

      .Sheetinfo-text {
        height: 32px;
        font-size: 12px;
        color: black;
      }
    }
  }

  .tip-text {
    text-align: center;
  }
}
</style>