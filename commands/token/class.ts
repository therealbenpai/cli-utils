import * as jose from 'jose';
import fs from 'fs';
import crypto from 'crypto';
import * as uuid from 'uuid';

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

    public addEntry(...entry: string[]) {
        this.entries.push(...entry);
        return this;
    }

    public getFinal(): { [k in Name]: string[] } {
        return {
            [this.claim]: this.entries
        } as never as { [k in Name]: string[] };
    }
}

class TokenManager {
    public static async generateToken(...claims: (MultiClaim | SingleClaim)[]): Promise<{ token: string; uid: string }> {
        const
            JWKData = JSON.parse(fs.readFileSync('./keys/JWKS.json', 'utf8')).keys[Math.floor(Math.random() * 5)],
            JWK = await jose.importJWK(JWKData, 'ES256'),
            JTI = uuid.v4({ random: crypto.randomBytes(16) });

        const payload: { [key: string]: string | string[] } = {};
        for (const claim of claims)
            Object.assign(payload, claim.getFinal());

        const token = await new jose.SignJWT(payload)
            .setProtectedHeader({
                alg: 'ES256',
                typ: 'JWT',
                kid: JWKData?.kid,
                // jku: 'https://benshawmean.com/.well-known/jwks',
            })
            .setIssuer('https://benshawmean.com')
            .setIssuedAt()
            .setExpirationTime("12h")
            .setJti(JTI)
            .sign(JWK);
        return {
            token,
            uid: JTI,
        };
    }
    public static async validateToken(token: string): Promise<boolean> {
        const JWKSet = jose.createRemoteJWKSet(new URL('https://www.benshawmean.com/.well-known/jwks'));

        try {
            await jose.jwtVerify(token, JWKSet, {
                issuer: 'https://benshawmean.com',
            });
            return true;
        } catch {
            return false;
        }
    }
    public static async deserializeToken(token: string): Promise<object> {
        const JWKSet = jose.createRemoteJWKSet(new URL('https://www.benshawmean.com/.well-known/jwks'));

        try {
            const Output = await jose.jwtVerify(token, JWKSet, {
                issuer: 'https://benshawmean.com',
                algorithms: ['ES256'],
                requiredClaims: ['iss', 'exp', 'iat', 'jti'],
            });
            return Output.payload;
        } catch {
            return {};
        }
    }
}

export default TokenManager;