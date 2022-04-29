<template>
  <div class="dependency-detail">
    <div class="dependency-detail-log mr-20">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>识别日志</span>
          </div>
        </template>
        <div>
          <el-scrollbar max-height="100%">
            <div style="padding: 3px">
              <DetectLog :taskId="taskId"/>
            </div>
          </el-scrollbar>
        </div>
      </el-card>
    </div>
    <div class="dependency-detail-content">
      <div class="dependency-detail-content-graph">
        <div class="dependency-detail-content-graph-relation mr-20">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>模块依赖图</span>
              </div>
            </template>
            <div style="height: 300px">
              <DependencyRelation :taskId="taskId"/>
            </div>
          </el-card>
        </div>
        <div class="dependency-detail-content-graph-call">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>服务调用关系图</span>
              </div>
            </template>
            <div style="height: 300px">
              <CallRelation :taskId="taskId"/>
            </div>
          </el-card>
        </div>
      </div>
      <div class="dependency-detail-content-service">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>子服务信息</span>
            </div>
          </template>
          <div style="height: 300px">
            <MicroServiceDetail :taskId="taskId"/>
          </div>
        </el-card>
      </div>
      <div class="dependency-detail-content-evaluation">
        <div class="dependency-detail-content-evaluation-availability">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>可用性评估</span>
              </div>
            </template>
            <div style="height: 200px">
              <AvailabilityEvaluation :taskId="taskId"/>
            </div>
          </el-card>
        </div>
        <div class="dependency-detail-content-evaluation-adaptation">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>适应性评估</span>
              </div>
            </template>
            <div style="height: 200px">
              <AdaptationEvaluation :taskId="taskId"/>
            </div>
          </el-card>
        </div>
        <div class="dependency-detail-content-evaluation-security">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>安全性评估</span>
              </div>
            </template>
            <div style="height: 200px">
              <SecurityEvaluation :taskId="taskId"/>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import DependencyRelation from './DependencyRelation.vue'
import CallRelation from './CallRelation.vue'
import MicroServiceDetail from './MicroServiceDetail.vue'
import DetectLog from './DetectLog.vue'
import AvailabilityEvaluation from './AvailabilityEvaluation.vue'
import AdaptationEvaluation from './AdaptationEvaluation.vue'
import SecurityEvaluation from './SecurityEvaluation.vue'

export default {
  components: {
    DependencyRelation,
    CallRelation,
    MicroServiceDetail,
    DetectLog,
    AvailabilityEvaluation,
    AdaptationEvaluation,
    SecurityEvaluation,
  },
  setup() {
    const route = useRoute()
    const { taskId } = route.params

    return {
      taskId
    }
  }
}
</script>

<style scoped>
.dependency-detail {
  width: 100vw;
  display: flex;
  flex-flow: row nowrap;
  padding: 10px 25px;
}
.dependency-detail-log {
  flex: 1 0 0;
}
.dependency-detail-content {
  display: flex;
  flex-flow: column nowrap;
  flex: 4 0 0;
}
.dependency-detail-content-graph {
  display: flex;
  flex-flow: row nowrap;
  flex: 1 0 0;
  margin-bottom: 20px;
}
.dependency-detail-content-graph-relation,
.dependency-detail-content-graph-call {
  flex: 1 0 0;
}
.dependency-detail-content-service {
  flex: 1 0 0;
  margin-bottom: 20px;
}
.dependency-detail-content-evaluation {
  display: flex;
  flex-flow: row nowrap;
  flex: 1 0 0;
}
.dependency-detail-content-evaluation-availability,
.dependency-detail-content-evaluation-adaptation,
.dependency-detail-content-evaluation-security {
  flex: 1 0 0;
}
.dependency-detail-content-evaluation-adaptation {
  margin: 0 20px;
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
