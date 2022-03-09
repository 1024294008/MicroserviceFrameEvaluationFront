<template>
  <div id="callRelation">

  </div>
</template>

<script>
import { onMounted } from 'vue'
import * as echars from 'echarts'
import { getCallRelation } from '../../network/callRelation'

export default {
  props: ['taskId'],
  setup(props) {
    const { taskId } = props

    const convertCallGraphNodes = (nodes) => {
      return nodes.map(node => {
        return {
          name: node.belongService,
        }
      })
    }

    const convertCallGraphLinks = (links) => {
      const linkMap = {}
      const result = []

      links.forEach(link => {
        const key = link.source + '@@@' + link.target
        if (!Reflect.has(linkMap, key)) {
          linkMap[key] = [link.apiInfo]
        } else linkMap[key].push(link.apiInfo)
      })

      for (let key in linkMap) {
        result.push({
          source: key.split('@@@')[1],
          target: key.split('@@@')[0],
          label: {
            show: true,
            formatter: linkMap[key].join('\n'),
            fontSize: 10
          },
        })
      }

      return result
    }

    onMounted(() => {
      const chart = echars.init(document.getElementById('callRelation'))
      getCallRelation(taskId).then(res => {
        if ('200' === res.code) {
          chart.setOption(
            {
              tooltip: {},
              animationDurationUpdate: 1500,
              animationEasingUpdate: 'quinticInOut',
              series: [
                {
                  type: 'graph',
                  layout: 'force',
                  symbol: 'rect',
                  symbolSize: [80, 40],
                  itemStyle: {
                  },
                  roam: true,
                  label: {
                    show: true
                  },
                  edgeSymbol: ['circle', 'arrow'],
                  edgeSymbolSize: [4, 10],
                  edgeLabel: {
                    fontSize: 20
                  },
                  layout: 'circular',
                  nodes: convertCallGraphNodes(res.data['call_feature'].nodes),
                  links: convertCallGraphLinks(res.data['call_feature'].links),
                  lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0,
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
#callRelation {
  width: 100%;
  height: 100%;
}
</style>
