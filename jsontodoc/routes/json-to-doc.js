var express = require('express');
var router = express.Router();
var path = require('path');

var docx = require('docx-h4');
// import * as fs from "fs";

const fs = require('fs');

const {Document, Paragraph, Table, TableCell, TableRow, TabStopType, TabStopPosition, Section, Run, Packer, TextRun, Footer, Hyperlink} = docx;

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'json.html'));
});

router.post('/send-json', async function (req, res, next) {
    let data = req.body;
    // console.log(data);


    let templateText = `Contractor[Title]  - Company providing services, JSC, company reg. No 302695151, 
    located at Washington Ave. 250 - 50, Chicago, IL, VAT payer code: LT303030000 regulated under the laws of 
    Illinois, United States of America, hereinafter referred to as «CONTRACTOR»,`;

    const doc = new docx.Document({
        creator: 'author',
        title: 'Sample Document'
        // description: 'A brief example of using docx',
    });

    doc.Styles.createParagraphStyle('mainHeader', 'Main Header')
        .basedOn('Normal')
        .next('Normal')
        .font('Calibri (Заголовки)')
        .color(`17365d`)
        .size(tipsToPx(26))
        .center()
        .thematicBreak();


    doc.Styles.createParagraphStyle('subHeader', 'Sub Header')
        .center()
        .basedOn('Normal')
        .next('Normal')
        .font('Calibri (Заголовки)')
        .size(tipsToPx(14))
        .bold()
        .color('4f81bd');

    doc.Styles.createParagraphStyle('text', 'text')
        .basedOn('Normal')
        .next('Normal')
        .font('Cambria (Основний текст)')
        .size(tipsToPx(11))
        .color('black')
        .left();


    doc.Footer.addParagraph(createFooter());

    doc.createParagraph('AGREEMENT OF PROVIDING IT DEVELOPMENT SERVICES').style('mainHeader');
    doc.createParagraph('Parties').style('subHeader');
    doc.createParagraph(templateText).style('text');

    generateTable(doc);

    const exporter = new docx.LocalPacker(doc);
    exporter.pack('files/test1.docx');

    console.log('SUCCESS');

});

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
