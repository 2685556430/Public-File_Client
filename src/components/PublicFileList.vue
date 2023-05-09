<template>
  <el-container class="is-vertical" style="height: 100%">
    <el-main style="height: 100%; overflow: hidden">
        <el-table
          :data="tableData"
          ref="refTable"
          style="width: 100%;"
          height="100%"
          :expand-change="expandChange"
        >
          <el-table-column width="55" prop="preview_url">
            <template slot-scope="props">
              <div class="image-container">
                <img :src="props.row.preview_url" />
              </div>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="table-expand">
                <div class="table-expand-content">
                  <div class="table-expand-info">
                    <p class="table-expand-label">文件 ID：</p>
                    <p class="table-expand-value">{{ props.row.fid }}</p>
                  </div>

                  <div class="table-expand-info">
                    <p class="table-expand-label">文件名称：</p>
                    <el-input
                      class="table-expand-value"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="props.row.n_name"
                      :maxlength="50"
                      show-word-limit
                    >
                    </el-input>
                  </div>

                  <div class="table-expand-info">
                    <p class="table-expand-label">文件描述：</p>
                    <el-input
                      class="table-expand-value"
                      type="textarea"
                      :rows="2"
                      :auto-upload="false"
                      v-model="props.row.f_description"
                      :maxlength="2500"
                      show-word-limit
                    >
                    </el-input>
                  </div>

                  <div class="table-expand-info">
                    <p class="table-expand-label">上传时间：</p>
                    <p class="table-expand-value">
                      {{ props.row.upload_date }}
                    </p>
                  </div>
                </div>
                <div class="table-expand-content">
                  <div class="table-expand-info">
                    <p class="table-expand-label">文件封面(点击可替换)：</p>
                    <el-upload
                      class="avatar-uploader"
                      action=""
                      :show-file-list="false"
                      :on-change="
                        (
                          file,
                          fileList,
                          index = tableData.findIndex(
                            (item) => item.fid === props.row.fid
                          )
                        ) => replacePreviewImage(file, fileList, index)
                      "
                    >
                      <img
                        v-if="props.row.preview_url"
                        :src="props.row.preview_url"
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                </div>
                <div class="table-expand-content">
                  <el-button
                    type="success"
                    size="small"
                    @click="handleSave(props.row)"
                    >保存修改</el-button
                  >
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="文件名称"
            prop="n_name"
            width="200"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="上传时间" prop="upload_date" width="300">
          </el-table-column>
          <el-table-column
            label="文件描述"
            prop="f_description"
            width="450"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="" prop="" style="width: 100%" align="right">
            <template slot="header" slot-scope="props">
              <el-input
                v-model="search"
                size="mini"
                @keyup.enter.native="getPublicFileList(1)"
                placeholder="输入关键字搜索"
              >
                <el-button
                  type="primary"
                  slot="append"
                  icon="el-icon-search"
                  @click="getPublicFileList(1)"
                ></el-button>
              </el-input>
            </template>
            <template slot-scope="props">
              <!-- <el-button
              type="primary"
              size="mini"
              @click="
                handleEdit(props.row);
                isEditing[
                  tableData.findIndex((item) => item.fid === props.row.fid)
                ] ^= 1;
              "
              v-if="
                isEditing[
                  tableData.findIndex((item) => item.fid === props.row.fid)
                ] === 0
              "
              >编辑</el-button
            > -->
              <el-button
                type="danger"
                size="mini"
                @click="handleDelete(props.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
    </el-main>
    <el-footer style="margin-top: 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total * 10"
        :current-page.sync="page.index"
        @current-change="getPublicFileList"
        style="text-align: center; margin-top: 10px"
      >
      </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "PublicFileList",
  data() {
    return {
      search: "",
      page: {
        index: 1, // 当前页标
        size: 7, // 一页展示七个
        total: 1,
      },
      tableData: [],
      isEditing: [],
      preview_image_list: [],
    };
  },
  methods: {
    expandChange(row, expanded) {
      console.log(expanded);
      this.$refs.refTable.toggleRowExpansion(row);
    },
    getPublicFileList(index) {
      console.log(index);
      this.$http({
        method: "POST",
        url: "/public/getPublicFileList",
        params: {
          index: index,
          count: this.page.size,
          search: this.search,
        },
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.msg === "getPublicFileListSuccess") {
            res.data.data.publicFileList.forEach((element) => {
              this.$set(element, "preview_image", null);
            });
            this.tableData = res.data.data.publicFileList;
            this.isEditing = new Array(this.tableData.length).fill(0);
            this.page.index = res.data.data.currentPage;
            this.page.total = res.data.data.totalPages;
            this.page.size = res.data.data.showNumber;
          } else {
            this.$message({
              type: "error",
              message: "拉取失败！",
            });
          }
        }
      });
    },
    handleUploadFile() {},
    replacePreviewImage(file, fileList, index) {
      this.tableData[index].preview_image = file.raw;
      this.tableData[index].preview_url = window.URL.createObjectURL(file.raw);
      console.log(this.tableData);
    },
    handleEdit(rowData) {
      this.$refs.refTable.toggleRowExpansion(rowData);
    },
    handleSave(rowData) {

      console.log(rowData);
      this.$http({
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: "/public/updatePublicFileInfo",
        data: rowData,
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.msg === "updatePublicFileInfoSuccess") {
            this.getPublicFileList(this.page.index);
            this.$message({
              type: "success",
              message: "保存成功！",
            });
          }
        }
      });
      this.$refs.refTable.toggleRowExpansion(rowData);
    },
    handleDelete(rowData) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          url: "/public/deletePublicFile",
          params: { fid: rowData.fid },
        }).then((res) => {
          if (res.status === 200) {
            if (res.data.msg === "deletePublicFileSuccess") {
              this.getPublicFileList(1);
              this.$message({
                type: "success",
                message: "删除成功！",
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "未知错误！",
            });
          }
        });
      });
    },
  },
  mounted() {
    this.getPublicFileList(1);
    this.preview_image_list = [
      [{ name: this.tableData[0].n_name, url: this.tableData[0].preview_url }],
      [{ name: this.tableData[1].n_name, url: this.tableData[1].preview_url }],
      [{ name: this.tableData[2].n_name, url: this.tableData[2].preview_url }],
      [{ name: this.tableData[3].n_name, url: this.tableData[3].preview_url }],
      [{ name: this.tableData[4].n_name, url: this.tableData[4].preview_url }],
    ];
  },
};
</script>

<style scoped>
.table-expand {
  display: flex;
  align-items: center;
}
.preview-image {
  object-fit: contain;
  max-width: 400px;
  max-height: 200px;
  margin-right: 20px;
}
.table-expand-content {
  display: flex;
  flex-direction: column;
  margin-left: 150px;
}
.table-expand-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.table-expand-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.table-expand-info {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.table-expand-label {
  font-size: 14px;
  color: #999;
  margin-right: 10px;
}
.table-expand-value {
  font-size: 14px;
  color: #333;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
.el-tooltip__popper {
  max-width: 300px;
}
.image-container {
  width: 35px;
  height: 35px;
  overflow: hidden;
  border-radius: 5px;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.el-footer {
  text-align: center;
  line-height: 10px;
}
</style>
