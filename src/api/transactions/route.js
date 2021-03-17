const { Router } = require("express");
const AccessService = require("../../services/access");
const AuthService = require("../../services/auth");
const TransactionController = require("./controller");

const router = new Router();

router.route("/").get(TransactionController.getTransactions);
router.route("/").post(TransactionController.createTransaction);
router.route("/:transId").delete(TransactionController.deleteTransaction);

module.exports = router;
