## 2024-06-02 - Optimize Array Lookup
**Learning:** Found usage of `.filter()[0]` for finding single elements in arrays instead of using `.find()`. In V8, `.filter()[0]` iterates over the whole array, whereas `.find()` short-circuits. `.find()` is around 6x faster in microbenchmarks and much more semantic.
**Action:** Replace `array.filter(fn)[0]` with `array.find(fn)` across the codebase.
