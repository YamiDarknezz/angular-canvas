import { CATALOG } from './catalog';

export interface StyleDictionaryItem {
  /** Código único jerárquico: ej. '9.4.2.1' o '1.1.1.1' */
  readonly code: string;
  /** Código de la categoría: ej. '9' */
  readonly groupCode: string;
  /** Nombre de la categoría: ej. 'Animations' */
  readonly groupLabel: string;
  /** Id de la categoría: ej. 'animations' */
  readonly groupId: string;
  /** Código del componente: ej. '9.4' */
  readonly componentCode: string;
  /** Nombre del componente: ej. 'Book Flip' */
  readonly componentLabel: string;
  /** Id del componente: ej. 'book-flip' */
  readonly componentId: string;
  /** Selector CSS: ej. 'app-anim-book-flip' */
  readonly selector: string;
  /** Clase Angular standalone: ej. 'BookFlipComponent' */
  readonly className: string;
  /** Carpeta del código autocontenido: ej. 'src/app/components/animations/book-flip' */
  readonly sourcePath: string;
  /** Id del sub-estilo / variante: ej. 'notebook' */
  readonly variantId: string;
  /** Nombre del sub-estilo: ej. 'Cuaderno' */
  readonly variantLabel: string;
  /** Descripción del efecto */
  readonly hint: string;
  /** Ruta de navegación en la app: ej. '/animations/book-flip/notebook' */
  readonly routePath: string;
  /** Snippet de uso directo con variant input */
  readonly usageSnippet: string;
}

/**
 * Diccionario de Estilos completo del repositorio.
 * 151 estilos/efectos indexados unívocamente por su código numérico [Categoría.Componente.Variante.Subvariante].
 */
export const STYLE_DICTIONARY: readonly StyleDictionaryItem[] = CATALOG.flatMap((group) =>
  group.components.flatMap((entry) =>
    entry.variants.map((v) => ({
      code: v.code,
      groupCode: group.code,
      groupLabel: group.label,
      groupId: group.id,
      componentCode: entry.code,
      componentLabel: entry.label,
      componentId: entry.id,
      selector: entry.selector,
      className: entry.className,
      sourcePath: entry.sourcePath,
      variantId: v.id,
      variantLabel: v.label,
      hint: v.hint,
      routePath: `/${group.id}/${entry.id}/${v.id}`,
      usageSnippet: `<${entry.selector} variant="${v.id}" />`,
    })),
  ),
);

/**
 * Busca un estilo en el diccionario por su código jerárquico o aproximación:
 * - 4 partes: '9.4.2.1' (coincidencia exacta)
 * - 3 partes: '9.4.2' -> mapea a '9.4.2.1'
 * - 2 partes: '9.4' -> mapea al primer estilo del componente '9.4.1.1'
 */
export function lookupByCode(code: string): StyleDictionaryItem | undefined {
  if (!code) return undefined;
  const clean = code.trim();
  // Coincidencia directa
  const exact = STYLE_DICTIONARY.find((item) => item.code === clean);
  if (exact) return exact;

  // Si tiene 3 partes ('9.4.2'), busca '9.4.2.1'
  if (clean.split('.').length === 3) {
    const withSubvar = `${clean}.1`;
    const match = STYLE_DICTIONARY.find((item) => item.code === withSubvar);
    if (match) return match;
  }

  // Si tiene 2 partes ('9.4'), busca el primer elemento de ese componente ('9.4.1.1')
  if (clean.split('.').length === 2) {
    const match = STYLE_DICTIONARY.find((item) => item.componentCode === clean);
    if (match) return match;
  }

  return undefined;
}

/**
 * Búsqueda difusa en el diccionario por código, nombre o selector.
 */
export function searchDictionary(query: string): readonly StyleDictionaryItem[] {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  return STYLE_DICTIONARY.filter(
    (item) =>
      item.code.startsWith(q) ||
      item.componentCode.startsWith(q) ||
      item.componentLabel.toLowerCase().includes(q) ||
      item.variantLabel.toLowerCase().includes(q) ||
      item.selector.toLowerCase().includes(q) ||
      item.hint.toLowerCase().includes(q),
  );
}
