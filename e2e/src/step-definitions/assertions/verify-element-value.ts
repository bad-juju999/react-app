import { Then } from '@cucumber/cucumber'
import { ElementKey } from '../../env/global';
import {getElementLocator} from "../../support/web-element-helper";
import { waitFor } from '../../support/wait-for-behavior';
import { ScenarioWorld } from '../setup/world';

Then(
    /^the "([^"]*)" should contain the text "(.*)"$/,
    async function(elementKey: ElementKey, expectedElementText: string) {
        const {
            screen: { page },
            globalConfig,
        } = this;

        console.log(`the ${elementKey} should contain the ${expectedElementText}`)

        const elementIdentifier = getElementLocator(page, elementKey, globalConfig)

        await waitFor(async () => {
            const elementText = await page.textContent(elementIdentifier)
            return elementText?.includes(expectedElementText);
        });

    }
)

Then(
    /^the "([^"]*)" should equal the text "(.*)"$/,
    async function(this: ScenarioWorld, elementKey: ElementKey, expectedElementText : string) {
        const {
            screen: { page },
            globalConfig,
        } = this;

        console.log(`the ${elementKey} should equal the text ${expectedElementText}`)

        const elementIdentifier = getElementLocator(page, elementKey, globalConfig)

        await waitFor( async () => {
            const elementText = await page.textContent(elementIdentifier)
            return (elementText === expectedElementText)  
        })
    }
);