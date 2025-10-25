import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Commands from '!cmds';

yargs(hideBin(process.argv))
    .scriptName('cli-utils')
    .help()
    .version('1.0.0')
    .alias({ v: 'version', h: 'help' })
    .command(Commands)
    .demandCommand(1, 'You need at least one command before moving on')
    .strict()
    .parseAsync();