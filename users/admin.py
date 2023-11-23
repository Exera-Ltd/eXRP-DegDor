from django.contrib import admin
from .models import UserProfile

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'region', 'manager')
    search_fields = ('user__username', 'role', 'region')
    list_filter = ('role', 'region', 'manager')
    raw_id_fields = ('user', 'manager')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "manager":
            kwargs["queryset"] = UserProfile.objects.filter(role='manager')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(UserProfile, UserProfileAdmin)
