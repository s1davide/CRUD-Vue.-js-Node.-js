<template>

  <q-layout v-if="loaded" view="lHh Lpr lFf" ref="layout">
    <transition-group
      appear       
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
    <q-header key="header" class="bg-secondary barraNavegacion" elevated>
      <q-toolbar >
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
           <div class="text-h6">
            Tareas-App
            <q-badge align="middle">app v1.0</q-badge>
          </div>
        </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    </transition-group>
    <q-drawer
      v-model="leftDrawerOpen"
      elevated
      content-class=" bg-secondary"
    >
    <!-- show-if-above
    bordered
    -->
      <q-list>
        <q-item-label
          header
          class="text-white"
        >
          Opciones
        </q-item-label>
        <EssentialLink
          class="text-white"
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :tarjetasInicial="tarjetasInicial" />
    </q-page-container>
  </q-layout>
</template>

<script lang="js">
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [  
  {
    title: 'Github',
    caption: 'github.com/s1davide/',
    icon: 'code',
    link: 'https://github.com/s1davide/CRUD-Vue.-js-Node.-js'
  },
]

import { defineComponent, ref } from '@vue/composition-api'
import { QSpinnerGears } from 'quasar'
export default defineComponent({
  name: 'MainLayout',
  
components: { EssentialLink },
  setup () {
    const leftDrawerOpen = ref(false)
    const essentialLinks = ref(linksData)    
    return { essentialLinks } 
  },
  mounted(){
    this.$q.loading.show({
      delay: 400, // ms
      spinner: QSpinnerGears,
      spinnerColor: 'white',
      messageColor: 'white',
      backgroundColor: 'green',
      message: 'Cargando ...'
    }) 
    this.load();
  },
  methods:{
     load(){
       let url;
      if(process.env.DEV){
        url ='http://localhost:3000/api/obtenerTodos';      
      }
      else{
        url = `${window.location.origin}/api/obtenerTodos`
      }                    
      let self =this;      
      const res= fetch(url, {
          method: 'GET',    
          mode: 'cors',  
          //body: data,                
      }).then(response =>response.json()
      ).then(data => {          
          self.tarjetasInicial =data
          this.$q.loading.hide();
          self.loaded=true; 
        });          
      }
  },
  data(){
    return {
      leftDrawerOpen: false,
      loaded: false,      
      tarjetasInicial:[],
      
    }
  }
})
</script>