<template>
  <div class="app-container">
    <!-- 模糊查询form表单 -->
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="search.name" placeholder="查询姓名关键子" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="search.address" placeholder="查询地址关键字" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="addCustomer">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据table -->
    <el-table :data="tableData" border style="width: 100%;">
      <el-table-column fixed prop="id" label="ID" width="150" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column label="性别" width="120">
        <!-- slot-scope传递给模板当前行的数据 -->
        <template slot-scope="scope">
          <!-- <span style="margin-left: 10px">{{ scope.row.sex == 0 ? '男': (scope.row.sex == 1 ? '女' : '保密') }}</span> -->

          <span v-if="scope.row.sex == 0" style="margin-left: 10px">男</span>
          <span v-if="scope.row.sex == 1" style="margin-left: 10px">女</span>
          <span v-if="scope.row.sex == 2" style="margin-left: 10px">保密</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="120" />
      <el-table-column prop="age" label="年龄" width="120" />
      <el-table-column prop="birthday" label="生日" width="300" />
      <el-table-column label="头像" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" height="80px">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteCustomer(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="editCustomer(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 编辑、新增框 -->
    <el-dialog
      title="编辑/新增用户"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      top="0"
    >
      <el-form ref="customer" :model="customer" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="customer.name" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="customer.age" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="customer.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
            <el-radio :label="2">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="customer.address" />
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="customer.birthday" type="date" placeholder="选择生日" value-format="yyyy-MM-dd" />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList,
  addUser,
  updateUser,
  deleteUser
} from '@/api/shop'

export default {
  name: 'Item',
  data() {
    return {
      // 表格数据
      tableData: [],
      // 控制编辑框是否显示
      dialogVisible: false,
      // 当前编辑、新增用户信息
      customer: {},
      // 默认当前页
      currentPage: 1,
      // 默认每页显示条数
      // 默认每页显示条数
      pageSize: 10,
      // 数据总条数（应该通过接口动态获取，不应该写死）
      total: 0,
      search: { name: '', address: '' } // 查询条件
    }
  }, // 钩子函数,当实例创建完成之后发起请求
  created() {
    console.log('加载客户列表...')

    this.fetchData()
  },
  methods: {
    // 当调整每页显示的条数的时候触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      // 重新根据当前页以及每页条数重新获取数据
      this.pageSize = val
      this.fetchData()
    },
    // 当调整页码的时候触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      // 重新根据当前页以及每页条数重新获取数据
      this.currentPage = val
      this.fetchData()
    },
    // 编辑用户
    editCustomer(row) {
      this.customer = row
      this.avatarUrl = row.avatar
      this.dialogVisible = true
      console.log(row)
    },
    // 新增客户
    addCustomer() {
      // 显示弹出框
      this.dialogVisible = true
      // 重置customer数据
      this.customer = { sex: 0 }
    },
    // 删除用户 row:当前行的数据
    deleteCustomer(row) {
      this.$confirm('是否确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确认删除
          console.log(row.id + '删除次id数据')
          // axios 执行后台的请求 进行删除
          deleteUser(row.id).then(res => {
            this.$message({
              message: '用户删除成功',
              type: 'success'
            })
            // 刷新数据
            this.fetchData()
          }).catch(error => {

          })
        })
        .catch(() => {})
    },
    // 获取数据
    fetchData() {
      // 封装查询参数
      const query = {
        page: this.currentPage,
        limit: this.pageSize,
        name: this.search.name,
        address: this.search.address
      }

      fetchList(query).then(res => {
        console.log('query===>' + JSON.stringify(query))
        // 当前页数据
        this.tableData = res.data.records
        // 总条数
        this.total = res.data.total
        console.log('success===>' + JSON.stringify(res))
      })
        .catch(error => {
          console.log('error====>' + JSON.stringify(error))
        })
    },
    // 提交编辑表单数据
    submitForm() {
      // 当前编辑的客户信息
      this.dialogVisible = false
      console.log(JSON.stringify(this.customer))
      if (this.customer.id) {
        // 编辑
        updateUser(this.customer).then(res => {
          if (res.code == 20000) {
            this.$message({
              message: '用户编辑成功',
              type: 'success'
            })
            // 刷新表格
            this.fetchData()
          } else {
            this.$message.error('用户编辑失败')
          }
        })
          .catch(error => {})
      } else {
        // 新增
        // this.$axios
        // .post('/api/api/addUser', this.customer)
        addUser(this.customer).then(res => {
          console.log(JSON.stringify(this.customer))
          if (res.code == 20000) {
            this.$message({
              message: '用户新增成功',
              type: 'success'
            })
            // 刷新表格
            this.fetchData()
          } else {
            this.$message.error('用户新增失败')
          }
        })
          .catch(error => {})
      }
    }
  }

}
</script>
