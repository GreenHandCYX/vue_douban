<template>
  <div class="rank-wrapper">
  		<div class="fixed-title">
  		  <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type">
        <span>{{rankType}}</span>
      </span>
  		</div>
  		<switches v-if="rankType==='豆瓣 Top250'"
  							:switches="switches"
  							:currentIndex="currentIndex"
  							:smallFont="smallFont"
  							@switch="switchTab"
  			></switches>
  			<scroll v-for="(item,index) in switches"
  							v-show="currentIndex === index"
  							:key="index"
  							:probeType="probeType"
  							:listenScroll="listenScroll"
  							@scrollToEnd="listenScroll"
  							@scroll="scroll"
  							class="rank-list-wrapper"
            		ref="scroll"
  				>
  				<div class="rank-content" :class="{'more-padding':rankType==='豆瓣 Top250'}">
  					<rank-list
  						:rankItems="rankList[index]"
  						@select="selectMovie"
  						:page="index"
  						:hasMore="hasMore[index]"
  					></rank-list>
  				</div>
  				   <loadmore :fullScreen="fullScreen" v-if="!rankList[index]"></loadmore>
  			</scroll>
  </div>
</template>
<script>
import {top250Rank,weeklyRank,newMoviesRank,usBoxRank} from 'api/movie-rank'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import {createRankList} from 'common/js/movieList'
import RankList from 'components/rank-list/rank-list'
import Loadmore from 'base/loadmore/loadmore'
import {mapMutations} from 'vuex'
const SEARCH_MORE = 10 //每次请求的数据量
export default {
	data(){
		return {
			rankType:'',//当前榜单类型
			dataFn:null,//数据请求函数
			 switches: [
          {name: '1-50'},
          {name: '51-100'},
          {name: '101-150'},
          {name: '151-200'},
          {name: '201-250'}
        ],//top250范围选择
        currentIndex:0,//当前选中的页面
        smallFont: true, // tab栏目小字体
        rankList:{},//排行榜数据
        hasMore: [false, false, false, false, false], // 是否存在更多数据，仅针对top250
				movieIndex: [0, 50, 100, 150, 200], // 每页起始索引
				probeType:3,// 需要实时派发事件 
				listenScroll:true,//需要监听滚轮事件
				loadingFlag:true,//控制滚动加载的速度
				scrollY:[0, 0, 0, 0, 0],//记录每页滚动条的位置
				fullScreen:true//全屏加载动画
		}
	},
	components:{
		Switches,
		Scroll,
		RankList,
		Loadmore
	},
	beforeMount(){
		//防止数据未请求完毕进行渲染报错
		//需在data创建之后添加索引属性作为初始值
		for (let i=0;i<this.switches.length;i++) {
			this.$set(this.rankList,i,[])
		}
	},
  created(){
  		this._selectType()
  		this._getRankList()
  },
  methods:{
  		loadMore(){
  			//加载更多数据
  			const index = this.currentIndex//获取当前页面索引
  			//判断上次加载是否已完成
  			if(!this.loadingFlag){
  				return
  			}
  			this.loadingFlag = false
  			//判断当前页是否有更多数据
  			if(!this.hasMore[index]){
  					return
  			}
  			this.movieIndex[index] += SEARCH_MORE
  			this.dataFn(this.movieIndex[index],SEARCH_MORE).then( res =>{
  				this.ranList[index] = this.rankList[index].concat(createRankList(res.subjects))
  				//查看是否有更多数据
  				this._checkMore(res);
  				this.loadingFlag = true
  			})
  		},
  		selectMovie(movie){
  			//查看电影详情
  			this.$router.push({
  				path:`/movie/${movie.id}`
  			})
  			this.setMovie(movie)
  		},
  		scroll(pos){
  			//记录当前页面的滚动条的位置
  			this.scrollY[this.currentIndex] = pos.y
  		},
  		back(){
  			this.$router.back()
  		},
  		switchTab(index){
  			//切换tab选项卡
  			this.currentIndex = index;
  			this.loadingFlag = true;
  			//重新计算scroll
  			let currentScroll = this.$refs.scroll[index]
  			currentScroll.scrollTo(0,this.scrollY[index])//滚动到之前的位置
  			setTimeout(()=>{
  				currentScroll.refresh()
  			},20)
  			  if (this.rankList[index].length === 0) { // 首次切换到当前分页时
          this.hasMore[index] = true;
          this.dataFn(this.movieIndex[index], SEARCH_MORE).then((res) => {
            this.rankList[index] = createRankList(res.subjects);
          });
        }
  		},
  		 _checkMore(data) {
        let movies = data.subjects;
        let end = 50 * (this.currentIndex + 1);
        if (!movies.length || data.start + data.count >= end) {
          this.hasMore[this.currentIndex] = false;
        }
      },
  		_getRankList(){
  			//获取表单数据
  			if(this.rankType !== '豆瓣 Top250'){
  				this.dataFn().then(res =>{
  					//处理列表数据并存储
  				  this.rankList[0] = createRankList(res.subjects)
  				})
  			}else{
  				this.dataFn(this.movieIndex[0],SEARCH_MORE).then(res =>{
  					this.rankList[0] = createRankList(res.subjects);
  					 this.hasMore[0] = true;
            // 第一次可以不进行检查
  				})
  			}
  		},
  		_selectType(){
  			//通过路由获取当前榜单类型
  			let type = this.$route.params.rankType
  			//判断所需的请求函数与榜单类型
  			 switch (type) {
          case 'top250':
            this.dataFn = top250Rank;
            this.rankType = '豆瓣 Top250';
            break;
          case 'weekly':
            this.dataFn = weeklyRank;
            this.rankType = '本周口碑榜';
            break;
          case 'new-movie':
            this.dataFn = newMoviesRank;
            this.rankType = '新片榜';
            break;
          case 'us-box':
            this.dataFn = usBoxRank;
            this.rankType = '北美票房榜';
            break;
       }
  		},
  		...mapMutations({
  			setMovie:'SET_MOVIE'
  		})
  }
  
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .rank-wrapper
    // 防止底部tab栏目遮挡
    position: relative
    z-index: 10
    .fixed-title
      border-bottom-1px($color-line)
      position: fixed
      top: 0
      width: 100%
      height: 50px
      z-index: 200
      background-color: $color-background
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
        padding-left: 60px
        color: $color-text-f
    .switches
      position: fixed
      top: 50px
      width: 100%
      height: 40px
      z-index: 200
      background-color: $color-background
    .rank-list-wrapper
      position: fixed
      top: 0
      bottom: 0
      left: 0
      right: 0
      background: $color-background
      .rank-content
        padding: 50px 15px 40px 15px
        &.more-padding
          padding-top: 90px
	
</style>

