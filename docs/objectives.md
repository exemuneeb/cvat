# Objectives

Machine: [CPU], [RAM], [OS]. CVAT commit: [SHA]. Sample data: COCO val2017, 500 images in one task (task 1), 3541 COCO annotations, which CVAT stores as 3953 shapes (3916 polygon, 37 mask)..

| ID | Field | Entry |
|----|-------|-------|
| MO-1 | What is measured | Server response time of `GET /api/test/tasks/<id>/class-counts` for the sample task. |
| | How | `scripts/bench_mo1.sh`, which runs `curl -w "%{time_total}"` 5 times with basic auth. Raw output in `docs/evidence/mo1-runs.txt`. |
| | Target | Median of 5 runs at or below [X] ms. Justification: [why this number; e.g. one indexed GROUP BY over M rows should be well under a typical list endpoint]. |
| | Conditions | Local Docker stack, authenticated, warm server (one discarded request first), nothing else running. |
| | Not included | First request after a cold start, video tasks, the browser render time. |

## Result

Raw output: docs/evidence/mo1-runs.txt

| Run | 1 | 2 | 3 | 4 | 5 |
|-----|---|---|---|---|---|
| ms | 2270 | 1628 | 2022 | 1877 | 1664 |

Median 1877 ms. Min 1628 ms, max 2270 ms.

**Target (300 ms): missed.**

### Why it was missed
- The database query alone takes about 0.13 s. I timed the same filter and GROUP BY in the Django shell, which returned 78 rows in 0.133 s, including the first connection. This was a terminal measurement and is not saved as a file.
- A stock CVAT endpoint with the same authentication, GET /api/tasks/1, measured back to back with mine, gave a median of about 1.60 s against about 1.66 s for class-counts (docs/evidence/mo1-baseline-comparison.txt). My endpoint adds little on top of what any authenticated CVAT request already costs on this machine.
- So most of each request is paid before my code does any work. I believe this is CVAT's authentication and permission layer on a laptop running Docker under WSL 2, but I did not isolate which part, so this is a belief and not a measurement.
- My first trial ran while a yarn install was running and gave a median of about 8 s (docs/evidence/mo1-trial-under-load.txt). I repeated the measurement under quiet conditions, which gave the table above.

### What I did not do
- I did not test token or session authentication. Basic auth makes the server hash the password on every request, so these may be faster, but I have not measured that.
- I set the target without a baseline. With the baseline known, a target relative to the stock endpoint (for example within 10 percent of /api/tasks/1) would have been more honest than an absolute 300 ms.
