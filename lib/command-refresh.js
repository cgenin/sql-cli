const chalk = require('chalk');
const {
    map,
} = require('rxjs/operators');
const repositoryManager = require('./repository-manager');
const { errorExitMessage } = require('./processus');

module.exports = {
    refresh() {
        repositoryManager.createRootDirectory()
            .pipe(
                map((r) => {
                    console.log(`Create Directory : "${chalk.blue(r)}"`);
                    return r;
                }),
                repositoryManager.clone(),
                map((r) => {
                    console.log(`Clone file in "${chalk.blue(r)}"`);
                    return r;
                }),
                repositoryManager.copyDatasFiles(),
                map(({ destination }) => {
                    console.log(`Copy datas to "${chalk.blue(destination)}"`);
                    return destination;
                }),
                repositoryManager.removeClonePath(),
                map((v) => {
                    console.log(`Remove directory to "${chalk.blue(v)}"`);
                    return v;
                }),
            )
            .subscribe(() => console.log('It\'s 👌. Your repository is 🆗'), errorExitMessage);
    },
};
