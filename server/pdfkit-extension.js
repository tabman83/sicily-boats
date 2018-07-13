'use strict';

const PDFDocument = require('pdfkit');
const colPadding = 5;

class PDFDocumentExtended extends PDFDocument {
    constructor (options) {
        super(options);
    }

    formattedText(content, x, y, wrapX, fontName) {
        const left = x || this.page.margins.left;
        const top = y || this.y;
        const options = {};
        if(wrapX) {
            options.width = wrapX;
        }
        this
            .fontSize(this.options.paragraphFontSize)
            .font(fontName || this.options.regularFontName);

        const gRegExp = new RegExp(/(.*?)(\[.*\])(.*)/g);
        const groups = gRegExp.exec(content);
        
        if(groups !== null) {
            this.text(groups[1], left, top, options);
            const mRegExp = new RegExp(/\[(.*?)\]/g);
            const list = [];
            let match = null;
            while((match = mRegExp.exec(groups[2])) != null) {
                list.push(match[1]);
            }
            this.list(list, left, this.y, options);
            this.text(groups[3], left, this.y, options);
        } else {
            this.text(content, left, top, options);
        }
        return this;
    }

    headerText(content) {
        this
            .moveDown()
            .moveDown()
            .fontSize(this.options.headerFontSize)
            .font(this.options.boldFontName)
            .text(content.toUpperCase(), this.page.margins.right, this.y, { align: 'center'})
            .moveTo(this.page.margins.left, this.y - 4)
            .lineTo(this.page.width - this.page.margins.right, this.y - 2)
            .stroke();
        this.y = this.y + 4;
        return this;
    }

    bold() {
        return this.font(this.options.boldFontName);
    }

    regular() {
        return this.font(this.options.regularFontName);
    }

    leftCol(content, value) {
        this
            .fontSize(this.options.paragraphFontSize)
            .font(this.options.boldFontName);

        const text = content + ':';
        const textWidth = this.widthOfString(text);
        const position = this.page.margins.left + 100;
        this
            .text(text, position - textWidth, this.y)
            .moveUp()
            .font(this.options.regularFontName)
            .text(value, position + colPadding, this.y);
        return this;
    }

    twoCol(leftHeader, leftValue, rightHeader, rightValue) {
        const savedY = this.y;
        this.leftCol(leftHeader, leftValue);
        this.y = savedY;
        this.rightCol(rightHeader, rightValue);
        return this;
    }

    rightCol(content, value) {
        this
            .fontSize(this.options.paragraphFontSize)
            .font(this.options.boldFontName);

        const text = content + ':';
        const textWidth = this.widthOfString(text);
        const position = (this.page.width / 2) + 100;
        this
            .text(text, position - textWidth, this.y)
            .moveUp()
            .font(this.options.regularFontName)
            .text(value, position + colPadding, this.y);
        return this;
    }
}

module.exports = PDFDocumentExtended;