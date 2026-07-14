<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="app-header__logo">
        LocalHub
      </RouterLink>

      <nav class="app-header__nav" aria-label="주요 메뉴">
        <RouterLink to="/" class="app-header__link">홈</RouterLink>
        <RouterLink to="/posts" class="app-header__link">게시판</RouterLink>
        <RouterLink to="/posts/new" class="app-header__link">작성</RouterLink>
        <RouterLink to="/rocket" class="app-header__link">물로켓 지수</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
}

.app-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.app-header__logo {
  color: #2d6a4f;
  font-size: 1.25rem;
  font-weight: 800;
  text-decoration: none;
}

.app-header__nav {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.app-header__link {
  color: #495057;
  text-decoration: none;
  font-weight: 600;
}

.app-header__link.router-link-active {
  color: #2d6a4f;
}
</style>