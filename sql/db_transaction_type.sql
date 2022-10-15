CREATE TABLE db_transaction_type (
    trs_type_id SERIAL PRIMARY KEY,
    trs_type_name character varying(255) NOT NULL,
    trs_type_description character varying(255)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX db_transaction_type_pkey ON db_transaction_type(trs_type_id int4_ops);