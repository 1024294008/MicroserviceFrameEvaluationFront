import { createRouter, createWebHashHistory } from 'vue-router'
import DetectTask from '../pages/detectTask/DetectTask'
import DetectDetail from '../pages/detectDetail/DetectDetail'

const routes = [
  {
    path: '/',
    component: DetectTask
  },
  {
    path: '/detail/:taskId',
    component: DetectDetail
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
