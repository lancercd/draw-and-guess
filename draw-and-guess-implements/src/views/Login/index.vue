<template>
  <div>
    <el-card
      class="login-card"
      :body-style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px'}"
    >
      <el-form ref="loginForm" inline :model="formData" :rules="rules">
        <el-form-item prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入您的昵称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="enterGame">进入游戏</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { checkUserExist } from '@/api/socket'
import { MessageBox } from 'element-ui'

export default {
  data() {
    return {
      // 表单信息
      formData: {
        nickname: ''
      },

      // 校验规则
      rules: {
        nickname: [{ required: true, message: '请输入您的昵称' }]
      }
    }
  },

  methods: {
    enterGame() {
      this.$refs.loginForm.validate(flag => {
        if (!flag) return
        const nickname = this.formData.nickname

        this.checkAndDisPatch(nickname)
      })
    },
    checkAndDisPatch(nickname) {
      checkUserExist(nickname).then(isExist => {
        console.log(isExist)
        if (isExist === false) {
          localStorage.setItem('nickname', nickname)

          this.$router.replace('/home')
        } else {
          MessageBox.alert('昵称已被占用!')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 50%;
  margin: 200px auto;
}
</style>
