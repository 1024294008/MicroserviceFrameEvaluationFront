import request from './request'

export function getMicroServiceList(taskId) {
  return request({
    url: `/microservices/${taskId}`,
  })
}
