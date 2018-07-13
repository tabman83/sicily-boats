const util = require('util');
const PDFDocumentExtended = require('./pdfkit-extension');
const language = require('./lang.js');

const titleFontSize = 18;
const headerFontSize = 13;
const paragraphFontSize = 10;
const regularFontName = 'Helvetica';
const boldFontName = 'Helvetica-Bold';

const arrayFormat = function(input) {
    const result = [];
    const params = Array.prototype.slice.call(arguments, 1);
    let globalCount = 0;
    input.forEach(element => {
        const count = (typeof element === 'string' ? (element.match(/%s/g) || []).length : 0);
        if(count > 0) {
            const utilArgs = params.slice(globalCount, globalCount + count);
            utilArgs.unshift(element);
            const line = util.format.apply(util, utilArgs);
            globalCount += count;
            result.push(line);
        } else {
            result.push(element);
        }
    });
    return result;
}

module.exports = function (data, stream) {

    const printSignatures = function() {
        savedY = doc.y + 60;
        doc.fontSize(paragraphFontSize).font(boldFontName)
        doc.text(text.THE_CUSTOMER, doc.page.margins.left, savedY, { align: 'center', width: (doc.page.width / 2) - doc.page.margins.left });
        doc.text(text.THE_LEASEHOLDER, (doc.page.width / 2), savedY, { align: 'center', width: (doc.page.width / 2) - doc.page.margins.right});
    
        savedY = doc.y + 10;
        doc.fontSize(paragraphFontSize).font(regularFontName)
        doc.text(data.renterName, doc.page.margins.left, savedY, { align: 'center', width: (doc.page.width / 2) - doc.page.margins.left });
        doc.text(data.rentalName, (doc.page.width / 2), savedY, { align: 'center', width: (doc.page.width / 2) - doc.page.margins.right});
    }

    const doc = new PDFDocumentExtended({
        size: 'A4',
        margins: {
            left: 40,
            top: 40,
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
    let savedY = doc.y;

    doc.pipe(stream);

    doc.on('pageAdded', () => {
        
    });

    doc.image('dist/assets/logo_wide.png', (doc.page.width / 2) - 110, 40, { width: 220 }).moveDown();
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

    doc.moveDown();
    doc.moveDown();
    savedY = doc.y;
    const padding = 10;
    const pageWidth = doc.page.width - doc.page.margins.right - doc.page.margins.left;
    doc.formattedText(text.AGREEMENT, doc.page.margins.left + padding, doc.y + padding, pageWidth - padding - padding, boldFontName);
    doc.rect(doc.page.margins.left, savedY, doc.page.width - doc.page.margins.right - doc.page.margins.left, doc.y - savedY + padding).stroke();

    // firme locatario e conduttore
    printSignatures();
    // end firme locatario e conduttore

    doc.addPage();
    doc.headerText(text.BUSINESS_INFO_DESC);
    doc.fontSize(paragraphFontSize).font(regularFontName).text(util.format(text.RENTER_DECLARATION, data.renterName, data.birthPlace, data.birthState, data.birthDate, data.homeTown, data.homeState, data.homeAddress));
    
    doc.moveDown();
    doc.twoCol(text.BOAT_TYPE_DESC, data.boat.detailedBoatType, text.BOAT_BRAND, data.boat.detailedBrand);
    doc.twoCol(text.BOAT_MODEL, data.boat.detailedModel, text.BOAT_CERT, data.boat.ceCertification);
    doc.twoCol(text.BOAT_LENGTH, data.boat.length, text.BOAT_PEOPLE, data.boat.people);
    doc.twoCol(text.BOAT_WEIGHT, data.boat.weight, text.BOAT_ENGINES, 'n. 1');
    doc.twoCol(text.ENGINE_BRAND, data.boat.engineBrand, text.ENGINE_POWER, data.boat.enginePower);
    doc.twoCol(text.ENGINE_VIN, data.boat.engineVin, text.ENGINE_POWER, data.boat.insurer);
    doc.twoCol(text.INSURANCE_NO, data.boat.insuranceNumber, text.INSURANCE_EXP, data.boat.insuranceExpiration);
    doc.rightCol(text.OTHER_CERT, data.boat.otherCertification);
    
    doc.moveDown();
    doc.fontSize(headerFontSize).font(boldFontName).text(text.I_STATE.toUpperCase(), doc.page.margins.left, doc.y, { align: 'center', width: doc.page.width - doc.page.margins.right - doc.page.margins.left });
    doc.moveDown();
    
    const boatLicense = data.boatLicense ? util.format(text.BOAT_LICENSE_YES, data.boatLicenseDetails) : text.BOAT_LICENSE_NO;
    const l = arrayFormat(text.STATEMENT, boatLicense, data.emergencyContacts, data.idType, data.idNumber);
    doc.fontSize(paragraphFontSize).font(regularFontName).list(arrayFormat(text.STATEMENT, boatLicense, data.emergencyContacts, data.idType, data.idNumber));

    // firme locatario e conduttore
    printSignatures();
    // end firme locatario e conduttore

    doc.addPage();
    
    doc.end();
};