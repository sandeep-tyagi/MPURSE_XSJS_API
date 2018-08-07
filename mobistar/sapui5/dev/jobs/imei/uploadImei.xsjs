function dateFunction() {
	var dp = new Date();
	var monthp = '' + (dp.getMonth() + 1);
	var dayp = '' + dp.getDate();
	var yearp = dp.getFullYear();

	if (monthp.length < 2) {
		monthp = '0' + monthp;
	}
	if (dayp.length < 2) {
		dayp = '0' + dayp;
	}
	var yyyymmddp = yearp + '.' + monthp + '.' + dayp;
	return yyyymmddp;
}

function getImeiData(rstatus, record, records) {
	var ImeiData = [];
	while (rstatus.next()) {
		record = {};
		record.param1 = rstatus.getString(1);
		record.param2 = rstatus.getString(2);
		record.param3 = rstatus.getString(3);
		record.param4 = ""; //'10000045';
		record.param5 = rstatus.getString(4);
		record.param6 = ""; //rstatus.getString(5);
		record.param7 = ""; //'MS01';
		record.param8 = dateFunction(); //'2018-06-25';
		record.param9 = ""; //'100';
		record.param10 = ""; //'1';
		record.param11 = ""; //"Noida";
		record.param12 = ""; //2018-06-25";
		record.param13 = rstatus.getString(6);
		record.param14 = ""; //Testing";
		record.param15 = ""; //Testing";
		record.param16 = ""; //Testing Area";
		record.param17 = ""; //noida";
		record.param18 = ""; //2000";
		record.param19 = ""; //Noida";
		record.param20 = ""; //10000045";
		record.param21 = ""; //"Noida";
		record.param22 = ""; //'Noida';
		record.param23 = ""; //'2';
		record.param24 = ""; //Noida";
		record.param25 = ""; //""2i";
		record.param26 = rstatus.getString(7);
		record.param27 = ""; //2018-06-25";
		record.param28 = ""; //2i";
		ImeiData.push(record);
	}
	records.data = ImeiData;
	return;
}

function getIMEIDestination(records) {
	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.imei", "Imei");
	var client = new $.net.http.Client();
	var req = new $.net.http.Request($.net.http.POST, "");

	req.contentType = "application/json";

	req.setBody(JSON.stringify(records));
	client.request(req, dest);
	var response = client.getResponse();
	records.data = JSON.parse(response.body.asString());
	//return data;
}

function updateImeis(records, conn) {
	if (records.data.code === '0') {
	    var code = parseInt(records.param02, 10);
		var query =
			'update "MDB_DEV"."MST_EQUIPMENT" set GSM_STATUS = ? where MATERIAL_CODE in (select MATERIAL_CODE from "MDB_DEV"."MST_MATERIAL_MASTER") and GSM_STATUS = ?';
		var pstmt = conn.prepareStatement(query);
		pstmt.setString(1, records.param02);
		pstmt.setInteger(2, code - 1);
		var rs = pstmt.executeQuery();
		conn.commit();
		if (rs > 0) {
		    
		}
	}
}

function uploadImei() {
	var query;
	var record;
	var conn = $.db.getConnection();
	var pstmt;
	var rstatus, data;

	var records = {};
	records.param00 = "sapdms";
	records.param01 = "EsNfp)B.W$xSAP";
	records.param02 = "1";
	query =
		'select MM.MATERIAL_TYPE,MM.MODEL_CODE,ME.IMEI1,ME.MATERIAL_CODE,ME.SERIAL_NUMBER,ME.MANUFACTURING_DATE, ME.IMEI2 from "MDB_DEV"."MST_EQUIPMENT" as ME inner join "MDB_DEV"."MST_MATERIAL_MASTER" as MM on ME.MATERIAL_CODE = MM.MATERIAL_CODE where GSM_STATUS = ? and ME.IMEI2 != ?';
	pstmt = conn.prepareStatement(query);
	pstmt.setString(1, '0');
	pstmt.setString(2, '0');
	rstatus = pstmt.executeQuery();
	conn.commit();
	//use for capture all imeis in records
	getImeiData(rstatus, record, records);
	//use to upload data on other server
	getIMEIDestination(records, data);
	//After upload data update data
	updateImeis(records, conn);
	conn.close();

	var body = JSON.stringify(records.data);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "uploadImei":
		uploadImei();
		break;

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}

	/*	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.imei", "Imei");
	var client = new $.net.http.Client();
	  var oSapBackPack = {
    param00 : "sapdms",
    param01 : "EsNfp)B.W$xSAP",
    param02 : "1",
    data : [
        {
            param1 : "TBD",
            param2 : "Model",
            param3 : "000000000000011",
            param4 : "",
            param5 : "",
            param6: "",
            param7 : "",
            param8 : "2018-01-01",
            param9 : "",
            param10 : "",
            param11 : "",
            param12 : "",
            param13 : "",
            param14 : "",
            param15 : "",
            param16 : "",
            param17 : "",
            param18 : "",
            param19 : "",
            param20 : "",
            param21 : "",
            param22 : "",
            param23 : "",
            param24 : "",
            param25 : "",
            param26 : "000000000001121",
            param27 : "",
            param28 : ""
        }
    ]
};
 var req = new $.net.http.Request($.net.http.POST,"");

  req.contentType = "application/json";

  req.setBody(JSON.stringify(oSapBackPack));
  client.request(req, dest);
	var response = client.getResponse();
var data = JSON.parse(response.body.asString());*/
	/*
				query =
					'insert into "MDB_DEV"."IMEI_RESPONSE" ("CODE","MESSAGE","DETAIL") values (?,?,?)';
				pstmt = conn.prepareStatement(query);
				pstmt.setString(1, data.code);
				pstmt.setString(2, data.message);
				pstmt.setString(3, data.detail);
				 rstatus = pstmt.executeUpdate();
				conn.commit();
				if (rstatus > 0) {
					record.status = '01';
					record.message = 'Imei UPDATE';
				}*/