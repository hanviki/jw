<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-bottom:20px;"
      size="small"
    >
      <el-table-column
        prop="resultreportname"
        label="维度"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="ascore"
        label="A类评分人"
        width="180"
        v-if="type != 300"
      >
      </el-table-column>
      <el-table-column
        prop="bscore"
        label="B类评分人"
        v-if="type != 300"
      >
      </el-table-column>
      <el-table-column
        prop="cscore"
        label="C类评分人"
        v-if="type != 300"
      >
      </el-table-column>
      <el-table-column
        prop="dscore"
        label="D类评分人"
        v-if="type != 300"
      >
      </el-table-column>
      <el-table-column
        prop="score"
        label="个人得分"
      >
      </el-table-column>
      <el-table-column
        prop="avgscore"
        label="整体平均分"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            @click="topic(scope.row)"
            type="text"
            size="small"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="bg"
      id="chart1"
    ></div>
    <el-dialog
      title="二级维度结果"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <TwoChart></TwoChart>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TwoChart from "./twoChart"; // 二级维度结果
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      type: 0,
      series: []
    };
  },
  props: ["chartData","id","year","month"],
  created() {
    this.tableData = this.chartData;
    this.type = this.$store.state.user.user.rolecode;
  },
  components: {
    TwoChart
  },
  methods: {
    topic(row) {
      this.$router.push({
        path: "/home/twoDimension",
        query: {"usercode":this.id,"id":row.id,'resultreportname':row.resultreportname,"year":this.year,"month":this.month}
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    drawLine() {
      if (this.type == 300) {
        this.series = [
          {
            name: "个人得分",
            type: "bar",
            data: [this.tableData[0].score, this.tableData[1].score]
          },
          {
            name: "总体平均分",
            type: "bar",
            data: [this.tableData[0].avgscore, this.tableData[1].avgscore]
          }
        ];
      } else {
        this.series = [
          {
            name: "A类评分人",
            type: "bar",
            data: [this.tableData[0].ascore, this.tableData[1].ascore]
          },
          {
            name: "B类评分人",
            type: "bar",
            data: [this.tableData[0].bscore, this.tableData[1].bscore]
          },
          {
            name: "C类评分人",
            type: "bar",
            data: [this.tableData[0].cscore, this.tableData[1].cscore]
          },
          {
            name: "D类评分人",
            type: "bar",
            data: [this.tableData[0].dscore, this.tableData[1].dscore]
          },
          {
            name: "个人得分",
            type: "bar",
            data: [this.tableData[0].score, this.tableData[1].score]
          },
          {
            name: "总体平均分",
            type: "bar",
            data: [this.tableData[0].avgscore, this.tableData[1].avgscore]
          }
        ];
      }
      if (this.tableData.length == 0) {
        return;
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("chart1"));
      // 绘制图表
      myChart.setOption({
        color: ["#4cabce", "#e5323e", "#f00220","#003366", "#006699"],
        tooltip: {
          trigger: "axis"
        },
        title: {
          text: ""
        },
        xAxis: [
          {
            type: "category",
            data: ["基础评分", "关键评分"]
          }
        ],
        yAxis: [
          {
            type: "value",
            color: "#f00",
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#999"
              }
            }
          }
        ],
        series: this.series
      });
    }
  },
  mounted() {
    this.drawLine();
  },
  watch: {
    chartData: {
      handler(newValue, oldValue) {
        this.tableData = newValue;
        this.drawLine();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
#chart1 {
  width: 100%;
  height: 350px;
  border: 1px solid #f1f1f1;
  margin-top: 15px;
}
// .bg {
//   box-shadow: 0px 1px 10px #dfdfdf;
//   border-radius: 4px;
//   border: 1px solid #e8e8e8;
// }
</style>

