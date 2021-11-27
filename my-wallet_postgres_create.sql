CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" uuid NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "records" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"date" DATE NOT NULL,
	"description" varchar(255) NOT NULL,
	"type" integer NOT NULL,
	"value" integer NOT NULL,
	CONSTRAINT "records_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "records" ADD CONSTRAINT "records_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "records" ADD CONSTRAINT "records_ck0" CHECK ("type" = 0 OR "type" = 1);
ALTER TABLE "records" ADD CONSTRAINT "records_ck1" CHECK ("value" > 0);
