<template>
  <div class="home-page">
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

      <button class="cta-button" @click="scrollToMainContent">
        물로켓 지수 확인하기
      </button>
    </section>

    <section ref="mainContentRef" class="main-content-section">
      <div class="section-header">
        <h2 class="section-title">물로켓 TOP 3</h2>
        <p class="section-subtitle">
          기대와 실제 만족도의 차이가 큰 관광지를 먼저 확인해보세요.
        </p>
      </div>

      <div class="card-grid">
        <Card
          v-for="item in rocketTop3"
          :key="item.id"
          class="rank-card"
          @click="goTouristDetail(item.id, item.raw)"
        >
          <template #header>
            <img
              :src="item.mainImage || item.thumbnailImage || fallbackImage"
              :alt="item.name"
              class="rank-card-image"
            />
          </template>

          <template #title>
            <div class="card-title-row">
              <span class="rank-badge">{{ item.rank }}위</span>
              <span class="card-title-text">{{ item.name }}</span>
            </div>
          </template>

          <template #content>
            <div class="card-body">
              <p class="card-description">
                {{ item.address || '주소 정보 없음' }}
              </p>
              <div class="card-meta">
                <Tag :value="item.score ? `${item.score}점` : '—'" severity="danger" />
                <span class="meta-text">물로켓 지수</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="section-header">
        <h2 class="section-title">명소 TOP 3</h2>
        <p class="section-subtitle">
          먼저 둘러보기 좋은 관광지를 추천해요.
        </p>
      </div>

      <div class="card-grid">
        <Card
          v-for="item in placeTop3"
          :key="item.id"
          class="rank-card"
          @click="goTouristDetail(item.id, item.raw)"
        >
          <template #header>
            <img
              :src="item.mainImage || item.thumbnailImage || fallbackImage"
              :alt="item.name"
              class="rank-card-image"
            />
          </template>

          <template #title>
            <div class="card-title-row">
              <span class="rank-badge place">{{ item.rank }}위</span>
              <span class="card-title-text">{{ item.name }}</span>
            </div>
          </template>

          <template #content>
            <div class="card-body">
              <p class="card-description">
                {{ item.address || '주소 정보 없음' }}
              </p>
            </div>
          </template>
        </Card>
      </div>

      <div class="section-header">
        <h2 class="section-title">최근 게시글</h2>
        <p class="section-subtitle">
          커뮤니티에서 방금 올라온 여행 이야기를 확인해보세요.
        </p>
      </div>

      <Card class="post-card">
        <template #content>
          <div class="post-list">
            <article
              v-for="post in recentPosts"
              :key="post.id"
              class="post-item"
              role="link"
              tabindex="0"
              @click="goPostDetail(post.id)"
              @keydown.enter="goPostDetail(post.id)"
            >
              <div class="post-item__top">
                <h3 class="post-item__title">{{ post.title }}</h3>
              </div>
              <p class="post-item__summary">{{ post.summary }}</p>
            </article>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Tag from 'primevue/tag'

// 폴백용 로컬 데이터
import { getTopTouristPlaces } from '@/assets/data/touristPlaces'

// 백엔드 서비스
import {
  fetchWaterRocketExtremes,
  fetchLocations,
  resolveLocationIdByContentId,
  resolveLocationByLocalItem,
} from '@/services/locations'

const router = useRouter()
const fallbackImage = '/images/placeholder-place.jpg'

const mainContentRef = ref(null)
const scrollToMainContent = () => {
  if (!mainContentRef.value) return
  mainContentRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const rocketTop3 = ref([])
const placeTop3 = ref([])
const loadingRocket = ref(false)
const loadingPlace = ref(false)

const mapLocationItemToCard = (item, idx, includeScore = false) => {
  const raw = item.raw ?? item
  return {
    id: item.backendId ?? item.id ?? item.location_id ?? item.content_id ?? item.contentid ?? (raw && (raw.contentid ?? raw.content_id)) ?? null,
    name: item.title ?? item.name ?? raw.title ?? '이름 없음',
    mainImage: item.firstimage ?? item.mainImage ?? raw.firstimage ?? '',
    thumbnailImage: item.firstimage2 ?? item.firstimage ?? item.thumbnailImage ?? raw.firstimage2 ?? '',
    address: item.addr1 ?? item.address ?? raw.addr1 ?? '',
    score: includeScore ? (item.water_rocket_index ?? raw.water_rocket_index ?? null) : undefined,
    rank: idx + 1,
    raw: raw,
  }
}

const loadRocketTop = async () => {
  loadingRocket.value = true
  try {
    const data = await fetchWaterRocketExtremes(3)
    const highest = data?.highest ?? []
    rocketTop3.value = (highest || []).slice(0, 3).map((it, idx) => mapLocationItemToCard(it, idx, true))
    if (!rocketTop3.value.length) {
      const local = getTopTouristPlaces(6)
      rocketTop3.value = local.slice(0, 3).map((p, i) => mapLocationItemToCard(p, i, true))
    }
  } catch (err) {
    console.error('loadRocketTop error', err)
    const local = getTopTouristPlaces(6)
    rocketTop3.value = local.slice(0, 3).map((p, i) => mapLocationItemToCard(p, i, true))
  } finally {
    loadingRocket.value = false
  }
}

const loadPlaceTop = async () => {
  loadingPlace.value = true
  try {
    const listData = await fetchLocations({ size: 3, page: 1 })
    console.debug('[HomeView] fetchLocations listData=', listData)

    // 안전 검사: items가 배열인지 확인
    let items = listData?.items ?? listData?.data ?? []
    if (!Array.isArray(items)) {
      console.debug('[HomeView] warning: items is not an array, using []', items)
      items = []
    }

    placeTop3.value = items.map((it, idx) => mapLocationItemToCard(it, idx, false))

    if (!placeTop3.value.length) {
      const local = getTopTouristPlaces(6)
      placeTop3.value = local.slice(3, 6).map((p, i) => ({ ...p, rank: i + 1 }))
    }
  } catch (err) {
    console.error('loadPlaceTop error', err)
    const local = getTopTouristPlaces(6)
    placeTop3.value = local.slice(3, 6).map((p, i) => ({ ...p, rank: i + 1 }))
  } finally {
    loadingPlace.value = false
  }
}

const loadHome = async () => {
  await Promise.all([loadRocketTop(), loadPlaceTop()])
}

onMounted(() => {
  loadHome()
})

const recentPosts = [
  { id: 1, title: '주말에 다녀온 광주 맛집 후기', summary: '가성비와 분위기를 함께 본 솔직한 방문 기록이에요.' },
  { id: 2, title: '담양 당일치기 코스 공유합니다', summary: '대중교통 기준으로 움직이기 좋은 일정으로 정리했어요.' },
  { id: 3, title: '여수 야경 스팟 추천', summary: '야경을 보기 좋은 동선과 시간대를 정리한 글이에요.' },
]

const goTouristDetail = async (placeId, localRaw) => {
  let target = placeId
  const numeric = Number(placeId)
  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    target = numeric
  } else if (localRaw && localRaw.backendId) {
    target = localRaw.backendId
  } else {
    try {
      const resolved = await resolveLocationByLocalItem(localRaw)
      if (resolved) target = resolved
      else {
        const byContent = await resolveLocationIdByContentId(placeId)
        if (byContent) target = byContent
      }
    } catch (e) {
      console.debug('goTouristDetail resolve error', e?.message ?? e)
    }
  }
  router.push(`/tourists/${target}`)
}

const goPostDetail = (postId) => {
  router.push({ name: 'post-detail', params: { id: postId } })
}
</script>

<style scoped>
.home-page {
  color: #111827;
}

.landing-section {
  min-height: calc(100vh - 88px);
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 72px 20px 90px;
  text-align: center;
}

.landing-kicker {
  margin: 0 0 8px;
  font-size: 1.1rem;
  line-height: 1.55;
  color: #6b7280;
  letter-spacing: -0.01em;
}

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

.landing-subtitle {
  margin: 2px 0 0;
  font-size: clamp(1.25rem, 2.2vw, 1.9rem);
  line-height: 1.45;
  color: #374151;
  letter-spacing: -0.02em;
}

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
  color: #111827;
  letter-spacing: -0.03em;
}

.landing-visual {
  margin: 18px 0 10px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.rocket-image {
  width: min(620px, 72vw);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 18px 28px rgba(31, 111, 235, 0.2));
  transform: rotate(-8deg);
}

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

.cta-button {
  margin-top: 18px;
  width: fit-content;
  align-self: center;
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

.main-content-section {
  padding: 48px 0 72px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  margin: 0 0 6px;
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
}

.section-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.98rem;
  line-height: 1.5;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 34px;
}

.rank-card {
  border-radius: 18px;
  border: 1px solid #dbeafe;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(31, 111, 235, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rank-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(31, 111, 235, 0.12);
}

.rank-card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 16px;
}

.card-title-text {
  font-weight: 800;
  font-size: 1.05rem;
  color: #111827;
}

.card-body {
  padding: 12px 16px 18px;
}

.card-description {
  margin: 0 0 8px;
  color: #374151;
  font-size: 0.95rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-text {
  color: #6b7280;
  font-size: 0.85rem;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1f6feb;
  font-size: 0.85rem;
  font-weight: 800;
}

/* Posts */
.post-card {
  margin-top: 12px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #eef2ff;
  cursor: pointer;
  transition: background-color 0.12s ease, transform 0.12s ease;
}

.post-item:hover {
  background: #fbfdff;
  transform: translateY(-2px);
}

.post-item__title {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
}

.post-item__summary {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .rocket-image {
    width: min(360px, 60vw);
  }
}

@media (max-width: 520px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  .landing-section {
    padding: 48px 16px 64px;
  }
  .brand-en {
    font-size: clamp(2.4rem, 10vw, 3.6rem);
  }
}
</style>