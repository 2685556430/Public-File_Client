<template>
  <el-container class="is-vertical" style="height: 100%">
    <el-main style="height: 100%; overflow: hidden">
      <el-radio-group style="float:right; margin-top: -20px;" v-model="radio">
        <el-radio border size="small" :label="0"><strong>只看待审核</strong></el-radio>
        <el-radio border size="small" :label="1"><strong>只看审核已通过</strong></el-radio>
        <el-radio border size="small" :label="2"><strong>只看审核未通过</strong></el-radio>
        <el-radio border size="small" :label="3"><strong>默认</strong></el-radio>
      </el-radio-group>
      <el-table
          :data="tableData.filter(item=>{ return ((radio === 3)||(item.state === radio))
          && (!search || item.publicFile.f_name.toLowerCase().includes(search.toLowerCase()))})"
          ref="refTable"
          style="width: 100%;"
          height="100%"
          :default-sort="{ prop: 'tid' }"
          :cell-style="{'text-align':'center'}"
          :header-cell-style="{'text-align':'center'}"
          :row-class-name="tableRowClassName">
          :expand-change="expandChange"
      >
        <el-table-column width="55" prop="publicFile.preview_url">
          <template slot-scope="props">
            <div class="image-container">
              <img :src="props.row.publicFile.preview_url" />
            </div>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="table-expand">
              <div class="table-expand-content">
                <div class="table-expand-info">
                  <p class="table-expand-label">文件 ID：</p>
                  <p class="table-expand-value">{{ props.row.publicFile.fid }}</p>
                </div>

                <div class="table-expand-info">
                  <p class="table-expand-label">文件名称：</p>
                  <el-input
                      class="table-expand-value"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="props.row.publicFile.n_name"
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
                      v-model="props.row.publicFile.f_description"
                      :maxlength="2500"
                      show-word-limit
                  >
                  </el-input>
                </div>

                <div class="table-expand-info">
                  <p class="table-expand-label">建议：</p>
                  <el-input
                      style="width: 400px;"
                      class="table-expand-value"
                      type="textarea"
                      :rows="2"
                      :auto-upload="false"
                      v-model="props.row.suggestion"
                      :maxlength="500"
                      show-word-limit
                  >
                  </el-input>
                </div>

                <div class="table-expand-info">
                  <p class="table-expand-label">是否可见：</p>
                  <!--                    <el-input-->
                  <!--                        class="table-expand-value"-->
                  <!--                        type="textarea"-->
                  <!--                        :rows="2"-->
                  <!--                        :auto-upload="false"-->
                  <!--                        v-model="props.row.f_description"-->
                  <!--                        :maxlength="2500"-->
                  <!--                        show-word-limit-->
                  <!--                    >-->
                  <!--                    </el-input>-->
                  <el-switch
                      class="table-expand-value"
                      v-model="props.row.publicFile.visible"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                  </el-switch>
                </div>

                <div class="table-expand-info">
                  <p class="table-expand-label">上传时间：</p>
                  <p class="table-expand-value">
                    {{ props.row.publicFile.upload_date }}
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
                            (item) => item.publicFile.fid === props.row.publicFile.fid
                          )
                        ) => replacePreviewImage(file, fileList, index)
                      "
                  >
                    <img
                        v-if="props.row.publicFile.preview_url"
                        :src="props.row.publicFile.preview_url"
                        class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </div>
              <div class="table-expand-content" style="display: inline-block;">
                <el-button
                    style="margin-left: 20px;display: inline-block;"
                    type="success"
                    size="small"
                    @click="handleSave(props.row, 1)"
                >审核通过</el-button>
                <el-button
                    style="margin-left: 20px;display: inline-block;"
                    type="warning"
                    size="small"
                    @click="handleSave(props.row, 2)"
                >不予通过</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="文件名称"
            prop="publicFile.n_name"
            width="300"
            sortable
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="上传时间" prop="publicFile.upload_date" sortable width="300">
        </el-table-column>
        <el-table-column
            label="文件描述"
            prop="publicFile.f_description"
            width="550"
            :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column
            label="审核状态"
            prop="state"
            sortable
            width="250"
            :show-overflow-tooltip="true"

        >
          <template slot-scope="scope">
            <div>
              <div>
                <svg v-if="scope.row.state === 2" t="1683728743894" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7598" width="30" height="30"><path d="M513.202819 976.047612a464.1278 464.1278 0 1 1 465.090055-463.967424 465.090055 465.090055 0 0 1-465.090055 463.967424zM513.202819 112.263117a400.137823 400.137823 0 1 0 400.939703 400.939702A400.939702 400.939702 0 0 0 513.202819 112.263117z" p-id="7599" fill="#d81e06"></path><path d="M481.288019 608.786844v-320.751762H545.277995v320.751762zM481.127643 673.5787h64.150352v64.150352h-64.150352z" p-id="7600" fill="#d81e06"></path></svg>
                <svg v-if="scope.row.state === 0" t="1683729029330" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8698" width="30" height="30"><path d="M469.2 350.1C414 376.4 370.3 421.7 346 477.8c-7 16.2 0.5 35.1 16.7 42.1 4.1 1.8 8.4 2.6 12.7 2.6 12.4 0 24.2-7.2 29.4-19.3 18.1-41.9 50.8-75.7 92-95.4 16-7.6 22.7-26.7 15.1-42.6C504.3 349.3 485.2 342.5 469.2 350.1z" p-id="8699" fill="#1296db"></path><path d="M797.6 545.8c-17.7 0-32 14.3-32 32 0 103.7-84.4 188.1-188.1 188.1-17.7 0-32 14.3-32 32s14.3 32 32 32c67.3 0 130.6-26.2 178.2-73.8 47.6-47.6 73.8-110.9 73.8-178.2C829.6 560.1 815.3 545.8 797.6 545.8z" p-id="8700" fill="#1296db"></path><path d="M1014.6 968.4 869.4 823.2c24.9-29.5 45.1-62.3 60.2-97.9 20-47.3 30.2-97.6 30.2-149.4s-10.2-102.1-30.2-149.4c-19.3-45.7-47-86.8-82.3-122-35.2-35.2-76.3-62.9-122-82.3-47.3-20-97.6-30.2-149.4-30.2s-102.1 10.2-149.4 30.2c-45.7 19.3-86.8 47-122 82.3-35.2 35.2-62.9 76.3-82.3 122-20 47.3-30.2 97.6-30.2 149.4s10.2 102.1 30.2 149.4c19.3 45.7 47 86.8 82.3 122 35.2 35.2 76.3 62.9 122 82.3 47.3 20 97.6 30.2 149.4 30.2s102.1-10.2 149.4-30.2c36.1-15.3 69.2-35.7 98.9-61l145.2 145.2c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4C1027.1 1001.2 1027.1 980.9 1014.6 968.4zM575.9 895.7C399.5 895.7 256 752.2 256 575.8s143.5-319.9 319.9-319.9 319.9 143.5 319.9 319.9S752.2 895.7 575.9 895.7z" p-id="8701" fill="#1296db"></path><path d="M319 960 140 960c-41.9 0-76-34.1-76-76l0-744c0-41.9 34.1-76 76-76l680 0c41.9 0 76 34.1 76 76l0 92.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-92.7c0-77.2-62.8-140-140-140L140 0c-77.2 0-140 62.8-140 140l0 744c0 77.2 62.8 140 140 140l179 0c17.7 0 32-14.3 32-32S336.7 960 319 960z" p-id="8702" fill="#1296db"></path></svg>

                <svg v-if="scope.row.state === 1" t="1683728662357" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5768" width="30" height="30"><path d="M848.213333 938.666667H170.666667c-22.186667 0-39.253333-17.066667-39.253334-39.253334V129.706667c0-22.186667 17.066667-39.253333 39.253334-39.253334h88.746666V114.346667c0 18.773333 15.36 34.133333 34.133334 34.133333h431.786666c18.773333 0 34.133333-15.36 34.133334-34.133333V90.453333h88.746666c22.186667 0 39.253333 17.066667 39.253334 39.253334v769.706666c0 22.186667-17.066667 39.253333-39.253334 39.253334z m-672.426666-44.373334h667.306666V134.826667H802.133333c-8.533333 32.426667-39.253333 58.026667-75.093333 58.026666H293.546667c-35.84 0-66.56-23.893333-75.093334-58.026666h-42.666666v759.466666z" p-id="5769" fill="#05ac2d"></path><path d="M718.506667 129.706667H300.373333c-11.946667 0-22.186667-10.24-22.186666-22.186667 0-11.946667 10.24-22.186667 22.186666-22.186667h418.133334c11.946667 0 22.186667 10.24 22.186666 22.186667 0 11.946667-10.24 22.186667-22.186666 22.186667z" p-id="5770" fill="#05ac2d"></path><path d="M778.24 382.293333L481.28 677.546667c-8.533333 8.533333-22.186667 8.533333-30.72 0s-8.533333-22.186667 0-30.72l295.253333-295.253334c8.533333-8.533333 22.186667-8.533333 30.72 0 10.24 8.533333 10.24 22.186667 1.706667 30.72z" fill="#05ac2d" p-id="5771"></path><path d="M450.56 677.546667l-158.72-158.72c-8.533333-8.533333-8.533333-22.186667 0-30.72s22.186667-8.533333 30.72 0l158.72 158.72c8.533333 8.533333 8.533333 22.186667 0 30.72s-22.186667 8.533333-30.72 0z" fill="#05ac2d" p-id="5772"></path></svg>
              </div>
              <span v-if="scope.row.state === 2">已审核：未通过</span>
              <span v-if="scope.row.state === 0">待审核</span>
              <span v-if="scope.row.state === 1">已审核：通过</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="" prop=""  align="right">
          <template slot="header" slot-scope="props">
            <el-input
                v-model="search"
                size="mini"
                @keyup.enter.native="getPublicFileTaskList"
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
  </el-container>

</template>

<script>
export default {
  name: "PublicFileTask",
  data(){
    return{
      search: "",
      tableData: [],
      isEditing: [],
      preview_image_list: [],
      radio: 3
    }
  },
  methods:{
    expandChange(row, expanded) {
      console.log(expanded);
      this.$refs.refTable.toggleRowExpansion(row);
    },
    getPublicFileTaskList() {
      this.$http({
        method: "POST",
        url: "/task/getPublicFileTask",
      }).then((res) => {
        if (res.status === 200) {
            this.tableData = res.data.data;
            this.tableData['suggestion'] = '';
          }
        else {
            this.$message({
              type: "error",
              message: "拉取失败！",
            });
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
    handleSave(rowData, pass) {
      const publicFileTask = {
        tid: rowData.tid,
        uid: rowData.uid,
        fid: rowData.fid,
        state: pass,
        suggestion: rowData.suggestion,
      }
      publicFileTask['publicFile.fid'] = rowData.publicFile.fid
      publicFileTask['publicFile.f_name'] = rowData.publicFile.f_name
      publicFileTask['publicFile.n_name'] = rowData.publicFile.n_name
      publicFileTask['publicFile.score'] = rowData.publicFile.score
      publicFileTask['publicFile.hot'] = rowData.publicFile.hot
      publicFileTask['publicFile.f_size'] = rowData.publicFile.f_size
      publicFileTask['publicFile.f_description'] = rowData.publicFile.f_description
      publicFileTask['publicFile.upload_date'] = rowData.publicFile.upload_date
      publicFileTask['publicFile.preview_url'] = rowData.publicFile.preview_url
      publicFileTask['publicFile.state'] = rowData.publicFile.state
      publicFileTask['publicFile.visible'] = rowData.publicFile.visible

      console.log(rowData);
      this.$http({
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: "/task/updateTask",
        data: publicFileTask,
      }).then((res) => {
        if (res.status === 200 && res.data.status) {
            this.getPublicFileTaskList();
            this.$message({
              type: "success",
              message: "审批成功！",
            });
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
    tableRowClassName({row, rowIndex}) {
      if (row.state === 0) {
        return 'warning-row';
      } else if (row.state === 2) {
        return 'error-row';
      }
      else{
        return 'success-row';
      }
    },
  },
  mounted() {
    this.getPublicFileTaskList()
  }
}
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
  width: 150px;
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
/deep/ .el-table .warning-row {
  background: #e6f8fd;
}

/deep/ .el-table .success-row {
  background: #f0f9eb;
}

/deep/ .el-table .error-row {
  background: #fde7e7;
}
</style>