from django.urls import path
from .views import LocalListView

urlpatterns = [
    path('locales/', LocalListView.as_view(), name='local-list')
]
