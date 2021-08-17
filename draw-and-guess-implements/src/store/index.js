import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  // 是否已连接
  connected: false,
  // 当前用户昵称
  nickname: '',
  // 房间用户列表
  nicknames: [],
  // 当前主人
  holder: '',
  // 房间绘图信息 (记录画了多少根线， 怎么画的)
  lines: []
}

const mutations = {
  updateConnectStatus(state, status) {
    state.connected = status
  },
  updateNickname(state, nickname) {
    state.nickname = nickname || ''
  },
  updateNicknames(state, nicknames) {
    state.nicknames = nicknames || []
  },
  updateHolder(state, holder) {
    state.holder = holder || ''
  },
  updateLines(state, lines) {
    state.lines = lines || []
  },
  // 将新人添加道用户列表中去
  addToNicknames(state, nickname) {
    // 如果已经添加过了  直接返回
    if (state.nicknames.includes(nickname)) return

    state.nicknames.push(nickname)
  },
  // 画线
  drawNewLine(state, newLine) {
    state.lines.push(newLine)
  },
  // 将新画的线 添加进lines数组中
  pushNewLine(state, newLine) {
    state.lines.push(newLine)
  },
  updateNewLine(state, lastLine) {
    const line = state.lines[state.lines.length - 1]
    line.points = lastLine.points
  },

  delNicknamesByNickname(state, nickname) {
    state.nicknames = state.nicknames.filter(item => item !== nickname)
  }
}

const actions = {}

const getters = {
  isGameStarted(state) {
    return !!state.holder
  },
  isGameHolder(state) {
    return state.nickname === state.holder
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
