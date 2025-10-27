import * as jose from 'jose';

class TokenManager {
    private pKey: jose.CryptoKey;
    public pubKey: jose.CryptoKey;
    constructor () {
        jose.generateKeyPair('PS256', { extractable: true })
            .then(keyPair => {
                this.pKey = keyPair.privateKey;
                this.pubKey = keyPair.publicKey;
            })
    }
    public async generateToken(payload: any): Promise<string> {
        const token = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'PS256' })
            .sign(this.pKey);
        return token;
    }
    public async verifyToken(token: string): Promise<boolean> {
        try {
            const { payload } = await jose.jwtVerify(token, this.pKey);
            return !!payload;
        } catch {
            return false;
        }
    }
    public deserializeToken(token: string): any {
        try {
            const { payload } = jose.decodeJwt(token);
            return payload;
        } catch {
            return null;
        }
    }
}

export default TokenManager;