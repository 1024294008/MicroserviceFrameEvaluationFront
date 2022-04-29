<template>
  <div class="availability-evaluation-container">
    <el-table
      ref="availabilityEvaluationTable"
      :data="availabilityEvaluationTable"
      class="service-table"
      border
      highlight-current-row
      max-height="200"
      style="width: 180px; flex: 1 0 0; font-size: 12px"
    >
      <el-table-column label="服务名" header-align="center" show-overflow-tooltip prop="serviceName">
      </el-table-column>
      <el-table-column label="负载均衡组件" header-align="center" show-overflow-tooltip prop="loadBalanceComponent">
      </el-table-column>
      <el-table-column label="环依赖" header-align="center" show-overflow-tooltip>
        <template #default>
          {{ hasCircle ? '有环' : '无环' }}
        </template>
      </el-table-column>
      <el-table-column label="服务注册中心组件" header-align="center" show-overflow-tooltip prop="serviceRegistryCenter">
      </el-table-column>
      <el-table-column label="CPA评估" header-align="center" show-overflow-tooltip prop="cpa">
      </el-table-column>
    </el-table>
    <div></div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { getQualityEvaluation } from '../../network/qualityEvaluation'
import { getDependencyRelation } from '../../network/dependencyRelation'

export default {
  props: ['taskId'],
  setup(props) {
    const { taskId } = props
    const availabilityEvaluationTable = reactive([])
    const hasCircle = ref(false)

    onMounted(() => {
      getQualityEvaluation(taskId).then(res => {
        if ('200' === res.code) {
          availabilityEvaluationTable.splice(0, availabilityEvaluationTable.length, ...res.data.map(qualityEvaluation => {
            return {
              serviceName: qualityEvaluation.serviceName,
              loadBalanceComponent: qualityEvaluation.loadBalanceComponent || 'x',
              serviceRegistryCenter: qualityEvaluation.serviceRegistryCenter || 'x',
              cpa: qualityEvaluation.cpa || 'x',
            }
          }))
        }
      })
      getDependencyRelation(taskId).then((res) => {
        if ('200' === res.code) {
          if ('dependency_tree' === res.data.type) hasCircle.value = false
          else if ('dependency_graph' === res.data.type) hasCircle.value = true
        }
      })
    })

    const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex > 1) {
        if (rowIndex === 0) {
          return {
            rowspan: availabilityEvaluationTable.length,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
    }

    return {
      availabilityEvaluationTable,
      arraySpanMethod,
      hasCircle,
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
