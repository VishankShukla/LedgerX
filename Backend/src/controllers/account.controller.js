const accountModel = require("../Models/account.model");
const userModel = require("../Models/user.model");

async function accountCreateController(req, res) {
  const user = req.user;

  const activeAccount = user.activeAccount;

  if (activeAccount >= 3) {
    return res.status(403).json({
      message: "Limit Exits for Createing Account, Contact us",
    });
  }

  const account = await accountModel.create({
    user: user._id,
  });

  await userModel.updateOne({ _id: user._id }, { $inc: { activeAccount: 1 } });

  res.status(201).json({
    account,
  });
}

async function getUserAccountsController(req, res) {
  const accounts = await accountModel.find({ user: req.user._id });

  return res.status(200).json({
    accounts,
  });
}

async function getAccountBalanceController(req, res) {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account Not Found",
    });
  }

  const balance = await account.getBalance();

  return res.status(200).json({
    accountId: account._id,
    balance: balance,
  });
}

module.exports = {
  accountCreateController,
  getUserAccountsController,
  getAccountBalanceController,
};
