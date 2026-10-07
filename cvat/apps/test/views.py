from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cvat.apps.engine.models import JobType, LabeledShape, Task
from cvat.apps.engine.permissions import TaskPermission

GROUP_BY_CHOICES = ("label", "type")


class ClassCountsView(APIView):
    """Number of labeled shapes per class for one task.

    ?group_by=type additionally splits each class by shape type.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        group_by = request.query_params.get("group_by", "label")
        if group_by not in GROUP_BY_CHOICES:
            raise ValidationError(f"group_by must be one of {GROUP_BY_CHOICES}")

        task = get_object_or_404(Task, pk=task_id)
        if not TaskPermission.create_scope_view(request, task).check_access().allow:
            raise PermissionDenied("You do not have access to this task.")

        # Ground-truth jobs keep their own shapes and skeleton elements have a
        # parent, so counting either would inflate the per-class numbers.
        shapes = LabeledShape.objects.filter(
            job__segment__task_id=task.id,
            job__type=JobType.ANNOTATION.value,
            parent__isnull=True,
        )
        fields = ["label__name"] + (["type"] if group_by == "type" else [])
        rows = shapes.values(*fields).annotate(count=Count("id")).order_by(*fields)

        counts = [
            {
                "label": row["label__name"],
                **({"type": row["type"]} if group_by == "type" else {}),
                "count": row["count"],
            }
            for row in rows
        ]
        return Response(
            {
                "task_id": task.id,
                "group_by": group_by,
                "total": sum(item["count"] for item in counts),
                "counts": counts,
            }
        )
