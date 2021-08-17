<template>
  <el-card>
    <!-- 玩家列表 -->
    <div class="panel-area">
      <ul class="participants">
        <li v-for="(name, index) in nicknames" :key="index">
          <span>{{ name }} {{ name === nickname? '(我)' : '' }}</span>
          <el-tag v-if="name === holder" size="mini">主持</el-tag>
        </li>
      </ul>
    </div>

    <!-- 按钮工具栏 -->
    <div class="panel-area button-area">
      <el-button
        v-if="!isGameStarted"
        type="primary"
        size="small"
        icon="el-icon-edit"
        @click="startGameHandler"
      >主持游戏</el-button>

      <el-button
        v-if="isGameStarted && holder === nickname"
        type="warning"
        size="small"
        icon="el-icon-delete"
        @click="stopGameHandler"
      >终止游戏</el-button>

      <el-button
        v-if="isGameStarted && holder !== nickname"
        type="success"
        size="small"
        icon="el-icon-magic-stick"
        @click="guessAnswerDialogShow"
      >猜答案</el-button>

      <el-button
        type="danger"
        size="small"
        icon="el-icon-switch-button"
        @click="exitGameHandler"
      >退出游戏</el-button>
    </div>

    <!-- 弹出框：主持人设置答案 -->
    <el-dialog
      title="请设置答案"
      :visible.sync="resultDialogVisible"
      width="30%"
    >
      <el-input v-model="expectImageName" placeholder="请输入您的答案" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="resultDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveHolderDialogHandler">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹出框：答题人设置答案 -->
    <el-dialog
      title="请填写答案"
      :visible.sync="answerDialogVisible"
      width="30%"
    >
      <el-input v-model="inputImageName" placeholder="请输入您的答案" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="answerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveAnswerDialogHandler"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { startGame } from '@/api/socket'
import { stopGame } from '@/api/socket'
import { sendGuessAnswer, exit } from '../../../api/socket'

export default {
  data() {
    return {
      resultDialogVisible: false,
      expectImageName: '',
      answerDialogVisible: false,
      inputImageName: ''
    }
  },
  computed: {
    ...mapState(['nickname', 'nicknames', 'holder']),
    ...mapGetters(['isGameStarted'])
  },
  methods: {
    startGameHandler() {
      // 开始游戏

      // 1. 清空输入框内容
      this.expectImageName = ''

      // 2. 显示弹框
      this.resultDialogVisible = true
    },
    saveHolderDialogHandler() {
      // 1. 校验答案是否为空
      if (!this.expectImageName) {
        this.$message.error('答案不能为空哦!')
        return
      }
      // 2. 发送开始游戏的申请
      startGame(this.expectImageName)

      // 3. 关闭弹框
      this.resultDialogVisible = false
    },

    guessAnswerDialogShow() {
      this.answerDialogVisible = true
      this.inputImageName = ''
    },

    saveAnswerDialogHandler() {
      if (!this.inputImageName) {
        this.$message.error('答案不能为空!')
      }

      // 发送消息到服务器
      sendGuessAnswer(this.inputImageName)

      // 隐藏输入框
      this.answerDialogVisible = false
    },

    stopGameHandler() {
      this.$confirm('确定要终止游戏吗?', '提示').then(() => {
        stopGame()
      }).catch(e => {
        console.log(e)
      })
    },

    exitGameHandler() {
      this.$confirm('确定退出游戏吗？', '提示').then(() => {
        exit(this.nickname)

        // 跳转到登录页面
        this.$router.replace('/login')

        // 修改用户名
        this.$store.commit('updateNickname', '')
        localStorage.removeItem('nickname')
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-area {
  margin: 10px 0;
}
</style>
