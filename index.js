import express from "express";
import db from "./db.js";


const app = express();


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/traveller", async (req, res) => {
  try {
  const [result] =await db.raw("select * from traveller");
  res.status(201).json(
   { success: true,
    data: result}
  )   } 

catch (error) {
console.log("Error fetching traveller:", error);
res.status(500).json({ message: "Error fetching traveller" });
}
})

app.post("/traveller",async (req, res) => {
   try { 
  const result =await  db.raw("insert  into traveller (name,age,phone) values(?, ?, ?)", ['John Doe', 30, '1234567890']);

  if (result) {
    res.status(201).json({ message: "Traveller added successfully",
        status: 201,
     });
  }
} catch (error) {
  console.error("Error adding traveller:", error);
  res.status(500).json({ message: "Error adding traveller" });
}
});

app.listen(8003, () => {
  console.log("Server is running on port 8003");
})