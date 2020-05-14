import {command, file, path, skip, task} from 'fig';

const NODE_VERSION = '10.16.0';

const n = path.root.join('vendor/n/bin/n');
const bin = path.home.join(`n/bin`);
const npm = bin.join('npm');

task('make ~/n', async () => {
    await file({path: '~/n', state: 'directory'});
});

task('hide ~/n', async () => {
    await command('chflags', ['hidden', '~/n']);
});

task(`install Node.js v${NODE_VERSION}`, async () => {
    const env = {
        ...process.env,
        N_PREFIX: path.home.join('n'),
    };

    await command(n, [NODE_VERSION], {
        creates: `~/n/n/versions/node/${NODE_VERSION}/bin/node`,
        env,
    });
});

task('install global packages', async () => {
    const env = {
        ...process.env,
        N_PREFIX: path.home.join('n'),
        PATH: `${bin}:${process.env.PATH}`,
    };

    const packages = [
        'bs-platform',
        'flow-bin',
        'flow-typed',
        'gatsby-cli',
        'typescript-language-server',
        'neovim',
        'ocaml-language-server',
        'reason-cli',
        'source-map-explorer',
        'typescript',
        'vim-language-server',
        'yarn@1.22.4',
    ];

    for (const name of packages) {
        const result = await command(npm, ['ls', '-g', '--parseable', name], {
            env,
            failedWhen: () => false,
        });

        if (result && result.status === 0) {
            skip(`package ${name} (already installed)`);
        } else {
            await command(npm, ['install', '-g', name], {env});
        }
    }
});
