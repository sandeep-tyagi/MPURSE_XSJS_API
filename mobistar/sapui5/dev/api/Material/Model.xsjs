function getModels() {
	var connection = $.db.getConnection();
	var Output = {
		results: []
	};
	var record;
	try {
		var query =
			'select CREDIT_LIMIT,ALLOCATION_CHECK from "MDB_DEV"."MPURSE_CONSTANT"';
		var pstmt = connection.prepareStatement(query);
		var rs = pstmt.executeQuery();
		connection.commit();
		if (rs.next() > 0) {
			record = {};
			record.CreditLimit = rs.getString(1);
			record.AllocationCheck = rs.getString(2);
			Output.results.push(record);
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


function getMaterialLimit() {
	var connection = $.db.getConnection();
	var Output = {
		results: []
	};
	var record;
	try {
		var qryMatLimit =
			'select material_code,material_desc,model_code,model_description,multiple_limit from "MDB_DEV"."MST_MATERIAL_MASTER" where multiple_limit>1';
		var pstmt = connection.prepareStatement(qryMatLimit);
		var rs = pstmt.executeQuery();
		connection.commit();
		while (rs.next() > 0) {
			record = {};
			record.MATERIAL_CODE = rs.getString(1);
			record.MATERIAL_DESC = rs.getString(2);
			record.MODEL_CODE = rs.getString(3);
			record.MODEL_DESCRIPTION = rs.getString(4);
			record.MULTIPLE_LIMIT = rs.getString(5);
			Output.results.push(record);
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
	case "getModels":
		getModels();
		break;
	case "getMaterialLimit":
		getMaterialLimit();
		break;	
	
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}