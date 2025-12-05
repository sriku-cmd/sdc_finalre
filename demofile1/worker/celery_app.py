from celery import Celery
import os

# Get Redis URL from environment variables
REDIS_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')

app = Celery('sociosphere', broker=REDIS_URL, backend=REDIS_URL)

app.conf.update(
    result_expires=3600,
)

if __name__ == '__main__':
    app.start()
