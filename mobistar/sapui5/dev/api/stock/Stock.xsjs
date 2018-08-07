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

function dateFormats(record) {
	var date = record.CREATE_DATE;
	if (date) {
		record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
		return record.CREATE_DATE;
	}
}

/**
 *  * To get Stock movement report.
 * @return {object} array of a resultset.
 * @author: Laxmi
 **/
function getStockMovementReport(){
    var output = {
		results: []
	};
	var record;
	var CustCode = $.request.parameters.get('CustCode');
	var FromDate = $.request.parameters.get('FromDate');
	var ToDate = $.request.parameters.get('ToDate');
	var connection = $.db.getConnection();
	try {
		var query = 'select ME.MATERIAL_CODE,ME.IMEI1,ME.IMEI2,ME.PLANT_CODE,ME.MANUFACTURING_DATE,MM.MODEL_CODE,MM.MODEL_DESCRIPTION, '
+ ' ME.PRIMARYSALE_CUSTOMER,MC.CUST_NAME,ME.PRIMARYSALE_DATE,ME.PRIMARYSALE_RECEIVING_DATE,ME.SECONDARYSALE_CUSTOMER,ME.SECONDARYSALE_DATE,ME.SECONDARYSALE_RECEIVING_DATE,ME.TERTIARY_CUSTOMER,ME.TERTIARY_DATE ,ME.SERIAL_NUMBER , (SELECT dms_cust_code FROM "MDB_DEV"."MST_CUSTOMER" WHERE DMS_CUST_CODE = ME.SECONDARYSALE_CUSTOMER  ) AS RETAILER_NAME '
	+ '	from "MDB_DEV"."MST_EQUIPMENT" as ME inner join "MDB_DEV"."MST_MATERIAL_MASTER" as MM on ME.MATERIAL_CODE = MM.MATERIAL_CODE inner join "MDB_DEV"."MST_CUSTOMER" as MC on ME.PRIMARYSALE_CUSTOMER = MC.DMS_CUST_CODE '
+ ' where MC.DMS_CUST_CODE in ' + CustCode
+ ' and ((ME.PRIMARYSALE_RECEIVING_DATE between ? and ?) or (ME.PRIMARYSALE_DATE between ? and ?)) ';
		var pstmt = connection.prepareStatement(query);
		//pstmt.setString(1, CustCode);
		pstmt.setString(1, FromDate);
		pstmt.setString(2, ToDate);
		pstmt.setString(3, FromDate);
		pstmt.setString(4, ToDate);
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
			record.PRIMARYSALE_CUSTOMERNAME = rs.getString(9);
			record.PRIMARYSALE_DATE = rs.getString(10);
			record.PRIMARYSALE_RECEIVING_DATE = rs.getString(11);
			record.SECONDARYSALE_CUSTOMER = rs.getString(12);
			
			getCustName(record.SECONDARYSALE_CUSTOMER,record);
			record.SECONDARYSALE_CUSTOMERNAME = record.CustName;
			
			record.SECONDARYSALE_DATE = rs.getString(13);
			record.SECONDARYSALE_RECEIVING_DATE = rs.getString(14);
			record.TERTIARY_CUSTOMER = rs.getString(15);
			
			getCustName(record.TERTIARY_CUSTOMER,record);
			record.TERTIARY_CUSTOMERNAME = record.CustName;
			
			record.TERTIARY_DATE = rs.getString(16);
			record.SERIAL_NUMBER = rs.getString(17);
			record.RETAILER_NAME = rs.getString(18);
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
 *  * To get all receiving stocks.
 * @return {object} array of a resultset.
 * @author: Rohit
 **/
function getStocks() {
	var recordInvoiceHeader;
	var recordInvoiceLine;
	var invoiceLineArray = [];
	var recordInvoiceEquip;
	var invoiceEquipArray = [];
	var output = {
		results: []
	};
	try {
		var qryInvoiceHeader = null;
		var connection = $.db.getConnection();
		qryInvoiceHeader =
			'select SIH.INVOICE_NO,SIH.INVOICE_DATE,SIH.BATCH_NO,SIH.INVOICE_TYPE,SIH.PLANT_CODE,SIH.INVOICE_VALUE,SIH.SALES_ORDER,C.CUST_TYPE,C.SAPUSER_ID,C.CUST_NAME from "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" ' +
			' inner join "MDB_DEV"."MST_CUSTOMER" as "C" on C.SAPUSER_ID = SIH.SAPUSER_ID';
		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);

		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.CUSTOMERTYPE = rsInvoiceHeader.getString(8);
			recordInvoiceHeader.SAPUSERID = rsInvoiceHeader.getString(9);
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

/**
 *  * To get all stock aaccording to customerid.
 * @Param {String} sapuserid for search
 * @return {object} array of a resultset.
 * @author : Rohit
 * */
function getStock() {
	var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	var recordInvoiceHeader;
	var recordInvoiceLine;
	var invoiceLineArray = [];
	var recordInvoiceEquip;
	var invoiceEquipArray = [];
	var output = {
		results: []
	};
	try {
		var qryInvoiceHeader = null;
		var connection = $.db.getConnection();
		qryInvoiceHeader =
			'select SIH.INVOICE_NO,SIH.INVOICE_DATE,SIH.BATCH_NO,SIH.INVOICE_TYPE,SIH.PLANT_CODE,SIH.INVOICE_VALUE,SIH.SALES_ORDER,C.CUST_TYPE,C.SAPUSER_ID,C.CUST_NAME from "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" ' +
			' inner join "MDB_DEV"."MST_CUSTOMER" as "C" on C.SAPUSER_ID = SIH.SAPUSER_ID where SIH.SAPUSER_ID=?';
		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);
		pstmtInvoiceHeader.setString(1, SAPUSER_ID);
		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.CUSTOMERTYPE = rsInvoiceHeader.getString(8);
			recordInvoiceHeader.SAPUSERID = rsInvoiceHeader.getString(9);
			recordInvoiceHeader.CUSTOMERNAME = rsInvoiceHeader.getString(10);
			recordInvoiceHeader.INVOICENO = rsInvoiceHeader.getString(1);
			recordInvoiceHeader.INVOICEDATE = rsInvoiceHeader.getString(2);
			recordInvoiceHeader.BATCHNO = rsInvoiceHeader.getString(3);
			recordInvoiceHeader.INVOICETYPE = rsInvoiceHeader.getString(4);
			recordInvoiceHeader.PLANTCODE = rsInvoiceHeader.getString(5);
			recordInvoiceHeader.INVOICE_AMOUNT = rsInvoiceHeader.getString(6);
			recordInvoiceHeader.SALESORDER = rsInvoiceHeader.getString(7);
			recordInvoiceHeader.IsChecked = "0";
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
				recordInvoiceLine.IsChecked = "0";
				var queryInvoiceEquip = 'select SIE.SERIAL_NO,SIE.IMEI1,SIE.IMEI2 from "MDB_DEV"."SALES_INVOICE_EQUIP" AS "SIE" '
				+'  JOIN "MDB_DEV"."MST_EQUIPMENT" AS "E" ON SIE.SERIAL_NO=E.SERIAL_NUMBER'
				+' where SIE.INVOICE_NO=? and E.GSM_STATUS=0  and SIE.INVOICE_LINE_NO=? ';
				var paramInvoiceEquip = connection.prepareStatement(queryInvoiceEquip);
				paramInvoiceEquip.setString(1, recordInvoiceLine.INVOICENO);
				paramInvoiceEquip.setString(2, recordInvoiceLine.LINENO);
				var rsInvoiceEquip = paramInvoiceEquip.executeQuery();
				while (rsInvoiceEquip.next()) {
					recordInvoiceEquip = {};
					//recordInvoiceEquip.MATERIALCODE = rsInvoiceEquip.getString(4);
					recordInvoiceEquip.SERIALNO = rsInvoiceEquip.getString(1);
					recordInvoiceEquip.IMEI1 = rsInvoiceEquip.getString(2);
					recordInvoiceEquip.IMEI2 = rsInvoiceEquip.getString(3);
					recordInvoiceEquip.IsChecked = "0";
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

/**
 *  * To get all stock movement.
 * @Param {String} sapuserid for search
 * @return {object} array of a resultset.
 * @author : Rohit
 * */
function getStockMovements() {
	//var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	var recordInvoiceHeader;
	var output = {
		results: []
	};
	try {
		var qryInvoiceHeader = null;
		var connection = $.db.getConnection();
		qryInvoiceHeader =
			'select DISTINCT M.MODEL_CODE,M.MODEL_DESCRIPTION,M.MATERIAL_CODE,M.MATERIAL_DESC,' +
			'TEM.SERIAL_NO,TEM.IMEI1,TEM.IMEI2,E.MANUFACTURING_DATE as "MWHRECDATE",' +
			'SIH.INVOICE_DATE as "MWHSALEDATE",C.CUST_NAME as "DSTB",TEM.TRANSACTION_DATE as "DSTMRECDATE",' +
			'TEM.TRANSACTION_DATE as"DSTBSALEDATE",C.CUST_NAME as "RETL",TEM.TRANSACTION_DATE as"RETLRECDATE"' +
			'from "MDB_DEV"."MST_CUSTOMER" as "C"' + 
			'INNER JOIN "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" on SIH.DMS_CUST_CODE=C.DMS_CUST_CODE ' +
			'INNER JOIN "MDB_DEV"."SALES_INVOICE_LINES" as "SIL" on SIL.INVOICE_NO=SIH.INVOICE_NO ' +
			'INNER JOIN "MDB_DEV"."SALES_INVOICE_EQUIP" as "SIE" on SIE.INVOICE_NO=SIH.INVOICE_NO ' +
			'INNER JOIN "MDB_DEV"."TRN_EQUIPMENT_MASTER" as "TEM" on SIE.SERIAL_NO=TEM.SERIAL_NO ' +
			'INNER JOIN "MDB_DEV"."MST_MATERIAL_MASTER" as "M" on SIE.MATERIAL_CODE=TEM.MATERIAL_CODE ' +
			'INNER JOIN "MDB_DEV"."MST_EQUIPMENT" as "E" on E.SERIAL_NUMBER=TEM.SERIAL_NO';
		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);

		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.MODELCODE = rsInvoiceHeader.getString(1);
			recordInvoiceHeader.MODELDESCRIPTION = rsInvoiceHeader.getString(2);
			recordInvoiceHeader.MATERIALCODE = rsInvoiceHeader.getString(3);
			recordInvoiceHeader.MATERIALDESC = rsInvoiceHeader.getString(4);
			recordInvoiceHeader.SERIALNO = rsInvoiceHeader.getString(5);
			recordInvoiceHeader.IMEI1 = rsInvoiceHeader.getString(6);
			recordInvoiceHeader.IMEI2 = rsInvoiceHeader.getString(7);
			recordInvoiceHeader.MWHRECDATE = rsInvoiceHeader.getString(8);
			recordInvoiceHeader.MWHSALEDATE = rsInvoiceHeader.getString(9);
			recordInvoiceHeader.DSTB = rsInvoiceHeader.getString(10);
			recordInvoiceHeader.DSTBRECDATE = rsInvoiceHeader.getString(11);
			recordInvoiceHeader.DSTBSALEDATE = rsInvoiceHeader.getString(12);
			recordInvoiceHeader.RETL = rsInvoiceHeader.getString(13);
			recordInvoiceHeader.RETLRECDATE = rsInvoiceHeader.getString(14);

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

/**
 *  * To get all stock movement according to customerid.
 * @Param {String} sapuserid for search
 * @return {object} array of a resultset.
 * @author : Rohit
 * */
function getStockMovement() {
	var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	var recordInvoiceHeader;
	var output = {
		results: []
	};
	try {
		var qryInvoiceHeader = null;
		var connection = $.db.getConnection();
		qryInvoiceHeader =
			'select DISTINCT M.MODEL_CODE,M.MODEL_DESCRIPTION,M.MATERIAL_CODE,M.MATERIAL_DESC,' +
			'TEM.SERIAL_NO,TEM.IMEI1,TEM.IMEI2,E.MANUFACTURING_DATE as "MWHRECDATE",' +
			'SIH.INVOICE_DATE as "MWHSALEDATE",C.CUST_NAME as "DSTB",TEM.TRANSACTION_DATE as "DSTMRECDATE",' +
			'TEM.TRANSACTION_DATE as"DSTBSALEDATE",C.CUST_NAME as "RETL",TEM.TRANSACTION_DATE as"RETLRECDATE"' +
			'from "MDB_DEV"."MST_CUSTOMER" as "C"' + 'INNER JOIN "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" on SIH.SAPUSER_ID=C.SAPUSER_ID ' +
			'INNER JOIN "MDB_DEV"."SALES_INVOICE_LINES" as "SIL" on SIL.INVOICE_NO=SIH.INVOICE_NO ' +
			'INNER JOIN "MDB_DEV"."SALES_INVOICE_EQUIP" as "SIE" on SIE.INVOICE_NO=SIH.INVOICE_NO ' +
			'INNER JOIN "MDB_DEV"."TRN_EQUIPMENT_MASTER" as "TEM" on SIE.SERIAL_NO=TEM.SERIAL_NO ' +
			'INNER JOIN "MDB_DEV"."MST_MATERIAL_MASTER" as "M" on SIE.MATERIAL_CODE=TEM.MATERIAL_CODE ' +
			'INNER JOIN "MDB_DEV"."MST_EQUIPMENT" as "E" on E.SERIAL_NUMBER=TEM.SERIAL_NO ' + 'WHERE C.SAPUSER_ID=? ';
		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);
		pstmtInvoiceHeader.setString(1, SAPUSER_ID);
		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.MODELCODE = rsInvoiceHeader.getString(1);
			recordInvoiceHeader.MODELDESCRIPTION = rsInvoiceHeader.getString(2);
			recordInvoiceHeader.MATERIALCODE = rsInvoiceHeader.getString(3);
			recordInvoiceHeader.MATERIALDESC = rsInvoiceHeader.getString(4);
			recordInvoiceHeader.SERIALNO = rsInvoiceHeader.getString(5);
			recordInvoiceHeader.IMEI1 = rsInvoiceHeader.getString(6);
			recordInvoiceHeader.IMEI2 = rsInvoiceHeader.getString(7);
			recordInvoiceHeader.MWHRECDATE = rsInvoiceHeader.getString(8);
			recordInvoiceHeader.MWHSALEDATE = rsInvoiceHeader.getString(9);
			recordInvoiceHeader.DSTB = rsInvoiceHeader.getString(10);
			recordInvoiceHeader.DSTBRECDATE = rsInvoiceHeader.getString(11);
			recordInvoiceHeader.DSTBSALEDATE = rsInvoiceHeader.getString(12);
			recordInvoiceHeader.RETL = rsInvoiceHeader.getString(13);
			recordInvoiceHeader.RETLRECDATE = rsInvoiceHeader.getString(14);

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

/**
 *  * To get Retailer,Distributor stock Registers.
 * @Param {String} SAPUSER_ID for distributor/retailor.

 * @Param {String} CUST_TYPE for Customer Type(DSTB/RETL).
 * @return {object} array of a resultset.
 * @author : Rohit
 * */
function getStockRegisters() {
	//var DSTBUSER_ID = $.request.parameters.get('DSTBUSER_ID');
	var SAPUSER_ID = $.request.parameters.get('SAPUSERID');
	var CUST_TYPE = $.request.parameters.get('CUST_TYPE');
	 var FromDate = $.request.parameters.get('FromDate');
	 var ToDate = $.request.parameters.get('ToDate');
	var recordInvoiceHeader;
	var output = {
		results: []
	};
	try {
		var qryInvoiceHeader = null;
		var connection = $.db.getConnection();
		qryInvoiceHeader =
			/*'SELECT S.CUSTOMER_TYPE,S.CUSTOMER_CODE,C.CUST_NAME,M.MODEL_CODE,M.MODEL_DESCRIPTION,' +
			' S.MATERIAL_CODE,M.MATERIAL_DESC,S.CURRENT_STOCK from "MDB_DEV"."MST_STOCKS" as "S"' +
			' JOIN "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE=S.CUSTOMER_CODE' +
			' JOIN "MDB_DEV"."MST_MATERIAL_MASTER" as "M" on M.MATERIAL_CODE=S.MATERIAL_CODE' +
			' WHERE C.PARENT_CUST_CODE=COALESCE(?,C.PARENT_CUST_CODE) AND C.DMS_CUST_CODE= COALESCE(?,C.DMS_CUST_CODE)' +
			' AND C.CUST_TYPE=COALESCE(?,C.CUST_TYPE)AND S.CREATE_DATE>=? AND S.CREATE_DATE<=?';*/
			
			 'SELECT DISTINCT C.CUST_TYPE,S.CUSTOMER_CODE,C.CUST_NAME,M.MODEL_CODE,M.MODEL_DESCRIPTION,S.MATERIAL,M.MATERIAL_DESC,'+
			 'IFNULL((SELECT INVENTORY_AFTER_TR FROM'
             + ' (SELECT INVENTORY_AFTER_TR,ROW_NUMBER() OVER (PARTITION BY MATERIAL ORDER BY TRN_STOCK_TRANSACTION_ID ) AS ROWW  FROM '
             +' "MDB_DEV"."TRN_STOCKS" WHERE TRANSACTION_DATE < \''+ FromDate +'\' AND MATERIAL=S.MATERIAL AND CUSTOMER_CODE=S.CUSTOMER_CODE)'
             +' OPENINGTBL WHERE ROWW=1),0)  AS OPENINGSTOCK,'+
			' IFNULL((SELECT SUM(TRANSACTION_QTY) FROM "MDB_DEV"."TRN_STOCKS" WHERE '+
			' TRANSACTION_DATE >= \''+FromDate+'\' AND TRANSACTION_DATE <= \''+ToDate+'\' AND TRANSACTION_TYPE=?'+
			' AND MATERIAL= S.MATERIAL AND CUSTOMER_CODE=S.CUSTOMER_CODE),0) AS RECEIVE,'+
			' IFNULL((SELECT SUM(TRANSACTION_QTY) FROM "MDB_DEV"."TRN_STOCKS" WHERE '+
			' TRANSACTION_DATE >= \''+FromDate+'\' AND TRANSACTION_DATE <= \''+ToDate+'\' AND TRANSACTION_TYPE=?'+
			' AND MATERIAL= S.MATERIAL AND CUSTOMER_CODE=S.CUSTOMER_CODE),0) AS SALE,'+
			 'IFNULL((SELECT INVENTORY_AFTER_TR FROM'
             + ' (SELECT INVENTORY_AFTER_TR,ROW_NUMBER() OVER (PARTITION BY MATERIAL ORDER BY TRN_STOCK_TRANSACTION_ID DESC ) AS ROWW  FROM '
             +' "MDB_DEV"."TRN_STOCKS" WHERE TRANSACTION_DATE < \''+ ToDate +'\' AND MATERIAL=S.MATERIAL AND CUSTOMER_CODE=S.CUSTOMER_CODE)'
             +' OPENINGTBL WHERE ROWW=1),0)  AS CLOSINGSTOCK'+
			' from "MDB_DEV"."TRN_STOCKS" as "S"'+
			' JOIN "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE=S.CUSTOMER_CODE'+
		    ' JOIN "MDB_DEV"."MST_MATERIAL_MASTER" as "M" on M.MATERIAL_CODE=S.MATERIAL'
		   + ' WHERE  S.CUSTOMER_CODE= COALESCE(?,S.CUSTOMER_CODE)'
			+' AND C.CUST_TYPE=COALESCE(?,C.CUST_TYPE)AND S.CREATE_DATE>=? AND S.CREATE_DATE<=?';

		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);
		pstmtInvoiceHeader.setString(1, 'STOCKREC');
		pstmtInvoiceHeader.setString(2, 'STOCKSAL');
		pstmtInvoiceHeader.setString(3, SAPUSER_ID);
		pstmtInvoiceHeader.setString(4, CUST_TYPE);
		pstmtInvoiceHeader.setString(5, FromDate);
		pstmtInvoiceHeader.setString(6, ToDate);
		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.CUSTOMERTYPE = rsInvoiceHeader.getString(1);
			recordInvoiceHeader.CUSTOMERCODE = rsInvoiceHeader.getString(2);
			recordInvoiceHeader.CUSTNAME = rsInvoiceHeader.getString(3);
			recordInvoiceHeader.MODELCODE = rsInvoiceHeader.getString(4);
			recordInvoiceHeader.MODELDESCRIPTION = rsInvoiceHeader.getString(5);
			recordInvoiceHeader.MATERIALCODE = rsInvoiceHeader.getString(6);
			recordInvoiceHeader.MATERIALDESC = rsInvoiceHeader.getString(7);
			recordInvoiceHeader.OPENINGSTOCK = rsInvoiceHeader.getString(8);
			recordInvoiceHeader.RECEIVE = rsInvoiceHeader.getString(9);
			recordInvoiceHeader.SALE = rsInvoiceHeader.getString(10);
			recordInvoiceHeader.CLOSINGSTOCK = rsInvoiceHeader.getString(11);
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

function receivingEquipment() {
	var output = {
		results: []
	};

	var record = {};
	/////////////////////////////////////////////////
	//Paramerers of receiving Equipment Function/////
	/////////////////////////////////////////////////
	//var TRANSACTION_DATE = $.request.parameters.get('TRANSACTION_DATE');
	//var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	var connection = $.db.getConnection();
	var serialNos = $.request.parameters.get('serialNos');

	try {
		var bool = false;
		var oFinalSerialNoResult = JSON.parse(serialNos);
		for (var i = 0; i < oFinalSerialNoResult.results.length; i++) {
			for (var m = 0; m < oFinalSerialNoResult.results[i].INVOICELINES.length; m++) {
				for (var k = 0; k < oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS.length; k++) {
					if (oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].IsChecked === '1') 
					{
						bool = true;
						var IMEI1 = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].IMEI1;
						var INVOICENO = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICENO;
						var INVOICELINENO = oFinalSerialNoResult.results[i].INVOICELINES[m].LINENO;
						var SERIALNO = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].SERIALNO;
						var IMEI2 = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].IMEI2;
						var SAPUSERID = oFinalSerialNoResult.results[i].SAPUSERID;
						var MATERIALCODE = oFinalSerialNoResult.results[i].INVOICELINES[m].MATERIALCODE;
						var BATCHNO = oFinalSerialNoResult.results[i].BATCHNO;
						var PLANTCODE = oFinalSerialNoResult.results[i].PLANTCODE;

						var CallProcTRANEQUIP = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::TRAN_EQUIPMENT"(?,?,?,?,?,?,?,?,?)';
						var pstmtCallProcTRANEQUIP = connection.prepareCall(CallProcTRANEQUIP);
						pstmtCallProcTRANEQUIP.setString(1, INVOICENO);
						pstmtCallProcTRANEQUIP.setString(2, INVOICELINENO);
						pstmtCallProcTRANEQUIP.setString(3, SERIALNO);
						pstmtCallProcTRANEQUIP.setString(4, IMEI1);
						pstmtCallProcTRANEQUIP.setString(5, IMEI2);
						pstmtCallProcTRANEQUIP.setString(6, SAPUSERID);
						pstmtCallProcTRANEQUIP.setString(7, MATERIALCODE);
						pstmtCallProcTRANEQUIP.setString(8, BATCHNO);
						pstmtCallProcTRANEQUIP.setString(9, PLANTCODE);
                        pstmtCallProcTRANEQUIP.execute();
						//var rsCallProcTRANEQUIP = pstmtCallProcTRANEQUIP.getParameterMetaData();
						var rsCallProcTRANEQUIP = pstmtCallProcTRANEQUIP.getParameterMetaData();
						connection.commit();
						if (rsCallProcTRANEQUIP.getParameterCount() > 0) 
						{
							record.status = 1;
							record.message = 'Data is Successfully Updated';
						}
					}

				}
				if (bool === false) {

					record.status = '3';
					record.message = 'No Data Is Selected';

				}
			}
		}
		output.results.push(record);
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

	case "getStock":
		getStock();
		break;
	case "getStocks":
		getStocks();
		break;
	case "receivingEquipment":
		receivingEquipment();
		break;
	case "getStockMovements":
		getStockMovements();
		break;
	case "getStockMovement":
		getStockMovement();
		break;
	case "getStockRegisters":
		getStockRegisters();
		break;
    case "getStockMovementReport":
        getStockMovementReport();
        break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}





	/*' SELECT C.CUST_TYPE,S.CUSTOMER_CODE,C.CUST_NAME,M.MODEL_CODE,M.MODEL_DESCRIPTION, '
			+ 'S.MATERIAL,M.MATERIAL_DESC, '
			+ ' (SELECT SUM(TRANSACTION_QTY) FROM "MDB_DEV"."TRN_STOCKS" WHERE TRANSACTION_DATE > ?) AS OPENINGSTOCK, '
			+ ' (SELECT SUM(TRANSACTION_QTY) FROM "MDB_DEV"."TRN_STOCKS" WHERE TRANSACTION_DATE >= ? AND TRANSACTION_DATE <= ? ) AS RECEIVE,'
			+ ' (SELECT SUM(TRANSACTION_QTY) FROM "MDB_DEV"."TRN_STOCKS" WHERE  TRANSACTION_DATE <= ? ) AS CLOSINGSTOCK  '
			+' from "MDB_DEV"."TRN_STOCKS" as "S"'
			 + ' JOIN "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE=S.CUSTOMER_CODE'
			 + ' JOIN "MDB_DEV"."MST_MATERIAL_MASTER" as "M" on M.MATERIAL_CODE=S.MATERIAL'
			+' WHERE C.PARENT_CUST_CODE=COALESCE(?,C.PARENT_CUST_CODE) AND C.DMS_CUST_CODE= COALESCE(?,C.DMS_CUST_CODE)' +
			' AND C.CUST_TYPE=COALESCE(?,C.CUST_TYPE)AND S.CREATE_DATE>=? AND S.CREATE_DATE<=?';

		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);
	
		pstmtInvoiceHeader.setString(1, SAPUSER_ID);
		pstmtInvoiceHeader.setString(2, DSTBUSER_ID);
		pstmtInvoiceHeader.setString(3, CUST_TYPE);
		pstmtInvoiceHeader.setString(4, FromDate);
		pstmtInvoiceHeader.setString(5, ToDate);
		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.CUSTOMERTYPE = rsInvoiceHeader.getString(1);
			recordInvoiceHeader.CUSTOMERCODE = rsInvoiceHeader.getString(2);
			recordInvoiceHeader.CUSTNAME = rsInvoiceHeader.getString(3);
			recordInvoiceHeader.MODELCODE = rsInvoiceHeader.getString(4);
			recordInvoiceHeader.MODELDESCRIPTION = rsInvoiceHeader.getString(5);
			recordInvoiceHeader.MATERIALCODE = rsInvoiceHeader.getString(6);
			recordInvoiceHeader.MATERIALDESC = rsInvoiceHeader.getString(7);
			recordInvoiceHeader.OPENINGSTOCK = rsInvoiceHeader.getString(8);
				recordInvoiceHeader.RECEIVE = rsInvoiceHeader.getString(9);
				recordInvoiceHeader.SALE = rsInvoiceHeader.getString(10);
					recordInvoiceHeader.CLOSINGSTOCK = rsInvoiceHeader.getString(11);
			output.results.push(recordInvoiceHeader);*/