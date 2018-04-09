<template>
  <div class="discussion-wrapper">
      <div class="fixed-title">
          <span class="back" @click="back">
              <i class="icon-back"></i>
          </span>
          <span class="type">{{title}}</span>
          <span class="to-top" @click="toTop">
              <i class="icon-circle-up"></i>
          </span>
      </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  methods:{
      back(){
          this.$router.back()
      },
      toTop(){
          this.$refs.scroll.scrollTo(0,0,200)
      }
  }
}
</script>
<style lang="stylus" scoped>

</style>


