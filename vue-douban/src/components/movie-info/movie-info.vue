<template>
  <div class="movie-info">
    <!-- 概述 -->
    <div class="overall">
      <div class="desc">
        <h2 class="title">{{movieDetail.title}}</h2>
        <span class="tag">{{tags}}</span>
        <span class="original-title">原名：{{movieDetail.original_title}}</span>
        <span class="pubdate">上映时间：{{pubdate}}</span>
        <span class="duration">片长：{{duration}}</span>
      </div>
      <div class="rank">
        <span class="origin">豆瓣评分</span>
        <span class="rating" v-if="rating">{{normalizeScore()}}</span>
        <star :size="24" :score="movieDetail.rating.average" :needNullStar="needNullStar"></star>
        <span class="num" v-if="rating">{{movieDetail.ratings_count}}人</span>
      </div>
    </div>
    <!-- 操作想看和看过 -->
    <div class="operate">
      <div class="want-watch" 
           @click="saveWantedMovie"
           :class="{'wanted':isWanted(movieDetail.id)}"
      >{{wantedText}}</div>
      <div class="has-watched"
           @click="saveWatchedMovie"
           :class="{'watched':isWatched(movieDetail.id)}"
      >
        <img src="../../common/image/avatar.jpg" alt="" v-show="hasWatched" width="25" height="25">
        {{watchedText}}
      </div>
    </div>
    <!-- 剧情简介 -->
    <div class="summary">
      <h2 class="title">剧情简介</h2>
      <p class="content">&nbsp;&nbsp;&nbsp;&nbsp;{{movieDetail.summary}}</p>
    </div>
    <!-- 演员列表 -->
    <h2 class="casts-title">影人</h2>
    <scroll class="casts" :scrollX="scrollX" :eventPassthrough="eventPassthrough" ref="scroll" :data="allCasts">
      <div class="casts-content" ref="content">
        
        <div class="cast-item" v-for="(item,index) in allCasts" :key="index"
          @click="selectCelebrity(item.id,$event)"
        >
          <img v-lazy="replaceUrl(item.avatars.large)" width="90" height="120">
          <h3 class="item-title">{{item.name}}</h3>
          <span v-if="item.isDirector">导演</span>
        </div>
        <div class="no-result" v-if="!allCasts.length">
          抱歉，暂无影人信息 :(
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import Star from 'base/star/star'
import Scroll from 'base/scroll/scroll'
import {mapGetters,mapActions} from 'vuex'

export default {
  props:{
    movieDetail:{
      type:Object,
      default:{}
    }
  },
  data(){
    return {
      needNullStar:true,//需要空星
      wantedText:'想看',//默认为未点击
      watchedText:'看过',//默认为未点击
      hasWatched:false,//是否看过
      scrollX:true,//开启横向滚动
      eventPassthrough:'vertical',//忽略纵向滚动
    }
  },
  mounted(){
   //需要在页面渲染完毕后获取scroll的高度并刷新scroll,否则scroll无法滚动
   this.$nextTick(()=>{
     this._initPics()
     this.$refs.scroll.refresh()
   })
  },
  computed:{
    tags(){
      //影片类型
      //改为"年份/ss/sss"的格式
      let year = this.movieDetail.year
      let tags = this.movieDetail.genres.join('/');
      return `${year}/${tags}`;
    },
    pubdate(){
      //上映时间
      let pubdate = "0";
      let data =this.movieDetail.pubdates;4
      for(let i=0;i<data.length;i++){
        if(data[i].lastIndexOf('电影节') === -1){
          //没有在中国大陆上映则取不为电影节的最后一个信息
          pubdate = data[i]
        }
        if(data[i].indexOf('中国大陆') > -1){
          pubdate = data[i];
          break
        }
      }
      if(!pubdate){
        pubdate = '暂无信息'
      }
      return pubdate;
    },
    duration(){
      //
      return this.movieDetail.durations[0]
    },
    rating(){
      //评分判断
      let rating = this.movieDetail.rating.average;
      if(rating=== 0){
        return false
      }
      return true
    },
    allCasts(){
      //获取导演和演员分组
      let removeIndex = [];//需要删去一些信息不完善的数据
      //处理导演
      this.movieDetail.directors.forEach((item,index)=>{
        //区别导演与演员的标识
        item.isDirector = true;
        //不存在图片的导演需放入删除数组
        if(item.avatars === null){
          removeIndex.push(index);
        }
      })
      //删除不完善的信息
      for(let i = removeIndex.length;i>0;i--){
        this.movieDetail.directors.splice(removeIndex[i-1],1)
      }
      //重置删除数组
      removeIndex = [];
      //处理演员
      this.movieDetail.casts.forEach((item,index)=>{
         if(item.avatars === null){
          removeIndex.push(index);
        }
      })
      //删除不完善的信息
      for(let i = removeIndex.length;i>0;i--){
        this.movieDetail.casts.splice(removeIndex[i-1],1)
      }
      //合并处理后的导演和演员信息
      return this.movieDetail.directors.concat(this.movieDetail.casts)
    },
    ...mapGetters([
      'movie',
      'watchedMovies',//看过的电影
      'wantedMovies'//想看的电影
    ])
  },
  methods:{
    _initPics(){
      //获取scroll内容的宽度
      let picWidth = 90;//图片宽度
      let margin = 8 ;
      let width = (picWidth + margin) * this.allCasts.length - margin;//减去最右边多的一个margin
      this.$refs.content.style.width = width + 'px'
    },
    replaceUrl(srcUrl){
      //图片防盗链处理
      if(srcUrl !== undefined){
        return ('https://images.weserv.nl/?url='+srcUrl.replace(/http\w{0,1}:\/\//,''))
      }
    },
    selectCelebrity(id){
      //防止在滚动的时候触发dom原始事件用$event做规避
      //vue.js阻止非vue事件的问题,防止触发两次
       if (!event._constructed) { // 忽略浏览器派发的点击事件，只留下scroll组件派发的
          return;
        }
      //选择某一演员
      this.$emit('selectCelebrity',id)
    },
    normalizeScore(){
      //数位补零
      let len = this.movieDetail.rating.average.toString()
     return len.length < 2? `${this.movieDetail.rating.average}.0`:this.movieDetail.rating.average
    },
    saveWantedMovie(){
      //存储为想看的电影
      this.markWantedMovie(this.movie);
      const index = this.wantedMovies.findIndex((item)=>{
        return item.id === this.movie.id
      })
      if(index>-1){
        this.wantedText = '已想看'
      }else{
        this.wantedText = '想看'
      }
    },
    isWanted(id){
      //判断当前电影是否被标记为想看
      const index = this.wantedMovies.findIndex((item)=>{
        return item.id === id
      });
      if(index > -1){
        this.wantedText = '已想看'
        return true
      }
      return false;
    },
    saveWatchedMovie(){
       //存储为看过的电影
      this.markWatchedMovie(this.movie);
      const index = this.watchedMovies.findIndex((item)=>{
        return item.id === this.movie.id
      })
      if(index>-1){
        this.hasWatched = true
        this.watchedText = '已看过'
      }else{
         this.hasWatched = false
        this.watchedText = '看过'
      }
    },
    isWatched(id){
      //判断当前电影是否被标记为看过
      const index = this.watchedMovies.findIndex((item)=>{
        return item.id === id
      });
      if(index > -1){
         this.hasWatched = true
        this.watchedText = '已看过'
        return true
      }
      return false;
    },
    ...mapActions([
      'markWantedMovie',//存储或删除想看的电影
      'markWatchedMovie' //存储或删除看过的电影
    ])
  },
  components:{
    Star,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
 @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .movie-info
    background-color: $color-background
    padding: 0 20px
    .overall
      display: flex
      height: 140px
      justify-content: space-between
      .desc
        flex: 70% 0 0
        overflow: hidden
        display: flex
        flex-direction: column
        justify-content: space-around
        .original-title
          font-size: $font-size-small
        .title
          font-size: $font-size-large
          color: $color-text-f
          padding: 10px 0 5px 0
        span
          font-size: $font-size-small
     .rank
        height: 70px
        margin-top: 15px
        padding: 10px 15px
        display: flex
        flex-direction: column
        align-items: center
        justify-content: space-between
        // border-1px(#ccc)
        box-shadow: 0px 0px 5px #ccc
        background-color: #f8f8f8
        span
          font-size: $font-size-small
          color: $color-text
          &.rating
            font-size: $font-size-large
            color: $color-text-f
   .operate
      margin-top: 20px
      line-height: 35px
      height: 35px
      display: flex
      text-align: center
      font-size: $font-size-medium
      color: $color-theme-f
      .want-watch
        flex: 1
        border: 1px solid $color-theme-f
        border-radius: 5px
        margin-right: 20px
        &.wanted
          border: 1px solid $color-collect
          color: $color-collect
      .has-watched
        flex: 2
        border: 1px solid $color-theme-f
        border-radius: 5px
        &.watched
          border: 1px solid $color-collect
          color: $color-collect
          img
            display: inline-block
            vertical-align: middle
            padding-bottom: 2px
            border-radius: 50%
   .summary
      margin-top: 20px
      padding-top: 20px
      border-top-1px(#ccc)
      .title
        font-size: $font-size-small
      .content
        padding-top: 10px
        font-size: $font-size-medium
        color: $color-text-f
        line-height: 25px
   .casts-title
        font-size: $font-size-small
        padding: 20px 0;
   .casts
      padding: 0 0 30px 0
      width: 100%
      white-space: nowrap
      overflow: hidden
      font-size: 0
      border-bottom-1px($color-line)
      .casts-content
        .cast-item
          width: 90px
          vertical-align: top
          display: inline-block
          text-align: center
          margin-right: 8px
          font-size: $font-size-small
          img
            height: 120px
            width: 90px
          .item-title
            color: $color-text-f
            padding: 8px 0 5px 0
            no-wrap()
        .no-result
          text-align: center
          font-size: $font-size-small
          font-size: $color-theme-f
</style>


