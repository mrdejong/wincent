import ErrorWithMetadata from './ErrorWithMetadata';
import Context from './Fig/Context';
import {log} from './console';
import run from './run';
import stringify from './stringify';

type Options = {
    group?: string;
    sudo?: boolean;
    owner?: string;
};

export default async function chown(
    path: string,
    options: Options = {}
): Promise<Error | null> {
    if (Context.attributes.platform === 'darwin') {
        // Run one of:
        //
        //      chown owner path
        //      chown :group path
        //      chown owner:group path
        //
        // With or without `sudo` (although note that, in practice, if
        // we are calling `chown()` at all, it will probably be with
        // `sudo`).
        //

        let ownerAndGroup = options.owner || '';

        if (options.group) {
            ownerAndGroup += `:${options.group}`;
        }

        const args = [ownerAndGroup, path];

        const passphrase = options.sudo
            ? await Context.sudoPassphrase
            : undefined;

        const result = await run('chown', args, {passphrase});

        if (result.status === 0) {
            return null;
        } else {
            log.debug(stringify(result));

            return (
                result.error ||
                new ErrorWithMetadata(`\`chown ${args.join(' ')}\` failed`)
            );
        }
    } else {
        throw new Error('TODO: implement');
    }
}
