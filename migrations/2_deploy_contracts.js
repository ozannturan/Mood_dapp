const Mood = artifacts.require("Mood");

module.exports = function(deployer) {
    deployer.deploy(Mood);
};
