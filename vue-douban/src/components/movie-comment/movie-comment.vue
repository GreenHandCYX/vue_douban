<template>
    <div class="movie-comment">
        <div class="type-title" v-if="needTitle">
            短评{{commentNum}}条
        </div>
        <ul>
            <li v-for="(comment,index) in comments" :key="index" class="comment-item">
                <div class="avatar">
                    <img v-lazy="comment.author.avatar" alt="" width="36" height="36">
                </div>
                <div class="content">
                    <h1 class="name">{{comment.author.name}}</h1>
                    <star :size="24" :score="comment.rating.value*2"></star>
                    <p class="text">{{comment.content}}</p>
                    <span class="date">{{comment.created_at}}</span>
                    <div class="useful-count"
                    @click="markItem(comment.id,index)"
                    :class="{'like':isLike(comment.id)}"
                    >
                    <i class="icon-thumb_up"></i>
                    {{comment.useful_count}}
                    </div>
                </div>
            </li>
        </ul>
        <div class="allComment" v-if="!needTitle" @click="needAllComments">
            <span>全部短评{{commentNum}}</span>
        </div>
        <loadmore :hasMore="hasMore" v-if="needTitle" v-show="comments.length"></loadmore>
    </div>
</template>
<script>
import Star from 'base/star/star'
import Loadmore from 'base/loadmore/loadmore'
import {mapGetters,mapMutations, mapActions} from 'vuex'
export default {
  props:{
      comments:{
          type:Array,//评论
          default:[]
      },
      commentNum:{
          type:Number,//评论数量
          default:0
      },
      needTitle:{
          type:Boolean,
          default:false//是否需要短评数量标题，false指需要全部标题而不需要加载动画及短评数量标题
      },
      hasMore:{
          type:Boolean,
          default:true //是否有更多数据
      }
  },
  computed:{
      ...mapGetters([
          'favoriteComments'//点赞的评论
      ])
  },
  methods:{
    needAllComments(){
        this.$emit('needAllComments')
    },
    markItem(id,index){
        //标记为点赞过的评论或者取消点赞
        this.markComment(id)
        //进行模拟点赞加减，并不会修改真实数据
        const CommentIndex = this.favoriteComments.findIndex(item=>{
            return item===id
        })
        if(CommentIndex > -1){
            this.comments[index].useful_count ++;
        }else{
            this.comments[index].useful_count --;
        }
    },
    isLike(id){
        //判断是否是点赞过的
        const index = this.favoriteComments.findIndex(item=>{
            return item === id
        })
        if(index > -1){
            return true
        }
        return false
    },
    ...mapActions([
        'markComment'//将点赞状态存入vuex
    ])
  },
  components:{
      Star,
      Loadmore
  }
}
</script>
<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .movie-comment
    padding: 20px
    background: $color-background
    .type-title
      font-size: $font-size-medium
      margin-bottom: 15px
    .comment-item
      display: flex
      margin-bottom: 20px
      .avatar
        flex: 0 0 36px
        width: 36px
        margin-right: 12px
        img
          border-radius: 50%
      .content
        flex: 1
        position: relative
        font-size: $font-size-medium
        color: $color-text-f
        .name
          display: inline-block
          line-height: 25px
          margin-right: 5px
        .star
          display: inline-block
        .text
          line-height: 20px
        .date
          font-size: $font-size-small
          color: $color-text
          line-height: 25px
        .useful-count
          position: absolute
          color: $color-text
          top: 5px
          right: 5px
          &.like
            color: $color-theme-f
    .allComment
      font-size: $font-size-medium
      color: $color-theme-f
      text-align: center
      padding-bottom: 10px
</style>


