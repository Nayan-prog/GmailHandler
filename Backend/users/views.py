import requests
from django.shortcuts import redirect
from django.http import JsonResponse
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

from config.google_config import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .models import Email   # ✅ NEW IMPORT


# 🔐 Step 1: Redirect to Google Login
def google_login(request):
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        "&scope=https://www.googleapis.com/auth/gmail.readonly"
        "&access_type=offline"
        "&prompt=consent"
    )
    return redirect(auth_url)


# 🔄 Step 2: Handle Callback + Get Token
def google_callback(request):
    code = request.GET.get("code")

    token_url = "https://oauth2.googleapis.com/token"

    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    response = requests.post(token_url, data=data)
    token_data = response.json()

    access_token = token_data.get("access_token")

    # 👉 Fetch + Save emails
    emails = fetch_emails_logic(access_token)

    return JsonResponse({
        "token": access_token,
        "emails": emails
    })


# 📥 Step 3: Fetch Emails + Save to PostgreSQL
def fetch_emails_logic(access_token):
    creds = Credentials(token=access_token)

    service = build('gmail', 'v1', credentials=creds)

    results = service.users().messages().list(userId='me', maxResults=10).execute()
    messages = results.get('messages', [])

    email_list = []

    for msg in messages:
        msg_data = service.users().messages().get(userId='me', id=msg['id']).execute()

        headers = msg_data['payload']['headers']

        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        snippet = msg_data.get("snippet", "")

        # ✅ SAVE TO DATABASE (IMPORTANT)
        Email.objects.get_or_create(
            gmail_id=msg['id'],
            defaults={
                "subject": subject,
                "sender": sender,
                "snippet": snippet
            }
        )

        email_list.append({
            "id": msg['id'],
            "subject": subject,
            "sender": sender,
            "snippet": snippet,
        })

    return email_list

def get_emails_from_db(request):
    emails = Email.objects.all().order_by('-id')[:50]

    data = []
    for email in emails:
        data.append({
            "id": email.gmail_id,
            "subject": email.subject,
            "sender": email.sender,
            "snippet": email.snippet,
        })

    return JsonResponse({"emails": data})