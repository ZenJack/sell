// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods';
import seller from './components/seller/seller';
import ratings from './components/ratings/ratings';

// 将 vue-router 插件安装到 vue 中
Vue.use(VueRouter);
Vue.use(VueResource);

// 创建路由
/*
  path 路由
  component 组件名
  alias 路由别名，多个别名如 alias: ['/a', '/b']
*/
const routes = [
  {
    path: '/goods',
    component: goods,
    alias: '/g'
  },
  {
    path: '/seller',
    component: seller,
    alias: '/s'
  },
  {
    path: '/ratings',
    component: ratings,
    alias: '/r'
  }
];

// 创建router实例，传入routes配置
const router = new VueRouter({
  /*
    mode: 'history' 配置后浏览器路径如：http://localhost/ratings
    不配置路径如：http://localhost/#/ratings
  */
  mode: 'history',
  routes
});

// 默认跳转到指定的路由下
// router.push('/goods');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
