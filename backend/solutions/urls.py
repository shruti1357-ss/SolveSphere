from django.urls import path
from .views import (
    solution_list_create,
    solution_detail,
    add_milestone,
    pledge_csr_grant
)

urlpatterns = [
    path('', solution_list_create, name='solution_list_create'),
    path('<str:pk>/', solution_detail, name='solution_detail'),
    path('<str:pk>/milestones/', add_milestone, name='add_milestone'),
    path('<str:pk>/grant/', pledge_csr_grant, name='pledge_csr_grant'),
]
