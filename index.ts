import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as Commands from '!cmds';

yargs(hideBin(process.argv))
    .scriptName('cli-utils')
    .help()
    .version('1.0.0')
    .alias({ v: 'version', h: 'help' })
    .command(Object.values(Commands))
    .demandCommand(1, 'You need at least one command before moving on')
    .strict()
    .parseAsync();