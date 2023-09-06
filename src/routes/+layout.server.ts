// import { glob } from 'glob';
// import type { EunesModule } from '$lib/module-config';
// import type { LayoutServerLoadEvent } from './$types';

// export const load = (async ({ cookies }: LayoutServerLoadEvent) => {
//     const theme = cookies.get('Theme') || 'light';
//     cookies.set('theme', theme);

//     const getModules = async (): Promise<EunesModule[]> => {
//         const paths = await glob(`src/routes/*/eunes-module.ts`);
//         const modules = await Promise.all<EunesModule>(
//             paths.map(async path => {
//                 const modulePath = path.replace(/(src\\routes\\|.ts)/g, '');
//                 const [name, cfg] = modulePath.split('\\');
//                 return (await import(`./${name}/${cfg}.ts`)).default;
//             })
//         )
//         return modules.sort((a, b) => a.order - b.order);
//     }
//     const modules = await getModules();

//     return {
//         modules: modules,
//         theme: theme
//     }
// })