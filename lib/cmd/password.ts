import Argon, { type Options as ArgonOpts, Algorithm, Version } from '@node-rs/argon2';

class PasswordManager {
    public static hashPassword(password: string, argv: any): string {
        const hashedPassword = Argon.hashSync(
            password as string,
            {
                algorithm: Algorithm.Argon2id,
                version: Version.V0x13,
                timeCost: argv.iterations as number,
                memoryCost: argv.memory as number,
                parallelism: argv.parallelism as number,
                outputLen: argv.length as number,
            } as ArgonOpts,
        );
        return hashedPassword;
    }
}

export default PasswordManager;