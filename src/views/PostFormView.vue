<template>
  <div class="post-form-page">
    <section class="page-header">
      <div>
        <p class="page-kicker">{{ isEditMode ? 'Edit Post' : 'Create Post' }}</p>
        <h1 class="page-title">
          {{ isEditMode ? '게시글 수정' : '게시글 작성' }}
        </h1>
        <p class="page-subtitle">
          {{ isEditMode ? '기존 게시글 내용을 수정해보세요.' : '새로운 여행 이야기를 작성해보세요.' }}
        </p>
      </div>
    </section>

    <Card class="form-card">
      <template #content>
        <form class="post-form" @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="field">
              <label for="title">제목</label>
              <InputText
                id="title"
                v-model="form.title"
                placeholder="게시글 제목을 입력하세요"
                class="input"
              />
            </div>

            <div class="field">
              <label for="password">비밀번호</label>
              <Password
                id="password"
                v-model="form.password"
                toggleMask
                :feedback="false"
                placeholder="수정/삭제용 비밀번호"
                class="input"
              />
            </div>
          </div>

          <div class="field">
            <label for="content">내용</label>
            <Textarea
              id="content"
              v-model="form.content"
              rows="10"
              autoResize
              placeholder="게시글 내용을 입력하세요"
              class="input"
            />
          </div>

          <div class="button-group">
            <Button type="button" label="취소" outlined @click="goBack" />
            <Button
              type="submit"
              :label="isEditMode ? '수정 완료' : '작성 완료'"
              icon="pi pi-check"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Textarea from 'primevue/textarea'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => route.path.includes('/edit'))

const form = reactive({
  title: '',
  password: '',
  content: '',
})

watch(
  isEditMode,
  (mode) => {
    if (!mode) {
      form.title = ''
      form.password = ''
      form.content = ''
      return
    }

    form.title = '주말에 다녀온 광주 맛집 후기'
    form.password = ''
    form.content =
      '이번 주말에 다녀온 광주 맛집 후기입니다. 분위기, 가격, 맛을 기준으로 솔직하게 정리했어요.'
  },
  { immediate: true },
)

const handleSubmit = () => {
  if (isEditMode.value) {
    router.push(`/posts/${route.params.id}`)
    return
  }

  router.push('/posts')
}

const goBack = () => {
  if (isEditMode.value) {
    router.push(`/posts/${route.params.id}`)
    return
  }

  router.push('/posts')
}
</script>

<style scoped>
.post-form-page {
  display: flex;
  flex-direction: column;
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

.form-card {
  border-radius: 18px;
  border: 1px solid #dbeafe;
  box-shadow: 0 8px 18px rgba(31, 111, 235, 0.06);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-weight: 800;
  color: #111827;
}

.input {
  width: 100%;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>