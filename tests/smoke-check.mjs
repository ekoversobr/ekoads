import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";

const root = process.cwd();
const modulesRoot = resolve(root, "modules");
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (full.endsWith(".html")) htmlFiles.push(full);
  }
}

walk(modulesRoot);

const errors = [];
let references = 0;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  const scriptPattern = /<script\b[^>]*\bsrc=["']([^"'?#]+)(?:[?#][^"']*)?["'][^>]*>/gi;
  for (const match of html.matchAll(scriptPattern)) {
    const src = match[1];
    if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) continue;
    references++;
    const target = resolve(dirname(htmlFile), src);
    try {
      readFileSync(target);
    } catch {
      errors.push(`${relative(root, htmlFile)} references missing script: ${src}`);
    }
  }
}

if (errors.length) {
  console.error("HTML script reference checks failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`HTML smoke check passed: ${htmlFiles.length} HTML files, ${references} local script references.`);
}
