from django.urls import path
from .views import admin_dashboard_analytics, gis_heatmap_data

urlpatterns = [
    path('dashboard/', admin_dashboard_analytics, name='admin_dashboard_analytics'),
    path('heatmap/', gis_heatmap_data, name='gis_heatmap_data'),
]
