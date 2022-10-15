-- Table Definition ----------------------------------------------

CREATE TABLE db_transaction (
    trs_id SERIAL PRIMARY KEY,
    trs_name character varying(255) NOT NULL,
    trs_description character varying(255),
    trs_date timestamp without time zone NOT NULL DEFAULT now(),
    trs_amount numeric(6,2) NOT NULL DEFAULT 0,
    trs_crr_id integer NOT NULL REFERENCES db_currency(crr_id),
    trs_type_id integer NOT NULL REFERENCES db_transaction_type(trs_type_id),
    trs_prd_from integer REFERENCES db_product(prd_id),
    trs_prd_to integer REFERENCES db_product(prd_id),
    trs_move character varying(50) NOT NULL,
    trs_status integer DEFAULT 1
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX db_transaction_pkey ON db_transaction(trs_id int4_ops);