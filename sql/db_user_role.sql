-- Table Definition ----------------------------------------------

CREATE TABLE db_user_role (
    rol_id SERIAL PRIMARY KEY,
    rol_name character varying(255) NOT NULL,
    rol_description character varying(255)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX db_user_role_pkey ON db_user_role(rol_id int4_ops);