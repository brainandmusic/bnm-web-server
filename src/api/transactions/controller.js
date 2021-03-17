const TransactionService = require("./service");

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const transInfo = req.body.transactionInfo;
      if (
        !transInfo ||
        !transInfo.studyId ||
        !transInfo.armId ||
        !transInfo.eventId ||
        !transInfo.creator
      ) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Transaction info is incomplete.",
        });
      }

      const transFromDb = await TransactionService.createTransaction(transInfo);
      // send response back to the client
      return res.json({
        status: "OK",
        result: transFromDb,
        message: "Experiments have been assigned successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteTransaction(req, res) {
    try {
      const transId = req.params.transId;
      // validate study info
      if (!transId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Transaction ID is required.",
        });
      }

      const transFromDb = await TransactionService.revokeTransaction(transId);
      // send response back to the client
      return res.json({
        status: "OK",
        result: transFromDb,
        message: "Experiment assignments have been revoked successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }
}

module.exports = TransactionController;
