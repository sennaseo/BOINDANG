db = db.getSiblingDB("nutrition_db");

db.createUser({
  user: process.env.DB_USERNAME || "boindang_user",
  pwd: process.env.DB_PASSWORD,
  roles: [
    { role: "readWrite", db: "nutrition_db" }
  ]
});
