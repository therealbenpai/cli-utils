import Option from 'lib/option';
import z from 'zod';

export default [
    new Option(
        'iterations',
        {
            alias: 'I',
            demandOption: false,
            describe: 'The number of iterations to use for hashing (optional)',
            type: 'number',
            hidden: true,
        },
        z.number().min(1).default(20),
    ),
    new Option(
        'memory',
        {
            alias: 'M',
            demandOption: false,
            describe: 'The memory cost factor (optional)',
            type: 'number',
            hidden: true,
        },
        z.number().min(1).default(1 << 20),
    ),
    new Option(
        'parallelism',
        {
            alias: 'P',
            demandOption: false,
            describe: 'The degree of parallelism (optional)',
            type: 'number',
            hidden: true,
        },
        z.number().min(1).default(16),
    ),
    new Option(
        'length',
        {
            alias: 'L',
            demandOption: false,
            describe: 'The length of the output hash (optional)',
            type: 'number',
            hidden: true,
        },
        z.number().min(4).default(1 << 6),
    ),
];