import Command from "lib/command";
import Options from 'opts/id';

export default new Command(
    'password',
    {
        describe: 'Password hashing and verification utilities'
    },
    Options,
    []
);