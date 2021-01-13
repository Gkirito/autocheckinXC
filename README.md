# autocheckinXC
学程自动打卡脚本

### Apple设备可以使用以下捷径，直接在自己的手机或者iPad上创建自动化，无需电脑或者服务器部署
[https://www.icloud.com/shortcuts/73a1887c7ada42d8b50a7973e3082d59](https://www.icloud.com/shortcuts/73a1887c7ada42d8b50a7973e3082d59)

保存捷径后，根据两个注释，填入学校、账号、密码、打卡情况

> 网页版学程[https://pa.pkqa.com.cn](https://pa.pkqa.com.cn)

1. 学校

   ``` js
   const appCode = ""; //这里是学校，根据sid来
   ```
   
   `App-Code`就是学校代码，编号来自网页版，注意是填写`sid号`
   
   <img src="https://libget.com/gkirito/blog/image/2020/image-20200422131503489.png" alt="image-20200422131503489" style="zoom:50%;" />
   
2. 账号密码

   ``` js
   const studentId = ""; //学号
   const password = ""; //密码
   ```
   
账号密码为了获取token
   
3. 打卡请求数据

   ``` js
   const province = ""; //省（中文）
   const city = ""; //市（中文）
   const district = ""; //区（中文）
   ```

   如果不是绿码或者对一下列项不是默认否的，请自行在代码中修改

   ![image-20200422165244597](https://libget.com/gkirito/blog/image/2020/image-20200422165244597.png)

   ``` js
    request.write(
               '{"bizType":"' + bizType + '","groupid":"' + groupid + '","value":[{"location":["' + province + '","' + city + '","' + district + '"],"whatColorIsYourHangzhouHealthCode":"greenCode","inWenzhouHuangyanWenlingOrPassOrContactPersonsFromTheAboveAreas":"no","inHubeiOrPassOrComeIntoContactWithPeopleFromHubei":"no","closeContactWithConfirmedOrSuspectedCases":"no","currentLifeSituation":"normalHome","currentHealthCondition":"beInGoodHealth"}]}'
           );
           request.end();
   ```

   `当然了，如果不是默认否的，不建议用脚本，还是根据自身身体情况手动打卡`

脚本自动打卡时间是每天凌晨`00:01:00`

可以根据自己需求修改

``` js
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
```

后面 `* * *`代表每天执行，`00 01 00`格式是秒 分 时

## Centos

``` shell
yum install node
npm install
nohup node autodk.js &
```