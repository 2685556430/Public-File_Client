const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 如果 transpileDependencies 为false,则会把node_modules里用到的高级语法原封不动的打包，会造成在低级浏览器访问报错的情况。
  transpileDependencies: true,
  devServer:{
	port: 8080 // 修改默认端口
  },
  lintOnSave: false // 取消eslint验证
})