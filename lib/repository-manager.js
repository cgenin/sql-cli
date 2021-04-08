const simpleGit = require('simple-git');
const {
    bindNodeCallback, from, of,
} = require('rxjs');
const {
    map, mergeMap,
} = require('rxjs/operators');
const mkdirs = require('mkdirs');
const path = require('path');
const fs = require('fs-extra');
const PathManager = require('./path-manager');

const pathManager = new PathManager();

class GitManagerProduction {
    constructor() {
        this.rootFolder = pathManager.rootFolder;
        this.REPOSITORY = (process.env.SQL_CLI_REPOSITORY) ? process.env.SQL_CLI_REPOSITORY : 'https://github.com/cgenin/sql-cli.git';
        this.DIRECTORY_NAME = (process.env.SQL_CLI_DIRECTORY_NAME) ? process.env.SQL_CLI_DIRECTORY_NAME : 'sql-cli';
    }

    removeClonePath() {
        return mergeMap(() => {
            const source = path.join(this.rootFolder, this.DIRECTORY_NAME);
            const remove = bindNodeCallback(fs.remove);
            return map(() => source)(remove(source));
        });
    }

    copyDatasFiles() {
        return mergeMap(() => {
            const source = path.join(this.rootFolder,
                this.DIRECTORY_NAME,
                pathManager.getDatasDirectory());
            const destination = path.join(this.rootFolder, pathManager.getDatasDirectory());
            const copy = bindNodeCallback(fs.copy);
            return map(() => ({ source, destination }))(copy(source, destination));
        });
    }

    createRootDirectory() {
        return map((rootFolder) => {
            mkdirs(rootFolder);
            return rootFolder;
        })(of(this.rootFolder));
    }

    clone() {
        return mergeMap((rootFolder) => {
            const git = simpleGit(rootFolder, { binary: 'git' });
            return map(() => rootFolder)(from(git.clone(this.REPOSITORY)));
        });
    }
}

module.exports = GitManagerProduction;
