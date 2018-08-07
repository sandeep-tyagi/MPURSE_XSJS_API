function callPrimarySale(output, rsPrimarySales, connection) {
	var record;
	var recordFinal;
	var recordArray = [];
	//var recordCustomer;
	//var customerArray = [];
	var recordInvoice;
	var invoiceArray = [];
	var recordInvoiceLine;
	var invoiceLineArray = [];
	var recordInvoiceEquip;
	var invoiceEquipArray = [];
	while (rsPrimarySales.next()) {
		recordFinal = {};
		record = {};
		//record.CUSTOMERTYPE = rsPrimarySales.getString(9);
		record.DMSCUSTCODE = rsPrimarySales.getString(1);
		record.CUSTOMERNAME = rsPrimarySales.getString(2);
		//record.INVOICENO = rsPrimarySales.getString(1);
	//	record.INVOICE_LINE_NO = rsPrimarySales.getString(2);
	//	record.MATERIAL_CODE = rsPrimarySales.getString(3);
	//	record.SERIAL_NO = rsPrimarySales.getString(4);
	//	record.IMEI1 = rsPrimarySales.getString(5);

		var queryInvoice = 'select * from "MDB_DEV"."SALES_INVOICE_HEADER" where DMS_CUST_CODE=? ';
		var paramInvoice = connection.prepareStatement(queryInvoice);
		paramInvoice.setString(1, record.DMSCUSTCODE);
		var rsInvoice = paramInvoice.executeQuery();
		while (rsInvoice.next()) {
			recordInvoice = {};
			recordInvoice.INVOICENO = rsInvoice.getString(1);
			recordInvoice.INVOICEDATE = rsInvoice.getString(2);
			recordInvoice.BATCHNO = rsInvoice.getString(5);
			recordInvoice.INVOICETYPE = rsInvoice.getString(4);
			recordInvoice.PLANTCODE = rsInvoice.getString(6);
			recordInvoice.PRICE = rsInvoice.getString(11);
			recordInvoice.SALESORDER = rsInvoice.getString(12);
			//FETCH ALL INVOICE LINE DETAILS
			var queryInvoiceLine = 'select * from "MDB_DEV"."SALES_INVOICE_LINES" where INVOICE_NO=? ';
			var paramInvoiceLine = connection.prepareStatement(queryInvoiceLine);
			paramInvoiceLine.setString(1, recordInvoice.INVOICENO);
			var rsInvoiceLine = paramInvoiceLine.executeQuery();
			connection.commit();
			while (rsInvoiceLine.next()) {
				recordInvoiceLine = {};
				recordInvoiceLine.INVOICENO = rsInvoiceLine.getString(2);
				recordInvoiceLine.LINENO = rsInvoiceLine.getString(3);
				recordInvoiceLine.MATERIALCODE = rsInvoiceLine.getString(4);
				recordInvoiceLine.QTY = rsInvoiceLine.getString(5);
				recordInvoiceLine.SALESPRICE = rsInvoiceLine.getString(6);
			    recordInvoiceLine.CGST = rsInvoiceLine.getString(8);
				recordInvoiceLine.SGST = rsInvoiceLine.getString(9);
				recordInvoiceLine.IGST = rsInvoiceLine.getString(10);
				recordInvoiceLine.PRICE = rsInvoiceLine.getString(14);
				//FETCH ALL EQUIPMENT DETAILS
               
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
					recordInvoiceEquip.PRICE = (recordInvoiceLine.SALESPRICE/recordInvoiceLine.QTY);
					invoiceEquipArray.push(recordInvoiceEquip);
					recordInvoiceLine.INVOICEEQUIPMENTS = invoiceEquipArray;
				}

				invoiceEquipArray = [];

				invoiceLineArray.push(recordInvoiceLine);
				recordInvoice.INVOICELINES = invoiceLineArray;

			}
			invoiceLineArray = [];

			invoiceArray.push(recordInvoice);
			record.INVOICEHEADERS = invoiceArray;
		}
		invoiceArray = [];

		recordArray.push(record);
		recordFinal.CUSTOMERS = recordArray;

		output.results.push(recordFinal);
	}
}

function getCustomers() {
	var output = {
		results: []
	};
	var queryGetCustomer;
	var userCode = $.request.parameters.get('userCode');
	var userType = $.request.parameters.get('userType');
	var connection = $.db.getConnection();
	try {
		if (userType === 'SALESMANAGER') {
			queryGetCustomer = 'select  c.CUST_TYPE , c.FIRM_NAME  ,c.DMS_CUST_CODE,c.CUST_TYPE from "MDB_DEV"."MST_CUSTOMER" as c  where c.create_by=?';
		} else if (userType === 'BRANCHHEAD') {
			queryGetCustomer = 'select EMPLOYEE_NAME,EMPLOYEE_CODE,EMPLOYEE_CODE,POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID in ( ' +
				' select MA.AREA_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME  ' +
				' inner join "MDB_DEV"."MST_AREA" as MA on  ME.POSITION_VALUE_ID =  MA.DISTRICT_CODE where ME.EMPLOYEE_CODE=?)';
		} else if (userType === 'REGIONALSALESMANAGER' ) {
			queryGetCustomer = 'select EMPLOYEE_NAME,EMPLOYEE_CODE,EMPLOYEE_CODE,POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID in ( ' +
				' select MD.DISTRICT_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
				' inner join "MDB_DEV"."TRN_REGIONAL" as TR on  ME.POSITION_VALUE_ID = TR.REGIONAL_CODE ' +
				' inner join "MDB_DEV"."MST_DISTRICT" as MD on TR.STATE_CODE = MD.STATE_CODE ' + ' where ME.EMPLOYEE_CODE= ?)';
		} else if (userType === 'S&DCOORDINATOR' || userType === 'HEADOFSALES' || userType === 'HODCORDINATOR') {
			queryGetCustomer = 'select EMPLOYEE_NAME,EMPLOYEE_CODE,EMPLOYEE_CODE,POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID in ( ' +
				' select MR.REGIONAL_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
				' inner join "MDB_DEV"."MST_REGION" as MP on ME.POSITION_VALUE_ID = MP.REGION_CODE ' +
				' inner join "MDB_DEV"."MST_REGIONAL" as MR on MP.REGION_CODE = MR.ZONE_CODE ' + ' where ME.EMPLOYEE_CODE= ?)';
		} else if (userType === 'FINANCE') {
			queryGetCustomer = 'select EMPLOYEE_NAME,EMPLOYEE_CODE,EMPLOYEE_CODE,POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID in ( ' +
				' select MP.REGION_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
				' inner join "MDB_DEV"."MST_COUNTRY" as MC on ME.POSITION_VALUE_ID = MC.COUNTRY_CODE ' +
				' inner join "MDB_DEV"."MST_REGION" as MP on MC.COUNTRY_CODE = MP.COUNTRY_CODE ' + ' where ME.EMPLOYEE_CODE= ?)';
		}
		var pstmtGetCustomer = connection.prepareStatement(queryGetCustomer);
		pstmtGetCustomer.setString(1, userCode);
		var rGetCustomer = pstmtGetCustomer.executeQuery();
		connection.commit();
		while (rGetCustomer.next()) {
			var record = {};
			record.CUST_TYPE = 'SALESMANAGER'; //rGetCustomer.getString(1);
			record.CUST_NAME = rGetCustomer.getString(1);
			record.DBR_FORM_ID = rGetCustomer.getString(2);
			record.DMS_CUST_CODE = rGetCustomer.getString(3);
			record.PostionValue = rGetCustomer.getString(4);
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

/**
 * To get all primary sales.
 * @return {object} array of a resultset.
 */
function getPrimarySales() {
	var output = {
		results: []
	};
	var FromDate = $.request.parameters.get('FromDate');
	var ToDate = $.request.parameters.get('ToDate');
	var CustCode = $.request.parameters.get('CustCode');
	var connection = $.db.getConnection();
	try {
	    var query = 'SELECT distinct C.DMS_CUST_CODE,C.CUST_NAME from "MDB_DEV"."SALES_INVOICE_EQUIP" as "SIE" '
			+ ' inner JOIN "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" on SIE.INVOICE_NO=SIH.INVOICE_NO '
			+ ' inner JOIN "MDB_DEV"."SALES_INVOICE_LINES" as "SIL" on SIL.INVOICE_NO=SIH.INVOICE_NO '
			+ ' inner join "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE = SIH.DMS_CUST_CODE '
			+ ' where (SIH.INVOICE_DATE between ? and ?) and SIH.DMS_CUST_CODE in ' + CustCode;
			//SELECT SIE.INVOICE_NO,SIE.INVOICE_LINE_NO,SIE.MATERIAL_CODE,SIE.SERIAL_NO,SIE.IMEI1,SIE.IMEI2,C.CUST_NAME,C.DMS_CUST_CODE,C.CUST_TYPE 
		var pstmtPrimarySales = connection.prepareStatement(query);
		pstmtPrimarySales.setString(1, FromDate);
		pstmtPrimarySales.setString(2, ToDate);
		var rsPrimarySales = pstmtPrimarySales.executeQuery();
		connection.commit();
		callPrimarySale(output, rsPrimarySales, connection);
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

/**
 * To get  primary sales for a distbutor.
 ** @DMS_CUST_CODE parameter
 * @return {object} array of a resultset.
 */
function getPrimarySale() {
	var record;
	var recordFinal;
	var recordArray = [];
	//var recordCustomer;
	//var customerArray = [];
	var recordInvoice;
	var invoiceArray = [];
	var recordInvoiceLine;
	var invoiceLineArray = [];
	var recordInvoiceEquip;
	var invoiceEquipArray = [];

	var output = {
		results: []
	};
	//var areaStatus = $.request.parameters.get('areaStatus');
	try {
		var qryPrimarySales = null;
		var connection = $.db.getConnection();
		var dmsCustCode = $.request.parameters.get('DMSCUSTCODE');

		qryPrimarySales =
			' SELECT DISTINCT C.CUST_TYPE,C.DMS_CUST_CODE,C.CUST_NAME,C.EMAIL_ID,C.REGION,C.STATE,C.POSTAL_CODE from "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" ' +
			' inner join "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE = SIH.DMS_CUST_CODE  WHERE C.DMS_CUST_CODE=?';
		var pstmtPrimarySales = connection.prepareStatement(qryPrimarySales);
		pstmtPrimarySales.setString(1, dmsCustCode);
		var rsPrimarySales = pstmtPrimarySales.executeQuery();

		while (rsPrimarySales.next()) {
			recordFinal = {};
			record = {};
			record.CUSTOMERTYPE = rsPrimarySales.getString(1);
			record.DMSCUSTCODE = rsPrimarySales.getString(2);
			record.CUSTOMERNAME = rsPrimarySales.getString(3);
			record.EMAILID = rsPrimarySales.getString(4);
			record.REGION = rsPrimarySales.getString(5);
			record.STATE = rsPrimarySales.getString(6);
			record.POSTALCODE = rsPrimarySales.getString(7);
			//FETCH ALL CUSTOMER DETAILS
			// var queryCustomer = 'select * from "MDB_DEV"."MST_CUSTOMER" where CUST_TYPE=? ';
			// var paramCustomer = connection.prepareStatement(queryCustomer);
			//paramCustomer.setString(1, record.CUSTOMERTYPE);
			//var rsCustomer = paramCustomer.executeQuery();
			// while (rsCustomer.next()) 
			// {   recordCustomer = {};
			//recordCustomer.CUSTTYPE = rsCustomer.getString(1);
			//recordCustomer.SAPUSERID = rsCustomer.getString(2);
			//recordCustomer.CUSTOMERNAME = rsCustomer.getString(4);
			//FETCH ALL INVOICE DETAILS
			var queryInvoice = 'select * from "MDB_DEV"."SALES_INVOICE_HEADER" where DMS_CUST_CODE=? ';
			var paramInvoice = connection.prepareStatement(queryInvoice);
			paramInvoice.setString(1, record.DMSCUSTCODE);
			var rsInvoice = paramInvoice.executeQuery();
			while (rsInvoice.next()) {
				recordInvoice = {};
				recordInvoice.INVOICENO = rsInvoice.getString(1);
				recordInvoice.INVOICEDATE = rsInvoice.getString(2);
				recordInvoice.BATCHNO = rsInvoice.getString(5);
				recordInvoice.INVOICETYPE = rsInvoice.getString(4);
				recordInvoice.PLANTCODE = rsInvoice.getString(6);
				recordInvoice.INVOICEVALUE = rsInvoice.getString(11);
				recordInvoice.SALESORDER = rsInvoice.getString(12);
				//FETCH ALL INVOICE LINE DETAILS
				var queryInvoiceLine = 'select * from "MDB_DEV"."SALES_INVOICE_LINES" where INVOICE_NO=? ';
				var paramInvoiceLine = connection.prepareStatement(queryInvoiceLine);
				paramInvoiceLine.setString(1, recordInvoice.INVOICENO);
				var rsInvoiceLine = paramInvoiceLine.executeQuery();
				connection.commit();
				while (rsInvoiceLine.next()) {
					recordInvoiceLine = {};
					recordInvoiceLine.INVOICENO = rsInvoiceLine.getString(2);
					recordInvoiceLine.LINENO = rsInvoiceLine.getString(3);
					recordInvoiceLine.MATERIALCODE = rsInvoiceLine.getString(4);
					recordInvoiceLine.QTY = rsInvoiceLine.getString(5);
					//FETCH ALL EQUIPMENT DETAILS

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
					recordInvoice.INVOICELINES = invoiceLineArray;

				}
				invoiceLineArray = [];

				invoiceArray.push(recordInvoice);
				record.INVOICEHEADERS = invoiceArray;
			}
			recordArray.push(record);
			recordFinal.CUSTOMERS = recordArray;

			output.results.push(recordFinal);

			//customerArray.push(recordCustomer);
			//record.result = customerArray;
			//}
			// customerArray = [];

			//	record.INVOICELINENO = rsPrimarySales.getString(2);
			// record.CUSTOMERTYPE = rsPrimarySales.getString(9);
			//	record.SAPUSERID = rsPrimarySales.getString(8);
			//record.CUSTOMERNAME = rsPrimarySales.getString(7);
			//	record.MATERIALCODE = rsPrimarySales.getString(3);
			//record.SERIALNO = rsPrimarySales.getString(4);
			//record.IMEI1 = rsPrimarySales.getString(5);
			//record.IMEI2 = rsPrimarySales.getString(6);

			//output.results.push(record);
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

/*function getPrimarySale() {
	var record;
	
	
	
	var output = {
		results: []
	};
    //var areaStatus = $.request.parameters.get('areaStatus');
	try {
        var qryPrimarySales = null;
        var connection = $.db.getConnection();
       
            qryPrimarySales = ' SELECT SIE.INVOICE_NO,SIE.INVOICE_LINE_NO,SIE.MATERIAL_CODE,SIE.SERIAL_NO,SIE.IMEI1,SIE.IMEI2,C.CUST_NAME,C.SAPUSER_ID,C.CUST_TYPE from "MDB_DEV"."SALES_INVOICE_EQUIP" as "SIE" '
+ ' JOIN "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" on SIE.INVOICE_NO=SIH.INVOICE_NO '
      + ' inner join "MDB_DEV"."MST_CUSTOMER" as "C" on C.SAPUSER_ID = SIE.SAPUSER_ID ';
    	var pstmtPrimarySales = connection.prepareStatement(qryPrimarySales);
    	var rsPrimarySales = pstmtPrimarySales.executeQuery();
    
    	while (rsPrimarySales.next()) 
    	{
    		 record = {};
    		 
	
    		record.INVOICELINENO = rsPrimarySales.getString(2);
    	    record.CUSTOMERTYPE = rsPrimarySales.getString(9);
    		record.SAPUSERID = rsPrimarySales.getString(8);
    		record.CUSTOMERNAME = rsPrimarySales.getString(7);
    		record.MATERIALCODE = rsPrimarySales.getString(3);
    		record.SERIALNO = rsPrimarySales.getString(4);
    	record.IMEI1 = rsPrimarySales.getString(5);
    		record.IMEI2 = rsPrimarySales.getString(6);
    
    	
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
}*/

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "getPrimarySales":
		getPrimarySales();
		break;
	case "getPrimarySale":
		getPrimarySale();
		break;
	case "getCustomers":
		getCustomers();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}