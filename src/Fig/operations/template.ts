import Context from '../Context.js';
import file from './file.js';

export default async function template({
    force,
    group,
    mode,
    owner,
    path,
    src,
    sudo,
    variables = {},
}: {
    force?: boolean;
    group?: string;
    path: string;
    mode?: Mode;
    owner?: string;
    src: string;
    sudo?: boolean;
    variables: Variables;
}): Promise<void> {
    const contents = (await Context.compile(src)).fill({variables});

    return await file({
        contents,
        force,
        group,
        mode,
        owner,
        path,
        state: 'file',
        sudo,
    });
}
