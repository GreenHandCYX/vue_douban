<template>
	<div class="suggest-wrapper">
		<div class="to-top" @click="toTop" v-show="result.length">
			<span>回到顶部</span>
		</div>
		<scroll class="suggest"
			:data="result"
			:pullup="pullup"
			:beforeScroll="beforeScroll"
			@beforeScroll="listScroll"
			@scrollToEnd="searchMore"
			ref="suggest"
			>
			<ul class="suggest-list">
				<li class="suggest-item" v-for="item in result" v-if="item.subtype !== 'tv'" @click="selectItem(item)">
					<div class="item-pic">
						<img :src="replaceUrl(item.image)" width="50" height="70" alt="" />
					</div>
					<div class="item-info">
						<div class="title">{{item.title}}</div>
						<div class="info">
							<span class="rating">{{item.rating | getRating}}</span>
							<span class="pubdate">{{item.pubdates | getPubdate}}</span>
						</div>
					</div>
				</li>
				<loadmore :hasMore="hasMore" v-if="result.length"></loadmore>
			</ul>
			<div class="no-result" v-if="noResult">抱歉，暂无搜索结果 :(</div>
			<loadmore :fullScreen="fullScreen" v-if="!result.length && !noResult"></loadmore>
		</scroll>
	</div>
</template>

<script>
	const SEARCH_MORE = 20;
	import {movieSearch,tagSearch} from 'api/movie-search'
	import {createSearchList} from 'common/js/movieList'
	import Loadmore from 'base/loadmore/loadmore'
	import Scroll from 'base/scroll/scroll'
	import {mapMutations} from 'vuex'
	export default {
		props:{
			query:{
				type:String,//搜索条件
				default:''
			},
			tagSearch:{
				type:Boolean,//是否是标签搜索
				default:false
			}
		},
		components:{
			Scroll,
			Loadmore
		},
		data(){
			return {
				dataFn:null,//搜索请求函数
				result:[],//搜索结果集
				hasMore:true,//是否有更多数据
				loadingFlag:true,//是否正在请求数据
				noResult:false,//是否有结果
				pullup:true,//上拉加载
				beforeScroll:true,//开启滚动前触发
				fullScreen:true,//全屏加载
			}
		},
		filters:{
			getRating(rate){
				//处理评分
				if(rate === 0){
					return '暂无评分'
				}
				return rate + '分'
			},
			getPubdate(date){
				//处理上映日期
				let pubdate = '';
				for (let i=0;i < date.length; i++) {
					if (date[i].indexOf('电影节') === -1) {
            pubdate = date[i]; // 没有在中国大陆上映，取不为电影节的最后一个信息
          }
          if (date[i].indexOf('中国大陆') > -1) {
            pubdate = date[i];
            break;
          }
				}
				if (!pubdate) {
          return '';
        }
        return '/' + pubdate;
			}
		},
		created(){
			this._selectType();
		},
		methods:{
			replaceUrl(srcUrl) {
        if (srcUrl !== undefined) { // 图片防盗链处理
          return ('https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, ''));
        }
      },
			selectItem(item){
				//查看搜索结果详情,并将搜索记录存入历史搜索
				this.$router.push({
					path:`/movie/${item.id}`
				})
				this.setMovie(item);
				this.$emit('select')
			},
			searchMore(){
				//加载更多数据
				//判断上一次加载是否完成
				if(!this.loadingFlag || !this.hasMore){
					return;
				}
				this.loadingFlag = false;
				this.searchIndex += SEARCH_MORE;
				this.dataFn(this.query,this.searchIndex,SEARCH_MORE).then(res=>{
					this.result = this.result.concat(createSearchList(res.subjects));
					this._checkMore(res);
					this.loadingFlag = true
				})
			},
			listScroll(){
				//滚动前触发，让父组件input失焦。为了防止移动端输入框聚焦时，键盘遮挡
				this.$emit('listScroll')
			},
			toTop(){
				//回到顶部
				this.$refs.suggest.scrollTo(0,0,200)
			},
			_selectType(){
				//判断搜索类型
				this.dataFn = this.tagSearch ? tagSearch : movieSearch;
			},
			_checkMore(data) {
        let movies = data.subjects;
        if (!movies.length || data.start + data.count >= data.total) {
          this.hasMore = false;
        }
      },
			search(){
				//重置状态
				this.result = [];
				this.hasMore = true;
				this.loadingFlag = true;
				this.searchIndex = 0;//搜索结果的索引要重新开始
				//需回滚到顶部
//				this.$refs.suggest.scrollTo(0,0)
				this.dataFn(this.query,this.searchIndex,SEARCH_MORE).then(res=>{
					//获取当前搜索的内容，防止当前搜索结果还没加载完毕就进行了下一次搜索所出现的数据的混杂
					const queryRet = res.title.split('"')
					if(this.query !== queryRet[1]){
						//不是当前搜索内容则是上一次过期（即未加载完成）的搜索
						console.log('old request + 1',queryRet[1]);
						return
					}
					if(!res.subjects.length){
						//判断是否存在搜索结果
						this.noResult = true;
					}else{
						this.noResult = false
					}
					//处理搜索结果
					this.result = createSearchList(res.subjects)
					//查看是否有更多数据
					this._checkMore(res)
				})
			},
			...mapMutations({
				setMovie:'SET_MOVIE'
			})
		},
		watch:{
			query(){
				//监听传入的搜索条件的变化
				this._selectType();
				if(this.query){//搜索框有数据
					//	清空数据，重新请求
					this.result = [];
					this.search();
				}
			}
		}
	}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .suggest-wrapper
    height: 100%
    .to-top
      box-sizing: border-box
      height: 22px
      position: fixed
      right: 0
      top: 80%
      z-index: 800
      padding: 5px
      background: $color-theme-f
      color: $color-background
      text-align: center
      font-size: $font-size-small
    .suggest
      height: 100%
      overflow: hidden
      .suggest-list
        padding: 15px
        .suggest-item
          margin-top: 15px
          height: 70px
          display: flex
          &:first-child
            margin-top: 0
          .item-pic
            flex: 50px 0 0
            width: 50px
            margin-right: 10px
          .item-info
            flex: 1
            padding-bottom: 30px
            .title
              font-size: $font-size-medium
              color: $color-text-f
              margin-bottom: 10px
            .info
              font-size: 0
              span
                font-size: $font-size-small
      .no-result
        position: absolute
        top: 50%
        width: 100%
        text-align: center

</style>