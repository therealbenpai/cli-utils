import Command from 'lib/command';
import Generate from 'cmd/token/subcommands/generate';
import Validate from 'cmd/token/subcommands/validate';
import Deserialize from 'cmd/token/subcommands/deserialize';
import Options from 'opts/token';

export default new Command(
    'token',
    {
        describe: 'JWT token generation and management utilities'
    },
    Options,
    [
        Generate,
        Validate,
        Deserialize,
    ]
);