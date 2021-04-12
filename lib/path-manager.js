const path = require('path');
const os = require('os');

const getRootDirProduction = () => {
    const paths = os.homedir();
    return path.join(paths, '.sql-cli');
};

class PathManager {
    constructor() {
        this.isDeveloppement = process.env.NODE_ENV === 'developpement';
        this.DATAS_DIRECTORY = 'datas';
        this.rootFolder = (this.isDeveloppement) ? `./${this.DATAS_DIRECTORY}` : getRootDirProduction();
    }

    getTemplatesFolder() {
        return path.join(this.getDatasFolder(), 'templates');
    }

    getDatasDirectory() {
        return this.DATAS_DIRECTORY;
    }

    getDatasFolder() {
        return path.join(this.rootFolder, this.DATAS_DIRECTORY);
    }
}

module.exports = PathManager;
