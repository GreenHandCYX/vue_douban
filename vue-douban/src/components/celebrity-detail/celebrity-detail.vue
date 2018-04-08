<template>
  <div class="detail-wrapper">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type" ref="fixed">
        影人
      </span>
    </div>
    <scroll class="celebrity-detail" v-if="celebrityDetail.avatars" :data="celebrityDetail">
      <div class="scroll-wrapper">
        <div class="bg-image" ref="image">
          <img v-lazy="replaceUrl(celebrityDetail.avatars.large)" alt="">
        </div>
        <div class="celebrity-info">
          <div class="main">
            <h1 class="name-cn">{{celebrityDetail.name}}</h1>
            <span class="name-en">{{celebrityDetail.name_en}}</span>
            <div class="collect" @click="saveCollect" :class="{'has-collected':isCollected(celebrityDetail.id)}">
              <i class="icon" :class="collect"></i>
              <span class="text">{{collectText}}</span>
            </div>
          </div>
          <div class="brief">
            <div class="title">个人简介</div>
            <p class="text" @click="showInfo">
              {{celebrityDetail.summary}}
              <span class="more"><i class="icon-keyboard_arrow_right"></i></span>
            </p>
          </div>
          <h2 class="works-title">代表作品</h2>
          <scroll class="works" :scrollX="this.scrollX" :eventPassthrough="this.eventPassthrough" ref="scroll" v-if="works.length">
            <div class="works-content" ref="content">
              <div class="work-item" v-for="(item,index) in works" :key="index" @click="selectWork(item,$event)">
                <img v-lazy="replaceUrl(item.image)" width="90" height="120" alt="">
                <h3 class="item-title">{{item.title}}</h3>
                <star :score="item.rating" :showScore="showScore"></star>
              </div>
            </div>
          </scroll>
          <div class="allWorks" @click="getAllWorks">
            查看全部作品
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </div>
      </div>
    </scroll>
    <loadmore :fullScreen="fullScreen" v-if="!celebrityDetail.avatars"></loadmore>
    <celebrity-info :infoLists="celebrityDetail" ref="info"></celebrity-info>
    <router-view></router-view>
  </div>
</template>
<script>
import {mapGetters, mapActions,mapMutations} from 'vuex';
import {getCelebrity} from 'api/celebrity';
import Scroll from 'base/scroll/scroll';
import Loadmore from 'base/loadmore/loadmore';
import Star from 'base/star/star'
import {createMovieList} from 'common/js/movieList';
import Celebrity from 'common/js/celebrity';
import CelebrityInfo from 'components/celebrity-info/celebrity-info'

export default {
  name:'celebrity',//避免keep-alive缓存
  data(){
    return {
      celebrityDetail:{},//影人详情
      works:[],//作品
      hasCollected:false,//默认未收藏
      collectText:'收藏',//默认显示收藏按钮
      scrollX:true,//开启横向滚动
      eventPassthrough:'vertical',//忽略纵向滚动
      fullScreen:true,//开启全屏加载动画
      showScore:true,//显示分数
    }
  },
  computed:{
    collect(){
      //监听收藏内容变化的类的切换
      return this.hasCollected === false ?'icon-collect' : 'icon-checkmark';
    },
    ...mapGetters([
      'currentCelebrityId',//当前选中的影人id
      'collectedCelebrities'//收藏的影人
    ])
  },
  created(){
    this._getCelebrity();//获取当前选中影人的信息
  },
  methods:{
    getAllWorks(){
      //跳转到子路由
      this.$router.push({
        path:`/celebrity/${this.currentCelebrityId}/works`
      })
    },
     replaceUrl(srcUrl) {
        if (srcUrl !== undefined) { // 图片防盗链处理
          return ('https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, ''));
        }
      },
    selectWork(movie){
      //查看当前作品
      //阻止浏览器派发的点击事件，只保留scroll组件派发的
      if(!event._constructed){
        return
      }
      this.setMovie(movie)
      this.$router.push({
        path:`/movie/${movie.id}`
      })
    },
    showInfo(){
      this.$refs.info.show();
    },
    isCollected(id){
      const index = this.collectedCelebrities.findIndex(item =>{
        return item.id===id
      })
      if(index > -1){
        this.hasCollected = true;
        this.collectText ='已收藏' 
        return true
      }else{
        this.hasCollected = false;
        this.collectText ='已收藏';
        return false; 
      }
    },
    back(){
      this.$router.back()
    },
    _getCelebrity(){
      //不存在影人id则返回首页
      if(!this.currentCelebrityId){
        this.$router.push('/movie-show');
        return
      }
      getCelebrity(this.currentCelebrityId).then(res=>{
        //防止快速切换路由参数消失
        if(!this.$route.params.celebrityId){
          return
        }
        this.celebrityDetail = res;
        // console.log(this.celebrityDetail)
        let ret = [];//影人作品
        res.works.forEach(item => {
          ret.push(item.subject)
        });
        //将影人作品处理为movieList类，便于读取vuex
        this.works = createMovieList(ret);
        
        //把影人包装为利于收藏入vuex和读取的影人类
        //主要作品
        const mainWorks = [];
        res.works.forEach(item =>{
          mainWorks.push(item.subject.title)
        });
        this.celebrity = new Celebrity({
          id:res.id,
          name:res.name,
          image:res.avatars.large,
          works:mainWorks.slice(0,3)
        })
        this._initPics();//需要重新渲染scroll获取其宽度
      })
    },
    replaceUrl(srcUrl){
      //解决图片防盗链问题
      if(srcUrl!==undefined){
        return ('https://images.weserv.nl/?url='+srcUrl.replace(/http\w{0,1}:\/\//,''))
        
      }
    },
    _initPics(){
      //获取宽度重新渲染scroll内部以使其可以滚动
      let picWidth = 90;
      let margin = 8;
      let width =(picWidth+margin)*this.works.length - margin;
      //因为有v-if所以需要等待dom渲染完毕
      this.$nextTick(()=>{
        this.$refs.content.style.width = width + 'px'
      })
    },
    saveCollect(){
      //收藏或取消影人信息
      this.markCelebrity(this.celebrity);
      this.hasCollected = !this.hasCollected;
      if(!this.hasCollected){
        this.collectText = '收藏'
      }else{
        this.collectText = '已收藏'
      }
    },
    ...mapActions([
      'markCelebrity'//收藏或取消影人信息
    ]),
    ...mapMutations({
      setMovie:'SET_MOVIE'//存储当前选中电影
    })
  },
  components:{
    Scroll,
    CelebrityInfo,
    Loadmore,
    Star
  }
}
</script>
<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .detail-wrapper
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: $color-background-f
    z-index: 10
    .fixed-title
      position: fixed
      top: 0
      width: 100%
      height: 40px
      z-index: 100
      background-color: rgba(85, 85, 85, .6)
      .back
        position: absolute
        top: 0px
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 11px
          font-size: $font-size-large
          color: $color-background
      .type
          display: inline-block
          padding-top: 12px
          padding-left: 50px
          font-size: $font-size-medium-x
          color: $color-background
    .celebrity-detail
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
          width: 40%
      .celebrity-info
        background-color: $color-background
        padding: 15px 20px 0 20px
        .main
          position: relative
          .name-cn
            font-size: $font-size-medium-x
            color: $color-text-f
          .name-en
            display: inline-block
            padding-top: 7px
            font-size: $font-size-medium
          .collect
            position: absolute
            top: 0
            right: 0
            height: 30px
            line-height: 30px
            width: 80px
            text-align: center
            font-size: $font-size-medium
            border: 1px solid $color-theme-f
            border-radius: 10px
            &.has-collected
              border: 1px solid $color-collect
              color: $color-collect
              .icon
                color: $color-collect
              .text
                color: $color-collect
            .icon
              display: inline-block
              vertical-align: middle
              color: $color-theme-f
            .text
              display: inline-block
              font-size: $font-size-small
              color: $color-theme-f
        .brief
          position: relative
          margin-top: 30px
          font-size: $font-size-medium
          .text
            position: relative
            // height: 60px
            padding-right: 15px
            display: -webkit-box
            -webkit-line-clamp: 3
            -webkit-box-orient: vertical
            overflow: hidden
            margin-top: 20px
            color: $color-text-f
            line-height: 20px
            .more
              position: absolute
              top: 50%
              transform: translateY(-50%)
              right: 0
              font-size: $font-size-large-x
              color: $color-theme-f
       .works-title
              font-size: $font-size-medium
              margin-top: 30px
              padding-bottom: 20px
       .works
          padding-bottom: 20px
          font-size: $font-size-medium
          white-space: nowrap
          overflow: hidden
          font-size: 0
          border-bottom-1px(#ccc)
          .works-content
            .work-item
               width: 90px
               vertical-align: top
               display: inline-block
               margin-right: 8px
               font-size: $font-size-medium
               img
                 height: 120px
                 width: 90px
               .item-title
                 color: $color-text-f
                 padding: 8px 0 5px 0
                 no-wrap()
       .allWorks
          padding: 20px 0
          font-size: $font-size-medium
          i
            display: inline-block
            vertical-align: middle
            font-size: $font-size-large-x
</style>


