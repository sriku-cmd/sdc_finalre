from celery_app import app
import time

@app.task
def send_email_verification(email):
    """Mock task to send email verification"""
    print(f"Sending verification email to {email}...")
    time.sleep(2) # Simulate delay
    print(f"Email sent to {email}")
    return f"Verification sent to {email}"

@app.task
def process_post_analytics(post_id):
    """Mock task to process post analytics"""
    print(f"Processing analytics for post {post_id}...")
    time.sleep(5) # Simulate heavy processing
    print(f"Analytics processed for {post_id}")
    return f"Analytics ready for {post_id}"
