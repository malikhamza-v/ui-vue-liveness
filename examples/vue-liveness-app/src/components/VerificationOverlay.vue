<template>
  <div
    v-if="show && result"
    class="overlay-backdrop"
    @click="handleClose"
  >
    <div class="modal-content" @click.stop>
      <div v-if="result.isVerified" class="verified-content">
        <div class="icon-container success">
          <div class="checkmark">✓</div>
        </div>
        <h2 class="title">🎉 Verification Success!</h2>
        <p class="message">
          Congratulations! You've been verified with {{ result.confidence }}% confidence
        </p>
      </div>

      <div v-else class="failed-content">
        <div class="icon-container danger">
          <div class="cross">✗</div>
        </div>
        <h2 class="title">🚨 Verification Failed</h2>
        <p class="message">
          Oops! We detected potential spoofing with {{ result.confidence }}% confidence
        </p>
      </div>

      <button @click="handleTryAgain" class="close-button">
        🔄 Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  result: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'tryAgain'])

const handleClose = () => {
  emit('close')
}

const handleTryAgain = () => {
  emit('tryAgain')
}
</script>

<style scoped>
.overlay-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  margin: 1rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  animation: bounceIn 0.5s ease forwards;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.icon-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  animation: pulse 2s infinite;
}

.icon-container.success {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.icon-container.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.message {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

.close-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.close-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.verified-content, .failed-content {
  animation: fadeInUp 0.7s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
