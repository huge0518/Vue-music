import axios from 'axios'
import $ from "jquery";

export const PublicFunction = {
  axios,

  baseAudioUrl: 'http://www.arthurdon.top:3000/song/url?id=',


  //新歌推荐栏里的播放图标切换
  play1: require("../assets/icons/play.png"),
  play2: require("../assets/icons/play2.png"),
  play3: require("../assets/icons/play3.png"),
  play4: require("../assets/icons/play4.png"),


  listsongData: [],

  listIshas:false,



  //格式化时间，接收一个单位毫秒的参数
  FormatTime(m) {
    //将毫秒转换为秒
    var second = Math.floor(m / 1000 % 60);
    second = second >= 10 ? second : '0' + second;

    //将毫秒转换为分钟
    var minute = Math.floor(m / 1000 / 60);
    minute = minute >= 10 ? minute : '0' + minute;
    return minute + ':' + second;
  },





  //播放音乐
  PlayMusic(id, songname, singername, singerimg, time) {

    this.axios({
      method: 'GET',
      url: this.baseAudioUrl + id,
    }).then(result => {
      var songurl = result.data.data[0].url
      console.log(result)
      $(audio).attr('src', songurl)
      audio.oncanplay = function () {
        audio.play()
        // $(".header-play").css("background", "url(./icons/play2.png) no-repeat center center")
        $(".singer-avatar>img").attr("src", singerimg)
        $(".singer-avatar").addClass("active")
        $(".singer-avatar").data('id',id)
        $(".singer-avatar").data('time',time)

        
        $(".singer-info>.song-name").text(songname)
        $(".singer-info>.singer").text(singername)
        $('.controls').attr('name', 1)
        $(".controls-icons>.play").css({
          background: 'url(' + require("../assets/icons/play2.png") + ') no-repeat center center'
        })

        // $('.singer-avatar').data("dt", time)
        //   // $('.duration').text(formatTime(time))
      }
    })

    //存到播放列表

    if (this.listIshas) {

      for (let i = 0; i < this.listsongData.length; i++){
        this.listsongData[i].dataPlay = 0
      }

      for (let i = 0; i < this.listsongData.length; i++) {
        if (this.listsongData[i].id == id) {
          this.listsongData[i].dataPlay = 1
          return
        } 
         

        // this.listsongData[i].dataPlay = 0
        // if(this.listsongData[i].id == id){
        //   this.listsongData.splice(i,1)
        // }
      }

      let listsong = {}
      listsong.id = id
      listsong.songname = songname
      listsong.singername = singername
      listsong.singerimg = singerimg
      listsong.time = time
      listsong.dataPlay = 1

      this.listsongData.unshift(listsong)
    
    } else {

      let listsong = {}
      listsong.id = id
      listsong.songname = songname
      listsong.singername = singername
      listsong.singerimg = singerimg
      listsong.time = time
      listsong.dataPlay = 1


      this.listsongData.unshift(listsong)
      this.listIshas = true
      console.log('this.listsongData ==>',this.listsongData)
    }





  },


  //点击停止音乐
  PauseMusic() {
    audio.pause()
    $(".singer-avatar").removeClass("active")
    $('.controls').attr('name', 0)
    $(".controls-icons>.play").css({
      background: 'url(' + require("../assets/icons/play.png") + ') no-repeat center center'
    })

  },


  //控制台暂停播放
  ToggleMusicStatus() {
    var controlsName = $('.controls').attr('name');

    if (controlsName == 0) {
      //播放
      audio.play();
      $('.controls').attr('name', 1);
      $('.singer-avatar').addClass('active');
      $(".controls-icons>.play").css({
        background: 'url(' + require("../assets/icons/play2.png") + ') no-repeat center center'
      })
      $(".active").find('.playmusic img').attr("src", this.play4);
      $(".active").data("play", "1")
    } else {
      //停止
      audio.pause();
      $('.controls').attr('name', 0);
      $('.singer-avatar').removeClass('active');
      $(".controls-icons>.play").css({
        background: 'url(' + require("../assets/icons/play.png") + ') no-repeat center center'
      })

      $(".active").find('.playmusic img').attr("src", this.play3);
      $(".active").data("play", "0")
    }
  }






}
