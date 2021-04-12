const chai = require('chai');
const chaiString = require('chai-string');
const PathManager = require('./path-manager');

chai.use(chaiString);
const { expect } = chai;

describe('PathManager', () => {
    const pathManager = new PathManager();
    describe('#isDeveloppement', () => {
        it('should return false in test', () => {
            expect(pathManager.isDeveloppement).to.eq(false);
        });
    });
    describe('#getTemplatesFolder', () => {
        it('should return an directory', () => {
            expect(pathManager.getTemplatesFolder()).to.endsWith('templates');
        });
    });
    describe('#getTemplatesFolder', () => {
        it('should return an directory', () => {
            expect(pathManager.getDatasDirectory()).to.endsWith('datas');
        });
    });

});
