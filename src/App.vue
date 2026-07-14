<template>
  <div class="app-shell">
    <AppHeader />

    <main class="app-main">
      <router-view />
    </main>

    <!-- 공통 챗봇 플로팅 버튼 -->
    <Button class="chatbot-fab" label="챗봇" icon="pi pi-comments" @click="openChatbot" />

    <!-- 챗봇 패널 (임시 UI) -->
    <Dialog
      v-model:visible="isChatbotOpen"
      header="LocalHub 챗봇"
      modal
      :style="{ width: '420px' }"
      class="chatbot-dialog"
    >
      <div class="chatbot-body">
        <div class="chatbot-messages">
          <div class="msg bot">안녕하세요. 지역 관광 정보를 도와드릴게요.</div>
          <div class="msg bot">예: 광주 당일치기 코스 추천해줘</div>
        </div>

        <div class="chatbot-input-row">
          <InputText
            v-model="draftMessage"
            placeholder="메시지를 입력하세요"
            class="chatbot-input"
            @keydown.enter="sendMessage"
          />
          <Button label="전송" @click="sendMessage" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import AppHeader from './components/AppHeader.vue'

const isChatbotOpen = ref(false)
const draftMessage = ref('')

// 챗봇 패널 열기
const openChatbot = () => {
  isChatbotOpen.value = true
}

// 임시 전송 동작 (다음 단계에서 API 연결)
const sendMessage = () => {
  if (!draftMessage.value.trim()) return
  draftMessage.value = ''
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

.chatbot-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1200;
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(31, 111, 235, 0.25);
}

.chatbot-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chatbot-messages {
  height: 260px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}

.msg {
  margin-bottom: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.95rem;
}

.msg.bot {
  background: #e8f1ff;
  color: #1e3a8a;
}

.chatbot-input-row {
  display: flex;
  gap: 8px;
}

.chatbot-input {
  flex: 1;
}
</style>