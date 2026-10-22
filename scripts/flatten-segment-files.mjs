// Works around a Windows-only Next.js static-export bug: segment prefetch
// payloads are written into `__next.*/` subdirectories (backslash path parts
// survive the slash-to-dot conversion), while the client requests them as
// flat dot-joined filenames. On Linux (CI) the export is already correct and
// this script finds nothing to do.
import { cpSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "out";

function flatten(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) {
      for (const file of walk(full)) {
        const flatName = file
          .slice(dir.length + 1)
          .replaceAll("\\", ".")
          .replaceAll("/", ".");
        cpSync(file, join(dir, flatName));
      }
      rmSync(full, { recursive: true });
    } else {
      flatten(full);
    }
  }
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

flatten(OUT_DIR);
