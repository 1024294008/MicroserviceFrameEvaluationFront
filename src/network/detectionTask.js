import request from './request'

export function getDetectionTaskList(params) {
  return request({
    url: '/detection_tasks',
    params,
  })
}

export function startDetect(data) {
  return request({
    method: 'post',
    url: '/detection_tasks/start_detect',
    data,
  })
}
