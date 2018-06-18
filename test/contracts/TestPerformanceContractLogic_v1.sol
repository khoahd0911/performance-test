pragma solidity ^0.4.17;

import "../node_modules/zcom-contracts/contracts/VersionLogic.sol";
import "../node_modules/zcom-contracts/contracts/DataObject.sol";
import "../node_modules/zcom-contracts/contracts/FileObject.sol";
import "./TestPerformanceContract.sol";
import "./TestPerformanceContract_v1.sol";

contract TestPerformanceContractLogic_v1 is VersionLogic, TestPerformanceContract {
    ContractNameService gmoCns;
    
    /* ----------- for migration ----------------- */
    function TestPerformanceContractLogic_v1(ContractNameService _cns, ContractNameService _gmoCns) public VersionLogic (_cns, CONTRACT_NAME) {
        gmoCns = _gmoCns;
    }

    function call() public view returns (bytes32) {
        return "Call method testing.";
    }
    
    function sendTransaction(address _caller, bytes32 _symbol, bytes32 _name) public onlyByVersionContractOrLogic {
       //todo something
    }

    function sendData(address _from,  bytes32 _objectId, bytes32 _dataHash) public onlyByVersionContractOrLogic {
    	DataObject dataObject = DataObject(gmoCns.getLatestContract("DataObject"));
        dataObject.create(_objectId, _from, _dataHash, cns, "TestPerformanceContract");     
    }

    function deleteData(bytes32 _objectId) public onlyByVersionContractOrLogic {
        DataObject obj = DataObject(gmoCns.getLatestContract("DataObject"));
        obj.remove(_objectId);
    }

    function getData(bytes32 _id) public view returns (bytes32) {
        return _id;
    }

    function sendFile (address _from, bytes32 _fileNameHash, bytes32 _objectId, bytes32 _dataHash) public onlyByVersionContractOrLogic {
    	FileObject fileObject = FileObject (gmoCns.getLatestContract("FileObject"));
        fileObject.create(_objectId, _from, _fileNameHash, _dataHash, cns, "TestPerformanceContract");     
    }

    function getFile(bytes32 _id) public view returns (bytes32) {
        return _id;
    }

    function deleteFile(bytes32 _objectId) public {
        FileObject obj = FileObject(gmoCns.getLatestContract("FileObject"));
        obj.remove(_objectId);
    }
} 