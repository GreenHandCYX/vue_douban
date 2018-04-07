import axios from 'axios'
import {commonParams} from './config'

//获取影人信息
export function getCelebrity(id){
  const url = `/v2/movie/celebrity/${id}`;
  const data = Object.assign({},commonParams);
  return axios.get(url,{
    params:data
  }).then(res =>{
    return Promise.resolve(res.data)
  }).catch(err =>{
    console.log(err)
  })
}

//获取影人的全部作品,分页展示
export function getCelebrityWorks(id,start,count){
  const url = `/v2/movie/celebrity/${id}/works`;
  const data = Object.assign({},commonParams,{
    start,
    count
  })
  return axios.get(url,{
    params:data
  }).then(res =>{
    return Promise.resolve(res.data)
  }).catch(err =>{
    console.log(err)
  })
}