-- Table Definition ----------------------------------------------

CREATE TABLE db_user (
    usr_id SERIAL PRIMARY KEY,
    usr_name character varying(255) NOT NULL UNIQUE,
    usr_password character varying(255) NOT NULL,
    usr_creation timestamp without time zone NOT NULL DEFAULT now(),
    usr_rol_id integer NOT NULL REFERENCES db_user_role(rol_id),
    usr_email character varying(255),
    usr_last_login timestamp without time zone DEFAULT now(),
    usr_status integer DEFAULT 1
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX db_user_pkey ON db_user(usr_id int4_ops);
CREATE UNIQUE INDEX usr_name_unique ON db_user(usr_name text_ops);