import { request, send } from '@/utils/request'

/**
 * 判断用户名是否已被占用
 * @param nickname nickname
 * @returns {*}
 */
export function checkUserExist(nickname) {
  return request('check_user_exist', nickname)
}

/**
 * 向服务器发送该用户进入的消息信息
 * @param nickname nickname
 * @returns {*}
 */
export function sendUserEnter(nickname) {
  return send('enter', nickname)
}

/**
 * 终止游戏
 */
export function stopGame() {
  send('stop_game')
}

/**
 * 开始游戏
 *    主持人开始游戏，并预设答案
 * @param answer  预设答案
 * @returns {*}
 */
export function startGame(answer) {
  send('start_game', answer)
}

/**
 * 绘制新线
 * @param newLine
 */
export function drawNewLine(newLine) {
  send('new_line', newLine)
}

/**
 * 更新绘制的线的点
 * @param line
 */
export function updateLine(line) {
  send('update_line', line)
}

/**
 * 发送用户猜的答案
 * @param ans 猜的答案
 */
export function sendGuessAnswer(ans) {
  send('answer_game', ans)
}

/**
 * 退出游戏
 */
export function exit(nickname) {
  send('leave', nickname)
}
