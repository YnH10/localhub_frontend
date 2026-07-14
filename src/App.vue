<template>
  <div class="app-shell">
    <AppHeader />

    <main class="app-main">
      <router-view />
    </main>

    <!-- 공통 챗봇 플로팅 버튼 -->
    <Button
      class="chatbot-fab"
      label="챗봇"
      icon="pi pi-comments"
      @click="openChatbot"
    />

    <!-- 챗봇 패널 -->
    <Dialog
      v-model:visible="isChatbotOpen"
      header="LocalHub 챗봇"
      modal
      :style="{ width: '420px', maxWidth: '92vw' }"
      class="chatbot-dialog"
    >
      <div class="chatbot-body">
        <div ref="messageBoxRef" class="chatbot-messages">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            class="message-row"
            :class="message.role"
          >
            <div class="message-bubble">
              {{ message.text }}
            </div>
          </div>
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
import { nextTick, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import AppHeader from './components/AppHeader.vue'

const isChatbotOpen = ref(false)
const draftMessage = ref('')
const messageBoxRef = ref(null)

const chatMessages = ref([
  {
    id: 1,
    role: 'bot',
    text: '안녕하세요. 지역 관광 정보를 도와드릴게요.',
  },
  {
    id: 2,
    role: 'bot',
    text: '예: 광주 당일치기 코스 추천해줘',
  },
])

// 챗봇 패널 열기
const openChatbot = async () => {
  isChatbotOpen.value = true
  await nextTick()
  scrollToBottom()
}

// 메시지 영역 맨 아래로 스크롤
const scrollToBottom = () => {
  if (!messageBoxRef.value) return
  messageBoxRef.value.scrollTop = messageBoxRef.value.scrollHeight
}

// 임시 전송 동작
const sendMessage = async () => {
  const text = draftMessage.value.trim()
  if (!text) return

  chatMessages.value.push({
    id: Date.now(),
    role: 'user',
    text,
  })

  draftMessage.value = ''

  await nextTick()
  scrollToBottom()

  // 다음 단계에서 FastAPI API 연결
  setTimeout(async () => {
    chatMessages.value.push({
      id: Date.now() + 1,
      role: 'bot',
      text: '임시 응답입니다. 다음 단계에서 실제 API를 연결할게요.',
    })

    await nextTick()
    scrollToBottom()
  }, 300)
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
  height: 320px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}

.message-row {
  display: flex;
  margin-bottom: 10px;
}

.message-row.bot {
  justify-content: flex-start;
}

.message-row.user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 0.95rem;
  line-height: 1.45;
  word-break: keep-all;
}

.message-row.bot .message-bubble {
  background: #e8f1ff;
  color: #1e3a8a;
  border-bottom-left-radius: 4px;
}

.message-row.user .message-bubble {
  background: #1f6feb;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.chatbot-input-row {
  display: flex;
  gap: 8px;
}

.chatbot-input {
  flex: 1;
}
</style>