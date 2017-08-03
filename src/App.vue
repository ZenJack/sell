<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <transition name="fade" mode="out-in">
        <router-view :seller="seller"></router-view>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
// import {urlParse} from 'common/js/util.js';
import header from 'components/header/header';

const ERR_OK = 0;

export default {
  data () {
    return {
      seller: {
        // id: (() => {
        //   let queryParam = urlParse();
        //   return queryParam.id;
        // })()
      }
    };
  },
  created () {
    this.$http.get('api/seller').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.seller = response.data;
        // this.seller = Object.assign({}, this.seller, response.data);
      }
    });
  },
  components: {
    'v-header': header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/icon.styl"
  @import "./common/stylus/base.styl"
  @import "./common/stylus/mixin.styl"

  #app
    .tab
      display: flex
      align-items: center
      justify-content: center
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          color: rgb(77, 85, 93)
          font-size: 14px
          &.router-link-active
            color: rgb(240, 20, 20)
</style>
