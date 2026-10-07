# Definition of Done

Machine: Intel Core i5-8365U @ 1.60 GHz, 16 GB RAM, Windows 11 Pro
CVAT commit SHA: c4f0c2a54dd7d95bc222836c645e8c290858fd05
Written before starting any code. A box is ticked only when evidence is
written beside it. Evidence files live in docs/evidence/.

## Floor (items 1 to 4)
- [ ] Endpoint returns correct counts, checked against a known task.
      Evidence: [endpoint output compared with counts I computed myself
      from instances_val2017.json for the imported images. File:
      docs/evidence/counts-check.txt]
- [ ] Page in the web interface calls the endpoint and draws the graph.
      Evidence: [screenshot: docs/evidence/graph.png]
- [ ] Empty case handled (task with no annotations).
      Evidence: [screenshot: docs/evidence/empty.png]
- [ ] Failed request handled (error message and retry button).
      Evidence: [screenshot: docs/evidence/error.png]

## Auth (item 5)
- [ ] No login gives 401.
      Evidence: [curl output: docs/evidence/auth-401.txt]
- [ ] Logged-in user without access to the task gives 403.
      Evidence: [curl output: docs/evidence/auth-403.txt]
- [ ] Logged-in user with access gets 200.
      Evidence: [curl output: docs/evidence/auth-200.txt]

## Speed (item 6)
- [ ] Objective MO-1 measured 5 times, raw output saved.
      Evidence: [docs/evidence/mo1-runs.txt]
- [ ] Median and spread reported in objectives.md.
- [ ] Target met, or missed with the reason written down.
      Evidence: [objectives.md, Result section]

## Extras
- [ ] Item 7: group_by=type works, and I wrote why I chose it.
      Evidence: [docs/evidence/group-by-type.txt]
- [ ] Items 8 and 9 (live updates, reconnect): [attempted / not attempted]

## Honesty checks
- [ ] Plan matches what happened, or each change is noted in it with a reason.
- [ ] Number of images and shapes imported is written in objectives.md.
- [ ] No dead code, commented-out blocks or stray files in the diff.
- [ ] Recording is 5 minutes or less and answers K1 to K4.
- [ ] Pull request is into the main branch of MY fork, not cvat-ai/cvat.

## Not finished
[List everything not done and why. Leave this honest, never empty by default.]