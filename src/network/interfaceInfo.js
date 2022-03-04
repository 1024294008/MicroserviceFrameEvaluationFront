import request from './request'

export function getInterfaceInfoList(msId) {
  return request({
    url: `/interface_info/${msId}`,
  })
}
