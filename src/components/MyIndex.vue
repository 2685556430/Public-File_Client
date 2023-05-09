<template>
  <el-container class="shadow-container" style="height: 96%">
    <el-header height="60px">
    <TabPane></TabPane>
    </el-header>
    <el-main style="height: 100%">
      <Main></Main>
    </el-main>
  </el-container>
</template>

<style scoped>
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  width: 100%;
  height: 100%;
}
</style>

<script scoped>
import Main from "./Main.vue"
import TabPane from "./TabPane.vue"
// import CanvasNest from "../js/canvas-nest.js";
export default {
  name: "MyIndex",
  components: {
    Main,
    TabPane
  },
};
</script>
