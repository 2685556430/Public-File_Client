import Login from "@/components/Login.vue";
import MyIndex from "@/components/MyIndex.vue";
import VueRouter from "vue-router";
import PublicFileList from "@/components/PublicFileList.vue";
import UploadFile from "@/components/UploadFile.vue";
import { Main } from "element-ui";

export default new VueRouter({
  routes: [
    // 配置路由项
    {
      name: "login",
      path: "/login",
      component: Login,
    },
    {
      path: "/",
      component: MyIndex,
      children: [
        {
          path: "",
          component: PublicFileList,
        },
      ],
    },
    {
      name: "myIndex",
      path: "/myIndex",
      component: MyIndex,
      children: [
        {
          name: "publicFileList",
          path: "publicFileList",
          component: PublicFileList,
        },
        {
          name: "uploadFile",
          path: "uploadFile",
          component: UploadFile,
        },
      ],
    },
  ],
});
