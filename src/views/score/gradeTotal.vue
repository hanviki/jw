<template>
  <div>
    <h4 class="title"><router-link to="/home"><span>首页</span></router-link><i class="el-icon-arrow-right"></i>评分汇总管理</h4>
    <el-row class="search">
      <el-col>
        <el-form
          label-width="100px"
          show-overflow-tooltip="true"
        >
          <el-col :span="6">
            <el-form-item label="所属岗位">
              <PostList
                @childSelectDepartment="getSelectStation"
                :selectedOptions="fullstationcode"
              ></PostList>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工姓名">
              <el-input
                placeholder="请输入员工姓名"
                v-model="search.username"
                clearable
                @keyup.enter.native="getList"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="月结状态">
              <el-select
                v-model="search.state"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in quarterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="24"
            class="edit-btn"
          >
            <el-form-item>
              <el-button
                style="margin-left:-90px;"
                type="primary"
                @click="searchList"
                :loading="searchLoading"
              >搜索</el-button>
              <el-button
                type="warning"
                @click="exportExcel"
              ><i class="icon iconfont icon-daochu-tianchong"></i>导出excel</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="content">
      <el-col style="margin-bottom:20px;">
        <el-button
          type="primary"
          @click="updateGrade"
        >批量修改月结评分</el-button>
        <el-button
          type="primary"
          @click="gradeFinish"
        >批量修改月结评分完成</el-button>
        <el-button
          type="warning"
          @click="gradeAllFinish"
        >全部月结评分完成</el-button>
        <!-- <el-button type="danger">汇总</el-button> -->
      </el-col>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="tableLoading"
        @selection-change="changeFun"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户姓名"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="moneycard"
          label="发薪号"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="departmentname"
          label="所属部门"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="stationname"
          label="所属岗位"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="月结状态"
          prop="statename"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="A"
          prop="aScore"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="B"
          prop="bScore"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="C"
          prop="cScore"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="D"
          prop="dScore"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="总分"
          prop="totalScore"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="修改状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="openStatus(scope.row)"
              type="text"
              size="small"
            >修改</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="月结修改/查看"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="openAdd(scope.row)"
              type="text"
              size="small"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-row>
    <!-- 添加月结 -->
    <AddQuarter
      :parentForms="forms"
      :dialogVisible="dialogVisible"
      :isAdd="1"
      :type="1"
      @childClose="childClose"
      @childGetList="getList"
    ></AddQuarter>
    <!-- 修改状态 -->
    <el-dialog
      title="修改状态"
      :visible.sync="statusDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-select
        v-model="status"
        placeholder="请选择"
        style="width:100%"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="statusDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateStatus"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PostList from "../common/postList";
import {
  getList,
  updateFinishGradeBySerialNo,
  updateFinishGradeAll
} from "@/api/score/gradeTotal";
import { updateSummaryGradeState } from "@/api/score/quarter";
import { updateStateBySerialNo } from "@/api/user/quarter";
import AddQuarter from "../user/addQuarter";
import qs from "qs";
export default {
  data() {
    return {
      quarterOptions: [
        {
          value: "0",
          label: "未提交"
        },
        {
          value: "1",
          label: "已提交"
        },
        {
          value: "5",
          label: "月结待提交"
        },
        {
          value: "6",
          label: "月结评分"
        },
        {
          value: "7",
          label: "月结评分完成"
        }
      ],
      gradeStatus: [
        {
          value: "1",
          label: "未评分"
        },
        {
          value: "2",
          label: "未完成"
        },
        {
          value: "3",
          label: "已完成"
        }
      ],
      statusOptions: [
        {
          value: "6",
          label: "月结评分"
        },
        {
          value: "7",
          label: "月结评分完成"
        }
      ],
      title: "",
      search: {
        stationcode: "",
        username: "",
        state: ""
      },
      tableData: [],
      stationcode: [""],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      fullstationcode: [""],
      dialogVisible: false,
      tableLoading: true,
      status: "",
      statusDialogVisible: false,
      checkBoxData: [],
      tempStatusRow: {},
      forms: {},
      searchLoading:false,
    };
  },
  components: {
    PostList,
    AddQuarter
  },
  mounted() {},
  created() {
    this.getList();
  },
  methods: {
    handleClose() {
      this.statusDialogVisible = false;
    },
    //初始化
    into() {
      this.page.pageNum = 1;
      this.page.pageSize = 10;
    },
    //设置每页多少条数据
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    //翻页
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getList();
    },
    //搜索
    searchList() {
      this.into();
      this.getList();
    },
    //查询列表
    getList() {
      let params = this.page;
      if (this.search.stationcode.length > 0) {
        params.stationcode = this.search.stationcode[0];
      } else {
        params.stationcode = "";
      }
      params.username = this.search.username;
      params.state = this.search.state;
      params.scorestatus = this.search.scorestatus;
      this.searchLoading = true;
      new Promise((response, reject) => {
        getList(qs.stringify(params))
          .then(response => {
            if (response.data.code == 0) {
              this.tableData = response.data.data;
              this.total = response.data.totalPages;
            } else {
              this.$message({
                message: response.data.msg,
                type: "error"
              });
            }
            this.tableLoading = false;
            this.searchLoading = false;
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    //获取岗位选择
    getSelectStation(data, row) {
      this.search.stationcode = [];
      this.search.stationcode.push(data);
      this.fullstationcode = row;
    },
    //获取选中的值
    changeFun(val) {
      this.checkBoxData = val;
    },
    //关闭月结
    childClose(val) {
      this.dialogVisible = val;
    },
    //打开月结
    openAdd(row) {
      this.forms = {
        serialno: row.serialno,
        title: row.title,
        content: row.content,
        savepath: row.savepath,
        filename: row.filename
      };
      this.dialogVisible = true;
    },
    //打开修改状态
    openStatus(row) {
      this.tempStatusRow = row;
      this.statusDialogVisible = true;
    },
    //修改月结状态
    updateStatus() {
      if (!this.status) {
        this.$message.warning("请选择状态");
        return;
      }
      let params = {
        serialno: this.tempStatusRow.serialno,
        state: this.status
      };
      new Promise((response, reject) => {
        updateStateBySerialNo(qs.stringify(params))
          .then(response => {
            if (response.data.code == 0) {
              this.$message.success(response.data.msg);
              this.getList();
            } else {
              this.$message({
                message: response.data.msg,
                type: "error"
              });
            }
            this.tableLoading = false;
          })
          .catch(error => {
            reject(error);
          });
      });
      this.statusDialogVisible = false;
    },
    //批量修改月结评分
    updateGrade() {
      if (this.checkBoxData.length <= 0) {
        this.$message.warning("请先勾选需要更改的数据");
        return;
      }
      let tData = [];
      this.checkBoxData.forEach(row => {
        tData.push(row.serialno);
      });
      let data = {
        serialnos: tData.join(",")
      };
      this.$confirm("此操作将月结状态改成月结评分, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          new Promise((response, reject) => {
            updateSummaryGradeState(qs.stringify(data))
              .then(response => {
                if (response.data.code == 0) {
                  this.$message({
                    message: response.data.msg,
                    type: "success"
                  });
                  this.getList();
                  this.into();
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                reject(error);
              });
          });
        })
        .catch(() => {});
    },
    //批量修改月结评分完成
    gradeFinish() {
      if (this.checkBoxData.length <= 0) {
        this.$message.warning("请先勾选需要更改的数据");
        return;
      }
      let tData = [];
      this.checkBoxData.forEach(row => {
        tData.push(row.serialno);
      });
      let data = {
        serialnos: tData.join(",")
      };
      this.$confirm("此操作将月结状态改成月结评分完成, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          new Promise((response, reject) => {
            updateFinishGradeBySerialNo(qs.stringify(data))
              .then(response => {
                if (response.data.code == 0) {
                  this.$message({
                    message: response.data.msg,
                    type: "success"
                  });
                  this.getList();
                  this.into();
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                reject(error);
              });
          });
        })
        .catch(() => {});
    },
    //全部修改月结评分完成
    gradeAllFinish() {
      this.$confirm(
        "此操作将所有人月结状态改成月结评分完成, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          new Promise((response, reject) => {
            updateFinishGradeAll()
              .then(response => {
                if (response.data.code == 0) {
                  this.$message({
                    message: response.data.msg,
                    type: "success"
                  });
                  this.getList();
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                reject(error);
              });
          });
        })
        .catch(() => {});
    },
    //导出
    exportExcel() {
      let info = this.search;
      if (info.stationcode.length > 0) {
        info.stationcode = info.stationcode.join();
      }
      window.location.href =
        config.actionPath +
        "/" +
        process.env.VUE_APP_ITEM_NAME +
        "history/exportScore?info=" +
        JSON.stringify(info);
    }
  }
};
</script>


<style lang="scss" scoped>
.title {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eaeaea;
  padding: 0px 10px;
  font-weight: 600;
  color: #424242;
  background: #fff;
  span {
    font-weight: normal;
    color: #9b9b9b;
  }
  i {
    margin: 0px 4px;
    color: #9b9b9b;
  }
}
.search {
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  background: #fff;
  margin: 20px;
  border-radius: 4px;
  padding-top: 15px;
  .el-form-item {
    margin: 0px;
  }
  .el-button {
    margin-left: 10px;
  }
  .edit-btn {
    padding: 15px 0px;
    margin-top: 15px;
    border: 1px solid #ededee;
    background: #fcfcfc;
    .el-button {
      margin-left: 10px;
    }
    span {
      color: #8a919b;
      font-size: 0.9em;
      float: right;
      .icon-jinggao {
        color: #f3ad0e;
        position: relative;
        top: 1px;
      }
      i {
        margin-right: 3px;
      }
      .icon-daochu-tianchong {
        font-size: 12px;
      }
      .icon-dayin {
        font-size: 12px;
      }
    }
  }
}
.content {
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 20px;
  margin: 0px 20px;
  border-radius: 4px;
  .el-pagination {
    margin: 20px auto;
    text-align: center;
  }
}
.score-dialog {
  max-height: 500px;
  overflow: auto;
}
</style>
<style>
.score-dialog {
  max-height: 500px;
  overflow: auto;
}
</style>
