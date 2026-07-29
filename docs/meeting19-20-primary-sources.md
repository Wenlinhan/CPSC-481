# Meetings 19-20 primary-source dossier

This dossier keeps the transformer and LLM unit at introductory-AI depth. The
unit should teach the mechanism, the training pipeline, and the verification
problem without turning CPSC 481 into a production language-model engineering
course.

## Meeting 19: tokens, embeddings, attention, and transformers

### Required primary sources

1. Rico Sennrich, Barry Haddow, and Alexandra Birch, "Neural Machine
   Translation of Rare Words with Subword Units," ACL 2016.
   - https://aclanthology.org/P16-1162/
   - Use for the BPE merge demonstration and the fact that token boundaries are
     learned units rather than natural semantic boundaries.
2. Taku Kudo and John Richardson, "SentencePiece: A simple and language
   independent subword tokenizer and detokenizer for Neural Text Processing,"
   EMNLP 2018.
   - https://arxiv.org/abs/1808.06226
   - Use to contrast whitespace-dependent preprocessing with direct training on
     raw sentences.
3. Ashish Vaswani et al., "Attention Is All You Need," NeurIPS 2017.
   - https://papers.nips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html
   - Use for scaled dot-product attention, multi-head attention, positional
     information, residual connections, layer normalization, and the
     encoder-decoder architecture.

### Knowledge points

- Text becomes token IDs through a tokenizer; tokenization is not the same as
  understanding words.
- An embedding lookup maps each token ID to a learned vector.
- A position signal distinguishes otherwise identical token multisets.
- Queries select, keys advertise, and values carry information.
- Scaled dot-product attention is
  `softmax(QK^T / sqrt(d_k))V`.
- A causal mask prevents a decoder from attending to future tokens.
- Multiple heads can learn different projection spaces; a head is not
  guaranteed to correspond to a human-interpretable linguistic relation.
- A transformer block combines attention, a position-wise feed-forward
  network, residual connections, normalization, and masking.
- Decoder-only next-token prediction is one transformer use; the 2017 paper
  presented an encoder-decoder translation system.

### Demonstrations and assessment

- Run five BPE merge steps on a small corpus.
- Compare how two tokenizers segment a name, a code identifier, and a
  multilingual sentence.
- Calculate one four-token attention row from supplied query and key vectors.
- Toggle a causal mask and explain which information leak it prevents.
- Trace tensor shapes through embedding, heads, concatenation, and output
  projection.
- Assess a diagram by asking students to locate parameters, activations,
  sequence positions, and information-flow constraints.

## Meeting 20: training, structured outputs, hallucination, and verification

### Required primary sources

1. Jared Kaplan et al., "Scaling Laws for Neural Language Models," 2020.
   - https://arxiv.org/abs/2001.08361
   - Use only to introduce empirical relations among loss, parameters, data, and
     compute.
2. Jordan Hoffmann et al., "Training Compute-Optimal Large Language Models,"
   2022, with the DeepMind research summary.
   - https://deepmind.google/blog/an-empirical-analysis-of-compute-optimal-large-language-model-training/
   - Use to show that a larger parameter count alone is not a sufficient
     training strategy; data allocation matters.
3. Long Ouyang et al., "Training language models to follow instructions with
   human feedback," NeurIPS 2022.
   - https://arxiv.org/abs/2203.02155
   - Use for the pretraining, supervised instruction-tuning, preference-model,
     and policy-optimization stages. Do not imply that preference alignment
     establishes truth.
4. Stephanie Lin, Jacob Hilton, and Owain Evans, "TruthfulQA: Measuring How
   Models Mimic Human Falsehoods," ACL 2022.
   - https://aclanthology.org/2022.acl-long.229/
   - Use to distinguish fluent imitation from truthfulness and to motivate an
     explicit evaluation set.
5. OpenAI, "Introducing Structured Outputs in the API," 2024.
   - https://openai.com/index/introducing-structured-outputs-in-the-api/
   - Use as a concrete implementation case for JSON Schema and constrained
     decoding. Preserve the limitation that schema conformance does not make
     values factually correct.

### Knowledge points

- Pretraining optimizes next-token prediction over a large corpus.
- Instruction tuning changes the conditional behavior elicited by instructions.
- Preference optimization fits human or synthetic comparison signals, which
  inherit the values, coverage, and disagreement of the raters and rubric.
- A model output is a sampled continuation, not a database lookup or a
  proof-producing process.
- "Hallucination" should be operationalized as an unsupported, contradicted, or
  unverifiable claim relative to a task and evidence set.
- Valid JSON, schema-valid JSON, semantically valid values, and factually
  supported claims are four different checks.
- Verification requires a claim, an authoritative source or executable test, a
  comparison procedure, and an explicit disposition.
- Abstention and calibrated uncertainty are behaviors to evaluate, not
  guaranteed internal self-knowledge.

### Demonstrations and assessment

- Trace one training example through pretraining, supervised instruction
  tuning, preference comparison, and evaluation.
- Compare JSON mode, schema-constrained output, and semantic validation.
- Give students a schema-valid answer containing one false value and ask which
  validation layer catches it.
- Break a generated paragraph into atomic claims and label each supported,
  contradicted, or not verified.
- Require a verification table with claim, evidence, source authority,
  finding, and revision.
- End with a short transfer question: why can a more fluent answer require more,
  rather than less, verification?

## Deliberate exclusions

- No distributed-training implementation.
- No derivation of optimizer variants or full scaling-law estimation.
- No exhaustive comparison of preference-optimization algorithms.
- No vendor-specific model catalog or pricing.
- No claim that chain-of-thought text exposes a model's faithful internal
  reasoning.
- RAG implementation remains in Meetings 21-22; tool calls and harnesses remain
  in Meetings 23-24.
