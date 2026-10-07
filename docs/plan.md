# Plan — Annotation Analytics

Written before any code. Anything in [brackets] is mine to fill in.

## Environment
- CVAT commit SHA: c4f0c2a54dd7d95bc222836c645e8c290858fd05
- Machine: [CPU / RAM / OS]
- Sample data: COCO 2017 val, [N] images imported into one task.

## Order of work and time budget (8 h)

| # | Work | Budget |
|---|------|--------|
| 0 | Stack up, data imported, read `engine/models.py` and `permissions.py` | 1:00 |
| 1 | Endpoint: grouped count in the database (items 1) | 1:00 |
| 2 | Page and graph, with empty and error states (items 2–4) | 1:30 |
| 3 | Auth: 401 without login, 403 without task access, curl evidence (item 5) | 0:45 |
| 4 | Speed target: measure 5 runs, report median and spread (item 6) | 0:45 |
| 5 | Grouping by shape type (item 7) | 0:30 |
| 6 | Docs finalised, DoD evidence, recording | 1:30 |
| — | Buffer | 0:30 |

## Design decisions made up front
- One `GROUP BY` query on `LabeledShape`, filtered through `job -> segment -> task`. The count is done by the database, not in Python.
- Only annotation jobs are counted. Ground-truth jobs carry their own shapes and would double-count.
- Only `LabeledShape` is counted. COCO instances import as shapes. `LabeledTrack` and `LabeledImage` (tags) are out of scope, so video tasks and tag-only tasks are not covered.
- Auth reuses `IsAuthenticated` plus CVAT's own `TaskPermission` (view scope). No custom permission logic.
- Chart is drawn with plain HTML/CSS bars to avoid adding a dependency.
- Item 7 is grouping by shape type. COCO imports a mix of polygons and masks, so the split shows something real about the data.

## Deliberately skipped
- Items 8 and 9 (WebSocket live updates and reconnect), unless items 1–7 are finished with evidence and time remains.
- Tracks, tags, caching, pagination.

## Changes to the plan
- 7 Oct 2026, setup took longer than budgeted. Docker needed the Windows Virtual Machine Platform feature enabled and a restart, a push was rejected until I signed in to the right GitHub account, and I moved the clone out of OneDrive to C:\dev. This came out of the buffer.
- 7 Oct 2026, the first annotation import failed. CVAT's COCO importer requires every image listed in the annotations file to exist in the task. I wrote a small script (kept outside the repo) that builds an annotations file for the 500 images I uploaded.
- 7 Oct 2026, the endpoint returned 3953 shapes while the COCO file lists 3541 annotations. I checked it before ticking anything: CVAT stores one shape per polygon part, and 3916 polygon parts plus 37 RLE masks gives exactly 3953. The endpoint counts shapes, not COCO annotations. I added a per-class comparison (docs/evidence/counts-check.txt).
- 7 Oct 2026, the compose file has no volume mounts for the backend, so I copied the app into the running container with docker cp instead of rebuilding the image. The code in the repository is the source of truth.
- 7 Oct 2026, the page route is /tasks/:id/class-counts, because CVAT already uses /tasks/:tid/analytics. The page calls the endpoint with fetch and the session cookie, not through cvat-core.
- 7 Oct 2026, the first speed trial ran while a yarn install was running and gave a median of about 8 s. I added a back-to-back baseline against a stock CVAT endpoint and repeated the run under quiet conditions. The 300 ms target was not changed, and it was missed (see objectives.md).
- 7 Oct 2026, I decided not to attempt items 8 and 9. Time went into setup and into verifying items 1 to 7 with evidence.

## Decision record
- **Approach taken:** database-side `GROUP BY` in a new `test` app, one extra endpoint.
- **Approach rejected:** loading each task's annotations through CVAT's data-manager layer and counting in Python, which would also cover tracks and tags.
- **What rejecting it cost:** tracks and tags are not counted, so video tasks are wrong. The gain is one query and a response time that depends on the database, not on deserialising every shape.
- **What actually happened:** the endpoint also filters to top-level shapes (parent is null, so skeleton elements are not counted separately). It counts CVAT shapes, so one COCO polygon with several parts is counted several times.
- **What it gained:** the counting step is one query that takes about 0.13 s on my data, and it does not deserialise every shape into Python objects.
- **Second decision:** the chart is hand-drawn bars with no chart library. This avoided a new dependency and kept the change small. The cost is no tooltips, no axes and no animation, and it would not scale well to hundreds of classes.
