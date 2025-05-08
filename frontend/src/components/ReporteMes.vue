<template>
    <v-container fluid>
      <v-card class="pa-4">
        <v-card-title>Lecturas últimos 7 días</v-card-title>
        <line-chart v-if="chartData" :chart-data="chartData" />
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import LineChart from './LineChart.vue'
  
  const chartData = ref(null)
  
  const buildChartData = (data) => {
    return {
      labels: data.map(d => new Date(d.fecha).toLocaleDateString()),
      datasets: [
        {
          label: 'pH',
          data: data.map(d => d.ph),
          borderColor: 'green'
        },
        {
          label: 'TDS (ppm)',
          data: data.map(d => d.tds),
          borderColor: 'orange'
        },
        {
          label: 'Temperatura (°C)',
          data: data.map(d => d.temperatura),
          borderColor: 'red'
        },
        {
          label: 'Turbidez (NTU)',
          data: data.map(d => d.turbidez),
          borderColor: 'blue'
        }
      ]
    }
  }
  
  onMounted(async () => {
    const res = await axios.get('http://localhost:4000/api/metrics/last-month')
    chartData.value = buildChartData(res.data)
  })
  </script>
  