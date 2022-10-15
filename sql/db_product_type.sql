CREATE TABLE db_product_type (
    prd_type_id SERIAL PRIMARY KEY,
    prd_type_name character varying(255) NOT NULL,
    prd_type_description character varying(255)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX db_product_type_pkey ON db_product_type(prd_type_id int4_ops);