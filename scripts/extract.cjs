#!/usr/bin/env node

/**
 * Extractor de componentes por código para AngularCanvas.
 * Permite a desarrolladores y agentes de IA extraer y copiar cualquier componente por su código.
 *
 * Uso:
 *   node scripts/extract.cjs 9.4.2.1
 *   node scripts/extract.cjs 10.3.1.1 --dest ../otro-proyecto/src/app/components
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const code = args[0];

if (!code) {
  console.log(`
Uso: node scripts/extract.cjs <código> [--dest <ruta_destino>]

Ejemplos:
  node scripts/extract.cjs 9.4.2.1
  node scripts/extract.cjs 10.3.1.1 --dest ./src/app/components/
`);
  process.exit(1);
}

let destArgIndex = args.indexOf('--dest');
if (destArgIndex === -1) {
  destArgIndex = args.indexOf('-d');
}
const destDir = destArgIndex !== -1 ? args[destArgIndex + 1] : null;

const dictPath = path.join(__dirname, '..', 'public', 'dictionary.json');
if (!fs.existsSync(dictPath)) {
  console.error('No se encontró public/dictionary.json. Ejecuta: npm run dictionary');
  process.exit(1);
}

const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

let match = null;
let parentComp = null;
let parentGroup = null;

for (const group of dict.groups) {
  for (const comp of group.components) {
    if (comp.code === code) {
      match = comp;
      parentComp = comp;
      parentGroup = group;
      break;
    }
    for (const v of comp.variants) {
      if (v.code === code) {
        match = v;
        parentComp = comp;
        parentGroup = group;
        break;
      }
    }
    if (match) break;
  }
  if (match) break;
}

if (!match) {
  console.error(`❌ No se encontró ningún componente o variante con el código: ${code}`);
  process.exit(1);
}

const isVariant = match !== parentComp;
console.log(`\n======================================================`);
console.log(`🎯 COMPONENTE LOCALIZADO: [${match.code}]`);
console.log(`   Categoría : ${parentGroup.label} [${parentGroup.code}]`);
console.log(`   Componente: ${parentComp.label} [${parentComp.code}]`);
if (isVariant) {
  console.log(`   Variante  : ${match.label} [${match.code}] (${match.hint})`);
}
console.log(`   Selector  : <${parentComp.selector} ${isVariant ? `[variant]="'${match.id}'"` : ''} />`);
console.log(`   Ubicación : ${parentComp.sourcePath}`);
for (const command of parentComp.npmInstall ?? []) {
  console.log(`   Instalar  : ${command}`);
}
if (parentComp.requiresForms) {
  console.log('   Requiere  : @angular/forms en la misma versión que @angular/core');
}
console.log(`======================================================\n`);

if (destDir) {
  const srcFullPath = path.join(__dirname, '..', parentComp.sourcePath);
  if (!fs.existsSync(srcFullPath)) {
    console.error(`❌ Carpeta fuente no encontrada: ${srcFullPath}`);
    process.exit(1);
  }

  const targetFolder = path.join(path.resolve(destDir), path.basename(parentComp.sourcePath));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  const files = fs.readdirSync(srcFullPath);
  for (const f of files) {
    const sFile = path.join(srcFullPath, f);
    const dFile = path.join(targetFolder, f);
    if (fs.statSync(sFile).isFile()) {
      fs.copyFileSync(sFile, dFile);
      console.log(`  ✓ Copiado: ${f} -> ${dFile}`);
    }
  }
  console.log(`\n🎉 Componente extraído con éxito en: ${targetFolder}`);
} else {
  console.log(`Para copiar directamente los archivos añade: --dest <carpeta_destino>`);
}
