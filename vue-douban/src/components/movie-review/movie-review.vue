<template>
  <div class="movie-review">
      <div class="type-title" v-if="needTitle">
          影评{{reviewNum}}条
      </div>
      <ul>
          <li v-for="(review,index) in reviews" class="review-item" :key="index" @click="selectReview(review.id)">
              <div class="content">
                  <h1 class="title">{{review.title}}</h1>
                  <div class="user-info">
                      <div class="avatar">
                          <img v-lazy="review.author.avatar" alt="" width="25" height="25">
                      </div>
                      <span class="name">{{review.author.name}}</span>
                      <star :size="24" :score="review.rating.value*2"></star>
                  </div>
                  <p class="desc">{{review.summary}}</p>
              </div>
          </li>
      </ul>
      <div class="allReview" v-if="!needTitle" @click="needAllReviews">
          <span>全部影评{{reviewNum}}</span>
      </div>
      <loadmore :hasMore="hasMore" v-if="needTitle" v-show="reviews.length"></loadmore>
  </div>
</template>
<script>
import Star from 'base/star/star'
import Loadmore from 'base/loadmore/loadmore'
export default {
  props:{
      reviews:{
          type:Array,//评论数据
          default:[]
      },
      reviewNum:{
          type:Number,//评论数量
          default:0
      },
      needTitle:{
          type:Boolean,//控制显示的标题的类型及加载动画的显示
          default:false
      },
      hasMore:{
          type:Boolean,
          default:true//是否有更多数据
      }
  },
  methods:{
      selectReview(id){
          //查看影评详情
          this.$emit('selectReview',id)
      },
      needAllReviews(){
          this.$emit('needAllReviews')
      }
  },
  components:{
      Star,
      Loadmore
  }
}
</script>
<style lang="stylus" scoped>
 @import "../../common/stylus/variable.styl"
  .movie-review
    padding: 20px
    background: $color-background
    .type-title
      font-size: $font-size-medium
      margin-bottom: 15px
    .review-item
      margin-bottom: 20px
      .content
        font-size: $font-size-small
        .title
          font-size: $font-size-medium-x
          color: $color-text-f
          padding: 5px 0
        .user-info
          padding: 5px 0
          .avatar
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            img
              border-radius: 50%
          .name
            display: inline-block
            vertical-align: middle
          .star
            display: inline-block
            vertical-align: middle
        .desc
          line-height: 20px
    .allReview
      font-size: $font-size-medium
      color: $color-theme-f
      text-align: center
      padding-bottom: 10px
</style>


