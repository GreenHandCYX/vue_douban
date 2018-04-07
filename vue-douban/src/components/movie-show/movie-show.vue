<template>
  <div class="movie-show">
    <div class="go-search" @click="goSearch">
      <div class="logo">
        <img src="../../common/image/douban-logo.png" width="35" height="35" alt="">
      </div>
      <div class="search-content">
        <span class="icon-search"></span>
        <span>电影/影人/标签</span>
      </div>
    </div>
    <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
    <div class="list-wrapper">
      <scroll 
      v-show="currentIndex===0"
      :data="hotMovies"
      :pullup="pullup"
       :probeType="probeType"
       :listenScroll="listenScroll"
      @scroll="scroll2"
      @scrollToEnd="loadMore"
      ref="hotMovies"
      class="list-scroll">
        <div class="list-inner">
          <movie-list :movies="hotMovies" :hasMore="hasMoreHotMovies" @select="selectMovie"></movie-list>
        </div>
      </scroll>
      <scroll
        v-show="currentIndex===1"
        :data="comingMovies"
        :pullup="pullup"
        :probeType="probeType"
        :listenScroll="listenScroll"
        @scroll="scroll"
        @scrollToEnd="loadMore"
        ref="comingMovies"
        class="list-scroll"
      >
        <div class="list-inner">
          <movie-list :movies="comingMovies" :needDate="needDate" @getHeight="getHeight"  @getMap="getMap" :hasMore="hasMoreComingMovies" @select="selectMovie" ref="list"></movie-list>
        </div>
      </scroll>
      <loadmore :fullScreen="fullScreen"
      v-show="currentIndex===1&&!comingMovies.length||currentIndex===0&&!hotMovies.length"
      ></loadmore>
    </div>
    <div class="list-fixed" v-show="currentIndex===1" v-if="fixedTitle" ref="fixed">
        <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </div>
</template>
<script>
import Switches from 'base/switches/switches'
import Loadmore from 'base/loadmore/loadmore'
import Scroll from 'base/scroll/scroll'
import MovieList from 'components/movie-list/movie-list'
import {getMovie,getComingMovie} from 'api/movie-show'
import {createMovieList} from 'common/js/movieList'
import { mapMutations } from 'vuex'
const SEARCH_MORE = 10; // 每次请求数据的长度
const TITLE_HEIGHT = 30; // 日期栏高度

export default {
  data(){
    return {
      switches:[
        {name: '正在热映'},
        {name: '即将上映'}
      ],//模块标题
      currentIndex:0,//当前显示模块索引
      hotMovieIndex:0,//上映电影资源起始页
      hotMovies:[],//上映电影列表
      hasMoreHotMovies:true,//是否存在更多数据
      pullup: true, // 支持滚动加载
      loadingFlag: true, // 控制滚动加载速度,在上一次未加载完成时不能进行下一次加载
      fullScreen:true,//加载动画全屏
      needDate:true,//电影列表显示日期栏
      comingMovies:[],//即将上映电影列表
      comingMovieIndex:0,//即将上映电影资源起始页
      hasMoreComingMovies:true,//是否存在更多数据
      scrollIndex:0,//当前顶部日期条所显示的分组区域的索引
      scrollY:-1,//滚动条距离顶部的距离，向下拉是负的
      diff:-1,//当前顶部日期条需要上移的偏移量
      scrollY2:-1
   }
  },
  created(){
    this._getMovie();
    this.probeType = 3;//在屏幕滚动的情况下及有swipe的情况下实时派发scroll事件
    this.listenScroll = true;//需要监听滚动
    this.listHeight = [];//子组件传来的按日期分类的不同的区域的高度
    this.scrollMap = [];//子组件传来的按日期分类的不同滚动区域的名称即日期
  },
  computed:{
    fixedTitle(){
      //顶部日期条
      if(this.scrollY>0){
        //当滚动条在顶部也就没必要显示固定日期条
        return ''
      }
      //找到指定索引对应的区的日期
      return this.scrollMap[this.scrollIndex]?this.scrollMap[this.scrollIndex]:'';
    }
  },
  methods:{
    loadMore(){
      //加载更多数据
      //判断是否上一次加载还未完成
      if(!this.loadingFlag){
        return
      }
      //重置加载标志位
      this.loadingFlag = false;
      if(this.currentIndex === 0){
        if(!this.hasMoreHotMovies){
          this.loadingFlag = true;
          return
        }
        this.hotMovieIndex += SEARCH_MORE;
        getMovie(this.hotMovieIndex,SEARCH_MORE).then(res=>{
          this.hotMovies = this.hotMovies.concat(createMovieList(res.subjects))
          this._checkMore(res);
          this.loadingFlag = true
        })
      }else{
        if(!this.hasMoreComingMovies){
            this.loadingFlag = true;
            return
          }
        this.comingMovieIndex += SEARCH_MORE;
        getComingMovie(this.comingMovieIndex,SEARCH_MORE).then(res=>{
          this.comingMovies = this.comingMovies.concat(createMovieList(res.subjects))
          this._checkMore(res)
          this.loadingFlag = true;
        }) 
      }
    },
    selectMovie(movie){
      this.setMovie(movie)//存储当前选中电影
      this.$router.push({
        path:`/movie/${movie.id}`
      })
    },
    scroll(pos){
      //监听scroll的变化
     this.scrollY = pos.y
    },
    scroll2(pos){  
      this.scrollY2 = pos.y
    }
    ,
    _getMovie(){
      //获取正在上映的电影信息
      getMovie(this.hotMovieIndex,SEARCH_MORE).then((res)=>{
        //请求完毕关闭loading组件
       this.$emit('hasLoad')
  
       // 创建movie类及电影列表方法封装数据
       this.hotMovies = createMovieList(res.subjects)
      //检查是否还存在更多数据
      this._checkMore(res)
      })
    },
    _checkMore(data){
      const movies = data.subjects;
      if(!movies.length || data.start + data.count>data.total){
         if (this.currentIndex === 0) {
            this.hasMoreHotMovies = false;
          } else {
            this.hasMoreComingMovies = false;
          }
          this.loadingFlag = true;
      }
    },
    goSearch(){
      this.$router.push({
        path:'/search'
      })
    },
    switchItem(index){
      //接受子组件传来的值
      //切换tab栏
      this.currentIndex=index
      //切到即将上映则需计算多个日期区的高度
      if(index === 1){
        this.$refs.list.recalculate();
      }
      //第一次切换到即将上映电影获取数据
      if(index === 1 && !this.comingMovies.length){
        getComingMovie(this.comingMovieIndex,SEARCH_MORE).then(res=>{
          this.comingMovies = createMovieList(res.subjects);
          this._checkMore(res)
        })
      }

      //重新载入切换之前的滚动位置
      if(index==1){
        this.$refs.comingMovies.scrollTo(0,this.scrollY);
      }
      if(index==0){
        this.$refs.hotMovies.scrollTo(0,this.scrollY2);
      }

      //需要重新计算scroll高度，确保正常滚动
      this.$nextTick(()=>{
        this.$refs.hotMovies.refresh();
        this.$refs.comingMovies.refresh();
      })
    },
    getHeight(heights){
      //获取子组件传来的按日期分类的不同的区域的高度
      this.listHeight = heights
    },
    getMap(map){
      //获取子组件传来的按日期分类的不同滚动区域的名称即日期
      this.scrollMap = map
    },
    ...mapMutations({
      setMovie:'SET_MOVIE'//将当前选中电影存储在vuex中
    })
  },
  watch:{
    scrollY(newY,oldY){
      //监听滚动条的变化
       if (!newY) { // 如果在快速滚动时切换tab栏，滚动位置会读取错误，这里保留出错前正确的滚动位置
          this.scrollY = oldY;
        }
        //若分组数据不存在则返回
        if (this.listHeight.length === 0 || this.scrollMap.length === 0) { 
          return;
        }
        // 当滚动到顶部下拉时，即向上划滚动条
        if (newY > 0) {
          this.scrollIndex = 0;
          return;
        }
        // 在相邻两个高度中间部分滚动
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            //显示前一个的时间
            this.scrollIndex = i;
            //设置向上移动的动画偏移量
            this.diff = height2 + newY;
            return;
          }
        }
        // 滚动到底部，且newY大于最后一个元素的上限
        this.scrollIndex = this.listHeight.length - 2;
    },
      diff(newval) {
        let fixedTop = (newval > 0 && newval < TITLE_HEIGHT) ? newval - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        this.$nextTick(() => {
          this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
        });
      }
  },
  components:{
    Switches,
    MovieList,
    Scroll,
    Loadmore
  }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
  .movie-show
    height:100%
    .go-search
      height: 50px
      box-sizing: border-box
      padding: 10px 10px 5px 60px
      text-align: center
      .logo
        position: absolute
        left: 10px
      .search-content
        background-color: $color-background-d
        font-size: $font-size-medium-x
        line-height: 35px
        border-radius: 5px
        span
          display: inline-block
          vertical-align: middle
     .list-wrapper
      position: absolute
      top: 97px
      bottom: 61px
      width: 100%
      .list-scroll
        position: relative
        height: 100%
        overflow: hidden
        .list-inner
          padding: 0px 15px
     .list-fixed
      position: absolute
      top: 97px
      right: 15px
      left: 15px
      .fixed-title
        width: 100%
        padding-left: 5px
        height: 30px
        line-height: 30px
        background-color: $color-background-d
</style>

