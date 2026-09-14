import { ThemeName } from '../theme/theme.service';

/**
 * Mensajes entre la ventana de entorno (galería) y el iframe que monta el
 * componente (`/embed/...`).
 *
 * El iframe es un documento aparte: no comparte señales con la galería, así que
 * los cambios que ocurren fuera (elegir otro sub-estilo, cambiar de tema) se
 * avisan por `postMessage`. Es el único canal entre los dos documentos, y es
 * intencionadamente pequeño: nada de la galería se filtra al componente.
 */
export type StageMessage =
  | { readonly type: 'ac:variant'; readonly variant: string | null }
  | { readonly type: 'ac:theme'; readonly theme: ThemeName };
