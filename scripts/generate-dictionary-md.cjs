const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const filePath = 'src/app/core/catalog/catalog.ts';
const sourceCode = fs.readFileSync(filePath, 'utf8');
const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);

let catalogNode = null;
function findCatalog(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === 'CATALOG') {
    catalogNode = node.initializer;
  }
  ts.forEachChild(node, findCatalog);
}
findCatalog(sourceFile);

if (!catalogNode || !ts.isArrayLiteralExpression(catalogNode)) {
  console.error('Could not find CATALOG array literal');
  process.exit(1);
}

const groups = [];

catalogNode.elements.forEach(gNode => {
  let gId = '', gCode = '', gLabel = '', gTagline = '', gIcon = '', gAccent = '';
  let compsNode = null;

  gNode.properties.forEach(p => {
    if (ts.isPropertyAssignment(p)) {
      const name = p.name.getText(sourceFile);
      const val = p.initializer.getText(sourceFile).replace(/^['"]|['"]$/g, '');
      if (name === 'id') gId = val;
      if (name === 'code') gCode = val;
      if (name === 'label') gLabel = val;
      if (name === 'tagline') gTagline = val;
      if (name === 'icon') gIcon = val;
      if (name === 'accent') gAccent = val;
      if (name === 'components') compsNode = p.initializer;
    }
  });

  const components = [];
  if (compsNode && ts.isArrayLiteralExpression(compsNode)) {
    compsNode.elements.forEach(cNode => {
      let cId = '', cCode = '', cLabel = '', cTagline = '', cSelector = '', cClassName = '', cSource = '';
      let varsNode = null;
      let npmInstall = [];
      let requiresForms = false;

      cNode.properties.forEach(p => {
        if (ts.isPropertyAssignment(p)) {
          const name = p.name.getText(sourceFile);
          const val = p.initializer.getText(sourceFile).replace(/^['"]|['"]$/g, '');
          if (name === 'id') cId = val;
          if (name === 'code') cCode = val;
          if (name === 'label') cLabel = val;
          if (name === 'tagline') cTagline = val;
          if (name === 'selector') cSelector = val;
          if (name === 'className') cClassName = val;
          if (name === 'sourcePath') cSource = val;
          if (name === 'variants') varsNode = p.initializer;
          if (name === 'requiresForms') requiresForms = p.initializer.kind === ts.SyntaxKind.TrueKeyword;
          if (name === 'npmInstall' && ts.isArrayLiteralExpression(p.initializer)) {
            npmInstall = p.initializer.elements.map((element) => element.text);
          }
        }
      });

      const variants = [];
      if (varsNode && ts.isArrayLiteralExpression(varsNode)) {
        varsNode.elements.forEach(vNode => {
          let vId = '', vCode = '', vLabel = '', vHint = '';
          vNode.properties.forEach(p => {
            if (ts.isPropertyAssignment(p)) {
              const name = p.name.getText(sourceFile);
              const val = p.initializer.getText(sourceFile).replace(/^['"]|['"]$/g, '');
              if (name === 'id') vId = val;
              if (name === 'code') vCode = val;
              if (name === 'label') vLabel = val;
              if (name === 'hint') vHint = val;
            }
          });
          variants.push({
            id: vId,
            code: vCode,
            label: vLabel,
            hint: vHint,
            routePath: `/${gId}/${cId}/${vId}`,
            embedPath: `/embed/${gId}/${cId}/${vId}`
          });
        });
      }

      components.push({
        id: cId,
        code: cCode,
        label: cLabel,
        tagline: cTagline,
        selector: cSelector,
        className: cClassName,
        sourcePath: cSource,
        ...(npmInstall.length && { npmInstall }),
        ...(requiresForms && { requiresForms }),
        routePath: `/${gId}/${cId}`,
        variants
      });
    });
  }

  groups.push({
    id: gId,
    code: gCode,
    label: gLabel,
    tagline: gTagline,
    icon: gIcon,
    accent: gAccent,
    components
  });
});

let totalVars = 0;
let totalComps = 0;
groups.forEach(g => {
  totalComps += g.components.length;
  g.components.forEach(c => totalVars += c.variants.length);
});

let md = `# Diccionario de Estilos y Efectos — AngularCanvas

> **Catálogo de Referencia Jerárquico para Desarrolladores y Agentes de IA**  
> Total: **${groups.length} Categorías** · **${totalComps} Componentes** · **${totalVars} Efectos / Sub-estilos Únicos**
> Formato JSON disponible en [\`public/dictionary.json\`](public/dictionary.json) o en la web vía \`https://canvas.darknezz.dev/dictionary.json\`

---

## 🎯 Protocolo de Identificación y Extracción por Código

Cada efecto visual o componente en este repositorio posee un **código numérico jerárquico unívoco** estructurado en 4 niveles:

\`\`\`
  [Categoría] . [Componente] . [Variante] . [Subvariante]
       │              │             │             │
     (1-N)          (1-N)         (1-N)          (1)
\`\`\`

### 📌 Ejemplos de uso con tu Agente de IA o Pair Programmer:
- **"Jala el efecto 9.4.2.1 en color morado"**  
  👉 El agente busca directamente el código **9.4.2.1**: Categoría **Animations (9)**, Componente **Book Flip (9.4)**, Variante **Cuaderno (9.4.2.1)**.  
  👉 Ubicación: \`src/app/components/animations/book-flip/\`  
  👉 Selector: \`<app-anim-book-flip [variant]="'notebook'" [style.--ac-accent]="'#a855f7'" />\`  
  👉 No requiere descripciones subjetivas como "el libro del medio" ni "el de la derecha".

- **"Jala el gráfico 10.3.1.1 en color esmeralda"**  
  👉 El agente busca directamente el código **10.3.1.1**: Categoría **Charts (10)**, Componente **Histogram (10.3)**, Variante **Gauss Normal (10.3.1.1)**.  
  👉 Ubicación: \`src/app/components/charts/histogram/\`  
  👉 Selector: \`<app-chart-histogram [variant]="'gauss'" [style.--ac-accent]="'#10b981'" />\`

- **"Extrae el botón 2.6.2.1 y agrégalo a mi navbar"**  
  👉 El agente copia \`src/app/components/buttons/3d/\` y monta \`<app-btn-3d [variant]="'flip'" />\`.

---

## 📦 Autocontención y Reglas de Extracción

1. **Carpeta de origen**. Copia la carpeta completa de cada efecto y consulta sus dependencias en el extractor o en la ficha de código.
2. **Aislamiento de Efecto**: Cuando un componente incluye múltiples sub-estilos, se activa mediante el input reactivo \`[variant]="'id'"\`. Si no se especifica variante, muestra la variante principal por defecto sin amontonar efectos en el mismo lienzo.
3. **Standalone Angular**: Todos los componentes se exportan como standalone components (verificados con Angular 22), listos para importar directamente en el array \`imports: [...]\` de cualquier componente destino.
4. **Navegación Directa por Código**: Puedes navegar a cualquier componente o variante directamente escribiendo la URL \`/c/[codigo]\` o \`/code/[codigo]\`, por ejemplo \`https://canvas.darknezz.dev/c/10.3.1.1\`.

---

`;

groups.forEach(group => {
  md += `## ${group.code}. ${group.label}\n\n`;
  md += `*${group.tagline}*\n\n`;
  md += `| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |\n`;
  md += `| :---: | :--- | :--- | :--- | :--- | :--- |\n`;

  group.components.forEach(comp => {
    comp.variants.forEach(variant => {
      const usage = `\`<${comp.selector} [variant]="'${variant.id}'" />\``;
      md += `| **\`${variant.code}\`** | ${comp.label} (\`${comp.code}\`) | **${variant.label}**<br><sub>${variant.hint}</sub> | \`<${comp.selector}>\` | \`${comp.sourcePath}\` | ${usage} |\n`;
    });
  });

  for (const comp of group.components) {
    if (comp.npmInstall) md += `\n**${comp.label}** · ${comp.npmInstall.map(command => '`' + command + '`').join(' · ')}\n`;
    if (comp.requiresForms) md += `\n**${comp.label}** requiere @angular/forms en la misma versión que @angular/core.\n`;
  }
  md += `\n---\n\n`;
});

fs.writeFileSync('DICTIONARY.md', md, 'utf8');

// Exportar JSON estructurado a public/dictionary.json
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const dictionaryData = {
  version: '2.2.0',
  totalGroups: groups.length,
  totalComponents: totalComps,
  totalVariants: totalVars,
  updatedAt: new Date().toISOString(),
  groups
};
fs.writeFileSync(path.join(publicDir, 'dictionary.json'), JSON.stringify(dictionaryData, null, 2), 'utf8');

console.log(`Successfully generated DICTIONARY.md and public/dictionary.json with ${totalComps} components and ${totalVars} variants!`);
