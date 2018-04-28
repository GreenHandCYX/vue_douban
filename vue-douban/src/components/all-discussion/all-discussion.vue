<template>
  <div class="discussion-wrapper">
      <div class="fixed-title">
          <span class="back" @click="back">
              <i class="icon-back"></i>
          </span>
          <span class="type">{{title}}</span>
          <span class="to-top" @click="toTop">
              <i class="icon-circle-up"></i>
          </span>
      </div>
      <scroll class="all-discuss"
      		:data="discussions"
      		:pullup="pullup"
      		@scrollToEnd="loadMore"
      		ref="scroll"
      	>
      	<div class="discuss-content">
      		<movie-comment
      			v-if="currentDiscussionType==='comment'"
      			:comments="discussions"
      			:commentNum="discussionNum"
      			:needTitle="needTitle"
      			:hasMore="hasMore"
      			></movie-comment>
      			<movie-review
      				v-else
      				:reviews="discussions"
      				:reviewNum="discussionNum"
      				:needTitle ="needTitle"
      				:hasMore="hasMore"
      				@selectReview="selectReview"
      				></movie-review>
      	</div>
      	<loadmore :fullScreen="fullScreen" v-if="!discussions.length && !noResult"></loadmore>
      	<div class="no-result" v-if="noResult">这里什么都没有呃 :(</div>
      </scroll>
  </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex'
import {getAllComments,getAllReviews} from 'api/movie-detail'
import Scroll from 'base/scroll/scroll'
import MovieComment from 'components/movie-comment/movie-comment'
import MovieReview from 'components/movie-review/movie-review'
import Loadmore from 'base/loadmore/loadmore'
const SEARCH_MORE = 20//每次请求的数据量
export default {
	data(){
		return {
			discussions:[],//评论列表
			discussionindex:0,//评论起始索引
			hasMore:true,//是否有更多数据
			noResult:false,//没有结果
			pullup:true,//支持上拉加载
			discussionNum:0,//评论数量
			fullScreen:true,
			needTitle:true
		}
	},
	components:{
		Scroll,
		MovieComment,
		MovieReview,
		Loadmore
	},
	created(){
		this.loadingFlag = true //是否可以继续加载，默认可以
		this._getAllDiscussions();
	},
  methods:{
  	  selectReview(id){
  	  	//查看指定影评详情
  	  	this.setReview(id)
  	  	this.$router.push({
  	  		path:`/movie/${this.movie.id}/review/${id}`
  	  	})
  	  },
      back(){
          this.$router.back()
      },
      toTop(){
          this.$refs.scroll.scrollTo(0,0,200)
      },
      _getAllDiscussions(){
      	if(!this.currentDiscussionType){
      		this.$router.push({path:'/movie-show'})
      		return
      	}
      	 //判断评论类型
      	let isComment = this.currentDiscussionType === 'comment'
      	this.discussType = isComment?'comments':'reviews';
      	this.getData = isComment ? getAllComments:getAllReviews
      	this.getData(this.movie.id,this.discussionindex,SEARCH_MORE).then(res=>{
      		this.discussions = this.discussions.concat(res[this.discussType])
      		this.noResult = this.discussions.length ? this.noResult : true
      		this.discussionNum = res.total
      		this._checkMore(res)
      	})
      },
      _checkMore(data){
      	//检测是否有更多数据
      	const discussions = data.comments?data.comments:data.reviews;
      	if(!discussions.length || data.start + data.count >data.total){
      		this.hasMore = false
      	}
      },
      loadMore(){
      	//加载更多数据
      	//判断上一次加载是否已完成,及是否还有数据
      	if(!this.loadingFlag || !this.hasMore){
      		return;
      	}
      	this.loadingFlag = false;
      	this.discussionindex += SEARCH_MORE;
      	
      	this.getData(this.movie.id,this.discussionindex,SEARCH_MORE).then(res=>{
      		this.discussions = this.discussions.concat(res[this.discussType])
      		this._checkMore(res);
      		this.loadingFlag = true
      	})
      },
      ...mapMutations({
      	//当前查看的影评
      	setReview:'SET_REVIEW_ID'
      	})
  },
  computed:{
  	title(){
  		//当前显示的是什么电影的什么评论类型
  		return `${this.movie.title}的全部${this.type}`
  	},
  	type(){
  		//当前评论类型
  		return this.currentDiscussionType === 'comments'?'短评':'影评'
  	},
  	...mapGetters([
  		'movie',//当前评论所属电影
  		'currentDiscussionType'//当前评论类型
  	])
  }
}
</script>
<style lang="stylus" scoped>
 @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .discussion-wrapper
    height: 100%
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
        padding-left: 50px
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
    .all-discuss
      position: fixed
      top: 0
      bottom: 0
      left: 0
      right: 0
      z-index: 150
      overflow: hidden
      background-color: $color-background
      .discuss-content
        padding-top: 50px
      .no-result
        position: absolute
        top: 50%
        width: 100%
        text-align: center
</style>


