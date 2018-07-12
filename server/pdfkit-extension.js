'use strict';

const PDFDocument = require('pdfkit');
const leftColStart = 150;
const rightColStart = 350;
const colPadding = 10;

class PDFDocumentExtended extends PDFDocument {
    constructor (options) {
        super(options);
    }

    headerText(content) {
        this
            .moveDown()
            .fontSize(this.options.headerFontSize)
            .font(this.options.boldFontName)
            .text(content, this.page.margins.right, this.y, { align: 'center'})
            .moveTo(this.page.margins.left, this.y - 2)
            .lineTo(this.page.width - this.page.margins.right, this.y - 2)
            .stroke();
        return this;
    }

    leftCol(header, value) {
        this
            .font(this.options.boldFontName)
            .text(header + ':', leftColStart, this.y)
            .moveUp()
            .font(this.options.regularFontName)
            .text(value, leftColStart + colPadding + this.widthOfString(header + ':'), this.y);
        return this;
    }

    twoCol(leftHeader, leftValue, rightHeader, rightValue) {
        this
            .leftCol(leftHeader, leftValue)
            .moveUp()
            .rightCol(rightHeader, rightValue);
        return this;
    }

    rightCol(header, value) {
        this
            .font(this.options.boldFontName)
            .text(header + ':', rightColStart, this.y)
            .moveUp()
            .font(this.options.regularFontName)
            .text(value, rightColStart + colPadding + this.widthOfString(header + ':'), this.y);
        return this;
    }
}

module.exports = PDFDocumentExtended;