const accountModel = require("../Models/account.model");
const transactionModel = require("../Models/transaction.model");

async function getAccountTransactionHistory(req,res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id : accountId,
        user : req.user._id
    });

    if(!account){
        return res.status(404).json({
            message:"Account Not Found"
        })
    }

    const transaction = await transactionModel.find({
        $or:[
            {toAccount : accountId},
            {fromAccount : accountId}
        ]
    }).sort({createdAt : -1});

    return res.status(200).json({
        accountId: account._id,
        totalTransaction : transaction.length,
        transaction
    })
}

module.exports = {
    getAccountTransactionHistory
}