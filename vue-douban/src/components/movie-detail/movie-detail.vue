<template>
  <div class="detail-wrapper">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type" ref="fixed">
        <span class="icon" v-show="changeFix">
          <i class="icon-video-camera"></i>
          电影
        </span>
        <span class="movie-name" v-if="!changeFix">{{movieDetail.title}}</span>
      </span>
    </div>
    <scroll class="movie-detail"
    :data="movieDetail"
    :listenScroll="listenScroll"
    @scroll="scroll"
    ref="scroll"
    >
    <div class="scroll-wrapper">
      <div class="scroll-content" v-if="movieDetail.images">
        <div class="bg-image" ref="image">
          <img v-lazy="replaceUrl(movieDetail.images.large)" :data-origin="movieDetail.images.large">
        </div>
        <movie-info :movieDetail="movieDetail" @selectCelebrity="selectCelebrity"></movie-info>
      </div>
    </div>
    <loadmore :fullScreen="fullScreen" v-show="!movieDetail.images"></loadmore>
    </scroll>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import {getMovieDetail } from 'api/movie-detail'
import Scroll from 'base/scroll/scroll'
import Loadmore from 'base/loadmore/loadmore'
import MovieInfo from 'components/movie-info/movie-info'
export default {
  name:'movieDetail',//用于避免keep-alive缓存
  created(){
   this.probeType = 3;//scroll组件需要实时派发scroll事件，且支持swipe
   this.listenScroll = true;//scroll组件监听scroll事件并监听滚动位置
   this._getDetail();//获取电影详情
  
  },
  data(){
    return {
      movieDetail:{},//电影详情
      changeFix:true,//更改fixed的内容
      fullScreen:true,//加载动画全屏
      imgHeight:-1,//电影封面图片高度
    }
  },
  computed:{
    ...mapGetters([
      'movie'
    ])
  },
  methods:{
    selectCelebrity(id){
      //选取影人，存在vuex中
      this.setCelebrity(id)
      this.$router.push({
        path:`/celebrity/${id}`
      })
    },
    scroll(pos){
      //监听滚动事件,改变固定导航条的内容
        //滚动的距离小于(负值，实际是大于)电影封面图片高度时显示电影标题，否则显示电影icon
     if(-this.imgHeight < pos.y && this.imgHeight!==1){
        this.changeFix = true
      }else{
         this.changeFix = false
      }
     
    },
    back(){
      //返回上一页
      this.$router.back()
    },
    _getDetail(){
      //获取电影详情
      if(!this.movie.id){
        //不存在则刷新回到主页
        this.$router.push('/movie-show');
        return;
      }
      getMovieDetail(this.movie.id).then((res)=>{
        if(!this.$route.params.movieId){
          //防止快速切换id不存在报错
          return
        }
        this.movieDetail = res;
        //需要监听图片的lazyload渲染以确认封面的高度
        // 使用vue-lazyload监听事件，每次进入只触发一次
        this.$Lazyload.$once('loaded',({el})=> {
          //el代表当前lazyload的元素
          //获取原图片连接(即没经过防盗链处理的图片的路径)
          let src = el.dataset.origin;
          if(src === res.images.large){
            // 获取电影封面高度,用于fixed栏固定
            this.imgHeight = this._getImageHeight();
             setTimeout(() => {
              if (!this.$route.params.movieId) { // 防止路由快速切换报错
                return;
              }
              this.$refs.scroll.refresh(); // scroll组件重新计算高度
              }, 20);
          }
        });
      })
    },
     _getImageHeight() {
        // 获取电影封面高度,用于fixed栏固定
        return this.$refs.image.clientHeight;
      },
    replaceUrl(srcUrl){
      //解决图片防盗链问题
      if(srcUrl!==undefined){
        return ('https://images.weserv.nl/?url='+srcUrl.replace(/http\w{0,1}:\/\//,''))
        
      }
    },
    ...mapMutations({
      setCelebrity:'SET_CELEBRITY_ID'//将当前选中的演员信息存入vuex
    })
  },
  components:{
    Scroll,
    Loadmore,
    MovieInfo
  }
}
</script>
<style lang="stylus" scoped>
 @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .detail-wrapper
    position: relative
    z-index: 10
    .fixed-title
      position: fixed
      top: 0
      width: 100%
      height: 40px
      z-index: 100
      background-color: rgba(85, 85, 85, .6)
      text-align: center
      .back
        position: absolute
        top: 0px
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 10px
          font-size: $font-size-large
          color: $color-background
      .type
        .icon
          position: absolute
          left: 50%
          top: 0
          color: $color-background
          display: block
          padding: 10px
          transform: translateX(-50%)
          .icon-video-camera
            display: inline-block
            vertical-align: text-bottom
            font-size: $font-size-large-x
        .movie-name
          display: block
          padding-top: 11px
          width: 100%
          color: $color-background
    .movie-detail
      position: fixed
      top: 0
      bottom: 0
      left: 0
      right: 0
      background: $color-background-f
      .bg-image
        text-align: center
        padding: 50px 0 20px 0
        background-color: $color-background-f
        img
          width: 50%
      .switch
        padding: 0 20px
        background-color: $color-background
        padding-top: 20px
</style>

