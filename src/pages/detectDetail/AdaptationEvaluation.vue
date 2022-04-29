<template>
  <div id="adaptationEvaluation">
  </div>
</template>

<script>
import { onMounted } from 'vue'
import * as echars from 'echarts'
import { getQualityEvaluation } from '../../network/qualityEvaluation'

export default {
  props: ['taskId'],
  setup(props) {
    const { taskId } = props

    onMounted(() => {
      const chart = echars.init(document.getElementById('adaptationEvaluation'))
      getQualityEvaluation(taskId).then(res => {
        if ('200' === res.code) {
          chart.setOption(
            {
              title: {
                text: '',
                left: 'center',
                textStyle: {
                }
              },
              tooltip: {
                trigger: 'item',
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                show: false,
              },
              series: [
                {
                  name: '数量',
                  type: 'pie',
                  radius: ['40%', '70%'],
                  data: res.data.map(evaluation => ({value: evaluation.adaptation, name: evaluation.serviceName})),
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            }
        )
        }
      })
    })
  }
}
</script>

<style scoped>
#adaptationEvaluation {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
