const PDFDocumentExtended = require('./pdfkit-extension');
const language = require('./lang.js');

const titleFontSize = 30;
const headerFontSize = 22;
const paragraphFontSize = 12;
const regularFontName = 'Helvetica';
const boldFontName = 'Helvetica-Bold';


module.exports = function (data, stream) {
    const doc = new PDFDocumentExtended({
        regularFontName: regularFontName,
        boldFontName: boldFontName,
        titleFontSize: titleFontSize,
        headerFontSize: headerFontSize,
        paragraphFontSize: paragraphFontSize
    });
    const text = language.it;

    doc.pipe(stream);

    doc.fontSize(titleFontSize).font(boldFontName).text(text.LEASE_CONTRACT, { align: 'center'});

    doc.fontSize(paragraphFontSize);

    doc.twoCol(text.DATE, data.date, text.REGISTRY_NO, data.registryNumber);

    doc.headerText(text.LEASEHOLDER_DETAILS);
    doc.text(data.rentalDescription);

    doc.headerText(text.BOAT_DETAILS);
    doc.twoCol(text.BOAT_TYPE, data.boat.boatType, text.VIN, data.boat.boatVin);
    doc.twoCol(text.ENGINE, data.boat.engine, text.VIN, data.boat.engineVin);
    doc.twoCol(text.REG_NO, data.boat.registrationNumber, text.TANK, 'LT. ' + data.boat.tankSize);

    doc.headerText(text.CUSTOMER_DETAILS);
    doc.leftCol(text.CUSTOMER_NAME, data.renterName);
    doc.twoCol(text.BIRTH_PLACE, data.birthPlace + '(' + data.birthState + ')', text.BIRTH_DATE, data.birthDate);
    doc.twoCol(text.HOME_TOWN, data.homeTown + '(' + data.homeState + ')', text.HOME_ADDRESS, data.homeAddress);
    doc.twoCol(text.SSN, data.ssn, text.BOAT_LICENSE, data.boatLicense ? data.boatLicenseDetails : text.NO);
    doc.twoCol(text.PHONE, data.phone, text.EMAIL, data.email);
    doc.twoCol(text.ID_TYPE, data.idType, text.ID_NUMBER, data.idNumber);
    doc.twoCol(text.ISSUED_BY, data.idIssuer, text.ISSUE_DATE, data.idIssueDate);

    doc.headerText(text.LEASE_DETAILS);
    doc.twoCol(text.START_DATE, data.startDate, text.END_DATE, data.endDate);
    doc.twoCol(text.START_TIME, data.startTime, text.END_TIME, '');
    doc.twoCol(text.START_FUEL, 'LT.', text.END_FUEL, 'LT.');
    doc.twoCol(text.FUEL_COST, '€/LT. ' + data.fuelCost, text.FUEL_TOTAL, '€');
    doc.twoCol(text.RENT_PRICE, '€ ' + data.rentPrice, text.SECURITY_DEPOSIT, '€ ' + data.securityDeposit);
    doc.twoCol(text.DEPOSIT, '€ ' + data.deposit, text.BALANCE, '€');

        
        
    // doc.addPage().fontSize(25).text('Here is some vector graphics...', 100, 100);

    // doc.save()
    //     .moveTo(100, 150)
    //     .lineTo(100, 250)
    //     .lineTo(200, 250)
    //     .fill("#FF3300");

    // doc.scale(0.6)
    //     .translate(470, -380)
    //     .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    //     .fill('red', 'even-odd')
    //     .restore();

    // doc.addPage()
    //     .fillColor("blue")
    //     .text('Here is a link!', 100, 100)
    //     .underline(100, 100, 160, 27, { color: "#0000FF" })
    //     .link(100, 100, 160, 27, 'http://google.com/');

    doc.end();
};