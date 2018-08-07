/*
* MODIFIED BY SATISH AFTER POSITION VALUE NAME CHANGE.
*/
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
			case "SUBAREAURB":
				query = 'Select COUNTRY_CODE,COUNTRY_NAME from "MDB_DEV"."MST_BRANCH"';
				break;
			case "COUNTRY":
				query = 'Select COUNTRY_CODE,COUNTRY_NAME from "MDB_DEV"."MST_COUNTRY"';
				break;
			case "ZONE":
				query = 'Select REGION_CODE,REGION_NAME from "MDB_DEV"."MST_REGION"';
				break;
			case "REGION":
				query = 'Select REGIONAL_CODE,REGIONAL_NAME from "MDB_DEV"."MST_REGIONAL"';
				break;
			case "BRANCH":
				query = 'Select DISTRICT_CODE,DISTRICT_NAME from "MDB_DEV"."MST_DISTRICT"';
				break;
			case "AREA":
				query = 'Select AREA_CODE,AREA_NAME from "MDB_DEV"."MST_AREA"';
				break;
			case "SUBAREA":
				query = 'Select ZONE_CODE,ZONE_DESC from "MDB_DEV"."MST_ZONE"';
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