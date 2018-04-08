//操作state的同步方法
import * as types from './mutation-types';
const mutations = {
  [types.SET_MOVIE](state,movie){
    state.movie = movie
  },
  [types.SET_SEARCH_HISTORY](state,history){
    state.searchHistory = history
  },
  [types.SET_WATCHED_MOVIES](state,movies) {
    state.watchedMovies = movies;
  },
  [types.SET_WANTED_MOVIES](state,movies){
    state.wantedMovies = movies;
  },
  [types.SET_CELEBRITY_ID](state,id){
    state.currentCelebrityId = id
  },
  [types.SET_COLLECT_CELEBRITY](state,celebrities){
    state.collectedCelebrities = celebrities
  },
  [types.SET_FAVORITE_COMMENTS](state,comments){
    state.favoriteComments = comments
  }
}
export default mutations;