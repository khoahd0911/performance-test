pragma solidity ^0.4.17;
import "../node_modules/zcom-contracts/contracts/VersionContract.sol";
import "./TestPerformanceContract.sol";
import "./TestPerformanceContractLogic_v1.sol";

contract TestPerformanceContract_v1 is VersionContract, TestPerformanceContract  {
    TestPerformanceContractLogic_v1 public logic_v1;
    uint constant TIMESTAMP_RANGE = 600;
    mapping(address => bool) allowUsers;

    function TestPerformanceContract_v1(ContractNameService _cns, TestPerformanceContractLogic_v1 _logic_v1) public VersionContract(_cns, CONTRACT_NAME) {
        logic_v1 = _logic_v1;
    }


    function call() public view returns (string) {
        return "HELLO";
    }

    function sendTransaction(bytes _sign, bytes32 _symbol, bytes32 _name) public {
        // create all parameters hash
        bytes32 hash = calcEnvHash("sendTransaction");
        hash = keccak256(abi.encodePacked(hash, _symbol));
        hash = keccak256(abi.encodePacked(hash, _name));
        // get end user's addresss
        address endUserAddr = Utils.recoverAddress(hash, _sign);

        logic_v1.sendTransaction(endUserAddr, _symbol, _name);   
    }
   
    function sendData(bytes _sign, bytes32 _objectId, bytes32 _dataHash, bytes32 _name) public {
        // create all parameters hash
        bytes32 hash = calcEnvHash("sendData");
        hash = keccak256(abi.encodePacked(hash, _objectId));
        hash = keccak256(abi.encodePacked(hash, _dataHash));
        hash = keccak256(abi.encodePacked(hash, _name));
       
        address from = recoverAddress(hash, _sign);
        logic_v1.sendData(from, _objectId, _dataHash);
    }
    function getData(bytes32 _id) public view returns (bytes32) {
        return logic_v1.getData(bytes32(_id));
    }

    function deleteData(bytes _sign, bytes32 _objectId, bytes32 _params1) public {
        logic_v1.deleteData(_objectId);
    }

    function sendFile(bytes _sign, bytes32 _objectId, bytes32 _fileNameHash, bytes32 _dataHash, bytes32 _name) public {
        // create all parameters hash
        bytes32 hash = calcEnvHash("sendFile");
        hash = keccak256(abi.encodePacked(hash, _objectId));
        hash = keccak256(abi.encodePacked(hash, _fileNameHash));
        hash = keccak256(abi.encodePacked(hash, _dataHash));
        hash = keccak256(abi.encodePacked(hash, _name));
       
        address from = recoverAddress(hash, _sign);
        logic_v1.sendFile(from, _fileNameHash, _objectId, _dataHash);
    }

    function getFile(bytes32  _id) public view returns (bytes32) {
        return logic_v1.getFile(bytes32(_id));
    }

    function deleteFile(bytes _sign, bytes32 _objectId, bytes32 _params1) public {
        logic_v1.deleteFile(_objectId);
    }
}