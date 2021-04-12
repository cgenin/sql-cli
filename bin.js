#!/usr/bin/env node

const { Command } = require('commander');
const dotenv = require('dotenv');
const { version } = require('./package.json');
const { ls, create } = require('./lib/command-template');
const { refresh } = require('./lib/command-refresh');

dotenv.config();

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

program.command('refresh')
    .description('Create or refresh the configuration')
    .action(refresh);

program.parse(process.argv);
