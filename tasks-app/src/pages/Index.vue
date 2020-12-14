<template>
  <div >
    <transition-group
      appear       
      enter-active-class="animated bounceIn"
      leave-active-class="animated bounceOut"
    >
      <h4 key="titulo" class="titulo text-center">Lista de Tareas </h4>
    </transition-group>
  <q-page  class="row items-center justify-evenly">
    <lista-tareas    
      :tarjetasInicial="tarjetasInicial" 
      title="Example component"
      active
    ></lista-tareas>    
  </q-page>
  </div>
</template>

<script lang="ts">

import ListaTareas from 'components/ListaTareas.vue'
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  props:{
    tarjetasInicial:{
      type:Array,
      required: true      
    }},
  name: 'PageIndex',
  components: { ListaTareas }
  
  
})
</script>
