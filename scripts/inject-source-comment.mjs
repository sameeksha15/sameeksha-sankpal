// Injects a comment into the <head> of every exported page. React cannot render
// a raw HTML comment without leaving a stray DOM node, and this only needs to
// exist in the shipped markup — so it goes in as a postbuild step.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "out";

const COMMENT = `<!--
     |0⟩ ──[H]──●──      you found the source.
                │        a Bell pair: neither qubit has
     |0⟩ ───────⊕──      a state of its own.

     |Φ+⟩ = (|00⟩ + |11⟩) / √2
-->
`;

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

let count = 0;
for (const file of htmlFiles(OUT_DIR)) {
  const html = readFileSync(file, "utf8");
  if (html.includes("|Φ+⟩")) continue;
  const at = html.indexOf("<head>");
  if (at === -1) continue;
  writeFileSync(
    file,
    html.slice(0, at + 6) + "\n" + COMMENT + html.slice(at + 6),
    "utf8",
  );
  count++;
}

console.log(`injected source comment into ${count} page(s)`);
