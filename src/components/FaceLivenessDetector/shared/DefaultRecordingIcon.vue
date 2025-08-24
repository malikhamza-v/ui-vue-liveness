<!--
Copyright 2025 [name of copyright owner]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
  <div :class="LivenessClassNames.RecordingIconContainer">
    <RecordingIconComponent>{{ recordingIndicatorText }}</RecordingIconComponent>
  </div>
</template>

<script setup lang="ts">
import RecordingIconComponent from './RecordingIcon.vue'
import { LivenessClassNames } from '../types/classNames'

interface Props {
  recordingIndicatorText: string
}

defineProps<Props>()
</script>
