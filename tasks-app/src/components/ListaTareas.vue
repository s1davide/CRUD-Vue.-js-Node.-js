<template>
  <div>
   
    <q-dialog v-model="modal">
        <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{tituloForm}}</div>
        </q-card-section>
        <q-card-section class="q-py-none">
          <q-form class="formulario" @submit="onSubmit($event.target)">
            <q-input name="TaskId" autofocus filled  v-model="idTarjeta"  label="Id de la Nota" :dense="true" lazy-rules :rules="[
                 val => val !== null && val !== '' || 'Porfavor Ingrese el Id de la Nota', val => !isNaN(val) || 'Ingrese un Id Válido',
                 val => this.idVerificar=== parseInt(val)?true:this.originalTarjetas.find(x=>x.TaskId===parseInt(val))===undefined||  'El id ingresado ya existe'
            ]" />
            <q-input name="Name" filled v-model="nombreTarjeta" class="q-my-sm" label="Nombre de la Nota" :dense="true" lazy-rules :rules="[
                 val => val !== null && val !== '' || 'Porfavor ingrese el Nombre de la Nota'
            ]"  />
            <template>              
              <div class="q-my-sm" >
                <q-input name="DeadLine" label="Vencimiento" readonly filled :dense="true" v-model="date" lazy-rules 
                :rules="[
                         val =>this.fechaHoy()  || 'La fecha y hora debe ser posterior a la actual'
                      ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="date" @input="cerrarSelectorFecha('date')" mask="YYYY/MM/DD HH:mm" :format24h="false" today-btn                          >
                          <div class="row items-center justify-end">
                            <q-btn id="btnFecha" v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time  v-model="date" @input="cerrarSelectorFecha('hour')" mask="YYYY/MM/DD HH:mm" :format24h="false">
                          <div class="row items-center justify-end">
                          <q-btn id="btnHora" v-close-popup label="Close" color="primary" flat />
                          </div>
                      </q-time>              
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </template>
            <q-card-actions align="right" class="q-px-none text-primary">
              <q-btn flat color="blue-grey" class="closeForm" label="Cancelar"  v-close-popup />
              <q-btn flat  :color="colorBoton" :label="labelBoton" type="submit" />
            </q-card-actions>
            </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <transition-group
      appear       
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
    <q-form  key="elem" class="q-mx-lg"  style="display: flex; flex-direction: column;" @submit="filtro($event.target)">            
      <q-input label="Buscar" class="inputBuscar" v-model="vrBusqueda" filled lazy-rules :dense="true">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon name="close"  @click="vrBusqueda = ''; filtro($event.target)" class="cursor-pointer" />
        </template>
        <template v-slot:hint>
          Field hint
        </template>
      </q-input>
      <q-btn class="q-mt-sm" type="submit" color="secondary">Buscar</q-btn>
    </q-form>
</transition-group>
  <transition-group
      appear       
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
     <q-carousel
     key="carouselAnimate"
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated             
      arrows
      control-color="black"
      prev-icon="arrow_left"
      next-icon="arrow_right"           
      class="rounded-borders q-mb-sm tamanoCarousel"
      style="height: 530px; width: 100%"
    >    
    
    <q-carousel-slide v-for="(slide,key, index) in slidesMostrar" :key="index"  :name="slide.id"  class="column no-wrap flex-center">     
     <div  class="q-pa-xl row justify-center q-gutter-xl">     
      <q-card  v-for="tarjeta in slide"  :key="tarjeta.TaskId" class="tarjeta">  <!--   -->
        <q-card-section class="bg-primary text-white">
          <q-badge align="top">Id: {{tarjeta.TaskId}} </q-badge> 
          <div class="text-h6">{{tarjeta.Name}}             
          </div>
          <div class="text-subtitle2">Vencimiento: {{convierteFecha("tarjeta",tarjeta.DeadLine) }}</div>
        </q-card-section>
        <q-card-actions class="justify-center">
          <q-btn color="primary" @click="abrirModal('modificar',tarjeta)" flat>Modificar</q-btn>
          <q-btn color="red" @click="borrar(tarjeta.TaskId)" flat>Borrar</q-btn>
        </q-card-actions>
      </q-card>          
    </div>          
    </q-carousel-slide>    
     </q-carousel>
     </transition-group>    
     
     <transition-group
      appear       
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
    <div key="pagination" class="row justify-center">
    <q-pagination      
      class="q-mx-lg"
      color="teal"
      @click="setPagination()"
      v-model="pagination"
      :max="options"
      :direction-links="true"
      :boundary-links="true"
      icon-first="skip_previous"
      icon-last="skip_next"
      icon-prev="fast_rewind"
      icon-next="fast_forward"
    >
    </q-pagination>   
    </div>
     </transition-group>
      
      <transition-group
      appear       
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      
    >   
      <q-page-sticky key="sticky" position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add_task" color="primary" @click="abrirModal('agregar')">
          <q-tooltip>
            Agregar Tarea
          </q-tooltip>
        </q-btn>
      </q-page-sticky>
      </transition-group>
  </div>
  
</template>

<script lang="js">
import {
  defineComponent, PropType, computed, ref, toRef, Ref
} from '@vue/composition-api'

import { Notify } from 'quasar'
import { QSpinnerGears } from 'quasar'
export default defineComponent({    
  name: 'CompositionComponent',    
  props:{
    tarjetasInicial:{
      type:Array,
      required: true      
  }},
  
  mounted(){    
    this.organizarTarjetas(this.tarjetasInicial); 
    this.originalTarjetas = this.tarjetasInicial;
    let pagination = this.setPagination;
    document.querySelector('.q-carousel__slides-container').addEventListener('transitionend', function(event) { pagination('slide');}, false);         
  },
  data() {
    return {
      modal: false,
      tarjetas: [],
      /////Form
      idVerificar: '',
      idTarjeta: '',
      nombreTarjeta: '',
      date: '2020/09/09 12:00 AM',
      accionSubmit: 'agregar',
      tituloForm:'Nueva Tarea',
      labelBoton:'Agregar',      
      colorBoton: 'positive',
      /////Form
      ////Carousel
      slide: '0',
      options : 0,
      slidesMostrar: [],
      pagination: 1,
      ////Carousel      
      ////Busqueda
      vrBusqueda: '',
      originalTarjetas: [],
      ////Busqueda
      ////Input Time
      saveDate: '',      
      ////Input Time
      ///Primer Inicio
      cargadaPagina: false
      ///Primer Inicio
      
    }
  },
  
  methods:{
    abrirModal (accion, info){
        this.modal = true;
        this.accionSubmit = accion;        
        if(accion=='modificar'){
          this.idVerificar = info.TaskId;
          this.idTarjeta = info.TaskId;
          this.nombreTarjeta = info.Name;     
          this.date = this.convierteFecha('',info.DeadLine)
          this.tituloForm = 'Modificar Tarea';     
          this.labelBoton = 'Modificar';
          this.colorBoton= 'primary';
        }
        else{
          this.idVerificar = '';
          this.idTarjeta = '';
          this.nombreTarjeta = '';     
          this.date = this.convierteFecha('',Date.now())
          this.tituloForm = 'Nueva Tarea';     
          this.labelBoton = 'Agregar';
          this.colorBoton= 'positive';
        }        
        this.guardaFecha();
    },
    organizarTarjetas(tarjetas){
        this.slidesMostrar = [];
        this.tarjetas = tarjetas;        
        let cantidadItems = 2;
        let cantidadSlides  =this.tarjetas.length/cantidadItems;
        let diferencia = cantidadSlides-parseInt(cantidadSlides);
        let tarjetasRestantes =this.tarjetas.length;
        let tarjetasSlide = 0;
        let tarjetasAgregadas=0;
        cantidadSlides = diferencia>0 ? parseInt(cantidadSlides)+1: cantidadSlides;
        this.options =0
        for(let i = 0; i<cantidadSlides; i++){                               
              tarjetasSlide =  tarjetasRestantes<cantidadItems ? tarjetasRestantes  :cantidadItems              
              this.slidesMostrar.push([]);              
               for(var a = 0;a<tarjetasSlide; a++){                                          
                this.slidesMostrar[i].push(this.tarjetas[tarjetasAgregadas])
                this.slidesMostrar[i].id = ''+i+'';
                tarjetasRestantes-=1                
                tarjetasAgregadas+=1;                
              } 
        }         
        if(cantidadSlides-1>=0){
          this.slide= parseInt(this.slide) > (cantidadSlides-1)?(cantidadSlides-1).toString(): this.slide  
        }
        
        
        this.options= cantidadSlides;
    },
    onSubmit(frm){
       // this.modal = false;               
      if(this.accionSubmit=='agregar'){
        this.agregar(frm);
      }
      if(this.accionSubmit=='modificar'){
        this.modificar(frm);        
      }
      document.querySelector('.closeForm').click()
    },
    ////////////////////////////////////CLIENTE////////////////////////////////////
    ////////////////////////////////////CLIENTE////////////////////////////////////
    ////////////////////////////////////CLIENTE////////////////////////////////////
    obtenerTodos (){
      let url;
      if(process.env.DEV){
        url= 'http://localhost:3000/api/obtenerTodos';      
      }
      else{
        url = `${window.location.origin}/api/obtenerTodos/`
      }      
      let self =this;      
      this.pantallaCargando("mostrar")
      const res= fetch(url, {
          method: 'GET',    
          mode: 'cors',  
          //body: data,                
      }).then(response =>response.json()
      ).then(data => {this.organizarTarjetas(data); this.originalTarjetas = data; this.pantallaCargando("")});
    },
    agregar(frm){    
      let url;
      if(process.env.DEV){
        url ='http://localhost:3000/api/save';      
      }
      else{
        url = `${window.location.origin}/api/save`
      }              
      let data = new FormData(frm);                     
      let headContent ={}
      let self = this;
      this.pantallaCargando("mostrar")
      fetch(url, {
          method: 'POST',          
          body: data,         
          //headers: head           
      }).then(function(response) {
          return response.json();
      }).then(function(json) {
          self.obtenerTodos();
          self.pantallaCargando("")
          self.notificacion(json.res == 'Agregado'?'positivo':'negativo',json.res == 'Agregado'?'agregada':'agregar');          
      }).catch(function (error) {
          self.pantallaCargando("")
          self.notificacion('negativo','agregar')            
      })
    },
    modificar(frm){
      let url;
      if(process.env.DEV){
        url ='http://localhost:3000/api/update';      
      }
      else{
        url = `${window.location.origin}/api/update`
      }                    
      let data = new FormData(frm);      
      data.append('TaskIdActual', this.idVerificar);
      let headContent ={}
      let self = this;
      this.pantallaCargando("mostrar")
      fetch(url, {
          method: 'POST',          
          body: data,         
          //headers: head           
      }).then(function(response) {
          return response.json();
      }).then(function(json) {
          self.obtenerTodos();
          self.pantallaCargando("")
          self.notificacion(json.res == 'Modificado'?'positivo':'negativo',json.res == 'Modificado'?'modificada':'modificar');
      }).catch(function (error) {
          self.pantallaCargando("")
          self.notificacion('negativo','modificar')  
      })
    },
    borrar(taskId){
      let url;
      if(process.env.DEV){
        url ='http://localhost:3000/api/delete';      
      }
      else{
        url = `${window.location.origin}/api/delete`
      }                    
      let data = new FormData();      
      data.append('TaskId', taskId);      
      let headContent ={}
      let self = this;
      this.pantallaCargando("mostrar")
      fetch(url, {
          method: 'DELETE',          
          body: data,         
          //headers: head           
      }).then(function(response) {
          return response.json();
      }).then(function(json) {
          self.obtenerTodos();             
          self.pantallaCargando("")
          self.notificacion(json.res == 'Borrado' ? 'positivo':'negativo',json.res == 'Borrado'?'borrada':'borrar');          
      }).catch(function (error) {
          self.pantallaCargando("")
          self.notificacion('negativo','borrar')  
      })
    },
    ////////////////////////////////////CLIENTE////////////////////////////////////
    ////////////////////////////////////CLIENTE////////////////////////////////////
    ////////////////////////////////////CLIENTE////////////////////////////////////
    convierteFecha(estilo, fechaInicial){
      let fecha;
      if(estilo=='tarjeta'){
        let date = new Date(fechaInicial)
        let hora = date.toLocaleString('en-US', {hour: 'numeric', hour12: true}).split(' ')
        let minutos = date.getMinutes()<10? 0+date.getMinutes().toString():date.getMinutes();
        let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 
          'Mayo', 'Junio', 'Julio', 'Agosto', 
          'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        fecha = `${meses[date.getMonth()]} ${date.getDate().toString()}, ${date.getFullYear()} 
        ${hora[0]}:${minutos} ${hora[1]}`            
      }     
      else if(estilo.substring(0, 3)=='fix'){
          let date = new Date(fechaInicial)  
          let fechaGuardada = new Date(this.saveDate);                             
          if(estilo=='fixHour'){            
            let hora = date.toLocaleString('en-US', {hour: 'numeric', hour12: true}).split(' ');
            let minutos = date.getMinutes()<10? 0+date.getMinutes().toString():date.getMinutes();     
            fecha = `${fechaGuardada.getFullYear()}/${fechaGuardada.getMonth()+1}/${fechaGuardada.getDate().toString()} ${hora[0]}:${minutos} ${hora[1]}`
          }
          else{
            let hora = fechaGuardada.toLocaleString('en-US', {hour: 'numeric', hour12: true}).split(' ');
            let minutos = fechaGuardada.getMinutes()<10? 0+fechaGuardada.getMinutes().toString():fechaGuardada.getMinutes();     
            fecha = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate().toString()} ${hora[0]}:${minutos} ${hora[1]}`
          }
          
      }
      else{
        let date = new Date(fechaInicial)        
        let hora = date.toLocaleString('en-US', {hour: 'numeric', hour12: true}).split(' ');
        let minutos = date.getMinutes()<10? 0+date.getMinutes().toString():date.getMinutes();                
        fecha = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate().toString()} ${hora[0]}:${minutos} ${hora[1]}`      

      }
      return fecha;
    },
    cerrarSelectorFecha(input){
      if(input=='hour'){
        
        document.querySelector('#btnHora').click()
        this.date = this.convierteFecha('fixHour', this.date);
      }
      else{
        document.querySelector('#btnFecha').click()
        this.date = this.convierteFecha('fixYear', this.date);
      }      
      this.guardaFecha();
    },
    setPagination (accion){
      if(accion == 'slide'){
        this.pagination = (parseInt(this.slide))+1;                
      }
      else{
         this.slide = (this.pagination-1).toString();                
      }
        
    },
    notificacion(resultado, accion){
      let mensaje;
      let icon;
      let color;      
      if(resultado=='positivo'){
        mensaje = `Tarea ${accion} Satisfactoriamente.`;
        color ='positive';
        icon = 'sentiment_satisfied_alt';
      }else{
        mensaje = `Error al ${accion} Tarea`;
        color ='negative';
        icon = 'mood_bad';
      }
      this.$q.notify({
        message: mensaje,
        color: color,        
        icon: icon ,
        position: 'top',
        timeout: 150          
      })       
    },
    filtro(l){
      if(this.vrBusqueda!=''){              
      let regExp;
      this.tarjetas = this.originalTarjetas;
      let tarjetas = this.tarjetas;            
      function quitaRepetido(value, index, self) {
          return self.indexOf(value) === index;
      }
      let result= tarjetas;
      let resultTemp;
      Array.prototype.forEach.call(this.vrBusqueda.split(' '),(vr)=>{
            regExp = new RegExp (`${vr}.*`, 'i')
            resultTemp = result.filter(result => result.Name.match(regExp));
            resultTemp = resultTemp.concat(result.filter(result => result.TaskId.toString().match(regExp)));      
            resultTemp = resultTemp.concat(result.filter(result => this.convierteFecha('tarjeta',result.DeadLine).match(regExp))); 
            resultTemp = resultTemp.filter(quitaRepetido);                      
            result = resultTemp;
      })
            this.organizarTarjetas(result);
      }
      else{
        this.organizarTarjetas(this.originalTarjetas);
      }
      document.querySelector('.inputBuscar').focus();
    },
    guardaFecha(){
      this.saveDate = this.date;
    },
    fechaHoy(){
      let date = new Date(Date.now());
      return  this.convierteFecha('',this.date) > this.convierteFecha('',date);
      //  return this.convierteFecha('',date);
    },
    pantallaCargando(accion){
      if(accion=="mostrar"){
        this.$q.loading.show({
        delay: 400, // ms
        spinner: QSpinnerGears,
        spinnerColor: 'white',
        messageColor: 'white',
        backgroundColor: 'green',
        message: 'Cargando ...'
      }) 
      }else{
        this.$q.loading.hide();
      }
      
    }
  }
})
</script>
<style scoped>
   .tarjeta{
     max-width: 250px;
     min-width: 250px;
   }
   @media (min-width: 695px) {
  .tamanoCarousel {
    height: 310px !important;
    overflow: auto !important;
    flex-wrap: nowrap !important;
    }
    .row{
      flex-wrap: nowrap !important;
    }
  }
</style>
