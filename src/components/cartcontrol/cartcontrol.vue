<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart($event)">
        <i class="icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">
      {{ food.count }}
    </div>
    <div ref="cartAdd" class="cart-add" @click.stop.prevent="addCart($event)">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {

  name: 'cartcontrol',

  data () {
    return {
    };
  },
  props: {
    food: {
      type: Object,
      default () {
        return {
          count: 20
        };
      }
    }
  },
  created () {
  },
  methods: {
    addCart (event) {
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      this.$emit('increment', event.target);
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count === 0) {
        return;
      }
      this.food.count--;
    }
  }
};
</script>

<style lang="stylus" ref="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      width: 24px
      height: 24px
      padding-top: 1px
      font-size: 24px
      line-height: 24px
      color: rgb(0, 160, 220)
      .icon-remove_circle_outline
        width: 24px
        height: 24px
    .cart-count
      display: inline-block
      font-size: 10px
      line-height: 24px
      color: rgb(147, 153, 159)
      vertical-align: top
      width: 24px
      text-align: center
    .cart-add
      display: inline-block
      width: 24px
      height: 24px
      font-size: 24px
      line-height: 24px
      color: rgb(0, 160, 220)
      .icon-add_circle
        width: 24px
        height: 24px
          
  .move-enter-active
    transition: all 0.3s linear
    opacity: 1
    transform: rotate(180deg)
  .move-enter
    opacity: 0
    transform: translate3D(48px, 0, 0)
  .move-leave-active
    transition: all 0.3s linear
    opacity: 0
    transform: translate3D(48px, 0, 0)
    transform: rotate(180deg)
  .move-leave
    opacity: 1
  
</style>