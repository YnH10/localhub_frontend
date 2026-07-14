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
        <article class="info-card">1위 관광지 (임시)</article>
        <article class="info-card">2위 관광지 (임시)</article>
        <article class="info-card">3위 관광지 (임시)</article>
      </div>

      <h2 class="section-title">명소 TOP 3</h2>
      <div class="card-grid">
        <article class="info-card">1위 명소 (임시)</article>
        <article class="info-card">2위 명소 (임시)</article>
        <article class="info-card">3위 명소 (임시)</article>
      </div>

      <h2 class="section-title">최근 게시글</h2>
      <div class="list-box">
        <p>최근 게시글 1 (임시)</p>
        <p>최근 게시글 2 (임시)</p>
        <p>최근 게시글 3 (임시)</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 실제 홈 콘텐츠 섹션 DOM 참조
const mainContentRef = ref(null)

// CTA 클릭 시 콘텐츠 섹션으로 부드럽게 스크롤 이동
const scrollToMainContent = () => {
  if (!mainContentRef.value) return
  mainContentRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.home-page {
  color: #111827;
}

/* 랜딩 영역 */
.landing-section {
  min-height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  padding: 64px 12px 80px;
}

.landing-kicker {
  font-size: 1.1rem;
  color: #4b5563;
  margin: 0;
}

.landing-title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.landing-title span {
  color: #1f6feb;
}

.landing-subtitle {
  margin: 0;
  font-size: clamp(1.2rem, 2.5vw, 1.7rem);
  color: #374151;
}

.brand-block {
  margin-top: 8px;
}


.brand-en {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 900;
  color: #1f6feb;
  line-height: 1.05;
}

.brand-ko {
  margin: 0;
  font-size: clamp(2rem, 4.3vw, 3.3rem);
  font-weight: 900;
  line-height: 1.05;
}

.landing-message {
  margin: 16px 0 0;
  font-size: clamp(1.2rem, 2.2vw, 1.8rem);
  line-height: 1.45;
}

.landing-message strong {
  color: #1f6feb;
}

.cta-button {
  margin-top: 22px;
  width: fit-content;
  border: 0;
  border-radius: 999px;
  background: #1f6feb;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 14px 30px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.cta-button:hover {
  background: #1558b0;
  transform: translateY(-1px);
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

.landing-visual {
  margin: 10px 0 4px;
  display: flex;
  justify-content: flex-start;
}

.rocket-image {
  width: min(560px, 70vw);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 18px 28px rgba(31, 111, 235, 0.2));
  transform: rotate(-8deg);
}
</style>