<template>
  <div class="dependency-relation-top">
    <el-card class="box-card mr-20">
      <template #header>
        <div class="card-header">
          <span>模块依赖图</span>
          <el-button class="button" type="text">Operation button</el-button>
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
          <el-button class="button" type="text">Operation button</el-button>
        </div>
      </template>
      <div>
      </div>
    </el-card>
  </div>
  <el-card class="box-card mr-20" style="width: 350px; margin-left: 25px">
    <template #header>
      <div class="card-header">
        <span>识别日志</span>
      </div>
    </template>
    <div class="h-400" style="overflow-y: auto; padding: 3px">
      <DetectLog :taskId="taskId"/>
    </div>
  </el-card>
</template>

<script>
import { useRoute } from 'vue-router'
import DependencyRelation from '../detectDetail/DependencyRelation.vue'
import CallRelation from '../detectDetail/CallRelation.vue'
import DetectLog from '../detectDetail/DetectLog.vue'

export default {
  components: {
    DependencyRelation,
    CallRelation,
    DetectLog,
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

<style>
.dependency-relation-top {
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
