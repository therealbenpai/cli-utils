import type { Options as YargOption } from "yargs";
import { z } from "zod";

class Option<
    K extends string,
    V extends z.ZodType
> {
    public name: K;
    public options: Partial<YargOption>;
    public fmt: V;

    constructor(
        name: K,
        options: Partial<YargOption>,
        format: V,
    ) {
        this.name = name;
        this.options = options;
        this.fmt = format;
    }
}

export default Option;