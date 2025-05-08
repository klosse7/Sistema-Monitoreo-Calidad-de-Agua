<template>
    <v-container fluid>
      <v-alert type="info" class="mb-4" :color="infoColor">
        Última lectura: {{ ultimaFecha }}
      </v-alert>
  
      <v-row class="mb-4" justify="center">
        <v-col
          v-for="(card, index) in cards"
          :key="index"
          cols="12"
          md="6"
          lg="3"
        >
          <v-card elevation="2" class="pa-3" :class="card.borderClass">
            <v-card-title class="text-h6 d-flex align-center justify-space-between">
              <v-icon :color="card.statusColor">{{ card.icon }}</v-icon>
              <span>{{ card.title }}</span>
            </v-card-title>
            <v-card-subtitle>
              <strong>Estado:</strong>
              <span :class="`text-${card.statusColor}`">{{ card.status }}</span>
            </v-card-subtitle>
            <v-card-text>
              <v-progress-circular
                :size="100"
                :width="10"
                :model-value="card.progress"
                :color="card.statusColor"
                class="mt-4"
              >
                {{ card.value }}
              </v-progress-circular>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Mapa -->
      <v-row justify="center">
        <v-col cols="12">
          <div id="map" style="height: 400px; border-radius: 12px;"></div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import axios from 'axios'
  import mapboxgl from 'mapbox-gl'
  
  mapboxgl.accessToken = 'pk.eyJ1Ijoia2xvc3NlNyIsImEiOiJjbWFiNWQxbG8yNnoyMmpvbzk1emFxZHBjIn0.Uj2cQ9remfW4rIXxmjt6OQ'
  
  const ultimaFecha = ref('Cargando...')
  const infoColor = ref('light-blue lighten-5')
  
  const cards = reactive([
    {
      title: 'Nivel de pH',
      icon: 'mdi-water',
      value: '',
      progress: 0,
      status: '',
      statusColor: '',
      borderClass: ''
    },
    {
      title: 'Conductividad TDS',
      icon: 'mdi-flask',
      value: '',
      progress: 0,
      status: '',
      statusColor: '',
      borderClass: ''
    },
    {
      title: 'Temperatura',
      icon: 'mdi-thermometer',
      value: '',
      progress: 0,
      status: '',
      statusColor: '',
      borderClass: ''
    },
    {
      title: 'Turbidez',
      icon: 'mdi-water-outline',
      value: '',
      progress: 0,
      status: '',
      statusColor: '',
      borderClass: ''
    }
  ])
  
  function actualizarTarjetas(data) {
    // Fecha
    ultimaFecha.value = new Date(data.fecha).toLocaleString()
  
    // pH
    let ph = data.ph
    cards[0].value = `${ph.toFixed(2)} pH`
    cards[0].progress = ph * 10
    if (ph < 6.5) {
      cards[0].status = 'Ácido'
      cards[0].statusColor = 'orange'
      cards[0].borderClass = 'border-orange'
    } else if (ph > 8.5) {
      cards[0].status = 'Alcalino'
      cards[0].statusColor = 'blue'
      cards[0].borderClass = 'border-blue'
    } else {
      cards[0].status = 'Normal'
      cards[0].statusColor = 'green'
      cards[0].borderClass = 'border-green'
    }
  
    // TDS
    let tds = data.tds
    cards[1].value = `${tds} ppm`
    cards[1].progress = tds / 10
    if (tds < 500) {
      cards[1].status = 'Baja'
      cards[1].statusColor = 'green'
      cards[1].borderClass = 'border-green'
    } else if (tds < 1000) {
      cards[1].status = 'Moderada'
      cards[1].statusColor = 'orange'
      cards[1].borderClass = 'border-orange'
    } else {
      cards[1].status = 'Alta'
      cards[1].statusColor = 'red'
      cards[1].borderClass = 'border-red'
    }
  
    // Temperatura
    let temp = data.temperatura
    cards[2].value = `${temp.toFixed(1)}°C`
    cards[2].progress = temp * 2
    if (temp < 15) {
      cards[2].status = 'Muy Fría'
      cards[2].statusColor = 'blue'
      cards[2].borderClass = 'border-blue'
    } else if (temp > 30) {
      cards[2].status = 'Caliente'
      cards[2].statusColor = 'red'
      cards[2].borderClass = 'border-red'
    } else {
      cards[2].status = 'Óptima'
      cards[2].statusColor = 'green'
      cards[2].borderClass = 'border-green'
    }
  
    // Turbidez
    let turb = data.turbidez
    cards[3].value = `${turb} NTU`
    cards[3].progress = turb * 10
    if (turb < 5) {
      cards[3].status = 'Baja'
      cards[3].statusColor = 'green'
      cards[3].borderClass = 'border-green'
    } else if (turb < 10) {
      cards[3].status = 'Media'
      cards[3].statusColor = 'orange'
      cards[3].borderClass = 'border-orange'
    } else {
      cards[3].status = 'Alta'
      cards[3].statusColor = 'red'
      cards[3].borderClass = 'border-red'
    }
  }
  
  async function fetchUltimaLectura() {
    try {
      const res = await axios.get('http://localhost:4000/api/metrics/last')
      actualizarTarjetas(res.data)
    } catch (err) {
      console.error('Error al cargar datos del backend:', err)
    }
  }
  
  onMounted(() => {
    fetchUltimaLectura()
    setInterval(fetchUltimaLectura, 5000) // Actualiza cada 10 segundos
  
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-66.2567, -17.3926],
      zoom: 14
    })
  
    new mapboxgl.Marker().setLngLat([-66.2567, -17.3926]).addTo(map)
  })
  </script>
  
  <style scoped>
  .border-green {
    border: 3px solid #4CAF50;
    border-radius: 12px;
  }
  
  .border-orange {
    border: 3px solid #FB8C00;
    border-radius: 12px;
  }
  
  .border-red {
    border: 3px solid #B71C1C;
    border-radius: 12px;
  }
  
  .border-blue {
    border: 3px solid #2196F3;
    border-radius: 12px;
  }
  </style>
  