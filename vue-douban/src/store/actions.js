//操作state的异步事件,实质是异步的commit mutation
import * as types from './mutation-types'

//处理缓存的事件
import {saveWatchedMovie,saveWantedMovie,saveCelebrity,saveComment,saveSearch,deleteSearch,clearSearch} from '../common/js/cache'

//存储或删除想看的电影
export const markWantedMovie = ({commit},movie) => commit(types.SET_WANTED_MOVIES,saveWantedMovie(movie))

//存储或删除看过的电影
export const markWatchedMovie = ({commit},movie) => commit(types.SET_WATCHED_MOVIES,saveWatchedMovie(movie))

//收藏或取消收藏影人
export const markCelebrity = ({commit},celebrity) => commit(types.SET_COLLECT_CELEBRITY,saveCelebrity(celebrity))

//点赞或取消点赞
export const markComment = ({commit},id) => commit(types.SET_FAVORITE_COMMENTS,saveComment(id))

//保存搜索历史
export const saveSearchHistory = ({commit},query)=>commit(types.SET_SEARCH_HISTORY,saveSearch(query))

//删除某条历史记录
export const deleteSearchHistory = ({commit},query)=> commit(types.SET_SEARCH_HISTORY,deleteSearch(query))

//清空所有历史记录
export const clearSearchHistory = ({commit}) => commit(types.SET_SEARCH_HISTORY,clearSearch())
