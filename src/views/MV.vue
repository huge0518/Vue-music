<template>
  <div class="mv">
    <van-tabs v-model="active" color="#36d7b6">
      <van-tab title="最新MV">
        <div class="mvinfo clearfix">
          <div class="mvinfo-item" :id="item.id" v-for="(item, index) in newMvdata" :key="index" @click="viewSheetDetail({name: 'MVDetail', params: {id: item.id}})">
            <div class="imgbox">
              <img class="auto-img" :src="item.cover" alt />
              <img class="boimg" src="../assets/icons/play.png" alt />
            </div>
            <div class="messagebox">
              <div class="mvtitle one-text1">{{item.name}}</div>
              <div class="artistName">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="全部MV">
        <div class="mvinfo clearfix">
          <div class="mvinfo-item" :id="item.id" v-for="(item, index) in allMvdata" :key="index"
          @click="viewSheetDetail({name: 'MVDetail', params: {id: item.id}})">
            <div class="imgbox">
              <img class="auto-img" :src="item.cover" alt />
              <img class="boimg" src="../assets/icons/play.png" alt />
            </div>
            <div class="messagebox">
              <div class="mvtitle one-text1">{{item.name}}</div>
              <div class="artistName">{{item.artistName}}</div>
            </div>
          </div>
        </div>
        <van-pagination
          @change="changePage()"
          v-model="currentPage"
          :total-items="1000"
          :show-page-size="3"
          :items-per-page="20"
          force-ellipses
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import $ from "jquery";
import { publicFunction } from "../public/public.js";
export default {
  name: "MV",
  data() {
    return {
      active: 0,
      currentPage: 1,

      newMvdata: [],
      allMvdata: []
    };
  },

  created() {
    //请求最新MV
    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/mv/first?limit=50"
    })
      .then(result => {
        this.newMvdata = result.data.data;
      })
      .catch(err => {
        console.log("err");
      });

    //请求全部MV
    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/mv/all?offset=0&limit=20"
    })
      .then(result => {
        console.log(result);
        this.allMvdata = result.data.data;
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


    changePage() {
      console.log(this.currentPage - 1);
      let num = (this.currentPage - 1) * 20
      this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/mv/all?offset=" + num + "&limit=20"
    })
      .then(result => {
        this.allMvdata = result.data.data;
        $('.mv')[0].scrollTop = 0
      })
      .catch(err => {
        console.log("err");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.mv {
  color: #000;
  height: 100%;
  overflow-y: auto;
  .mvinfo {
    padding: 10px;
    overflow: hidden;
    .mvinfo-item {
      margin-right: 8px;
      float: left;
      width: calc(50% - 4px);

      .imgbox {
        width: 100%;
        height: 100px;
        overflow: hidden;
        position: relative;
        top: 0;
        left: 0;
        .boimg {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -16px;
          margin-left: -16px;
        }
      }
      .messagebox {
        width: 100%;
        text-align: center;
        .mvtitle {
          width: 100%;
          font-size: 16px;
          font-weight: 600;
          color: #555;
        }
        .artistName {
          font-size: 16px;
          color: #999;
        }
      }
    }
    & > div:nth-child(2n) {
      margin-right: 0px;
    }
  }
}
</style>