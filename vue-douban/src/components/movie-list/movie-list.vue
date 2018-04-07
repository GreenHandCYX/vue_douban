<template>
  <div class="movie-list">
    <ul>
      <li ref="group" v-for="(movie,index) in movies" :key="index" @click="selectItem(movie)">
          <div class="date" v-if="needDate && !dateEqual(index)">{{movie.date}}</div>
          <div class="item">
            <div class="info-img">
              <img v-lazy="replaceUrl(movie.image)" height="120" width="80" alt="">
            </div>
            <div class="info-desc">
              <p class="title">{{movie.title}}</p>
              <star :size="24" :score="movie.rating" :showScore="showScore"></star>
              <div class="director">导演: {{movie.director}}</div>
              <div class="casts">主演: {{movie.casts}}</div>
              <div class="hasWatched">{{movie.collectCount}}人看过</div>
            </div>
          </div>
      </li>
    </ul>
    <loadmore :hasMore="hasMore" v-show="movies.length"></loadmore>
  </div>
</template>
<script  type="text/ecmascript-6">
import Star from 'base/star/star'
import Loadmore from 'base/loadmore/loadmore'
export default {
  data(){
    return {
      showScore:true
    }
  },
  created(){
    this.listHeight=[];//各区域高度
    this.indexMap={};//根据日期分组的电影
  },
  props:{
    movies:{
      type:Array,
      default:[]
    },
    needDate:{
      type:Boolean,//可根据时间分类
      default:false
    },
    hasMore:{
      type:Boolean,//用来判断是否有更多数据
      default:true
    }
  },
  components:{
    Star,
    Loadmore
  },
  methods:{
    dateEqual(index){
      //判断相邻影片是否是同一日期，从而进行日期分组
      if(index===0){
        return false;
      }
      return this.movies[index].date === this.movies[index-1].date
    },
    selectItem(movie){
      this.$emit('select',movie)
    },
    replaceUrl(srcUrl){
      //图片防盗链处理
      if(srcUrl !== undefined){
        return ('https://images.weserv.nl/?url='+srcUrl.replace(/http\w{0,1}:\/\//,''))
      }
    },
    recalculate(){
       // 重新计算各个区域高度，防止用户在发起新数据请求后切换选项卡无法正确获取高度
       this.$nextTick(()=>{
         this.getMap();//根据日期创建电影分组
         this._calculateHeight();//计算每个区间的高度
       })
    },
    getMap(){
      //根据日期创建电影分组:{'九月一日':[1,2,3]}
      let map ={};
      for(let i=0;i<this.movies.length;i++){
        if(map[this.movies[i].date]){
          map[this.movies[i].date].push(i)
        }else{
          map[this.movies[i].date] = [i]
        }
      }
      this.indexMap = map
    },
    _calculateHeight(){
       this.listHeight=[];
      //根据indexMap构成的分组索引计算每个分区的高度
      const list = this.$refs.group;
      let height = 0;
      let map = Object.values(this.indexMap);
      map.forEach((item,index)=>{
        item.forEach((movieIndex)=>{
          height += list[movieIndex].clientHeight;
        })
        this.listHeight.push(height)
      })
      this.$emit('getHeight',this.listHeight);
      this.$emit('getMap',Object.keys(this.indexMap))
    }
  },
  watch:{
    movies(){
      if(this.needDate){
        this.recalculate()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
 .movie-list
    ul
      .date
        width: 100%
        background-color: $color-background-d
        padding-left: 5px
        height: 30px
        line-height: 30px
      .item
        display: flex
        align-items: center
        box-sizing: border-box
        padding: 15px 0
        .info-img
          flex: 80px 0 0
          margin-right: 10px
        .info-desc
          height: 120px
          flex: 1
          display: flex
          flex-direction: column
          justify-content: space-around
          overflow: hidden
          .title
            font-size: $font-size-medium-x
            color: $color-text-f
          .director
            font-size: $font-size-small
          .casts
            font-size: $font-size-small
            no-wrap()
          .hasWatched
            color: $color-text-f
            font-size: $font-size-small
</style>

