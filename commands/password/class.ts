import crypto from 'crypto';

class PasswordManager {
    public static hashPassword(password: string, argv: any): string {
        const salt = crypto.randomBytes(16);
        const params = {
            passes: argv.iterations as number,
            memory: argv.memory as number,
            parallelism: argv.parallelism as number,
            tagLength: argv.length as number,
            message: Buffer.from(password),
            nonce: salt,
        };
        const hash = crypto.argon2Sync(
            'argon2id',
            params
        );
        return `$argon2id$v=19$m=${params.memory},t=${params.passes},p=${params.parallelism}$${salt.toBase64()}$${hash.toBase64()}`;
    }
}

export default PasswordManager;