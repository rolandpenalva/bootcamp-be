CREATE TABLE db_currency (
    crr_id SERIAL PRIMARY KEY,
    crr_code character varying(255) NOT NULL,
    crr_description character varying(255)
); 

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX db_currency_pkey ON db_currency(crr_id int4_ops);