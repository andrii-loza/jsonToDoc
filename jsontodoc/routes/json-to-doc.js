var express = require('express');
var router = express.Router();
var path = require('path');
var docx = require('docx-h4');

const fs = require('fs');

const {Document, Paragraph, AlignmentType, Table, TableCell, TableRow, TabStopType, TabStopPosition, Section, Run, Packer, TextRun, Footer, Hyperlink} = docx;
const doc = new docx.Document({
    creator: 'author',
    title: 'Sample Document',
    numbering: {
        config: [
            {
                reference: 'numbering',
                levels: [
                    {
                        level: 0,
                        format: 'upperRoman',
                        text: '%1',
                        alignment: 'start',
                        style: {
                            paragraph: {
                                indent: {left: 2880, hanging: 2420},
                            },
                        },
                    }
                ]
            }
        ]
    }
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

    data['template'].sections.forEach((section, index) => {
        generateSubHeader(section, index);
        let mainIndex = index + 1;

        section['included_terms'].forEach((term, index) => {
            if (index === 0) {
                let par = new Paragraph(generateNumberingTextRun(term.text, mainIndex, index)).style('text');
                doc.addParagraph(par);
            } else {
                let par = new Paragraph(generateNumberingTextRun(term.text, mainIndex, index)).style('text');
                doc.addParagraph(par);
            }
        });
        doc.addParagraph(new Paragraph(generateTextRun('')));
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

function generateNumberingTextRun(str, mainIndex, index) {
    if (index) {
        return new TextRun(`${mainIndex}.${index + 1} ${str}`).break().break();
    } else {
        return new TextRun(`${mainIndex}.${index + 1} ${str}`).break();
    }
}

function generateTextRun(str) {
    return new TextRun(str).break().break();
}

function generateSubHeader(section, index) {
    if (index === 0) doc.addParagraph(
        new Paragraph(new TextRun(section.title.toUpperCase()).break()).style('subHeader')
    );
    else doc.addParagraph(
        new Paragraph(new TextRun(section.title.toUpperCase()))
            .style('subHeader').setCustomNumbering(1, 0)
    );
}

function createFooter() {
    const par = new Paragraph();

    let arr = [];
    arr.push(new TextRun('Document created using '));
    arr.push(new TextRun('DoneDeal.Today')
        .bold());
    arr.push(new TextRun(' app. Get app free by visiting '));
    arr.push(new TextRun(`www.donedeal.today`)
        .underline()
        .break());
    // arr.push(new TextRun(new Hyperlink('www.donedeal.today')).break());
    //todo hyperlink
    arr.push(new TextRun('Disclaimer: ')
        .bold()
        .break()
        .break());
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
    textArr.push(generateTextRun('Company providing services, JSC'));
    textArr.push(generateTextRun('Reg. no. 302695151'));
    textArr.push(generateTextRun('Washington Ave. 250 - 50, Chicago, IL,'));
    textArr.push(generateTextRun('Illinois, United States of America'));
    textArr.push(generateTextRun('________________________________________'));
    textArr.push(generateTextRun('Signature'));

    textArr.forEach(item => par.addRun(item));
    par.left();
    return par;
}

function generateTable(doc) {
    //todo margin between cells

    const table = doc.createTable(1, 2);
    table.getCell(0, 0).addContent(generateSplitedPar());
    table.getCell(0, 1).addContent(generateSplitedPar());
}

function tipsToPx(num) {
    return num * 2;
}

module.exports = router;
