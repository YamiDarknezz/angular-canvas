import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Los parámetros de ruta llegan a los componentes como inputs: la vista
      // de entorno no tiene que leer ActivatedRoute a mano.
      withComponentInputBinding(),
      // Al cambiar de entorno la página vuelve arriba, para no aterrizar en
      // mitad del componente anterior.
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
  ],
};
