<template>
  <div class="singer-box" @scroll="lazyLoad()">
    <van-sidebar class="bar" v-model="activeKey">
      <van-sidebar-item
        :data-id="item.cat"
        :title="item.title"
        v-for="(item, index) in barData"
        :key="index"
        @click="pageChange(item.cat)"
      />
    </van-sidebar>

    <div class="singer">
      <div class="singerinfo clearfix">
        <div
          class="singerinfo-item"
          ref="singerItem"
          :id="item.id"
          v-for="(item, index) in singerData"
          :key="index" 
          @click="viewSheetDetail({name:'SingerDetail',params:{id:item.id}})"
        >
          <div class="imgbox">
            <img class="auto-img" :src="item.img1v1Url" alt />
          </div>
          <div class="singername one-text1">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { publicFunction } from "../public/public.js";
export default {
  name: "singer",
  data() {
    return {
      activeKey: 0,

      singerData: [],

      //bar侧边导航数据
      barData: [
        {
          title: "入驻歌手",
          cat: "5001"
        },
        {
          title: "华语男歌手",
          cat: "1001"
        },
        {
          title: "华语女歌手",
          cat: "1002"
        },
        {
          title: "华语组合",
          cat: "1003"
        },
        {
          title: "欧美男歌手",
          cat: "2001"
        },
        {
          title: "欧美女歌手",
          cat: "2002"
        },
        {
          title: "欧美组合",
          cat: "2003"
        },
        {
          title: "日本男歌手",
          cat: "6001"
        },
        {
          title: "日本女歌手",
          cat: "6002"
        },
        {
          title: "日本组合",
          cat: "6003"
        },
        {
          title: "韩国男歌手",
          cat: "7001"
        },
        {
          title: "韩国女歌手",
          cat: "7002"
        },
        {
          title: "韩国组合",
          cat: "7003"
        }
      ],

      //歌手类型编码
      cat: "",

      //请求数据的偏移
      num: 0,

      isHas: true,

      timers: []
    };
  },

  created() {
    //请求歌手列表
    this.axios({
      method: "GET",
      url: " http://www.arthurdon.top:3000/artist/list?cat=5001"
    })
      .then(result => {
        console.log(result);
        this.singerData = result.data.artists;
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

    //改变歌手类型
    pageChange(a) {
      this.cat = a;
      this.num = 0;
      (this.isHas = true),
        this.axios({
          method: "GET",
          url: " http://www.arthurdon.top:3000/artist/list?cat=" + this.cat
        })
          .then(result => {
            console.log(result);
            this.singerData = result.data.artists;
          })
          .catch(err => {
            console.log("err");
          });
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
        let lastsingitem =
          self.$refs.singerItem[self.$refs.singerItem.length - 1];

        //获取底部最后一个元素 距离可视区域顶部的距离
        let songItemStyle = lastsingitem.getBoundingClientRect();
        let top = songItemStyle.top;
        //

        let songItemHeight = songItemStyle.height;

        //

        let isPass = innerHeight - tabbarHeight - songItemHeight + 50 >= top;

        console.log(isPass);

        if (self.isHas) {
          if (isPass) {
            self.num++;
            //偏移量
            let numaa = self.num * 30;
            console.log("numaa ==>", numaa);

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
                  " http://www.arthurdon.top:3000/artist/list?cat=" +
                  self.cat +
                  "&offset=" +
                  numaa +
                  "&limit=30"
              })
              .then(result => {
                self.$toast.clear();
                console.log("result==>", result);

                //再截取歌曲
                let sliceSinger = result.data.artists;

                if (sliceSinger.length < 30) {
                  self.isHas = false;
                  console.log("没用更多明星了");
                }

                for (let i = 0; i < sliceSinger.length; i++) {
                  self.singerData.push(sliceSinger[i]);
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
.singer-box {
  height: 100%;
  color: black;
  overflow-y: auto;

  .bar {
    display: block;
    float: left;
    font-size: 12px;

    .van-sidebar-item {
      text-align: center;
      padding: 12px 3px;
    }
    .van-sidebar-item--select {
      border-color: #36d7b6;
    }
  }

  .singer {
    float: right;
    width: calc(100% - 85px);
    .singerinfo {
      padding: 8px;
      .singerinfo-item {
        float: left;
        margin-right: 8px;
        width: calc((100% - 16px) / 3);
        margin-bottom: 10px;
        .imgbox {
          width: 100%;
        }
        .singername {
          text-align: center;
          font-size: 16px;
          width: 100%;
        }
      }

      & > div:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>