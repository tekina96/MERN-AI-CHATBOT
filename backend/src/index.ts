import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";


// connections and listeners

// basic GET, POST, PUT, DELETE operations
// app.get("/hello", (req, res, next) => {
//     return res.send("hello there!");
// });
// app.post("/hello", (req, res, next) => {
//     console.log(req.body.name);
//     var user = req.body.name;
//     return res.send("hello there! " + user);
// });
// // put is same as post it's used to send some data from frontend, but mainly it's used for modifying the data.
// app.put("/hello", (req, res, next) => {
//     console.log(req.body.name);
//     var user = req.body.name;
//     return res.send("hello there! " + user);
// });
// // Dynamic request using an id
// app.delete("/users/:id", (req, res, next) => {
//     // here id is a variable.
//     console.log(req.params.id);  // to execute a parameter we use it this way ( like params.id )
//     return res.send("hello there! ");
// });
const PORT = process.env.PORT || 5000;
connectToDatabase()
    .then(() => {
        app.listen(PORT, () => console.log("server open and connected to DataBase"));
    })
    .catch((err) => console.log(err));


