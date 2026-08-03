# Lessons 7-8 visual and interaction plan

## Source coverage

The authoritative source is `L05_MiniMax&Pruning.pptx`. Its 31 pages are already mapped in `public/course-source/l05-minimax-pruning/manifest.json`: source pages 1-16 feed Lesson 7 and pages 17-31 feed Lesson 8. This revision preserves every existing definition, correction, source figure, algorithm, worked value, application, and assessment.

| Lesson / page | Knowledge point | Source evidence | Visual or interaction | Student task | QA risk |
|---|---|---|---|---|---|
| 7 / 4 | A game solution is a contingency, not one path | Source page 3 | Interactive path-versus-game-tree comparison; reveal opponent-controlled replies | Identify who controls each edge and why one planned path is insufficient | Keep labels readable at Canvas width |
| 7 / 11 | MAX and MIN backup rules | Source page 8 | Progressive native game tree: leaves, MIN backups, then MAX decision | Predict each backed-up value before advancing | Preserve fixed MAX-utility perspective |
| 7 / 17 | Cutoff evaluation `E(n)=M(n)-O(n)` | Source page 12 | Animated count bars and signed score marker for all three source cases | Compute the score before reveal and interpret its sign | Do not imply the feature score is terminal utility |
| 8 / 3 | Alpha and beta are monotone path bounds | Source pages 17 and 21 | Interactive bound window with four proof states | Explain why alpha rises, beta falls, and the interval can close | Use correct inequality and fixed perspective |
| 8 / 11 | Move ordering changes work, not the answer | Source pages 17, 18, 21 | Toggle good versus poor ordering; compare evaluated-leaf bars and invariant result | Predict which order exposes a useful cutoff first | Leaf counts are illustrative, not universal complexity claims |
| 8 / 23 | Complete alpha-beta practice tree | Source page 30 | Native interactive tree preserving all 15 leaf values and groupings; step through nine evaluated and six skipped leaves | Record `v`, alpha, beta, cutoff type, root value, and selected action | Remove the complete-slide screenshot and preserve exact leaf order |

## Page-by-page audit summary

- Lesson 7 pages 1, 8, 12, 14-16, 18-19, and 21-22 already contain knowledge-bearing source graphics or native algorithms/traces.
- Lesson 7 pages 5, 13, 20, 23, and 24 already contain meaningful interaction.
- Lesson 7 pages 2-3, 6-7, 9-10, and 25 use structured maps or synthesis layouts; extra decorative imagery would not improve the explanation.
- Lesson 8 pages 4, 7, 9, 18-20, and 24 already contain meaningful interaction.
- Lesson 8 pages 6, 8, 13-17, and 20 contain exact source algorithms or trees.
- Lesson 8 pages 1-2, 5, 10, 12, 21-22, and 25 use structured explanatory layouts. The selected additions target the concepts where change over time or tree state is essential.

## Validation targets

- No complete source-slide image remains in either lesson implementation.
- Every interactive state has visible text, not color alone.
- Keyboard-operable buttons expose current state and reset where appropriate.
- Both lessons fit 1536x723 and 1024x768 without clipped trees, controls, titles, or footer navigation.
- Alpha-beta and full minimax retain the same root result at the same depth and evaluation function.
