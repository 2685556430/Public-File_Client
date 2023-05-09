<template>
    <el-container class="login login-wrap shadow-container">
      <el-row type="flex" justify="center">
        <el-form
          ref="loginForm"
          :model="userInfo"
          status-icon
          label-width="80px"
        >
          <h3>登录</h3>
          <hr />
          <el-form-item prop="username" label="用户名">
            <el-input
              v-model="userInfo.u_name"
              placeholder="请输入用户名"
              prefix-icon
              required
            ></el-input>
          </el-form-item>
          <el-form-item id="password" prop="password" label="密码">
            <el-input
              v-model="userInfo.u_password"
              show-password
              placeholder="请输入密码"
              required
            ></el-input>
          </el-form-item>
          <router-link to="/">找回密码</router-link>&ensp;
          <router-link to="/registry">注册账号</router-link>

          <el-form-item>
            <el-button type="primary" icon="el-icon-upload" @click="doLogin()"
              >登 录</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-container>
</template>

<script scoped>
import MD5 from "../js/md5.js";
// import CanvasNest from "../js/canvas-nest.js";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      userInfo: {
        u_name: "",
        u_password: "",
      },
    };
  },
  methods: {
    doLogin() {
      if (
        this.userInfo.u_name.length === 0 ||
        this.userInfo.u_password.length === 0
      ) {
        this.$message({
          type: "warning",
          message: "请填写必要信息!",
        });
        return;
      }
      this.userInfo.u_password = MD5(this.userInfo.u_password)
      this.$http({
        method: "POST",
        url: "/login",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: this.userInfo,
      }).then((response) => {
        if(response.status===200) {
          if(response.data.msg === "loginSuccess") {
            this.$message({
                type: "success",
                message: "欢迎！"
            })
            // 把token存入本地存储
            localStorage.setItem("token", response.headers.token);
            this.$router.push("/myIndex/publicFileList");
          }
          else{
            this.$message({
              type: 'error',
              message: "登录信息错误,请检查用户名或密码"
            });
            this.userInfo.u_name = '';
            this.userInfo.u_password = '';
          }
        }
        else{
            this.$message({
                type: "error",
                message: "未知错误！"
            })
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 750px;
  /* background: url("../assets/images/bg1.png") no-repeat; */
  background-size: cover;
  overflow: hidden;
  margin-top: -100px;
}
.login-wrap {
  /*background: url("../assets/images/login_bg.png") no-repeat;*/
  background-size: cover;
  width: 400px;
  height: 400px;
  margin: 215px auto;
  margin-top: 150px;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
}
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
.el-row{
  margin-left: 40px;
}
#password {
  margin-bottom: 5px;
}
h3 {
  color: #0babeab8;
  font-size: 24px;
}
hr {
  background-color: #444;
  margin: 20px auto;
}
a {
  text-decoration: none;
  color: #aaa;
  font-size: 15px;
}
a:hover {
  color: coral;
}
.el-button {
  width: 80%;
  margin-top: 30px;
}
</style>
