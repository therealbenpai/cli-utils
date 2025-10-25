import type { ArgumentsCamelCase, Argv, CommandBuilder, CommandModule } from "yargs";
import z from "zod";
import assert from "node:assert";

import Option from "lib/option";

type FormattedArgv<
    A extends any[], // Array of Objects,
    K extends string, // The key in each object that represents the name
    V extends string // The key in each object that represents the zod format
> = { [I in A[number][K]]: z.infer<A[number][V]> };

class Command<
    Name extends string,
    Options extends Option[],
    Commands extends Command<string, any[], any[]>[],
> implements CommandModule {
    command: Name;
    handler: (args: ArgumentsCamelCase<FormattedArgv<Options, 'name', 'fmt'>>) => Promise<void>;
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

    set handle(fn: (args: ArgumentsCamelCase<FormattedArgv<Options, 'name', 'fmt'>>) => Promise<void>) {
        this.handler = async (argv) => {
            const Controller = new AbortController();

            Controller.signal.addEventListener('abort', () => {
                const { reason } = Controller.signal;
                console.error(reason instanceof Error ? reason.message : reason);
                process.exit(1);
            });

            return void await fn(
                Object.fromEntries(
                    await Promise.all(
                        Object
                            .entries(argv)
                            .filter(([key]) => this.opts.some(opt => opt.name === key))
                            .map(([key, value]) => new Promise<[string, any]>((ok, err) => {
                                const opt = this.opts.find(o => o.name === key)!;
                                try {
                                    assert(
                                        value !== undefined,
                                        `Option ${opt.name} is undefined`
                                    );
                                    assert(
                                        !opt.options.demandOption,
                                        `Missing required option: ${opt.name}`
                                    );
                                    const parsed = opt.fmt ? opt.fmt.safeParse(value) : { success: true, error: null, data: value };
                                    assert(
                                        parsed.success,
                                        parsed.error.message
                                    );
                                    ok([key, parsed.data]);
                                } catch (error) { err(error) }
                            }).catch((error) => Controller.abort(error)))
                    )! as [string, any][]
                ) as ArgumentsCamelCase<FormattedArgv<Options, 'name', 'fmt'>>
            );
        }
    }
}

export default Command;