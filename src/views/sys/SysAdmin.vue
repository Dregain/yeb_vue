<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 10px">
      <el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search"
                style="width: 400px;margin-right: 10px"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
    </div>
    <div class="admin-container">
      <el-card class="admin-card" v-for="(admin,index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ admin.name }}</span>
          <el-button style="float: right; padding: 3px 0;color: #d20f0f" type="text" icon="el-icon-delete"
                     @click="deleteAdmin(admin)"></el-button>
        </div>
        <div class="img-container">
          <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userface-img">
        </div>
        <div class="userinfo-container">
          <div>用户名：{{ admin.name }}</div>
          <div>手机号码：{{ admin.phone }}</div>
          <div>电话号码：{{ admin.telephone }}</div>
          <div>地址：{{ admin.address }}</div>
          <div>用户状态：
            <el-switch
                v-model="admin.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="enabledChange(admin)"
                active-text="启用"
                inactive-text="禁启用">
            </el-switch>
          </div>
          <div>
            用户角色：
            <el-tag style="margin-right: 10px;" type="success" v-for="(role,indexj) in admin.roles" :key="indexj">
              {{ role.nameZh }}
            </el-tag>
            <el-popover
                placement="right"
                title="角色列表"
                width="200"
                @show="showPop(admin)"
                @hide="hidePop(admin)"
                trigger="click">
              <el-select v-model="selectedRoles" multiple placeholder="请选择">
                <el-option
                    v-for="(r,index) in allRoles"
                    :key="index"
                    :label="r.nameZh"
                    :value="r.id">
                </el-option>
              </el-select>
              <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
            </el-popover>
          </div>
          <div>
            备注：{{ admin.mark }}
          </div>
        </div>
      </el-card>
    </div>
  </div>

</template>

<script>
export default {
  name: "SysAdmin",
  data() {
    return {
      admins: [],
      keywords: '',
      allRoles: [],
      selectedRoles: [], //存的是角色id，不是一个完整的角色对象
    }
  },
  mounted() {
    this.initAdmins();
  },
  methods: {
    //更新用户角色，逻辑有点复杂
    hidePop(admin) {
      //判断用户是否有修改，没有修改的话不要发送请求
      let roles = [];
      Object.assign(roles, admin.roles);
      let flag = false;
      //如果长度变了，那肯定是修改了
      if (roles.length != this.selectedRoles.length) {
        flag = true;
      } else {  //如果长度没变，也有可能是添加又删除了，所以还要进一步判断
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i];
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j];
            if (role.id == sr) { //说明角色是一样的
              roles.splice(i, 1);
              i--;
              break;
            }
          }
        }
        if (roles.length != 0) {  //说明变更了
          flag = true;
        }
      }
      if (flag) {
        let url = '/system/admin/role?adminId=' + admin.id;
        this.selectedRoles.forEach(sr => {
          url += '&rids=' + sr;
        })
        this.putRequest(url).then(resp => {
          if (resp) {
            this.initAdmins()
          }
        })
      }
    },
    showPop(admin) {
      this.initAllRoles();
      let roles = admin.roles;
      this.selectedRoles = [];  //先初始化一下
      roles.forEach(r => {
        this.selectedRoles.push(r.id);
      })
    },
    initAllRoles() {
      this.getRequest('/system/admin/roles').then(resp => {
        if (resp) {
          this.allRoles = resp;
        }
      })
    },
    //当搜索框keywords中有值并点击搜索时，返回的是搜索对象
    doSearch() {
      this.initAdmins();
    },
    //一般情况下输入框keywords中没有值，返回的是全部数据
    initAdmins() {
      this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp => {
        if (resp) {
          this.admins = resp;
        }
      })
    },
    deleteAdmin(admin) {
      this.$confirm('此操作将永久删除[' + admin.name + ']操作员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/admin/' + admin.id).then(resp => {
          if (resp) {
            this.initAdmins();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    enabledChange(admin) {
      this.putRequest('/system/admin/', admin).then(resp => {
        if (resp) {
          this.initAdmins();
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: space-around;
}

.admin-card {
  width: 350px;
  margin-bottom: 20px;
}

.userface-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.img-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.userinfo-container {
  font-size: 12px;
}

</style>