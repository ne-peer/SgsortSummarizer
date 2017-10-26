const fs = require("fs");

const generateDate = '2017.10.26';
const template = `
<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.css.map">
</head>

<body>
    <section class="hero is-medium is-primary is-bold">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    Cgsort Result
                </h1>
                <h2 class="subtitle">
                    ${generateDate}
                </h2>
            </div>
        </div>
    </section>
    <div class="columns is-mobile" style="overflow-x: scroll;">
        __SUMMARY__
    </div>
</body>

<footer class="footer">
<div class="container">
    <div class="content has-text-centered">
        <p>
            This page by
            <a href="https://ne-peer.com">Necokan</a>.
            <p>
                Great original - <a href="https://odenpa.com/sgsort/">デレステ キャラソート</a>
            </p>
        </p>
    </div>
</div>
</footer>

</html>`;

const resultTemplate = `
<div class="column">
    <div class="box">
        <article class="media">
            <div class="media-left">
                <figure class="image is-64x64">
                    <img src="__ICON__" alt="Image">
                </figure>
            </div>
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>__NAME__</strong>
                        <small>__ACCOUNT__</small>
                        
                    </p>
                    <a href="__URL__" target="_blank" class="has-text-primary is-size-7">
                        __URL__
                    </p>
                </div>
            </div>
        </article>
        <div>
            __RESULT__
        </div>
    </div>
</div>
`;

// json読み込み
const resultJson = JSON.parse(fs.readFileSync('./result/sgsort-result.json', 'utf8'));

const resultDocList = [];
for (const person of resultJson) {
    let doc = resultTemplate;
    doc = doc.replace(/__NAME__/g, person.name);
    doc = doc.replace(/__URL__/g, person.url);
    doc = doc.replace(/__RESULT__/g, person.html);
    resultDocList.push(doc);
}

const summary = resultDocList.join('');
const summaryHtml = template.replace(/__SUMMARY__/g, summary);

fs.writeFile('./result/summarized-result.html', summaryHtml);