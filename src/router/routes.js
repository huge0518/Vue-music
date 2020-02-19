import routesComponent from './routesComponent'

export default [{
  path: '/root',
  name: 'root',
  component: routesComponent.rootComponent,

//二级路由组件
  children: [{
    path: '/Home',
    name: 'Home',
    meta: { 
      keepAlive: true // 需要缓存 
      },
    component: routesComponent.homeComponent,
  },

  {
    path: '/Ranking',
    name: 'Ranking',
    meta: { 
      keepAlive: true // 需要缓存 
      },
    component: routesComponent.rankingComponent,
  },

  {
    path: '/MV',
    name: 'MV',
    meta: { 
      keepAlive: true // 需要缓存 
      },
    component: routesComponent.MVComponent,
  },

  {
    path: '/Singer',
    name: 'Singer',
    meta: { 
      keepAlive: true // 需要缓存 
      },
    component: routesComponent.singerComponent,
  },

  {
    path: '/SongSheet',
    name: 'SongSheet',
    meta: { 
      keepAlive: true // 需要缓存 
      },
    component: routesComponent.songSheetComponent,
  },

  {
    path: '/SheetDetail/:id',
    name: 'SheetDetail',
    component: routesComponent.sheetDetailComponent,
  },

  {
    path: '/MVDetail/:id',
    name: 'MVDetail',
    component: routesComponent.mvDetailComponent,
  },

  {
    path: '/SingerDetail/:id',
    name: 'SingerDetail',
    component: routesComponent.singerDetailComponent,
  },
  
  
]
}, 
{
path: '/word:id',
name: 'word',
component: routesComponent.wordComponent,
},
{
  path: '/search',
  name: 'search',
  component: routesComponent.searchComponent,
  },

{
  path: '*',
  redirect: {
    name: 'Home'
  }
}]
