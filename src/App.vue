<template>
  <div class="app-shell">
    <AppHeader />

    <main class="app-main">
      <router-view />
    </main>

    <!-- 공통 챗봇 플로팅 버튼 -->
    <Button class="chatbot-fab" label="챗봇" @click="goChatbot" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import AppHeader from './components/AppHeader.vue'

const router = useRouter()

// 챗봇 페이지가 준비되면 해당 경로로 이동
const goChatbot = () => {
  // 임시로 게시판으로 이동시켜 동작 확인
  router.push('/posts')
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f4f8ff;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 40px;
}

/* 우측 하단 고정 플로팅 버튼 */
.chatbot-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1200;
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(31, 111, 235, 0.25);
}
</style>