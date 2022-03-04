<template>
  <div class="detect-task">
    <div class="detect-task-operation-part">
      <div class="detect-task-operation-add-task">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Card name</span>
              <el-button class="button" type="text">Operation button</el-button>
            </div>
          </template>
          <div>add</div>
        </el-card>
      </div>
      <div class="detect-task-operation-inspect">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Card name</span>
              <el-button class="button" type="text">Operation button</el-button>
            </div>
          </template>
          <div>inspect</div>
        </el-card>
      </div>
    </div>
    <div class="detect-task-table-part">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>检测任务列表</span>
            <el-button class="button" type="text">Operation button</el-button>
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
                <el-button plain size="small">详情</el-button>
                <el-button type="primary" plain size="small" @click="checkDetectDetail(scope.row)">检测结果</el-button>
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
import { getDetectionTaskList } from '../../network/detectionTask'

export default {
  components: {
    Timer,
  },
  setup() {
    const router = useRouter()

    const detectionTaskTable = reactive([])
    const taskQuery = reactive({
      pageNum: 1,
      pageLimit: 10,
    })
    const taskTotal = ref(0)

    const findDetectionTaskList = () => {
      getDetectionTaskList(taskQuery).then((res) => {
        taskTotal.value = res.total
        detectionTaskTable.splice(0, detectionTaskTable.length, ...res.data)
      })
    }
    onMounted(() => findDetectionTaskList())

    const filterTag = (value, row) => value === row.type

    const checkDetectDetail = (row) => {
      router.push({
        path: `/detail/${row.id}`,
      })
    }

    return {
      taskQuery,
      taskTotal,
      detectionTaskTable,
      findDetectionTaskList,
      filterTag,
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
  margin-right: 20px;
}
.detect-task-operation-inspect {
  flex: 4 0 0;
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
</style>
