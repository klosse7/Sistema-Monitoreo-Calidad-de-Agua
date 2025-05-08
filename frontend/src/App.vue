<template>
  <v-app>
    <v-app-bar color="teal" dark>
      <v-toolbar-title>Sistema de Monitoreo de Calidad de Agua</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item to="/" title="Dashboard" />
        <v-list-group prepend-icon="mdi-file-chart" value="true">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Reportes"></v-list-item>
          </template>
          <v-list-item to="/reporte-semana" title="Últimos 7 días" />
          <v-list-item to="/reporte-mes" title="Último mes" />
          <v-list-item to="/reporte-3-meses" title="Últimos 3 meses" />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
