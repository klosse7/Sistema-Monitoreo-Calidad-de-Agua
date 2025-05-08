import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import ReporteSemana from '@/components/ReporteSemana.vue'
import ReporteMes from '@/components/ReporteMes.vue'
import Reporte3Meses from '@/components/Reporte3Meses.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/reporte-semana', name: 'ReporteSemana', component: ReporteSemana },
  { path: '/reporte-mes', name: 'ReporteMes', component: ReporteMes },
  { path: '/reporte-3-meses', name: 'Reporte3Meses', component: Reporte3Meses }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
