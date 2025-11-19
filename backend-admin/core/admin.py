from django.contrib import admin
from .models import TipoEspacio, Espacio, MotivoReserva, Usuario, Reserva

@admin.register(TipoEspacio)
class TipoEspacioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo', 'fecha_creacion')
    list_filter = ('activo',)
    search_fields = ('nombre',)


@admin.register(Espacio)
class EspacioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo_espacio', 'capacidad', 'precio_por_hora', 'activo')
    list_filter = ('activo', 'tipo_espacio')
    search_fields = ('nombre', 'ubicacion')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')


@admin.register(MotivoReserva)
class MotivoReservaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre',)


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('email', 'nombre', 'apellido', 'role', 'activo')
    list_filter = ('role', 'activo')
    search_fields = ('email', 'nombre', 'carnet_estudiantil')
    readonly_fields = ('fecha_registro',)


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'espacio', 'fecha_reserva', 'estado', 'precio_total')
    list_filter = ('estado', 'fecha_reserva')
    search_fields = ('usuario__email', 'espacio__nombre')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    
    fieldsets = (
        ('Usuario y Espacio', {'fields': ('usuario', 'espacio')}),
        ('Fechas y Horarios', {'fields': ('fecha_reserva', 'hora_inicio', 'hora_fin')}),
        ('Detalles', {'fields': ('motivo', 'estado', 'precio_total', 'observaciones')}),
        ('Timestamps', {'fields': ('fecha_creacion', 'fecha_actualizacion'), 'classes': ('collapse',)})
    )