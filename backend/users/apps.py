from django.apps import AppConfig

class UsersConfig(AppConfig):
    name = 'users'

    def ready(self):
        try:
            from mongodb_config import init_mongodb
            init_mongodb()
        except Exception as e:
            print(f"[MONGODB INIT WARNING]: {e}")
