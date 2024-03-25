from django.contrib import admin
from .models import Region, Role, UserProfile

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'roles_display', 'region', 'manager', 'business')
    search_fields = ('user__username', 'roles', 'region', 'business__name')
    list_filter = ('roles', 'region', 'manager','business')
    raw_id_fields = ('user', 'manager')

    def roles_display(self, obj):
        return ', '.join(obj.roles.all().values_list('name', flat=True))
    roles_display.short_description = 'Roles'

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "manager":
            kwargs["queryset"] = UserProfile.objects.filter(roles__name='Manager')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Region)
admin.site.register(Role)