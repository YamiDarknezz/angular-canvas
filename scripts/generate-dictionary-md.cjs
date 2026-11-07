const ts = require('typescript');
const fs = require('fs');

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
  let gId = '', gCode = '', gLabel = '', gTagline = '';
  let compsNode = null;

  gNode.properties.forEach(p => {
    if (ts.isPropertyAssignment(p)) {
      const name = p.name.getText(sourceFile);
      const val = p.initializer.getText(sourceFile).replace(/^['"]|['"]$/g, '');
      if (name === 'id') gId = val;
      if (name === 'code') gCode = val;
      if (name === 'label') gLabel = val;
      if (name === 'tagline') gTagline = val;
      if (name === 'components') compsNode = p.initializer;
    }
  });

  const components = [];
  if (compsNode && ts.isArrayLiteralExpression(compsNode)) {
    compsNode.elements.forEach(cNode => {
      let cId = '', cCode = '', cLabel = '', cTagline = '', cSelector = '', cClassName = '', cSource = '';
      let varsNode = null;

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
          variants.push({ id: vId, code: vCode, label: vLabel, hint: vHint });
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
        variants
      });
    });
  }

  groups.push({
    id: gId,
    code: gCode,
    label: gLabel,
    tagline: gTagline,
    components
  });
});

let totalVars = 0;
groups.forEach(g => g.components.forEach(c => totalVars += c.variants.length));

let md = `# Diccionario de Estilos y Efectos — AngularCanvas

> **Catálogo de Referencia Jerárquico para Desarrolladores y Agentes de IA**  
> Total: **${groups.length} Categorías** · **${groups.reduce((acc, g) => acc + g.components.length, 0)} Componentes** · **${totalVars} Efectos / Sub-estilos Únicos**

---

## 🎯 Protocolo de Identificación y Extracción por Código

Cada efecto visual o componente en este repositorio posee un **código numérico jerárquico unívoco** estructurado en 4 niveles:

\`\`\`
  [Categoría] . [Componente] . [Variante] . [Subvariante]
       │              │             │             │
      (1-9)         (1-N)         (1-N)          (1)
\`\`\`

### 📌 Ejemplos de uso con tu Agente de IA o Pair Programmer:
- **"Jala el efecto 9.4.2.1 en color morado"**  
  👉 El agente busca directamente el código **9.4.2.1**: Categoría **Animations (9)**, Componente **Book Flip (9.4)**, Variante **Cuaderno (9.4.2.1)**.  
  👉 Ubicación: \`src/app/components/animations/book-flip/\`  
  👉 Selector: \`<app-anim-book-flip variant="notebook" />\`  
  👉 No requiere descripciones subjetivas como "el libro del medio" ni "el de la derecha".

- **"Extrae el botón 2.6.2.1 y agrégalo a mi navbar"**  
  👉 El agente copia \`src/app/components/buttons/3d/\` y monta \`<app-btn-3d variant="flip" />\`.

---

## 📦 Autocontención y Reglas de Extracción

1. **100% Autocontenido**: Cada carpeta en \`src/app/components/*/*\` contiene su \`.ts\`, \`.html\` y \`.scss\`. No depende de mixins globales ni de archivos de paleta externos fuera de su carpeta.
2. **Aislamiento de Efecto**: Cuando un componente incluye múltiples sub-estilos, se activa mediante el input reactivo \`[variant]="'id'"\`. Si no se especifica variante, muestra la variante principal por defecto sin amontonar efectos en el mismo lienzo.
3. **Standalone Angular**: Todos los componentes se exportan como standalone components (Angular 19/20/22+ ready), listos para importar directamente en el array \`imports: [...]\` de cualquier componente destino.

---

`;

groups.forEach(group => {
  md += `## ${group.code}. ${group.label}\n\n`;
  md += `*${group.tagline}*\n\n`;
  md += `| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |\n`;
  md += `| :---: | :--- | :--- | :--- | :--- | :--- |\n`;

  group.components.forEach(comp => {
    comp.variants.forEach(variant => {
      const usage = `\`<${comp.selector} variant="${variant.id}" />\``;
      md += `| **\`${variant.code}\`** | ${comp.label} (\`${comp.code}\`) | **${variant.label}**<br><sub>${variant.hint}</sub> | \`<${comp.selector}>\` | \`${comp.sourcePath}\` | ${usage} |\n`;
    });
  });

  md += `\n---\n\n`;
});

fs.writeFileSync('DICTIONARY.md', md, 'utf8');
console.log('Successfully generated DICTIONARY.md with', totalVars, 'items!');
