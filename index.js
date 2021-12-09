var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });
// var DynamoDB = new aws.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    let msg = JSON.parse(event.Records[0].Sns.Message);
    if(!msg.verified) {
        sendEmail(msg);
    }
}

var sendEmail = (data) => {

    let link = `https://${data.domainName}/v1/verifyUserEmail?email=${data.username}&token=${data.token}`;

    let body = "Hi "+ data.first_name +",\n\n"+
    "You created a profile on our application, You need to verify that this is your email address before using your account by clicking on this link:" +"\n\n\n"+
    "Regards,"+data.username+"\n\n\n"+
    link
    let from = "noreply@"+data.domainName
    let emailBody = {
        Destination: {
            ToAddresses: [data.username],
        },
        Message: {
            Body: {
                Text: { Data: body },
            },
            Subject: { Data: "User Account Verification Email" },
        },
        Source: from,
    };

    let sendEmailProm = ses.sendEmail(emailBody).promise()
    sendEmailProm
        .then(function(result) {
            console.log(result);
        })
        .catch(function(err) {
            console.error(err, err.stack);
        });
}