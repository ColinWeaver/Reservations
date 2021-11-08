exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE reservations, tables RESTART IDENTITY CASCADE");
};

