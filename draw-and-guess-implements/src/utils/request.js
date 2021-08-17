import socket from '../socket'

export function request(funcName, params) {
  return new Promise((resolve, reject) => {
    socket.emit(funcName, params, (res) => {
      resolve(res)
    })
  })
}

export function send(funcName, params) {
  socket.emit(funcName, params)
}
