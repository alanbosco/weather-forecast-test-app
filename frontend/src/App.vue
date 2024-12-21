<template>
  <header class="flex justify-between items-center">
    <div class="text-2xl font-bold pl-2">
      Weather Forecast App
    </div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
  </header>
  <main>
    <router-view/>
  </main>
</template>

<style>
nav {
  padding: 10px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  @apply text-primary-400
}
</style>
