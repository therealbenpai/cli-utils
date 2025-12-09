import { SingleClaim, MultiClaim } from "cmd/cls/token";

export default class {
    public static tokenClaimParse(input: string): Array<SingleClaim | MultiClaim> {
        const claims = input
            .split('!')
            .map(c => {
                const [format, claim, value] = c.trim().split(':');

                switch (format) {
                    case 'S': return new SingleClaim(claim).setEntry(value);
                    case 'M': return new MultiClaim(claim).addEntry(...value.split(',').map(v => v.trim()));
                    default: return null;
                }
            })
            .filter(c => c !== null);

        return claims;
    }
}