-- Table Definition ----------------------------------------------

CREATE TABLE db_product (
    prd_id SERIAL PRIMARY KEY,
    prd_name character varying(255) NOT NULL,
    prd_alias character varying(255) NOT NULL,
    prd_balance numeric(6,2) NOT NULL DEFAULT 100,
    prd_type_id integer NOT NULL REFERENCES db_product_type(prd_type_id),
    prd_usr_id integer NOT NULL REFERENCES db_user(usr_id),
    prd_status integer DEFAULT 1
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX db_product_pkey ON db_product(prd_id int4_ops);