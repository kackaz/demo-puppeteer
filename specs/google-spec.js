import assert from 'assert';
import puppeteer from 'puppeteer';
import config from 'config';

describe( 'Puppeteer', function() {

	this.timeout( config.get( 'mochaTimeoutMS' ) );

	it( 'Search data with Google', async function() {
		const browser = await puppeteer.launch({
      headless: false,
      fullPage: true
    });
		const page = await browser.newPage();
    const viewports = [1600, 1000, 800, 600];

    for(let i=0; i < viewports.length; i++) {
      // Arrange
      await page.goto(config.get( 'baseURL' ));
      let vw = viewports[i];
      await page.setViewport({
        width: vw,
        height: 1000
      });

      // Action
      await page.type('input[name=q]', 'สวัสดี Puppeteer');
      await page.screenshot({
        path: `screen-${vw}.png`,
        fullPage: true
      });

      // Assert
      await page.keyboard.press('Enter');
      await page.waitForNavigation();
      await page.screenshot({
        path: `screen-${vw}.png`,
        fullPage: true
      });

      const allResultsSelector = '#search';
      let found = false;
  		await page.waitFor(allResultsSelector).then( () => found = true );
  		assert( found );
    }

		await browser.close();
	} );
} );
