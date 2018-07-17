const util = require('util');
const moment = require('moment');
const PDFDocumentExtended = require('./pdfkit-extension');
const language = require('./lang.js');

const titleFontSize = 18;
const headerFontSize = 13;
const paragraphFontSize = 10;
const regularFontName = 'Helvetica';
const boldFontName = 'Helvetica-Bold';
const dateFormat = 'DD/MM/YYYY';
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
        autoFirstPage: false,
        size: 'A4',
        margins: {
            left: 40,
            top: 60,
            bottom: 50,
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
    let pageNum = 0;
    doc.pipe(stream);
    
    doc.on('pageAdded', () => {
        pageNum++;
        let bottom = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc.fontSize(paragraphFontSize - 5).regular().text(`${data.rentalDescription}`,
            0.5 * (doc.page.width - 500),
            doc.page.height - 25, {
                width: 500,
                align: 'center',
                lineBreak: false,
            });

        // Reset text writer position
        doc.text('', doc.page.margins.left, doc.page.margins.top);
        doc.page.margins.bottom = bottom;
        
        if(pageNum > 1) {
            doc.image('dist/assets/logo_wide.png', (doc.page.width / 2) - 50, 30, { width: 100 });
        }
    });

    doc.addPage();
    doc.image('dist/assets/logo_wide.png', (doc.page.width / 2) - 110, 40, { width: 220 });
    doc.fontSize(titleFontSize).font(boldFontName).text(text.LEASE_CONTRACT.toUpperCase(), doc.x, doc.y + 50, { align: 'center'});

    doc.fontSize(paragraphFontSize);

    doc.twoCol(text.DATE, moment(data.date).format(dateFormat), text.REGISTRY_NO, data.registryNumber);

    doc.headerText(text.LEASEHOLDER_DETAILS);
    doc.fontSize(paragraphFontSize).font(regularFontName).text(data.rentalDescription, { align: 'center'});

    doc.headerText(text.BOAT_DETAILS);
    doc.twoCol(text.BOAT_TYPE, data.boat.boatType, text.VIN, data.boat.boatVin);
    doc.twoCol(text.ENGINE, data.boat.engine, text.VIN, data.boat.engineVin);
    doc.twoCol(text.REG_NO, data.boat.registrationNumber, text.TANK, 'LT. ' + data.boat.tankSize);

    doc.headerText(text.CUSTOMER_DETAILS);
    doc.leftCol(text.CUSTOMER_NAME, data.renterName);
    doc.twoCol(text.BIRTH_PLACE, data.birthPlace + '(' + data.birthState + ')', text.BIRTH_DATE, moment(data.birthDate).format(dateFormat));
    doc.twoCol(text.HOME_TOWN, data.homeTown + '(' + data.homeState + ')', text.HOME_ADDRESS, data.homeAddress);
    doc.twoCol(text.SSN, data.ssn, text.BOAT_LICENSE, data.boatLicense ? data.boatLicenseDetails : text.NONE);
    doc.twoCol(text.PHONE, data.phone, text.EMAIL, data.email);
    doc.twoCol(text.ID_TYPE, data.idType, text.ID_NUMBER, data.idNumber);
    doc.twoCol(text.ISSUED_BY, data.idIssuer, text.ISSUE_DATE, moment(data.idIssueDate).format(dateFormat));

    doc.headerText(text.LEASE_DETAILS);
    doc.twoCol(text.START_DATE, data.startDate, text.END_DATE, moment(data.endDate).format(dateFormat));
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
    doc.fontSize(paragraphFontSize).font(regularFontName).text(util.format(text.RENTER_DECLARATION, data.renterName, data.birthPlace, data.birthState, moment(data.birthDate).format(dateFormat), data.homeTown, data.homeState, data.homeAddress));
    
    doc.moveDown();
    doc.twoCol(text.BOAT_TYPE_DESC, data.boat.detailedBoatType, text.BOAT_BRAND, data.boat.detailedBrand);
    doc.twoCol(text.BOAT_MODEL, data.boat.detailedModel, text.BOAT_CERT, data.boat.ceCertification);
    doc.twoCol(text.BOAT_LENGTH, data.boat.length, text.BOAT_PEOPLE, data.boat.people);
    doc.twoCol(text.BOAT_WEIGHT, data.boat.weight, text.BOAT_ENGINES, 'n. 1');
    doc.twoCol(text.ENGINE_BRAND, data.boat.engineBrand, text.ENGINE_POWER, data.boat.enginePower);
    doc.twoCol(text.ENGINE_VIN, data.boat.engineVin, text.ENGINE_POWER, data.boat.insurer);
    doc.twoCol(text.INSURANCE_NO, data.boat.insuranceNumber, text.INSURANCE_EXP, data.boat.insuranceExpiration);
    doc.rightCol(text.OTHER_CERT, data.boat.otherCertification);
    
    doc.moveDown(2);
    doc.fontSize(headerFontSize).font(boldFontName).text(text.I_STATE.toUpperCase(), doc.page.margins.left, doc.y, { align: 'center', width: doc.page.width - doc.page.margins.right - doc.page.margins.left });
    doc.moveDown(2);
    
    const boatLicense = data.boatLicense ? util.format(text.BOAT_LICENSE_YES, data.boatLicenseDetails) : text.BOAT_LICENSE_NO;
    doc.fontSize(paragraphFontSize).font(regularFontName).list(arrayFormat(text.STATEMENT, boatLicense, data.emergencyContacts, data.idType, data.idNumber));

    // firme locatario e conduttore
    printSignatures();
    // end firme locatario e conduttore

    doc.addPage();

    doc.headerText(text.BOAT_TERMS);
    doc.twoCol(text.DATE, moment(data.date).format(dateFormat), text.REGISTRY_NO, data.registryNumber);

    doc.headerText(text.BOAT_DETAILS);
    doc.twoCol(text.BOAT_TYPE, data.boat.boatType, text.VIN, data.boat.boatVin);
    doc.twoCol(text.ENGINE, data.boat.engine, text.VIN, data.boat.engineVin);
    doc.twoCol(text.REG_NO, data.boat.registrationNumber, text.TANK, 'LT. ' + data.boat.tankSize);

    doc.headerText(text.BOAT_CUSTODY_TERMS);

    doc.fontSize(paragraphFontSize - 2);

    doc.font(boldFontName).text(text.BOAT_CUSTODY_TERMS_STRUCTURAL);
    doc.font(regularFontName).text(data.boat.descStructural);
    doc.moveDown();

    doc.font(boldFontName).text(text.BOAT_CUSTODY_TERMS_CUSHIONS);
    doc.font(regularFontName).text(data.boat.descCushions);
    doc.moveDown();

    doc.font(boldFontName).text(text.BOAT_CUSTODY_TERMS_EQUIPMENT);
    doc.font(regularFontName).text(data.boat.descEquipment);
    doc.moveDown();

    doc.font(boldFontName).text(text.BOAT_CUSTODY_TERMS_ENGINE);
    doc.font(regularFontName).text(data.boat.descEngine);
    doc.moveDown();

    doc.font(boldFontName).text(text.BOAT_CUSTODY_TERMS_FACILITIES);
    doc.font(regularFontName).text(data.boat.descFacilities);
    doc.moveDown();

    doc.moveDown();
    doc.fontSize(paragraphFontSize);
    doc.text(text.BOAT_CUSTODY_DECLARATION)

    // firme locatario e conduttore
    printSignatures();
    // end firme locatario e conduttore

    doc.addPage();


    doc.headerText(text.PRIVACY_TITLE);
    doc.font(regularFontName).fontSize(paragraphFontSize - 2);

    doc.text(text.PRIVACY_HEADER_1).moveDown().text(text.PRIVACY_HEADER_2).moveDown();

    doc.bold().text(text.PRIVACY_CONTENT_TITLE_1).regular().text(text.PRIVACY_CONTENT_TEXT_1).moveDown();
    doc.bold().text(text.PRIVACY_CONTENT_TITLE_2).regular().text(text.PRIVACY_CONTENT_TEXT_2).moveDown();
    doc.bold().text(text.PRIVACY_CONTENT_TITLE_3).regular().text(text.PRIVACY_CONTENT_TEXT_3).moveDown();
    doc.bold().text(text.PRIVACY_CONTENT_TITLE_4).regular().text(text.PRIVACY_CONTENT_TEXT_4).moveDown();
    doc.bold().text(text.PRIVACY_CONTENT_TITLE_5).regular().text(util.format(text.PRIVACY_CONTENT_TEXT_5, data.rentalDescription)).moveDown();    
    doc.bold().text(text.PRIVACY_CONTENT_TITLE_6).regular().text(text.PRIVACY_CONTENT_TEXT_6_1).list(text.PRIVACY_CONTENT_TEXT_6_2).moveDown();

    doc.text(util.format(text.PRIVACY_FOOTER_1, data.rentalDescription, data.rentalEmail));
    doc.moveDown();

    doc.fontSize(paragraphFontSize);
    doc.text(text.PRIVACY_FOOTER_2);
    doc.moveDown();
    doc.text(text.PRIVACY_FOOTER_3);

    let middleY = null;
    let agreeWidth = doc.widthOfString(text.PRIVACY_AGREE.toUpperCase());
    doc.moveDown();
    savedY = doc.y;
    doc.moveDown();
    middleY = doc.y;
    doc.text(text.PRIVACY_AGREE.toUpperCase(), doc.page.margins.left, middleY);
    doc.fontSize(paragraphFontSize + 10).text('X', doc.page.margins.left + agreeWidth/2, middleY - 3).fontSize(paragraphFontSize);
    doc.text(text.PRIVACY_DISAGREE.toUpperCase(), 175, middleY);
    doc.text(text.PRIVACY_AGREEMENT_1, 350, savedY);

    doc.moveDown();
    savedY = doc.y;
    doc.moveDown();
    middleY = doc.y;
    doc.text(text.PRIVACY_AGREE.toUpperCase(), doc.page.margins.left, middleY);
    doc.fontSize(paragraphFontSize + 10).text('X', doc.page.margins.left + agreeWidth/2, middleY - 3).fontSize(paragraphFontSize);
    doc.text(text.PRIVACY_DISAGREE.toUpperCase(), 175, middleY);
    doc.text(text.PRIVACY_AGREEMENT_2, 350, savedY);

    doc.moveDown();
    savedY = doc.y;
    doc.moveDown();
    middleY = doc.y;
    doc.text(text.PRIVACY_AGREE.toUpperCase(), doc.page.margins.left, middleY);
    doc.fontSize(paragraphFontSize + 10).text('X', doc.page.margins.left + agreeWidth/2, middleY - 3).fontSize(paragraphFontSize);
    doc.text(text.PRIVACY_DISAGREE.toUpperCase(), 175, middleY);
    doc.text(text.PRIVACY_AGREEMENT_3, 350, savedY);


    // firme locatario e conduttore
    printSignatures();
    // end firme locatario e conduttore

    doc.addPage();

    doc.headerText(text.RENTAL_TERMS);
    
    doc.fontSize(paragraphFontSize - 4);

    doc.bold().text(text.RENTAL_TERMS_1_TITLE);
    doc.regular().text(text.RENTAL_TERMS_1_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_2_TITLE);
    doc.regular().text(text.RENTAL_TERMS_2_DESC_1);
    doc.regular().list(text.RENTAL_TERMS_2_DESC_2);
    doc.regular().text(text.RENTAL_TERMS_2_DESC_3);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_3_TITLE);
    doc.regular().text(text.RENTAL_TERMS_3_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_4_TITLE);
    doc.regular().text(text.RENTAL_TERMS_4_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_5_TITLE);
    doc.regular().text(text.RENTAL_TERMS_5_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_6_TITLE);
    doc.regular().text(text.RENTAL_TERMS_6_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_7_TITLE);
    doc.regular().text(text.RENTAL_TERMS_7_DESC_1);
    doc.regular().list(text.RENTAL_TERMS_7_DESC_2);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_8_TITLE);
    doc.regular().text(text.RENTAL_TERMS_8_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_9_TITLE);
    doc.regular().text(text.RENTAL_TERMS_9_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_10_TITLE);
    doc.regular().text(text.RENTAL_TERMS_10_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_11_TITLE);
    doc.regular().text(util.format(text.RENTAL_TERMS_11_DESC, data.fuelCost));
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_12_TITLE);
    doc.regular().text(text.RENTAL_TERMS_12_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_13_TITLE);
    doc.regular().text(text.RENTAL_TERMS_13_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_14_TITLE);
    doc.regular().text(text.RENTAL_TERMS_14_DESC_1);
    doc.regular().list(text.RENTAL_TERMS_14_DESC_2);
    doc.regular().text(text.RENTAL_TERMS_14_DESC_3);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_15_TITLE);
    doc.regular().text(text.RENTAL_TERMS_15_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_16_TITLE);
    doc.regular().text(text.RENTAL_TERMS_16_DESC_1);
    doc.regular().list(text.RENTAL_TERMS_16_DESC_2);
    doc.regular().text(text.RENTAL_TERMS_16_DESC_3);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_17_TITLE);
    doc.regular().text(text.RENTAL_TERMS_17_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_18_TITLE);
    doc.regular().text(text.RENTAL_TERMS_18_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_19_TITLE);
    doc.regular().text(text.RENTAL_TERMS_19_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_20_TITLE);
    doc.regular().text(text.RENTAL_TERMS_20_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_21_TITLE);
    doc.regular().text(text.RENTAL_TERMS_21_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_22_TITLE);
    doc.regular().text(text.RENTAL_TERMS_22_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_23_TITLE);
    doc.regular().text(text.RENTAL_TERMS_23_DESC);
    doc.moveDown();

    doc.bold().text(text.RENTAL_TERMS_24_TITLE);
    doc.regular().text(text.RENTAL_TERMS_24_DESC);
    doc.moveDown();

    // firme locatario e conduttore
    printSignatures();
    // end firme locatario e conduttore


    doc.bold().fontSize(paragraphFontSize).text(text.RENTAL_TERMS_FOOTER, doc.page.margins.left, doc.y + 50);

    // firme locatario e conduttore
    printSignatures();
    // end firme locatario e conduttore
    

    doc.end();
};