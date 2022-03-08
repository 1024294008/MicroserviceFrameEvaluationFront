<template>
  <el-timeline>
    <el-timeline-item
      v-for="(log, index) in logs"
      :key="index"
      :size="log.size"
      :icon="log.icon"
      :type="log.type"
      :hollow="log.hollow"
      :timestamp="log.timestamp"
    >
      {{ log.content }}
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import { onMounted, reactive, markRaw } from 'vue'
import { Check, Close} from '@element-plus/icons-vue'
import { getDetectionTask } from '../../network/detectionTask'

export default {
  props: ['taskId'],
  setup(props) {
    const { taskId } = props
    const logs = reactive([])

    onMounted(() => {
      getDetectionTask(taskId).then(res => {
        if ('200' === res.code) {
          const rawLogs = res.data.log.split('\n').filter(rawLog => '' !== rawLog.trim())
          logs.push(...rawLogs.map(rawLog => {
            const sections = rawLog.split(' ')
            const type = sections[0]
            const timestamp = sections[1] + ' ' + sections[2]
            const content = rawLog.substring(type.length + timestamp.length + 2)
            return {
              size: 'large',
              timestamp,
              content,
              icon: type === '[INFO]' ? markRaw(Check) : markRaw(Close),
              hollow: false,
              type: type === '[INFO]' ? 'primary' : 'danger',
            }
          }))
        }
      })
    })

    return {
      logs,
    }
  }

}
</script>

<style>

</style>
