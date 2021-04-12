const {
    of, throwError
} = require('rxjs');
const {
    map,
} = require('rxjs/operators');
const sinon = require('sinon');
const { expect } = require('chai');
const repositoryManager = require('./repository-manager');
const processus = require('./processus');
const command = require('./command-refresh');

describe('Command refresh', () => {
    it('should be finish if no error', (done) => {
        sinon.stub(repositoryManager, 'createRootDirectory').returns(of('test'));
        const fake = map(v => {
            expect(v).to.eq('test');
            return v;
        });
        sinon.stub(repositoryManager, 'clone').returns(fake);
        sinon.stub(repositoryManager, 'copyDatasFiles').returns(map((v) => {
            expect(v).to.eq('test');
            return { destination: v };
        }));
        sinon.stub(repositoryManager, 'removeClonePath').returns(fake);
        sinon.stub(processus, 'errorExitMessage').callsFake(() => expect(true).to.eq(false));

        command.refresh();
        done();
    });
    /*
    describe('should be call processus if an error occured in ', () => {
        let exitProcess
        beforeEach(() => {

        });

        afterEach(function () {
            exitProcess.restore();
        });

        it('createRootDirectory', (done)=>{
            exitProcess = sinon.stub(processus, 'errorExitMessage')
                .callsFake((e) => {
                    console.log(e);
                    done();
                });
            sinon.stub(repositoryManager, 'createRootDirectory').returns(throwError(new Error('test')));
            const fake = map(v => {
                expect(v).to.eq('test');
                return v;
            });
            sinon.stub(repositoryManager, 'clone').returns(fake);
            sinon.stub(repositoryManager, 'copyDatasFiles').returns(map((v) => {
                expect(v).to.eq('test');
                return { destination: v };
            }));
            sinon.stub(repositoryManager, 'removeClonePath').returns(fake);

            command.refresh();
        })
    });
    */
});