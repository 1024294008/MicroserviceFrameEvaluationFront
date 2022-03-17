import request from './request'

export function getQualityEvaluation(taskId) {
  return request({
    url: `/quality_evaluations/${taskId}`,
  })
}
