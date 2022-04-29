<template>
  <div class="availability-evaluation-container">
    <el-table
      ref="securityEvaluationTableRef"
      :data="securityEvaluationTable"
      border
      highlight-current-row
      max-height="200"
      style="width: 180px; flex: 1 0 0; font-size: 12px"
    >
      <el-table-column label="服务名" header-align="center" show-overflow-tooltip prop="serviceName">
      </el-table-column>
      <el-table-column label="安全组件" header-align="center" show-overflow-tooltip prop="securityComponent">
      </el-table-column>
      <el-table-column label="服务自调用" header-align="center" show-overflow-tooltip prop="selfInvocation">
      </el-table-column>
    </el-table>
    <div></div>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
import { getQualityEvaluation } from '../../network/qualityEvaluation'

export default {
  props: ['taskId'],
  setup(props) {
    const { taskId } = props
    const securityEvaluationTable = reactive([])

    onMounted(() => {
      getQualityEvaluation(taskId).then(res => {
        if ('200' === res.code) {
          securityEvaluationTable.splice(0, securityEvaluationTable.length, ...res.data.map(qualityEvaluation => {
            return {
              serviceName: qualityEvaluation.serviceName,
              securityComponent: qualityEvaluation.securityComponent || 'x',
              selfInvocation: qualityEvaluation.selfInvocation || '√',
            }
          }))
        }
      })
    })

    return {
      securityEvaluationTable,
    }
  }
}
</script>

<style scoped>
.availability-evaluation-container {
  display: flex;
  flex-flow: row nowrap;
}
</style>
