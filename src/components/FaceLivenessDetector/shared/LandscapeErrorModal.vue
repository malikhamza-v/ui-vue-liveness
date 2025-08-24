<script setup lang="ts">
export interface LandscapeErrorModalProps {
  header: string
  portraitMessage: string
  landscapeMessage: string
  tryAgainText: string
}

defineProps<LandscapeErrorModalProps>()
defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="landscape-error-modal">
    <h2 class="modal-header">
      {{ header }}
    </h2>
    <p class="modal-message">
      {{ portraitMessage }}
    </p>
    <p class="modal-message">
      {{ landscapeMessage }}
    </p>
    <button class="modal-button" @click="$emit('retry')">
      {{ tryAgainText }}
    </button>
  </div>
</template>

<style scoped>
.landscape-error-modal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.modal-header {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.modal-message {
  margin: 0;
}

.modal-button {
  background-color: var(--amplify-colors-brand-primary, #0066cc);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
}

.modal-button:hover {
  background-color: var(--amplify-colors-brand-primary-90, #0052a3);
}
</style>