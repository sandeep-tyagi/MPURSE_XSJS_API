function getTileData() {
	var conn = $.db.getConnection();
	var data = {
		results: []
	};
	var record;
	var GUID = 1;
	try {
		var query = 'select "HEADER","FOOTER","PRESS","VALUE","COLOR","INDICATOR" from "MDB_DEV"."DEMO_TILES"';
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();
		conn.commit();
		while (rs.next()) {
			record = {};
			record.GUID = GUID++;
			record.HEADER = rs.getString(1);
			record.FOOTER = rs.getString(2);
			record.PRESS = rs.getString(3);
			record.VALUE = rs.getInteger(4);
			record.COLOR = rs.getString(5);
			record.INDICATOR = rs.getString(6);
			data.results.push(record);
		}
		conn.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

	var body = JSON.stringify(data);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

function getSAPId() {
	var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
	var body = JSON.stringify(rString);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}


/*
 * To generate dmsCustCode.
 * input : user_code 
 * output : a code 
 * @author shriyansi
 */

function updateSAPIDInCustomer() {
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var record = {};
	var userCode = $.request.parameters.get('User_Code');
	try {
		var dmsCustCode = ""; //getSAPId(User_Code);
		var queryCustDetails =
			'select c.cust_type , s.STATE_code , c.CUST_NAME from "MDB_DEV"."MST_CUSTOMER" as c inner join "MDB_DEV"."MST_STATE" as s on s.state_name=c.state where DBR_FORM_ID=? ';
		var pstmtCustDetails = connection.prepareStatement(queryCustDetails);
		pstmtCustDetails.setString(1, userCode);
		var rsCustDetails = pstmtCustDetails.executeQuery();
		connection.commit();
		while (rsCustDetails.next()) {
			//var record = {};
			record.CUST_TYPE = rsCustDetails.getString(1);
			record.StateCode = rsCustDetails.getString(2);
			record.CUST_NAME = rsCustDetails.getString(3);

		}
		dmsCustCode = record.StateCode + record.CUST_TYPE.substring(0, 1) + record.CUST_NAME.substring(0, 5);
		dmsCustCode = dmsCustCode.toUpperCase();
		var qryCountCust = "SELECT Count(DMS_CUST_CODE) FROM \"MDB_DEV\".\"MST_CUSTOMER\" WHERE DMS_CUST_CODE Like '" + dmsCustCode + "%'";
		var custNameCount = 0;
		var pstmtCountCust = connection.prepareStatement(qryCountCust);
		var rsCountCust = pstmtCountCust.executeQuery();
		connection.commit();
		while (rsCountCust.next()) {
			custNameCount = rsCountCust.getInteger(1);
		}
		if (custNameCount <= 9) {
			dmsCustCode = dmsCustCode + "0" + (custNameCount + 1);
		} else {
			dmsCustCode = dmsCustCode + (custNameCount + 1);

		}
		Output.results.push(dmsCustCode);

		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

	var body = JSON.stringify(Output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "getTileData":
		getTileData();
		break;
	case "updateSAPIDInCustomer":
		updateSAPIDInCustomer();
		break;

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}