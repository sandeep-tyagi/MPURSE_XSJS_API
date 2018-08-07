function getCustName(CustCode,record){
    var connection = $.db.getConnection();
    record.CustName = "";
    if(CustCode !== null){
    var query = 'select Cust_name from "MDB_DEV"."MST_CUSTOMER" where DMS_CUST_CODE = ?';
    	var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, CustCode);
        var rs = pstmt.executeQuery();
		connection.commit();
			if(rs.next()) {
			    record.CustName = rs.getString(1);
			}
			connection.close();
    }		
			return record;
}

function getSalesRegister(){
    var output = {
		results: []
	};
	var record;
	var CustCode = $.request.parameters.get('CustCode');
	var FromDate = $.request.parameters.get('FromDate');
	var ToDate = $.request.parameters.get('ToDate');
	var connection = $.db.getConnection();
	try {
		var query = 'select ME.MATERIAL_CODE,ME.IMEI1,ME.IMEI2,ME.PLANT_CODE,ME.MANUFACTURING_DATE,ME.MODEL_CODE,ME.MODEL_DESCRIPTION, '
+ ' ME.PRIMARYSALE_CUSTOMER,ME.PRIMARYSALE_DATE,ME.PRIMARYSALE_RECEIVING_DATE,ME.SECONDARYSALE_CUSTOMER,ME.SECONDARYSALE_DATE, '
+ ' ME.SECONDARYSALE_RECEIVING_DATE,ME.TERTIARY_CUSTOMER,ME.TERTIARY_DATE from "MDB_DEV"."MST_EQUIPMENT" as ME  '
+ ' where ME.PRIMARYSALE_CUSTOMER = ? and ME.status = ? '
+ ' and ((ME.SECONDARYSALE_RECEIVING_DATE between ? and ?) or (ME.SECONDARYSALE_DATE between ? and ?)) ';
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, CustCode);
		pstmt.setString(2, '3');
		pstmt.setString(3, FromDate);
		pstmt.setString(4, ToDate);
		pstmt.setString(5, FromDate);
		pstmt.setString(6, ToDate);
		var rs = pstmt.executeQuery();
		connection.commit();
			while (rs.next()) {
			record = {};
			record.MATERIAL_CODE = rs.getString(1);
			record.IMEI1 = rs.getString(2);
			record.IMEI2 = rs.getString(3);
			record.MANUFACTURING_DATE = rs.getString(5);
			record.PLANTCODE = rs.getString(4);
			record.MODEL_CODE = rs.getString(6);
			record.MODEL_DESCRIPTION = rs.getString(7);
			record.PRIMARYSALE_CUSTOMER = rs.getString(8);
			//record.PRIMARYSALE_CUSTOMERNAME = rs.getString(9);
			getCustName(record.PRIMARYSALE_CUSTOMER,record);
			record.PRIMARYSALE_CUSTOMERNAME = record.CustName;
			
			record.PRIMARYSALE_DATE = rs.getString(9);
			record.PRIMARYSALE_RECEIVING_DATE = rs.getString(10);
			record.SECONDARYSALE_CUSTOMER = rs.getString(11);
			
			getCustName(record.SECONDARYSALE_CUSTOMER,record);
			record.SECONDARYSALE_CUSTOMERNAME = record.CustName;
			
			record.SECONDARYSALE_DATE = rs.getString(12);
			record.SECONDARYSALE_RECEIVING_DATE = rs.getString(13);
			record.TERTIARY_CUSTOMER = rs.getString(14);
			
			getCustName(record.TERTIARY_CUSTOMER,record);
			record.TERTIARY_CUSTOMERNAME = record.CustName;
			
			record.TERTIARY_DATE = rs.getString(15);
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

	case "getSalesRegister":
		getSalesRegister();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}