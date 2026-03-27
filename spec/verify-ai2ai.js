/**
 * AI2AI wen dang jiao yan jiao ben
 * 
 * yong tu：jian ce AI2AI wen dang yu shi ji dai ma zhi jian de jie gou xing bu yi zhi
 * yun xing：node spec/verify-ai2ai.js
 * 
 * jiao yan nei rong：
 * 1. Frontend Architecture Info.md zhong deDirectory Structure vs shi ji wen jian
 * 2. Backend Architecture Info.md zhong deDirectory Structure vs shi ji wen jian
 * 3. Protocols and Data.md zhong de biao ding yi vs init.js zhong de biao ding yi
 * 4. Protocols and Data.md zhong deAPIduan dian vs lu you wen jian zhong de duan dian
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SPEC_DIR = path.join(ROOT, 'spec', 'AI2AI');

let totalIssues = 0;

function printHeader(title) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

function printIssue(type, msg) {
  totalIssues++;
  const prefix = type === 'missing' ? '[wen dang you/shi ji wu]' :
                 type === 'undoc'   ? '[shi ji you/wen dang wu]' :
                 type === 'mismatch' ? '[bu yi zhi]' : '[Info]';
  console.log(`  ${prefix} ${msg}`);
}

function printOk(msg) {
  console.log(`  [OK] ${msg}`);
}

// ============================================================
// 1. cong markdown deDirectory Structuredai ma kuai zhong ti qu wen jian lu jing
// ============================================================
function extractPathsFromTree(markdown, rootPrefix) {
  const treeBlockMatch = markdown.match(/```[\s\S]*?```/);
  if (!treeBlockMatch) return [];

  const treeBlock = treeBlockMatch[0];
  const lines = treeBlock.split('\n');
  const paths = [];

  for (const line of lines) {
    // pi pei lei si "│   ├── somefile.js" huo "├── dir/" de xing
    const match = line.match(/[├└│─\s]*\s*([^\s#]+)/);
    if (!match) continue;
    
    let name = match[1].trim();
    if (name === '```' || name === rootPrefix + '/') continue;
    
    // tiao guo mu lu xing（yi / jie wei）
    if (name.endsWith('/')) continue;
    
    // zhi chu li you kuo zhan ming de wen jian
    if (!name.includes('.')) continue;
    
    // cong suo jin tui duan lu jing ceng ji
    const indent = line.replace(/[^\s│]/g, '').length;
    paths.push({ name, indent, line: line.trim() });
  }

  return paths;
}

// bu xu yao zai wen dang zhong ji lu de zi dong sheng cheng wen jian
const IGNORE_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.DS_Store',
  'thumbs.db'
]);

// di gui sao miao mu lu huo qu shi ji wen jian
function scanDir(dir, baseDir, extensions) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    if (IGNORE_FILES.has(entry.name)) continue;
    
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    
    if (entry.isDirectory()) {
      results.push(...scanDir(fullPath, baseDir, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(relPath);
    }
  }
  return results;
}

// ============================================================
// 2. cong markdown ti qu wen jian ming ji he
// ============================================================
function extractFileNames(markdown) {
  const files = new Set();
  // pi pei "├── filename" huo "└── filename" ge shi（zhi chi .env deng wu kuo zhan ming wen jian）
  const regex = /[├└]\s*──\s*(\.?[A-Za-z0-9_\-]+(?:\.[A-Za-z0-9]+)*)/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const name = match[1];
    // tiao guo chun mu lu ming（wu dian hao qie bu yi.kai tou de）
    if (!name.includes('.')) continue;
    files.add(name);
  }
  return files;
}

// ============================================================
// 3. cong init.js ti qu biao ming
// ============================================================
function extractTablesFromInitJs(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf-8');
  const tables = new Set();
  const regex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    tables.add(match[1]);
  }
  return tables;
}

// cong xie yi wen dang ti qu biao ming
function extractTablesFromProtocol(markdown) {
  const tables = new Set();
  // pi pei "#### tablename" huo "### tablename" zaiDatabase Designzhang jie xia de biao ming
  const regex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/gi;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    tables.add(match[1]);
  }
  return tables;
}

// ============================================================
// 4. cong lu you wen jian ti quAPIduan dian
// ============================================================
function extractRoutesFromCode(routesDir) {
  const endpoints = [];
  if (!fs.existsSync(routesDir)) return endpoints;
  
  const prefixMap = {
    'health.js': '/api/health',
    'auth.js': '/api/auth',
    'user.js': '/api/user',
    'admin.js': '/api/admin',
    'product.js': '/api/products',
    'cart.js': '/api/cart'
  };

  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
  
  for (const file of files) {
    const prefix = prefixMap[file] || `/api/${file.replace('.js', '')}`;
    const content = fs.readFileSync(path.join(routesDir, file), 'utf-8');
    
    // pi pei router.get('/path', ...) deng
    const regex = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      const fullPath = routePath === '/' ? prefix : prefix + routePath;
      endpoints.push({ method, path: fullPath });
    }
  }
  return endpoints;
}

// cong xie yi wen dang ti quAPIduan dian
function extractRoutesFromProtocol(markdown) {
  const endpoints = [];
  // pi pei biao ge zhong de "| GET | `/api/xxx` |" ge shi
  const regex = /\|\s*(GET|POST|PUT|DELETE|PATCH)\s*\|\s*`([^`]+)`/gi;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    endpoints.push({ method: match[1].toUpperCase(), path: match[2] });
  }
  return endpoints;
}

// ============================================================
// zhu jiao yan liu cheng
// ============================================================
function verify() {
  console.log('AI2AI wen dang jiao yan bao gao');
  console.log(`sheng cheng shi jian: ${new Date().toISOString()}`);

  // du qu wen dang
  const frontendDoc = fs.readFileSync(path.join(SPEC_DIR, 'Frontend Architecture Info.md'), 'utf-8');
  const backendDoc = fs.readFileSync(path.join(SPEC_DIR, 'Backend Architecture Info.md'), 'utf-8');
  const protocolDoc = fs.readFileSync(path.join(SPEC_DIR, 'Protocols and Data.md'), 'utf-8');

  // --- Frontendwen jian jiao yan ---
  printHeader('FrontendDirectory Structurejiao yan');
  const frontendDocFiles = extractFileNames(frontendDoc);
  const frontendSrcFiles = scanDir(
    path.join(ROOT, 'frontend', 'src'),
    path.join(ROOT, 'frontend'),
    ['.vue', '.js']
  ).map(f => path.basename(f));
  // ye sao miaofrontendgen mu lu xia de wen jian（fei di gui）
  const frontendRootFiles = fs.readdirSync(path.join(ROOT, 'frontend'))
    .filter(f => !fs.statSync(path.join(ROOT, 'frontend', f)).isDirectory())
    .filter(f => ['.js', '.html', '.json'].some(ext => f.endsWith(ext)))
    .filter(f => !IGNORE_FILES.has(f));
  const frontendActualSet = new Set([...frontendSrcFiles, ...frontendRootFiles]);

  let feOk = true;
  for (const f of frontendDocFiles) {
    if (!frontendActualSet.has(f)) {
      printIssue('missing', `${f}`);
      feOk = false;
    }
  }
  for (const f of frontendActualSet) {
    if (!frontendDocFiles.has(f)) {
      printIssue('undoc', `${f}`);
      feOk = false;
    }
  }
  if (feOk) printOk('FrontendDirectory Structureyu wen dang yi zhi');

  // --- Backendwen jian jiao yan ---
  printHeader('BackendDirectory Structurejiao yan');
  const backendDocFiles = extractFileNames(backendDoc);
  const backendSrcFiles = scanDir(
    path.join(ROOT, 'backend', 'src'),
    path.join(ROOT, 'backend'),
    ['.js']
  ).map(f => path.basename(f));
  // sao miaobackendgen mu lu wen jian、test/mu lu、database/mu lu
  const backendExtraDirs = ['test', 'database'];
  const backendExtraFiles = [];
  for (const dir of backendExtraDirs) {
    const dirPath = path.join(ROOT, 'backend', dir);
    if (fs.existsSync(dirPath)) {
      backendExtraFiles.push(...scanDir(dirPath, path.join(ROOT, 'backend'), ['.js', '.db']).map(f => path.basename(f)));
    }
  }
  const backendRootFiles = fs.readdirSync(path.join(ROOT, 'backend'))
    .filter(f => {
      const full = path.join(ROOT, 'backend', f);
      return !fs.statSync(full).isDirectory();
    })
    .filter(f => ['.js', '.json', '.env', '.db'].some(ext => f.endsWith(ext)) || f === '.env')
    .filter(f => !IGNORE_FILES.has(f));
  const backendActualSet = new Set([...backendSrcFiles, ...backendExtraFiles, ...backendRootFiles]);

  let beOk = true;
  for (const f of backendDocFiles) {
    if (!backendActualSet.has(f)) {
      printIssue('missing', `${f}`);
      beOk = false;
    }
  }
  for (const f of backendActualSet) {
    if (!backendDocFiles.has(f)) {
      printIssue('undoc', `${f}`);
      beOk = false;
    }
  }
  if (beOk) printOk('BackendDirectory Structureyu wen dang yi zhi');

  // --- Databasebiao jiao yan ---
  printHeader('Databasebiao ding yi jiao yan');
  const initJsTables = extractTablesFromInitJs(path.join(ROOT, 'backend', 'src', 'database', 'init.js'));
  const protocolTables = extractTablesFromProtocol(protocolDoc);

  let dbOk = true;
  for (const t of initJsTables) {
    if (!protocolTables.has(t)) {
      printIssue('undoc', `biao ${t} zai init.js zhong cun zai dan xie yi wen dang wuDDL`);
      dbOk = false;
    }
  }
  for (const t of protocolTables) {
    if (!initJsTables.has(t)) {
      printIssue('missing', `biao ${t} zai xie yi wen dang zhong youDDLdan init.js zhongDoes not exist`);
      dbOk = false;
    }
  }
  if (dbOk) printOk('Databasebiao ding yi yu wen dang yi zhi');

  // --- APIduan dian jiao yan ---
  printHeader('APIduan dian jiao yan');
  const codeRoutes = extractRoutesFromCode(path.join(ROOT, 'backend', 'src', 'routes'));
  const docRoutes = extractRoutesFromProtocol(protocolDoc);

  // biao zhun hua lu jing yong yu bi jiao (jiang :param tong yi)
  const normalize = (p) => p.replace(/:\w+/g, ':param');
  
  const codeSet = new Set(codeRoutes.map(r => `${r.method} ${normalize(r.path)}`));
  const docSet = new Set(docRoutes.map(r => `${r.method} ${normalize(r.path)}`));
  // wen dang zhong biao ji weiNot implementedde bu suan cha yi，zhi jian cha yi shi xian biao ji de
  const docImplemented = new Set();
  const implRegex = /\|\s*(GET|POST|PUT|DELETE|PATCH)\s*\|\s*`([^`]+)`\s*\|[^|]*\|\s*✅/gi;
  let implMatch;
  while ((implMatch = implRegex.exec(protocolDoc)) !== null) {
    docImplemented.add(`${implMatch[1].toUpperCase()} ${normalize(implMatch[2])}`);
  }

  let apiOk = true;
  // wen dang biao ji✅dan dai ma zhong mei you
  for (const r of docImplemented) {
    if (!codeSet.has(r)) {
      printIssue('missing', `${r} wen dang biao ji yi shi xian dan dai ma zhong wei zhao dao`);
      apiOk = false;
    }
  }
  // dai ma zhong you dan wen dang wan quan mei ti dao
  for (const r of codeSet) {
    if (!docSet.has(r)) {
      printIssue('undoc', `${r} dai ma zhong cun zai dan wen dang wei ji lu`);
      apiOk = false;
    }
  }
  if (apiOk) printOk('APIduan dian yu wen dang yi zhi');

  // --- zong jie ---
  printHeader('jiao yan zong jie');
  if (totalIssues === 0) {
    console.log('  ✅ quan bu tong guo，AI2AIwen dang yu dai ma yi zhi');
  } else {
    console.log(`  ⚠️  fa xian ${totalIssues} ge bu yi zhi xiang，qingUpdateAI2AIwen dang`);
  }
  console.log('');
}

verify();
