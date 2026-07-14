<template>
  <div class="post-detail-page">
    <section v-if="post" class="detail-header">
      <div>
        <p class="page-kicker">Post Detail</p>
        <h1 class="page-title">{{ post.title }}</h1>
        <p class="page-subtitle">
          {{ post.region }} · {{ post.category }} · {{ post.createdAt }}
        </p>
      </div>

      <div class="action-group">
        <Button
          label="수정"
          icon="pi pi-pencil"
          class="edit-button"
          @click="openPasswordDialog"
        />
        <Button
          label="삭제"
          icon="pi pi-trash"
          severity="danger"
          outlined
          @click="confirmDelete"
        />
      </div>
    </section>

    <Card v-if="post" class="detail-card">
      <template #content>
        <div class="detail-meta">
          <Tag :value="post.category" severity="info" />
          <span>작성자 {{ post.author }}</span>
          <span>조회 {{ post.views }}</span>
          <span>댓글 {{ post.comments }}</span>
        </div>

        <div class="detail-body">
          <p>
            {{ post.content }}
          </p>
        </div>
      </template>
    </Card>

    <Card v-else class="detail-card">
      <template #content>
        <p class="empty-message">게시글이 없습니다.</p>
      </template>
    </Card>

    <Dialog
      v-model:visible="isPasswordDialogOpen"
      header="비밀번호 확인"
      modal
      :style="{ width: '420px', maxWidth: '92vw' }"
    >
      <div class="password-dialog">
        <p class="password-text">
          게시글을 수정하려면 비밀번호를 입력해주세요.
        </p>

        <InputText
          v-model="password"
          type="password"
          placeholder="비밀번호 입력"
          class="password-input"
          @keydown.enter="verifyPassword"
        />

        <div class="password-actions">
          <Button label="취소" outlined @click="closePasswordDialog" />
          <Button label="확인" @click="verifyPassword" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

const route = useRoute()
const router = useRouter()

const posts = [
  {
    id: 1,
    title: '주말에 다녀온 광주 맛집 후기',
    region: '광주',
    category: '후기',
    author: '민지',
    views: 124,
    comments: 8,
    createdAt: '2026-07-15',
    content:
      '이번 주말에 다녀온 광주 맛집 후기입니다. 분위기, 가격, 맛을 기준으로 솔직하게 정리했어요. 실제 방문해보니 기대했던 부분과 달랐던 점도 있어서 함께 남겨봅니다.',
  },
  {
    id: 2,
    title: '담양 당일치기 코스 공유합니다',
    region: '전남',
    category: '코스',
    author: '준호',
    views: 98,
    comments: 5,
    createdAt: '2026-07-14',
    content:
      '대중교통 기준으로 움직이기 좋은 담양 당일치기 코스를 정리한 글입니다. 처음 가는 분도 따라가기 쉽게 구성했어요.',
  },
]

const post = computed(() => {
  const id = Number(route.params.id)
  return posts.find((item) => item.id === id) ?? null
})

const isPasswordDialogOpen = ref(false)
const password = ref('')

const openPasswordDialog = () => {
  isPasswordDialogOpen.value = true
}

const closePasswordDialog = () => {
  isPasswordDialogOpen.value = false
  password.value = ''
}

const verifyPassword = () => {
  if (!password.value.trim()) return
  router.push(`/posts/${route.params.id}/edit`)
}

const confirmDelete = () => {
  alert('삭제 기능은 다음 단계에서 연결할 예정입니다.')
}
</script>

<style scoped>
.post-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.page-kicker {
  margin: 0 0 6px;
  color: #1f6feb;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.page-title {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.page-subtitle {
  margin: 8px 0 0;
  color: #6b7280;
  line-height: 1.5;
}

.action-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.edit-button {
  background: #1f6feb;
  border-color: #1f6feb;
  border-radius: 999px;
}

.detail-card {
  border-radius: 18px;
  border: 1px solid #dbeafe;
  box-shadow: 0 8px 18px rgba(31, 111, 235, 0.06);
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  color: #6b7280;
  margin-bottom: 18px;
}

.detail-body {
  line-height: 1.8;
  color: #374151;
  word-break: keep-all;
}

.detail-body p {
  margin: 0;
}

.empty-message {
  margin: 0;
  color: #6b7280;
}

.password-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.password-text {
  margin: 0;
  color: #374151;
  line-height: 1.5;
}

.password-input {
  width: 100%;
}

.password-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 900px) {
  .detail-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>