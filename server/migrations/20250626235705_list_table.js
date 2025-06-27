/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("list_table", (table) => {
        table.increments("id").primary();
        table.string("name", 250);
        table.string("comments", 1000);
        table.boolean("completed")
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("list_table");
};
