import { byNewest, type WorkItem } from "./work";

const entries: WorkItem[] = [
  {
    slug: "quantum-gans",
    kicker: "HONOURS THESIS · UNDER REVIEW",
    title: "The generator or the audit?",
    venue: "VESIT",
    dates: "2025–26",
    sortDate: "2026-09", // ongoing
    tags: ["membership inference", "synthetic data", "differential privacy"],
    summary:
      "How much of a membership-inference audit of synthetic tabular data is a property of the audit rather than the generator.",
    sections: [
      {
        paragraphs: [
          "Membership inference is the standard way to check whether a released synthetic dataset exposes the records it was trained on. The audit returns a number, and that number is normally read as a property of the generator. This thesis holds the generator configurations, the attacks and the code fixed, varies only the evaluation design, and asks how much of the number belongs to the audit instead.",
        ],
      },
      {
        heading: "Where it started",
        paragraphs: [
          "The work began as an audit of depolarizing noise as a privacy mechanism in hybrid quantum generative models. Auditing it carefully surfaced something larger than the original question. A sort-then-split step in an earlier version of the preprocessing had placed members and non-members in structurally different regions of the data, and a density-ratio attack then reported almost the same result for a trained generator as for a reference that memorises nothing at all.",
          "Correcting the split so the two pools are exchangeable sent the same attack back to chance. It also changed whether an identical baseline's synthetic data looked useful, so the split alone was deciding both conclusions: same generators, same attacks, same code.",
        ],
      },
      {
        heading: "A calibration instrument",
        paragraphs: [
          "To read an audit number you need to know what the same design reports when nothing has been memorised, and what it reports when a known amount has been. The instrument supplies both, and never trains a generator. A zero-memorisation reference, fitted to the members' own first and second moments, gives the value each attack and metric returns with nothing to find. A planted-leak ladder gives the smallest exact leak a record-level attack detects, and a jittered ladder, where each planted copy is perturbed by noise, shows which leaks it misses. Degenerate releases and a real-data ceiling do the same job for utility.",
          "Every component is built from the audit's own member pool, holdout pool and split, so it measures the audit alone and can be recomputed at any scale.",
        ],
      },
      {
        heading: "What it finds",
        paragraphs: [
          "Three results share one rule. The split design can decide both the privacy and the utility conclusion, and the attack family determines which failure appears: a population-reference attack is inflated by a shift that leaves a record-level attack at chance. A null is informative only once it carries a detection floor and a blind spot, since exact copies below a measurable count are always found while copies perturbed by small noise largely escape a distance-based attack. And the metrics reported beside the attacks have nulls of their own that move with the dataset, the pool sizes and the split, so a similarity or moment-matching score can reward a release that has learned nothing.",
          "What comes out of it is a reporting protocol, released with the calibration harness, that records the split design, the measured null, the detection floor and the blind spot beside every result. The protocol does not certify privacy. It makes an audit readable: what the audit could and could not detect is stated next to the number, so a reader can weigh it against the leak that would matter for their own use.",
        ],
      },
    ],
  },
  {
    slug: "spoken-language-understanding",
    kicker: "RESEARCH INTERN · LANGUAGE UNDERSTANDING",
    title: "Where the synthetic-to-real gap actually lives",
    venue: "IIT Indore",
    dates: "Dec 2025 – May 2026",
    sortDate: "2026-05",
    tags: ["SLU", "synthetic data", "TTS", "low-resource"],
    summary:
      "Synthetic text + speech for spoken language understanding, and the one dimension per modality that generators collapse.",
    sections: [
      {
        paragraphs: [
          "Building spoken-language-understanding systems (intent classification and slot filling) means annotating large corpora of transcribed, labelled speech, per domain and per language. If synthetic data could replace that annotation, it would remove the dominant cost. The interesting question is not whether adding synthetic data helps (it does, and that is already known) but where the gap between synthetic-only and real training actually lives.",
        ],
      },
      {
        heading: "Approach",
        paragraphs: [
          "The work rebuilds text-and-speech synthesis pipelines for three public SLU benchmarks and adds a diagnostic-to-refine loop: run an error diagnostic on synthetic-only predictions, localise the single dimension the generator systematically collapses, and close it with targeted generation that needs zero additional human annotation.",
        ],
      },
      {
        heading: "Finding",
        paragraphs: [
          "The gap concentrates in one nameable, counterintuitive dimension per modality: speaker identity for speech (not channel or background noise, as usually assumed) and pragmatic indirection for text (not vocabulary or slot coverage). Both are shown to be the causal drivers through intervention and confound-controlled ablation, then closed for free with voice cloning from unlabelled references and register-targeted templates.",
        ],
      },
    ],
  },
  {
    slug: "affective-computing",
    kicker: "RESEARCH FELLOW · AFFECTIVE STATE RECOGNITION",
    title: "State of Mind: reading affect from physiological signals",
    venue: "Amity University",
    dates: "Jun – Jul 2025",
    sortDate: "2025-07",
    tags: ["physiological signals", "MRMR", "SHAP", "WESAD"],
    summary:
      "Detecting stress and other affective states from wearable biosignals with a compact, interpretable feature set.",
    sections: [
      {
        paragraphs: [
          "Prolonged stress carries real health costs, and wearable sensors can capture the physiological signatures that precede it. This fellowship built an automated pipeline to recognise stress and other affective states from multimodal biosignals, designed so the final model is small enough to run where computing power is limited.",
        ],
      },
      {
        heading: "Signals and preprocessing",
        paragraphs: [
          "The work uses the WESAD dataset: ECG, EDA, EMG, respiration, BVP, temperature, and accelerometer data from chest- and wrist-worn sensors recorded under controlled emotional stimuli. Each signal gets its own preprocessing: for ECG, a notch filter to remove powerline interference, a Butterworth bandpass to keep the diagnostic band, wavelet denoising, and Pan-Tompkins R-peak detection to recover a clean inter-beat series.",
        ],
      },
      {
        heading: "Feature selection",
        paragraphs: [
          "From hundreds of candidate features, a multi-stage pipeline keeps only those that are both informative and non-redundant: MRMR within each signal, MRMR again across signals, then SHAP-based iterative pruning driven by a lightweight gradient-boosted model. The result is a compact consensus set that is faster and more interpretable to deploy. Five classifiers spanning tree-based, distance-based, margin-based, and linear paradigms were benchmarked before and after selection.",
        ],
      },
    ],
  },
  {
    slug: "quantformer",
    kicker: "CAPSTONE · VESIT × C-DAC · UNDER REVIEW",
    title: "QuantFormer: does quantum attention help?",
    venue: "VESIT, in collaboration with C-DAC",
    dates: "2025–26",
    sortDate: "2026-08", // ongoing
    tags: ["PyTorch", "quantum attention", "volatility"],
    summary:
      "A hybrid quantum-classical Transformer, judged against a matched classical twin and an exact classical surrogate of its own circuits.",
    sections: [
      {
        paragraphs: [
          "Reports that hybrid quantum-classical models outperform classical ones in financial forecasting rarely rest on controlled comparisons. QuantFormer is a Transformer whose attention computes its queries, keys and values with variational quantum circuits, leaving the rest of the architecture alone. This capstone asks whether that helps, under a comparison built so the answer can actually be read.",
        ],
      },
      {
        heading: "Why the first evaluation could not answer",
        paragraphs: [
          "The work began as an attempt to demonstrate a quantum gain: train on synthetic data from a quantum GAN, test on next-day returns, and expect the advantage to grow with the noise injected into the generator. It did not. Auditing the setup showed why the experiment could not have answered the question for any architecture.",
          "Next-day returns were close to unpredictable, and no model, quantum or classical, beat a constant forecast of zero. When no model has skill, the difference in error between two of them depends mainly on how much their predictions vary, so the metric was rewarding variance rather than accuracy. Directional accuracy misled for a related reason, and the synthetic training windows had lost a relation that holds tightly in real data.",
        ],
      },
      {
        heading: "The redesign",
        paragraphs: [
          "The model is left untouched and the evaluation is rebuilt around a target with known predictability: the range-based volatility of the next five trading days, estimated from daily highs and lows. Three controls sit beside it. A classical twin of identical design, differing only in the attention mechanism. An exact classical surrogate, since each circuit output turns out to be a linear function of a fixed set of trigonometric features, so training that surrogate in place of the circuits tests whether the circuits contribute anything beyond that function class. And the HAR econometric model as a domain baseline.",
          "Models are compared with Diebold-Mariano tests across several random seeds, using a variance estimator that allows for the fact that five-day targets overlap.",
        ],
      },
      {
        heading: "What it concludes",
        paragraphs: [
          "On a target that carries signal, every neural model learned to forecast volatility and ranked the outcomes about equally well, but none beat HAR, and the circuits were never found to reach solutions their own classical surrogate could not. QuantFormer's sensitivity to the random seed traces back to the learning rate of its circuit angles, which take far larger steps than the classical weights; lowering it removes most of the spread and leaves the model level with its classical twin rather than above it.",
          "At this circuit size the quantum layer behaves as a fixed set of trigonometric features, and the classical version of that layer is cheaper to train and more stable. The work ends with a checklist for evaluating quantum forecasting models: show the target can be learned at all, compare against naive and domain baselines, use a matched classical twin and, for small circuits, an exact surrogate, report several seeds with tests that allow for overlapping targets, and check that synthetic training data preserve the relations of the real data before training on them.",
        ],
      },
    ],
  },
];

export const research = byNewest(entries);
