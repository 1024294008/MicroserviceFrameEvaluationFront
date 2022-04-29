<template>
  <div class="detect-task">
    <div class="detect-task-operation-part">
      <div class="detect-task-operation-add-task mr-20">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>新增任务</span>
              <div>
                <el-button class="add-task-operation" @click="resetForm" round size="small" color="#ff9aaf">重  置</el-button>
                <el-button class="add-task-operation" @click="submitForm" round size="small" color="#f2d36d">提交任务</el-button>
              </div>
            </div>
          </template>
          <div v-loading="taskformLoading">
            <el-form ref="taskformRef" :rules="taskformRules" :model="taskform" label-width="120px" :inline="true">
              <el-form-item label="任务名" prop="name" style="width: 70%">
                <el-input v-model="taskform.name" placeholder="请输入任务名"></el-input>
              </el-form-item>
              <el-form-item label="Git 地址" prop="gitUrl">
                <el-input v-model="taskform.gitUrl" placeholder="请输入 Git 地址"></el-input>
              </el-form-item>
              <el-form-item label="Git 分支" prop="gitBranch">
                <el-input v-model="taskform.gitBranch" placeholder="请输入 Git 分支"></el-input>
              </el-form-item>
              <el-form-item label="Git 用户名">
                <el-input v-model="taskform.gitUsername" placeholder="请输入 Git 用户名"></el-input>
              </el-form-item>
              <el-form-item label="Git 密码">
                <el-input v-model="taskform.gitPassword" type="password" placeholder="请输入 Git 密码"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
      <div class="detect-task-operation-inspect">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>任务视图</span>
            </div>
          </template>
          <div style="height: 100%">
            <TaskInspect :total="taskTotal"/>
          </div>
        </el-card>
      </div>
    </div>
    <div class="detect-task-table-part">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>检测任务列表</span>
          </div>
        </template>
        <div>
          <el-table :data="detectionTaskTable" class="task-table" max-height="270">
            <el-table-column label="检测时间" width="250">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-icon><timer /></el-icon>
                  <span style="margin-left: 10px">{{ scope.row.startTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="任务名" prop="name">
            </el-table-column>
            <el-table-column label="执行状态">
              <template #default="scope">
                <el-tag
                  :type="scope.row.status === 2
                  ? '' : scope.row.status == 1
                  ? 'danger' : 'success'"
                  disable-transitions
                  >{{ scope.row.status === 2
                  ? '执行中' : scope.row.status === 1
                  ? '失败' : '成功' }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="架构类型"
              :filters="[
                { text: '未知', value: 0 },
                { text: '其他架构', value: 1 },
                { text: '微服务架构', value: 2 },
              ]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
            >
              <template #default="scope">
                <el-tag
                  :type="scope.row.type === 2 ? 'success' : 'warning'"
                  disable-transitions
                  >{{ scope.row.type === 2
                  ? '微服务架构' : scope.row.type === 1
                  ? '其他架构' : '未知' }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button plain size="small" @click="displayTaskDetail(scope.row)" v-show="scope.row.status != 2">详情</el-button>
                <el-button type="primary" plain size="small" @click="checkDetectDetail(scope.row)" v-show="scope.row.status != 2">检测结果</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="task-pagination"
            v-model:currentPage="taskQuery.pageNum"
            v-model:page-size="taskQuery.pageLimit"
            :page-sizes="[5, 10, 15, 20]"
            layout="sizes, prev, pager, next"
            :total="taskTotal"
            @size-change="findDetectionTaskList"
            @current-change="findDetectionTaskList"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Timer } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { getDetectionTaskList, startDetect } from '../../network/detectionTask'
import TaskInspect from './TaskInspect.vue'

export default {
  components: {
    Timer,
    TaskInspect,
  },
  setup() {
    const router = useRouter()
    const taskformRef = ref(null)
    const taskformLoading = ref(false)

    const taskform = reactive({
      name: '',
      gitUrl: '',
      gitUsername: '',
      gitPassword: '',
    })
    const taskformRules = reactive({
      name: [
        {
          required: true,
          message: '请输入任务名',
          trigger: 'blur',
        }
      ],
      gitUrl: [
        {
          required: true,
          message: '请输入 Git 地址',
          trigger: 'blur',
        }
      ],
      gitBranch: [
        {
          required: true,
          message: '请输入 Git 分支',
          trigger: 'blur',
        }
      ]
    })

    const pollRequest = () => {
      let isExcuting = detectionTaskTable.filter(detectionTask => detectionTask.status === 2).length > 0
      if (isExcuting) {
        let timer = setInterval(() => {
          if (!isExcuting) clearInterval(timer)
          getDetectionTaskList(taskQuery).then((res) => {
          if ('200' === res.code) {
            taskTotal.value = res.total
            detectionTaskTable.splice(0, detectionTaskTable.length, ...res.data)
            isExcuting = detectionTaskTable.filter(detectionTask => detectionTask.status === 2).length > 0
          }
        })
        }, 2000)
      }
    }
    const findDetectionTaskList = () => {
      getDetectionTaskList(taskQuery).then((res) => {
        if ('200' === res.code) {
          taskTotal.value = res.total
          detectionTaskTable.splice(0, detectionTaskTable.length, ...res.data)
          pollRequest()
        }
      })
    }

    const submitForm = () => {
      if (!taskformRef) return
      taskformRef.value.validate((valid) => {
        if (valid) {
          taskformLoading.value = true
          setTimeout(() => {
            taskformLoading.value = false
            // resetForm()
          }, 1000)
          startDetect(taskform)
          setTimeout(() => {
            findDetectionTaskList()
          }, 500)
        } else {
          return false
        }
      })
    }
    const resetForm = () => {
      if (!taskformRef) return
      taskformRef.value.resetFields()
    }

    const detectionTaskTable = reactive([])
    const taskQuery = reactive({
      pageNum: 1,
      pageLimit: 10,
    })
    const taskTotal = ref(0)

    onMounted(() => findDetectionTaskList())

    const filterTag = (value, row) => value === row.type

    const checkDetectDetail = (row) => {
      router.push({
        path: `/detail/${row.id}`,
      })
    }

    const displayTaskDetail = (row) => {
      ElMessageBox.alert(`
        任务ID：${row.id}<br/>
        任务名称：${row.name}<br/>
        执行状态：${row.status === 2 ? '执行中' : row.status === 1 ? '失败' : '成功'}<br/>
        架构类型：${row.type === 2 ? '微服务架构' : row.type === 1 ? '其他架构' : '未知'}<br/>
        开始时间：${row.startTime}<br/>
        结束时间：${row.endTime}<br/>
        Git 地址：${row.gitUrl}<br/>
        Git 分支：${row.gitBranch}<br/>
        Git 用户名：${row.gitUsername}<br/>
      `, '任务详情', { dangerouslyUseHTMLString: true, customStyle: 'width: 45%' })
    }

    return {
      taskform,
      taskformRules,
      taskformRef,
      taskformLoading,
      submitForm,
      resetForm,
      taskQuery,
      taskTotal,
      detectionTaskTable,
      findDetectionTaskList,
      filterTag,
      displayTaskDetail,
      checkDetectDetail,
    }
  },
}
</script>

<style scoped>
.detect-task {
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  padding: 10px 25px;
}
.detect-task-operation-part {
  display: flex;
  flex-flow: row nowrap;
  flex: 2 0 0;
  padding-bottom: 20px;
}
.detect-task-operation-add-task {
  flex: 7 0 0;
}
.detect-task-operation-inspect {
  flex: 4 0 0;
}
::v-deep(.el-card__body){
  height: 80%;
}
.detect-task-table-part {
  overflow: hidden;
  flex: 3 0 0;
}
.task-pagination {
  margin-top: 20px;
}
.box-card {
  height: 100%;
}
.card-header {
  height: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-task-operation {
  color: white;
  width: 75px;
}
</style>
