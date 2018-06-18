const cluster = require('cluster');
const args = require('yargs').argv;
const testType = args.testType;
// const numCPUs = require('os').cpus().length;
const numCPUs = 1;
const DURING = 600000;
const REQUEST_PER_SECOND_PER_CORE = 8;
const test = require('./run-test-performance');

function ClusterTest() {
    let filePathArray = [];
    this.runCluster = function (during, requestPerSecondPerCore) {

        //Worker's job
        if (cluster.isWorker) {
            console.log('Worker ' + process.pid + ' has started.');
            if (testType == 'sendData' || testType == 'sendFile' ) {
                test.runTest(during, requestPerSecondPerCore, process.pid, null);
            }

            if (testType == 'deleteData' || testType == 'deleteFile') {

                // Receive messages from the master process.
                process.on('message', function (msg) {
                    console.log('Worker ' + process.pid + ' received message from master.', msg);
                test.runTest(during, requestPerSecondPerCore, process.pid, msg);
                    
                });
            }
            
        }

        //Master's job
        if (cluster.isMaster) {
            console.log('Master ' + process.pid + ' has started.');

            //Test sendData or sendFile
            if (testType == 'sendData' || testType == 'sendFile') {
                for (let i = 0; i < numCPUs; i++) {
                    let worker = cluster.fork();

                }
            }

            //Test deleteData or deleteFile
            if (testType == 'deleteData' || testType == 'deleteFile') {
                test.getAllFilePathsInFolder('./asset/output_result').then((filePathArray) => {
                    // Fork workers.
                    for (let i = 0; i < numCPUs; i++) {
                        let worker = cluster.fork();

                        // Send a message from the master process to the worker.
                        worker.send(filePathArray[i]);


                    }

                })

            }
        }
    }
}

module.exports = new ClusterTest();

let clusterTest = require('./cluster')
clusterTest.runCluster(DURING, REQUEST_PER_SECOND_PER_CORE);




