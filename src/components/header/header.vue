<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title"> 
          <span class="brand"></span>
          <span class="name">
            {{ seller.name }}
          </span>
        </div>
        <div class="description">
          {{ seller.description }}/{{ seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text" v-show="seller.supports[0]">
            {{ seller.supports[0].description }}
          </span>
        </div>
      </div>
      <div v-if="seller.supports" @click="showDetail();" class="support-count">
        <span class="count">
          {{ seller.supports.length }}个
        </span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail();">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">
        {{ seller.bulletin }}
      </span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">
              {{ seller.name }}
            </h1>
            <div class="star-wrapper">
              <v-star :size="48" :score="seller.score"></v-star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="item in seller.supports">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">
                  {{ item.description }}
                </span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">
                {{ seller.bulletin }}
              </p>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="icon-close" @click="closeDetail()"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import star from '../star/star';

export default {
  name: 'header',
  data () {
    return {
      detailShow: false
    };
  },
  props: {
    seller: {
      type: Object
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  methods: {
    showDetail () {
      this.detailShow = true;
    },
    closeDetail () {
      this.detailShow = false;
    }
  },
  components: {
    'v-star': star
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .header
    position: relative
    color: #ffffff
    overflow: hidden
    background-color: rgba(7, 17, 27, 0.5)
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      font-size: 0
      .avatar
        display: inline-block
        img
          border-radius: 2px
      .content
        display: inline-block
        vertical-align: top
        margin-left: 16px
        font-size: 14px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            vertical-align: top
            margin-left: -2px
            font-size: 16px
            font-weight: bold
            line-height: 18px
        .description
          font-size: 12px
          margin-bottom: 10px
          line-height: 12px
        .support
          .icon
            display: inline-block
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            display: inline-block
            vertical-align: top
            line-height: 12px
            font-size: 12px
            margin-left: -3px
      .support-count
        position: absolute
        font-size: 0
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        background-color: rgba(0, 0, 0, 0.2)
        border-radius: 14px
        text-align: center
        .count
          vertical-align: top
          font-size: 12px
        .icon-keyboard_arrow_right
          font-size: 12px
          line-height: 24px
          margin-left: -4px
    .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 24px 0 12px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      font-size: 12px
      background-color: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        margin: 0 4px 0 -2px
        vertical-align: top
      .icon-keyboard_arrow_right
        position: absolute
        right: 12px
        top: 8px
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)
    .detail
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: 100%
      overflow: auto
      z-index: 100
      background-color: rgba(7, 17, 27, 0.8)
      backdrop-filter: blur(10px)
      .detail-wrapper
        min-height: 100%
        width: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            font-weight: 700
            line-height: 16px
            font-size: 16px
            text-align: center
          .star-wrapper
            margin-top: 16px
            text-align: center
            padding: 2px 0
          .title
            display: flex
            margin: 28px auto 24px auto
            .line
              &:nth-child(1)
                margin-left: 36px
              &:nth-child(3)
                margin-right: 36px
              flex: 1
              margin-bottom: 6px
              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding: 0 12px
              font-size: 14px
              font-weight: 700
              text-align: center
          .supports
            padding: 0 48px
            .support-item
              font-size: 0
              margin-bottom: 12px
              &:last-child
                margin-bottom: 0
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
          .bulletin
            padding: 0 48px
            font-size: 12px
            font-weight: 200px
            line-height: 24px
      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        clear: both
        font-size: 32px
        color: rgba(255, 255, 255, 0.5)
        
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
