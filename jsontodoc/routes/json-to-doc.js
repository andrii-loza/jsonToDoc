var express = require('express');
var router = express.Router();
var path = require('path');
var fileSystem = require('fs');
var docx = require('docx-h4');
var builder = require('docx-builder');

const fs = require('fs');

const {Paragraph, TextRun, Packer} = docx;
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

//todo doc to request

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'json.html'));
});

router.post('/send-json', async function (req, res, next) {
    let data = req.body;

    setStyles();
    generateMainHeader(data['template'].title);
    generateSections(data);
    generateFooter();
    generateTable(doc, data['template'].sections);

    var exporter = new docx.ExpressPacker(doc, res);
    exporter.pack("My First Document");

    doc.save(__dirname + 'files/test1.docx', function (err) {
        if(err) console.log(err);
    })
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
    if (index === 0) {
        return new TextRun(`${mainIndex}.${index + 1} ${str}`).break().break();
    } else {
        return new TextRun(`${mainIndex}.${index + 1} ${str}`).break();
    }
}

function generateSections(data) {
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
}

function generateMainHeader(str) {
    doc.createParagraph(str).style('mainHeader');
}

function generateFooter() {
    doc.Footer.addParagraph(createFooter());
}

function generateTextRun(str) {
    return new TextRun(str).break().break();
}

function generateSubHeader(section, index) {
    if (index === 0) {
        doc.addParagraph(
            new Paragraph(new TextRun(section.title.toUpperCase()).break())
                .style('subHeader')
        )
    } else {
        doc.addParagraph(
            new Paragraph(new TextRun(`${index + 1}. ${section.title.toUpperCase()}`))
                .style('subHeader')
        );
    }
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

function generateSplitedPar(term) {
    const {parts} = term;

    let par = new Paragraph(''),
        textArr = [];

    parts.forEach((part, index) => {
        if (index === 0) {
            textArr.push(new TextRun(part.text)
                .font('Calibri')
                .size(tipsToPx(14))
                .bold()
                .color('4f81bd'));
        } else {
            textArr.push(generateTextRun(part.text));
        }
    });

    textArr.push(generateTextRun(''));
    textArr.push(generateTextRun('________________________________________'));
    textArr.push(generateTextRun('Signature'));

    textArr.forEach(item => par.addRun(item));
    par.left().style('text');
    return par;
}

function generateTable(doc, data) {
    let {included_terms} = data[data.length - 1];
    const table = doc.createTable(1, 2);
    //todo margin between cells

    for (let i = 0; i < 2; i++) {
        table.getCell(0, i).addContent(generateSplitedPar(included_terms[i]));
    }
}

function tipsToPx(num) {
    return num * 2;
}

module.exports = router;
