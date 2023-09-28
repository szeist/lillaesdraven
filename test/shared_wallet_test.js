const SharedWallet = artifacts.require("SharedWallet");

contract("SharedWallet", (accounts) => {
    let sharedWallet;
    const [wife, husband, recipient, otherAccount] = accounts;
    const depositAmount = web3.utils.toWei('1', 'ether');
    const transferAmount = web3.utils.toWei('0.5', 'ether');

    beforeEach(async () => {
        sharedWallet = await SharedWallet.new(wife, husband);
        await sharedWallet.deposit({ from: wife, value: depositAmount });
    });

    it("should allow deposits from the shared wallet", async () => {
        const balance = await web3.eth.getBalance(sharedWallet.address);
        assert.equal(balance, depositAmount, "Deposit was not successful");
    });

    it("should allow externals to deposit to the shared wallet", async () => {
        const initialBalance = await web3.eth.getBalance(sharedWallet.address);
        await sharedWallet.deposit({ from: otherAccount, value: depositAmount });
        const finalBalance = await web3.eth.getBalance(sharedWallet.address);
        const difference = BigInt(finalBalance) - BigInt(initialBalance);
        assert.equal(difference.toString(), depositAmount, "External deposit was not successful");
    });

    it("should allow wife to initiate a transfer", async () => {
        await sharedWallet.initiateTransfer(recipient, transferAmount, { from: wife });
        const pendingAmount = await sharedWallet.pendingAmount();
        assert.equal(pendingAmount, transferAmount, "Wife could not initiate a transfer");
    });

    it("should allow husband to initiate a transfer", async () => {
        await sharedWallet.initiateTransfer(recipient, transferAmount, { from: husband });
        const pendingAmount = await sharedWallet.pendingAmount();
        assert.equal(pendingAmount, transferAmount, "Husband could not initiate a transfer");
    });

    it("should not allow non-spouses to initiate a transfer", async () => {
        try {
            await sharedWallet.initiateTransfer(recipient, transferAmount, { from: otherAccount });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("Not an authorized party"), "Expected 'Not an authorized party' but got another error");
        }
    });

    it("should allow husband to approve the transfer initiated by wife", async () => {
      const initialRecipientBalance = await web3.eth.getBalance(recipient);
      await sharedWallet.initiateTransfer(recipient, transferAmount, { from: wife });
      await sharedWallet.approveTransfer({ from: husband });
      const finalRecipientBalance = await web3.eth.getBalance(recipient);
      const difference = BigInt(finalRecipientBalance) - BigInt(initialRecipientBalance);
      assert.equal(difference.toString(), transferAmount, "Huband could not approve a transfer initiated by wife");
    });

    it("should allow wife to approve the transfer initiated by husband", async () => {
      const initialRecipientBalance = await web3.eth.getBalance(recipient);
      await sharedWallet.initiateTransfer(recipient, transferAmount, { from: husband });
      await sharedWallet.approveTransfer({ from: wife });
      const finalRecipientBalance = await web3.eth.getBalance(recipient);
      const difference = BigInt(finalRecipientBalance) - BigInt(initialRecipientBalance);
      assert.equal(difference.toString(), transferAmount, "Wife could not approve a transfer initiated by husband");
    });

    it("should not allow the initiator to approve their own transfer", async () => {
        await sharedWallet.initiateTransfer(recipient, transferAmount, { from: wife });
        try {
            await sharedWallet.approveTransfer({ from: wife });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("Cannot approve your own transaction"), "Expected 'Cannot approve your own transaction' but got another error");
        }
    });

    it("should allow husband to cancel a transfer", async () => {
        await sharedWallet.initiateTransfer(recipient, transferAmount, { from: wife });
        await sharedWallet.cancelTransfer({ from: husband });
        const pendingAmount = await sharedWallet.pendingAmount();
        assert.equal(pendingAmount, '0', "Husband could not cancel a transfer");
    });

    it("should allow wife to cancel a transfer", async () => {
        await sharedWallet.initiateTransfer(recipient, transferAmount, { from: husband });
        await sharedWallet.cancelTransfer({ from: wife });
        const pendingAmount = await sharedWallet.pendingAmount();
        assert.equal(pendingAmount, '0', "Wife could not cancel a transfer");
    });

    it("should not allow non-spouses to cancel a transfer", async () => {
        await sharedWallet.initiateTransfer(recipient, transferAmount, { from: wife });
        try {
            await sharedWallet.cancelTransfer({ from: recipient });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("Not an authorized party"), "Expected 'Not an authorized party' but got another error");
        }
    });

    it("should not allow initiating a transfer if another is pending", async () => {
        await sharedWallet.initiateTransfer(recipient, transferAmount, { from: wife });
        try {
            await sharedWallet.initiateTransfer(recipient, transferAmount, { from: husband });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("Another transaction is pending"), "Expected 'Another transaction is pending' but got another error");
        }
    });

    it("should not allow initiating a transfer if insufficient funds", async () => {
        const largeAmount = web3.utils.toWei('10', 'ether');
        try {
            await sharedWallet.initiateTransfer(recipient, largeAmount, { from: wife });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("Insufficient funds"), "Expected 'Insufficient funds' but got another error");
        }
    });
});

