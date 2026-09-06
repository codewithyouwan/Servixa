-- Minimal countries seed for the `countries` FK on users.user_country.
-- Not required for signup (that column is nullable now — see schema.sql),
-- but needed before anyone can save a profile address. US-only MVP per
-- docs/product-spec.md; add rows here as you expand.

INSERT INTO countries (code, code_alpha3, name, phone_code, currency_code, currency_name, currency_symbol)
VALUES ('US', 'USA', 'United States', '+1', 'USD', 'US Dollar', '$')
ON CONFLICT (code) DO NOTHING;
