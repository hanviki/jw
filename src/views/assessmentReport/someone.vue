<template>
  <div class="main-content" v-if="isData==0">
    <el-row class="box-wrap">
      <h2 class="title">{{detailData.year}}年第{{detailData.month}}月份测评报告</h2>
      <el-col :span="16">
        <h4>{{detailData.username}}<span>{{detailData.departmentname}}（{{detailData.stationname}}）</span></h4>
        <el-col :span="2">
          <h5>{{detailData.totalscore}}</h5>
          <p>总得分</p>
        </el-col>
        <el-col :span="4">
          <h5>{{detailData.basicscore}}</h5>
          <p>基础得分</p>
        </el-col>
        <el-col :span="4">
          <h5>{{detailData.keyscore}}</h5>
          <p>关键得分</p>
        </el-col>
        <el-col :span="4">
          <h5>{{detailData.avgscore}}</h5>
          <p>整体平均分</p>
        </el-col>
        <!-- <el-col :span="4">
          <h5 style="color:#409EFF;">{{detailData.plan}}%</h5>
          <p>评分进度</p>
        </el-col> -->
        <el-col :span="24">
          <h6 class="fx-title">测评分析</h6>
          <h4 class="good">
            <span style="margin-left:0;">总得分：</span>
            {{detailData.totalscore}}<span class="icon">分</span>
            <!--<span class="level good">优</span>-->
            <span v-if="detailData.totalcomparelast >= 0"> 较上一月份提升<span class="up"><i class="el-icon-top"></i>{{detailData.totalcomparelast}}%</span></span>
            <span v-else>较上一月份差距<span class="down"><i class="el-icon-bottom"></i>{{Math.abs(detailData.totalcomparelast)}}%</span></span>
            <span v-if="detailData.totalcomparemark >= 0">较整体平均分超越<span class="up"><i class="el-icon-top"></i>{{detailData.totalcomparemark}}%</span></span>
            <span v-else>较整体平均分差距<span class="down"><i class="el-icon-bottom"></i>{{Math.abs(detailData.totalcomparemark)}}%</span></span>
          </h4>
          <h4 class="good" v-if="roleCode == 50 || roleCode==100">
            <span style="margin-left:0;">最高分：</span>
            {{detailData.maxscore}}<span class="icon">分</span>
            <!--<span class="level good">优</span>-->
            <span v-if="detailData.maxcomparelast >= 0"> 较上一月份提升<span class="up"><i class="el-icon-top"></i>{{detailData.maxcomparelast}}%</span></span>
            <span v-else>较上一月份差距<span class="down"><i class="el-icon-bottom"></i>{{Math.abs(detailData.maxcomparelast)}}%</span></span>
            <span v-if="detailData.maxcomparemark >= 0">较最高平均分超越<span class="up"><i class="el-icon-top"></i>{{detailData.maxcomparemark}}%</span></span>
            <span v-else>较最高平均分差距<span class="down"><i class="el-icon-bottom"></i>{{Math.abs(detailData.maxcomparemark)}}%</span></span>
          </h4>
          <h4 class="bad" v-if="roleCode == 50 || roleCode==100">
            <span style="margin-left:0;">最低分：</span>
            {{detailData.minscore}}<span class="icon">分</span>
            <!--<span class="level good">优</span>-->
            <span v-if="detailData.mincomparelast >= 0"> 较上一月份提升<span class="up"><i class="el-icon-top"></i>{{detailData.mincomparelast}}%</span></span>
            <span v-else>较上一月份差距<span class="down"><i class="el-icon-bottom"></i>{{Math.abs(detailData.mincomparelast)}}%</span></span>
            <span v-if="detailData.mincomparemark >= 0">较最低平均分超越<span class="up"><i class="el-icon-top"></i>{{detailData.mincomparemark}}%</span></span>
            <span v-else>较最低平均分差距<span class="down"><i class="el-icon-bottom"></i>{{Math.abs(detailData.mincomparemark)}}%</span></span>
          </h4>
        </el-col>
      </el-col>
      <el-col :span="8">
        <allChart :chartData="detailData"></allChart>
      </el-col>

    </el-row>
    <div class="box-data">
      <h4 class="bd-title">综合结果</h4>
      <SomeoneChart :chartData="reportsData" :id="detailData.usercode" :year="$route.query.year" :month="$route.query.month"></SomeoneChart>
    </div>
  </div>
  <div class="none-data" v-else>该用户暂无评估报告！</div>
</template>

<script>
import allChart from "./allChart"; // 综合得分图表
import SomeoneChart from "./someoneChart"; // 综合得分图表
import TwoChart from "./twoChart"; // 二级维度结果
import { getUserDetail } from "@/api/assessmentReport/index";
import qs from "qs";
export default {
  data() {
    return {
      detailData: {},
      reportsData: [],
      isData: 0,
      roleCode:this.$store.state.user.user.rolecode
    };
  },
  mounted() {},
  created() {
    this.getDetail();
  },
  components: {
    allChart,
    SomeoneChart,
    TwoChart
  },
  methods: {
    getDetail() {
      let data = {};
      if(this.$store.state.user.user.rolecode == 300){
        data.usercode = this.$store.state.user.user.usercode;
      }else{
        data.usercode = this.$route.query.usercode;
      }
      if(this.$route.query.year){
        data.year = this.$route.query.year;
      }else{
        data.year = "";
      }
      if(this.$route.query.month){
        data.month = this.$route.query.month;
      }else{
         data.month = "";
      }
      const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      new Promise((response, reject) => {
        getUserDetail(qs.stringify(data))
          .then(response => {
            if (response.data.code == 0) {
              this.detailData = response.data.data.evaluationReport;
              this.reportsData = response.data.data.reports;
            } else if (response.data.code == 2) {
              this.isData = 2;
            } else {
              this.$message({
                message: response.data.msg,
                type: "error"
              });
            }
            loading.close();
            this.tableLoading = false;
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 18px;
  margin: 0px 0 10px;
}
.box-wrap {
  background: #fff;
  border-radius: 5px;
  padding: 20px;
  border-radius: 5px;
  .good {
    color: #409EFF;
    margin-right: 10px;
  }
  .bad {
    color: #f56c6c;
    margin-right: 10px;
  }
  .up {
    color: #409EFF;
    margin-right: 10px;
  }
  .down {
    color: #f56c6c;
    margin-right: 10px;
  }
  .fx-title {
    margin-top: 20px;
    font-weight: 500;
    font-size: 16px;
  }
  h4 {
    margin: 10px 0px 10px 0px;
    font-size: 20px;
    span {
      font-size: 14px;
      color: #888;
      margin-left: 4px;
    }

    .icon {
      font-size: 12px;
      font-weight: normal;
      margin-left: 2px;
    }
    .level {
      font-size: 16px;
      font-weight: normal;
      margin-left: 8px;
    }
  }
  p {
    text-align: center;
  }
  h5 {
    font-size: 24px;
    text-align: center;
  }
}
.box-select {
  margin-right: 10px;
}

.box-data {
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  margin-top: 10px;
  .bd-title {
    color: #409eff;
    position: relative;
    font-weight: bold;
    padding-left: 10px;
    line-height: 1;
    text-align: left;
    margin-bottom: 20px;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 4px;
      background-color: #30a6f5;
      border-radius: 2px;
    }
  }
}
.none-data{
  text-align: center;
  color:#999;
  background: #fff;
  padding: 100px 0;

}
</style>
