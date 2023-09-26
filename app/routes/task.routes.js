module.exports = app => {
  const tasks = require("../controllers/task.controller.js");

  var router = require("express").Router();

  // Create a new task
  router.post("/", tasks.create);

  // Retrieve all tasks
  router.get("/", tasks.findAll);

  // Retrieve a single task with id
  router.get("/:id", tasks.findOne);

  // Update a task with id
  router.put("/:id", tasks.update);

  // Delete a task with id
  router.delete("/:id", tasks.delete);

  // Delete all tasks
  router.delete("/", tasks.deleteAll);

  // get all tasks by status count
  router.get("/status/count", tasks.findAllbyStatusCount);

  //get all tasks grouped by month
  router.get("/status/count/:month", tasks.findAllbyStatusCountandmonth);

  app.use('/api/tasks', router);
};
