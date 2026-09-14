import { Routes } from '@angular/router';

import { EnvironmentComponent } from './views/environment/environment.component';
import { HomeComponent } from './views/home/home.component';

/**
 * Rutas del catálogo.
 *
 * Cada componente es un **entorno con URL propia**:
 *
 * - `/`                          → portada con todos los grupos.
 * - `/cards/neon`                → el entorno con todas sus variantes.
 * - `/cards/neon/blue`           → el entorno filtrado a una variante.
 *
 * Esa URL es lo que hace que la navegación lateral realmente cambie de vista
 * (y no haga scroll): al cambiar de ruta se destruye un entorno y se monta
 * otro, así que ningún efecto, `setTimeout` o `position: fixed` de un
 * componente puede afectar al siguiente.
 */
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'AngularCanvas — Biblioteca de efectos y diseños para Angular',
  },
  // Una categoría sin componente (`/cards`) no tiene página propia: vuelve al
  // catálogo en vez de dejar una vista vacía.
  { path: ':group', pathMatch: 'full', redirectTo: '' },
  { path: ':group/:entry', component: EnvironmentComponent },
  { path: ':group/:entry/:variant', component: EnvironmentComponent },
  { path: '**', redirectTo: '' },
];
