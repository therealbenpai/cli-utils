import Argon, { type Options as ArgonOpts, Algorithm, Version } from '@node-rs/argon2';
import Spinner from 'lib/spinner';
import { password } from '@inquirer/prompts';
import Options from 'opts/password/subcommands/hash';
import Command from "lib/command";

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
    Argon.hash(
        input as string,
        {
            algorithm: Algorithm.Argon2id,
            version: Version.V0x13,
            timeCost: argv.iterations as number,
            memoryCost: argv.memory as number,
            parallelism: argv.parallelism as number,
            outputLen: argv.length as number,
        } as ArgonOpts,
    ).then((hashed) => {
        hash.succeed('Password hashed successfully!');
        console.log(`Hash: ${hashed}`);
    }).catch((error) => {
        hash.fail(`Error hashing password: ${error.message}`);
    });
}

export default Hash;