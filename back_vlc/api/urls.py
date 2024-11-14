from django.urls import path
from .views import LocalListView, LocalTableOrderView

urlpatterns = [
    path('locales/', LocalListView.as_view(), name='local-list'), 
    path('locales/<int:local_id>/tables-orders/', LocalTableOrderView.as_view(), name='local-table-order'),
]
