<script setup lang="ts">
import { SunIcon, MoonIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleTheme"
    title="Toggle theme"
    class="rounded-full"
  >
    <SunIcon v-if="isDark" class="h-5 w-5" />
    <MoonIcon v-else class="h-5 w-5" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>