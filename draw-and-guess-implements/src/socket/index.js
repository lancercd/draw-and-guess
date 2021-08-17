import io from 'socket.io-client'
import store from '@/store'
import { Notification, MessageBox } from 'element-ui'

// 创建连接
const socket = io()

// 建立连接的监听
socket.on('connect', () => {
  store.commit('updateConnectStatus', true)
})

// 断开连接的监听
socket.on('disconnect', () => {
  store.commit('updateConnectStatus', false)
})

// 停止游戏
socket.on('game_stopped', () => {
  // 清空主持人
  store.commit('updateHolder', '')
  // 清空已画的线
  store.commit('updateLines', [])

  // 显示提示信息
  Notification.info('主持人终止了游戏')
})

// 监听room_info的消息
socket.on('room_info', ({ nicknames, holder, lines }) => {
  store.commit('updateNicknames', nicknames)
  store.commit('updateHolder', holder)
  store.commit('updateLines', lines)
})

// 监听user_enter 有用户进入房间
socket.on('user_enter', nickname => {
  store.commit('addToNicknames', nickname)
})

// 处理游戏开始
socket.on('game_started', holder => {
  store.commit('updateHolder', holder)
  Notification.success(`${holder} 作为主持人开始了新游戏，大家可以开始踊跃猜答案啦！`)
})

socket.on('already_started', holder => {
  store.commit('updateHolder', holder)
  Notification.error(`游戏已经在进行中了!, 主持人是:${holder}`)
})

/**
 * 开始画线
 */
socket.on('starting_line', line => {
  store.commit('drawNewLine', line)
})

/**
 * 更新每条线的点
 */
socket.on('updating_line', line => {
  store.commit('updateNewLine', line)
})

/**
 * 猜答案
 */
socket.on('game_answered', ({ alreadyDone, success, nickname, answer }) => {
  if (nickname === store.state.nickname) {
    if (alreadyDone) {
      MessageBox.alert('答案已被其他完猜中,您不能在猜了!')
    } else if (success) {
      Notification.success('恭喜你,猜对了!')
    } else {
      Notification.error('您猜错了!')
    }
  } else {
    if (success) {
      Notification.success(`恭喜玩家: ${nickname} ,猜对了! 答案是: ${answer} `)
    } else {
      Notification.error(`玩家: ${nickname} 猜测答案为: ${answer} 猜错了!`)
    }
  }
})

socket.on('user_leave', nickname => {
  store.commit('delNicknamesByNickname', nickname)
  if (nickname === store.state.holder) {
    store.commit('updateHolder', '')
    store.commit('updateLines', [])
    Notification.info('主持人已经离开了游戏!')
  }
})

export default socket
