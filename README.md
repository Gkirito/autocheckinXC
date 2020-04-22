# autocheckinXC
学程自动打卡脚本

> 网页版学程[https://pa.pkqa.com.cn](https://pa.pkqa.com.cn)

1. 学校

   ``` js
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
   ```

   `App-Code`就是学校代码，编号来自网页版，注意是填写`sid号`

   <img src="https://libget.com/gkirito/blog/image/2020/image-20200422131503489.png" alt="image-20200422131503489" style="zoom:50%;" />

2. 账号密码

   ``` js
   request.write(
               '{"loginName":"","password":"","type":"account"}' //账号密码，为了获取token
           );
   ```

   账号密码为了获取token

3. 打卡请求数据

   ``` js
   request.write(
               '{
                "bizType":"",
                "groupid":"",
                "value":[{
                   "location":["","",""],
                   "whatColorIsYourHangzhouHealthCode":"greenCode","inWenzhouHuangyanWenlingOrPassOrContactPersonsFromTheAboveAreas":"no","inHubeiOrPassOrComeIntoContactWithPeopleFromHubei":"no","closeContactWithConfirmedOrSuspectedCases":"no",
                   "currentLifeSituation":"normalHome",
                   "currentHealthCondition":"beInGoodHealth"
                   }]
                }'
           ); //这里的json如果不了解，建议网页上提交一次签到，拿到请求数据，直接复制过来用（注意格式和转码）
           request.end();
   ```

4. 脚本自动打卡时间是每天凌晨`00:01:00`

   可以根据自己需求修改

   ``` js
   let job = schedule.scheduleJob("00 01 00 * * *", () => {
           gettoken(autodk);
       });
   ```

   

## Centos

``` shell
yum install node
npm install
nohup node autodk.js &
```