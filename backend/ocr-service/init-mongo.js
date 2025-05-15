db = db.getSiblingDB("nutrition_db");

db.createUser({
  user: "boindang_user",
  pwd: "k12d206",
  roles: [
    { role: "readWrite", db: "nutrition_db" }
  ]
});
