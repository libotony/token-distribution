var Distribution = artifacts.require("./Distribution.sol");
var MockToken = artifacts.require("./MockToken.sol");

const assertRevert = async promise => {
  try {
    await promise;
    assert.fail('Expected revert not received');
  } catch (error) {
    const revertFound = error.message.search('revert') >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
}

contract('Distribution', function (accounts) {
  let token;
  let distribution;

  beforeEach(async function () {
    token = await MockToken.new();
  });

  it('deploy contracts', async function () {
    distribution = await Distribution.new();

    console.log("distribution address=\t" + distribution.address)
  });

  it('should throw an error when input two array with different length',async function () {
    assertRevert(distribution.distribute(token.address, accounts[0], [accounts[0]], []));
  });

  it('should throw an error when input two array with more than 150 elements', async function () {
    assertRevert(distribution.distribute(token.address, accounts[0], [].fill.call(new Array(151), accounts[0]), [].fill.call(new Array(151), 0)));
  });

  it('should return correct balance after distribute', async function () {
    await token.approve(distribution.address, 100);
    let allowance = await token.allowance(accounts[0], distribution.address);
    await distribution.distribute(token.address, accounts[0], [accounts[1]], [100]);
    let balance0 = await token.balanceOf(accounts[1]);
    let allowanceAfter = await token.allowance(accounts[0], distribution.address);
    assert.equal(balance0, 100);
    assert.equal(allowance, 100);
    assert.equal(allowanceAfter, 0);
  });

  it('should return correct balance after distribute 100 times', async function () {
    await token.approve(distribution.address, 100);
    let allowance = await token.allowance(accounts[0], distribution.address);
    await distribution.distribute(token.address, accounts[0], [].fill.call(new Array(100), accounts[1]), [].fill.call(new Array(100), 1));
    let balance0 = await token.balanceOf(accounts[1]);
    let allowanceAfter = await token.allowance(accounts[0], distribution.address);
    assert.equal(balance0, 100);
    assert.equal(allowance, 100);
    assert.equal(allowanceAfter, 0);
  });
  
  it('should throw an error when there is not enough approved balance', async function () {
    await token.approve(distribution.address, 100);
    let allowance = await token.allowance(accounts[0], distribution.address);
    assertRevert(distribution.distribute(token.address, accounts[0], [].fill.call(new Array(101), accounts[1]), [].fill.call(new Array(101), 1)));
    let balance0 = await token.balanceOf(accounts[1]);
    let allowanceAfter = await token.allowance(accounts[0], distribution.address);
    assert.equal(balance0, 0);
    assert.equal(allowance, 100);
    assert.equal(allowanceAfter, 100);
  });
  
});