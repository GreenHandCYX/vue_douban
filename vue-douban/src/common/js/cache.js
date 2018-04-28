//缓存相关事件
import {saveToLocal,loadFromLocal} from './storage'

//定义通用常量
const USER_ID = 'cyx';//当前用户
const WATCHED_KEY = '__watched__';//看过的电影
const WANTED_KEY = '__wanted__';//想看的电影
const CELEBRITY_KEY = '__celebrity__';//收藏的影人
const COMMENT_KEY = '__comment__';//点赞评论
const SEARCH_KEY = '__search__';//搜索历史
const WATCHED_MAX_LENGTH = 300;//看过电影的长度限制
const WANTED_MAX_LENGTH = 300;//想看电影的长度限制
const CELEBRITY_MAX_LENGTH =300;//收藏的影人的长度限制
const COMMENT_MAX_LENGTH = 300;//点赞评论的长度限制
const SEARCH_MAX_LENGTH = 20;//搜索历史长度限制
/*
 *想看的电影
 */
//存储为想看的电影或者删除已存在的电影
export function saveWantedMovie(movie){
  const maxLen = WANTED_MAX_LENGTH;
 //获取缓存数组
  let movies = loadFromLocal(USER_ID,WANTED_KEY,[]);//获取不到则返回空数组
  //查找缓存数组中是否包含要添加的数据，返回索引值
  const index = movies.findIndex((item)=>{
    return item.id === movie.id
  })
  if(index===-1){
    movies.push(movie)
    //超过最大长度则从前删去多余的
    if(maxLen && movies.length>maxLen){
    movies.shift();
    }
  }else{
    //相同则是从缓存中删去
    movies.splice(index,1)
  }
  //重新存储此时的缓存
  saveToLocal(USER_ID,WANTED_KEY,movies);
  return movies;
}
//从缓存中读取
export function loadWantedMovie(){
  return loadFromLocal(USER_ID,WANTED_KEY,[]);
}


/*
 *看过的电影
 */
//存储为看过的电影或者删除已存在的电影
export function saveWatchedMovie(movie){
  const maxLen = WATCHED_MAX_LENGTH;
 //获取缓存数组
  let movies = loadFromLocal(USER_ID, WATCHED_KEY,[]);//获取不到则返回空数组
  //查找缓存数组中是否包含要添加的数据，返回索引值
  const index = movies.findIndex((item)=>{
    return item.id === movie.id
  })
  if(index===-1){
    movies.push(movie)
    //超过最大长度则从前删去多余的
    if(maxLen && movies.length>maxLen){
    movies.shift();
    }
  }else{
    //相同则是从缓存中删去
    movies.splice(index,1)
  }
  //重新存储此时的缓存
  saveToLocal(USER_ID, WATCHED_KEY,movies);
  return movies;
}
//从缓存中读取
export function loadWatchedMovie(){
  return loadFromLocal(USER_ID, WATCHED_KEY,[]);
}



/*
*收藏影人
*/
//收藏或取消收藏影人
export function saveCelebrity(celebrity){
  const maxLen = CELEBRITY_MAX_LENGTH;
  let celebrities = loadFromLocal(USER_ID,CELEBRITY_KEY,[]);//获取不到返回空数组
  const index = celebrities.findIndex(item =>{
    return item.id === celebrity.id
  })
  if(index === -1){
    celebrities.push(celebrity)
    if(maxLen && celebrities.length > maxLen){
      // 超过最大长度时移除起始数据
      celebrities.shift()
    }
  }else{
    // 若已经存在了被标记的id，则代表用户进行了反操作，取消了喜欢
    celebrities.splice(index,1)
  }
  // 存入缓存
  saveToLocal(USER_ID,CELEBRITY_KEY,celebrities)
  return celebrities;
}
//从缓存中读取
export function loadCelebrity(){
  return loadFromLocal(USER_ID,CELEBRITY_KEY,[])
}

/*
*点赞评论
*/
//点赞或取消点赞
export function saveComment(id){
  const maxLen = COMMENT_MAX_LENGTH;
  let comments = loadFromLocal(USER_ID,COMMENT_KEY,[]);
  const index = comments.findIndex(item=>{
    return item === id
  })
  if(index === -1){
    comments.push(id);
    if(maxLen && comments.length > maxLen){
      comments.shift()
    }
  }else{
    comments.splice(index,1)
  }
  saveToLocal(USER_ID,COMMENT_KEY,comments);
  return comments
}

//查看评论点赞状态
export function loadComment(){
  return loadFromLocal(USER_ID,COMMENT_KEY,[])
}

/**
 * 搜索历史
* */

//保存搜索结果
export function saveSearch(query){
	let searches = loadFromLocal(USER_ID,SEARCH_KEY,[]);//获取不到返回空数组
	insertArray(searches,query,item => {
		return item === query
	},SEARCH_MAX_LENGTH);
	saveToLocal(USER_ID,SEARCH_KEY,searches);
	return searches;
}
//从缓存中读取
export function loadSearch() {
  return loadFromLocal(USER_ID, SEARCH_KEY, []);
}

// 从缓存中删除
export function deleteSearch(query) {
  let searches = loadFromLocal(USER_ID, SEARCH_KEY, []); // 获取不到返回空数组
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  saveToLocal(USER_ID, SEARCH_KEY, searches); // 存入缓存
  return searches;
}
// 删除全部缓存
export function clearSearch() {
  saveToLocal(USER_ID, SEARCH_KEY, []); // 存入缓存;
  return [];
 }



/*
 * 通用方法
 */

//将信息插入缓存数组
function insertArray(arr,val,compare,maxLen){
	//查找缓存数组中是否包含添加的数据，返回索引
	const index = arr.findIndex(compare)
	if(index===0){
		return
	}
	if(index>0){
		arr.splice(index,1)
	} 
	// 将新数据添加到最前面
  arr.unshift(val);
  // 超过最大长度时移除末尾数据
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }//
}
//将信息从缓存数组中删除
function deleteFromArray(arr,compare){
	const index = arr.findIndex(compare);
	if(index > -1){
		arr.splice(index,1)
	}
}
