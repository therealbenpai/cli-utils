import Spinner from 'lib/spinner';
import { password } from '@inquirer/prompts';
import Options from 'opts/password/subcommands/hash';
import Command from "lib/command";
import PasswordManager from 'lib/cmd/password';

const Hash = new Command(
    'hash',
    {
        describe: 'Hash a password using Argon2'
    },
    Options,
    []
)

Hash.handle = async (argv) => {
    const input = await password({ message: 'Enter the password to hash:', mask: '⚛' });
    const hash = new Spinner('Hashing password...');
    hash.start();
    new Promise((resolve, _reject) => {
        const hashed = PasswordManager.hashPassword(input, argv);
        resolve(hashed);
    }).then((hashed) => {
        hash.succeed('Password hashed successfully!');
        console.log(`Hash: ${hashed}`);
        return hashed;
    }).catch((error) => {
        hash.fail(`Error hashing password: ${error.message}`);
    });
}

export default Hash;