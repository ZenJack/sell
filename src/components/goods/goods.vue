<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <li v-for="(item, index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span class="icon" v-if="item.type > 0" :class="classMap[item.type]"></span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsScroll">
      <ul>
         <li v-for="item in goods" class="food-list food-list-hook">
           <h1 class="title">
             {{ item.name }}
           </h1>
           <ul>
             <li @click="selectedFood(food, $event);" v-for="food in item.foods" class="food-item border-1px">
               <div class="icon">
                 <img :src="food.icon" width="57" height="57" >
               </div>
               <div class="content">
                 <h2 class="name">
                   {{ food.name }}
                 </h2>
                 <p class="desc">
                   {{ food.description }}
                 </p>
                 <div class="extra">
                   <span class="count">月售{{ food.sellCount }}份</span>
                   <span class="rating">好评率{{ food.rating }}%</span>
                 </div>
                 <div class="price">
                   <span class="now">¥{{ food.price }}</span>
                   <span class="old" v-show="food.oldPrice">¥{{ food.oldPrice }}</span>
                 </div>
                 <div class="cartcontrol-wrapper">
                   <v-cartcontrol :food="food" @increment="incrementTotal"></v-cartcontrol>
                 </div>
               </div>
             </li>
           </ul>
         </li>
       </ul>     
    </div>
    <v-shopcart :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></v-shopcart>
    <v-food :food="selectFood" ref="food" @increment="incrementTotal"></v-food>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';

const ERR_OK = 0;

export default {
  name: 'goods',
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectFood: {}
    };
  },
  props: {
    seller: {
      type: Object
    }
  },
  computed: {
    currentIndex () {
      let length = this.listHeight.length;
      for (let i = 0; i < length; i++) {
        let item = this.listHeight[i];
        let nextItem = this.listHeight[i + 1];
        if (!nextItem) break;
        if (this.scrollY >= item && this.scrollY < nextItem) {
          return i;
        }
      }
      return length - 1;
    },
    selectFoods () {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count > 0) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    this.$http.get('api/goods').then((respose) => {
      respose = respose.body;
      if (respose.errno === ERR_OK) {
        this.goods = respose.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },
  methods: {
    selectedFood (food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectFood = food;
      this.$refs.food.show();
    },
    selectMenu (index, event) {
      if (!event._constructed) {
        return;
      }
      this.foodList = this.$refs.foodsScroll.getElementsByClassName('food-list-hook');
      let el = this.foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuScroll, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsScroll, {
        click: true,
        probeType: 3
      });
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight () {
      this.foodList = this.$refs.foodsScroll.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < this.foodList.length - 1; i++) {
        let item = this.foodList[i];
        height += item.scrollHeight;
        this.listHeight.push(height);
      }
    },
    incrementTotal (target) {
      this.$refs.shopcart.drop(target);
    }
  },
  components: {
    'v-shopcart': shopcart,
    'v-cartcontrol': cartcontrol,
    'v-food': food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/base.styl'
  @import '../../common/stylus/mixin.styl'

  .goods
    display: flex
    position: absolute
    top: 175px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      .menu-item
        display: table
        width: 56px
        height: 54px
        line-height: 14px
        padding: 0 12px
        &:last-child
          .text
            border-none()
        &.current
          background-color: #ffffff
          z-index: 10
          .text
            font-weight: 700
            border-none()
        .icon
          display: inline-block
          width: 18px
          height: 18px
          background-size: 18px 18px
          background-repeat: no-repeat
          vertical-align: middle
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          line-height: 18px
          border-1px(rgba(7, 17, 27, 0.1))
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background-color: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        padding-bottom: 18px
        &:last-child
          border-none()
          padding-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          position: relative
          flex: 1
          .name
            margin-top: 2px
            font-size: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            margin-top: 8px
            font-size: 0
            line-height: 10px
            color: rgb(147, 153, 159)
          .desc
            font-size: 10px
          .extra
            .count
              font-size: 10px
              margin-right: 10px
            .rating
              font-size: 10px
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
            right: 0
            bottom: 0
</style>
