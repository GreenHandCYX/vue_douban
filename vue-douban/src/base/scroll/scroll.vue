<template>
    <div ref="wrapper">
      <slot></slot>
    </div>
</template>
<script>
import BSroll from "better-scroll";
export default {
  props: {
    probeType: {
      // 派发滚动事件方式
      /**  1 滚动的时候会派发scroll事件，会截流。
       *   2 滚动的时候实时派发scroll事件，不会截流。 
       *   3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件 
       **/
      type: Number,
      default: 1
    },
    click: {
      // 是否支持点击
      type: Boolean,
      default: true
    },
    data: {
      //列表的数据
      // type: Array,
      default: null
    },
    scrollX: {
      // 设置滚动方向为x轴
      type: Boolean,
      default: false
    },
    listenScroll: {
      // 监听滚动
      type: Boolean,
      default: false
    },
    pullup: {
      // 是否派发滚动到底部的事件，用于上拉加载
      type: Boolean,
      default: false
    },
    beforeScroll: {
      // 滚动开始派发
      type: Boolean,
      default: false
    },
    refreshDelay: {
      // 控制数据更新后刷新scroll的延迟时间(内部如果包含动画切换，需要增加延时)
      type: Number,
      default: 20
    },
    eventPassthrough: {
      // 忽略滚动的方向
      type: String,
      default: ""
    }
    //有时候我们使用 better-scroll 在某个方向模拟滚动的时候，希望在另一个方向保留原生的滚动（比如轮播图，我们希望横向模拟横向滚动，而纵向的滚动还是保留原生滚动，我们可以设置 eventPassthrough 为 vertical；相应的，如果我们希望保留横向的原生滚动，可以设置eventPassthrough为 horizontal）
  },
  mounted() {
    //需保证在数据渲染请求完毕再作处理
    this.$nextTick(() => {
      this._initScroll();
    });
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BSroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        eventPassthrough: this.eventPassthrough
      });
      //是否需要监听滚动事件
      if (this.listenScroll) {
        this.scroll.on("scroll", pos => {
          this.$emit("scroll", pos);
        });
      }
      //是否支持上拉加载
      if (this.pullup) {
        this.scroll.on("scrollEnd", () => {
          //判断是否滚动到了底部
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit("scrollToEnd");
          }
        });
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pulldown) {
        this.scroll.on("touchend", pos => {
          // 下拉动作
          if (pos.y > 50) {
            this.$emit("pulldown");
          }
        });
      }
      // 在触发滚动之前派发事件，这里主要用于用户体验优化
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll');
        });
      }
    },
    //代理better-scroll本身的一些方法:
    //enable 启用 better-scroll, 默认 开启
    enable(){
      this.scroll && this.scroll.enable()
    },
    //disable 禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应
    disable(){
      this.scroll && this.scroll.disable()
    },
    //refresh 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
    refresh() {
        this.scroll && this.scroll.refresh();
      },
     //scrollTo(x, y, time, easing) 滚动到指定的位置
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      /**scrollToElement(el, time, offsetX, offsetY, easing)
       * 参数：
        {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
        {Number} time 滚动动画执行的时长（单位 ms）
        {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
        {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
        {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
        返回值：无
        作用：滚动到指定的目标元素。
       */
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
  },
  watch:{
    //监听数据的改变以重新计算滚动高度
    data(){
      //需设置延时在所有的dom渲染及动画完毕后开始重绘
      setTimeout(()=>{
        this.refresh()
      },this.refreshDelay)
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
