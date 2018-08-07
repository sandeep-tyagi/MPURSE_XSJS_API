function getSecondarySales() {
	var record;
	var output = {
		results: []
	};
    //var areaStatus = $.request.parameters.get('areaStatus');
	try {
        var qrySecondarySales = null;
        var connection = $.db.getConnection();
    qrySecondarySales = ' SELECT E.SERIAL_NUMBER,E.MODEL_CODE,E.MATERIAL_CODE,E.IMEI1,'
    + 'E.IMEI2,C.CUST_NAME, C.DMS_CUST_CODE,E.SECONDARYSALE_DATE,E.SECONDARY_PRICE,'
    + 'E.PRIMARYSALE_DATE, E.MANUFACTURING_DATE,E.MATERIAL_TYPE,E.PLANT_CODE,E.BATCH_NO,E.PRIMARYSALE_CUSTOMER,'
    +' CD.CUST_NAME AS "DSTB_NAME" from "MDB_DEV"."MST_EQUIPMENT" as "E" '
    + ' JOIN "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE=E.SECONDARYSALE_CUSTOMER '
    +'JOIN "MDB_DEV"."MST_CUSTOMER" as "CD" on CD.DMS_CUST_CODE=E.PRIMARYSALE_CUSTOMER';
    	var pstmtSecondarySales = connection.prepareStatement(qrySecondarySales);
    	var rsSecondarySales = pstmtSecondarySales.executeQuery();
    	while (rsSecondarySales.next()) 
    	{
    		 record = {};
    		record.SERIALNO = rsSecondarySales.getString(1);
    	    record.MODELCODE = rsSecondarySales.getString(2);
    		record.MATERILCODE = rsSecondarySales.getString(3);
    		record.IMEI1 = rsSecondarySales.getString(4);
    		record.IMEI2 = rsSecondarySales.getString(5);
    		record.RETL_NAME = rsSecondarySales.getString(6);
    		record.RETL_CODE = rsSecondarySales.getString(7);
    		record.DSTB_CODE = rsSecondarySales.getString(15);
    		record.DSTB_NAME = rsSecondarySales.getString(16);
    		record.SECONDARYSALE_DATE = rsSecondarySales.getString(8);
    		record.SECONDARY_PRICE = rsSecondarySales.getString(9);
    		record.PRIMARYSALE_DATE = rsSecondarySales.getString(10);
    		record.MANUFACTURING_DATE = rsSecondarySales.getString(11);
    		record.PLANT_CODE = rsSecondarySales.getString(13);
    		record.MATERIAL_TYPE = rsSecondarySales.getString(12);
    		record.BATCH_NO = rsSecondarySales.getString(14);
    
    
    	
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


function getSecondarySale() {
	var record;
	var output = {
		results: []
	};
    var RETLCUSTCODE = $.request.parameters.get('RETLCUSTCODE');
     var DSTBCUSTCODE = $.request.parameters.get('DSTBCUSTCODE');

	try {
        var qrySecondarySales = null;
        var connection = $.db.getConnection();
    qrySecondarySales = ' SELECT E.SERIAL_NUMBER,E.MODEL_CODE,E.MATERIAL_CODE,E.IMEI1,'
    + 'E.IMEI2,C.CUST_NAME, C.DMS_CUST_CODE,E.SECONDARYSALE_DATE,E.SECONDARY_PRICE,'
    + 'E.PRIMARYSALE_DATE, E.MANUFACTURING_DATE,E.MATERIAL_TYPE,E.PLANT_CODE,E.BATCH_NO,E.PRIMARYSALE_CUSTOMER,'
    +' CD.CUST_NAME AS "DSTB_NAME" from "MDB_DEV"."MST_EQUIPMENT" as "E" '
    + ' JOIN "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE=E.SECONDARYSALE_CUSTOMER '
    +'JOIN "MDB_DEV"."MST_CUSTOMER" as "CD" on CD.DMS_CUST_CODE=E.PRIMARYSALE_CUSTOMER WHERE E.SECONDARYSALE_CUSTOMER=COALESCE(?,E.SECONDARYSALE_CUSTOMER)'
    +' AND E.PRIMARYSALE_CUSTOMER=COALESCE(?,E.PRIMARYSALE_CUSTOMER)';
    	var pstmtSecondarySales = connection.prepareStatement(qrySecondarySales);
    	pstmtSecondarySales.setString(1, RETLCUSTCODE);
    	pstmtSecondarySales.setString(2, DSTBCUSTCODE);
    	var rsSecondarySales = pstmtSecondarySales.executeQuery();
    	while (rsSecondarySales.next()) 
    	{
    		 record = {};
    		record.SERIALNO = rsSecondarySales.getString(1);
    	    record.MODELCODE = rsSecondarySales.getString(2);
    		record.MATERILCODE = rsSecondarySales.getString(3);
    		record.IMEI1 = rsSecondarySales.getString(4);
    		record.IMEI2 = rsSecondarySales.getString(5);
    		record.RETL_NAME = rsSecondarySales.getString(6);
    		record.RETL_CODE = rsSecondarySales.getString(7);
    		record.DSTB_CODE = rsSecondarySales.getString(15);
    		record.DSTB_NAME = rsSecondarySales.getString(16);
    		record.SECONDARYSALE_DATE = rsSecondarySales.getString(8);
    		record.SECONDARY_PRICE = rsSecondarySales.getString(9);
    		record.PRIMARYSALE_DATE = rsSecondarySales.getString(10);
    		record.MANUFACTURING_DATE = rsSecondarySales.getString(11);
    		record.PLANT_CODE = rsSecondarySales.getString(13);
    		record.MATERIAL_TYPE = rsSecondarySales.getString(12);
    		record.BATCH_NO = rsSecondarySales.getString(14);
    
    
    	
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
		case "getSecondarySales":
		getSecondarySales();
		break;
		case "getSecondarySale":
		getSecondarySale();
		break;

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}