const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { bindNodeCallback, from, Observable, throwError } = require('rxjs');
const inquirer = require('inquirer');
const { mergeMap, map, reduce, filter } = require('rxjs/operators');
const { errorExitMessage } = require('./processus');

const sqlCliHomeTemplatesDirectory = path.join(require('os').homedir(), '.sql-cli', 'templates');
const templatesFolder = (process.env.NODE_ENV === 'developpement') ? './test/templates' : sqlCliHomeTemplatesDirectory;

const getTemplates = function () {
    const b = fs.existsSync(templatesFolder);
    if (!b) {
        return throwError(new Error('Repository not initialised. Please call command "refresh"'));

    }
    return bindNodeCallback(fs.readdir)(templatesFolder)
        .pipe(
            mergeMap(arr => from(arr)),
            filter(v => v.indexOf('rollback') === -1),
            map(v => v.replace('.sql', '')),
            map(v => v.replace('_', ' '))
        );
}


module.exports = {
    ls() {
        getTemplates()
            .subscribe(
                value => {
                    console.log(chalk.green(`- ${value}`));
                }, errorExitMessage
            );
    },
    create() {
        getTemplates()
            .pipe(
                map(name => ({ name })),
                reduce((acc, v) => [...acc, v], []),
                mergeMap(choices => {
                    return new Observable(subscriber => inquirer.prompt([{
                            type: 'checkbox',
                            message: 'Select toppings',
                            name: 'selectedScript',
                            choices
                        }])
                            .then(e => subscriber.next(e.selectedScript))
                            .catch(err => subscriber.error(err))
                            .finally(() => subscriber.complete())
                    );
                }),
                mergeMap(arr => from(arr)),
                map(selectedItem => {
                    console.log(`Create file "${chalk.blue(selectedItem)}"`);
                    const startName = selectedItem.replace(' ', '_');
                    const scriptSQL = `${startName}.sql`;
                    const source = path.join(templatesFolder, scriptSQL)
                    const target = `./no___${startName}.sql`;
                    fs.copyFileSync(source, target);
                    return selectedItem;
                }),
                map(selectedItem => {
                    const startName = selectedItem.replace(' ', '_');
                    const scriptSQL = `${startName}.rollback.sql`;
                    const source = path.join(templatesFolder, scriptSQL)
                    if (fs.existsSync(source)) {
                        console.log(`Create rollback file ${chalk.blue(selectedItem)}`);
                        const target = `./no___${startName}.rollback.sql`;
                        fs.copyFileSync(source, target);
                    }
                    return selectedItem;
                })
            )
            .subscribe(
                value => {
                    console.log(chalk.green(`- created "${value}" in current directory`));
                }, errorExitMessage);
    }
}