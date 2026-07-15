<template>
  <div class="tourist-detail-page">
    <section v-if="place" class="page-header">
      <div>
        <p class="page-kicker">Tourist Review</p>
        <h1 class="page-title">{{ place.title || place.name || place.titleKor || place.nameKor }}</h1>
        <p class="page-subtitle">
          {{ place.addr1 || place.address || '주소 정보 없음' }}
        </p>
      </div>

      <Button label="목록으로" outlined icon="pi pi-arrow-left" @click="goBack" />
    </section>

    <Card v-if="resolving" class="hero-card">
      <template #content>
        <div style="padding:16px;text-align:center">서버 매핑 중...</div>
      </template>
    </Card>

    <Card v-else-if="!backendId" class="empty-card">
      <template #content>
        <p class="empty-message">이 관광지는 백엔드에 매핑되어 있지 않습니다. (contentId: {{ localContentId }})</p>
      </template>
    </Card>

    <Card v-else-if="place" class="hero-card">
      <template #content>
        <div class="hero-grid">
          <div class="hero-image-wrap">
            <img
              :src="place.firstimage || place.mainImage || fallbackImage"
              :alt="place.title || place.name"
              class="hero-image"
            />
          </div>

          <div class="hero-info">
            <div class="score-box">
              <p class="score-label">물로켓 지수</p>
              <h2 class="score-value">{{ formattedWaterRocketScore }}</h2>
              <p class="score-helper">
                서버 기반 지수를 우선 표시합니다. (후기 반영)
              </p>
            </div>

            <div class="info-list">
              <div class="info-item">
                <span class="info-item__label">지역</span>
                <span class="info-item__value">{{ place.region || place.sigungucode }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">주소</span>
                <span class="info-item__value">{{ place.addr1 || place.address || '주소 정보 없음' }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">콘텐츠 ID</span>
                <span class="info-item__value">{{ place.content_id ?? place.contentid ?? localContentId }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card v-if="backendId" class="review-card">
      <template #content>
        <div class="section-title-row">
          <div>
            <h2 class="section-title">관광 평가</h2>
            <p class="section-subtitle">관광 전/후 점수는 5점 만점으로 입력하세요. 댓글 등록 시 4자리 비밀번호를 설정해야 합니다.</p>
          </div>
        </div>

        <form class="review-form" @submit.prevent="submitReview">
          <div class="form-grid">
            <div class="field">
              <label for="beforeScore">관광 전 점수</label>
              <select id="beforeScore" v-model.number="form.beforeScore" class="select">
                <option v-for="score in scoreOptions" :key="`before-${score}`" :value="score">
                  {{ score }}점
                </option>
              </select>
            </div>

            <div class="field">
              <label for="afterScore">관광 후 점수</label>
              <select id="afterScore" v-model.number="form.afterScore" class="select">
                <option v-for="score in scoreOptions" :key="`after-${score}`" :value="score">
                  {{ score }}점
                </option>
              </select>
            </div>
          </div>

          <div class="field">
            <label for="comment">댓글</label>
            <Textarea
              id="comment"
              v-model="form.comment"
              rows="5"
              autoResize
              placeholder="관광 후 느낀 점을 남겨보세요."
              class="textarea"
            />
          </div>

          <div class="field">
            <label for="pw">비밀번호 (삭제용, 숫자 4자리)</label>
            <input
              id="pw"
              v-model="form.password"
              inputmode="numeric"
              maxlength="4"
              placeholder="예: 1234"
              class="p-inputtext p-component"
            />
          </div>

          <div class="form-footer">
            <div class="preview-box">
              <span>현재 물로켓 지수 미리보기</span>
              <strong>{{ previewScore.toFixed(1) }}</strong>
            </div>

            <Button type="submit" label="평가 등록" icon="pi pi-check" :disabled="submitting" />
          </div>
        </form>
      </template>
    </Card>

    <section v-if="backendId" class="comments-section">
      <div class="section-title-row">
        <div>
          <h2 class="section-title">댓글</h2>
          <p class="section-subtitle">관광 경험을 자유롭게 공유해보세요.</p>
        </div>
        <Tag :value="`${comments.length}개`" severity="info" />
      </div>

      <Card class="comments-card">
        <template #content>
          <div v-if="loadingComments" style="padding:18px;text-align:center">댓글 불러오는 중...</div>

          <div v-else-if="comments.length > 0" class="comment-list">
            <article v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-item__top">
                <strong class="comment-author">{{ comment.author || '익명' }}</strong>
                <span class="comment-date">{{ formatDate(comment.created_at || comment.createdAt) }}</span>
              </div>

              <p class="comment-text">{{ comment.content ?? comment.text }}</p>

              <div class="comment-meta">
                <Button text icon="pi pi-trash" class="p-button-text" @click="confirmDelete(comment)" />
              </div>
            </article>
          </div>

          <div v-else class="empty-state">
            아직 등록된 댓글이 없습니다.
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'

// services
import {
  fetchLocation,
  fetchWaterRocketIndex,
  resolveLocationIdByContentId,
} from '@/services/locations'
import {
  fetchComments,
  createComment as createCommentApi,
  deleteComment as deleteCommentApi,
} from '@/services/comment'
import {
  createPreVisitEvaluation,
  createPostVisitEvaluation,
  fetchPreVisitEvaluations,
  fetchPostVisitEvaluations,
} from '@/services/evaluations'

const route = useRoute()
const router = useRouter()

const fallbackImage = '/images/placeholder-place.jpg'
const scoreOptions = [1, 2, 3, 4, 5]

const localContentId = route.params.id

const backendId = ref(null)
const resolving = ref(true)

const place = ref(null)
const comments = ref([])
const loadingComments = ref(false)
const serverIndex = ref(null)
const submitting = ref(false)

const form = reactive({
  beforeScore: 5,
  afterScore: 3,
  comment: '',
  password: '',
})

const loadPlace = async () => {
  if (!backendId.value) {
    place.value = null
    return
  }
  try {
    const data = await fetchLocation(backendId.value)
    place.value = data || null
  } catch (err) {
    console.error('loadPlace error', err)
    place.value = null
  }
}

const loadComments = async () => {
  if (!backendId.value) {
    comments.value = []
    return
  }
  loadingComments.value = true
  try {
    const data = await fetchComments(backendId.value)
    comments.value = data.items ?? data.data ?? data ?? []
  } catch (err) {
    console.error('loadComments error', err)
    comments.value = []
  } finally {
    loadingComments.value = false
  }
}

const loadWaterRocketIndex = async () => {
  if (!backendId.value) {
    serverIndex.value = null
    return
  }
  try {
    const data = await fetchWaterRocketIndex(backendId.value)
    if (data == null) serverIndex.value = null
    else serverIndex.value = Number(data.score ?? data.value ?? data.water_rocket_index ?? data)
  } catch (err) {
    console.warn('loadWaterRocketIndex error, trying fallback via evaluations', err)
    try {
      const [preList, postList] = await Promise.all([
        fetchPreVisitEvaluations(backendId.value).catch(() => []),
        fetchPostVisitEvaluations(backendId.value).catch(() => []),
      ])
      const avg = (arr, keyCandidates) => {
        if (!arr || !arr.length) return null
        const sum = arr.reduce((s, item) => {
          for (const k of keyCandidates) {
            if (item[k] !== undefined && item[k] !== null) return s + Number(item[k])
          }
          return s
        }, 0)
        return sum / arr.length
      }
      const preAvg = avg(preList, ['expectation_score'])
      const postAvg = avg(postList, ['satisfaction_score'])
      if (preAvg !== null && postAvg !== null) {
        serverIndex.value = preAvg - postAvg
      } else {
        serverIndex.value = null
      }
    } catch (e) {
      console.error('fallback water rocket calc failed', e)
      serverIndex.value = null
    }
  }
}

const resolveAndLoad = async () => {
  resolving.value = true
  backendId.value = await resolveLocationIdByContentId(localContentId)
  resolving.value = false
  if (backendId.value) {
    await Promise.all([loadPlace(), loadComments(), loadWaterRocketIndex()])
  } else {
    // optional: nothing to load
    place.value = null
    comments.value = []
    serverIndex.value = null
  }
}

onMounted(() => {
  resolveAndLoad()
})

watch(() => route.params.id, async () => {
  // update localContentId reference is route.params.id; re-resolve backend id
  await resolveAndLoad()
})

const waterRocketScore = computed(() => {
  const sv = serverIndex.value
  if (sv !== null && sv !== undefined && !Number.isNaN(Number(sv))) {
    return Number(sv) || 0
  }
  return 0
})

const formattedWaterRocketScore = computed(() => {
  return (waterRocketScore.value || 0).toFixed(1)
})

const previewScore = computed(() => {
  return form.beforeScore - form.afterScore
})

const submitReview = async () => {
  if (!backendId.value) {
    alert('해당 관광지는 서버에 매핑되어 있지 않습니다.')
    return
  }
  const text = (form.comment || '').trim()
  if (!text) {
    alert('후기를 입력하세요.')
    return
  }
  if (!/^\d{4}$/.test(String(form.password))) {
    alert('비밀번호는 숫자 4자리 숫자여야 합니다.')
    return
  }

  submitting.value = true
  try {
    // 먼저 평가(별도 엔드포인트), 그 다음 댓글을 등록
    await createPreVisitEvaluation(backendId.value, {
      author: '익명',
      expectation_score: Number(form.beforeScore),
    })
    await createPostVisitEvaluation(backendId.value, {
      author: '익명',
      satisfaction_score: Number(form.afterScore),
    })
    await createCommentApi(backendId.value, {
      author: '익명',
      content: text,
      password: String(form.password),
    })

    // 갱신
    await loadComments()
    await loadWaterRocketIndex()

    // 리셋
    form.beforeScore = 5
    form.afterScore = 3
    form.comment = ''
    form.password = ''
  } catch (err) {
    console.error('submitReview error', err)
    alert(err.response?.data?.detail || err.message || '등록에 실패했습니다.')
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async (comment) => {
  const pw = prompt('해당 댓글의 삭제 비밀번호(숫자 4자리)를 입력하세요.')
  if (!pw) return
  if (!/^\d{4}$/.test(String(pw))) {
    alert('비밀번호는 숫자 4자리 숫자여야 합니다.')
    return
  }
  try {
    await deleteCommentApi(comment.id, pw)
    await loadComments()
    await loadWaterRocketIndex()
  } catch (err) {
    console.error('deleteComment error', err)
    alert(err.response?.data?.detail || '삭제 실패했습니다.')
  }
}

const formatDate = (iso) => {
  if (!iso) return ''
  return iso.slice(0, 10)
}

const goBack = () => {
  router.push('/tourists')
}
</script>

<style scoped>
/* 기존 스타일 그대로 재사용 (필요시 로컬 스타일 보강) */
</style>