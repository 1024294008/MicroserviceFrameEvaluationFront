<template>
  <div class="dependency-relation-top">
    <el-card class="box-card mr-20">
      <template #header>
        <div class="card-header">
          <span>模块依赖图</span>
        </div>
      </template>
      <div class="h-400">
        <DependencyRelation :taskId="taskId"/>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>服务调用关系图</span>
        </div>
      </template>
      <div class="h-400">
        <CallRelation :taskId="taskId"/>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>适应性评估</span>
        </div>
      </template>
      <div class="h-400">
        <AdaptationEvaluation :taskId="taskId"/>
      </div>
    </el-card>
  </div>
  <div class="dependency-relation-bottom">
    <el-card class="box-card mr-20" style="flex: 1 0 0;width: 350px;">
      <template #header>
        <div class="card-header">
          <span>识别日志</span>
        </div>
      </template>
      <div class="h-400">
        <el-scrollbar max-height="400px">
          <div style="padding: 3px">
            <DetectLog :taskId="taskId"/>
          </div>
        </el-scrollbar>
      </div>
    </el-card>
    <el-card class="box-card mr-20" style="flex: 4 0 0;width: 300px;">
      <template #header>
        <div class="card-header">
          <span>子服务信息</span>
        </div>
      </template>
      <div class="h-400" >
        <MicroServiceDetail :taskId="taskId"/>
      </div>
    </el-card>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import DependencyRelation from './DependencyRelation.vue'
import CallRelation from './CallRelation.vue'
import MicroServiceDetail from './MicroServiceDetail.vue'
import DetectLog from './DetectLog.vue'
import AdaptationEvaluation from './AdaptationEvaluation.vue'

export default {
  components: {
    DependencyRelation,
    CallRelation,
    MicroServiceDetail,
    DetectLog,
    AdaptationEvaluation,
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
.dependency-relation-top,
.dependency-relation-bottom {
  display: flex;
  flex-flow: row nowrap;
  padding: 10px 25px;
}
.box-card {
  flex: 1 0 0;
}
.card-header {
  height: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
