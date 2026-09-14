import { Routes } from '@angular/router';

import { ShellComponent } from './layout/shell.component';
import { EmbedComponent } from './views/embed/embed.component';
import { EnvironmentComponent } from './views/environment/environment.component';
import { HomeComponent } from './views/home/home.component';

/**
 * Rutas del catálogo.
 *
 * - `/`                          → portada con todos los grupos.
 * - `/cards/neon`                → el entorno con todas sus variantes.
 * - `/cards/neon/blue`           → el entorno filtrado a una variante.
 * - `/embed/cards/neon/blue`     → el componente **solo**, sin galería: es lo
 *   que se carga dentro del iframe de la ventana de entorno.
 *
 * Cada componente es un **entorno con URL propia**: la navegación lateral no
 * hace scroll, cambia de vista. Al cambiar de ruta se destruye un entorno y se
 * monta otro, y dentro del iframe el componente tiene su propio documento: ni
 * sus estilos, ni sus `@media`, ni sus `position: fixed` tocan la galería.
 */
export const routes: Routes = [
  // Vista desnuda para el iframe. Va fuera del shell a propósito: sin
  // navegación, sin tema de la galería, sin nada que no sea el componente.
  { path: 'embed/:group/:entry', component: EmbedComponent },
  { path: 'embed/:group/:entry/:variant', component: EmbedComponent },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'AngularCanvas — Biblioteca de efectos y diseños para Angular',
      },
      // Una categoría sin componente (`/cards`) no tiene página propia: vuelve
      // al catálogo en vez de dejar una vista vacía.
      { path: ':group', pathMatch: 'full', redirectTo: '/' },
      { path: ':group/:entry', component: EnvironmentComponent },
      { path: ':group/:entry/:variant', component: EnvironmentComponent },
      { path: '**', redirectTo: '/' },
    ],
  },
];
