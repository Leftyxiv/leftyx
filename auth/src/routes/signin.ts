import express from "express";

const router = express.Router();

router.post("/api/users/signin", (req, res) => {
  res.send("Hallo, wunderbar, sign in");
});

export { router as signinRouter };
