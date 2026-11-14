import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export interface ExplorerNode {
  readonly id: string;
  readonly label: string;
  readonly children?: readonly ExplorerNode[];
  readonly content?: string;
}

interface TreeRow {
  readonly node: ExplorerNode;
  readonly parents: readonly ExplorerNode[];
  readonly level: number;
  readonly position: number;
  readonly siblings: number;
}

const DEMO_NODES: readonly ExplorerNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'pages',
        label: 'pages',
        children: [
          {
            id: 'activity',
            label: 'activity.ts',
            content:
              'export const activity = [\n  { id: 1, label: "Pedido recibido" },\n  { id: 2, label: "Listo para despacho" },\n];',
          },
          {
            id: 'overview',
            label: 'overview.ts',
            content:
              'export const overview = {\n  title: "Resumen semanal",\n  period: "Últimos 7 días",\n};',
          },
        ],
      },
      {
        id: 'tokens',
        label: 'tokens.css',
        content: ':root {\n  --accent: #90dfc5;\n  --surface: #161e28;\n  --radius: 12px;\n}',
      },
    ],
  },
  {
    id: 'docs',
    label: 'docs',
    children: [
      {
        id: 'guide',
        label: 'guia.md',
        content:
          '# Guía rápida\n\n1. Abre una carpeta.\n2. Elige un archivo.\n3. Revisa su contenido.',
      },
    ],
  },
  {
    id: 'readme',
    label: 'README.md',
    content: '# Estudio\n\nUn proyecto de ejemplo para explorar\narchivos y abrir vistas previas.',
  },
];

/** Navegación de árbol autocontenida, sin librerías adicionales. Usa identificadores únicos por nodo. */
@Component({
  selector: 'app-nav-tree-explorer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tree-explorer.component.html',
  styleUrl: './tree-explorer.component.scss',
})
export class TreeExplorerComponent {
  readonly variant = input<string>();
  readonly project = input('Estudio');
  readonly nodes = input(DEMO_NODES);
  readonly fileOpened = output<ExplorerNode>();

  private readonly expanded = signal<ReadonlySet<string>>(new Set(['src', 'pages']));
  private readonly focusedId = signal('activity');
  private readonly openedId = signal('activity');

  protected readonly rows = computed(() => {
    const list: TreeRow[] = [];
    const add = (nodes: readonly ExplorerNode[], parents: readonly ExplorerNode[]) => {
      nodes.forEach((node, index) => {
        list.push({
          node,
          parents,
          level: parents.length + 1,
          position: index + 1,
          siblings: nodes.length,
        });
        if (node.children && this.expanded().has(node.id)) add(node.children, [...parents, node]);
      });
    };
    add(this.nodes(), []);
    return list;
  });

  protected readonly file = computed(() => {
    const find = (
      nodes: readonly ExplorerNode[],
      parents: readonly string[],
    ): { node: ExplorerNode; path: string } | undefined => {
      for (const node of nodes) {
        const path = [...parents, node.label];
        if (!node.children && node.id === this.openedId()) return { node, path: path.join(' / ') };
        if (!node.children) continue;
        const child = find(node.children, path);
        if (child) return child;
      }
      return undefined;
    };
    return find(this.nodes(), []);
  });

  protected readonly tabStop = computed(() => {
    const rows = this.rows();
    return rows.find((row) => row.node.id === this.focusedId())?.node.id ?? rows[0]?.node.id;
  });

  protected isExpanded(node: ExplorerNode): boolean {
    return this.expanded().has(node.id);
  }

  protected focus(node: ExplorerNode): void {
    this.focusedId.set(node.id);
  }

  protected activate(row: TreeRow): void {
    const node = row.node;
    this.focus(node);
    if (node.children) {
      this.toggle(node.id);
    } else {
      this.openedId.set(node.id);
      this.fileOpened.emit(node);
    }
  }

  protected navigate(event: KeyboardEvent, row: TreeRow, tree: HTMLElement): void {
    const rows = this.rows();
    const index = rows.indexOf(row);
    let target: TreeRow | undefined;

    switch (event.key) {
      case 'ArrowUp':
        target = rows[index - 1];
        break;
      case 'ArrowDown':
        target = rows[index + 1];
        break;
      case 'Home':
        target = rows[0];
        break;
      case 'End':
        target = rows.at(-1);
        break;
      case 'ArrowRight':
        if (row.node.children?.length && !this.isExpanded(row.node)) this.toggle(row.node.id);
        else if (row.node.children?.length) target = rows[index + 1];
        break;
      case 'ArrowLeft': {
        if (row.node.children && this.isExpanded(row.node)) this.toggle(row.node.id);
        else target = rows.find(({ node }) => node.id === row.parents.at(-1)?.id);
        break;
      }
      default:
        return;
    }

    event.preventDefault();
    if (!target) return;
    this.focus(target.node);
    const buttons = tree.querySelectorAll<HTMLButtonElement>('[role="treeitem"]');
    buttons[rows.indexOf(target)]?.focus();
  }

  private toggle(id: string): void {
    this.expanded.update((expanded) => {
      const next = new Set(expanded);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
}
