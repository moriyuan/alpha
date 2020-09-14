<template>
  <section class="container">
    <div>
      <!-- <app-logo/> -->
      <img src="../static/logo.svg">
      <h1 class="title">
        <strong>量化因子评价系统</strong>
      </h1>
      <h2 class="subtitle">
        alpha-evaluation-system
      </h2>
      <div class="links">
        <a href="/upload">
          <el-button type="primary" class="enter-btn"><strong>评测因子</strong></el-button>
        </a>
        <a href="/factorList">
          <el-button type="primary" class="enter-btn"><strong>因子列表</strong></el-button>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  components: {
    AppLogo
  }
}
</script>

<style>

img {
  width: 60%;
  max-height: 200px;
}

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #E9EEF3;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 55px;
  color: #21305e; /*#35495e;*/
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 40px;
  color: #21305e;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.enter-btn {
  width: 10%;
  height: 10%;
  margin: 4% 1.5%;
  background-color: #19539b;
  border: 0px;
}

</style>
