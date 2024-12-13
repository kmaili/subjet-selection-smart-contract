const SubjectSelector = artifacts.require("SubjectSelector");

module.exports = function (deployer) {
    deployer.deploy(SubjectSelector);
};