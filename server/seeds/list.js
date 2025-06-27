/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("list_table").del();
  await knex("list_table").insert([
    {
      name: "Wallow in self pity",
      comments: "4:00",
      completed: false,
    },
    {
      name: "Stare into the abyss",
      comments: "4:30",
      completed: true,
    },
    {
      name: "Solve world hunger",
      comments: "Tell no one",
      completed: false,
    },
    {
      name: "Jazzercise",
      comments: "5:30",
      completed: true,
    },
    {
      name: "Dinner with me",
      comments: "I can't cancel that again",
      completed: false,
    },
    {
      name: "Wrestle with my self loathing",
      comments: "I'm booked!",
      completed: false,
    },
  ]);
};
