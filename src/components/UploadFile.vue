<template>
  <el-card class="box-card" style="height: 99%;overflow: auto">
    <div slot="header" class="clearfix">
      <span>上传公共文件</span>
      <el-button style="float: right; margin-top: 10px;" 
      v-if="!isUploading"
      type="primary" 
      size="size" 
      @click="handleUploadFile"
      >提交</el-button>
      <el-button style="float: right; margin-top: 10px;" 
      v-else
      type="primary" 
      size="size" 
      @click="handleUploadFile"
      :loading="isUploading"
      >提交</el-button>
      <el-progress
        v-if="percentage"
        style="float: right;margin-right: 20px"
        type="circle"
        :width="60"
        :percentage="parseFloat(percentage).toFixed(1)"
      ></el-progress>
    </div>
    <el-form
      :model="publicFileInfo"
      ref="ruleForm"
      label-width="100px"
      style="height: 100%; overflow: auto"
      class="demo-ruleForm"
    >
      <el-form-item label="文件名称：" prop="n_name" style="width: 60%">
        <el-input
          v-model="publicFileInfo.n_name"
          :maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item label="文件描述：" prop="f_description">
        <el-input
          type="textarea"
          v-model="publicFileInfo.f_description"
          :maxlength="2500"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item label="文件封面：" prop="local_preview_url">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-change="handlePreviewImage"
          :http-request="httpRequest"
        >
          <img
            v-if="publicFileInfo.local_preview_url"
            :src="publicFileInfo.local_preview_url"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="上传文件：" prop="mFile">
        <el-upload
          action=""
          :on-change="handleFile"
          :file-list="publicFileInfo.mFile"
          :auto-upload="false"
        >
          <div>
            <el-button slot="trigger" size="mini" type="primary"
              >选取文件</el-button
            >
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import SparkMD5 from "spark-md5";
export default {
  name: "UploadFile",
  data() {
    return {
      // 公共文件部分重要字段信息
      publicFileInfo: {
        // 文件名
        n_name: "",
        // 文件描述
        f_description: "",
        // 文件实体(elementui组件中的file类)
        mFile: [],
        // 文件封面blob实体
        mPreview: [],
        // 为图片生成本地url用于预览
        local_preview_url: "",
        // 文件md5
        md5_val: "",
      },
      percentage: 0,
      isUploading: false,
    };
  },
  methods: {
    handleFile(file, fileList) {
      this.publicFileInfo.mFile[0] = file;
    },
    httpRequest() {
      // 没有任何作用 就是用来覆盖默认上传
    },
    handlePreviewImage(file, fileList) {
      console.log(fileList);
      if (file.size > 1024 * 1024 * 2) {
        this.$message.warning("封面大小应限制在2MB以内！");
        return false;
      }
      if (file.raw.type !== "image/jpeg") {
        this.$message.warning("封面只应该为jpg格式！");
        return false;
      }
      this.publicFileInfo.local_preview_url = window.URL.createObjectURL(
        file.raw
      );
      this.publicFileInfo.mPreview[0] = file;
    },
    handleUploadFile() {
      this.isUploading = true;
      let file_chunk_arr = [];
      let md5_val = "";
      let chunk_md5_arr = [];
      const std_chunk_size = 1024 * 1024 * 5;
      const fileSize = this.publicFileInfo.mFile[0].size;
      const fileName = this.publicFileInfo.mFile[0].name;
      const file = this.publicFileInfo.mFile[0].raw;
      console.log(this.publicFileInfo.mFile[0].raw);
      const total = Math.ceil(fileSize / std_chunk_size);

      const fr = new FileReader();
      // 文件分片
      let start = 0;
      let end = 0;
      const loadFile = () => {
        end = start + std_chunk_size;
        if (end > fileSize) end = fileSize;
        const chunk = file.slice(start, end);
        start = end;
        file_chunk_arr.push(chunk);
        fr.readAsArrayBuffer(chunk);
        if (start >= fileSize) return;
      };
      loadFile();
      let spark = new SparkMD5.ArrayBuffer();
      // 计算MD5
      fr.onload = (e) => {
        if (chunk_md5_arr.length < total) {
          spark.append(e.target.result);
          chunk_md5_arr.push(SparkMD5.ArrayBuffer.hash(e.target.result));
          loadFile();
        } else {
          fr.abort();
          // 开始上传
          md5_val = spark.end();
          const upload = (i) => {
            if (i >= total) return;
            // 表单模板
            // 填写表单数据
            const fileChunk = {
              id: md5_val,
              md5_val: chunk_md5_arr[i],
              chunk_size: file_chunk_arr[i].size,
              number: i,
              total: total,
              f_description: this.publicFileInfo.f_description,
              mFile: null,
              mPreview: null,
              original_file_name: fileName,
              n_name: this.publicFileInfo.n_name,
              std_chunk_size: std_chunk_size,
              suffix: fileName.substr(fileName.lastIndexOf(".")),
              public_file: true,
            };
            this.$http({
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              method: "POST",
              url: "/public/checkFile",
              data: fileChunk,
            }).then((res) => {
              if (res.status === 200) {
                if (res.data.msg === "commonUpload") {
                  fileChunk.mFile = file_chunk_arr[i];
                  if (i === total - 1)
                    fileChunk.mPreview = this.publicFileInfo.mPreview[0].raw;
                  this.$http({
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    method: "POST",
                    url: "/public/commonUpload",
                    onUploadProgress: (progressEvent) => {
                      // 表单数据大小
                      let formSize =
                        progressEvent.total - file_chunk_arr[i].size;
                      // 先前已上传的总大小
                      let loaded = std_chunk_size * i + progressEvent.loaded;
                      // 总共的大小
                      let totalSize = file.size + formSize * total;
                      // 剩余的大小
                      // let last = totalSize - loaded;
                      this.percentage = (loaded / totalSize) * 100;
                    },
                    data: fileChunk,
                  }).then((res) => {
                    if (res.data.msg === "uploadComplete") {
                      this.$refs.ruleForm.resetFields();
                      this.percentage = 0;
                      this.isUploading = false;
                      this.$message({
                        type: "success",
                        message: "上传完成!",
                      });
                    } else if (res.data.msg === "uploadChunkComplete") {
                      upload(i + 1);
                    } else {
                      this.$message({
                        type: "error",
                        message: "未知错误!",
                      });
                      this.isUploading = false;
                    }
                  });
                } else if (res.data.msg === "quickUpload") {
                  if (i === total - 1)
                    fileChunk.mPreview = this.publicFileInfo.mPreview[0].raw;
                  this.$http({
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    method: "POST",
                    url: "/public/quickUpload",
                    onUploadProgress: () => {
                      this.percentage = (i / total) * 100;
                    },
                    data: fileChunk,
                  }).then((res) => {
                    // 全部上传完成
                    if (res.data.msg === "uploadComplete") {
                      // 清空表单
                      this.$refs.ruleForm.resetFields();
                      this.percentage = 0;
                      this.isUploading = false;
                      this.$message({
                        type: "success",
                        message: "上传完成!",
                      });
                    } else if (res.data.msg === "uploadChunkComplete") {
                      upload(i + 1);
                    } else {
                      this.$message({
                        type: "error",
                        message: "未知错误!",
                      });
                      this.$forceUpdate();
                      this.isUploading = false;
                    }
                  });
                }
              } else if (res.data.msg === "fileNameRepetitive") {
                this.$message({
                  type: "warning",
                  message: "当前目录下有重名文件!",
                });
                this.isUploading = false;

              } else {
                this.$message({
                  type: "error",
                  message: "未知错误!",
                });
                this.isUploading = false;
                return;
              }
            });
          };
          upload(0);
        }
      };
    },
  },
  mounted() {},
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  /*overflow: hidden;*/
}
i.el-icon-plus.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 6px;
  border: 2px dashed;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  margin-left: 5px;
  width: 99%;
}
</style>
