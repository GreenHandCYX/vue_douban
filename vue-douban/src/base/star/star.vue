<template>
  <div class="star" :class="starType">
    <span class="star-item" :class="item" v-if="score||needNullStar" v-for="(item,index) in itemClasses" :key="index" ></span>
    <span class="no-score" v-if="!score" :class="{'block':needNullStar}">暂无评分</span>
    <span class="show-score" v-if="showScore && score">{{normalizeScore}}</span>
  </div>
</template>
<script  type="text/ecmascript-6">
const LENGTH = 5;//星星个数
const CLS_ON = 'on';//整颗星都点亮的类
const CLS_HALF = 'half';//半颗星都点亮的类
const CLS_OFF = 'off';//整颗星都不点亮的类
export default {
  props:{
    size:{
      type:Number,
      default:24
    },
    score:{
      type:Number,
      default:0
    },
    showScore:{
      type:Boolean,
      default:false
    },
    needNullStar:{
      type:Boolean,//需要灰色的星星吗
      default:false
    }
  },
  computed:{
    starType(){
      //分24和36两种大小的图片
      return 'star-'+this.size
    },
    itemClasses(){
      //生成星星样式数组,满分10.0五颗星星
      let result = [];
      let score =Math.floor(this.score) / 2;
      let hasDecimal = score % 1 !== 0;
      let integer = Math.floor(score)
      for(let i=0;i<integer;i++){
        result.push(CLS_ON)
      }
      if(hasDecimal){
        result.push(CLS_HALF)
      }
      while(result.length < LENGTH){
        result.push(CLS_OFF)
      }
      return result
    },
    normalizeScore(){
        //补零
        let len = this.score.toString().length;
        if(len<2){
          return `${this.score}.0`
        }
        return this.score
    }
  }
}
</script>
<style lang="stylus" scoped>
 @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/variable.styl"
  .star
    font-size: 0
    .no-score
      font-size: $font-size-small
    .block
      display: block
      font-size: $font-size-small
      text-align: center
      padding: 15px 0 10px 0
    .show-score
      display: inline-block
      font-size: $font-size-small
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-24
      .star-item
        height: 10px
        width: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('../../common/image/star24_on')
        &.half
          bg-image('../../common/image/star24_half')
        &.off
          bg-image('../../common/image/star24_off')
    &.star-36
      .star-item
        height: 15px
        width: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('../../common/image/star36_on')
        &.half
          bg-image('../../common/image/star36_half')
        &.off
          bg-image('../../common/image/star36_off')
</style>


