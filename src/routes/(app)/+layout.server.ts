import type { EunesModule } from '$lib/module-config';
import type { LayoutServerLoadEvent } from './$types';

export const load = (async ({ cookies }: LayoutServerLoadEvent) => {
    const theme = cookies.get('Theme') || 'light';
    cookies.set('theme', theme);

    const getModules = async (): Promise<EunesModule[]> => {
        const eunesModules = import.meta.glob(`./*/eunes-module.ts`);
        
        const modules = await Promise.all<EunesModule>(
            Object.values(eunesModules).map(async importModule => {
                const impModule = importModule as () => Promise<any>;
                return (await impModule()).default;
            })
        )
        return modules.sort((a, b) => a.order - b.order);
    }
    const modules = await getModules();
    
    return {
        modules: modules,
        theme: theme
    }
})