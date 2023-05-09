import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import router from "./router/index";
import ElementUi from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(ElementUi);

// 添加全局axios
Vue.prototype.$http = axios;
axios.defaults.baseURL = "http://127.0.0.1:8999";
//axios.defaults.baseURL = "http://120.48.54.164:8999";
axios.defaults.withCredentials = true;
// 配置axios拦截器
axios.interceptors.request.use((config) => {
  // 取出放在浏览器存储中的token
  let token = localStorage.getItem("token");
  if (token) {
    // 每次请求都在请求头携带token
    config.headers["token"] = token;
  }
  // 返回配置项
  return config;
});

new Vue({
  render: h => h(App),
  router: router,
  created() {
    axios.interceptors.response.use(
      (response) => {
        // 响应成功该做的事儿
        // 将后端返回的信息转对象
        if (response.headers.data) {
          let data = JSON.parse(response.headers.data);
          if (data.msg === "invalidToken") {
            console.log("token验证失败");
            this.$router.push("/login");
            this.$message({
              type: "error",
              message: "登录失效!",
            });
          }
        }
        return response;
      },
      (error) => {
        console.log(error.response);
        // 响应失败该做的事儿
        return Promise.reject(error);
      }
    );
  },
}).$mount('#app')
