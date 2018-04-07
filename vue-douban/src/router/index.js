import Vue from 'vue'
import Router from 'vue-router'
//单一按需加载
const MovieShow = resolve => require(['components/movie-show/movie-show'],resolve)
const Rank = resolve => require(['components/rank/rank'],resolve)
const RankDetail = resolve => require(['components/rank-detail/rank-detail'], resolve);
const UserCenter = resolve => require(['components/user-center/user-center'], resolve);
const MovieDetail = resolve => require(['components/movie-detail/movie-detail'],resolve);
const CelebrityDetail = resolve => require(['components/celebrity-detail/celebrity-detail'],resolve)
const CelebrityWorks = resolve => require(['components/celebrity-works/celebrity-works'],resolve)

//整体文件加载
//let getCommonComponent = componentName => resolve => require(['components/CommonComponents'],components=> resolve(components[componentName]))

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/movie-show'
    },
    {
      path:'/movie-show',
      component:MovieShow
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':rankType',
          component: RankDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    },
    {
      path:'/movie/:movieId',
      component:MovieDetail
    },
    {
      path:'/celebrity/:celebrityId',
      component:CelebrityDetail,
      children:[
        {
          path:'works',
          component:CelebrityWorks
        }
      ]
    }
  ],
  mode:'history'
})
