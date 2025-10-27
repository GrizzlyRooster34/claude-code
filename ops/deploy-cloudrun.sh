#!/usr/bin/env bash
set -euo pipefail
PROJECT="${GCLOUD_PROJECT:?set GCLOUD_PROJECT}"
REGION="${GCLOUD_REGION:-us-central1}"
SVC="${SVC_NAME:-seven-daemon}"

gcloud builds submit --tag gcr.io/$PROJECT/$SVC
gcloud run deploy "$SVC" \
  --image gcr.io/$PROJECT/$SVC \
  --region "$REGION" \
  --allow-unauthenticated \
  --platform managed

# Canary 10% to latest; 90% to previous
gcloud run services update-traffic "$SVC" \
  --region "$REGION" \
  --to-latest \
  --platform managed
gcloud run services update-traffic "$SVC" \
  --region "$REGION" \
  --platform managed \
  --set-traffic latest=10
