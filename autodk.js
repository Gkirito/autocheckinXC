// request Request
(function(callback) {
    "use strict";
    const schedule = require("node-schedule");

    const appCode = ""; //这里是学校，根据sid来
    const studentId = ""; //学号
    const password = ""; //密码
    const province = ""; //省（中文）
    const city = ""; //市（中文）
    const district = ""; //区（中文）
    let token = "";

    function gettoken(callback) {
        const httpTransport = require("https");
        const responseEncoding = "utf8";
        const httpOptions = {
            hostname: "pa.pkqa.com.cn",
            port: "443",
            path: "/dapi/v2/account/account_service/login",
            method: "POST",
            headers: {
                "App-Code": appCode,
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
                        // console.log(obj);
                        callback(obj.data.token);
                    });
            })
            .setTimeout(0)
            .on("error", (error) => {
                callback(error);
            });
        request.write(
            '{"loginName":"' + studentId + '","password":"' + password + '","type":"account"}'
        );
        request.end();
    }
    // request Request (2)
    function autodk(groupid, bizType, callback) {

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
                        console.log(studentId + " -> " + new Date() + " -> " + responseStr);
                        // callback(null, res.statusCode, res.headers, responseStr);
                    });
            })
            .setTimeout(0)
            .on("error", (error) => {
                callback(error);
            });
        request.write(
            '{"bizType":"' + bizType + '","groupid":"' + groupid + '","value":[{"location":["' + province + '","' + city + '","' + district + '"],"whatColorIsYourHangzhouHealthCode":"greenCode","inWenzhouHuangyanWenlingOrPassOrContactPersonsFromTheAboveAreas":"no","inHubeiOrPassOrComeIntoContactWithPeopleFromHubei":"no","closeContactWithConfirmedOrSuspectedCases":"no","currentLifeSituation":"normalHome","currentHealthCondition":"beInGoodHealth","whetheryouhavestayedinheilongjiang":"no"}]}'
        );
        request.end();
    }

    function getThemeId(callback) {

        const httpTransport = require('https');
        const responseEncoding = 'utf8';
        const httpOptions = {
            hostname: 'pa.pkqa.com.cn',
            port: '443',
            path: '/dapi/v2/form/daily_check_in_service/find_all_valid_themes_with_self',
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token,
                "App-Code": appCode,
                "Content-Type": "application/json; charset=utf-8"
            }
        };
        httpOptions.headers['User-Agent'] = 'node ' + process.version;

        const request = httpTransport.request(httpOptions, (res) => {
                let responseBufs = [];
                let responseStr = '';

                res.on('data', (chunk) => {
                    if (Buffer.isBuffer(chunk)) {
                        responseBufs.push(chunk);
                    } else {
                        responseStr = responseStr + chunk;
                    }
                }).on('end', () => {
                    responseStr = responseBufs.length > 0 ?
                        Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
                    const obj = JSON.parse(responseStr);
                    // console.log(obj.data[0].id);
                    callback(obj.data[0].id);
                });

            })
            .setTimeout(0)
            .on('error', (error) => {
                callback(error);
            });
        request.write("{}")
        request.end();


    }

    function getGroupID(themeId, callback) {

        const httpTransport = require('https');
        const responseEncoding = 'utf8';
        const httpOptions = {
            hostname: 'pa.pkqa.com.cn',
            port: '443',
            path: '/dapi/v2/form/daily_check_in_service/find_item_by_theme_id_and_date_with_self',
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json; charset=utf-8"
            }
        };
        httpOptions.headers['User-Agent'] = 'node ' + process.version;


        const request = httpTransport.request(httpOptions, (res) => {
                let responseBufs = [];
                let responseStr = '';

                res.on('data', (chunk) => {
                    if (Buffer.isBuffer(chunk)) {
                        responseBufs.push(chunk);
                    } else {
                        responseStr = responseStr + chunk;
                    }
                }).on('end', () => {
                    responseStr = responseBufs.length > 0 ?
                        Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
                    const obj = JSON.parse(responseStr);
                    callback(obj.data.group.id, obj.data.group.bizType);
                });

            })
            .setTimeout(0)
            .on('error', (error) => {
                callback(error);
            });
        request.write("{\"themeId\":\"" + themeId + "\",\"date\":" + new Date().getTime() + "}")
        request.end();


    }
    let job = schedule.scheduleJob("00 01 00 * * *", () => {
        gettoken((callback) => {
            token = callback;
            getThemeId((themeid) => {
                getGroupID(themeid, (groupid, bizType) => {
                    autodk(groupid, bizType);
                });
            });
        });
    });
})();