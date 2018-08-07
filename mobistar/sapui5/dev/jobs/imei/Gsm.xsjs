
function getGsmSync1Data(rstatus, recordfinal, records) {
	var GsmSync1Data = [];
	var record;
	while (rstatus.next()) {
		record = {};
		record.param1 = rstatus.getString(1);//Type of phone
		record.param2 = rstatus.getString(2);//Model Code
		record.param3 = rstatus.getString(3);//Imei number 1
		record.param4 = ""; //Name of distributor
		record.param5 = rstatus.getString(4);//Material No.
		record.param6 =  ""; //Serial Number
		record.param7 = rstatus.getString(6); //Plant Code
		record.param8 = rstatus.getString(7); //dateFunction(); //In stock date
		record.param9 = ""; //In stock price
		record.param10 = ""; //Stock quantity
		record.param11 = ""; //Agent code/	Bill to customer code
		record.param12 = ""; //Address of agent	/Bill to customer address
		record.param13 = "";//Stock issue date
		record.param14 = ""; //Note
		record.param15 = ""; //Region name
		record.param16 = ""; //Area name/	State Code
		record.param17 = ""; //Province name/	City
		record.param18 = ""; //Unit price
		record.param19 = ""; //Stock No.
		record.param20 = ""; //Stock description
		record.param21 = ""; //Ship to Customer code
		record.param22 = ""; //Ship to customer address
		record.param23 = ""; //Saler code/	Territory Manager code
		record.param24 = ""; //Saler name
		record.param25 = ""; //Account	Distribution Channel
		record.param26 = rstatus.getString(8);//Imei number 2
		record.param27 = ""; //Return date
		record.param28 = ""; //Return tYPE
		GsmSync1Data.push(record);
	}
	records.data = GsmSync1Data;
	recordfinal.data=GsmSync1Data;

	return;
}

function getGsmSync21Data(rstatus, recordfinal, records) {
	var GsmSync2Data = [];
	var record;
	while (rstatus.next()) {
		record = {};
		record.param1 = rstatus.getString(1);//Type of phone
		record.param2 = rstatus.getString(2);//Model Code
		record.param3 = rstatus.getString(3);//Imei number 1
		record.param4 = rstatus.getString(9); //Name of distributor
		record.param5 = rstatus.getString(4);//Material No.
		record.param6 =  ""; //Serial Number
		record.param7 = rstatus.getString(6); //Plant Code
		record.param8 = rstatus.getString(7); //dateFunction(); //In stock date
		record.param9 = rstatus.getString(10); //In stock price
		record.param10 = ""; //Stock quantity
		record.param11 = rstatus.getString(11); //Agent code/	Bill to customer code
		record.param12 = ""; //Address of agent	/Bill to customer address
		record.param13 = rstatus.getString(12); //Stock issue date
		record.param14 = ""; //Note
		record.param15 = ""; //Region name
		record.param16 = rstatus.getString(13); //Area name/	State Code
		record.param17 = rstatus.getString(14); //Province name/	City
		record.param18 = ""; //Unit price
		record.param19 = ""; //Stock No.
		record.param20 = ""; //Stock description
		record.param21 = rstatus.getString(11); //Ship to Customer code
		record.param22 = ""; //Ship to customer address
		record.param23 = ""; //Saler code/	Territory Manager code
		record.param24 = ""; //Saler name
		record.param25 = ""; //Account	Distribution Channel
		record.param26 = rstatus.getString(8);//Imei number 2
		record.param27 = ""; //Return date
		record.param28 = ""; //Return tYPE
		GsmSync2Data.push(record);
	}
	records.data = GsmSync2Data;
	recordfinal.data = GsmSync2Data;
	return;
}

function getGsmSync22Data(rstatus, recordfinal, records) {
	var GsmSync2Data = [];
	var record;
	while (rstatus.next()) {
		record = {};
		record.param1 = rstatus.getString(1);//Type of phone
		record.param2 = rstatus.getString(2);//Model Code
		record.param3 = rstatus.getString(3);//Imei number 1
		record.param4 = rstatus.getString(9); //Name of distributor
		record.param5 = rstatus.getString(4);//Material No.
		record.param6 =  ""; //Serial Number
		record.param7 = rstatus.getString(6); //Plant Code
		record.param8 = rstatus.getString(7); //dateFunction(); //In stock date
		record.param9 = rstatus.getString(10); //In stock price
		record.param10 = ""; //Stock quantity
		record.param11 = rstatus.getString(11); //Agent code/	Bill to customer code
		record.param12 = ""; //Address of agent	/Bill to customer address
		record.param13 = rstatus.getString(12); //Stock issue date
		record.param14 = ""; //Note
		record.param15 = ""; //Region name
		record.param16 = rstatus.getString(13); //Area name/	State Code
		record.param17 = rstatus.getString(14); //Province name/	City
		record.param18 = rstatus.getString(9); //Unit price
		record.param19 = ""; //Stock No.
		record.param20 = ""; //Stock description
		record.param21 = rstatus.getString(11); //Ship to Customer code
		record.param22 = ""; //Ship to customer address
		record.param23 = ""; //Saler code/	Territory Manager code
		record.param24 = ""; //Saler name
		record.param25 = ""; //Account	Distribution Channel
		record.param26 = rstatus.getString(8);//Imei number 2
		record.param27 = ""; //Return date
		record.param28 = ""; //Return tYPE
		GsmSync2Data.push(record);
	}
	records.data = GsmSync2Data;
	recordfinal.data = GsmSync2Data;
	return;
}



function getGsmDestination(records) {
	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.imei", "Imei");
	var client = new $.net.http.Client();
	var req = new $.net.http.Request($.net.http.POST, "");

	req.contentType = "application/json";

	req.setBody(JSON.stringify(records));
	client.request(req, dest);
	var response = client.getResponse();
	records.data = response.body.asString();
		return;
	//return data;
}



function updateGsmStatusSyn1(recordfinal, conn) {
	var oFinalResult = recordfinal;
		for (var i = 0; i < oFinalResult.data.length; i++) {
	    var imei1 = oFinalResult.data[i].param3;
		var query ='update "MDB_DEV"."MST_EQUIPMENT" set GSM_STATUS=1 where IMEI1=? and GSM_STATUS=0';
		var pstmt = conn.prepareStatement(query);
		pstmt.setString(1, imei1);
		 pstmt.executeQuery();
	conn.commit();
	
		}


}



function updateGsmStatusSyn21(recordfinal, conn) {
	var oFinalResult = recordfinal;
		for (var i = 0; i < oFinalResult.data.length; i++) {
	    var imei1 = oFinalResult.data[i].param3;
		var query ='update "MDB_DEV"."MST_EQUIPMENT" set GSM_STATUS=21 where IMEI1=? and GSM_STATUS=1';
		var pstmt = conn.prepareStatement(query);
		pstmt.setString(1, imei1);
		 pstmt.executeQuery();
	conn.commit();
	
		}


}
function updateGsmStatusSyn22(recordfinal, conn) {
	var oFinalResult = recordfinal;
		for (var i = 0; i < oFinalResult.data.length; i++) {
	    var imei1 = oFinalResult.data[i].param3;
		var query ='update "MDB_DEV"."MST_EQUIPMENT" set GSM_STATUS=22 where IMEI1=? and GSM_STATUS=21';
		var pstmt = conn.prepareStatement(query);
		pstmt.setString(1, imei1);
		 pstmt.executeQuery();
	conn.commit();
	
		}
}




function postGsmSync1() {
    var query;
	var recordfinal={};
	
	var conn = $.db.getConnection();
	var pstmt;
	var rstatus, data;

	var records = {};
	records.param00 = "sapdms";
	records.param01 = "EsNfp)B.W$xSAP";
	records.param02 = "1";
	query ='select M.MATERIAL_TYPE,E.MODEL_CODE,E.IMEI1,E.MATERIAL_CODE,E.SERIAL_NUMBER,E.PLANT_CODE,E.MANUFACTURING_DATE,E.IMEI2'
		 + ' from "MDB_DEV"."MST_EQUIPMENT" as E join "MDB_DEV"."MST_MATERIAL_MASTER" as M on E.MATERIAL_CODE=M.MATERIAL_CODE'
		 + ' WHERE E.STATUS=0 AND E.GSM_STATUS=0';
	pstmt = conn.prepareStatement(query);
	rstatus = pstmt.executeQuery();
	conn.commit();
	//use for capture all imeis in records
	getGsmSync1Data(rstatus, recordfinal, records);
	//use to upload data on other server
	getGsmDestination(records);
	//After upload data update data
	updateGsmStatusSyn1(recordfinal, conn);
	conn.close();

	var body = JSON.stringify(records.data);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}


function postGsmSync21() {
    var query;
		var recordfinal={};
	var conn = $.db.getConnection();
	var pstmt;
	var rstatus;

	var records = {};
	records.param00 = "sapdms";
	records.param01 = "EsNfp)B.W$xSAP";
	records.param02 = "2";
	query ='select M.MATERIAL_TYPE,E.MODEL_CODE,E.IMEI1,E.MATERIAL_CODE,E.SERIAL_NUMBER,E.PLANT_CODE,E.MANUFACTURING_DATE,E.IMEI2'
	+ ' ,C.CUST_NAME,E.PRIMARY_PRICE,C.DMS_CUST_CODE,E.PRIMARYSALE_DATE,C.STATE,C.LOCALITY'
		 + ' from "MDB_DEV"."MST_EQUIPMENT" as E join "MDB_DEV"."MST_MATERIAL_MASTER" as M on E.MATERIAL_CODE=M.MATERIAL_CODE'
		+ ' JOIN "MDB_DEV"."SALES_INVOICE_EQUIP" AS SIE ON E.SERIAL_NUMBER=SIE.SERIAL_NO'
		+ ' JOIN "MDB_DEV"."SALES_INVOICE_HEADER" AS SIH  ON SIH.INVOICE_NO=SIE.INVOICE_NO'
		+ ' JOIN "MDB_DEV"."MST_CUSTOMER" AS C  ON C.DMS_CUST_CODE=SIH.DMS_CUST_CODE'
		 + ' WHERE E.STATUS=1 AND E.GSM_STATUS=1';
	pstmt = conn.prepareStatement(query);
	rstatus = pstmt.executeQuery();
	conn.commit();
	//use for capture all imeis in records
	getGsmSync21Data(rstatus, recordfinal, records);
	//use to upload data on other server
	getGsmDestination(records);
	//After upload data update data
	updateGsmStatusSyn21(recordfinal, conn);
	conn.close();

	var body = JSON.stringify(records.data);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}



function postGsmSync22() {
    var query;
		var recordfinal={};
	var conn = $.db.getConnection();
	var pstmt;
	var rstatus;

	var records = {};
	records.param00 = "sapdms";
	records.param01 = "EsNfp)B.W$xSAP";
	records.param02 = "2";
	query ='select M.MATERIAL_TYPE,E.MODEL_CODE,E.IMEI1,E.MATERIAL_CODE,E.SERIAL_NUMBER,E.PLANT_CODE,E.MANUFACTURING_DATE,E.IMEI2'
	+ ' ,E.PRIMARYSALE_CUSTOMER,E.SECONDARY_PRICE,C.DMS_CUST_CODE,E.SECONDARYSALE_DATE,C.STATE,C.LOCALITY'
		 + ' from "MDB_DEV"."MST_EQUIPMENT" as E join "MDB_DEV"."MST_MATERIAL_MASTER" as M on E.MATERIAL_CODE=M.MATERIAL_CODE'
		//+ ' JOIN "MDB_DEV"."SALES_INVOICE_EQUIP" AS SIE ON E.SERIAL_NUMBER=SIE.SERIAL_NO'
		//+ ' JOIN "MDB_DEV"."SALES_INVOICE_HEADER" AS SIH  ON SIH.INVOICE_NO=SIE.INVOICE_NO'
		+ ' JOIN "MDB_DEV"."MST_CUSTOMER" AS C  ON C.DMS_CUST_CODE=E.SECONDARYSALE_CUSTOMER'
		 + ' WHERE E.STATUS=3 AND E.GSM_STATUS=21';
	pstmt = conn.prepareStatement(query);
	rstatus = pstmt.executeQuery();
	conn.commit();
	//use for capture all imeis in records
	getGsmSync22Data(rstatus, recordfinal, records);
	//use to upload data on other server
//	getGsmDestination(records);
	//After upload data update data
//	updateGsmStatusSyn22(recordfinal, conn);
	conn.close();

	var body = JSON.stringify(records.data);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}







var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "postGsmSync1":
		postGsmSync1();
		break;
	case "postGsmSync21":
		postGsmSync21();
		break;
	case "postGsmSync22":
		postGsmSync22();
		break;
	

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}