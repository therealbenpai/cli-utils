import { editor } from '@inquirer/prompts';
import chalk from 'chalk';
import Options from 'opts/password/subcommands/verify';
import Command from "lib/command";
import TokenManager from 'cmd/cls/token';

const Validate = new Command(
    'validate',
    {
        describe: 'Validate a JWT token and its claims',
    },
    Options,
    []
)

Validate.handle = async (_argv) => {
    const token = await editor({ message: 'Enter the JWT token to validate:' });
    const isValid = await TokenManager.validateToken(token);
    console.log('\n');
    console.log(chalk.underline.bold(`Token is ${isValid ? chalk.green`valid` : chalk.red`invalid`}.`));
}

export default Validate