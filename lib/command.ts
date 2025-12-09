import type { Argv, CommandBuilder, CommandModule } from "yargs";
import { type infer as zi, z } from "zod";
import { ok as aok } from "node:assert/strict";

import Option from "lib/option";

/**
 * Utility type to convert an array of objects with key-value pairs into a single object type using the value set at the key
 * as the new key and the value set at the value key as the new value.
 * 
 * @example
 * ```ts
 * type Input = { name: 'option1', fmt: z.ZodString } | { name: 'option2', fmt: z.ZodNumber };
 * 
 * type Result = ArrayKeyValue<Input[], 'name', 'fmt'>;
 * ```
 * 
 * Result will be:
 * ```ts
 * {
 *  'option1': z.ZodString;
 *  'option2': z.ZodNumber;
 * }
 * ```
 */
type ArrayKeyValue<A extends any[], K extends string, V extends string> = {
    [I in A[number][K]]: A[number] extends { [key in K]: infer U }
        ? A[number] extends { [key in V]: infer T }
            ? U extends A[number][K]
                ? T
                : never
            : never
        : never;
};

/**
 * Utility type to format the argv object based on the provided options array.
 * 
 * @extends ArrayKeyValue
 * @example
 * ```ts
 * type Options = [ Option<'option1', z.ZodString>, Option<'option2', z.ZodNumber> ];
 * 
 * type Formatted = FormattedArgv<Options>;
 * ```
 * 
 * Formatted will be:
 * ```ts
 * {
 *  'option1': string;
 *  'option2': number;
 * }
 * ```
 */
type FormattedArgv<
    A extends Option<string, z.ZodType<any>>[],
    KVP = ArrayKeyValue<A, 'name', 'fmt'>
> = { [K in keyof KVP]: zi<KVP[K]>; };

class Command<
    Name extends string,
    Options extends Option<string, z.ZodType<any>>[],
    Commands extends Command<string, any[], any[]>[],
> implements Omit<CommandModule, 'handler'> {
    command: Name;
    handler: (args: FormattedArgv<Options>) => Promise<void>;
    builder: CommandBuilder<{}, {}>;
    opts: Options = [] as Options;
    cmds: Commands = [] as Commands;
    constructor(
        name: Name,
        details: Partial<CommandModule> = {},
        opts: Options = [] as Options,
        cmds: Commands = [] as Commands,
    ) {
        this.command = name;
        this.opts = opts;
        this.cmds = cmds;

        for (const [key, value] of Object.entries(details)) this[key] = value;

        this.builder = (yargs: Argv) => {
            for (const cmd of cmds) yargs.command(cmd);
            for (const opt of opts) yargs.option(opt.name, opt.options);

            if (cmds.length > 0) yargs.demandCommand();

            return yargs.help().showHelpOnFail(true).strict()
        }
    }

    set handle(fn: (args: FormattedArgv<Options>) => Promise<void>) {
        this.handler = async (argv) => {
            const Controller = new AbortController();

            Controller.signal.addEventListener('abort', () => {
                const { reason } = Controller.signal;
                if (reason.message.toLowerCase().includes('sigint')) return process.exit(0);
                console.error(reason instanceof Error ? reason.message : reason);
                process.exit(1);
            });

            return void await fn(
                Object.fromEntries(
                    await Promise.all(
                        Object
                            .entries(argv)
                            .filter(([key, value]) => this.opts.some(opt => opt.name === key) && value !== undefined)
                            .map(([key, value]) => new Promise<[string, any]>((ok, err) => {
                                const opt = this.opts.find(o => o.name === key)!;
                                try {
                                    aok(
                                        !opt.options.demandOption,
                                        `Missing required option: ${opt.name}`
                                    );
                                    aok(
                                        opt.fmt.safeParse(value).success,
                                        opt.fmt.safeParse(value).error.message
                                    );
                                    ok([key, opt.fmt.safeParse(value).data]);
                                } catch (error) { err(error) }
                            }).catch((error) => Controller.abort(error)))
                    )! as [string, any][]
                ) as FormattedArgv<Options>
            );
        }
    }
}

export default Command;