// stores/counter.js
import { defineStore } from 'pinia'

export const useDirectionStore = defineStore('direction', {
  state: () => {
    return { count: 0 }
  },
    persist: true
})