import request from './request'

export function getDependencyRelation(taskId) {
  return request({
    url: `/dependency_relations/${taskId}`,
  })
}
