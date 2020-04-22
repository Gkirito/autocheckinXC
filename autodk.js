// request Request
(function(callback) {
    "use strict";
    const schedule = require("node-schedule");

    function gettoken(callback) {
        const httpTransport = require("https");
        const responseEncoding = "utf8";
        const httpOptions = {
            hostname: "pa.pkqa.com.cn",
            port: "443",
            path: "/dapi/v2/account/account_service/login",
            method: "POST",
            headers: {
                "App-Code": "X", //这里是学校，根据id来
                "Content-Type": "application/json; charset=utf-8",
            },
        };
        httpOptions.headers["User-Agent"] = "node " + process.version;

        const request = httpTransport
            .request(httpOptions, (res) => {
                let responseBufs = [];
                let responseStr = "";

                res
                    .on("data", (chunk) => {
                        if (Buffer.isBuffer(chunk)) {
                            responseBufs.push(chunk);
                        } else {
                            responseStr = responseStr + chunk;
                        }
                    })
                    .on("end", () => {
                        responseStr =
                            responseBufs.length > 0 ?
                            Buffer.concat(responseBufs).toString(responseEncoding) :
                            responseStr;
                        const obj = JSON.parse(responseStr);
                        callback(obj.data.token);
                    });
            })
            .setTimeout(0)
            .on("error", (error) => {
                callback(error);
            });
        request.write(
            '{"loginName":"","password":"","type":"account"}' //账号密码，为了获取token
        );
        request.end();
    }
    // request Request (2)
    function autodk(token, callback) {
        "use strict";

        const httpTransport = require("https");
        const responseEncoding = "utf8";
        const httpOptions = {
            hostname: "pa.pkqa.com.cn",
            port: "443",
            path: "/dapi/v2/autoform/autoform_service/save_form_input",
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json; charset=utf-8",
            },
        };
        httpOptions.headers["User-Agent"] = "node " + process.version;

        const request = httpTransport
            .request(httpOptions, (res) => {
                let responseBufs = [];
                let responseStr = "";

                res
                    .on("data", (chunk) => {
                        if (Buffer.isBuffer(chunk)) {
                            responseBufs.push(chunk);
                        } else {
                            responseStr = responseStr + chunk;
                        }
                    })
                    .on("end", () => {
                        responseStr =
                            responseBufs.length > 0 ?
                            Buffer.concat(responseBufs).toString(responseEncoding) :
                            responseStr;
                        console.log(new Date() + responseStr);
                        // callback(null, res.statusCode, res.headers, responseStr);
                    });
            })
            .setTimeout(0)
            .on("error", (error) => {
                callback(error);
            });
        request.write(
            '{"bizType":"","groupid":"","value":[{"location":["","",""],"whatColorIsYourHangzhouHealthCode":"greenCode","inWenzhouHuangyanWenlingOrPassOrContactPersonsFromTheAboveAreas":"no","inHubeiOrPassOrComeIntoContactWithPeopleFromHubei":"no","closeContactWithConfirmedOrSuspectedCases":"no","currentLifeSituation":"normalHome","currentHealthCondition":"beInGoodHealth"}]}'
        ); //这里的json如果不了解，建议网页上提交一次签到，拿到请求数据，直接复制过来用（注意格式和转码）
        request.end();
    }
    let job = schedule.scheduleJob("00 01 00 * * *", () => {
        gettoken(autodk);
    });
})();