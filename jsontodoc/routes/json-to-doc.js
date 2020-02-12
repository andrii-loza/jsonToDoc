var express = require('express');
var router = express.Router();
var path = require('path');
var docx = require('docx-h4');

const fs = require('fs');

const {Document, Paragraph, Table, TableCell, TableRow, TabStopType, TabStopPosition, Section, Run, Packer, TextRun, Footer, Hyperlink} = docx;
const doc = new docx.Document({
    creator: 'author',
    title: 'Sample Document'
    // description: 'A brief example of using docx',
});

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'json.html'));
});

router.post('/send-json', async function (req, res, next) {
    let data = req.body;
    console.log(data);

    setStyles();
    doc.createParagraph(data['template'].title).style('mainHeader');

    data['template'].sections.forEach(section => {
        doc.addParagraph(new Paragraph(new TextRun(section.title.toUpperCase()).break().break()).style('subHeader'));
        section['included_terms'].forEach((term, index) => {
            if(index===0) {
                let par = new Paragraph(new TextRun(term.text).break().break()).style('text');
                doc.addParagraph(par);
            } else {
                let par = new Paragraph(new TextRun(term.text).break()).style('text');
                doc.addParagraph(par);
            }
        });
    });

    doc.Footer.addParagraph(createFooter());

    generateTable(doc);

    const exporter = new docx.LocalPacker(doc);
    exporter.pack('files/test1.docx');

    console.log('SUCCESS');

});

function setStyles() {
    doc.Styles.createParagraphStyle('mainHeader', 'Main Header')
        .basedOn('Normal')
        .next('Normal')
        .font('Calibri')
        .color(`17365d`)
        .size(tipsToPx(26))
        .center()
        .thematicBreak();

    doc.Styles.createParagraphStyle('subHeader', 'Sub Header')
        .center()
        .basedOn('Normal')
        .next('Normal')
        .font('Calibri')
        .size(tipsToPx(14))
        .bold()
        .color('4f81bd');

    doc.Styles.createParagraphStyle('text', 'text')
        .basedOn('Normal')
        .next('Normal')
        .font('Cambria')
        .size(tipsToPx(11))
        .color('black')
        .left();
}

function createFooter() {
    const par = new Paragraph();

    let arr = [];
    arr.push(new TextRun('Document created using '));
    arr.push(new TextRun('DoneDeal.Today').bold());
    arr.push(new TextRun(' app. Get app free by visiting '));
    arr.push(new TextRun(`www.donedeal.today`).underline().break());
    arr.push(new TextRun('Disclaimer ').bold().break().break());
    arr.push(new TextRun('this document provided without no warranties in a „as is“ state. This is not a legal advice,' +
        'parties should carefully review all sections in this document.'));

    arr.forEach(item => par.addRun(item));
    return par.style('text');
}

function generateSplitedPar() {
    let par = new Paragraph('').left();
    let textArr = [];

    textArr.push(new TextRun('Contractor [Title]')
        .font('Calibri (Заголовки)')
        .size(tipsToPx(14))
        .bold()
        .color('4f81bd'));
    textArr.push(new TextRun('Company providing services, JSC').break().break());
    textArr.push(new TextRun('Reg. no. 302695151').break().break());
    textArr.push(new TextRun('Washington Ave. 250 - 50, Chicago, IL,').break().break());
    textArr.push(new TextRun('Illinois, United States of America').break().break());
    textArr.push(new TextRun('________________________________________').break().break());
    textArr.push(new TextRun('Signature').break().break());

    textArr.forEach(item => par.addRun(item));
    par.left();
    return par;
}

function generateTable(doc) {
    const table = doc.createTable(1, 2);
    table.getCell(0, 0).addContent(generateSplitedPar(doc));
    table.getCell(0, 1).addContent(generateSplitedPar(doc));
}

function tipsToPx(num) {
    return num * 2;
}

module.exports = router;
