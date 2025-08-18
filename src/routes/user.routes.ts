import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  res.sendStatus(200);
});

export default router;
