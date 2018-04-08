//操作state的异步事件,实质是异步的commit mutation
import * as types from './mutation-types'

//处理缓存的事件
import {saveWatchedMovie,saveWantedMovie,saveCelebrity,saveComment} from '../common/js/cache'

//存储或删除想看的电影
export const markWantedMovie = ({commit},movie) => commit(types.SET_WANTED_MOVIES,saveWantedMovie(movie))

//存储或删除看过的电影
export const markWatchedMovie = ({commit},movie) => commit(types.SET_WATCHED_MOVIES,saveWatchedMovie(movie))

//收藏或取消收藏影人
export const markCelebrity = ({commit},celebrity) => commit(types.SET_COLLECT_CELEBRITY,saveCelebrity(celebrity))

//点赞或取消点赞
export const markComment = ({commit},id) => commit(types.SET_FAVORITE_COMMENTS,saveComment(id))