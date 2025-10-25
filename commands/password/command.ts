import Command from "lib/command";
import Hash from 'cmd/password/subcommands/hash';
import Verify from 'cmd/password/subcommands/verify';
import Options from 'opts/password';

export default new Command(
    'password',
    {
        describe: 'Password hashing and verification utilities'
    },
    Options,
    [
        Hash,
        Verify,
    ]
);