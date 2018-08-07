function getNatures() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var queryGetNatures = 'Select id,name from "MDB_DEV"."MST_NATURE" ';
		var pstmtGetNatures = connection.prepareStatement(queryGetNatures);
		var rGetNatures = pstmtGetNatures.executeQuery();
		connection.commit();
		while (rGetNatures.next()) {
			var record = {};
			record.NatureId = rGetNatures.getString(1);
			record.NatureName = rGetNatures.getString(2);
			output.results.push(record);
		}
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



function updateFosDSTBDetails() {
	var output = {
		results: []
	};
	var conn = $.db.getConnection();
	var updateArray = $.request.parameters.get('updateArray');
	var updateArrayDataJson = JSON.parse(updateArray.replace(/\\r/g, ""));
	var pstmtCustomer;
	var record = {};
	try {
	    for(var i = 0 ;i < updateArrayDataJson.length; i++){
	   var updateArrayData = updateArrayDataJson[i];
		var queryinsert =
			'update "MDB_DEV"."DBR_FOS_DETAILS"  set  NAME=?  ,DOC_TYPE=? ,BANK_ACCOUNT=?,IFSC_CODE=? WHERE DBR_FORM_ID=? and DBR_FOS_ID=?';
		pstmtCustomer = conn.prepareStatement(queryinsert);
		pstmtCustomer.setString(1, updateArrayData.Name);
	//	pstmtCustomer.setString(2, updateArrayData.Id_ProofNo);
		pstmtCustomer.setString(2, updateArrayData.Id_ProofType);
		pstmtCustomer.setString(3, updateArrayData.Banl_Account);
		pstmtCustomer.setString(4, updateArrayData.Ifsc_Code);
		pstmtCustomer.setString(5, updateArrayData.DBR_FORM_ID);
		pstmtCustomer.setString(6, updateArrayData.DIR_PROFILE_ID);
	
		var rsStatus = pstmtCustomer.executeUpdate();
		conn.commit();
		if (rsStatus > 0) {
			record.status = "1";
			record.message = 'Successfully Updated';
			output.results.push(record);
		} else {
			record.status = "0";
			record.message = 'failed';
			output.results.push(record);
		}
	    }
		pstmtCustomer.close();
		conn.close();
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

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "getNatures":
		getNatures();
		break;
	case "updateFosDSTBDetails":
	    updateFosDSTBDetails();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}