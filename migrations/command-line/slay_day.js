db.users.update(
  {},
  { $inc: { 'achievements.slayDays': 1 } },
  { multi: 1 },
);
