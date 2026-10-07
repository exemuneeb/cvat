# Definition of Done

Machine: Intel Core i5-8365U @ 1.60 GHz, 16 GB RAM, Windows 11 Pro
CVAT commit SHA: c4f0c2a54dd7d95bc222836c645e8c290858fd05
Written before starting any code. A box is ticked only when evidence is written beside it. Evidence files live in docs/evidence/.

## Floor (items 1 to 4)
- [x] Endpoint returns correct counts, checked against a known task.
      Evidence: docs/evidence/counts-check.txt. 500 images, 3541 COCO annotations, 3953 expected CVAT shapes (one per polygon part or RLE mask), endpoint total 3953, per-class differences: none.
- [x] Page in the web interface calls the endpoint and draws the graph.
      Evidence: docs/evidence/graph.png
- [ ] Empty case handled (task with no annotations).
      Implemented in the component (it shows "This task has no annotations yet"), but I have no screenshot of it, so this is not ticked.
- [x] Failed request handled (error message and retry button).
      Evidence: docs/evidence/error.png

## Auth (item 5)
- [x] No login gives 401. Evidence: docs/evidence/auth-401.txt
- [x] Logged-in user without access to the task gives 403. Evidence: docs/evidence/auth-403.txt (user2, a non-staff user with no access to task 1)
- [x] Logged-in user with access gets 200. Evidence: docs/evidence/auth-200.txt

## Speed (item 6)
- [x] Objective MO-1 measured 5 times, raw output saved. Evidence: docs/evidence/mo1-runs.txt
- [x] Median and spread reported in objectives.md. Median 1877 ms, range 1628 to 2270 ms.
- [x] Target missed, with the reason written down. Evidence: objectives.md, Result section. Target 300 ms, median 1877 ms.

## Extras
- [x] Item 7: group_by=type works, and I wrote why I chose it.
      Evidence: docs/evidence/group-by-type.txt. Why: COCO imports polygons and RLE masks, and CVAT stores one shape per polygon part, so splitting by shape type shows what the 3953 shapes are made of (3916 polygon, 37 mask) and explains why the total differs from the 3541 COCO annotations.
- [ ] Items 8 and 9 (live updates, reconnect): not attempted.

## Honesty checks
- [x] Plan matches what happened, or each change is noted in it with a reason (plan.md, Changes to the plan).
- [x] Number of images and shapes imported is written in objectives.md.
- [ ] No dead code, commented-out blocks or stray files in the diff.
- [ ] Recording is 5 minutes or less and answers K1 to K4.
- [ ] Pull request is into the main branch of my own fork, not cvat-ai/cvat.

## Not finished
- Items 8 and 9 (live updates over WebSocket, reconnect after a dropped connection) were not attempted. The page loads once and does not update itself.
- The empty-state screenshot was not taken.
- The speed target was missed (1877 ms against 300 ms). I did not test token or session authentication.
- Tracks and tags are not counted, so video tasks are not supported.
- The endpoint counts CVAT shapes. One COCO polygon annotation with several parts is counted several times.
- The page is only reachable by its URL (/tasks/<id>/class-counts). I did not add a link to it from the task page.
- I ran the page through the webpack dev server. I did not rebuild the cvat_ui Docker image.
- The recording and the pull request were still to do when I wrote this. Update this list when they are done.
