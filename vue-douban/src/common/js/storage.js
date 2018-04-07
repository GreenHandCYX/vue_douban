//处理本地缓存
//存储缓存,以id和key的二维数组方式存储值
export function saveToLocal(id,key,val){
  //判断是否已有缓存
  let userInfo = window.localStorage._doubanMovie_;
  if(!userInfo){
    userInfo = {};
    userInfo[id] = {};
  }else{
    userInfo = JSON.parse(userInfo);
    if(!userInfo[id]){
      userInfo[id] = {}
    }
  }
  userInfo[id][key] = val;
  //挂载到全局
  window.localStorage._doubanMovie_ = JSON.stringify(userInfo)
}

//读取指定类型缓存
export function loadFromLocal(id,key,def){
  let userInfo = window.localStorage._doubanMovie_;
  if(!userInfo){
    return def;
  }
  userInfo = JSON.parse(userInfo)[id];
  if(!userInfo){
    return def;
  }
  let ret = userInfo[key];
  return ret || def;
}