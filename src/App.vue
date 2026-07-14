<template>
  <div class="app-shell">
    <nav class="debug-nav">
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/posts">게시판</RouterLink>
      <RouterLink to="/posts/new">작성</RouterLink>
      <RouterLink to="/posts/1">상세</RouterLink>
      <RouterLink to="/posts/1/edit">수정</RouterLink>
      <RouterLink to="/rocket">물로켓</RouterLink>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f8f9fa;
}

.debug-nav {
  display: flex;
  gap: 12px;
  padding: 16px;
  flex-wrap: wrap;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.debug-nav a {
  color: #2d6a4f;
  text-decoration: none;
  font-weight: 600;
}
</style>