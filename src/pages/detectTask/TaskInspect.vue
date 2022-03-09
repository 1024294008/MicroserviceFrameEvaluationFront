<template>
  <div class="task-inspect">
    <div id="projectDistribution"></div>
    <div id="successRate"></div>
  </div>
</template>

<script>
import { onMounted, watch } from 'vue'
import * as echars from 'echarts'
import { getDetectionTaskList } from '../../network/detectionTask'

export default {
  props: ['total'],
  setup(props) {
    let projectDistributionChart = null, successRateChart = null
    onMounted(() => {
      projectDistributionChart = echars.init(document.getElementById('projectDistribution'))
      successRateChart = echars.init(document.getElementById('successRate'))
    })

    const displayInspect = (detectTaskList) => {
      if (!!projectDistributionChart && !! successRateChart) {
        projectDistributionChart.setOption(
          {
            title: {
              text: '微服务架构项目分布图',
              left: 'center',
              textStyle: {
                fontSize: 12
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
                radius: '50%',
                data: [
                  { value: detectTaskList.reduce((pre, cur) => 2 === cur.type ? ++pre : pre, 0), name: '微服务架构项目' },
                  { value: detectTaskList.reduce((pre, cur) => 1 === cur.type ? ++pre : pre, 0), name: '其他架构项目' },
                  { value: detectTaskList.reduce((pre, cur) => 0 === cur.type ? ++pre : pre, 0), name: '未知' },
                ],
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
        successRateChart.setOption(
          {
            title: {
              text: '任务执行情况分布图',
              left: 'center',
              textStyle: {
                fontSize: 12
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
                radius: '50%',
                data: [
                  { value: detectTaskList.reduce((pre, cur) => 2 === cur.status ? ++pre : pre, 0), name: '执行中' },
                  { value: detectTaskList.reduce((pre, cur) => 1 === cur.status ? ++pre : pre, 0), name: '失败' },
                  { value: detectTaskList.reduce((pre, cur) => 0 === cur.status ? ++pre : pre, 0), name: '成功' },
                ],
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
    }

    watch(props, () => {
      getDetectionTaskList({
        pageNum: 1,
        pageLimit: props.total,
      }).then(res => {
        if ('200' == res.code) {
          displayInspect(res.data)
        }
      })
    })
  }
}
</script>

<style scoped>
.task-inspect {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
}
.task-inspect > div {
  flex: 1 0 0;
}
</style>
