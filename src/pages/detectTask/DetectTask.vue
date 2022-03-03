<template>
  <h1>Detect Task</h1>
</template>

<script>
import { onMounted } from 'vue'
import { getDetectionTaskList } from '../../network/detectionTask'

export default {
  setup() {
    onMounted(() => {
      getDetectionTaskList({
        pageNum: 1,
        pageLimit: 3
      }).then(res => {
        console.log('success')
        console.log(res)
      })
    })
  }
}
</script>

<style>

</style>