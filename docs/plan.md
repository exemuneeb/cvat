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
[Add dated notes here whenever reality diverges, with the reason.]

## Decision record
- **Approach taken:** database-side `GROUP BY` in a new `test` app, one extra endpoint.
- **Approach rejected:** loading each task's annotations through CVAT's data-manager layer and counting in Python, which would also cover tracks and tags.
- **What rejecting it cost:** tracks and tags are not counted, so video tasks are wrong. The gain is one query and a response time that depends on the database, not on deserialising every shape.
- [Add anything else that actually happened.]
