#!/usr/bin/env bash
# Usage: ./scripts/bench_mo1.sh <task_id> <user> <password>
# Saves 5 raw timings (seconds) of the class-counts endpoint to docs/evidence/mo1-runs.txt
set -euo pipefail
mkdir -p docs/evidence
out=docs/evidence/mo1-runs.txt
: > "$out"
curl -s -o /dev/null -u "$2:$3" "http://localhost:8080/api/test/tasks/$1/class-counts"
for i in 1 2 3 4 5; do
  curl -s -o /dev/null -u "$2:$3" -w "run $i: %{time_total}s status=%{http_code}\n" \
    "http://localhost:8080/api/test/tasks/$1/class-counts" | tee -a "$out"
done
