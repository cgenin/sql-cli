const { Command } = require('commander');
const { version } = require('./package.json');
const { ls, create } = require('./lib/template');
const program = new Command('sql-cli');
program.version(version);

const template = new Command('template')
    .description('SQL template generator');

template
    .command('ls')
    .description('List all templates')
    .action(ls);

template
    .command('create')
    .description('Create an template file')
    .action(create);

program.addCommand(template);

program.parse(process.argv);

