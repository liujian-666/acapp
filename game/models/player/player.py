from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.URLField(max_length=256, blank=True)
    # blank=True,表示代码中创建数据库记录时该字段可传空白(空串,空字符串)
    # null=True,表示数据库创建时该字段可不填,用NULL填充
    openid = models.CharField(default="", max_length=50, blank=True, null=True)

    def __str__(self):
        return str(self.user)


