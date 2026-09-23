const transactionModel = require("../Models/transaction.model");
const ledgerModel = require("../Models/ledger.model");
const accountModel = require("../Models/account.model");
const emailServices = require("../services/email.service");
const mongoose = require("mongoose");

async function createTransaction(req, res) {
  /**
   * 1.Validate request
   */
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount and idempotencyKey is required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromAccount || !toAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }
  /**
   * 2. validate idempotencyKey
   */

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status == "COMPLETED") {
      return res.status(200).json({
        message: "Transaction Already Processed",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status == "PENDING") {
      return res.status(200).json({
        message: "Transaction is still processing",
      });
    }
    if (isTransactionAlreadyExists.status == "FAILED") {
      return res.status(500).json({
        message: "Transaction processing failed, please retry",
      });
    }
    if (isTransactionAlreadyExists.status == "REVERSED") {
      return res.status(500).json({
        message: "Transaction was reversed, please retry",
      });
    }
  }

  /**
   * 3. Check Account Status
   */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "Both account must be active for transaction",
    });
  }

  /**
   * 4. Drive Sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient Balance. Current Balance is ${balance}.`,
    });
  }

  /**
   * 5. Create transaction
   */

  let transaction;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    return res.status(400).json({
        message:"Transaction was Pending due to some issue, try after some time"
    })
  }

  /**
   * 10. Send Email Notification
   */

  await emailServices.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  return res.status(201).json({
    message: "Transaction Completed Successfully",
    transaction: transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount, idempotency Key is required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System User Not Found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial Funds Transaction Completed Successfuly",
    transaction: transaction,
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
