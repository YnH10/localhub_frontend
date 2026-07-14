<template>
  <div class="post-list-page">
    <section class="page-header">
      <div>
        <p class="page-kicker">Community Board</p>
        <h1 class="page-title">게시판 목록</h1>
        <p class="page-subtitle">광주/전라 여행 이야기와 후기들을 확인해보세요.</p>
      </div>

      <Button
        label="글쓰기"
        icon="pi pi-pencil"
        class="write-button"
        @click="goCreatePage"
      />
    </section>

    <Card class="search-card">
      <template #content>
        <div class="search-row">
          <span class="p-input-icon-left search-input-wrap">
            <i class="pi pi-search" />
            <InputText
              v-model="searchKeyword"
              placeholder="제목, 내용, 지역으로 검색"
              class="search-input"
            />
          </span>

          <Button
            label="검색"
            icon="pi pi-search"
            class="search-button"
            @click="applySearch"
          />
        </div>
      </template>
    </Card>

    <Card class="list-card">
      <template #content>
        <div class="post-list">
          <article
            v-for="post in paginatedPosts"
            :key="post.id"
            class="post-item"
            @click="goDetailPage(post.id)"
          >
            <div class="post-item__top">
              <div class="post-item__meta">
                <Tag :value="post.category" severity="info" />
                <span class="post-item__region">{{ post.region }}</span>
              </div>
              <span class="post-item__date">{{ post.createdAt }}</span>
            </div>

            <h2 class="post-item__title">{{ post.title }}</h2>
            <p class="post-item__summary">{{ post.summary }}</p>

            <div class="post-item__bottom">
              <span>작성자 {{ post.author }}</span>
              <span>조회 {{ post.views }}</span>
              <span>댓글 {{ post.comments }}</span>
            </div>
          </article>

          <div v-if="paginatedPosts.length === 0" class="empty-state">
            검색 결과가 없습니다.
          </div>
        </div>
      </template>
    </Card>

    <Paginator
      :rows="rowsPerPage"
      :totalRecords="filteredPosts.length"
      :first="firstRecord"
      template="PrevPageLink PageLinks NextPageLink"
      class="post-paginator"
      @page="onPageChange"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'

const router = useRouter()

// 검색어
const searchKeyword = ref('')

// 페이지네이션
const currentPage = ref(0)
const rowsPerPage = 5

// 임시 게시글 데이터
const posts = ref([
  {
    id: 1,
    title: '주말에 다녀온 광주 맛집 후기',
    summary: '가성비와 분위기를 함께 본 솔직한 방문 기록이에요.',
    category: '후기',
    region: '광주',
    author: '민지',
    views: 124,
    comments: 8,
    createdAt: '2026-07-15',
  },
  {
    id: 2,
    title: '담양 당일치기 코스 공유합니다',
    summary: '대중교통 기준으로 움직이기 좋은 일정으로 정리했어요.',
    category: '코스',
    region: '전남',
    author: '준호',
    views: 98,
    comments: 5,
    createdAt: '2026-07-14',
  },
  {
    id: 3,
    title: '여수 야경 스팟 추천',
    summary: '야경을 보기 좋은 동선과 시간대를 정리한 글이에요.',
    category: '추천',
    region: '전남',
    author: '하린',
    views: 211,
    comments: 14,
    createdAt: '2026-07-13',
  },
  {
    id: 4,
    title: '전주 한옥마을 낮/밤 분위기 차이',
    summary: '낮과 밤에 각각 어떤 느낌인지 직접 비교해봤어요.',
    category: '후기',
    region: '전북',
    author: '서윤',
    views: 76,
    comments: 3,
    createdAt: '2026-07-12',
  },
  {
    id: 5,
    title: '순천만 국가정원 산책 코스',
    summary: '처음 가는 분도 쉽게 따라갈 수 있게 정리한 산책 코스예요.',
    category: '코스',
    region: '전남',
    author: '지훈',
    views: 158,
    comments: 11,
    createdAt: '2026-07-11',
  },
  {
    id: 6,
    title: '군산 근대거리 사진 찍기 좋은 포인트',
    summary: '사진 남기기 좋은 장소 위주로 정리한 짧은 후기예요.',
    category: '추천',
    region: '전북',
    author: '소라',
    views: 132,
    comments: 6,
    createdAt: '2026-07-10',
  },
])

// 검색어를 적용한 필터 목록
const filteredPosts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  if (!keyword) return posts.value

  return posts.value.filter((post) => {
    return (
      post.title.toLowerCase().includes(keyword) ||
      post.summary.toLowerCase().includes(keyword) ||
      post.region.toLowerCase().includes(keyword) ||
      post.category.toLowerCase().includes(keyword)
    )
  })
})

// 현재 페이지에 보여줄 목록
const paginatedPosts = computed(() => {
  const start = currentPage.value * rowsPerPage
  return filteredPosts.value.slice(start, start + rowsPerPage)
})

// 첫 레코드 인덱스
const firstRecord = computed(() => currentPage.value * rowsPerPage)

// 검색 적용 시 첫 페이지로 이동
const applySearch = () => {
  currentPage.value = 0
}

// 페이지 변경
const onPageChange = (event) => {
  currentPage.value = event.page
}

// 검색어가 바뀌면 페이지를 첫 페이지로 되돌림
watch(searchKeyword, () => {
  currentPage.value = 0
})

// 게시글 상세로 이동
const goDetailPage = (postId) => {
  router.push(`/posts/${postId}`)
}

// 작성 페이지로 이동
const goCreatePage = () => {
  router.push('/posts/new')
}
</script>

<style scoped>
.post-list-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
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

.write-button {
  border-radius: 999px;
  background: #1f6feb;
  border-color: #1f6feb;
}

.search-card,
.list-card,
.post-paginator {
  border-radius: 18px;
  border: 1px solid #dbeafe;
  box-shadow: 0 8px 18px rgba(31, 111, 235, 0.06);
}

.search-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input-wrap {
  flex: 1;
}

.search-input {
  width: 100%;
}

.search-button {
  border-radius: 999px;
  background: #1f6feb;
  border-color: #1f6feb;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.post-item {
  padding: 16px 0;
  border-bottom: 1px solid #eef2ff;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.post-item:hover {
  transform: translateY(-1px);
}

.post-item:last-child {
  border-bottom: 0;
}

.post-item__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}

.post-item__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.post-item__region,
.post-item__date {
  color: #6b7280;
  font-size: 0.92rem;
}

.post-item__title {
  margin: 0 0 8px;
  font-size: 1.08rem;
  font-weight: 800;
  color: #111827;
}

.post-item__summary {
  margin: 0 0 10px;
  color: #374151;
  line-height: 1.55;
  word-break: keep-all;
}

.post-item__bottom {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  color: #6b7280;
  font-size: 0.92rem;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
  color: #6b7280;
}

.post-paginator {
  padding: 6px 0;
}

@media (max-width: 900px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>