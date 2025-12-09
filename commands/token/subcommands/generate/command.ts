import { input } from '@inquirer/prompts';
import Options from 'opts/token/subcommands/generate';
import Command from "lib/command";
import TokenManager, { SingleClaim, MultiClaim } from 'cmd/cls/token';

const Generate = new Command(
    'generate',
    {
        describe: 'Generate a JWT token with specified claims',
    },
    Options,
    []
)

Generate.handle = async (_argv) => {
    const
        subject = await input({ message: 'Enter the subject for this token:' }),
        scopes = await input({ message: 'Enter the scopes for this token (comma-separated):' }),
        permissions = await input({ message: 'Enter the permissions for this token (comma-separated):' }),
        entitlements = await input({ message: 'Enter the entitlements for this token (comma-separated):' });

    const claims: (SingleClaim | MultiClaim)[] = [
        new SingleClaim('sub').setEntry(subject),
        new MultiClaim('scopes').addEntry(...scopes.split(',').map(s => s.trim())),
        new MultiClaim('permissions').addEntry(...permissions.split(',').map(p => p.trim())),
        new MultiClaim('entitlements').addEntry(...entitlements.split(',').map(e => e.trim())),
    ];

    const { token, uid } = await TokenManager.generateToken(...claims);
    console.log(`Generated Token (UID: ${uid}):\n\n${token}`);
}

export default Generate