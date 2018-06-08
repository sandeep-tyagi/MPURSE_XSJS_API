function getNatures() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var queryGetNatures = 'Select id,name from "MDB_TEST_INTEGRATION"."MST_NATURE" ';
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


var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "getNatures":
		getNatures();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}