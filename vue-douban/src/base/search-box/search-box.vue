<template>
	<div class="search-box">
		<i class="icon-search"></i>
 		<input type="text" class="box" :placeholder="placeholder" v-model="query" ref="query">
    <span class="cancel" @click="back">取消</span>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				query:''//搜索内容
			}
		},
		props:{
			placeholder:{
				type:String,//搜索框提示
				default:'搜索电影/影人'
			},
			tagSearch:{
				type:Boolean,//是否有搜索标签
				default:false
			}
		},
		methods:{
			back(){
				this.$emit('back')
				this.query=""
				this.$router.back()
			},
			setQuery(query){
				//设置查询
				this.query=query
			},
			clear(){
				//	清空表单
				this.query = ''
			},
			blur(){
				this.$refs.query.blur()
			},
			focus(){
				this.$refs.query.focus()
			}
		},
		watch:{
			query(newQuery){
				//	需要对搜索进行截流
				if(!this.tagSearch){
					if(this.timer){
						clearTimeout(this.timer)
					}
					this.timer = setTimeout(()=>{
						this.$emit('query',newQuery)
					},200)
				}else{
					//标签搜索不需要节流
					this.$emit('query',newQuery)
				}
			}
		}
	}
</script>

<style scoped lang="stylus">
@import "../../common/stylus/variable.styl"
  .search-box
    box-sizing: border-box
    width: 100%
    display: flex
    align-items: center
    padding: 10px 0px 10px 20px
    height: 50px
    background: $color-theme-f
    .icon-search
      position: absolute
      top: 18px
      left: 28px
      font-size: $font-size-medium
      color: $color-text
    .box
      flex: 75% 0 0
      padding-left: 30px
      height: 30px
      line-height: 30px
      border-radius: 5px
      background: $color-background
      color: $color-text-f
      font-size: $font-size-medium
      caret-color: $color-theme-f
      &::placeholder
        color: $color-text
    .cancel
      flex: 1
      text-align: center
      font-size: 16px
      color: $color-background
</style>