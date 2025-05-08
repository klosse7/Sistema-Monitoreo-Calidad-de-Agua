<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6" v-for="(chartData, index) in charts" :key="index">
          <v-card class="pa-4 mb-4">
            <v-card-title>{{ chartData.title }}</v-card-title>
            <line-chart :chart-data="chartData.data" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import LineChart from '@/components/LineChart.vue'
  
  const route = useRoute()
  const charts = ref([])
  
  const fetchData = async () => {
    let endpoint = ''
    switch (route.params.periodo) {
      case '7-dias':
        endpoint = 'last-7-days'
        break
      case '1-mes':
        endpoint = 'last-month'
        break
      case '3-meses':
        endpoint = 'last-3-months'
        break
      default:
        endpoint = 'last-7-days'
    }
  
    try {
      const response = await axios.get(`http://localhost:4000/api/metrics/${endpoint}`)
      const data = response.data
  
      const labels = data.map(d => new Date(d.fecha).toLocaleDateString())
  
      charts.value = [
        {
          title: 'Nivel de pH',
          data: {
            labels,
            datasets: [
              {
                label: 'pH',
                data: data.map(d => d.ph),
                borderColor: 'green',
                fill: false
              }
            ]
          }
        },
        {
          title: 'Conductividad TDS',
          data: {
            labels,
            datasets: [
              {
                label: 'TDS',
                data: data.map(d => d.tds),
                borderColor: 'orange',
                fill: false
              }
            ]
          }
        },
        {
          title: 'Temperatura',
          data: {
            labels,
            datasets: [
              {
                label: 'Temperatura',
                data: data.map(d => d.temperatura),
                borderColor: 'red',
                fill: false
              }
            ]
          }
        },
        {
          title: 'Turbidez',
          data: {
            labels,
            datasets: [
              {
                label: 'Turbidez',
                data: data.map(d => d.turbidez),
                borderColor: 'blue',
                fill: false
              }
            ]
          }
        }
      ]
    } catch (error) {
      console.error('Error al cargar los datos:', error)
    }
  }
  
  onMounted(fetchData)
  watch(() => route.params.periodo, fetchData)
  </script>
  