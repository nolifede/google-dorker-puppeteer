// Google Dorker 2018
// Coded by L0c4lh34rtz - IndoXploit
// https://www.github.com/agussetyar  - https://www.indoxploit.or.id

const process   = require('process');
const path      = require('path');
const puppeteer = require('puppeteer');

(async () => {
    if(process.argv.length < 3) {
        console.log('\nusage: node '+path.basename(process.argv[1])+' "google_dork"');
        console.log('example: node '+path.basename(process.argv[1])+' "inurl:/admin/login"');
        console.log('example: node '+path.basename(process.argv[1])+' "intext:\'Powered by SomeVendor.com\'"');
    } else {
        let keyword = process.argv[2];
        let start   = 0;
        let max     = 100;

        const browser   = await puppeteer.launch({
            headless: true, 
            args: ['--no-sandbox', '--media-cache-size=0', '--disk-cache-size=0']
        });
        const page      = await browser.newPage();
        const client    = await page.target().createCDPSession();

        await page.setCacheEnabled(false);
        await client.send('Network.setCacheDisabled', {'cacheDisabled' : true});
        
        console.log('Searching for: '+keyword);

        while(start < max) { 
            await page.goto('https://www.google.com/search?hl=en&q='+keyword+'&start='+start, {waitUntil: 'networkidle2'});
            await page.screenshot({path: 'example.png'});
        
            const search_result = await page.evaluate(() => document.querySelector('#resultStats').innerText);
            const search_url    = await page.$$eval('.rc > .r > a', href => href.map((a) => { return a.href }));
            
            console.log(search_result);
            console.log(search_url);

            start += 10;
        }

        await page.close();
        await browser.close();
    }
})();
