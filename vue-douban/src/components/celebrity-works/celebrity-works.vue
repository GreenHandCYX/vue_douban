<template>
  <div class="works-wrapper">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type">全部作品</span>
      <span class="to-top" @click="toTop">
        <i class="icon-circle-up"></i>
      </span>
    </div>
    <scroll class="celebrity-works" :data="works" :pullup="pullup" @scrollToEnd="loadMore" ref="scroll">
      <div class="scroll-wrapper">
        <rank-list :rankItems="works" :needRank="needRank" @select="selectMovie" :hasMore="hasMore"></rank-list>
      </div>
    </scroll>
    <loadmore :fullScreen="fullScreen" v-if="!works.length"></loadmore>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loadmore from 'base/loadmore/loadmore'
import {mapGetters,mapMutations} from 'vuex'
import {getCelebrityWorks} from 'api/celebrity'
import {createRankList} from 'common/js/movieList'
import RankList from 'components/rank-list/rank-list'
const SEARCH_MORE = 20;//每次请求的数据条数
export default {
  data(){
    return {
      searchIndex:0,//分页数据开始的索引
      works:[],//作品
      hasMore:true,//是否有更多数据
      fullScreen:true,//开启全屏动画加载
      pullup:true,//开启上拉加载
      needRank:false,//是否需要排名显示
    }
  },
  computed:{
    ...mapGetters([
      'currentCelebrityId'//当前选中的影人的id
    ])
  },
  created(){
    //获取当前影人的全部作品
    this._getWorks();
    this.loadingFlag = true;//用于设置加载间隔，只有上一次加载完成才能进行下次加载
  },
  methods:{
    back(){
      this.$router.back();
    },
    toTop(){
      this.$refs.scroll.scrollTo(0,0,200);
    },
    selectMovie(movie){
      //当前选中电影
      this.setMovie(movie);
      this.$router.push({
        path:`/movie/${movie.id}`
      })
    },
    loadMore(){
      if(!this.loadingFlag || !this.hasMore){
        //只有加载完成当次才能加载下次
        return
      }
      this.loadingFlag = false;//只有加载完成当次才能加载下次
      this.searchIndex  += SEARCH_MORE;
      getCelebrityWorks(this.currentCelebrityId,this.searchIndex,SEARCH_MORE).then(res=>{
        let ret = [];
        res.works.forEach(item=>{
          ret.push(item.subject)
        })
        this.works = this.works.concat(createRankList(ret))
        this._checkMore(res);
        this.loadingFlag  = true;
      })
    },
    _getWorks(){
     //获取当前影人的全部作品
     if(!this.currentCelebrityId){
       //不存在跳转到主页
       this.$router.push('/movie-show');
       return;
     }
     getCelebrityWorks(this.currentCelebrityId,this.searchIndex.SEARCH_MORE).then(res => {
       let ret = [] ;
       res.works.forEach(item=>{
         ret.push(item.subject)
       })
       this.works = this.works.concat(createRankList(ret));
      //  console.log(this.works)
      //查看是否还有更多信息
      this._checkMore(res)
     })
    },
    _checkMore(data){
       //查看是否还有更多信息
       let works = data.works;
       if(!works.length || data.start+data.count >= data.total){
         this.hasMore = false;
       }
    },
    ...mapMutations({
      setMovie:'SET_MOVIE'//当前选中电影
    })
  },
  components:{
    Scroll,
    Loadmore,
    RankList
  }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .works-wrapper
    height: 100%
    position: relative
    z-index: 800
    background-color: $color-background
    .fixed-title
      border-bottom-1px($color-line)
      position: fixed
      top: 0
      width: 100%
      height: 50px
      z-index: 200
      background-color: $color-background
      text-align: center
      .back
        position: absolute
        top: 0px
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 15px
          font-size: $font-size-large
          color: $color-theme-f
      .type
        line-height: 50px
        font-size: $font-size-medium-x
      .to-top
        position: absolute
        top: 0
        right: 6px
        z-index: 50
        .icon-circle-up
          display: block
          padding: 15px
          font-size: $font-size-large-x
          color: $color-theme-f
   .celebrity-works
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background-color: $color-background
      .scroll-wrapper
        padding: 50px 0 30px 0

</style>


