const {
    bindNodeCallback, from, throwError,
} = require('rxjs');
const {
    mergeMap, map, reduce, filter,
} = require('rxjs/operators');
const fs = require('fs');
const path = require('path');
const PathManager = require('./path-manager');

class TemplateManager {
    constructor() {
        this.templatesFolder = new PathManager().getTemplatesFolder();
    }

    getTemplates() {
        const b = fs.existsSync(this.templatesFolder);
        if (!b) {
            return throwError(new Error('Repository not initialised. Please call command "refresh"'));
        }
        return bindNodeCallback(fs.readdir)(this.templatesFolder)
            .pipe(
                mergeMap((arr) => from(arr)),
                filter((v) => v.indexOf('rollback') === -1),
                map((v) => v.replace('.sql', '')),
                map((v) => v.replace('_', ' ')),
            );
    }

    getSourceScript() {
        return this.getTemplates()
            .pipe(
                map((name) => ({ name })),
                reduce((acc, v) => [...acc, v], []),
            );
    }

    createRollbackFile() {
        return map((selectedItem) => {
            const startName = selectedItem.replace(' ', '_');
            const scriptSQL = `${startName}.rollback.sql`;
            const source = path.join(this.templatesFolder, scriptSQL);
            const created = fs.existsSync(source);
            if (created) {
                const target = `./no___${startName}.rollback.sql`;
                fs.copyFileSync(source, target);
            }
            return { selectedItem, created };
        });
    }

    createSqlFile() {
        return map((selectedItem) => {
            const startName = selectedItem.replace(' ', '_');
            const scriptSQL = `${startName}.sql`;
            const source = path.join(this.templatesFolder, scriptSQL);
            const target = `./no___${startName}.sql`;
            fs.copyFileSync(source, target);
            return selectedItem;
        });
    }
}

module.exports = new TemplateManager();
