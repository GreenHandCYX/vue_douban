//vuex状态树
//引入缓存处理事件
import {loadWatchedMovie,loadWantedMovie,loadCelebrity,loadComment} from '../common/js/cache'
const state = {
  movie:{},//当前选中的电影
  watchedMovies:loadWatchedMovie(),//看过的电影
  wantedMovies:loadWantedMovie(),//想看的电影
  currentCelebrityId:0,//当前选中的影人
  collectedCelebrities:loadCelebrity(),//收藏的影人
  favoriteComments:loadComment()//点赞的评论
}
export default state;