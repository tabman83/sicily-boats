const sgMail = require('@sendgrid/mail');
const util = require('util');
const moment = require('moment');

module.exports = function (config, data, attachment) {
    sgMail.setApiKey(config.sendGridApiKey);

    const formattedDate = moment(data.date).format('DD-MM-YYYY');
    const filename = util.format('CONTRATTO_%s_%s.PDF', data.renterName.replace(' ', '_'), formattedDate);
    const htmlContent = util.format('<p>In allegato contratto di %s per %s in data %s.</p>', data.renterName, data.boat.name, formattedDate);
    const subject = util.format('Contratto %s %s', data.renterName, formattedDate);
    const msg = {
        to: config.contractRecipients,
        from: 'contratti@sicilyboats.com',
        subject: subject,
        html: htmlContent,
        attachments: [{
            content: attachment,
            filename: filename,
            type: 'application/pdf',
            disposition: 'attachment',
            content_id: 'contract'
        }]
    };
    sgMail.send(msg);
};