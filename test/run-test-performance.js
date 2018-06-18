const Promise = require('bluebird');
const math = require('mathjs');
const todo = require('./test-performance');
const fs = Promise.promisifyAll(require('fs'));
const average = require('average');
const nodeXlsx = require('node-xlsx');
const cluster = require('cluster');
const args = require('yargs').argv;
const testType = args.testType;

const INTERVAL = 1000;
let countRequest = 0;
let beginTime;
let executionTimes = [];
let dataExcel = [];
let outputFilePath = "";
let objectIds = [];
let errors = [];

//Makes sure the test takes a time that we defined
function condition(beginTime, during) {
    const setTime = beginTime + during;
    return setTime > Date.now();
}

//call sendData or deleteData or sendFile or deleteFile based on parameter in the command line
let loop = Promise.coroutine(function* (during, objectIds) {

    while (condition(beginTime, during)) {

        const startTime = Date.now();

        if (testType == 'sendData') {
            try {
                yield todo.sendData();
            }
            catch (err) {
                console.error(err);
                errors.push(err.message);
            }
        }

        if (testType == 'deleteData') {
            currentObjectId = objectIds.shift();
            if (currentObjectId != null) {
                try {
                    yield todo.deleteData(currentObjectId)
                } catch (err) {
                    errors.push(err.message);
                }
            }
        }

        if (testType == 'sendFile') {
            try {
                yield todo.sendFile()
            } catch (err) {
                errors.push(err.message);
            }
        }

        if (testType == 'deleteFile') {
            currentObjectId = objectIds.shift();
            if (currentObjectId != null) {
                try {
                    yield todo.deleteFile(currentObjectId)
                } catch (err) {
                    errors.push(err.message);
                }
            }
        }

        countRequest = countRequest + 1;
        const executionTime = Date.now() - startTime;

        executionTimes.push(executionTime);

        const sleep = Math.max(0, INTERVAL - executionTime);
        console.log(`${countRequest}: ${executionTime}: ${sleep}`);
        let arrTemp = [`${countRequest}`, `${executionTime}`, `${sleep}`];
        dataExcel.push(arrTemp);

        yield Promise.delay(sleep);
    }
});

function sendTestRequest(during, requestPerSecondPerCore, processId, inputFileName) {
    let loops = [];

    //setup output file path and data
    if (testType == 'sendData') {
        outputFilePath = "./asset/output_result/test_sendData_" + processId;
    }

    if (testType == 'sendFile') {
        outputFilePath = "./asset/output_result/test_sendFile_" + processId;
    }

    if (testType == 'deleteData') {
        outputFilePath = "./asset/output_result/test_deleteData_" + processId;
        inputFilePath = "./asset/output_result/" + inputFileName;
        let rawData = fs.readFileSync(inputFilePath);
        objectIds = JSON.parse(rawData);
    }

    if (testType == 'deleteFile') {
        outputFilePath = "./asset/output_result/test_deleteFile_" + processId;
        inputFilePath = "./asset/output_result/" + inputFileName;
        let rawData = fs.readFileSync(inputFilePath);
        objectIds = JSON.parse(rawData);
    }

    //send request
    for (let i = 1; i <= requestPerSecondPerCore; i++) {
        loops.push(loop(during, objectIds));
    }

    return Promise.all(loops);
}

function makeReport(during, requestPerSecondPerCore, startTestTime) {
    // let reportPromiseArray = [];
    let result = [];
    let latencyAvg = average(executionTimes);
    let latencyMax = Math.max.apply(Math, executionTimes);
    console.log('-----------------end loop----------------');
    console.log('during :', during);
    console.log('requestPerSecondPerCore :', requestPerSecondPerCore);
    console.log('-------------------結果------------------');
    console.log('total_request:', countRequest);
    const times = Date.now() - beginTime;
    console.log('かかった時間 : ', times);
    console.log(`latency(avg) : ${latencyAvg} ms`);
    console.log(`latency(max) : ${latencyMax} ms`);
    console.log('total_latency  : ', math.sum(executionTimes));
    const endTestTime = new Date().toUTCString();
    console.log(`試験の終了時間 : ${endTestTime} `);

    result.push(['シート名', 'during', 'requestPerSecondPerCore', 'total_request', 'かかった時間', 'latency(avg)', 'latency(max)', '開始時間UTC', '終了時間',]);
    result.push([testType + requestPerSecondPerCore, during, requestPerSecondPerCore, countRequest, times, latencyAvg, latencyMax, startTestTime, endTestTime]);

    let buffer = nodeXlsx.build([
        { name: `log_executionTime_${requestPerSecondPerCore}`, data: dataExcel },
        { name: `試験の結果_${requestPerSecondPerCore}`, data: result }
    ]);

    // excel
    peformancePromise = fs.writeFileAsync(`${outputFilePath}_${requestPerSecondPerCore}.xlsx`, buffer);
    // json
    objecIdPromise = fs.writeFileAsync(`${outputFilePath}_${requestPerSecondPerCore}.json`, JSON.stringify(todo.dataObjectId));

    // error log
    errorPromise = fs.writeFileAsync(`${outputFilePath}_${requestPerSecondPerCore}_errors_log.txt`, JSON.stringify(errors));

    return Promise.all([peformancePromise, objecIdPromise, errorPromise]);
}

function Test() {

    this.runTest = function (during, requestPerSecondPerCore, processId, inputFileName) {
        const startTestTime = new Date().toUTCString();
        console.log(`試験の開始時間 : ${startTestTime} `);
        let arrHeaderTitle = ['total_request', 'latency', 'sleep'];
        dataExcel.push(arrHeaderTitle);
        beginTime = Date.now();

        //Send request to test
        sendTestRequest(during, requestPerSecondPerCore, processId, inputFileName)
            .then(() => {
                console.log('SENDING REQUEST HAS DONE!');
                makeReport(during, requestPerSecondPerCore, startTestTime)
                    .then(() => {
                        console.log('MAKING REPORT HAS DONE!');
                        process.exit(0);
                    }).catch((err) => {
                        console.error('madeReport HAS FAILED: ', err);
                        errors.push(err.message);
                        process.exit(1);
                    });
            });
    }

    //Get all input file path to test deleteData or deleteFile
    this.getAllFilePathsInFolder = function (folderName) {
        return new Promise((resolve, reject) => {
            let filePathArray = [];
            fs.readdirAsync(folderName).then((files) => {
                files.forEach((file) => {

                    //deleteData
                    if (testType == 'deleteData') {
                        //add json file paths into array
                        if (file.endsWith('.json') && file.startsWith('test_sendData')) {
                            // console.log(file);
                            filePathArray.push(file);
                            // console.log(filePathArray);
                        }
                    }

                    //deleteFile
                    if (testType == 'deleteFile') {
                        //add json file paths into array
                        if (file.endsWith('.json')) {
                            filePathArray.push(file);
                        }
                    }
                    // console.log(filePathArray);
                    resolve(filePathArray);
                })
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
}

module.exports = new Test();
