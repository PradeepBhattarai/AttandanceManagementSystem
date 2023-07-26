const fs = require("fs");
fs.rmdir(
  "./node_modules/mdbreact/node_modules/",
  { recursive: true },
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Successfully deleted");
    }
  }
);
