function getCustPlantCode(){
    var connection = $.db.getConnection();
    var query =
			'select CREDIT_LIMIT,ALLOCATION_CHECK from "MDB_DEV"."MST_CUSTOMER"';
		var pstmt = connection.prepareStatement(query);
		var rs = pstmt.executeQuery();
		connection.commit();
		if (rs.next() > 0) {
		    
		}
}

function getMpurseConstant() {
	var connection = $.db.getConnection();
//	var CustCode = $.request.parameters.get('CustCode');
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
			if(rs.getString(1).toUpperCase() === "TRUE"){
			    record.CreditLimit = true;
			}if(rs.getString(1).toUpperCase() === "FALSE"){
			    record.CreditLimit = false;
			}if(rs.getString(2).toUpperCase() === "TRUE"){
			    record.AllocationCheck = true;
			}if(rs.getString(2).toUpperCase() === "FALSE"){
			    record.AllocationCheck = false;
			}
			//getCustPlantCode();
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
	case "getMpurseConstant":
		getMpurseConstant();
		break;
	
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}