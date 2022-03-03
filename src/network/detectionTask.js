import request from './request'

export function getDetectionTaskList(params) {
  return request({
    url: '/detection_tasks',
    params,
  })
}
