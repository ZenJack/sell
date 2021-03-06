<template>
  <div class="seller" ref="sellerScroll">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{ seller.name }}</h1>
        <div class="desc">
          <v-star class="star" :size="36" :score="seller.score"></v-star>
          <span class="text">({{ seller.ratingCount }})</span>
          <div class="text">月售{{ seller.sellCount }}单</div>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均送达时间</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryTime }}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <i class="icon-favorite" :class="{'active': favorite}"></i>
          <span class="text">{{ favoriteText }}</span>
        </div>
      </div>   
      <v-split></v-split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li class="support-item border-1px" v-for="item in seller.supports">
          <span class="icon" :class="classMap[item.type]"></span>
          <span class="text">{{ item.description }}</span>
        </li>
      </ul>
      <v-split></v-split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picScroll">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <v-split></v-split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">{{ info }}</li>
        </ul>
      </div>      
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import star from '../../components/star/star';
import split from '../../components/split/split';
import store from '../../common/js/store';

export default {
  name: 'sells',
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      classMap: [],
      favorite: (() => {
        let def = false;
        let result = store.loadFromLocal(this.seller.id, 'favorite', def);
        if (result !== def) {
          return result;
        }
        return def;
      })()
    };
  },
  watch: {
    seller () {
      this._initScroll();
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    this._initScroll();
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏';
    }
  },
  methods: {
    _initScroll () {
      this.$nextTick(() => {
        if (this.sellerScroll) {
          this.sellerScroll.refresh();
        } else {
          this.sellerScroll = new BScroll(this.$refs.sellerScroll, {
            click: true
          });
        }
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          if (this.picScroll) {
            this.picScroll.refresh();
          } else {
            this.picScroll = new BScroll(this.$refs.picScroll, {
              scrollX: true
            });
          }
        }
      });
    },
    toggleFavorite (event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      store.saveToLocal(this.seller.id, 'favorite', this.favorite);
    }
  },
  components: {
    'v-star': star,
    'v-split': split
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/base.styl"

  .seller
    position: absolute
    top: 175px
    left: 0
    bottom: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
      .desc
        font-size: 0
        line-height: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        padding-bottom: 18px
        .star
          display: inline-block
          vertical-align: top
          font-size: 18px
          margin-right: 8px
        .text
          display: inline-block
          font-size: 10px
          margin-right: 12px
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          text-align: center
          &:last-child
            border-right: none
          h2
            font-size: 10px
            color: rgb(147, 153, 159)
            margin-bottom: 4px
          .content
            font-size: 10px
            color: rgb(7, 17, 27)
            line-height: 24px
            .stress
              height: 24px
              font-size: 24px
      .favorite
        position: absolute
        top: 18px
        right: 18px
        width: 36px
        text-align: center
        .icon-favorite
          display: block
          font-size: 24px
          line-height: 24px
          color: #d4d6d9
          margin-bottom: 4px
          &.active
            color: rgb(240, 20, 20)
        .text
          font-size: 10px
          line-height: 10px
          color: #d4d6d9
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          font-size: 12px
          line-height: 24px
          color: rgb(240, 20, 20)
    .supports
      padding: 0 18px
      .support-item
        font-size: 0
        padding: 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          margin-bottom: 0
          border-none()
        .text
          vertical-align: top
          font-size: 12px
          font-weight: 200
          line-height: 16px
          margin-left: 6px
        .icon
          display: inline-block
          width: 16px
          height: 16px
          background-size: 16px 16px
          background-repeat: norepeat
          &.decrease
            bg-image('decrease_2')
          &.discount
            bg-image('discount_2')
          &.guarantee
            bg-image('guarantee_2')
          &.invoice
            bg-image('invoice_2')
          &.special
            bg-image('special_2')      
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin-right: 0
    .info
      padding: 18px 18px 0 18px
      .title
        padding-bottom: 12px
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
        border-1px(rgba(7, 17, 27, 0.1))
      .info-item
        padding: 16px 12px
        font-size: 12px
        line-height: 16px
        color: rgb(7, 17, 27)
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
</style>
