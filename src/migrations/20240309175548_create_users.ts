import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
        CREATE TABLE users (
            id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(64) NOT NULL,
            password VARCHAR(53) NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NULL,
            PRIMARY KEY (id),
            CONSTRAINT uc_users_username UNIQUE (username)
        )
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`
        DROP TABLE users
    `);
}
