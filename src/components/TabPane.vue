<template>
  <el-container class="shadow-container">
    <div style="margin-left: 10px">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
      >
        <el-menu-item index="1"
          ><router-link to="/myIndex/publicFileList"
            >公共文件管理
          </router-link></el-menu-item
        >

        <el-menu-item index="2"
          ><router-link to="/myIndex/uploadFile">添加公共文件 </router-link>
        </el-menu-item>
      </el-menu>
    </div>
  </el-container>
</template>

<script>
export default {
  name: "TabPane",
  data() {
    return {
      activeIndex: "1",
    };
  },
};
</script>

<style scope>
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background-color: white;
}
.router-link-active {
  text-decoration: none;
  display: inline-block;
}

a {
  text-decoration: none;
  display: inline-block;
}
</style>
