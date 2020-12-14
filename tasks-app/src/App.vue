<template>
  <div  id="q-app">
    <router-view  />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import 'quasar-extras/animate/fadeIn.css'
import 'quasar-extras/animate/fadeOut.css'
// Or import them all -- but notice that your
// bundle will probably include unused ones,
// so more KB over the wire that never get used.
import 'quasar-extras/animate'
export default defineComponent({
  name: 'App'  
})
</script>
