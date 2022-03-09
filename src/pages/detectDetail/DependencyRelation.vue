<template>
  <div id="dependencyRelation">

  </div>
</template>

<script>
import { onMounted } from 'vue'
import * as echars from 'echarts'
import { getDependencyRelation } from '../../network/dependencyRelation'
import { extractArtifact } from '../../utils'

export default {
  props: ['taskId'],
  setup(props) {
    const { taskId } = props

    const convertDependencyTreeRoot = (convertDependencyTree) => {
      convertDependencyTree.name = 'root'
      return convertDependencyTree
    }

    const convertDependencyGraphNodes = (nodes) => {
      return nodes.map(node => {
        return {
          name: extractArtifact(node.name),
          type: node.type,
        }
      })
    }

    const convertDependencyGraphLinks = (links) => {
      return links.map(link => {
        return {
          source: extractArtifact(link.source),
          target: extractArtifact(link.target),
          lineStyle: {
            color: link.type === 'Ring' ? 'red' : '#b0c4de'
          }
        }
      })
    }

    onMounted(() => {
      const chart = echars.init(document.getElementById('dependencyRelation'))
      getDependencyRelation(taskId).then((res) => {
        if ('200' === res.code) {
          if ('dependency_tree' === res.data.type) {
            chart.setOption(
              {
                tooltip: {
                  trigger: 'item',
                  triggerOn: 'mousemove'
                },
                series: [
                  {
                    type: 'tree',
                    data: [convertDependencyTreeRoot(res.data['dependency_feature'])],
                    top: '1%',
                    left: '7%',
                    bottom: '1%',
                    right: '20%',
                    itemStyle: {
                      color: '#1ba784',
                    },
                    symbol: (value, params) => { return params.data.value === 'UsedJar' || params.data.value === 'UnusedJar'
                      ? 'circle' : 'rect'},
                    symbolSize: [50, 25],
                    label: {
                      position: 'left',
                      verticalAlign: 'middle',
                      align: 'right',
                      fontSize: 9
                    },
                    leaves: {
                      label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                      }
                    },
                    emphasis: {
                      focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                  }
                ]
              }
            )
          } else if ('dependency_graph' === res.data.type) {
            chart.setOption(
              {
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                  {
                    type: 'graph',
                    layout: 'force',
                    symbol: (value, params) => { console.log(params); return params.data.value === 'UsedJar' || params.data.value === 'UnusedJar'
                      ? 'circle' : 'rect'},
                    symbolSize: [50, 25],
                    itemStyle: {
                      color: '#1ba784',
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
                    nodes: convertDependencyGraphNodes(res.data['dependency_feature'].nodes),
                    links: convertDependencyGraphLinks(res.data['dependency_feature'].links),
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
        }
      })
    })

    return {
      taskId,
    }
  }
}
</script>

<style>
#dependencyRelation {
  width: 100%;
  height: 100%;
}
</style>
