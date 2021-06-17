<template>
  <div>

    <el-dialog
      title="添加岗位"
      :visible.sync="dialogVisible"
      :before-close="cancel"
      width="50%"
    >
      <el-form label-width="80px">
        <el-form-item label="所属部门">
          <DepartmentList
            @childSelectDepartment="getSelectDepartment"
            :selectedOptions="departmentcode"
          ></DepartmentList>
        </el-form-item>
        <el-form-item label="岗位名称">
          <el-input v-model="form.stationname"></el-input>
        </el-form-item>
        <el-form-item label="岗位描述">
          <!-- <el-input
            type="textarea"
            v-model="form.stationdesc"
            :rows="4"
          ></el-input> -->
          <Ckeditor ref="stationCkditor" :type="1" :fatherContent="form.stationdesc"></Ckeditor>
        </el-form-item>
        <el-form-item label="职责描述">
          <!-- <el-input
            type="textarea"
            v-model="form.dutydesc"
            :rows="4"
          ></el-input> -->
          <Ckeditor ref="dutyCkditor" :type="1" :fatherContent="form.dutydesc"></Ckeditor>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="addSubmit"
        >{{this.form.stationcode ? "修 改" : "添 加"}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import DepartmentList from "../common/departmentList";
import { addStation,updateStation } from "@/api/post/post";
import qs from "qs";
import Ckeditor from "../common/ckeditor";
export default {
  data() {
    return {
      form:{},
      selfDialogVisible: this.dialogVisible
    };
  },
  props: {
    dialogVisible: {
      required: true
    },
    parentForms: {
      required: true
    },
    departmentcode: {
      type: Array,
      default: () => [""]
    }
  },
  components: {
    DepartmentList,
    Ckeditor
  },
  created() {
    this.form = Object.assign({},this.parentForms);
  },
  methods: {
    //获取部门选择
    getSelectDepartment(data,row) {
      this.form.departmentcode = data;
      this.form.fulldepartmentcode = row.join(',');
    },
    //添加/修改岗位
    addSubmit() {
      if (!this.form.departmentcode) {
        this.$message.warning("请选择部门");
        return;
      }
      if (!this.form.stationname) {
        this.$message.warning("请填写岗位名称");
        return;
      }
      this.form.stationdesc = this.$refs.stationCkditor.content;
      if (!this.form.stationdesc) {
        this.$message.warning("请填写岗位描述");
        return;
      }
      this.form.dutydesc = this.$refs.dutyCkditor.content;
      if (!this.form.dutydesc) {
        this.$message.warning("请填写职责描述");
        return;
      }
      if (this.form.stationcode) {
        //修改
        new Promise((response, reject) => {
          updateStation(qs.stringify(this.form))
            .then(response => {
              if (response.data.code == 0) {
                this.$message.success(response.data.msg);
                this.cancel();
                this.getList();
              } else {
                this.$message.error(response.data.msg);
              }
            })
            .catch(error => {
              reject(error);
            });
        });
      } else {
        //添加
        new Promise((response, reject) => {
          addStation(qs.stringify(this.form))
            .then(response => {
              if (response.data.code == 0) {
                this.$message.success(response.data.msg);
                this.cancel();
                this.getList();
              } else {
                this.$message.error(response.data.msg);
              }
            })
            .catch(error => {
              reject(error);
            });
        });
      }
    },
    //取消
    cancel() {
      this.selfDialogVisible = false;
      if (!this.selfDialogVisible) {
        this.$emit("childClose", false);
      }
    },
    //调用父亲查询列表方法
    getList() {
      this.$emit("childGetList", false);
    }
  },
  watch: {
    dialogVisible(val, oldVal) {
      this.selfDialogVisible = val;
    },
    parentForms(val, oldVal){
      this.form = Object.assign({},val);
    }
  }
};
</script>
<style scoped>
</style>
