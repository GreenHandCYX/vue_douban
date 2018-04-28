<template>
	<div class="history-list">
		<ul>
			<li v-for="item in searches" :key="item" @click="selectItem(item)" class="history-item">
				<span class="text">{{item}}</span>
				<span class="icon" @click.stop="deleteOne(item)">
					<i class="icon-close"></i>
				</span>
			</li>
		</ul>
		<div class="no-history" v-show="!searches.length">还没有搜索历史，快去搜索吧 :)</div>
	</div>
</template>

<script>
	export default {
		props:{
			searches:{
				type:Array,//搜索历史
				default:[]
			}
		},
		methods:{
			selectItem(item){
				//选择当前历史搜索
				this.$emit('select',item)
			},
			deleteOne(item){
				//删除当前历史搜索
				this.$emit('delete',item)
			}
		}
	}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .history-list
    .history-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      .text
        flex: 1
        font-size: $font-size-medium
        color: $color-text
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-f
    .no-history
      height: 40px
      line-height: 40px
      text-align: center
      font-size: $font-size-medium
</style>