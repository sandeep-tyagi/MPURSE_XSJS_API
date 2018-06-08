function getTileData() {
	var conn = $.db.getConnection();
	var data = {
		results: []
	};
	var record;
	var GUID = 1;
	try {
		var query = 'select "HEADER","FOOTER","PRESS","VALUE","COLOR","INDICATOR" from "MDB_TEST_INTEGRATION"."DEMO_TILES"';
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
var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "getTileData":
		getTileData();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}