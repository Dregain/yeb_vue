<template>
  <div>
    <div>
      <el-input
          size="small"
          class="addPosInput"
          placeholder="添加职位..."
          prefix-icon="el-icon-plus"
          @keydown.enter.native="addPosition"
          v-model="pos.name">
      </el-input>
      <el-button size="small" @click="addPosition" icon="el-icon-plus" type="primary">添加</el-button>
    </div>
    <div class="posManaMain">
      <el-table
          size="small"
          stripe border
          :data="positions"
          @selection-change="handleSelectionChange"
          style="width: 70%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位"
            width="120">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
            width="200">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <!--scope就是范围，scope.row就是这一行的JSON数据-->
            <el-button
                size="mini"
                @click="showEditView(scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button size='small' style="margin-top: 8px" type="danger"
               :disabled="this.multipleSelection.length==0" @click="multDelete">批量删除
    </el-button>
    <el-dialog
        title="编辑职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-tag>职位名称</el-tag>
        <el-input v-model="updatePos.name" size="small" class="updatePosInput"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        name: ''
      },
      positions: [],
      dialogVisible: false,
      updatePos: {
        name: ''
      },
      multipleSelection: [],
    }
  },
  mounted() {
    this.initPositions();
  },
  methods:{
    doUpdate() {
      this.putRequest('/system/basic/pos/',this.updatePos).then(resp=>{
        if (resp) {
          this.initPositions();
          this.dialogVisible = false;
        }
      });
    },
    addPosition() {
      if (this.pos.name) {
        //this.pos虽然只有一个name，但后端需要一个JSON对象，接口示例中有4个参数，其中3个由后端处理
        this.postRequest('/system/basic/pos/', this.pos).then(resp=>{
          if (resp) {
            this.initPositions();
            this.pos.name = '';
          }
        })
      } else {
        this.$message.error('职位名称不能为空');
      }
    },
    initPositions() {
      this.getRequest('/system/basic/pos/').then(resp=>{
        if(resp) {
          this.positions = resp;
        }
      })
    },
    showEditView(data) {
      //直接赋值this.updatePos = data会有问题，界面的职位信息会跟着对话框变化，且对话框内容修改后点取消，界面上的数据不会还原，所以这里用数据的拷贝
      Object.assign(this.updatePos,data);
      //data中的数据都会传到this.updatePos中，创建日期传进去的时候可能会出一点bug
      this.updatePos.createDate = '';
      this.dialogVisible = true;
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除['+data.name+']职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/'+data.id).then(resp=>{
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //多选框事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    multDelete() {
      this.$confirm('此操作将永久删除['+this.multipleSelection.length+']条职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?'; //传参一般是在地址后面加一个问号
        this.multipleSelection.forEach(item=>{
          ids+='ids='+item.id+'&';
        });
        this.deleteRequest('/system/basic/pos/'+ids).then(resp=>{
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>
.addPosInput {
  width: 300px;
  margin-right: 8px;
}

.posManaMain {
  margin-top: 10px;
}

.updatePosInput {
  width: 200px;
  margin-left: 8px;
}
</style>
