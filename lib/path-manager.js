const path = require('path');
const os = require('os');

const getRootDirProduction = () => {
    const paths = os.homedir();
    return path.join(paths, '.sql-cli');
};

const DATAS_DIRECTORY = 'datas';

class PathManager {
    constructor() {
        this.isDeveloppement = process.env.NODE_ENV === 'developpement';
        this.rootFolder = (this.isDeveloppement) ? './datas' : getRootDirProduction();
    }

    getTemplatesFolder() {
        return path.join(this.getDatasFolder(), 'templates');
    }

    getDatasDirectory() {
        return DATAS_DIRECTORY;
    }

    getDatasFolder() {
        return path.join(this.rootFolder, DATAS_DIRECTORY);
    }
}

module.exports = PathManager;
