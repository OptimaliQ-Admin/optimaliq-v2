ALTER TABLE "public"."subscriptions"
ADD COLUMN "stripe_subscription_id" varchar,
ADD COLUMN "stripe_customer_id" varchar,
ADD COLUMN "stripe_data" json;