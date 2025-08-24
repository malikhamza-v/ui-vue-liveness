<script lang="ts">
import type { Component } from 'vue'
import type { CheckScreenComponents } from './FaceLivenessErrorModal.vue'
import DefaultPhotosensitiveWarning from './DefaultPhotosensitiveWarning.vue'
import DefaultRecordingIcon from './DefaultRecordingIcon.vue'
import DefaultCancelButton from './DefaultCancelButton.vue'

export type FaceLivenessDetectorComponents = StartScreenComponents & CheckScreenComponents

export interface StartScreenComponents {
  PhotosensitiveWarning?: Component
}

export { DefaultPhotosensitiveWarning, DefaultRecordingIcon, DefaultCancelButton }
</script>


<template>
  <div></div>
</template>
