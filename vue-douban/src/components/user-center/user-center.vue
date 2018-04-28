<template>
  <div class="user-center">
  		<div class="user">
  			<div class="avatar">
  				<img src="../../common/image/avatar.jpg" alt="" width="60" height="60"/>
  			</div>
  			<div class="name">豆瓣用户</div>
  			<switches v-if="itemLength > 0" :switches="switches" :currentIndex="currentIndex" @switch="switchTab"></switches>
  			<scroll class="switch-item" :data="itemLists" ref="scroll" v-if="itemLists.length>0">
  				<div class="user-item" v-for="(item,index) in switches" v-if="index===currentIndex">
  					<div class="movie-num" v-if="index !== 2">{{itemLength}} 部</div>
  					<div class="movie-num" v-else>{{itemLength}} 人</div>
  					<rank-list :rankItems="itemLists"
  						:needRank="needRank"
  						:needLoading="needLoading"
  						v-if="index!==2"
  						@select="selectMovie"
  						></rank-list>
  					<celebrity-list v-else :celebrities="itemLists" @select="selectCelebrity"></celebrity-list>
  				</div>
  			</scroll>
  			<div class="no-result" v-if="itemLength==0">还没有收藏，快去收藏吧 :)</div>
  		</div>
  </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import CelebrityList from 'components/celebrity-list/celebrity-list'
import RankList from 'components/rank-list/rank-list'
export default {
	data(){
		return {
			itemLists:[],//当前tab的数据列表
			itemLength:0,//当前tab的数据列表长度
			switches:[
			 		{name: '想看'},
          {name: '看过'},
          {name: '影人'}
			],//	切换选择
			currentIndex:0,//当前选择的标签
			needRank:false,//不需要排名
			needLoading:false,//不需要加载动画
		}
	},
	computed:{
		...mapGetters([
			'wantedMovies',//想看的电影
			'watchedMovies',//看过的电影
			'collectedCelebrities'//收藏的明星
		])
	},
	created(){
		this.itemLists = this.wantedMovies 
		this.itemLength = this.wantedMovies.length;
		this.$emit('hasLoad',true)
	},
	 activated() { // keep-alive组件激活
	 		if(this.itemLength==0){
	 			return
	 		}
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    },
  components:{
  		Switches,
  		RankList,
  		CelebrityList,
  		Scroll
  },
  watch:{
  		 watchedMovies(lists) {
        if (this.currentIndex === 1) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      },
      wantedMovies(lists) {
        if (this.currentIndex === 0) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      },
      collectedCelebrities(lists) {
        if (this.currentIndex === 2) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      }
  },
  methods:{
  	  selectMovie(movie){
  	  		//查看当前选中电影
  	  		this.$router.push({
  	  			path:`/movie/${movie.id}`
  	  		})
  	  		this.setMovie(movie)
  	  },
  	  selectCelebrity(id){
  	  	this.setCelebrity(id);
  	  	 this.$router.push({
          path: `/celebrity/${id}`
        });
  	  },
	  	switchTab(index){
	  		//切换选项卡
	  	 this.currentIndex = index
  		 switch (index) {
        case 0:
          this.itemLists = this.wantedMovies;
          break;
        case 1:
          this.itemLists = this.watchedMovies;
          break;
        case 2:
          this.itemLists = this.collectedCelebrities;
          break;
      }
  		 this.itemLength = this.itemLists.length;
  		 //重置scroll状态
  		 	this.$nextTick(()=>{
  		 		this.$refs.scroll.scrollTo(0,0)
  		 		this.$refs.scroll.refresh()
  		 	})
	  	},
	  	...mapMutations({
	  		setMovie:'SET_MOVIE',//存储当前选择的电影
	  		setCelebrity:'SET_CELEBRITY_ID'//存储当前选择的明星
	  	})
  },
   watch: {
      watchedMovies(lists) {
        if (this.currentIndex === 1) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      },
      wantedMovies(lists) {
        if (this.currentIndex === 0) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      },
      collectedCelebrities(lists) {
        if (this.currentIndex === 2) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      }
    },
}
</script>
<style lang="stylus" scoped>
 @import "../../common/stylus/variable.styl"
  .user-center
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 61px
    background-color: #f8f8f8
    overflow: hidden
    .user
      box-sizing: border-box
      width: 100%
      height: 150px
      background: linear-gradient($color-theme-f, $color-theme);
      padding: 35px 50px 35px 20px
      display: flex
      align-items: center
      .avatar
        flex: 80px 0 0
        width: 80px
        img
          border-radius: 50%
      .name
        flex: 1
        color: $color-background
        font-size: $font-size-large
    .switch-item
      position: absolute
      top: 197px
      width: 100%
      bottom: 0
      overflow: hidden
      .user-item
        .movie-num
          height: 40px
          line-height: 40px
          padding: 0 20px
          font-size: $font-size-medium
        .rank-list
          background: $color-background
        .develop
          text-align: center
          color: $color-theme-f
</style>

