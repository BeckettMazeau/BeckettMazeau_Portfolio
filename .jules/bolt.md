## 2024-06-02 - Optimize Array Lookup
**Learning:** Found usage of `.filter()[0]` for finding single elements in arrays instead of using `.find()`. In V8, `.filter()[0]` iterates over the whole array, whereas `.find()` short-circuits. `.find()` is around 6x faster in microbenchmarks and much more semantic.
**Action:** Replace `array.filter(fn)[0]` with `array.find(fn)` across the codebase.

## 2024-06-03 - O(1) Hash Map for Static Data Lookups
**Learning:** In static site architectures passing global JSON state (`window.SITE`), referencing items by slug via `array.map(bySlug)` where `bySlug` uses `array.find()` leads to O(N*M) runtime complexity (e.g., matching N home projects against M total projects).
**Action:** Replace `array.find()` within repetitive lookups like `bySlug` with a lazily-initialized hash map to reduce complexity to O(N+M) and ensure O(1) per lookup.
