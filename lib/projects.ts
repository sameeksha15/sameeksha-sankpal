import type { WorkItem } from "./work";

// GitHub links: fill `href` once the repo is public, then the "GitHub ↗" link
// renders automatically. Screenshots: drop PNGs into public/projects/<slug>/
// and add them to `images`.

const entries: WorkItem[] = [
  {
    slug: "qapital",
    kicker: "",
    dates: "2026",
    sortDate: "2026-10",
    title: "Qapital: quantum portfolio selection",
    tags: ["QAOA", "Qiskit", "FastAPI", "React"],
    summary:
      "Choosing a handful of stocks with a quantum optimiser, then checking that choice honestly against classical methods.",
    sections: [
      {
        paragraphs: [
          "Qapital picks a small basket of stocks out of the NIFTY 50 or the S&P 100 using QAOA, simulated with Qiskit, and then sets that choice beside classical optimisers and blind guessing on exactly the same problem. It runs as a live service rather than a notebook, so the same pipeline that produces a result also prices the orders it implies.",
        ],
      },
      {
        heading: "The problem it actually solves",
        paragraphs: [
          "Rather than a toy objective, it models what an investor faces: a chosen market and shortlist, the cash available, and the shares already held. Expected returns use Bayes-Stein shrinkage and risk uses Ledoit-Wolf, and trading costs come from published rate cards, so holding on to a stock already owned is cheaper than buying a new one. Daily prices for both indices are refreshed nightly into a dated, fingerprinted snapshot, and every result records which snapshot it was computed from.",
        ],
      },
      {
        heading: "The circuits and the controls",
        paragraphs: [
          "Three circuits are available: the textbook penalty circuit; an XY-mixer circuit that holds the number of chosen stocks fixed by construction, so every shot is a legal portfolio; and a warm-started circuit that begins near a classical relaxation's answer. Each can be tuned on its best outcomes rather than its average one, pruned to the strongest links between stocks, and run against the noise model of a real IBM chip with readout mitigation.",
          "Every answer is then scored by one shared function and compared with brute force where the shortlist is small enough to enumerate, simulated annealing, a convex relaxation, and random guessing given the same number of tries. Where the portfolios cannot all be checked, the result says the best one found is the best known rather than the best.",
        ],
      },
      {
        heading: "What it does not claim",
        paragraphs: [
          "Classical methods solve problems of this size in seconds on a laptop, and exactly so when the shortlist is small enough to enumerate. The circuits here run on a simulator. The project is built to show what the quantum method would need in order to compete, not to claim that it already does.",
        ],
      },
      {
        heading: "How it runs",
        paragraphs: [
          "A nightly pipeline publishes checked prices. A `FastAPI` service runs jobs with live progress over server-sent events and keeps results in Postgres, deployed serverless on Modal. A React and TypeScript front end on Vercel shows saved runs whenever the API is starting up or cannot be reached, with its types generated from the API's OpenAPI schema. Continuous integration runs linting, type checking and the Python test suite, the front end's type check, unit tests and browser smoke tests, and rebuilds the container image.",
        ],
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/sameeksha15/Qapital" },
      { label: "Live site", href: "https://qapital-dun.vercel.app" },
      {
        label: "API docs",
        href: "https://sameeksha15--qapital-api.modal.run/docs",
      },
    ],
  },
  {
    slug: "qec-decoders",
    kicker: "",
    dates: "2026",
    sortDate: "2026-09",
    title: "QEC decoder study",
    tags: ["Stim", "PyMatching", "surface code"],
    summary:
      "Benchmarking quantum error-correction decoders on the surface code, accuracy and latency on the same footing.",
    sections: [
      {
        paragraphs: [
          "This study benchmarks quantum error-correction decoders on the rotated surface code under circuit-level noise, measuring logical accuracy and decoding latency through one uniform interface so the comparison is fair by construction. It is built on the standard QEC research stack of Stim, Sinter, PyMatching and ldpc, rather than gate-level simulators, because threshold studies need millions of Monte-Carlo shots.",
        ],
      },
      {
        heading: "Why a threshold is the thing to measure",
        paragraphs: [
          "Below a critical physical error rate, adding qubits helps: the logical error rate falls off with the code distance, because a logical failure needs a chain of physical errors to line up.",
        ],
        equation: {
          body: "*p*_{L} ∝ (*p* / *p*_{th})^{⌊(*d*+1)/2⌋}",
          number: "1",
        },
      },
      {
        paragraphs: [
          "Above that threshold the same scaling works against you and a larger code is worse than a smaller one, so the threshold is what decides whether a machine can be scaled at all. The catch is that it is not a property of the code alone: it depends on the decoder used to read the syndromes.",
        ],
      },
      {
        heading: "What it compares",
        paragraphs: [
          "Three decoders (minimum-weight perfect matching, union-find and BP+OSD) run behind the same `sinter.CompiledDecoder` path on identical sampled data, with latency measured on shared fixed-seed syndrome batches. The pipeline first reproduces the surface-code threshold as a validated baseline, then studies how decoder choice moves not just a constant factor but the code's effective operating envelope. It is actively developed, with further noise models being studied on top of this baseline.",
        ],
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/sameeksha15/qec-decoder" },
    ],
  },
  {
    slug: "fleetup",
    kicker: "",
    dates: "2024–25",
    sortDate: "2025-03",
    title: "FleetUp: learned route optimization",
    tags: ["DQN", "GNN", "FastAPI", "React"],
    summary:
      "Traffic-aware, multi-trip fleet routing that scores three different planners against one shared cost.",
    sections: [
      {
        paragraphs: [
          "FleetUp decides which truck delivers which orders, in what sequence, and at what time of day, so a full day of deliveries finishes on time at the lowest total cost. It models the realities most routing demos skip: driver shifts and lunch breaks, reload trips back to the depot, traffic that worsens at rush hour, weather, and customers who are not home.",
        ],
      },
      {
        heading: "The engine",
        paragraphs: [
          "Everything optimizes one shared cost formula: driving time, distance, per-trip fixed cost, waiting, lateness scaled by priority, overtime, and failed deliveries. Because every planner is judged by that same number, three very different approaches can be compared fairly: a classic operations-research routing solver, a Deep Q-Network agent, and a graph neural network. A single minute-by-minute simulator then plays out whichever plan was produced, inserting waiting, the lunch break, reloads, randomly failed deliveries with one economically justified retry, and overtime.",
          "Stops are grouped with density-based clustering before assignment, travel times are recomputed for the hour each trip actually departs, and weather scales all of it. Runs are fully reproducible from the same inputs and seed.",
        ],
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/sameeksha15/fleetup-route-optimizer" },
    ],
  },
  {
    slug: "leaf-logic",
    kicker: "",
    dates: "2025",
    sortDate: "2025-08",
    title: "Leaf Logic: plant-disease detection",
    tags: ["EfficientNet", "PyTorch", "React", "Gemini"],
    summary:
      "Upload a leaf photo, get a diagnosis and plain-language, farmer-focused guidance.",
    sections: [
      {
        paragraphs: [
          "Leaf Logic identifies plant diseases from a single field photo. A user uploads a leaf image; a deep-learning model classifies the crop and disease with a confidence score; and a language model turns that label into practical, plain-language advice about what the disease is, what causes it, and how to stop it spreading.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "The classifier is an EfficientNet-B0 fine-tuned with transfer learning on PlantDoc, a dataset of real-world, in-the-wild leaf photographs, so it is built for the kind of images people actually take. Google Gemini generates the guidance, with a built-in templated fallback so the app still works offline. It runs as three cooperating services (a React frontend, a Node/Express API, and a Python/Flask machine-learning service backed by MongoDB) entirely locally, with no paid cloud accounts required.",
        ],
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/sameeksha15/10_ZerotoOne_2" },
    ],
  },
  {
    slug: "maze-wasm",
    kicker: "",
    dates: "2026",
    sortDate: "2026-06",
    title: "Maze solver in WebAssembly",
    tags: ["C", "WebAssembly", "Emscripten"],
    summary:
      "BFS and DFS pathfinding written in C, compiled to WebAssembly, running natively in the browser.",
    sections: [
      {
        paragraphs: [
          "An interactive maze solver with a deliberate architectural twist: the pathfinding, breadth-first and depth-first search, is written in C and compiled to WebAssembly with Emscripten (`emcc`), then driven by a vanilla JavaScript, HTML, and CSS frontend. Rather than implementing the algorithms in JavaScript, it leverages C's speed and manual memory management to run them natively in the browser.",
        ],
      },
      {
        heading: "Under the hood",
        paragraphs: [
          "You draw walls on a grid from 4×4 up to 16×16 and watch either algorithm trace the shortest path step by step. When you hit solve, JavaScript flattens the grid, allocates WebAssembly memory with `malloc`, and calls into the C function; the C code computes the path, writes it back to a shared pointer, and JavaScript reads it straight from the heap as an `Int32Array` to paint the result. Custom mazes persist in the browser via local storage. It is a small, concrete demonstration of bridging C memory pointers and JavaScript typed arrays across the Wasm boundary.",
        ],
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/sameeksha15/Maze_Solver" },
    ],
  },
];

// A chosen order rather than a chronological one, so the entry number is just
// the position in that order and the two can never drift apart.
export const projects: WorkItem[] = entries.map((p, i) => ({
  ...p,
  kicker: `ENTRY ${String(i + 1).padStart(2, "0")}`,
}));
