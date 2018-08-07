function getSalesRegister() {
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


function getSalesRegisterPartnerSS() {
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

function getSalesRegisterByRolePos(){
    var recordInvoiceHeader;
	var recordInvoiceLine;
	var invoiceLineArray = [];
	var recordInvoiceEquip;
	var invoiceEquipArray = [];
	var output = {
		results: []
	};
	var roleName = $.request.parameters.get('roleName');
	var positionName = $.request.parameters.get('positionName');
	var positionValue = $.request.parameters.get('positionValue');
	var custType = $.request.parameters.get('custType');
	try {
		var qryInvoiceHeader = null;
		var connection = $.db.getConnection();
		qryInvoiceHeader ='select SIH.INVOICE_NO,SIH.INVOICE_DATE,SIH.BATCH_NO,SIH.INVOICE_TYPE,'
			+ ' SIH.PLANT_CODE,SIH.INVOICE_VALUE,SIH.SALES_ORDER,C.CUST_TYPE,C.DMS_CUST_CODE,C.CUST_NAME'
			+ ' from "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" ' 
			+ ' join "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE = SIH.DMS_CUST_CODE'
			+ ' join "MDB_DEV"."MST_EMPLOYEE" as "E" ON E.EMPLOYEE_CODE=C.CREATE_BY'
            + ' join "MDB_DEV"."MAP_ROLE_POSITION" as "RP" on RP.ROLE_POS_ID=E.ROLE_POSITION_ID'
            + ' join "MDB_DEV"."MST_POSITION" as "P" ON P.POSITION_ID=RP.POSITION_ID'
            + ' join "MDB_DEV"."MST_ROLE" as "R" ON R.ROLE_ID=RP.ROLE_ID'
            + ' WHERE R.ROLE_NAME=COALESCE(?,R.ROLE_NAME) AND P.POSITION_NAME=COALESCE(?,P.POSITION_NAME)'
            + ' AND E.POSITION_VALUE_ID=COALESCE(?,E.POSITION_VALUE_ID) AND C.CUST_TYPE=COALESCE(?,C.CUST_TYPE) ';
		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);
	    pstmtInvoiceHeader.setString(1, roleName);
	    pstmtInvoiceHeader.setString(2, positionName);
	    pstmtInvoiceHeader.setString(3, positionValue);
	    pstmtInvoiceHeader.setString(4, custType);
		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.CUSTOMERTYPE = rsInvoiceHeader.getString(8);
			recordInvoiceHeader.CUSTCODE = rsInvoiceHeader.getString(9);
			recordInvoiceHeader.CUSTOMERNAME = rsInvoiceHeader.getString(10);
			recordInvoiceHeader.INVOICENO = rsInvoiceHeader.getString(1);
			recordInvoiceHeader.INVOICEDATE = rsInvoiceHeader.getString(2);
			recordInvoiceHeader.BATCHNO = rsInvoiceHeader.getString(3);
			recordInvoiceHeader.INVOICETYPE = rsInvoiceHeader.getString(4);
			recordInvoiceHeader.PLANTCODE = rsInvoiceHeader.getString(5);
			recordInvoiceHeader.INVOICE_AMOUNT = rsInvoiceHeader.getString(6);
			recordInvoiceHeader.SALESORDER = rsInvoiceHeader.getString(7);

			var queryInvoiceLine =
				'select SIL.INVOICE_NO,SIL.INV_LINE_NUMBER,SIL.MATERIAL_CODE,SIL.QTY,M.MATERIAL_DESC,M.MODEL_CODE,M.MODEL_DESCRIPTION from "MDB_DEV"."SALES_INVOICE_LINES" as "SIL"' +
				' inner join "MDB_DEV"."MST_MATERIAL_MASTER" as "M" on M.MATERIAL_CODE = SIL.MATERIAL_CODE  where SIL.INVOICE_NO=?';
			var paramInvoiceLine = connection.prepareStatement(queryInvoiceLine);
			paramInvoiceLine.setString(1, recordInvoiceHeader.INVOICENO);
			var rsInvoiceLine = paramInvoiceLine.executeQuery();
			connection.commit();
			while (rsInvoiceLine.next()) {
				recordInvoiceLine = {};
				recordInvoiceLine.INVOICENO = rsInvoiceLine.getString(1);
				recordInvoiceLine.LINENO = rsInvoiceLine.getString(2);
				recordInvoiceLine.MODELCODE = rsInvoiceLine.getString(6);
				recordInvoiceLine.MODELDESC = rsInvoiceLine.getString(7);
				recordInvoiceLine.MATERIALCODE = rsInvoiceLine.getString(3);
				recordInvoiceLine.MATERIALDESC = rsInvoiceLine.getString(5);
				recordInvoiceLine.QTY = rsInvoiceLine.getString(4);
				var queryInvoiceEquip = 'select * from "MDB_DEV"."SALES_INVOICE_EQUIP" where INVOICE_NO=? and INVOICE_LINE_NO=? ';
				var paramInvoiceEquip = connection.prepareStatement(queryInvoiceEquip);
				paramInvoiceEquip.setString(1, recordInvoiceLine.INVOICENO);
				paramInvoiceEquip.setString(2, recordInvoiceLine.LINENO);
				var rsInvoiceEquip = paramInvoiceEquip.executeQuery();
				while (rsInvoiceEquip.next()) {
					recordInvoiceEquip = {};
					//recordInvoiceEquip.MATERIALCODE = rsInvoiceEquip.getString(4);
					recordInvoiceEquip.SERIALNO = rsInvoiceEquip.getString(5);
					recordInvoiceEquip.IMEI1 = rsInvoiceEquip.getString(6);
					recordInvoiceEquip.IMEI2 = rsInvoiceEquip.getString(7);
					invoiceEquipArray.push(recordInvoiceEquip);
					recordInvoiceLine.INVOICEEQUIPMENTS = invoiceEquipArray;
				}
				invoiceEquipArray = [];

				invoiceLineArray.push(recordInvoiceLine);
				recordInvoiceHeader.INVOICELINES = invoiceLineArray;
			}
			invoiceLineArray = [];
			output.results.push(recordInvoiceHeader);
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

function getChildPosition(){
        var childOutput;
    	var qryChildPosition = null;
		var connection = $.db.getConnection();
		
		qryChildPosition ='select PH.POSITION_ID from "MDB_DEV"."MST_POSITION" as P join "MDB_DEV"."POSITION_HIERARCHY" as PH'
		+ ' on P.POSITION_ID =PH.PARENT_POSITION_ID Where P.PARENT_POSITION_ID=?';
		var pstmtChildPosition = connection.prepareStatement(qryChildPosition);
	    pstmtChildPosition.setString(1, '17');
		var rsChildPosition = pstmtChildPosition.executeQuery();
			if(rsChildPosition.next()) {
			    childOutput = rsChildPosition.getString(1);
			}
			
			connection.close();
    
}

/**
 * To get  sales FROM DISTRIBUTOR TO RETAILER---SALE REGISTER FOR DSTB(DSTB).
 * To get  sales FROM DISTRIBUTOR TO RETAILER---SALES REGISTER FOR PARTNER(ADMIN).
 * @return {object} array of a resultset.
 */

/*
function getSalesRegisterPartner() {
	var record;
	var output = {
		results: []
	};
   
     var DSTBCUSTCODE = $.request.parameters.get('DSTBCUSTCODE');
      var RETLCUSTCODE = $.request.parameters.get('RETLCUSTCODE');
      var CUSTTYPE = $.request.parameters.get('CUSTTYPE');
     
     var FromDate = $.request.parameters.get('FromDate');
	 var ToDate = $.request.parameters.get('ToDate');

	try {
        var qrySecondarySales = null;
        var connection = $.db.getConnection();
    qrySecondarySales = ' SELECT C.DMS_CUST_CODE,CD.DMS_CUST_CODE,CD.CUST_NAME AS "DSTBNAME",C.CUST_NAME AS "RETLNAME",'
    +'  TEM.TRANSACTION_DATE,E.MATERIAL_CODE,E.MODEL_DESCRIPTION, TEM.TRANSACTION_TYPE,COUNT(E.MATERIAL_CODE) AS QUANTITY '
    +' FROM "MDB_DEV"."TRN_EQUIPMENT_MASTER" AS "TEM" JOIN "MDB_DEV"."MST_EQUIPMENT" as "E" ON E.SERIAL_NUMBER=TEM.SERIAL_NO'
    +' JOIN "MDB_DEV"."MST_CUSTOMER" as "C" ON C.DMS_CUST_CODE=TEM.DMS_CUST_CODE'
    +' JOIN "MDB_DEV"."MST_CUSTOMER" as "CD" on CD.DMS_CUST_CODE=E.PRIMARYSALE_CUSTOMER WHERE CD.DMS_CUST_CODE=COALESCE(?,CD.DMS_CUST_CODE)'
    +'  AND C.CUST_TYPE=COALESCE(?,C.CUST_TYPE) AND C.DMS_CUST_CODE=COALESCE(?,C.DMS_CUST_CODE) AND TEM.TRANSACTION_DATE>=? AND TEM.TRANSACTION_DATE<=?'
    +' GROUP BY C.DMS_CUST_CODE,C.CUST_NAME,TEM.TRANSACTION_DATE,E.MATERIAL_CODE,E.MODEL_DESCRIPTION, TEM.TRANSACTION_TYPE,CD.CUST_NAME,CD.DMS_CUST_CODE ';
    	var pstmtSecondarySales = connection.prepareStatement(qrySecondarySales);
    	pstmtSecondarySales.setString(1, DSTBCUSTCODE);
    	pstmtSecondarySales.setString(2, CUSTTYPE);
        pstmtSecondarySales.setString(3, RETLCUSTCODE);
    	pstmtSecondarySales.setString(4, FromDate);
		pstmtSecondarySales.setString(5, ToDate);
    	
    	var rsSecondarySales = pstmtSecondarySales.executeQuery();
    	while (rsSecondarySales.next()) 
    	{
    		 record = {};
    		record.RETL_CODE = rsSecondarySales.getString(1);
    		record.DSTB_CODE = rsSecondarySales.getString(2);
    	    record.DSTBNAME = rsSecondarySales.getString(3);
    		record.RETLNAME = rsSecondarySales.getString(4);
    		record.TRANSACTION_DATE = rsSecondarySales.getString(5);
    		record.MATERIAL_CODE = rsSecondarySales.getString(6);
    		record.MODEL_DESCRIPTION = rsSecondarySales.getString(7);
    		record.TRANSACTION_TYPE = rsSecondarySales.getString(8);
    		record.QUANTITY = rsSecondarySales.getString(9);
    	
    
    
    	
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
} */



function getSalesRegisterPartner() {
	var record;
	var output = {
		results: []
	};
   
     var DSTBCUSTCODE = $.request.parameters.get('DSTBCUSTCODE');
      var RETLCUSTCODE = $.request.parameters.get('RETLCUSTCODE');
      var CUSTTYPE = $.request.parameters.get('CUSTTYPE');
     
     var FromDate = $.request.parameters.get('FromDate');
	 var ToDate = $.request.parameters.get('ToDate');

	try {
        var qrySecondarySales = null;
        var connection = $.db.getConnection();
    qrySecondarySales = ' SELECT C.DMS_CUST_CODE,CD.DMS_CUST_CODE,CD.CUST_NAME AS "DSTBNAME",C.CUST_NAME AS "RETLNAME",'
    +'  TEM.TRANSACTION_DATE,E.MATERIAL_CODE,E.MODEL_DESCRIPTION, TEM.TRANSACTION_TYPE,COUNT(E.MATERIAL_CODE) AS QUANTITY '
    +' FROM "MDB_DEV"."TRN_EQUIPMENT_MASTER" AS "TEM" JOIN "MDB_DEV"."MST_EQUIPMENT" as "E" ON E.SERIAL_NUMBER=TEM.SERIAL_NO'
    +' JOIN "MDB_DEV"."MST_CUSTOMER" as "C" ON C.DMS_CUST_CODE=TEM.DMS_CUST_CODE'
    +' JOIN "MDB_DEV"."MST_CUSTOMER" as "CD" on CD.DMS_CUST_CODE=E.PRIMARYSALE_CUSTOMER WHERE CD.DMS_CUST_CODE=COALESCE(?,CD.DMS_CUST_CODE)'
    +'  AND C.CUST_TYPE=COALESCE(?,C.CUST_TYPE) AND C.DMS_CUST_CODE=COALESCE(?,C.DMS_CUST_CODE) AND TEM.TRANSACTION_DATE>=? AND TEM.TRANSACTION_DATE<=?'
    +' GROUP BY C.DMS_CUST_CODE,C.CUST_NAME,TEM.TRANSACTION_DATE,E.MATERIAL_CODE,E.MODEL_DESCRIPTION, TEM.TRANSACTION_TYPE,CD.CUST_NAME,CD.DMS_CUST_CODE ';
    	var pstmtSecondarySales = connection.prepareStatement(qrySecondarySales);
    	pstmtSecondarySales.setString(1, DSTBCUSTCODE);
    	pstmtSecondarySales.setString(2, CUSTTYPE);
        pstmtSecondarySales.setString(3, RETLCUSTCODE);
    	pstmtSecondarySales.setString(4, FromDate);
		pstmtSecondarySales.setString(5, ToDate);
    	
    	var rsSecondarySales = pstmtSecondarySales.executeQuery();
    	while (rsSecondarySales.next()) 
    	{
    		 record = {};
    		record.RETL_CODE = rsSecondarySales.getString(1);
    		record.DSTB_CODE = rsSecondarySales.getString(2);
    	    record.DSTBNAME = rsSecondarySales.getString(3);
    		record.RETLNAME = rsSecondarySales.getString(4);
    		record.TRANSACTION_DATE = rsSecondarySales.getString(5);
    		record.MATERIAL_CODE = rsSecondarySales.getString(6);
    		record.MODEL_DESCRIPTION = rsSecondarySales.getString(7);
    		record.TRANSACTION_TYPE = rsSecondarySales.getString(8);
    		record.QUANTITY = rsSecondarySales.getString(9);
    	
    
    
    	
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


function getSalesRegisterPartnerForEmp() {
	var record;
	var output = {
		results: []
	};
   
     var DSTBCUSTCODE = $.request.parameters.get('DSTBCUSTCODE');
      var RETLCUSTCODE = $.request.parameters.get('RETLCUSTCODE');
      var CUSTTYPE = $.request.parameters.get('CUSTTYPE');
     
     var FromDate = $.request.parameters.get('FromDate');
	 var ToDate = $.request.parameters.get('ToDate');

	try {
        var qrySecondarySales = null;
        var connection = $.db.getConnection();
    qrySecondarySales = ' SELECT C.DMS_CUST_CODE,CD.DMS_CUST_CODE,CD.CUST_NAME AS "DSTBNAME",C.CUST_NAME AS "RETLNAME",'
    +'  TEM.TRANSACTION_DATE,E.MATERIAL_CODE,MM.MODEL_DESCRIPTION, TEM.TRANSACTION_TYPE,COUNT(E.MATERIAL_CODE) AS QUANTITY '
    +' FROM "MDB_DEV"."TRN_EQUIPMENT_MASTER" AS "TEM" JOIN "MDB_DEV"."MST_EQUIPMENT" as "E" ON E.SERIAL_NUMBER=TEM.SERIAL_NO'
    + ' join  "MDB_DEV"."MST_MATERIAL_MASTER" as MM on E.MATERIAL_CODE = MM.MATERIAL_CODE'
    +' JOIN "MDB_DEV"."MST_CUSTOMER" as "C" ON C.DMS_CUST_CODE=TEM.DMS_CUST_CODE'
    +' JOIN "MDB_DEV"."MST_CUSTOMER" as "CD" on CD.DMS_CUST_CODE=E.PRIMARYSALE_CUSTOMER WHERE CD.DMS_CUST_CODE in ('
    +DSTBCUSTCODE+')'
    +' AND C.CUST_TYPE=COALESCE(?,C.CUST_TYPE) AND C.DMS_CUST_CODE=COALESCE(?,C.DMS_CUST_CODE) AND TEM.TRANSACTION_DATE>=? AND TEM.TRANSACTION_DATE<=?'
    +' GROUP BY C.DMS_CUST_CODE,C.CUST_NAME,TEM.TRANSACTION_DATE,E.MATERIAL_CODE,MM.MODEL_DESCRIPTION, TEM.TRANSACTION_TYPE,CD.CUST_NAME,CD.DMS_CUST_CODE ';
    	var pstmtSecondarySales = connection.prepareStatement(qrySecondarySales);
    	//pstmtSecondarySales.setString(1, DSTBCUSTCODE);
    	pstmtSecondarySales.setString(1, CUSTTYPE);
        pstmtSecondarySales.setString(2, RETLCUSTCODE);
    	pstmtSecondarySales.setString(3, FromDate);
		pstmtSecondarySales.setString(4, ToDate);
    	
    	var rsSecondarySales = pstmtSecondarySales.executeQuery();
    	while (rsSecondarySales.next()) 
    	{
    		 record = {};
    		record.RETL_CODE = rsSecondarySales.getString(1);
    		record.DSTB_CODE = rsSecondarySales.getString(2);
    	    record.DSTBNAME = rsSecondarySales.getString(3);
    		record.RETLNAME = rsSecondarySales.getString(4);
    		record.TRANSACTION_DATE = rsSecondarySales.getString(5);
    		record.MATERIAL_CODE = rsSecondarySales.getString(6);
    		record.MODEL_DESCRIPTION = rsSecondarySales.getString(7);
    		record.TRANSACTION_TYPE = rsSecondarySales.getString(8);
    		record.QUANTITY = rsSecondarySales.getString(9);
    	
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
		case "getSalesRegister":
		getSalesRegister();
		break;
		case "getSalesRegisterPartner":
		getSalesRegisterPartner();
		break;
		case "getSalesRegisterByRolePos":
		getSalesRegisterByRolePos();
		break;
		case "getSalesRegisterPartnerForEmp":
		getSalesRegisterPartnerForEmp();
		break;

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}