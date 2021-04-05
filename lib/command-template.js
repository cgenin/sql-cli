const chalk = require('chalk');
const inquirer = require('inquirer');
const {
    from, Observable,
} = require('rxjs');
const {
    map, mergeMap,
} = require('rxjs/operators');
const { errorExitMessage } = require('./processus');
const { TemplateManager, } = require('./template');

module.exports = {
    ls() {
        new TemplateManager()
            .getTemplates()
            .subscribe(
                (value) => {
                    console.log(chalk.green(`- ${value}`));
                }, errorExitMessage,
            );
    },
    create() {
        const templateManager = new TemplateManager();
        templateManager
            .getSourceScript()
            .pipe(
                mergeMap((choices) => new Observable((subscriber) => inquirer.prompt([{
                    type: 'checkbox',
                    message: 'Select toppings',
                    name: 'selectedScript',
                    choices,
                }])
                    .then((e) => subscriber.next(e.selectedScript))
                    .catch((err) => subscriber.error(err))
                    .finally(() => subscriber.complete()))),
                mergeMap((arr) => from(arr)),
                map((selectedItem) => {
                    console.log(`Create file "${chalk.blue(selectedItem)}"`);
                    return selectedItem;
                }),
                templateManager.createSqlFile(),
                templateManager.createRollbackFile(),
                map(({ selectedItem, created }) => {
                    if (created) {
                        console.log(`Create rollback file ${chalk.blue(selectedItem)}`);
                    }
                    return selectedItem;
                }),
            )
            .subscribe(
                (value) => {
                    console.log(chalk.green(`- created "${value}" in current directory`));
                }, errorExitMessage,
            );
    },
};
