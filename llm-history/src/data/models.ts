import type { LLMModel } from "./types";

export const MODELS: LLMModel[] = [
  // ───────────────────────────── Foundations (2017–2018) ─────────────────────────────
  {
    slug: "transformer",
    name: "Transformer",
    org: "Google Brain",
    family: "other",
    releaseDate: "2017-06-12",
    era: "foundations",
    access: "research",
    modality: ["text"],
    parameters: "65M (base model)",
    contextWindow: "512 tokens",
    summary:
      "The paper \"Attention Is All You Need\" replaces recurrence and convolution with self-attention, introducing the architecture every modern LLM is built on.",
    significance:
      "Every model in this timeline is a descendant of this paper. Self-attention let training parallelize across GPUs instead of stepping through a sequence token by token, which is the single biggest reason language models could later scale to billions of parameters.",
    keyFeatures: [
      "Introduces scaled dot-product self-attention",
      "Fully parallelizable training (no recurrence)",
      "Encoder-decoder design, first applied to machine translation",
      "Positional encodings replace sequence order in recurrence",
    ],
    links: [
      { label: "Attention Is All You Need (paper)", url: "https://arxiv.org/abs/1706.03762" },
    ],
  },
  {
    slug: "gpt-1",
    name: "GPT-1",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2018-06-11",
    era: "foundations",
    access: "research",
    modality: ["text"],
    parameters: "117M",
    contextWindow: "512 tokens",
    summary:
      "OpenAI's first Generative Pre-trained Transformer shows that unsupervised pretraining on raw text followed by task-specific fine-tuning beats fully-supervised pipelines.",
    significance:
      "Established the \"pretrain then fine-tune\" recipe that the entire GPT lineage — and most of the field — followed for years afterward.",
    keyFeatures: [
      "Decoder-only Transformer",
      "Pretrained on BookCorpus (~7,000 books)",
      "Fine-tuned per downstream task",
    ],
    links: [{ label: "Improving Language Understanding (paper)", url: "https://openai.com/research/language-unsupervised" }],
  },
  {
    slug: "bert",
    name: "BERT",
    org: "Google AI",
    family: "bert",
    releaseDate: "2018-10-11",
    era: "foundations",
    access: "open-weight",
    modality: ["text"],
    parameters: "340M (Large)",
    contextWindow: "512 tokens",
    summary:
      "Bidirectional Encoder Representations from Transformers reads text in both directions at once, setting new state-of-the-art results across eleven NLP benchmarks.",
    significance:
      "Popularized the encoder-only, masked-language-modeling approach and became the default backbone for search, classification, and embeddings for years — Google used it to improve Search itself.",
    keyFeatures: [
      "Bidirectional attention via masked-language modeling",
      "Next-sentence-prediction pretraining objective",
      "Open weights, quickly became an NLP industry standard",
    ],
    links: [{ label: "BERT (paper)", url: "https://arxiv.org/abs/1810.04805" }],
  },

  // ───────────────────────────── Scaling Up (2019–2020) ─────────────────────────────
  {
    slug: "gpt-2",
    name: "GPT-2",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2019-02-14",
    era: "scaling",
    access: "open-weight",
    modality: ["text"],
    parameters: "1.5B",
    contextWindow: "1,024 tokens",
    summary:
      "A 10x scale-up of GPT-1 that generates coherent multi-paragraph text well enough that OpenAI initially withheld the full model, citing misuse risk.",
    significance:
      "The staged release sparked the field's first serious public debate about responsible disclosure of model weights, a conversation still ongoing today.",
    keyFeatures: [
      "Zero-shot task performance without fine-tuning",
      "Trained on WebText, 8M scraped web pages",
      "Staged release: 124M → 355M → 774M → 1.5B over 9 months",
    ],
  },
  {
    slug: "megatron-lm",
    name: "Megatron-LM",
    org: "NVIDIA",
    family: "other",
    releaseDate: "2019-09-17",
    era: "scaling",
    access: "research",
    modality: ["text"],
    parameters: "8.3B",
    contextWindow: "1,024 tokens",
    summary:
      "NVIDIA's model-parallel training framework proves multi-billion-parameter Transformers can be trained efficiently by splitting layers across GPUs.",
    significance:
      "The tensor-parallelism techniques introduced here became foundational infrastructure — later versions of Megatron underpin training stacks used across the industry.",
    keyFeatures: [
      "Intra-layer model parallelism across GPUs",
      "Blueprint for training clusters used industry-wide",
    ],
  },
  {
    slug: "t5",
    name: "T5",
    org: "Google AI",
    family: "t5",
    releaseDate: "2019-10-23",
    era: "scaling",
    access: "open-weight",
    modality: ["text"],
    parameters: "11B (largest)",
    contextWindow: "512 tokens",
    summary:
      "The Text-to-Text Transfer Transformer reframes every NLP task — translation, summarization, classification — as text-in, text-out, unifying the field around one interface.",
    significance:
      "The \"everything is text-to-text\" framing directly shaped how instruction-tuned chat models are trained and evaluated today.",
    keyFeatures: [
      "Unified text-to-text framing for all NLP tasks",
      "Trained on the C4 web-text corpus",
      "Systematic scaling-law style ablation study (\"Colossal Clean Crawled Corpus\")",
    ],
  },
  {
    slug: "gpt-3",
    name: "GPT-3",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2020-05-28",
    era: "scaling",
    access: "closed",
    modality: ["text"],
    parameters: "175B",
    contextWindow: "2,048 tokens",
    summary:
      "A 100x scale-up over GPT-2 that performs new tasks from just a handful of examples in the prompt — no fine-tuning required.",
    significance:
      "GPT-3 is the moment \"few-shot in-context learning\" became a headline capability and the moment large language models became a commercial product via OpenAI's API.",
    keyFeatures: [
      "Few-shot / zero-shot in-context learning",
      "175B parameters, the largest model publicly discussed at the time",
      "Launched as a paid API rather than open weights",
    ],
    links: [{ label: "Language Models are Few-Shot Learners (paper)", url: "https://arxiv.org/abs/2005.14165" }],
  },

  // ───────────────────────────── Alignment & Assistants (2021–2022) ─────────────────────────────
  {
    slug: "switch-transformer",
    name: "Switch Transformer",
    org: "Google",
    family: "other",
    releaseDate: "2021-01-11",
    era: "alignment",
    access: "research",
    modality: ["text"],
    parameters: "1.6T (sparse, MoE)",
    contextWindow: "512 tokens",
    summary:
      "A sparsely-activated mixture-of-experts model that reaches a trillion parameters while keeping compute per token roughly constant.",
    significance:
      "Proved mixture-of-experts routing could scale total parameters far beyond dense models without a proportional compute cost — the technique behind many 2024–2026 frontier models.",
    keyFeatures: [
      "Sparse mixture-of-experts (MoE) routing",
      "First model to reach 1 trillion parameters",
    ],
  },
  {
    slug: "codex",
    name: "OpenAI Codex",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2021-08-10",
    era: "alignment",
    access: "closed",
    modality: ["text", "code"],
    parameters: "12B",
    contextWindow: "2,048 tokens",
    summary:
      "A GPT-3 descendant fine-tuned on public code that powers GitHub Copilot, translating natural-language comments into working code.",
    significance:
      "Kicked off the AI coding-assistant category that is now one of the largest commercial applications of LLMs.",
    keyFeatures: [
      "Fine-tuned on billions of lines of public source code",
      "Powers the original GitHub Copilot",
    ],
  },
  {
    slug: "gopher",
    name: "Gopher",
    org: "DeepMind",
    family: "other",
    releaseDate: "2021-12-08",
    era: "alignment",
    access: "research",
    modality: ["text"],
    parameters: "280B",
    contextWindow: "2,048 tokens",
    summary:
      "A 280-billion-parameter dense model used by DeepMind to systematically study how capability scales across 152 tasks.",
    significance:
      "The scaling analysis behind Gopher directly motivated Chinchilla's finding that most large models of the era were badly undertrained relative to their size.",
    keyFeatures: [
      "Evaluated across 152 diverse tasks",
      "Basis for DeepMind's compute-optimal scaling research",
    ],
  },
  {
    slug: "instructgpt",
    name: "InstructGPT",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2022-01-27",
    era: "alignment",
    access: "closed",
    modality: ["text"],
    parameters: "175B",
    contextWindow: "2,048 tokens",
    summary:
      "GPT-3 fine-tuned with human feedback (RLHF) to follow instructions and refuse harmful requests, dramatically improving usefulness with a fraction of the parameters.",
    significance:
      "RLHF alignment introduced here became the standard recipe for turning a raw base model into a usable assistant — it is the direct ancestor of ChatGPT.",
    keyFeatures: [
      "Reinforcement Learning from Human Feedback (RLHF)",
      "Preferred over raw GPT-3 by human raters despite 100x fewer parameters",
    ],
    links: [{ label: "Training language models to follow instructions (paper)", url: "https://arxiv.org/abs/2203.02155" }],
  },
  {
    slug: "chinchilla",
    name: "Chinchilla",
    org: "DeepMind",
    family: "other",
    releaseDate: "2022-03-29",
    era: "alignment",
    access: "research",
    modality: ["text"],
    parameters: "70B",
    contextWindow: "2,048 tokens",
    summary:
      "A 70B model trained on 4x more data than Gopher that outperforms much larger models, establishing the \"Chinchilla-optimal\" compute-to-data ratio.",
    significance:
      "Reset the industry's scaling strategy: labs shifted from maximizing parameter count to maximizing training tokens per parameter, a rule of thumb still cited today.",
    keyFeatures: [
      "Introduced compute-optimal scaling laws",
      "Outperformed the 3x larger Gopher and 5x larger GPT-3",
    ],
  },
  {
    slug: "palm",
    name: "PaLM",
    org: "Google Research",
    family: "gemini",
    releaseDate: "2022-04-04",
    era: "alignment",
    access: "closed",
    modality: ["text"],
    parameters: "540B",
    contextWindow: "2,048 tokens",
    summary:
      "The Pathways Language Model trains a 540B dense Transformer across two TPU v4 pods, showing new \"emergent\" abilities like multi-step reasoning and joke explanation.",
    significance:
      "Demonstrated that some capabilities appear discontinuously at scale rather than improving smoothly, fueling years of debate about emergent behavior in LLMs.",
    keyFeatures: [
      "Trained with Google's Pathways system across two TPU v4 pods",
      "Strong chain-of-thought and multi-step reasoning at scale",
    ],
  },
  {
    slug: "opt",
    name: "OPT-175B",
    org: "Meta AI",
    family: "llama",
    releaseDate: "2022-05-03",
    era: "alignment",
    access: "open-weight",
    modality: ["text"],
    parameters: "175B",
    contextWindow: "2,048 tokens",
    summary:
      "Meta's Open Pretrained Transformer replicates GPT-3-class performance and, unusually for the time, releases the weights to researchers along with a full training logbook.",
    significance:
      "One of the first GPT-3-scale models made available to the research community, foreshadowing Meta's later bet on open-weight releases with Llama.",
    keyFeatures: [
      "Weights released to researchers (non-commercial license)",
      "Published training logbook detailing failures and restarts",
    ],
  },
  {
    slug: "bloom",
    name: "BLOOM",
    org: "BigScience (Hugging Face-led)",
    family: "other",
    releaseDate: "2022-07-12",
    era: "alignment",
    access: "open-weight",
    modality: ["text"],
    parameters: "176B",
    contextWindow: "2,048 tokens",
    summary:
      "An open-access multilingual model trained by roughly a thousand volunteer researchers across 60+ countries, supporting 46 natural languages and 13 programming languages.",
    significance:
      "The largest fully open, openly-documented model of its era, and a landmark for community-governed rather than corporate-governed AI development.",
    keyFeatures: [
      "Fully open weights and training data documentation",
      "46 natural languages, 13 programming languages",
      "Built by the international BigScience collective",
    ],
  },
  {
    slug: "chatgpt",
    name: "ChatGPT (GPT-3.5)",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2022-11-30",
    era: "alignment",
    access: "closed",
    modality: ["text"],
    parameters: "Undisclosed (~175B class)",
    contextWindow: "4,096 tokens",
    summary:
      "A free chat interface over an InstructGPT-style model that reaches 100 million users within two months, faster than any consumer application before it.",
    significance:
      "The single event that moved LLMs from a research topic into mainstream public awareness, triggering the funding, product, and safety debates that define the industry ever since.",
    keyFeatures: [
      "Conversational, multi-turn chat interface",
      "Fastest-growing consumer application in history at launch",
      "Free public research preview",
    ],
  },

  // ───────────────────────────── The LLM Race (2023) ─────────────────────────────
  {
    slug: "llama-1",
    name: "LLaMA",
    org: "Meta AI",
    family: "llama",
    releaseDate: "2023-02-24",
    era: "llm-race",
    access: "open-weight",
    modality: ["text"],
    parameters: "7B – 65B",
    contextWindow: "2,048 tokens",
    summary:
      "A family of efficient foundation models trained on publicly available data only, matching much larger closed models while remaining small enough to run on a single GPU.",
    significance:
      "Its weights leaked days after release and ignited the open-weight fine-tuning ecosystem (Alpaca, Vicuna, and hundreds of derivatives) that still drives open-source LLM research.",
    keyFeatures: [
      "Trained exclusively on publicly available datasets",
      "65B model competitive with much larger closed models",
      "Weights leaked publicly, catalyzing the open-source LLM community",
    ],
  },
  {
    slug: "claude-1",
    name: "Claude",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2023-03-14",
    era: "llm-race",
    access: "closed",
    modality: ["text"],
    parameters: "Undisclosed",
    contextWindow: "9,000 tokens",
    summary:
      "Anthropic's first public model, trained with \"Constitutional AI\" — a set of written principles the model critiques its own outputs against instead of relying solely on human raters.",
    significance:
      "Introduced Constitutional AI as an alternative alignment technique to pure RLHF, and established Anthropic as OpenAI's main safety-focused competitor.",
    keyFeatures: [
      "Constitutional AI alignment method",
      "Early emphasis on interpretability and safety research",
    ],
  },
  {
    slug: "gpt-4",
    name: "GPT-4",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2023-03-14",
    era: "llm-race",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed (rumored mixture-of-experts, ~1.8T total)",
    contextWindow: "8,192 tokens (32K variant available)",
    summary:
      "OpenAI's first multimodal flagship, able to reason over images as well as text, and the first GPT model to score in the top 10% on a simulated bar exam.",
    significance:
      "Set the benchmark every other lab spent the next two years chasing, and normalized rigorous, standardized-test-style capability evaluation for LLMs.",
    keyFeatures: [
      "Accepts image and text input (multimodal)",
      "Scored ~90th percentile on the Uniform Bar Exam",
      "Introduced system messages for steering behavior",
    ],
  },
  {
    slug: "palm-2",
    name: "PaLM 2",
    org: "Google",
    family: "gemini",
    releaseDate: "2023-05-10",
    era: "llm-race",
    access: "closed",
    modality: ["text"],
    parameters: "Undisclosed (smaller than PaLM, more tokens)",
    contextWindow: "8,000 tokens",
    summary:
      "A smaller, more compute-efficient successor to PaLM that powers the relaunched Bard chatbot and a family of size-tiered models (Gecko to Unicorn).",
    significance:
      "Google's compute-optimal answer to GPT-4, and the direct predecessor to the unified Gemini model family launched later that year.",
    keyFeatures: [
      "Compute-optimal (Chinchilla-style) training",
      "Improved multilingual and reasoning benchmarks over PaLM",
    ],
  },
  {
    slug: "falcon",
    name: "Falcon 40B",
    org: "Technology Innovation Institute (UAE)",
    family: "other",
    releaseDate: "2023-05-25",
    era: "llm-race",
    access: "open-weight",
    modality: ["text"],
    parameters: "40B",
    contextWindow: "2,048 tokens",
    summary:
      "A UAE government-funded open-weight model trained on the curated RefinedWeb dataset that topped the Hugging Face Open LLM Leaderboard on release.",
    significance:
      "Showed that state-backed labs outside the US and China could produce a genuinely frontier open-weight model, broadening who competes at the top of the leaderboard.",
    keyFeatures: [
      "Apache 2.0 license, free for commercial use",
      "Trained on the custom RefinedWeb web-text dataset",
    ],
  },
  {
    slug: "claude-2",
    name: "Claude 2",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2023-07-11",
    era: "llm-race",
    access: "closed",
    modality: ["text"],
    parameters: "Undisclosed",
    contextWindow: "100,000 tokens",
    summary:
      "Anthropic's first widely available consumer product, jumping the context window from 9K to 100K tokens — enough to paste in an entire novel.",
    significance:
      "The 100K context window made \"chat with a long document\" a mainstream use case well before other labs matched it.",
    keyFeatures: [
      "100K-token context window at launch",
      "First Claude generation with a public web app",
    ],
  },
  {
    slug: "llama-2",
    name: "Llama 2",
    org: "Meta AI",
    family: "llama",
    releaseDate: "2023-07-18",
    era: "llm-race",
    access: "open-weight",
    modality: ["text"],
    parameters: "7B – 70B",
    contextWindow: "4,096 tokens",
    summary:
      "Meta's first Llama generation licensed for commercial use, released with chat-tuned variants (Llama 2-Chat) trained with RLHF.",
    significance:
      "Removing the non-commercial restriction turned open-weight models into a viable business foundation overnight, seeding a huge downstream ecosystem of fine-tunes and products.",
    keyFeatures: [
      "Free for commercial use (with a size threshold)",
      "Chat-tuned variant trained with RLHF and safety red-teaming",
      "Trained on 40% more data than Llama 1",
    ],
  },
  {
    slug: "mistral-7b",
    name: "Mistral 7B",
    org: "Mistral AI",
    family: "mistral",
    releaseDate: "2023-09-27",
    era: "llm-race",
    access: "open-weight",
    modality: ["text"],
    parameters: "7.3B",
    contextWindow: "8,000 tokens",
    summary:
      "A small, French-startup-built model that outperforms Llama 2 13B on every benchmark tested, released via a bare torrent link with no launch essay.",
    significance:
      "Proved that a compact, efficiently architected model (grouped-query + sliding-window attention) could beat models twice its size, and put a new European lab on the map.",
    keyFeatures: [
      "Grouped-query attention and sliding-window attention",
      "Outperforms Llama 2 13B despite being roughly half the size",
      "Apache 2.0 license",
    ],
  },
  {
    slug: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2023-11-06",
    era: "llm-race",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "128,000 tokens",
    summary:
      "A cheaper, faster GPT-4 with a 16x larger context window and a knowledge cutoff pushed forward to April 2023, announced at OpenAI's first DevDay.",
    significance:
      "Made GPT-4-class capability affordable enough for high-volume products, dramatically expanding the number of companies that could build on the frontier model.",
    keyFeatures: [
      "128K context window (up from 8K/32K)",
      "3x cheaper input tokens than GPT-4",
      "JSON mode and reproducible outputs (seed parameter)",
    ],
  },
  {
    slug: "gemini-1",
    name: "Gemini 1.0",
    org: "Google DeepMind",
    family: "gemini",
    releaseDate: "2023-12-06",
    era: "llm-race",
    access: "closed",
    modality: ["text", "image", "audio", "video"],
    parameters: "Undisclosed",
    contextWindow: "32,768 tokens",
    summary:
      "Google's first model built natively multimodal from the start (rather than bolting vision onto a text model), shipped in three sizes: Ultra, Pro, and Nano.",
    significance:
      "The first product of the newly merged Google DeepMind, and the moment Google positioned a single model family to compete directly with GPT-4 across every size class from cloud to on-device.",
    keyFeatures: [
      "Natively multimodal pretraining across text, image, audio, video",
      "Three size tiers: Ultra, Pro, Nano",
      "Nano variant runs on-device (Pixel phones)",
    ],
  },
  {
    slug: "mixtral",
    name: "Mixtral 8x7B",
    org: "Mistral AI",
    family: "mistral",
    releaseDate: "2023-12-11",
    era: "llm-race",
    access: "open-weight",
    modality: ["text"],
    parameters: "46.7B total / 12.9B active (MoE)",
    contextWindow: "32,000 tokens",
    summary:
      "A sparse mixture-of-experts model that matches or beats GPT-3.5 while only activating about 13B parameters per token, released under Apache 2.0.",
    significance:
      "Brought mixture-of-experts efficiency to the open-weight world, proving small labs could ship MoE architectures previously seen only in closed frontier models.",
    keyFeatures: [
      "Sparse MoE: 8 experts, 2 active per token",
      "Matches GPT-3.5 on most benchmarks at a fraction of the active compute",
      "Apache 2.0 license",
    ],
  },

  // ───────────────────────────── Multimodal & Open Models (2024) ─────────────────────────────
  {
    slug: "gemini-1-5",
    name: "Gemini 1.5 Pro",
    org: "Google DeepMind",
    family: "gemini",
    releaseDate: "2024-02-15",
    era: "multimodal",
    access: "closed",
    modality: ["text", "image", "audio", "video"],
    parameters: "Undisclosed (MoE)",
    contextWindow: "1,000,000 tokens (2M in preview)",
    summary:
      "A mixture-of-experts Gemini that stretches usable context to one million tokens — roughly an hour of video or 700,000 words — while improving quality over Gemini 1.0 Ultra.",
    significance:
      "Made million-token context a real, usable feature rather than a research demo, resetting expectations for how much material a model could reason over at once.",
    keyFeatures: [
      "1M-token (2M in limited preview) context window",
      "Near-perfect \"needle in a haystack\" retrieval at long context",
      "Mixture-of-experts Transformer architecture",
    ],
  },
  {
    slug: "mistral-large",
    name: "Mistral Large",
    org: "Mistral AI",
    family: "mistral",
    releaseDate: "2024-02-26",
    era: "multimodal",
    access: "closed",
    modality: ["text"],
    parameters: "Undisclosed",
    contextWindow: "32,000 tokens",
    summary:
      "Mistral's first closed flagship model, launched alongside a strategic partnership with Microsoft Azure, positioning the startup as a serious GPT-4-class competitor.",
    significance:
      "Marked Mistral's pivot from purely open-weight releases to a mixed open/closed business model, mirroring the path several other open-first labs later followed.",
    keyFeatures: [
      "Strong multilingual and function-calling support",
      "Distributed via Microsoft Azure as a launch partner",
    ],
  },
  {
    slug: "claude-3",
    name: "Claude 3 (Opus, Sonnet, Haiku)",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2024-03-04",
    era: "multimodal",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "Anthropic's first three-tier family — Opus (most capable), Sonnet (balanced), Haiku (fastest) — with Opus reported to outperform GPT-4 on several public benchmarks.",
    significance:
      "Established the now-standard \"three sizes for three price/latency points\" product strategy that most labs copied for their own model families.",
    keyFeatures: [
      "Three size/price/speed tiers in one family",
      "Vision input across all three tiers",
      "200K context window standard across the family",
    ],
  },
  {
    slug: "command-r-plus",
    name: "Command R+",
    org: "Cohere",
    family: "other",
    releaseDate: "2024-04-04",
    era: "multimodal",
    access: "open-weight",
    modality: ["text"],
    parameters: "104B",
    contextWindow: "128,000 tokens",
    summary:
      "An enterprise-focused model purpose-built for retrieval-augmented generation (RAG) and tool use, with native support for citing sources.",
    significance:
      "One of the first frontier-class models designed around RAG and multi-step tool-calling as first-class features rather than afterthoughts, targeting enterprise search and agents.",
    keyFeatures: [
      "Built-in citation and grounding for RAG",
      "Strong multi-step tool-use / agent capabilities",
      "Weights available for research use",
    ],
  },
  {
    slug: "llama-3",
    name: "Llama 3",
    org: "Meta AI",
    family: "llama",
    releaseDate: "2024-04-18",
    era: "multimodal",
    access: "open-weight",
    modality: ["text"],
    parameters: "8B / 70B",
    contextWindow: "8,000 tokens",
    summary:
      "Trained on over 15 trillion tokens — roughly 7x more than Llama 2 — the 70B variant becomes competitive with much larger closed models on release.",
    significance:
      "Showed data scale, not just parameter count, was still an enormous lever even in 2024, and kept the open-weight frontier within striking distance of closed labs.",
    keyFeatures: [
      "15T+ training tokens, the largest open-weight training run to date at launch",
      "New tokenizer (128K vocabulary) improving efficiency",
    ],
  },
  {
    slug: "gpt-4o",
    name: "GPT-4o",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2024-05-13",
    era: "multimodal",
    access: "closed",
    modality: ["text", "image", "audio"],
    parameters: "Undisclosed",
    contextWindow: "128,000 tokens",
    summary:
      "\"o\" for omni — a single model that natively processes and generates text, image, and audio end-to-end, cutting voice-mode response latency to as low as 232ms.",
    significance:
      "Native (rather than pipelined) multimodality made real-time, natural voice conversation with an AI possible for the first time at consumer scale, and it shipped free to all ChatGPT users.",
    keyFeatures: [
      "Single network natively handles text, vision, and audio",
      "Real-time voice conversation as low as 232ms latency",
      "2x faster and 50% cheaper than GPT-4 Turbo via the API",
    ],
  },
  {
    slug: "deepseek-v2",
    name: "DeepSeek-V2",
    org: "DeepSeek",
    family: "deepseek",
    releaseDate: "2024-05-06",
    era: "multimodal",
    access: "open-weight",
    modality: ["text"],
    parameters: "236B total / 21B active (MoE)",
    contextWindow: "128,000 tokens",
    summary:
      "A large mixture-of-experts model introducing Multi-head Latent Attention (MLA) to cut inference memory cost, priced far below Western equivalents.",
    significance:
      "First strong signal that a Chinese lab could ship frontier-adjacent open-weight quality at a fraction of the API price, foreshadowing DeepSeek's much larger 2025 impact.",
    keyFeatures: [
      "Multi-head Latent Attention (MLA) for cheaper inference",
      "API priced roughly 1% of GPT-4's per-token cost at launch",
    ],
  },
  {
    slug: "qwen2",
    name: "Qwen2",
    org: "Alibaba",
    family: "qwen",
    releaseDate: "2024-06-07",
    era: "multimodal",
    access: "open-weight",
    modality: ["text"],
    parameters: "0.5B – 72B",
    contextWindow: "128,000 tokens",
    summary:
      "A five-size open-weight family (0.5B to 72B) trained on data spanning 27 languages, with the 72B variant leading most open-weight leaderboards on release.",
    significance:
      "Cemented Alibaba's Qwen as one of the highest-velocity open-weight families, with strong multilingual and coding performance that made it a default choice for fine-tuners worldwide.",
    keyFeatures: [
      "Five size tiers from 0.5B to 72B",
      "Strong coding and math benchmark performance",
      "27-language training coverage",
    ],
  },
  {
    slug: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2024-06-20",
    era: "multimodal",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "A mid-tier model that outperforms the larger Claude 3 Opus on most benchmarks while running twice as fast, and debuts \"Artifacts\" — a live side-panel for generated code and documents.",
    significance:
      "Proved a smaller, better-trained model could beat its own larger predecessor, and its computer-use / coding strength made it the default model behind many early AI coding agents.",
    keyFeatures: [
      "Beats Claude 3 Opus despite being a smaller, faster tier",
      "Introduces Artifacts for interactive generated content",
      "Strong agentic coding performance, later gains computer-use capability",
    ],
  },
  {
    slug: "llama-3-1",
    name: "Llama 3.1 405B",
    org: "Meta AI",
    family: "llama",
    releaseDate: "2024-07-23",
    era: "multimodal",
    access: "open-weight",
    modality: ["text"],
    parameters: "8B / 70B / 405B",
    contextWindow: "128,000 tokens",
    summary:
      "Meta's first frontier-scale open-weight model, with the 405B flagship reported to match GPT-4o and Claude 3.5 Sonnet on major benchmarks.",
    significance:
      "The moment an open-weight model credibly closed the gap with the best closed models, not just the mid-tier ones — a milestone Meta explicitly framed as ending closed models' capability lead.",
    keyFeatures: [
      "405B flagship, the largest open-weight model at launch",
      "128K context window (up from 8K in Llama 3)",
      "Permissive license allowing use of outputs to train other models",
    ],
  },
  {
    slug: "o1-preview",
    name: "OpenAI o1-preview",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2024-09-12",
    era: "multimodal",
    access: "closed",
    modality: ["text"],
    parameters: "Undisclosed",
    contextWindow: "128,000 tokens",
    summary:
      "OpenAI's first \"reasoning\" model, trained with reinforcement learning to think step-by-step before answering, jumping from the 11th to the 89th percentile on Codeforces.",
    significance:
      "Introduced inference-time \"thinking\" as a new, distinct scaling axis alongside pretraining and fine-tuning — the technique that defines the 2025 reasoning era.",
    keyFeatures: [
      "Extended hidden chain-of-thought before responding",
      "Large jump in math, coding, and science benchmark scores",
      "Slower and more expensive per answer in exchange for accuracy",
    ],
  },
  {
    slug: "llama-3-3",
    name: "Llama 3.3 70B",
    org: "Meta AI",
    family: "llama",
    releaseDate: "2024-12-06",
    era: "multimodal",
    access: "open-weight",
    modality: ["text"],
    parameters: "70B",
    contextWindow: "128,000 tokens",
    summary:
      "A 70B text model tuned to match the much larger 405B Llama 3.1 on many benchmarks, cutting inference cost for near-frontier performance dramatically.",
    significance:
      "Showed post-training improvements alone (without a parameter increase) could close most of the gap to a 5.7x larger model, a strong signal for where cheap performance gains would come from next.",
    keyFeatures: [
      "Matches Llama 3.1 405B on many benchmarks at 1/6th the parameters",
      "Text-only (image support remained on the 3.2 vision branch)",
    ],
  },
  {
    slug: "deepseek-v3",
    name: "DeepSeek-V3",
    org: "DeepSeek",
    family: "deepseek",
    releaseDate: "2024-12-26",
    era: "multimodal",
    access: "open-weight",
    modality: ["text"],
    parameters: "671B total / 37B active (MoE)",
    contextWindow: "128,000 tokens",
    summary:
      "A 671B-parameter mixture-of-experts model reported to have been trained for roughly $5.6M in compute — a small fraction of comparable Western training runs — while matching GPT-4o on many benchmarks.",
    significance:
      "The training-efficiency claims behind DeepSeek-V3 set up the shockwave that followed a few weeks later with DeepSeek-R1, reshaping the industry's assumptions about the cost of frontier AI.",
    keyFeatures: [
      "671B total / 37B active parameters via MoE",
      "Reported ~$5.6M training compute cost",
      "FP8 mixed-precision training at scale",
    ],
  },
  {
    slug: "gemini-2",
    name: "Gemini 2.0 Flash",
    org: "Google DeepMind",
    family: "gemini",
    releaseDate: "2024-12-11",
    era: "multimodal",
    access: "closed",
    modality: ["text", "image", "audio"],
    parameters: "Undisclosed",
    contextWindow: "1,000,000 tokens",
    summary:
      "Google's first model built for the \"agentic era\" — native tool use, multimodal output including generated images and steerable audio, at Flash-tier speed and cost.",
    significance:
      "Signaled Google's shift from chat-first to agent-first model design, bundling native tool use and multimodal generation into even its fast, cheap tier.",
    keyFeatures: [
      "Native image and audio output generation",
      "Built-in multi-step tool use and agent workflows",
      "1M-token context at Flash-tier latency and price",
    ],
  },

  // ───────────────────────────── The Reasoning Era (2025) ─────────────────────────────
  {
    slug: "deepseek-r1",
    name: "DeepSeek-R1",
    org: "DeepSeek",
    family: "deepseek",
    releaseDate: "2025-01-20",
    era: "reasoning",
    access: "open-weight",
    modality: ["text"],
    parameters: "671B total / 37B active (MoE)",
    contextWindow: "128,000 tokens",
    summary:
      "An open-weight reasoning model trained largely via reinforcement learning that matches OpenAI's o1 on math and coding benchmarks, released with full weights under an MIT license.",
    significance:
      "Wiped roughly a trillion dollars off US AI-related stocks in a single day and proved a competitive reasoning model could be built and given away for a fraction of what the market assumed frontier training cost.",
    keyFeatures: [
      "Matches OpenAI o1 on AIME, MATH, and Codeforces benchmarks",
      "MIT-licensed open weights, including distilled smaller variants",
      "Trained with large-scale reinforcement learning on top of DeepSeek-V3",
    ],
  },
  {
    slug: "o3-mini",
    name: "OpenAI o3-mini",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2025-01-31",
    era: "reasoning",
    access: "closed",
    modality: ["text"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "A fast, cheap reasoning model with selectable \"low / medium / high\" thinking effort, rushed out days after DeepSeek-R1's release and made free to all ChatGPT users.",
    significance:
      "OpenAI's direct competitive response to DeepSeek-R1, marking the point where reasoning models moved from a premium feature to a free, default-tier capability.",
    keyFeatures: [
      "User-selectable reasoning effort (low/medium/high)",
      "Free tier access on release, unusual for a reasoning model",
      "Strong STEM and coding benchmark performance for its cost",
    ],
  },
  {
    slug: "grok-3",
    name: "Grok 3",
    org: "xAI",
    family: "grok",
    releaseDate: "2025-02-17",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "128,000 tokens",
    summary:
      "xAI's first reasoning-capable Grok, trained on the 200,000-GPU \"Colossus\" cluster and shipped with a \"Think\" and \"Big Brain\" mode for harder problems.",
    significance:
      "Demonstrated xAI had assembled enough compute (one of the largest single training clusters disclosed at the time) to compete directly at the reasoning frontier.",
    keyFeatures: [
      "Trained on the Colossus supercomputer (~200K GPUs)",
      "Think / Big Brain extended-reasoning modes",
      "Deep integration with real-time X (Twitter) data",
    ],
  },
  {
    slug: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2025-02-24",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "Anthropic's first \"hybrid reasoning\" model — a single model that can answer instantly or extend its thinking, with a visible, user-adjustable token budget for reasoning.",
    significance:
      "Rather than shipping a separate reasoning model, Anthropic merged fast and slow thinking into one model with a dial, a design several other labs later converged on.",
    keyFeatures: [
      "Single model, toggle between standard and extended thinking",
      "User-controllable reasoning token budget",
      "Released alongside Claude Code, Anthropic's agentic coding tool",
    ],
  },
  {
    slug: "gpt-4-5",
    name: "GPT-4.5",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2025-02-27",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed (largest non-reasoning GPT to date)",
    contextWindow: "128,000 tokens",
    summary:
      "OpenAI's largest traditionally-trained (non-reasoning) model, positioned for its improved \"emotional intelligence\" and world knowledge rather than raw benchmark scores.",
    significance:
      "Widely read as a signal that pure pretraining scale was hitting diminishing returns relative to cost, accelerating the industry's pivot toward reasoning and post-training as the main lever.",
    keyFeatures: [
      "Largest GPT trained with traditional (non-reasoning) pretraining",
      "Emphasis on natural conversation and reduced hallucination",
    ],
  },
  {
    slug: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    org: "Google DeepMind",
    family: "gemini",
    releaseDate: "2025-03-25",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image", "audio", "video"],
    parameters: "Undisclosed (MoE)",
    contextWindow: "1,000,000 tokens",
    summary:
      "Google's first \"thinking\" Gemini, reasoning through its response before answering, and debuting at #1 on the LMArena leaderboard by a wide margin.",
    significance:
      "Brought Google's long-context and native-multimodal strengths together with reasoning for the first time, briefly making Gemini the most-cited leaderboard leader of 2025.",
    keyFeatures: [
      "Built-in \"thinking\" reasoning by default",
      "1M-token context combined with reasoning",
      "#1 on LMArena at launch",
    ],
  },
  {
    slug: "llama-4",
    name: "Llama 4 (Scout & Maverick)",
    org: "Meta AI",
    family: "llama",
    releaseDate: "2025-04-05",
    era: "reasoning",
    access: "open-weight",
    modality: ["text", "image"],
    parameters: "109B total/17B active (Scout), 400B total/17B active (Maverick), MoE",
    contextWindow: "10,000,000 tokens (Scout)",
    summary:
      "Meta's first mixture-of-experts Llama generation, natively multimodal, with the Scout variant claiming an unprecedented 10-million-token context window.",
    significance:
      "The MoE architecture switch and record-setting context window claim marked Meta's most significant open-weight architecture change since the original Llama, though real-world benchmark reception was mixed.",
    keyFeatures: [
      "First MoE-based Llama generation",
      "Natively multimodal (early fusion of text and image)",
      "Scout: 10M-token context window (largest claimed to date)",
    ],
  },
  {
    slug: "qwen3",
    name: "Qwen3",
    org: "Alibaba",
    family: "qwen",
    releaseDate: "2025-04-29",
    era: "reasoning",
    access: "open-weight",
    modality: ["text"],
    parameters: "0.6B – 235B (MoE flagship: 235B total/22B active)",
    contextWindow: "128,000 tokens",
    summary:
      "Alibaba's first hybrid-reasoning open-weight family, letting every model switch between \"thinking\" and \"non-thinking\" modes, spanning eight sizes from 0.6B to a 235B MoE flagship.",
    significance:
      "Brought toggleable hybrid reasoning to the open-weight world at a very wide range of sizes, keeping Qwen among the most widely fine-tuned model families globally.",
    keyFeatures: [
      "Switchable thinking / non-thinking modes per query",
      "Eight size tiers, dense and MoE variants",
      "Trained on 36 trillion tokens across 119 languages",
    ],
  },
  {
    slug: "claude-4",
    name: "Claude 4 (Opus & Sonnet)",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2025-05-22",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "Anthropic's fourth-generation family, with Opus 4 reported to sustain focused agentic coding work for several hours without losing coherence.",
    significance:
      "Extended-duration agentic reliability — not just single-shot answer quality — became the headline capability, reflecting the industry's shift toward autonomous coding agents.",
    keyFeatures: [
      "Multi-hour sustained autonomous coding sessions",
      "Extended and interleaved thinking with tool calls",
      "Memory file support for long-running agent tasks",
    ],
  },
  {
    slug: "grok-4",
    name: "Grok 4",
    org: "xAI",
    family: "grok",
    releaseDate: "2025-07-09",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "256,000 tokens",
    summary:
      "xAI's flagship reasoning model, launched with a \"Heavy\" multi-agent tier that runs several reasoning instances in parallel and merges their answers.",
    significance:
      "The multi-agent \"Heavy\" tier previewed a broader 2025–2026 trend: scaling capability at inference time by running several agents in parallel rather than one larger model.",
    keyFeatures: [
      "Grok 4 Heavy: parallel multi-agent reasoning tier",
      "Native tool use and real-time search integration",
    ],
  },
  {
    slug: "deepseek-v3-1",
    name: "DeepSeek-V3.1",
    org: "DeepSeek",
    family: "deepseek",
    releaseDate: "2025-08-01",
    era: "reasoning",
    access: "open-weight",
    modality: ["text"],
    parameters: "671B total / 37B active (MoE)",
    contextWindow: "128,000 tokens",
    summary:
      "Merges DeepSeek's V3 base model and R1 reasoning line into a single hybrid model that switches between fast and thinking modes, tuned for agent and tool-use workloads.",
    significance:
      "Consolidated DeepSeek's two model lines into one, mirroring the hybrid-reasoning design pattern that had become the industry default by mid-2025.",
    keyFeatures: [
      "Unifies the V3 and R1 lines into one hybrid model",
      "Improved tool-use and agent-oriented post-training",
    ],
  },
  {
    slug: "gpt-5",
    name: "GPT-5",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2025-08-07",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image", "audio"],
    parameters: "Undisclosed (routed system of models)",
    contextWindow: "400,000 tokens",
    summary:
      "OpenAI's first unified system that automatically routes each query to a fast or deep-thinking model under one product name, replacing the separate GPT and o-series lines.",
    significance:
      "Ended the split between \"chat models\" and \"reasoning models\" as separate products for OpenAI, folding routing logic into the model itself so users no longer pick a mode manually.",
    keyFeatures: [
      "Automatic routing between fast and reasoning sub-models",
      "400K context window, OpenAI's largest to date at launch",
      "Unifies the GPT-4.x and o-series lines into one product",
    ],
  },
  {
    slug: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2025-09-29",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens (1M in beta)",
    summary:
      "Anthropic describes Sonnet 4.5 as its most aligned model yet and, at the time, the best coding model available, able to work autonomously for over 30 hours on complex tasks.",
    significance:
      "Pushed sustained-autonomy coding agents from \"hours\" into \"over a day,\" a milestone for how much unsupervised agent work a single model session could reliably complete.",
    keyFeatures: [
      "30+ hour sustained autonomous task execution",
      "1M-token context window in beta",
      "Ships alongside upgrades to the Claude Agent SDK",
    ],
  },
  {
    slug: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2025-10-15",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "The fastest, cheapest Claude 4-generation model, reported to match the coding performance of Claude Sonnet 4 from just five months earlier at roughly a third of the cost.",
    significance:
      "Showed how quickly frontier capability trickles down to the cheap tier — mid-tier performance from earlier in the year becoming the budget tier's baseline within months.",
    keyFeatures: [
      "Matches Sonnet 4 coding performance at lower cost and latency",
      "Designed for high-throughput, latency-sensitive agent workloads",
    ],
  },
  {
    slug: "gemini-3",
    name: "Gemini 3 Pro",
    org: "Google DeepMind",
    family: "gemini",
    releaseDate: "2025-11-18",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image", "audio", "video"],
    parameters: "Undisclosed (MoE)",
    contextWindow: "1,000,000 tokens",
    summary:
      "Google's third-generation Gemini, reported to set new state-of-the-art scores across reasoning, multimodal understanding, and agentic-coding benchmarks at launch.",
    significance:
      "Reclaimed the top leaderboard position for Google heading into 2026 and tightened the release cadence race, with Gemini 3 Flash following it about a month later.",
    keyFeatures: [
      "State-of-the-art scores on several public reasoning benchmarks at launch",
      "Deep integration with Google Search's AI Mode",
      "1M-token context combined with native multimodal reasoning",
    ],
  },
  {
    slug: "claude-opus-4-5",
    name: "Claude Opus 4.5",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2025-11-24",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "The top-tier refresh of the Claude 4 family, Anthropic's most capable model of late 2025 for complex, long-horizon agentic and coding work.",
    significance:
      "Closed out 2025's reasoning-era release cycle for Anthropic's flagship tier, setting the baseline the 2026 Opus point releases (4.6, 4.7, 5) iterated on every few months.",
    keyFeatures: [
      "Anthropic's most capable model at time of release",
      "Improved long-horizon planning for agentic workflows",
    ],
  },
  {
    slug: "gpt-5-2",
    name: "GPT-5.2",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2025-12-11",
    era: "reasoning",
    access: "closed",
    modality: ["text", "image", "audio"],
    parameters: "Undisclosed (routed system of models)",
    contextWindow: "400,000 tokens",
    summary:
      "A point upgrade to GPT-5 shipping three selectable modes — Instant, Thinking, and Pro — giving users direct control over the speed/depth tradeoff the router picks automatically by default.",
    significance:
      "Closed the year by giving power users manual override of GPT-5's automatic routing, a response to feedback that automatic mode selection sometimes picked wrong for expert workflows.",
    keyFeatures: [
      "Selectable Instant / Thinking / Pro modes",
      "Refinements to GPT-5's automatic routing logic",
    ],
  },

  // ───────────────────────────── 2026 Frontier ─────────────────────────────
  {
    slug: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2026-02-05",
    era: "frontier-2026",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "Adds coordinated multi-agent \"agent teams\" and native Claude-in-PowerPoint document generation to the Opus 4 line.",
    significance:
      "Pushed Anthropic's product surface beyond the chat window and API into direct integration with everyday office document workflows.",
    keyFeatures: [
      "Coordinated multi-agent \"agent teams\" workflows",
      "Native PowerPoint generation and editing",
    ],
  },
  {
    slug: "gemini-3-1",
    name: "Gemini 3.1 Pro",
    org: "Google DeepMind",
    family: "gemini",
    releaseDate: "2026-02-19",
    era: "frontier-2026",
    access: "closed",
    modality: ["text", "image", "audio", "video"],
    parameters: "Undisclosed (MoE)",
    contextWindow: "1,000,000 tokens",
    summary:
      "A quick-turnaround refinement of Gemini 3 Pro, released in preview roughly three months after the 3.0 launch with a 1M-token context window and a 64K output limit.",
    significance:
      "Confirmed a shift to sub-quarterly point-release cadence for Google's flagship tier, matching the pace already set by OpenAI and Anthropic.",
    keyFeatures: [
      "1M-token context, 64K max output tokens",
      "Preview-first rollout ahead of general availability",
    ],
  },
  {
    slug: "gpt-5-4",
    name: "GPT-5.4",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2026-03-05",
    era: "frontier-2026",
    access: "closed",
    modality: ["text", "image", "audio"],
    parameters: "Undisclosed (routed system of models)",
    contextWindow: "400,000 tokens",
    summary:
      "Ships as Thinking and Pro variants at launch, with mini and nano tiers added shortly after for latency- and cost-sensitive applications.",
    significance:
      "Widened the GPT-5 line into a full size ladder (nano to Pro), reflecting how much of 2026's competition was about serving every price point rather than a single flagship.",
    keyFeatures: [
      "Thinking and Pro variants at launch",
      "Mini and nano tiers added for cost-sensitive deployment",
    ],
  },
  {
    slug: "claude-opus-4-7",
    name: "Claude Opus 4.7",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2026-04-16",
    era: "frontier-2026",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens",
    summary:
      "A quality and reliability point release in the Opus 4 line, continuing Anthropic's roughly two-month refresh cadence into mid-2026.",
    significance:
      "Part of the tight, near-monthly refresh rhythm every major lab settled into by 2026, trading big-bang launches for continuous incremental improvement.",
    keyFeatures: [
      "Incremental capability and reliability improvements over Opus 4.6",
    ],
  },
  {
    slug: "gpt-5-5",
    name: "GPT-5.5",
    org: "OpenAI",
    family: "gpt",
    releaseDate: "2026-04-23",
    era: "frontier-2026",
    access: "closed",
    modality: ["text", "image", "audio"],
    parameters: "Undisclosed (routed system of models)",
    contextWindow: "400,000 tokens",
    summary:
      "Ships Thinking and Pro variants restricted to paid tiers, continuing OpenAI's pattern of debuting new capability at the top of the pricing ladder first.",
    significance:
      "Reinforced the emerging 2026 norm where the newest reasoning capability launches paid-only before trickling down to free tiers in a later point release.",
    keyFeatures: [
      "Thinking and Pro variants, paid tiers only at launch",
    ],
  },
  {
    slug: "claude-opus-5",
    name: "Claude Opus 5",
    org: "Anthropic",
    family: "claude",
    releaseDate: "2026-07-24",
    era: "frontier-2026",
    access: "closed",
    modality: ["text", "image"],
    parameters: "Undisclosed",
    contextWindow: "200,000 tokens (1M in beta)",
    summary:
      "Anthropic's fifth-generation flagship, adding native 3D rendering output alongside further gains in long-horizon agentic reliability.",
    significance:
      "The current top of the Claude line as of this writing, and a sign that generative output modalities keep expanding well past text and code.",
    keyFeatures: [
      "Native 3D rendering output",
      "Further long-horizon agentic reliability improvements",
      "1M-token context window in beta",
    ],
  },
  {
    slug: "qwen-3-8-max",
    name: "Qwen 3.8-Max",
    org: "Alibaba",
    family: "qwen",
    releaseDate: "2026-08-03",
    era: "frontier-2026",
    access: "closed",
    modality: ["text", "image"],
    parameters: "~2.4T (MoE, undisclosed active count)",
    contextWindow: "256,000 tokens",
    summary:
      "Alibaba's largest Qwen to date, previewed at the World AI Conference in Shanghai before its early-August general release.",
    significance:
      "One of the largest total-parameter models disclosed publicly by any lab, underscoring how far mixture-of-experts scaling had continued to run by mid-2026.",
    keyFeatures: [
      "Largest Qwen generation to date by total parameters",
      "Previewed publicly at WAIC Shanghai ahead of release",
    ],
  },
];
