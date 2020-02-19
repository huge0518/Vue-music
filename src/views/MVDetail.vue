<template>
  <div class="mvDetail">
    <div class="details-title">
      <span @click="back()">《《返回</span>
    </div>
    <video class="vid" :src="mvdetail.brs['480']" controls></video>

    <div class="desc">{{mvdetail.desc}}</div>
  </div>
</template>

<script>
import { publicFunction } from "../public/public.js";
export default {
  name: "singer",
  data() {
    return {
      mvdetail: []
    };
  },

  created() {
    let mvid = this.$route.params.id;

    //请求MV连接
    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/mv/detail?mvid=" + mvid
    })
      .then(result => {
        this.mvdetail = result.data.data;
      })
      .catch(err => {
        console.log("err");
      });

  },

  methods: {
    //返回
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.mvDetail {
  color: #000;
  .details-title {
    width: calc(100%-0.2rem);
    height: 24px;
    padding: 0 0.1rem;
    background-color: #36d7b6;
    line-height: 24px;
    color: white;
    margin-top: 5px;
  }
  .vid {
    width: 100%;
  }
  .desc {
    font-size: 14px;
    color: #666;
    line-height: 20px;
  }
}
</style>