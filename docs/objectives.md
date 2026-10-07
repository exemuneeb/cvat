# Objectives

Machine: [CPU], [RAM], [OS]. CVAT commit: [SHA]. Sample data: COCO val2017, [N] images, [M] shapes.

| ID | Field | Entry |
|----|-------|-------|
| MO-1 | What is measured | Server response time of `GET /api/test/tasks/<id>/class-counts` for the sample task. |
| | How | `scripts/bench_mo1.sh`, which runs `curl -w "%{time_total}"` 5 times with basic auth. Raw output in `docs/evidence/mo1-runs.txt`. |
| | Target | Median of 5 runs at or below [X] ms. Justification: [why this number; e.g. one indexed GROUP BY over M rows should be well under a typical list endpoint]. |
| | Conditions | Local Docker stack, authenticated, warm server (one discarded request first), nothing else running. |
| | Not included | First request after a cold start, video tasks, the browser render time. |

## Result
- Runs: [paste raw output]
- Median: [ ] ms. Spread (min–max): [ ]–[ ] ms.
- Target met? [yes / no, and why]
