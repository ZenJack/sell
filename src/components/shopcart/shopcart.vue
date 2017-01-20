<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleList()">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount > 0">
            {{ totalCount }}
          </div>
        </div>
        <div class="price" :class="{'highlight': totalPrice > 0}">¥{{ totalPrice }}</div>
        <div class="desc">另需配送费{{ deliveryPrice }}¥</div>
      </div>
      <div class="content-right" @click="pay()">
        <div class="pay" :class="{'highlight': minPrice <= totalPrice}">
          {{ payDesc }}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div v-show="ball.show" class="ball">
            <div v-show="ball.show" class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty()">清空</span>
        </div>
        <div class="list-content" ref="listScroll">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{ food.name }}</span>
              <div class="price">
                <span class="count">
                  ¥{{ food.price * food.count }}
                </span>
              </div>
              <div class="cartcontrol-wrapper">
                <v-cartcontrol :food="food" @increment="incrementTotal"></v-cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleList()"></div>
    </transition>
  </div>
</template>

<script>
import cartcontrol from '../../components/cartcontrol/cartcontrol';
import BScroll from 'better-scroll';
export default {

  name: 'shopcart',

  data () {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    };
  },
  props: {
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 10,
            count: 1
          },
          {
            price: 20,
            count: 2
          }
        ];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPrice () {
      let total = 0;
      this.selectFoods.forEach((e) => {
        total += e.price * e.count;
      });
      return total;
    },
    totalCount () {
      let count = 0;
      this.selectFoods.forEach((e) => {
        count += e.count;
      });
      return count;
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}起送`;
      } else if (this.minPrice > this.totalPrice) {
        return `还差${this.minPrice - this.totalPrice}¥起送`;
      } else {
        return `去结算`;
      }
    },
    listShow () {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (this.scroll) {
            this.scroll.refresh();
          } else {
            this.scroll = new BScroll(this.$refs.listScroll, {
              click: true
            });
          }
        });
      }
      return show;
    }
  },
  methods: {
    beforeEnter (el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
          el.style.display = '';
          inner.style.display = '';
        }
      }
    },
    enter (el) {
      this.$nextTick(() => {
        /* eslint-disable no-unused-vars */
        let rf = el.clientHeight;
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
      });
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    pay () {
      let total = this.totalPrice + this.deliveryPrice;
      if (total >= this.minPrice) {
        window.alert(`共需${total}元`);
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
      return this.fold;
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    incrementTotal (target) {
      this.drop(target);
    }
  },
  components: {
    'v-cartcontrol': cartcontrol
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    height: 48px
    z-index: 50
    background-color: #141d27
    .content
      display: flex
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background-color: #141d27
          vertical-align: top
          .logo
            width: 100%
            height: 100%
            background-color: #2B343C
            text-align: center
            border-radius: 50%
            &.highlight
              background-color: rgb(0, 160, 220)
            .icon-shopping_cart
              font-size: 24px
              line-height: 44px
              &.highlight
                color: #fff
        .num
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px
          font-size: 9px
          font-weight: 700
          color: #fff
          background-color: rgb(240, 20, 0)
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          font-size: 16px
          font-weight: 700
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          padding-right: 12px
          box-sizing: border-box
          line-height: 24px
          margin-top: 12px
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px
          font-size: 12px
          line-height: 24px
      .content-right
        flex: 0 0 105px
        width: 105px
        background-color: #2B333B
        @media only screen and (max-width: 320px)
          flex: 0 0 89px
          width: 89px
        .pay
          text-align: center
          font-size: 12px
          font-weight: 700
          height: 48px
          line-height: 48px
          padding: 0 8px
          &.highlight
            background-color: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.24,-0.33, 0.71, 0.4)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear

    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active
        transition: all 0.5s
        opacity: 1
      &.fold-enter
        transform: translate3d(0, 0, 0)
        opacity: 0
      &.fold-leave-active
        transition: all 0.5s
        transform: translate3d(0, 0, 0)
        opacity: 0
      &.fold-leave
        opactiy: 1
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background-color: #f3f5f7
        border-bomttom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        background-color: #FFF
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            color: rgb(240, 20, 20)
            .count
              font-weight: 700
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 11px
    .list-mask
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -2
      background-color: rgba(7, 17, 27, 0.6)
      .fade-enter-active
        transition: all 0.5s
        opacity: 1
      .fade-enter
        opacity: 0
      .fade-leave-active
        transition: all 0.5s
        opacity: 0
      .fade-leave
        opacity: 1
</style>