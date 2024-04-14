import { Page } from 'playwright';
import {GlobalConfig, PageId} from '../env/global';

export const navigateToPage = async (
    page: Page,
    pageId: PageId,
    { pagesConfig, hostsConfig }: GlobalConfig
): Promise<void> => {
    const {
        UI_AUTOMATION_HOST: hostName = 'production',
    } = process.env;

    const hostPath = hostsConfig[`${hostName}`];

    const url = new URL(hostPath);

    const pageConfigItem = pagesConfig[pageId];
    url.pathname = pageConfigItem.route;

    await page.goto(url.href);
};

const pathMatchesPageId = (
    path: string,
    pageId: PageId,
    { pagesConfig }: GlobalConfig 
): boolean => {
    const pageRegexString = pagesConfig[pageId].regex 
    const pageRegex = new RegExp(pageRegexString)
    return pageRegex.test(path)
}

export const currentPathMatchesPageId = (
    page: Page,
    pageId: PageId,
    globalConfig: GlobalConfig,
): boolean => {
        const { pathname: currentPath } = new URL(page.url())
        return pathMatchesPageId(currentPath, pageId, globalConfig)
};

export const getCurrentPageId = (
    page:Page,
    globalConfig: GlobalConfig,

): PageId => {
    
    const { pagesConfig } = globalConfig; //returns all page mappings from pages.JSON

    const pageConfigPageIds= Object.keys(pagesConfig)

    const { pathname: currentPath } = new URL(page.url()) //grabbing url of page

    const currentPageId = pageConfigPageIds.find(pageId => 
        pathMatchesPageId(currentPath, pageId, globalConfig)
    );


    if (!currentPageId) {
        throw Error(
            `Failed to get page name from current route ${currentPath}, \
            possible pages: ${JSON.stringify((pagesConfig))}`
        )
    }
    return currentPageId;
}