const {
    of, throwError
} = require('rxjs');
const {
    map,
} = require('rxjs/operators');
const sinon = require('sinon');
const { expect } = require('chai');
const inquirer = require('inquirer');
const templateManager = require('./template-manager');
const processus = require('./processus');



describe('Command template', () => {
    it('should launch command ls', (done) => {
        sinon.stub(templateManager, 'getTemplates').returns(of('test.sql', 'test2.sql'));
        sinon.stub(processus, 'errorExitMessage').callsFake(() => expect('').to.eq('Call exit'));
        const command = require('./command-template');
        command.ls();
        done();
    });

    it('should command create call manager if select one file', (done) => {
        sinon.stub(templateManager, 'getTemplates').returns(of('test.sql', 'test2.sql'));
        sinon.stub(inquirer, 'prompt').resolves({ selectedScript: ['test.sql'] });
        const fake = map((v) => {
            expect(v).to.eq('test.sql');
            return v;
        });
        sinon.stub(templateManager, 'createSqlFile').returns(fake);
        sinon.stub(templateManager, 'createRollbackFile').returns(map(v => {
            expect(v).to.eq('test.sql');
            return { selectedItem: v, created: true };
        }));
        sinon.stub(processus, 'errorExitMessage').callsFake(() => expect('').to.eq('Call exit'));
        const command = require('./command-template');
        command.create();
        done()
    });
});