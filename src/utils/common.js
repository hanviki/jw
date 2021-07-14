import { getdeparttree } from "@/api/common/common";

export default {
    //遍历科室获取element结构
    setTreeData: function (data) {
        let tree = data.filter((father) => {              //循环所有项
            let branchArr = data.filter((child) => {
                return father.id == child.pId      //返回每一项的子级数组
            });
            if (branchArr.length > 0) {
                father.children = branchArr;    //如果存在子级，则给父级添加一个children属性，并赋值
            }
            return father.pId == 0;      //返回第一层
        });
        return tree;
    },
    //格式化日期 参数1 格式（yyyyMMddhhmmss）  参数2 日期（new date())
    dateFormat(fmt, date) { //author: meizz 
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+":  date.getMonth() + 1, //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    format: function (shijianchuo,type) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        if(type == 1){
            return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
        }else if(type == 2){
            return y + '-' + this.add0(m) + '-' + this.add0(d);
        }
        
    },
    add0:function(m){
        return m<10?'0'+m:m
    },
    //验证手机号
    isPoneAvailable:function($poneInput) {
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (myreg.test($poneInput)) {
            return true;
        } else {
            return false;
        }
    },
    //验证邮箱
    isEmailAvailable:function($email) {
        var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
		if(reg.test($email)){
			return true;
		}else{
			return false;
		}
    },
    //交换数组元素
    swapItems:function(arr, index1, index2){
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
     //导入excel后错误信息提示
     importExcelErrorMsg(_this,file){
         console.log(file)
        var data = file.msg;
        console.log(data[0])
        let newDatas = [];
        const h = _this.$createElement;
        for (let i in data) {
          newDatas.push(
            h("p", { style: { color: "red", fontSize: "14px" ,'font-weight':'bold'} }, data[i])
          );
        }
        //弹出优雅展示
        _this.$message({
          type: "error",
          message: h("div", null, newDatas)
        });
    }
}