const {PythonShell} = require("python-shell");


const nextJobOrder = async( previousJobNumber) => {
    return new Promise((resolve, reject) => {
        let options = {
            mode: 'text',
            pythonOptions: ['-u'],
            args: [previousJobNumber]
        };

        PythonShell.run('job_num_generator.py', options)
            .then((result) => {
                resolve(result[0]); // Resolve the promise with result[0]
            })
            .catch((err) => {
                reject(err); // Reject the promise if there's an error
            });
    })

}

const renderJobNumbers = async( jobNumberLists) => {


    return new Promise((resolve, reject) => {
        let options = {
            mode: 'text',
            pythonOptions: ['-u'],
            args: [jobNumberLists]
        };

        PythonShell.run('render_job_code.py', options)
            .then((result) => {
                const correctArray = result[0].slice(1, result[0].length-1).split(",")
                console.log(correctArray);
                resolve(correctArray); // Resolve the promise with result[0]
            })
            .catch((err) => {
                reject(err); // Reject the promise if there's an error
            });
    })

}


module.exports = {
    nextJobOrder,
    renderJobNumbers
};