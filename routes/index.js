var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var url = require('url');
var os = require("os");
var sql = require("mssql");
var config = {
    user: 'chat@chatser',
    password: 'Abcdabcd1',
    server: 'chatser.database.windows.net',
    database: 'chatserver',
    options: { encrypt: 'true', database: 'sensorData'}
};
var Users = function Users(name, ip, region_code, latitude, longitude,information) {
    this.name = name;
    this.ip = ip;
    this.region_code = region_code;
    this.latitude = latitude;
    this.longitude = longitude;
    this.information = information;
};


function containUser(userRegister) {

    return false;
}

router.get('/', function (req, res) {
    var info = req.param('info');
    var timeLogin = req.param('timelogin');
    var ip = JSON.parse(info);
    var hostaddress = os.hostname();
    var obj = new Users(hostaddress,ip.ip,ip.region_code,ip.latitude,ip.longitude);
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from UsersTable', function (err, recordset) {
            if (err) console.log(err);
            var userRegister = recordset.recordsets[0];
            for (var i = 0; i < userRegister.length; i++) {
                var t = userRegister[i];
                if (t.ip === obj.ip && t.region_code === obj.region_code && t.latitude === obj.latitude && t.longitude === obj.longitude) {
                    // themVaoBangDangNhap(t.name,t.ip,timeLogin);
                    res.json({re: 'success-'+timeLogin});
                    break;
                }else{
                    res.json({re: 'fail:'+JSON.stringify(ip)});
                }
            }
            sql.close();
        });
    });
});
var themVaoBangDangNhap = function (name,ip,time) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into TimeLogin values('"+name+"','"+ip+"','"+time+"')", function (err, recordset) {
            if (err) console.log(err);
        });
    });
};

router.get('/admin', function (req, res, next) {
    var code = req.param('code');
    if (code === '147258') {
        res.json({re: 'success'});
    } else {
        res.json({re: 'fail'});
    }
});

router.get('/login', function (req, res, next) {
    var infologin = req.param('infologin');
    var us = JSON.parse(infologin);
    themVaoBangDangNhap(us);
    res.json({re:'success'});
});

module.exports = router;
