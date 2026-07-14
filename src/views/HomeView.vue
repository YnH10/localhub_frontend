<template>
  <div class="home-page">
    <!-- 랜딩 섹션: 브랜드 메시지 -->
    <section class="landing-section">
      <p class="landing-kicker">생각했던 관광지와 달랐던 경험,</p>

      <h1 class="landing-title">
        실제보다 <span>과대평가</span> 된 관광지에 대한 평가
      </h1>

      <p class="landing-subtitle">실망하신 경험 있으신가요?</p>

      <div class="brand-block">
        <p class="brand-en">Trapvel,</p>
        <p class="brand-ko">트랩블</p>
      </div>

      <!-- 물로켓 3D 비주얼 -->
      <div class="landing-visual">
        <img
          src="/images/rocket-3d.png"
          alt="물로켓 3D 아이콘"
          class="rocket-image"
        />
      </div>

      <p class="landing-message">
        기대했던 여행, 혹시 <strong>트랩(Trap)</strong>은 아니었나요?
      </p>

      <!-- CTA 버튼: 아래 실제 홈 콘텐츠로 이동 -->
      <button class="cta-button" @click="scrollToMainContent">
        물로켓 지수 확인하기
      </button>
    </section>

    <!-- 실제 홈 콘텐츠 섹션 -->
    <section ref="mainContentRef" class="main-content-section">
      <h2 class="section-title">물로켓 TOP 3</h2>
      <div class="card-grid">
        <Card v-for="item in rocketTop3" :key="item.name" class="top-card">
          <template #title>
            {{ item.rank }}위 {{ item.name }}
          </template>
          <template #content>
            <p class="card-text">
              물로켓 지수
              <Tag :value="`${item.score}점`" severity="danger" />
            </p>
          </template>
        </Card>
      </div>

      <h2 class="section-title">명소 TOP 3</h2>
      <div class="card-grid">
        <Card v-for="item in placeTop3" :key="item.name" class="top-card">
          <template #title>{{ item.rank }}위 {{ item.name }}</template>
          <template #content>
            <p class="card-text">사용자 만족도 기반 인기 명소</p>
          </template>
        </Card>
      </div>

      <h2 class="section-title">최근 게시글</h2>
      <Card class="post-list-card">
        <template #content>
          <div class="post-list">
            <p v-for="post in recentPosts" :key="post.id">{{ post.title }}</p>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'

// 실제 홈 콘텐츠 섹션 DOM 참조
const mainContentRef = ref(null)

// CTA 클릭 시 콘텐츠 섹션으로 부드럽게 스크롤 이동
const scrollToMainContent = () => {
  if (!mainContentRef.value) return
  mainContentRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 물로켓 TOP3 임시 데이터
const rocketTop3 = [
  { name: 'A 관광지', score: 82, rank: 1 },
  { name: 'B 관광지', score: 74, rank: 2 },
  { name: 'C 관광지', score: 69, rank: 3 },
]

// 명소 TOP3 임시 데이터
const placeTop3 = [
  { name: '광주호 호수생태원', rank: 1 },
  { name: '담양 메타세쿼이아길', rank: 2 },
  { name: '여수 오동도', rank: 3 },
]

// 최근 게시글 임시 데이터
const recentPosts = [
  { id: 1, title: '주말에 다녀온 광주 맛집 후기' },
  { id: 2, title: '담양 당일치기 코스 공유합니다' },
  { id: 3, title: '여수 야경 스팟 추천' },
]
</script>

<style scoped>
.home-page {
  color: #111827;
}

/* 랜딩 전체 폭/리듬 정리 */
.landing-section {
  min-height: calc(100vh - 88px);
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 72px 20px 90px;
}

/* 첫 문장: 보조 카피 */
.landing-kicker {
  margin: 0 0 8px;
  font-size: 1.1rem;
  line-height: 1.55;
  color: #6b7280;
  letter-spacing: -0.01em;
}

/* 메인 카피: 강한 대비 */
.landing-title {
  margin: 0;
  font-size: clamp(2.5rem, 5vw, 4.6rem);
  line-height: 1.18;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: #111827;
}

.landing-title span {
  color: #1f6feb;
}

/* 서브 카피 */
.landing-subtitle {
  margin: 2px 0 0;
  font-size: clamp(1.25rem, 2.2vw, 1.9rem);
  line-height: 1.45;
  color: #374151;
  letter-spacing: -0.02em;
}

/* 브랜드 블록 */
.brand-block {
  margin-top: 18px;
}

.brand-en {
  margin: 0;
  font-size: clamp(3rem, 5.5vw, 5rem);
  line-height: 1.02;
  font-weight: 900;
  color: #1f6feb;
  letter-spacing: -0.03em;
}

.brand-ko {
  margin: 2px 0 0;
  font-size: clamp(2.6rem, 4.6vw, 4rem);
  line-height: 1.04;
  font-weight: 900;
  letter-spacing: -0.03em;
}

/* 로켓 이미지 간격 */
.landing-visual {
  margin: 18px 0 10px;
  display: flex;
  justify-content: flex-start;
}

.rocket-image {
  width: min(620px, 72vw);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 18px 28px rgba(31, 111, 235, 0.2));
  transform: rotate(-8deg) translateX(-8px);
}

/* 하단 문장 */
.landing-message {
  margin: 8px 0 0;
  font-size: clamp(1.3rem, 2.3vw, 2rem);
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: #111827;
}

.landing-message strong {
  color: #1f6feb;
}

/* CTA 버튼: Toss 느낌의 선명한 덩어리감 */
.cta-button {
  margin-top: 18px;
  width: fit-content;
  border: 0;
  border-radius: 999px;
  background: #1f6feb;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  padding: 15px 34px;
  box-shadow: 0 10px 24px rgba(31, 111, 235, 0.24);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.cta-button:hover {
  background: #1558b0;
  transform: translateY(-2px);
}

/* 실제 콘텐츠 영역 */
.main-content-section {
  padding: 48px 0 72px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 34px;
}

.info-card {
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 16px;
  padding: 18px 16px;
  font-weight: 600;
  min-height: 82px;
}

.list-box {
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 16px;
  padding: 16px;
}

.list-box p {
  margin: 0;
  padding: 10px 0;
  border-bottom: 1px solid #eef2ff;
}

.list-box p:last-child {
  border-bottom: 0;
}

.top-card {
  border-radius: 16px;
  border: 1px solid #dbeafe;
}

.card-text {
  margin: 0;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-list-card {
  border-radius: 16px;
  border: 1px solid #dbeafe;
}

.post-list p {
  margin: 0;
  padding: 10px 0;
  border-bottom: 1px solid #eef2ff;
}

.post-list p:last-child {
  border-bottom: 0;
}
</style>