const sql = require("./db.js");

// constructor
const Task = function (task) {
  this.title = task.title;
  this.description = task.description;
  this.status = task.status;
  this.created_date = new Date();
};

const getMonthbyString = (month) => {
  switch (month) {
    case 'january': return 0;
    case "February": return 1;

    case "March": return 2;

    case "April": return 3;

    case "May": return 4;

    case "June": return 5;

    case "July": return 6;

    case "August": return 7;

    case "September": return 8;

    case "October": return 9;

    case "November": return 10;

    case "December": return 11;

    default: return 1;
  }

}

Task.create = (newtask, result) => {
  sql.query("INSERT INTO tasks SET ?", newtask, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created task: ", { id: res.insertId, ...newtask });
    result(null, { id: res.insertId, ...newtask });
  });
};

Task.findById = (id, result) => {
  sql.query(`SELECT * FROM tasks WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found task: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found tasks with the id
    result({ kind: "not_found" }, null);
  });
};

Task.getAll = (title, result) => {
  let query = "SELECT * FROM tasks";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tasks: ", res);
    result(null, res);
  });
};


Task.getAllByStatusCount = (result) => {

  let query = "select count(*) as total_tasks ,(select count(*) from tasks where status='OPEN')as open_tasks,(select count(*) from tasks where status='INPROGRESS') as inprogress_tasks,(select count(*) from tasks where status='COMPLETED') as completed_tasks from tasks";
  console.log("query", query)
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tasks: ", res);
    result(null, res);
  });
};

Task.getAllByStatusCountandMonth = (month, result) => {

  let query = `select count(*) as total_tasks ,(select count(*) from tasks where status='OPEN' and MONTH(created_date) = ${getMonthbyString(month)})as open_tasks,(select count(*) from tasks where status='INPROGRESS' and MONTH(created_date) = ${getMonthbyString(month)}) as inprogress_tasks,(select count(*) from tasks where status='COMPLETED' and MONTH(created_date) = ${getMonthbyString(month)}) as completed_tasks from tasks where MONTH(created_date) = ${getMonthbyString(month)}`;
  console.log("query", query)
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tasks: ", res);
    result(null, res);
  });
};



Task.updateById = (id, tasks, result) => {
  sql.query(
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
    [tasks.title, tasks.description, tasks.status, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found tasks with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated tasks: ", { id: id, ...task });
      result(null, { id: id, ...task });
    }
  );
};

Task.remove = (id, result) => {
  sql.query("DELETE FROM tasks WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found task with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted task with id: ", id);
    result(null, res);
  });
};

Task.removeAll = result => {
  sql.query("DELETE FROM tasks", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tasks`);
    result(null, res);
  });
};

module.exports = Task;
