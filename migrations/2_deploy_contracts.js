var Distribution = artifacts.require("./Distribution.sol");
var MockToken = artifacts.require("./MockToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Distribution);
  deployer.deploy(MockToken);
};
