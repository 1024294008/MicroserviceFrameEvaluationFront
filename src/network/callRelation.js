import request from './request'

export function getCallRelation(taskId) {
  return request({
    url: `/call_relations/${taskId}`,
  })
}
