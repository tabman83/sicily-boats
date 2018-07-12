const PDFDocumentExtended = require('./pdfkit-extension');
const language = require('./lang.js');

const titleFontSize = 22;
const headerFontSize = 14;
const paragraphFontSize = 10;
const regularFontName = 'Helvetica';
const boldFontName = 'Helvetica-Bold';


module.exports = function (data, stream) {
    const doc = new PDFDocumentExtended({
        size: 'A4',
        margins: {
            left: 40,
            top: 25,
            bottom: 25,
            right: 40
        },
        regularFontName: regularFontName,
        boldFontName: boldFontName,
        titleFontSize: titleFontSize,
        headerFontSize: headerFontSize,
        paragraphFontSize: paragraphFontSize
    });
    const text = language.it;

    doc.pipe(stream);

    doc.on('pageAdded', () => {
        
    });

    doc.fontSize(titleFontSize).font(boldFontName).text(text.LEASE_CONTRACT.toUpperCase(), { align: 'center'});

    doc.fontSize(paragraphFontSize);

    doc.twoCol(text.DATE, data.date, text.REGISTRY_NO, data.registryNumber);

    doc.headerText(text.LEASEHOLDER_DETAILS);
    doc.fontSize(paragraphFontSize).font(regularFontName).text(data.rentalDescription, { align: 'center'});

    doc.headerText(text.BOAT_DETAILS);
    doc.twoCol(text.BOAT_TYPE, data.boat.boatType, text.VIN, data.boat.boatVin);
    doc.twoCol(text.ENGINE, data.boat.engine, text.VIN, data.boat.engineVin);
    doc.twoCol(text.REG_NO, data.boat.registrationNumber, text.TANK, 'LT. ' + data.boat.tankSize);

    doc.headerText(text.CUSTOMER_DETAILS);
    doc.leftCol(text.CUSTOMER_NAME, data.renterName);
    doc.twoCol(text.BIRTH_PLACE, data.birthPlace + '(' + data.birthState + ')', text.BIRTH_DATE, data.birthDate);
    doc.twoCol(text.HOME_TOWN, data.homeTown + '(' + data.homeState + ')', text.HOME_ADDRESS, data.homeAddress);
    doc.twoCol(text.SSN, data.ssn, text.BOAT_LICENSE, data.boatLicense ? data.boatLicenseDetails : text.NONE);
    doc.twoCol(text.PHONE, data.phone, text.EMAIL, data.email);
    doc.twoCol(text.ID_TYPE, data.idType, text.ID_NUMBER, data.idNumber);
    doc.twoCol(text.ISSUED_BY, data.idIssuer, text.ISSUE_DATE, data.idIssueDate);

    doc.headerText(text.LEASE_DETAILS);
    doc.twoCol(text.START_DATE, data.startDate, text.END_DATE, data.endDate);
    doc.twoCol(text.START_TIME, data.startTime, text.END_TIME, ' ');
    doc.twoCol(text.START_FUEL, 'LT.', text.END_FUEL, 'LT.');
    doc.twoCol(text.FUEL_COST, '€/LT. ' + data.fuelCost, text.FUEL_TOTAL, '€');
    doc.twoCol(text.RENT_PRICE, '€ ' + data.rentPrice, text.SECURITY_DEPOSIT, '€ ' + data.securityDeposit);
    doc.twoCol(text.DEPOSIT, '€ ' + data.deposit, text.BALANCE, '€');

        

    doc.end();
};