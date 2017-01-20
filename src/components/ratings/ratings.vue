<template>
  <div class="ratings" ref="ratingsScroll">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">
            {{ seller.score }}
          </h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <v-star class="star" :size="36" :score="seller.serviceScore"></v-star>
            <span class="score">
              {{ seller.serviceScore }}
            </span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <v-star :size="36" :score="seller.foodScore"></v-star>
            <span class="score">
              {{ seller.foodScore }}
            </span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">
              {{ seller.deliveryTime }}分钟
            </span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-ratingselect :initSelectType="selectType" :initOnlyContent="onlyContent" :ratings="ratings" @set="set"></v-ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px" v-for="rating in ratings">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">
                {{ rating.username }}
              </h1>
              <div class="star-wrapper">
                <v-star class="star" :size="24" :score="rating.score"></v-star>
                <span class="delivery" v-show="rating.deliveryTime">
                  {{ rating.deliveryTime }}分钟送达
                </span>
              </div>
              <p class="text" v-show="rating.text">
                {{ rating.text }}
              </p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <i class="icon-thumb_up"></i>
                <span class="item" v-for="item in rating.recommend">
                  {{ item }}
                </span>
              </div>
              <div class="time">
                {{ rating.rateTime | formatDate }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import star from '../../components/star/star';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect';
import BScroll from 'better-scroll';
import {formatDate} from '../../common/js/date';

const ALL = 2;
const ERR_OK = 0;

export default {
  name: 'ratings',
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true
    };
  },
  created () {
    this.$http.get('api/ratings').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.ratings = response.data;
        this.refreshList();
      }
    });
  },
  filters: {
    formatDate (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  methods: {
    set (type, value) {
      this[type] = value;
    },
    refreshList () {
      this.$nextTick(() => {
        if (this.scroll) {
          this.scroll.refresh();
        } else {
          this.scroll = new BScroll(this.$refs.ratingsScroll, {
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
    }
  },
  components: {
    'v-star': star,
    'v-split': split,
    'v-ratingselect': ratingselect
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratings
    position: absolute
    top: 175px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          font-size: 24px
          line-height: 28px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          font-size: 12px
          line-height: 12px
          color: rgb(7, 17, 27)
        .rank
          margin-bottom: 6px
          font-size: 10px
          line-height: 10px
          color: rgb(7, 17, 27)
      .overview-right
        flex: 1
        padding-left: 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            vertical-align: top
            margin-left: 12px
          .score
            display: inline-block
            font-size: 12px
            line-height: 18px
            color: rgb(255, 153, 0)
            margin-left: 12px
        .delivery-wrapper
          font-size: 0
          .title
            display: inline-block
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .delivery
            display: inline-block
            font-size: 12px
            line-height: 18px
            color: rgb(147, 153, 159)
            margin-left: 12px
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          height: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            font-size: 10px
            line-height: 12px
            color: rgb(7, 17, 27)
          .star-wrapper
            font-size: 0
            margin-bottom: 6px
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top
              font-size: 10px
              font-weight: 200
              line-height: 14px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up
              display: inline-block
              font-size: 9px
              color: rgb(0, 163, 220)
            .item
              display: inline-block
              margin-left: 8px
              margin-bottom: 4px
              font-size: 9px
              color: rgb(147, 153, 159)
              background-color: #FFF
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              padding: 3px 6px 1px 6px
          .time
            position: absolute
            top: 0
            right: 0
            font-size: 10px
            font-weight: 200
            line-height: 12px
            color: rgb(147, 153, 159)
</style>
