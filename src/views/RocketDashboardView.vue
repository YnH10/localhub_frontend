<template>
  <div class="rocket-dashboard-page">
    <section class="page-header">
      <div>
        <p class="page-kicker">Rocket Index</p>
        <h1 class="page-title">물로켓 지수 대시보드</h1>
        <p class="page-subtitle">
          기대와 실제 만족도의 차이를 바탕으로 관광지별 과대평가 지수를 보여줘요.
        </p>
      </div>
    </section>

    <section class="summary-grid">
      <Card class="summary-card">
        <template #content>
          <p class="summary-label">전체 관광지 수</p>
          <h2 class="summary-value">{{ summary.totalPlaces }}</h2>
        </template>
      </Card>

      <Card class="summary-card">
        <template #content>
          <p class="summary-label">평균 물로켓 지수</p>
          <h2 class="summary-value">{{ summary.averageScore }}점</h2>
        </template>
      </Card>

      <Card class="summary-card">
        <template #content>
          <p class="summary-label">후기 3개 이상 관광지</p>
          <h2 class="summary-value">{{ summary.validPlaces }}</h2>
        </template>
      </Card>
    </section>

    <section class="content-grid">
      <Card class="ranking-card">
        <template #title>
          <div class="section-title-row">
            <span>관광지 랭킹</span>
            <Tag value="TOP 5" severity="danger" />
          </div>
        </template>

        <template #content>
          <div class="ranking-list">
            <article v-for="place in rocketRanking" :key="place.id" class="ranking-item">
              <div class="ranking-item__left">
                <span class="rank-badge">{{ place.rank }}위</span>
                <div>
                  <h3 class="place-name">{{ place.name }}</h3>
                  <p class="place-meta">
                    기대도 {{ place.expectation }} · 만족도 {{ place.satisfaction }}
                  </p>
                </div>
              </div>

              <div class="ranking-item__right">
                <Tag :value="`${place.score}점`" :severity="getSeverity(place.score)" />
                <span class="review-count">후기 {{ place.reviewCount }}개</span>
              </div>
            </article>
          </div>
        </template>
      </Card>

      <Card class="chart-card">
        <template #title>
          <div class="section-title-row">
            <span>물로켓 지수 차트</span>
            <Tag value="BAR CHART" severity="info" />
          </div>
        </template>

        <template #content>
          <div class="chart-wrap">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import Card from 'primevue/card'
import Tag from 'primevue/tag'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// 임시 요약 데이터
const summary = {
  totalPlaces: 12,
  averageScore: 68,
  validPlaces: 9,
}

// 임시 랭킹 데이터
const rocketRanking = [
  {
    id: 1,
    rank: 1,
    name: 'A 관광지',
    score: 82,
    expectation: 4.5,
    satisfaction: 2.1,
    reviewCount: 18,
  },
  {
    id: 2,
    rank: 2,
    name: 'B 관광지',
    score: 74,
    expectation: 4.2,
    satisfaction: 2.4,
    reviewCount: 15,
  },
  {
    id: 3,
    rank: 3,
    name: 'C 관광지',
    score: 69,
    expectation: 4.0,
    satisfaction: 2.6,
    reviewCount: 12,
  },
  {
    id: 4,
    rank: 4,
    name: '담양 메타세쿼이아길',
    score: 58,
    expectation: 4.6,
    satisfaction: 3.2,
    reviewCount: 11,
  },
  {
    id: 5,
    rank: 5,
    name: '여수 오동도',
    score: 45,
    expectation: 4.4,
    satisfaction: 3.5,
    reviewCount: 10,
  },
]

// 차트 데이터
const chartData = computed(() => ({
  labels: rocketRanking.map((place) => place.name),
  datasets: [
    {
      label: '물로켓 지수',
      data: rocketRanking.map((place) => place.score),
      backgroundColor: ['#DC3545', '#DC3545', '#FFC107', '#FFC107', '#40C057'],
      borderRadius: 10,
    },
  ],
}))

// 차트 옵션
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.raw}점`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
      },
      grid: {
        color: '#e5eefc',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

// 점수에 따른 태그 색상
const getSeverity = (score) => {
  if (score >= 70) return 'danger'
  if (score >= 40) return 'warning'
  return 'success'
}
</script>

<style scoped>
.rocket-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.summary-card,
.ranking-card,
.chart-card {
  border-radius: 18px;
  border: 1px solid #dbeafe;
  box-shadow: 0 8px 18px rgba(31, 111, 235, 0.06);
}

.summary-label {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 0.95rem;
}

.summary-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 900;
  color: #1f6feb;
  letter-spacing: -0.03em;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 14px;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #eef2ff;
}

.ranking-item:last-child {
  border-bottom: 0;
}

.ranking-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1f6feb;
  font-size: 0.85rem;
  font-weight: 800;
}

.place-name {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 800;
  color: #111827;
}

.place-meta {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 0.92rem;
}

.ranking-item__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.review-count {
  color: #6b7280;
  font-size: 0.9rem;
}

.chart-wrap {
  height: 360px;
}

@media (max-width: 1024px) {
  .summary-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>