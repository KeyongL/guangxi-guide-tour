#!/usr/bin/env node
// F049 —「冒险」内容合规护栏 / adventure-content compliance gate.
//
// SPEC 硬约束（docs/SPEC.md §合规护栏 + §不发布翻墙/VPN 教程）：
// "冒险"仅限合法、安全的户外/体验玩法；严禁引导以下行为——与签证分区标注（F033）
// 同属构建期强制的合规红线。build 前置运行，命中即 exit≠0 拦截发布。
//
// ── 合规红线清单（Compliance red lines）─────────────────────────────
//  1. 走非正规/不设关口岸越境        unofficial / irregular border crossing point
//  2. 非法越境 / 偷越 / 偷渡          illegal border crossing / smuggling across
//  3. 逃避 / 绕过 / 躲避边检·移民检查  avoiding / evading / bypassing immigration control
//  4. 翻越·泅渡·潜越国境线            climbing / swimming / sneaking over the border line
//  5. 拍摄边防 / 军事管理区           photographing border-defense / military-administered zones
//  6. 翻墙(VPN)绕过管控越境           using a VPN (翻墙) to cross / circumvent controls
//
// 设计原则：只针对"非法/危险意图动词"，不针对 border / crossing / Vietnam / 友谊关 /
// 东兴 等合法名词，避免误杀正常攻略内容。
// ────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT_DIR = join(ROOT, 'content');

// 每条规则：命中即视为触碰红线。围绕"非法意图"设计，而非单纯名词。
const RULES = [
  {
    id: 'illegal-border-crossing',
    desc: '非法越境 / illegal border crossing',
    patterns: [
      /illegal(?:ly)?\s+(?:border[- ]?)?cross/i,
      /cross\w*\s+(?:the\s+)?border[^.\n]{0,30}\billegal/i,
      /偷越(?:国|边)?境?/,
      /非法(?:越境|出境|入境|偷渡)/,
      /偷渡/,
      /私自越境/,
    ],
  },
  {
    id: 'unofficial-crossing-point',
    desc: '非正规/不设关口岸越境 / unofficial or irregular border crossing point',
    patterns: [
      /\b(?:unofficial|irregular|informal|unmanned|unguarded|unmarked)\s+(?:border\s+)?(?:crossing|crossings|point|points|port|ports|checkpoint|trail|path)/i,
      /非正规口岸/,
      /非法口岸/,
      /便道越境/,
    ],
  },
  {
    id: 'evade-immigration',
    desc: '逃避/绕过/躲避边检·移民检查 / avoiding immigration or border control',
    patterns: [
      /\b(?:avoid|avoiding|evade|evading|bypass|bypassing|dodge|dodging|circumvent|circumventing)\s+(?:the\s+)?(?:immigration|border\s+(?:control|inspection|check|guards?|post)|passport\s+control|customs\s+control)/i,
      /(?:绕过|躲避|逃避|避开|绕开)\s*(?:边检|边防|移民|海关)/,
    ],
  },
  {
    id: 'sneak-over-border',
    desc: '翻越/泅渡/潜越国境线 / climbing or sneaking over the border line',
    patterns: [
      /\b(?:smuggl\w+|sneak\w*|slip\w*|climb\w*|jump\w*|wade\w*|swim\w*)\s+(?:across\s+|over\s+|past\s+)?(?:the\s+)?border/i,
      /(?:翻越|泅渡|潜越|偷偷越过)\s*(?:国境|边境|边界|国界)/,
    ],
  },
  {
    id: 'photograph-military-zone',
    desc: '拍摄边防/军事管理区 / photographing border-defense or military zones',
    patterns: [
      /\b(?:photograph\w*|photo\w*|shoot\w*|film\w*|filming)\s+[^.\n]{0,40}(?:border[- ]?defen[cs]e|military\s+(?:zone|area|installation|facilit|administered|post|base)|border\s+guard\s+post)/i,
      /(?:border[- ]?defen[cs]e|military\s+(?:zone|area|installation|administered\s+zone|post))\s+[^.\n]{0,20}(?:photo|picture|shoot|film)/i,
      /(?:边防|军事管理区|军事禁区|边防禁区|军事设施)[^。\n]{0,12}(?:拍摄|拍照|摄影)/,
      /(?:拍摄|拍照|摄影)[^。\n]{0,12}(?:边防|军事管理区|军事禁区|边防禁区|军事设施)/,
    ],
  },
  {
    id: 'vpn-circumvention',
    desc: '翻墙(VPN)绕过管控/越境 / using a VPN to cross or circumvent controls',
    patterns: [
      /\bVPN\b[^.\n]{0,40}(?:cross|border|circumvent|evade|smuggl)/i,
      /翻墙/,
    ],
  },
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
}

let files;
try {
  files = walk(CONTENT_DIR);
} catch {
  console.log('✓ compliance: no content/ directory to scan.');
  process.exit(0);
}

const hits = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.patterns.some((re) => re.test(line))) {
        hits.push({ file: relative(ROOT, file), line: i + 1, rule, text: line.trim() });
      }
    }
  });
}

if (hits.length > 0) {
  console.error('\n✗ 合规护栏拦截：内容触碰 SPEC 红线，禁止发布。\n  Compliance gate BLOCKED publishing — content hit a SPEC red line:\n');
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  [${h.rule.id}] ${h.rule.desc}`);
    console.error(`      → ${h.text}`);
  }
  console.error(`\n共 ${hits.length} 处红线命中。请改为合法、安全的户外玩法后再构建。\n`);
  process.exit(1);
}

console.log(`✓ compliance: ${files.length} content file(s) clean, no SPEC red lines.`);
process.exit(0);
