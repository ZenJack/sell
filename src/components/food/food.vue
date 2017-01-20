<template>
  <transition name="food-move">
    <div v-show="showFlag" class="food" ref="foodScroll">
      <div>
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image"/>
            <div class="back">
              <i class="icon-arrow_lift" @click="back()"></i>
            </div>
          </div>
          <div class="content">
            <div class="title">
              {{ food.name }}
            </div>
            <div class="detail">
              <span class="sell-count">
                月售{{ food.sellCount }}份
              </span>
              <span class="rating">
                好评率{{ food.rating }}%
              </span>
            </div>
            <div class="price">
              <span class="now">¥{{ food.price }}</span>
              <span class="old" v-show="food.oldPrice">¥{{ food.oldPrice }}</span>
            </div>
          </div>
          <div class="cartcontrol-wrapper">
            <v-cartcontrol :food="food" @increment="incrementTotal"></v-cartcontrol>
          </div>
          <transition name="fade">
            <div @click="addFirst($event)" class="buy" v-show="!food.count || food.count === 0">
              加入购物车
            </div>
          </transition>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">
            {{ food.info }}
          </p>
        </div>
        <v-split v-show="food.rating"></v-split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <v-ratingselect :initSelectType="selectType" :initOnlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @set="set"></v-ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item" v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings">
                <div class="user">
                  <span class="name">
                    {{ rating.username }}
                  </span>
                  <img :src="rating.avatar" width="12" height="12" class="avatar">
                </div>
                <div class="time">
                  {{ rating.rateTime | formatDate }}
                </div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>
                  {{ rating.text }}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!(food.ratings && food.ratings.length)">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect';
import {formatDate} from '../../common/js/date';

// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;

export default {

  name: 'food',

  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  props: {
    food: {
      type: Object
    }
  },
  created () {
  },
  filters: {
    formatDate (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  methods: {
    show () {
      this.showFlag = true;
      this.refreshList();
    },
    back () {
      this.showFlag = false;
    },
    addFirst (event) {
      if (!event._constructed) {
        return;
      }
      Vue.set(this.food, 'count', 1);
    },
    set (type, value) {
      this[type] = value;
      this.refreshList();
    },
    refreshList () {
      this.$nextTick(() => {
        if (this.scroll) {
          this.scroll.refresh();
        } else {
          this.scroll = new BScroll(this.$refs.foodScroll, {
            click: true
          });
        }
      });
    },
    needShow (type, text) {
      this.refreshList();
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return this.selectType === type;
      }
    },
    incrementTotal (target) {
      this.$emit('increment', target);
    }
  },
  components: {
    'v-cartcontrol': cartcontrol,
    'v-split': split,
    'v-ratingselect': ratingselect
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background-color: #FFF
    &.food-move-enter-active
      transition: all 0.2s linear
      transform: translate(0, 0)
    &.food-move-enter
      transform: translate(100%, 0)
    &.food-move-leave-active
      transition: all 0.2s linear
      transform: translate(-100%, 0)
    &.food-move-leave
      transform: translate(0, 0)
    .food-content
      position: relative
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        img
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          left: 0
          top: 0
          color: #fff
          padding: 15px
      .content
        padding: 18px
        .title
          line-height: 14px
          margin-bottom: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          font-size: 0
          height: 10px
          .sell-count,.rating
            display: inline-block
            font-size: 10px
            color: rgb(147, 153, 159)
          .sell-count
            margin-right: 12px
        .price
          font-size: 0
          line-height: 14px
          .now
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .old
            font-size: 10px
            margin-left: 8px
            vertical-align: top
            text-decoration: line-through
            color: rgb(147, 153, 159)      
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 14px
        bottom: 14px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        font-size: 10px
        border-radius: 12px
        color: #fff
        background-color: rgb(0, 160, 220)
        &.fade-enter-active
          transition: all 0.3s linear
          opacity: 1
        &.fade-enter
          opacity: 0
        &.fade-leave-active
          transition: all 0.3s linear
          opacity: 0
        &.fade-leave
          opacity: 1
    .info
      padding: 18px
      .title
        font-size: 14px
        line-height: 14px
        margin-bottom: 6px
        color: rgb(7, 17, 27)
      .text
        font-size: 12px
        line-height: 24px
        padding: 0 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
        margin-left: 18px
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              display: inline-block
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>