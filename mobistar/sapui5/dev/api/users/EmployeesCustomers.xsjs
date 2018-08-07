function getDSTBCustCode() {
	var output = {
		results: []
	};
	var employeeCode = $.request.parameters.get('employeeCode');
	var positionValue = $.request.parameters.get('positionValue');
	var connection = $.db.getConnection();
	try {
		var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::GetDstbCustCode"(?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, employeeCode);
		pstmtCallAttribute.setString(2, positionValue);
		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
		
		while (rCallAttribute.next()) 
		{
			output.results.push(rCallAttribute.getString(1));
		}
		connection.commit();
		connection.close();
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}
function getDSTBCustCodeByName() {
	var output = {
		results: []
	};
	var employeeCode = $.request.parameters.get('employeeCode');
	var positionValue = $.request.parameters.get('positionValue');
	var userType = $.request.parameters.get('userType');
	var connection = $.db.getConnection();
	try {
	    if(userType === "DSTB"){
	        var query = ' select MC1.DMS_CUST_CODE from "MDB_DEV"."MST_CUSTOMER" as MC inner join "MDB_DEV"."MST_CUSTOMER" as MC1 on MC.DBR_FORM_ID = MC1.CREATE_BY where MC.DMS_CUST_CODE = ?';
	        //'select DMS_CUST_CODE from "MDB_DEV"."MST_CUSTOMER" where CREATE_BY = ?';
		var pstmtStatus = connection.prepareStatement(query);
		pstmtStatus.setString(1, employeeCode);
		var rCallAttribute = pstmtStatus.executeQuery();
	    }else{
		var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::GetDstbCustCode"(?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, employeeCode);
		pstmtCallAttribute.setString(2, positionValue);
		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
	    }
		while (rCallAttribute.next()) 
		{
		    var record = {};
		    record.CustCode = rCallAttribute.getString(1);
			output.results.push(record);
		}
		connection.commit();
		connection.close();
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}
/*
 * File create by laxmi undar stish sinha.
 *fatch customer behaf of employee code
 */
 function getStatusDesc(records) {
	var conn = $.db.getConnection();
	if (records.Status !== undefined && records.Status !== '' && records.Status !== null) {
		var query = 'select STATUS_CODE,STATUS_DESC from "MDB_DEV"."MST_STATUS" where STATUS_CODE = ?';
		var pstmt = conn.prepareStatement(query);
		pstmt.setInteger(1, records.Status);
		var r = pstmt.executeQuery();
		conn.commit();
		while (r.next()) {
			records.ID = r.getInteger(1);
			records.StatusDesc = r.getString(2);
		}
		conn.close();
	}
	return records;
}
function getCustomers(record, Output) {
	var connection = $.db.getConnection();
	var PositionName = record.PositionName;
	var query, records;
	switch (PositionName.toLowerCase()) {
		case "country":
			query = 'select * from "MDB_DEV"."MST_CUSTOMER" where country in (?)';
			break;
		case "state":
			query = 'select * from "MDB_DEV"."MST_CUSTOMER" where state in (?)';
			break;
		case "region":
			query = 'select * from "MDB_DEV"."MST_CUSTOMER" where REGION in (?)';
			break;
		case "district":
			query = 'select * from "MDB_DEV"."MST_CUSTOMER" where DISTRICT in (?)';
			break;
		case "zone":
			break;
		case "branch":
			break;
		case "area":
			break;
		default:
	}
	var pstmt = connection.prepareStatement(query);
	pstmt.setString(1, record.PositionValue);
	var rs = pstmt.executeQuery();
	connection.commit();
	while (rs.next()) {
		records = {};
		records.TYPE = rs.getString(1);
		records.CODE = rs.getString(2);
		records.NAME = rs.getString(3);
		records.PARENT_CUST_CODE = rs.getString(4);
		records.PARENT_CUST_NAME = rs.getString(5);
		records.ADDRESS1 = rs.getString(6);
		records.ADDRESS2 = rs.getString(7);
		records.ADDRESS3 = rs.getString(8);
		records.DISTRICT = rs.getString(9);
		records.STATE = rs.getString(10);
		records.REGION = rs.getString(11);
		records.COUNTRY = rs.getString(12);
		records.EMAIL = rs.getString(13);
		records.PHONE_NUMBER = rs.getString(14);
		records.PINCODE = rs.getString(15);
		records.TINNO = rs.getString(16);
		records.PLANT_CODE = rs.getString(19);
		records.ACTIVE_DATE = rs.getString(22);
		records.LEVEL = rs.getString(26);
		records.Status = rs.getInteger(20);
		getStatusDesc(records);
		Output.results.push(records);
	}
	connection.close();
}

function getEmployeeCustomers() {
	var connection = $.db.getConnection();
	var Output = {
		results: []
	};
	var empCode = $.request.parameters.get('empCode');
	var record;
	try {
		var queryEmpPosi =
			'select distinct MP.POSITION_NAME,ME.POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" as ME inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID where Employee_code = ?';
		var pstmtEmpPosi = connection.prepareStatement(queryEmpPosi);
		pstmtEmpPosi.setString(1, empCode);
		var rsEmpPosi = pstmtEmpPosi.executeQuery();
		connection.commit();
		if (rsEmpPosi.next() > 0) {
			record = {};
			record.PositionName = rsEmpPosi.getString(1);
			record.PositionValue = rsEmpPosi.getString(2);
			getCustomers(record, Output);
		}
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
	case "getEmployeeCustomers":
		getEmployeeCustomers();
		break;
	case "getDSTBCustCode":
	    getDSTBCustCode();
	    break;
	case "getDSTBCustCodeByName":
	    getDSTBCustCodeByName();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}