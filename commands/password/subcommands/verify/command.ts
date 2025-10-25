import Argon from '@node-rs/argon2';
import { input, password } from '@inquirer/prompts';
import Options from 'opts/password/subcommands/verify';
import Command from "lib/command";

const Verify = new Command(
    'verify',
    {
        describe: 'Verify a password using Argon2',
    },
    Options,
    []
)

Verify.handle = async (_argv) => {
    const
        original = await password({ message: 'Enter the password to verify:', mask: '⚛' }),
        hash = await input({ message: 'Enter the hash to verify against:' }),
        isValid = await Argon.verify(hash as string, original as string).then(() => true).catch(() => false);

    console.log(`Password is ${isValid ? '' : 'in'}valid.`);
}

export default Verify