function getPositionValue() {
	var output = {
		results: []
	};
	var query;
	var record;
	var conn = $.db.getConnection();
	var Positionvalue = $.request.parameters.get('POSITIONVALUE');
	try {
		switch (Positionvalue) {
			case "BRANCH":
				query = 'Select COUNTRY_CODE,COUNTRY_NAME from "MDB_TEST_INTEGRATION"."MST_COUNTRY"';
				break;
			case "COUNTRY":
				query = 'Select COUNTRY_CODE,COUNTRY_NAME from "MDB_TEST_INTEGRATION"."MST_COUNTRY"';
				break;
			case "REGION":
				query = 'Select REGION_CODE,REGION_NAME from "MDB_TEST_INTEGRATION"."MST_REGION"';
				break;
			case "STATE":
				query = 'Select STATE_CODE,STATE_NAME from "MDB_TEST_INTEGRATION"."MST_STATE"';
				break;
			case "DISTRICT":
				query = 'Select DISTRICT_CODE,DISTRICT_NAME from "MDB_TEST_INTEGRATION"."MST_DISTRICT"';
				break;
			case "AREA":
				query = 'Select AREA_CODE,AREA_DESC from "MDB_TEST_INTEGRATION"."MST_AREA"';
				break;
			case "ZONE":
				query = 'Select ZONE_CODE,ZONE_DESC from "MDB_TEST_INTEGRATION"."MST_ZONE"';
				break;
			default:
		}
		var pstmt = conn.prepareStatement(query);
		var r = pstmt.executeQuery();
		while (r.next()) {
			record = {};
			record.CODE = r.getString(1);
			record.DESC = r.getString(2);
			output.results.push(record);
		}
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
	case "getPositionValue":
		getPositionValue();
		break;
	default:
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody('Invalid Command: ', aCmd);
}