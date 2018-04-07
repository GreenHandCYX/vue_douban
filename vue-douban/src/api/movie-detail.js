import axios from 'axios';
import {commonParams } from './config'

//获取电影详情
export function getMovieDetail(id){
  const url = `/v2/movie/subject/${id}`;
  const data = Object.assign({},commonParams);
  return axios.get(url,{
    params:data
  }).then(res=>{
    return Promise.resolve(res.data)
  }).catch(err=>{
    console.log(err)
  })
}