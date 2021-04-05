const chalk = require('chalk');

module.exports = {
    errorExitMessage(err) {
        console.log(chalk.red(err));
        process.exit(1);
    },
};
