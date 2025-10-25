import type { Options as YargOption } from "yargs";
import { z } from "zod";

class Option<K extends string = string, V extends z.ZodTypeAny = z.infer<any>> {
    name: K;
    options: Partial<YargOption>;
    fmt: z.ZodType<any>;

    constructor(
        name: K,
        options: Partial<YargOption>,
        format: V = undefined as V,
    ) {
        this.name = name;
        this.options = options;
        this.fmt = format;
    }
}

export default Option;