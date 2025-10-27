#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
REGION="${GCLOUD_REGION:-us-central1}"
PROJECT="${GCLOUD_PROJECT:?set GCLOUD_PROJECT}"
ENV_PATH="${ENV_PATH:-.env}"
PREF="${PREFERRED_ORDER:-pro,flash}"

if ! command -v jq >/dev/null 2>&1; then echo "[ERR] jq required"; exit 2; fi

# Get OAuth2 token via Application Default Credentials (service account JSON)
token="$(python - <<'PY'
import json, time, jwt, requests, os
sa_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
assert sa_path, "GOOGLE_APPLICATION_CREDENTIALS not set"
sa = json.load(open(sa_path))
now = int(time.time())
payload = {
  "iss": sa["client_email"], "sub": sa["client_email"],
  "aud": "https://oauth2.googleapis.com/token",
  "iat": now, "exp": now+3600,
  "scope": "https://www.googleapis.com/auth/cloud-platform"
}
pk = sa["private_key"]
jwt_assertion = jwt.encode(payload, pk, algorithm="RS256")
r = requests.post("https://oauth2.googleapis.com/token", data={
  "grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": jwt_assertion
})
print(r.json()["access_token"])
PY
)"
url="https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${REGION}/models"
models_json="$(curl -s -H "Authorization: Bearer $token" "$url")"
mapfile -t ids < <(echo "$models_json" | jq -r '.models[].name? // empty' \
 | sed -n 's#.*\(gemini-[^/\"]\+\)$#\1#p' | sort -u)

IFS=',' read -r -a order <<< "$PREF"
tier_rank(){ local t="${1,,}"; local w=${#order[ @]}; for x in "${order[ @]}"; do [ "$t" = "${x,,}" ] && echo $w && return; w=$((w-1)); done; echo 0; }
score(){
  local id="$1" major=0 minor=0 tier="flash"
  if [[ "$id" =~ gemini-([0-9]+)\.([0-9]+)-([A-Za-z0-9\-]+) ]]; then
    major="${BASH_REMATCH[1]}"; minor="${BASH_REMATCH[2]}"; tier="${BASH_REMATCH[3],,}"
  elif [[ "$id" =~ gemini-([0-9]+)-([A-Za-z0-9\-]+) ]]; then
    major="${BASH_REMATCH[1]}"; minor=0; tier="${BASH_REMATCH[2],,}"
  fi
  echo $(( major*1000000 + minor*1000 + $(tier_rank "$tier") ))
}
best=""; bests=-1
for id in "${ids[ @]}"; do s=$(score "$id"); (( s>bests )) && { best="$id"; bests="$s"; }; done

current=""
[ -f "$ENV_PATH" ] && current="$(grep -E '^\s*GEMINI_MODEL\s*=' "$ENV_PATH" | sed -E 's/.*=\s*"?([^"]+)"?/\1/')