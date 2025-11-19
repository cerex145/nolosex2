from django.db import models

class TipoEspacio(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    icono = models.CharField(max_length=50, null=True, blank=True)
    activo = models.BooleanField()
    fecha_creacion = models.DateTimeField()

    class Meta:
        db_table = 'tipos_espacios'
        managed = False
        verbose_name = 'Tipo de Espacio'
        verbose_name_plural = 'Tipos de Espacios'

    def __str__(self):
        return self.nombre


class Espacio(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField()
    ubicacion = models.CharField(max_length=200)
    capacidad = models.IntegerField()
    tipo_espacio = models.ForeignKey(TipoEspacio, on_delete=models.DO_NOTHING)
    precio_por_hora = models.DecimalField(max_digits=10, decimal_places=2)
    equipamiento = models.TextField(null=True, blank=True)
    imagen_url = models.CharField(max_length=255, null=True, blank=True)
    activo = models.BooleanField()
    fecha_creacion = models.DateTimeField()
    fecha_actualizacion = models.DateTimeField()

    class Meta:
        db_table = 'espacios'
        managed = False
        verbose_name = 'Espacio'
        verbose_name_plural = 'Espacios'

    def __str__(self):
        return self.nombre


class MotivoReserva(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    activo = models.BooleanField()

    class Meta:
        db_table = 'motivos_reserva'
        managed = False
        verbose_name = 'Motivo de Reserva'
        verbose_name_plural = 'Motivos de Reserva'

    def __str__(self):
        return self.nombre


class Usuario(models.Model):
    email = models.CharField(max_length=255)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    carnet_estudiantil = models.CharField(max_length=50, null=True, blank=True)
    google_id = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=50)
    activo = models.BooleanField()
    fecha_registro = models.DateTimeField()

    class Meta:
        db_table = 'usuarios'
        managed = False
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.email} ({self.role})"


class Reserva(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING)
    espacio = models.ForeignKey(Espacio, on_delete=models.DO_NOTHING)
    fecha_reserva = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    motivo = models.CharField(max_length=200, null=True, blank=True)
    estado = models.CharField(max_length=20)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    observaciones = models.TextField(null=True, blank=True)
    fecha_creacion = models.DateTimeField()
    fecha_actualizacion = models.DateTimeField()

    class Meta:
        db_table = 'reservas'
        managed = False
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'

    def __str__(self):
        return f"{self.usuario.email} - {self.espacio.nombre} ({self.fecha_reserva})"
