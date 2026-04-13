from django.db import models

class Email(models.Model):
    gmail_id = models.CharField(max_length=255, unique=True)
    subject = models.CharField(max_length=255)
    sender = models.CharField(max_length=255)
    snippet = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject