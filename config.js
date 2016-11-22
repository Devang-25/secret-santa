module.exports = {
    mailgunUsername: process.env.MG_USER || 'api',
    mailgunPassword: process.env.MG_PW || '<your mailgun api key>',
    mailgunDomain: process.env.MG_DOMAIN || '<your mailgun domain>'
};