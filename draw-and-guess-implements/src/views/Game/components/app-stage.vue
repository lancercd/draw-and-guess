<template>
  <el-card ref="wrapper" :body-style="{ padding: 0 }">
    <v-stage
      :config="stageConfig"
      @mousedown="mousedownHandler"
      @mouseup="mouseupHandler"
      @mousemove="mousemoveHandler"
    >
      <v-layer>
        <v-line v-for="(line, index) in lines" :key="index" :config="line"></v-line>
      </v-layer>
    </v-stage>
  </el-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { drawNewLine, updateLine } from '@/api/socket'

export default {
  data() {
    return {
      // 画布配置
      stageConfig: {
        width: 800,
        height: 700
      },
      painting: false,
      // lines: [{ stroke: '#ff0000', strokeWidth: 5, points: [100, 100, 100, 400] },{ stroke: '#ff0000', strokeWidth: 5, points: [100, 100, 100, 400] }],
      stroke: '#ffff00',
      strokeWidth: 5
    }
  },
  computed: {
    ...mapState(['nickname', 'lines']),
    ...mapGetters(['isGameStarted', 'isGameHolder'])
  },

  mounted() {
    // 将画布宽度设置与容器同宽
    this.stageConfig.width = this.$refs.wrapper.$el.offsetWidth
  },

  methods: {
    // 鼠标按下
    mousedownHandler(e) {
      if (this.isGameStarted !== true) return
      if (this.isGameHolder !== true) return
      this.painting = true
      const newLine = {
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX, e.evt.layerY]
      }
      this.$store.commit('drawNewLine', newLine)
      drawNewLine(newLine)
    },

    // 鼠标拖动
    mousemoveHandler(e) {
      if (this.painting !== true) return
      if (this.isGameStarted !== true) return

      // 绘制
      const lastLine = this.lines[this.lines.length - 1]
      lastLine.points = lastLine.points.concat([e.evt.layerX, e.evt.layerY])
      this.$store.commit('pushNewLine', lastLine)
      updateLine(lastLine)
    },

    // 鼠标释放
    mouseupHandler() {
      this.painting = false
    }
  }
}
</script>
