
function getGsmSync1Data(rstatus, record, records) {
	var GsmSync1Data = [];
	while (rstatus.next()) {
		record = {};
		record.param1 = rstatus.getString(1);//Type of phone
		record.param2 = rstatus.getString(2);//Model Code
		record.param3 = rstatus.getString(3);//Imei number 1
		record.param4 = ""; //Name of distributor
		record.param5 = rstatus.getString(4);//Material No.
		record.param6 =  rstatus.getString(5); //Serial Number
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
	return;
}



function getGsmDestination(records) {
	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.gsm", "gsm");
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





function postGsmSync1() {
    var query;
	var record;
	var conn = $.db.getConnection();
	var pstmt;
	var rstatus, data;

	var records = {};
	records.param00 = "sapdms";
	records.param01 = "EsNfp)B.W$xSAP";
	records.param02 = "0";
	query ='select M.MATERIAL_TYPE,E.MODEL_CODE,E.IMEI1,E.MATERIAL_CODE,E.SERIAL_NUMBER,E.PLANT_CODE,E.MANUFACTURING_DATE,E.IMEI2'
		 + ' from "MDB_DEV"."MST_EQUIPMENT" as E join "MDB_DEV"."MST_MATERIAL_MASTER" as M on E.MATERIAL_CODE=M.MATERIAL_CODE'
		 + ' WHERE E.STATUS=1';
	pstmt = conn.prepareStatement(query);
	rstatus = pstmt.executeQuery();
	conn.commit();
	//use for capture all imeis in records
	getGsmSync1Data(rstatus, record, records);
	//use to upload data on other server
	getGsmDestination(records);
	//After upload data update data
	//updateImeis(records, conn);
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
	

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}