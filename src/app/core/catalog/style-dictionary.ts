import { CATALOG, FLAT_ENTRIES, type CatalogEntry, type CatalogGroup } from './catalog';

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
 * Estilos indexados por código numérico [Categoría.Componente.Variante.Subvariante].
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
  const q = normalizeSearch(query).trim();
  if (!q) return [];
  return STYLE_DICTIONARY.filter(
    (item) =>
      item.code.startsWith(q) ||
      item.componentCode.startsWith(q) ||
      normalizeSearch(
        `${item.componentLabel} ${item.variantLabel} ${item.selector} ${item.hint}`,
      ).includes(q),
  );
}

export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

interface CatalogSearchResult {
  readonly group: CatalogGroup;
  readonly entry: CatalogEntry;
  readonly code: string;
  readonly label: string;
  readonly hint: string;
  readonly path: readonly string[];
}

const GROUP_ALIASES: Readonly<Record<string, string>> = {
  cards: 'tarjetas',
  buttons: 'botones',
  backgrounds: 'fondos',
  typography: 'tipografia texto',
  navigation: 'navegacion menu',
  forms: 'formularios campos',
  modals: 'dialogos modales',
  themes: 'temas',
  animations: 'animaciones',
  charts: 'graficos',
  feedback: 'notificaciones avisos',
  'media-3d': 'escenas modelos',
  data: 'tablas datos registros',
};

const COMPONENT_RESULTS = FLAT_ENTRIES.map(({ group, entry }) => ({
  group,
  entry,
  code: entry.code,
  label: entry.label,
  hint: entry.tagline,
  path: ['/', group.id, entry.id],
}));

const VARIANT_RESULTS = COMPONENT_RESULTS.flatMap((item) =>
  item.entry.variants.map((variant) => ({
    ...item,
    code: variant.code,
    label: `${item.label} · ${variant.label}`,
    hint: variant.hint,
    path: [...item.path, variant.id],
  })),
);

const INDEXED_RESULTS = [...COMPONENT_RESULTS, ...VARIANT_RESULTS].map((item) => ({
  item,
  label: normalizeSearch(item.label),
  text: normalizeSearch(
    `${item.code} ${item.label} ${item.hint} ${item.path.join(' ')} ${item.group.label} ${GROUP_ALIASES[item.group.id] ?? ''}`,
  ),
}));

/** Sin consulta se muestran componentes. Al buscar aparecen también las variantes. */
export function catalogSearch(query: string, groupId?: string): readonly CatalogSearchResult[] {
  const q = normalizeSearch(query).trim();
  if (!q) return COMPONENT_RESULTS.filter((item) => !groupId || item.group.id === groupId);

  const words = q.split(/\s+/);
  return INDEXED_RESULTS.filter(
    ({ item, text }) =>
      (!groupId || item.group.id === groupId) && words.every((word) => text.includes(word)),
  )
    .map(({ item, label }) => ({
      item,
      rank:
        item.code === q
          ? 0
          : item.code.startsWith(q + '.')
            ? 1
            : label === q
              ? 2
              : label.startsWith(q)
                ? 3
                : label.includes(q)
                  ? 4
                  : 5,
    }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ item }) => item);
}
