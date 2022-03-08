<template>
  <div class="micro-service-container">
    <el-table
      ref="microServiceListTableRef"
      :data="microServiceListTable"
      class="service-table"
      border
      highlight-current-row
      max-height="400"
      @current-change="dispalyInterfaceDetail"
    >
      <el-table-column label="服务名" show-overflow-tooltip width="200" prop="serviceName">
      </el-table-column>
      <el-table-column label="入口模块" show-overflow-tooltip width="200" prop="moduleName">
      </el-table-column>
      <el-table-column label="端口号" show-overflow-tooltip prop="port">
      </el-table-column>
      <el-table-column label="启动类" show-overflow-tooltip width="200" prop="entryClass">
      </el-table-column>
      <el-table-column label="上下文路径" width="200" show-overflow-tooltip>
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <span style="margin-left: 10px">{{ scope.context || '/' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="注册地址" show-overflow-tooltip prop="registryUrl">
      </el-table-column>
    </el-table>
    <div class="interface-table" v-show="showInterfaceTable">
      <el-button class="interface-close" circle :icon="Close" @click="closeInterfaceTable"></el-button>
      <el-table
        :data="interfaceListTable"
        v-loading="interfaceTableLoading"
        border
        max-height="400"
      >
        <el-table-column label="所属控制器类" show-overflow-tooltip width="200" prop="belongClass">
        </el-table-column>
        <el-table-column label="请求类型" show-overflow-tooltip width="100" prop="requestType">
        </el-table-column>
        <el-table-column label="请求路径" show-overflow-tooltip width="200" prop="requestPath">
        </el-table-column>
        <el-table-column label="请求参数" show-overflow-tooltip width="200" prop="requestParam">
        </el-table-column>
        <el-table-column label="返回值" show-overflow-tooltip width="200" prop="returnResult">
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { getMicroServiceList } from '../../network/microService'
import { getInterfaceInfoList } from '../../network/interfaceInfo'

export default {
  props: ['taskId'],
  components: {
    Close,
  },
  setup(props) {
    const { taskId } = props
    const microServiceListTableRef = ref(null)
    const microServiceListTable = reactive([])
    const interfaceListTable = reactive([])
    const showInterfaceTable = ref(false)
    const interfaceTableLoading = ref(false)

    onMounted(() => {
      getMicroServiceList(taskId).then(res => {
        if ('200' === res.code) {
          microServiceListTable.splice(0, microServiceListTable.length, ...res.data)
        }
      })
    })

    const dispalyInterfaceDetail = (row) => {
      if (!row) return
      showInterfaceTable.value = true
      interfaceTableLoading.value = true
      getInterfaceInfoList(row.id).then(res => {
        interfaceListTable.splice(0, interfaceListTable.length, ...res.data)
        interfaceTableLoading.value = false
      })
    }

    const closeInterfaceTable = () => {
      showInterfaceTable.value = false
      microServiceListTableRef.value.setCurrentRow()
    }

    return {
      microServiceListTableRef,
      microServiceListTable,
      interfaceListTable,
      showInterfaceTable,
      interfaceTableLoading,
      dispalyInterfaceDetail,
      Close,
      closeInterfaceTable,
    }
  }
}
</script>

<style scoped>
.micro-service-container {
  display: flex;
  flex-flow: row nowrap;
}
.service-table {
  flex: 1 0 0;
}
.interface-table {
  flex: 1 0 0;
  margin-left: 10px;
  position: relative;
  display: inline-block;
}
.interface-close {
  position: absolute;
  width: 10px;
  height: 10px;
  right: -5px;
  top: -5px;
  z-index: 10;
  box-shadow: 0px 0px 2px #ccc;
}
</style>
