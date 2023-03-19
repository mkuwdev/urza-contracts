// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable reason-string */

import "./BasePaymaster.sol";

contract Paymaster is BasePaymaster {

    using UserOperationLib for UserOperation;

    //calculated cost of the postOp
    uint256 constant public COST_OF_POST = 35000;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public unlockBlock;

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {
        // owner account is unblocked, to allow withdraw of paid ETH;
        unlockEthDeposit();
    }

    /**
     * deposit ETH that a specific account can use to pay for gas.
     * The ETH is only withdrawn in this method if the user didn't approve() the paymaster,
     * or if the ETH balance is not enough.
     * The deposit is equivalent to transferring the ETH to the "account" - only the account
     * can later use them - either as gas, or using withdrawTo()
     * Note: The required deposit is to cover just one method call.
     */
    function addDeposit() external payable {
        balances[msg.sender] += msg.value;
        if (msg.sender == owner()) {
            lockEthDeposit();
        }
    }

    /**
     * @return amount - the amount of ETH deposited to the Paymaster.
     * @return _unlockBlock - the block height at which the deposit can be withdrawn.
     */
    function depositInfo(address account) public view returns (uint256 amount, uint256 _unlockBlock) {
        amount = balances[account];
        _unlockBlock = unlockBlock[account];
    }

    /**
     * unlock deposit, so that it can be withdrawn.
     * can't be called in the same block as withdrawTo()
     */
    function unlockEthDeposit() public {
        unlockBlock[msg.sender] = block.number;
    }

    /**
     * lock the ETH deposited for this account so they can be used to pay for gas.
     * after calling unlockEthDeposit(), the account can't use this paymaster until the deposit is locked.
     */
    function lockEthDeposit() public {
        unlockBlock[msg.sender] = 0;
    }

    /**
     * withdraw ETH.
     * can only be called after unlock() is called in a previous block.
     * @param target address to send to
     * @param amount amount to withdraw
     */
    function withdrawEthTo(address payable target, uint256 amount) public {
        require(unlockBlock[msg.sender] != 0 && block.number > unlockBlock[msg.sender], "DepositPaymaster: must unlockEthDeposit");
        balances[msg.sender] -= amount;
        target.transfer(amount);
    }

    /**
    * Validate the request:
    * The sender should have enough deposit to pay the max possible cost.
    * Note that the sender's balance is not checked. If it fails to pay from its balance,
    * this deposit will be used to compensate the paymaster for the transaction.
    * Only ETH payments are accepted.
    */
    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
    internal view override returns (bytes memory context, uint256 validationData) {

        (userOp, userOpHash); // unused parameters
        require(userOp.paymasterAndData.length == 0, "DepositPaymaster: unexpected paymaster data");
        require(msg.value >= maxCost, "DepositPaymaster: insufficient payment for user op");
        return ("", 0);
    }

    /**
    * perform the post-operation to charge the sender for the gas.
    * Since this paymaster only pays in ETH, the user must have sent enough ETH to cover the gas cost.
    * If not, the transaction will revert.
    * The actual gas cost is sent to the owner of the paymaster as payment.
    */
    function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) internal override {
        (mode, context); // unused parameter
        
        // The user must have sent enough ETH to cover the gas cost, so no further validation is needed
        // The actual gas cost is sent to the owner of the paymaster as payment
        payable(owner()).transfer(actualGasCost);
    }
}
