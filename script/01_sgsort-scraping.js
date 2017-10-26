const phantom = require('phantom');
const cheerio = require('cheerio');
const fs = require("fs");

// Phantom settings
const timeoutMsec = 30000;
const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36';

// Scraping target url settings
const urlList = [
    { url: 'https://odenpa.com/sgsort/?DwE3DS5RAiB3mF4TlAOMsLWTCR8pWCQ9GXULnhad', name: '@dig'      , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?h6cii2F9lFZdmIKTILGdGbV2ijJVeRs6s4FwGlg_', name: '@bunjy'    , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?cFyhGp1zWnReol2SP7FVfx-ZtXdNlzoiMphLN2FB', name: '@tyarayuki', account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?XlBdYW5Gc1F3dWRwTX0_dgNTQFSiNw0gclUhYzJl', name: '@aoisan'   , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?GxounTcWUV6KCJ6iOg==',                     name: '@dispace'  , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?d16dD3A8YRp2Hy6eIFFWAXNVP1Q3XRg=',         name: '@kuma'     , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?CAyKapQbBbBxDaIaAguei5gyGAM8DwGdWEoudrWz', name: '@ezaki'    , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?RhpVYYxeIItzPA21AQxYHws_cF0FCJ13inpNUZk3', name: '@necokan'  , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?lLBwbzobtYouXiADAVUinZ4a',                 name: '@fuzioka'  , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?DzyYOn8NAhkYakxwlLewA4s=',                 name: '@dict'     , account: 'tw-account-url', icon: 'tw-icon-url' }, 
    { url: 'https://odenpa.com/sgsort/?LopGMgV_Nxq1jFgBIosCOmE8oHBRd3OwDKKVgC8N', name: '@uekida'   , account: 'tw-account-url', icon: 'tw-icon-url' }, 
];

// スクレイピング処理
const process = url => {
    return new Promise((resolve, reject) => {
        let _ph;
        let _page;
        phantom.create().then(ph => {
            _ph = ph;
            return _ph.createPage();
        }).then(page => {
            _page = page;

            _page.settings = {
                userAgent: ua
            };

            return _page.open(url);
        }).then(status => {
            // console log setup
            _page.property('onConsoleMessage', function (msg) {
                console.log('console: ', msg);
            });

            // site open status logging
            console.log('Opened url?: ', status);

            // start scraping
            _page.evaluate(function () {
                return document.querySelector('html').innerHTML;
            }).then(function (html) {
                const $ = cheerio.load(html);
                const content = $('div.result').html();
                return content;
            }).then(function (rawHtml) {
                resolve({ 'url': url, 'html': rawHtml });
            });
        });
    });
};

// 並行処理の準備
let promises = [];
for (const person of urlList) {
    promises.push(process(person.url, person.name));
}

// 実行
Promise.all(promises).then(result => {
    const fixedResult = [];
    for (let index in result) {
        let replaced = result[index].html + '';

        replaced = replaced.replace(/\.\/img/g, "https://odenpa.com/sgsort/img");

        fixedResult.push({
            'url': urlList[index].url,
            'name': urlList[index].name,
            'account': urlList[index].account,
            'icon': urlList[index].icon,
            'html': replaced
        });
    }

    return fixedResult;
}).then(fixed => {
    fs.writeFile('./result/sgsort-result.json', JSON.stringify(fixed));
});
