import { editor } from '@inquirer/prompts';
import Options from 'opts/password/subcommands/verify';
import Command from "lib/command";
import TokenManager from 'cmd/cls/token';

const Deserialize = new Command(
    'deserialize',
    {
        describe: 'Deserialize a JWT token and verify its integrity',
    },
    Options,
    []
)

Deserialize.handle = async (_argv) => {
    const token = await editor({ message: 'Enter the JWT token to deserialize:' });
    const payload = await TokenManager.deserializeToken(token);
    console.log('\n');
    if (!payload)
        return console.log('Failed to deserialize token.');

    console.log(`Token Payload:`);
    console.dir(payload, { depth: null, colors: true });
}

export default Deserialize