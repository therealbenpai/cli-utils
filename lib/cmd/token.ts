import * as jose from 'jose';
import fs from 'fs';
import crypto from 'crypto';
import PasswordManager from 'lib/cmd/password'; // Argon2id Implementation

export class SingleClaim<Name extends string = string> {
    public claim: Name;
    public entry: string;

    constructor(claim: Name) {
        this.claim = claim;
    }

    public setEntry(entry: string) {
        this.entry = entry;
        return this;
    }

    public getFinal(): { [k in Name]: string } {
        return {
            [this.claim]: this.entry
        } as never as { [k in Name]: string };
    }
}

export class MultiClaim<Name extends string = string> {
    public claim: Name;
    public entries: string[] = [];

    constructor(claim: Name) {
        this.claim = claim;
    }

    public addEntry(entry: string) {
        this.entries.push(entry);
        return this;
    }

    public getFinal(): { [k in Name]: string[] } {
        return {
            [this.claim]: this.entries
        } as never as { [k in Name]: string[] };
    }
}

export class Token {
    public claims: (MultiClaim | SingleClaim)[] = [];

    constructor() { }

    public prepSignature() {
        const payload: { [key: string]: string | string[] } = {};
        for (const claim of this.claims)
            Object.assign(payload, claim.getFinal());
        return new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'ES256' });
    }
}

class TokenManager {
    public static async generateToken(...claims: (MultiClaim | SingleClaim)[]): Promise<{ token: string; uid: string }> {
        const
            JWKData = JSON.parse(fs.readFileSync('./keys/JWKS.json', 'utf8')),
            JWK = await jose.importJWK(JWKData, 'ES256'),
            JTI = PasswordManager.hashPassword(
                crypto.randomBytes(16).toString('base64url'),
                {
                    iterations: 1 << 4,
                    parallelism: 1 << 4,
                    length: 1 << 4,
                    memory: 1 << 12,
                }
            )

        const payload: { [key: string]: string | string[] } = {};
        for (const claim of claims)
            Object.assign(payload, claim.getFinal());

        const final = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'ES256', typ: 'JWT', kid: JWKData?.kid })
            .setIssuer('https://benshawmean.com')
            .setIssuedAt()
            .setExpirationTime("12h")
            .setJti(JTI)
            .sign(JWK);
        return {
            token: final,
            uid: JTI,
        };
    }
}

export default TokenManager;