import Navigo from 'navigo';
import { App } from 'scripts/App';
import { routesMap, routeKeys } from 'scripts/helpers/variables';

const root = null;
const useHash = true;
const hash = '#';

export const router = new Navigo(root, useHash, hash);

export function initializeRouter() {
    router
        .on({
            '*': () => App.reRender(window.location.hash),
        })
        .resolve();

    router.notFound(() => {
        router.navigate(routesMap.get(routeKeys.home).url);
    });
};