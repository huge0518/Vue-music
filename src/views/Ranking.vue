<template>
  <div class="ranking">
    <div class="details-title">
      <span>所有榜单>></span>
    </div>

    <div class="ranking-info clearfix">
      <div class="ranking-item" :id='item.id' v-for="(item, index) in rankingData" :key="index" @click="viewSheetDetail({name: 'SheetDetail', params: {id: item.id}})">
        <div class="img-box">
          <img class="auto-img" :src="item.coverImgUrl" alt />
        </div>
        <div class="message-box">
          <div class="ranking-title one-text1">{{item.name}}</div>
          <div v-if="item.tracks.length" class="three-song">
            <div class="ongsong one-text1">
              <span>{{item.tracks[0].first}}</span>--
              <span>{{item.tracks[0].second}}</span>
            </div>
            <div class="ongsong one-text1">
              <span>{{item.tracks[1].first}}</span>--
              <span>{{item.tracks[1].second}}</span>
            </div>
            <div class="ongsong one-text1">
              <span>{{item.tracks[2].first}}</span>--
              <span>{{item.tracks[2].second}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ranking",
  data() {
    return {
      rankingData: []
    };
  },

  created() {
    //请求歌单
    this.axios({
      method: "GET",
      url: "http://www.arthurdon.top:3000/toplist/detail"
    })
      .then(result => {
        this.rankingData = result.data.list;
      })
      .catch(err => {
        console.log("err");
      });
  },

  methods:{
      //点击跳转到歌单详情
    viewSheetDetail(o) {
      this.$router.push(o);
    },
  }
};
</script>

<style lang="less" scoped>
.ranking {
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

  .ranking-info {
    padding: 10px;
    .ranking-item {
      overflow: hidden;
      margin-bottom: 5px;
      .img-box {
        float: left;
        width: 40%;
        margin-right: 8px;
      }
      .message-box {
        width: calc(100% - 40% - 8px);
        float: left;

        .ranking-title {
          height: 50px;
          font-size: 20px;
          line-height: 50px;
          font-weight: 900;
        }
        .three-song {
          width: 100%;
          .ongsong {
            font-size: 16px;
            height: 20px;
            line-height: 20px;
            color: #999;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>