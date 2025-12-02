<script setup>
import Header from './Header.vue'
import Menu from './Menu.vue'
import { menuWidthStore } from "../../stores/menu.js";
const menuStore = menuWidthStore()
</script>

<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
        <el-aside :width="menuStore.menuWidth">
          <Menu></Menu>
        </el-aside>
        <el-main>
        <router-view></router-view>
        </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>