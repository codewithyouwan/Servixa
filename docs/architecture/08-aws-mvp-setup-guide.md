# AWS MVP Setup Guide — Cognito + RDS + Lambda

Companion to the "Servixa AWS Blueprint" and "Servixa AWS Setup
Checklist" artifacts (the checklist has this same content with progress
checkboxes — this file is the durable reference to update as things
change). Every step gives you the **console** click-path and the
equivalent **CLI** command — use whichever you prefer, or both, to see
how they map to each other. Supersedes the auth *mechanics* in
`04-authentication-and-roles.md` (Cognito replaces `@nestjs/passport` +
self-issued JWTs wholesale); that doc's role model (§5) and contractor
verification state machine (§6) still apply.

## 0. Do you need all 5 "Explore AWS" credit quests?

If you're working through the AWS console's "Explore AWS → Earn AWS
credits" activities, here's how they map to this build:

| Quest | For Servixa? | Why |
|---|---|---|
| Set up a cost budget (AWS Budgets) | **Do this** | Directly relevant given the minimal-cost goal — §1 below. |
| Create an Aurora or RDS database | **Do this** | This *is* your database — §3 below. |
| Create a web app using AWS Lambda | **Do this** | This is how the FastAPI backend actually runs — §6 below. |
| Launch an instance using EC2 | Not used | Servixa's compute is Lambda, not EC2 — nothing here needs it. |
| Use a foundation model in Bedrock | Not used | AI features go through Groq/LangChain (`pyproject.toml`), not Bedrock. |

EC2 and Bedrock are $20 each for a few minutes of clicking if you want
the full $100 — free money, just not part of Servixa's actual
architecture, so don't build anything real on them.

## 1. Set a cost budget

**Console:** Billing and Cost Management → **Budgets** → **Create
budget** → use the **Zero spend budget** template (alerts the instant
anything costs money — ideal while you're on free tier + credits). Then
create a second, **Customize → Cost budget**, ~$20–30/month, with an
alert at 80%.

**CLI** (the zero-spend template is console-only; this covers the
monthly ceiling):
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

cat > budget.json <<'EOF'
{
  "BudgetName": "servixa-monthly-ceiling",
  "BudgetLimit": {"Amount": "25", "Unit": "USD"},
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
EOF

cat > notify.json <<'EOF'
[{
  "Notification": {"NotificationType": "ACTUAL", "ComparisonOperator": "GREATER_THAN", "Threshold": 80},
  "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "you@example.com"}]
}]
EOF

aws budgets create-budget --account-id "$ACCOUNT_ID" \
  --budget file://budget.json --notifications-with-subscribers file://notify.json
```

## 2. Create the Cognito user pool, groups, and app client

**Console:** Cognito → **User pools** → **Create user pool**. If offered
a choice between a quick hosted-UI setup and "construct my own sign-in
experience," pick the custom path — the backend calls Cognito directly,
no hosted login page or OAuth redirect involved. Configure: sign-in
identifier **email**; required attributes **name, email**; auto-verify
**email**; password policy min 8 chars with upper/lower/number; MFA off
for MVP; email delivery via Cognito's built-in sender (fine under ~50/day,
swap to SES later). On the app client screen, check **"Generate a client
secret"** and enable **ALLOW_USER_PASSWORD_AUTH** +
**ALLOW_REFRESH_TOKEN_AUTH** under Authentication flows — if the
quick-setup wizard hides these, create the pool anyway, then edit the
app client afterward to turn them on. Copy the **Pool ID**, **Client
ID**, and **Client secret**. Then: pool → **Groups** tab → create four,
spelled exactly `homeowner`, `service_provider`, `brand`, `admin` (the
backend checks these strings).

> The console's newer quick-setup wizard is built around hosted-UI/OAuth
> apps and can default away the client secret and USER_PASSWORD_AUTH
> flow this backend needs — this is the one step worth doing by CLI even
> if you do everything else by console.

**CLI:**
```bash
aws cognito-idp create-user-pool \
  --pool-name servixa-mvp \
  --auto-verified-attributes email \
  --username-attributes email \
  --policies '{"PasswordPolicy":{"MinimumLength":8,"RequireUppercase":true,"RequireLowercase":true,"RequireNumbers":true,"RequireSymbols":false}}' \
  --schema '[{"Name":"name","AttributeDataType":"String","Required":true,"Mutable":true},{"Name":"email","AttributeDataType":"String","Required":true,"Mutable":true}]'
# note the returned "Id" → COGNITO_USER_POOL_ID

for GROUP in homeowner service_provider brand admin; do
  aws cognito-idp create-group --user-pool-id <POOL_ID> --group-name "$GROUP"
done

aws cognito-idp create-user-pool-client \
  --user-pool-id <POOL_ID> \
  --client-name servixa-backend \
  --generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH
# note "ClientId" → COGNITO_APP_CLIENT_ID, "ClientSecret" → COGNITO_APP_CLIENT_SECRET
```

## 3. Create the RDS Postgres instance

**Console:** RDS → **Databases** → **Create database** → **Standard
create** (not Easy create — you want to see/control public access) →
Engine **PostgreSQL**, version **16.x** → Templates: **Free tier**
(auto-picks a free-tier instance class, Multi-AZ off) → Settings: DB
instance identifier `servixa-mvp`, master username `servixa_admin`,
self-managed password → Connectivity: **Public access: Yes**, new or
existing security group `servixa-mvp-sg` → Additional configuration:
**Initial database name** `servixa` (easy to miss, near the bottom) →
Create. Once "Available," copy the **Endpoint** from Connectivity &
security. Then open the security group → **Inbound rules → Edit** → add
PostgreSQL, source **My IP**.

> **Why public + locked-down, not private:** Lambda isn't in a VPC by
> default, and putting it in one just to reach a private RDS instance
> means a NAT Gateway (~$32/mo) — more than the database itself. This is
> the pragmatic MVP tradeoff (see the Blueprint artifact §5); revisit
> once you're holding real user data.

**CLI:**
```bash
aws rds create-db-instance \
  --db-instance-identifier servixa-mvp \
  --db-instance-class db.t4g.micro \
  --engine postgres --engine-version 16 \
  --master-username servixa_admin \
  --master-user-password '<STRONG_PASSWORD>' \
  --allocated-storage 20 --storage-type gp3 \
  --db-name servixa \
  --backup-retention-period 7 \
  --publicly-accessible --no-multi-az

aws rds describe-db-instances --db-instance-identifier servixa-mvp \
  --query "DBInstances[0].Endpoint.Address" --output text

MY_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress \
  --group-id <SG_ID> --protocol tcp --port 5432 --cidr "${MY_IP}/32"
```

## 4. Apply the schema, seed countries, create your first admin

**Console:** RDS → your instance → **Actions → Query editor** (needs
Secrets Manager auth wired up; otherwise use local `psql`, right)  →
paste and run `backend/db/schema.sql`, then `backend/db/seed_countries.sql`.

**CLI:**
```bash
export DATABASE_URL="postgresql://servixa_admin:<PASSWORD>@<RDS_ENDPOINT>:5432/servixa"
psql "$DATABASE_URL" -f backend/db/schema.sql
psql "$DATABASE_URL" -f backend/db/seed_countries.sql
```

Admins never self-register (see `04-authentication-and-roles.md` §7).
**Console:** Cognito → your pool → **Users → Create user** → email
`admin@servixa.com`, set a temporary password, uncheck "send invite" if
you don't want an email → open the user → **Add to group** → `admin`.
Copy the user's **sub** from their attributes.

**CLI:**
```bash
aws cognito-idp admin-create-user \
  --user-pool-id <POOL_ID> --username admin@servixa.com \
  --user-attributes Name=name,Value="Founder Admin" Name=email,Value=admin@servixa.com \
  --temporary-password '<TEMP_PASSWORD>'

aws cognito-idp admin-add-user-to-group \
  --user-pool-id <POOL_ID> --username admin@servixa.com --group-name admin

aws cognito-idp admin-get-user --user-pool-id <POOL_ID> --username admin@servixa.com \
  --query "UserAttributes[?Name=='sub'].Value" --output text
```

Then, either console (query editor) or CLI:
```bash
psql "$DATABASE_URL" -c "
INSERT INTO admins (admin_id, admin_email, full_name, role)
VALUES ('<SUB>', 'admin@servixa.com', 'Founder Admin', 'super_admin');
"
```

They'll be asked to set a permanent password on first login.

## 5. Local dev environment — test before touching Lambda

Find your 4 values: **DATABASE_URL** from RDS Connectivity tab (add
`+asyncpg` after `postgresql`), **COGNITO_USER_POOL_ID** from the pool
overview, **COGNITO_APP_CLIENT_ID/SECRET** from App clients.

```bash
cd backend
cp .env.example .env   # fill in the 4 values above
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

```bash
curl -X POST localhost:8000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"Passw0rd!","name":"You","role":"homeowner"}'

# check your email for the confirmation code, then:
curl -X POST localhost:8000/api/v1/auth/confirm \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","code":"123456"}'

curl -X POST localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"Passw0rd!"}'

curl localhost:8000/api/v1/users/me -H "Authorization: Bearer <accessToken>"
```

`role` accepts `homeowner`, `service_provider`, or `brand` — not `admin`
(§4 above covers those).

## 6. Deploy to Lambda (when ready — not required to build/test locally)

`asyncpg` has a compiled extension, so a **container image** deploys
more reliably than a zip upload.

**Console:** ECR → **Create repository** `servixa-api` → push the image
built from the Dockerfile below (CLI panel) → Lambda → **Create
function → Container image** → name `servixa-api`, browse to the pushed
image → **Configuration → Environment variables**: the same 4 vars from
§5 plus `CORS_ORIGINS` → **Configuration → Permissions**: open the
execution role → **Add permissions → Create inline policy** → JSON tab,
paste the policy below → API Gateway → **Create API → HTTP API → Add
integration** → Lambda, your function → route `ANY /{proxy+}` → deploy.
Test with the invoke URL, same curls as §5.

**CLI:**
```bash
# backend/Dockerfile
cat > Dockerfile <<'EOF'
FROM public.ecr.aws/lambda/python:3.13
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv export --no-dev -o requirements.txt \
    && pip install -r requirements.txt -t "${LAMBDA_TASK_ROOT}"
COPY app ${LAMBDA_TASK_ROOT}/app
COPY db ${LAMBDA_TASK_ROOT}/db
CMD ["app.main.handler"]
EOF

aws ecr create-repository --repository-name servixa-api
aws ecr get-login-password | docker login --username AWS \
  --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com

docker build -t servixa-api .
docker tag servixa-api:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/servixa-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/servixa-api:latest

aws lambda create-function \
  --function-name servixa-api --package-type Image \
  --code ImageUri=<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/servixa-api:latest \
  --role arn:aws:iam::<ACCOUNT_ID>:role/<LAMBDA_EXEC_ROLE> \
  --timeout 15 --memory-size 512

aws apigatewayv2 create-api --name servixa-api-gw --protocol-type HTTP \
  --target arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:servixa-api
```

Grant the Lambda execution role exactly three IAM actions — `SignUp` /
`InitiateAuth` / `ConfirmSignUp` authenticate with the app client's own
SECRET_HASH, not IAM, so they don't need to be in this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "cognito-idp:AdminAddUserToGroup",
      "cognito-idp:AdminCreateUser",
      "cognito-idp:AdminGetUser"
    ],
    "Resource": "arn:aws:cognito-idp:<REGION>:<ACCOUNT_ID>:userpool/<POOL_ID>"
  }]
}
```

## 7. Optional: the other $40 in quest credits

Not part of Servixa's architecture — pure free credit if you want the
full $100.

- **EC2 ($20):** Console → EC2 → **Launch instance** → any free-tier AMI
  → `t2.micro`/`t3.micro` → launch with defaults → once running,
  **Instance state → Terminate**.
- **Bedrock ($20):** Console → Bedrock → **Model access** → request
  access to any model (e.g. Titan Text) → once granted, **Playground →
  Chat** → send one prompt.
