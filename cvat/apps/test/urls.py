from django.urls import path

from .views import ClassCountsView

urlpatterns = [
    path(
        "test/tasks/<int:task_id>/class-counts",
        ClassCountsView.as_view(),
        name="test-class-counts",
    ),
]
