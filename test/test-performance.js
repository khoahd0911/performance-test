const ethClient = require('eth-client');
const Promise = require('bluebird');

const cnsAddress = '0x2e6f2d8f7aa492c47135bd59da893ed30c31cbaa';
const baseUrl = 'https://stg.zcom.thing-chain.site/';
const abi = [{ "constant": true, "inputs": [], "name": "provider", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isVersionContract", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isVersionLogic", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contractName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "logic_v1", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isVersionContractOrLogic", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cns", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getContractName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCns", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_cns", "type": "address" }, { "name": "_logic_v1", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [], "name": "call", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sign", "type": "bytes" }, { "name": "_symbol", "type": "bytes32" }, { "name": "_name", "type": "bytes32" }], "name": "sendTransaction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sign", "type": "bytes" }, { "name": "_objectId", "type": "bytes32" }, { "name": "_dataHash", "type": "bytes32" }, { "name": "_name", "type": "bytes32" }], "name": "sendData", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "bytes32" }], "name": "getData", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sign", "type": "bytes" }, { "name": "_objectId", "type": "bytes32" }, { "name": "_params1", "type": "bytes32" }], "name": "deleteData", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sign", "type": "bytes" }, { "name": "_objectId", "type": "bytes32" }, { "name": "_fileNameHash", "type": "bytes32" }, { "name": "_dataHash", "type": "bytes32" }, { "name": "_name", "type": "bytes32" }], "name": "sendFile", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "bytes32" }], "name": "getFile", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sign", "type": "bytes" }, { "name": "_objectId", "type": "bytes32" }, { "name": "_params1", "type": "bytes32" }], "name": "deleteFile", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
const password = "co19vxks";
const account = "{\"keystore\":\"{\\\"encSeed\\\":{\\\"encStr\\\":\\\"oXzxf0g7R4yyEMi7THYEYh7LG+0tNb5lvchkIMxeqbRdNfjDlf+fwKmEFW8RSW24i7EcY9fdGHN0IBqgs9XBzGEY+DanT0kW1w85qgy+K+H3G4SccxCbHZHwdSp9q7KBMFYSBI7dBBoJ8mVf6KKANhFpAhVjOVCsSkZBXCAgiuHHkNtn8Jh32Q==\\\",\\\"nonce\\\":\\\"B8UjbTVhoQSMrBlCi2NRCK/2Zwj+HFR6\\\"},\\\"ksData\\\":{\\\"m/0'/0'/0'\\\":{\\\"info\\\":{\\\"curve\\\":\\\"secp256k1\\\",\\\"purpose\\\":\\\"sign\\\"},\\\"encHdPathPriv\\\":{\\\"encStr\\\":\\\"u/OWOFARoh57d52tAM7q0vreyJ6q+KazcuqSuxJoQDLGYod4Z75woiYixxmsZe9xj32CTBedAhgFmydO0wmAhKe9aMKRuz1mupA5DeRo0lt4sewqQMe3MoLMjYY3iemIKDBoeHMdemdeHv86oKKuDKwbHfrSmDpixHU/BNBJsA==\\\",\\\"nonce\\\":\\\"LAxFhbqQBmSBzSC8tuhe1XULCkTHJ+Vz\\\"},\\\"hdIndex\\\":1,\\\"encPrivKeys\\\":{\\\"a558f4164de4618f6f98bdd9e39220f7d878ecea\\\":{\\\"key\\\":\\\"TJyvqgV7FYOKjGc3+XJK0DBx7D/p4pbUmGrvhYaYun/h2Mfv2bP0YymT4CrgqaOg\\\",\\\"nonce\\\":\\\"Xu8MJ33gXIJBL6J4BScXg7H4iUq9bjNN\\\"}},\\\"addresses\\\":[\\\"a558f4164de4618f6f98bdd9e39220f7d878ecea\\\"]}},\\\"encHdRootPriv\\\":{\\\"encStr\\\":\\\"+QYWLuyGu1rCWcJVCjVDDo5XCR/WFYCm2nGHZ0OKDh+s17hRqF3KZs36/A7trtdeVuv9PqG0fgbtd3Xq0h25NNev1Upwh80LNsxugRMwMt46YcoY9Smr3ZkGK3gXQW6TxDeZfd/senCvWAcZXwINJGPnrvo3wiuiegG5T9dGqg==\\\",\\\"nonce\\\":\\\"nYeOW1NQeVAVqykXMxLp7/2uiElBUBcL\\\"},\\\"salt\\\":\\\"2cMabI+M9zgFeDxJwRVKWcYhYj0ADAAIwjO5P9TjzHs=\\\",\\\"version\\\":2}\",\"baseUrl\":\"https://stg.zcom.thing-chain.site\"}"
let dataObjectIds = [];

const createRandBytes32 = function (len) {
    return '0x' + require('crypto').randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len);   // return required number of characters
};

function Todo() {

    this.create = function () {
        const create = Promise.promisify(ethClient.Account.create);
        return create(baseUrl, password).then(function (response) {
        });
    }

    this.sendData = function () {
        let objectID = createRandBytes32(64);

        const contract = new ethClient.AltExecCnsContract(ethClient.Account.deserialize(account), cnsAddress);

        return new Promise(function (resolve, reject) {
            contract.sendData(password, 'TestPerformanceContract', 'sendData', objectID, 'sendDataContent', ['parameter1'], abi, function (err, txHash) {
                if (err) {
                    // console.error('Error : ', err);
                    reject(err);

                } else {
                    console.log('sendData result : ', txHash);
                    dataObjectIds.push(objectID);
                    resolve(txHash);
                }
            });
        });
    }

    this.deleteData = function (id) {
        const contract = new ethClient.AltExecCnsContract(ethClient.Account.deserialize(account), cnsAddress);

        return new Promise(function (resolve, reject) {
            contract.deleteData(password, 'TestPerformanceContract', 'deleteData', id, ['parameter1'], abi, function (err, txHash) {
                if (err) {
                    // console.error('Error : ', err);
                    reject(err);

                } else {
                    console.log('deleteData result : ', txHash);
                    dataObjectIds.push(id);
                    resolve(txHash);

                }
            });
        });
    }

    this.sendFile = function () {
        const contract = new ethClient.AltExecCnsContract(ethClient.Account.deserialize(account), cnsAddress);

        let objectID = createRandBytes32(64);
        const pathFile = './asset/Example_file.txt';

        return new Promise(function (resolve, reject) {
            contract.sendFile(password, 'TestPerformanceContract', 'sendFile', objectID, 'fileName', pathFile, ['parameter1'], abi, function (err, txHash) {
                if (err) {
                    reject(err);
                    // console.log('error : ', err);
                } else {
                    resolve(txHash);
                    dataObjectIds.push(objectID);
                    console.log('txHash : ', txHash);
                }
            });
        });
    }

    this.deleteFile = function (id) {
        const contract = new ethClient.AltExecCnsContract(ethClient.Account.deserialize(account), cnsAddress);

        return new Promise((resolve, reject) => {
            contract.deleteFile(password, 'TestPerformanceContract', 'deleteFile', id, ['param1'], abi, function (err, txHash) {
                if (err) {
                    reject(err);
                    // console.error(err);
                }
                else {
                    resolve(txHash);
                    dataObjectIds.push(id);
                    console.log('txHash :', txHash);
                }
            })
        });
    }

    this.dataObjectId = dataObjectIds;
}

module.exports = new Todo();

