 /*
  * API will use to upload  excel data  into SalesInvoiceHeader Table .
  * create by Shriyansi.
  */

 function populateInvoiceHeaderExcel() {
 	var Output = [];
 	var connection = $.db.getConnection();
 	var InvHeaderUpdateRecord = {};

 	var excelData = $.request.parameters.get('ApexData');

 	var excelDataJson = JSON.parse(excelData);
 	var excelDataInJson = JSON.parse(JSON.stringify(excelDataJson));
 	var record = {};

 	var batchSize = 1500;

 	try {
 		var batchSize = 1500;
 		for (var i = 0; i < excelDataInJson.length; i++) {
 			var dict = excelDataInJson[i];

 			var queryInvHeaderPost =
 				'insert into "MDB_DEV"."SALES_INVOICE_HEADER" ("INVOICE_NO","INVOICE_DATE","SAPUSER_ID","INVOICE_TYPE","BILL_TO_PARTY_CODE","BILL_TO_PARTY_NAME", ' +
 				' "SHIP_TO_PARTY_CODE","SHIP_TO_PARTY_NAME","INVOICE_VALUE","SALES_ORDER","CURRENCY","EXC_RATE","SAP_INV_DATE", ' +
 				' "SAP_INV_TIME","CANCELED_INVOICE","ODN","CREATE_BY","BATCH_NO","PLANT_CODE","SOFTDELL") values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
 			var pstmtInvHeaderPost = connection.prepareStatement(queryInvHeaderPost);
 			pstmtInvHeaderPost.setString(1, dict.InvoiceNo);
 			pstmtInvHeaderPost.setString(2, dict.InvoiceDate);
 			pstmtInvHeaderPost.setString(3, dict.CustCode);
 			pstmtInvHeaderPost.setString(4, dict.InvoiceType);
 			pstmtInvHeaderPost.setString(5, dict.BillToPartyCode);
 			pstmtInvHeaderPost.setString(6, dict.BillToPartyName);
 			pstmtInvHeaderPost.setString(7, dict.ShipToPartyCode);
 			pstmtInvHeaderPost.setString(8, dict.ShipToPartyName);
 			pstmtInvHeaderPost.setString(9, dict.InvoiceValue);
 			pstmtInvHeaderPost.setString(10, dict.SalesOrder);
 			pstmtInvHeaderPost.setString(11, dict.Currency);
 			pstmtInvHeaderPost.setString(12, dict.ExcRate);
 			pstmtInvHeaderPost.setString(13, dict.SAPInvDate);
 			pstmtInvHeaderPost.setString(14, dict.SAPInvTime);
 			pstmtInvHeaderPost.setString(15, dict.CanceledBillingDocNumber);
 			pstmtInvHeaderPost.setString(16, dict.ODNNumber);
 			pstmtInvHeaderPost.setString(17, "ManualJob");
 			pstmtInvHeaderPost.setString(18, dict.BATCH_NO);
 			pstmtInvHeaderPost.setString(19, dict.PLANT_CODE);
 			pstmtInvHeaderPost.setString(20, dict.SOFTDELL);
 			var rsInvHeaderPost = pstmtInvHeaderPost.executeUpdate();
 			connection.commit();
 			if (rsInvHeaderPost > 0) {
 				InvHeaderUpdateRecord.status = '1';
 				InvHeaderUpdateRecord.message = 'Invoice Header Data Successfully Uploaded';
 				Output.push(InvHeaderUpdateRecord);
 			} else {
 				InvHeaderUpdateRecord.status = '0';
 				InvHeaderUpdateRecord.message = 'Something went Wrong,Invoice Header data is not insert';
 				Output.push(InvHeaderUpdateRecord);
 			}
 			if (i % batchSize === 0) {
 				connection.commit();
 				connection.close();
 				connection = $.db.getConnection();
 			}
 		}
 		connection.close();
 		var messages = Output.length + ' out of ' + (excelDataInJson.length) + ' has been Updated in Invoice Header Table';
 	} catch (e) {
 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);
 		return;
 	}
 	var body = JSON.stringify(messages);
 	$.response.contentType = 'application/json';
 	$.response.setBody(body);
 	$.response.status = $.net.http.OK;
 }

 /*
  * API will use to upload  excel data  into SalesInvoiceLine  Table .
  * create by Shriyansi.
  */
 function populateInvoiceLineExcel() {
 	var Output = [];
 	var connection = $.db.getConnection();
 	var InvLineUpdateRecord = {};
 	var excelData = $.request.parameters.get('ApexData');
 	var excelDataJson = JSON.parse(excelData);
 	var excelDataInJson = JSON.parse(JSON.stringify(excelDataJson));
 	var record = {};
 	var batchSize = 1500;

 	try {
 		for (var i = 0; i < excelDataInJson.length; i++) {
 			var dict = excelDataInJson[i];
 			var queryInvLinePost =
 				'insert into "MDB_DEV"."SALES_INVOICE_LINES" ("INVOICE_NO","INV_LINE_NUMBER","MATERIAL_CODE","QTY","SALES_PRICE","CGST", ' +
 				' "SGST","IGST","UOM","NET_WEIGHT","GROSS_WEIGHT","NET_VALUE","BATCH_NO", ' +
 				' "PLANT_CODE","SALES_ORDER_NO","SALES_ORDER_LINE_N0","CREATED_BY" ,"DISCOUNT" ,"SOFT_DELL") ' +
 				' values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
 			var pstmtInvLinePost = connection.prepareStatement(queryInvLinePost);
 			pstmtInvLinePost.setString(1, dict.InvoiceNo);
 			pstmtInvLinePost.setString(2, dict.InvLineNumber);
 			pstmtInvLinePost.setString(3, dict.MaterialCode);
 			pstmtInvLinePost.setString(4, dict.Qty);
 			pstmtInvLinePost.setString(5, dict.SalesPrice);
 			pstmtInvLinePost.setString(6, dict.CGST);
 			pstmtInvLinePost.setString(7, dict.SGST);
 			pstmtInvLinePost.setString(8, dict.IGST);
 			pstmtInvLinePost.setString(9, dict.UoM);
 			pstmtInvLinePost.setString(10, dict.NetWeight);
 			pstmtInvLinePost.setString(11, dict.GrossWeight);
 			pstmtInvLinePost.setString(12, dict.NetValue);
 			pstmtInvLinePost.setString(13, dict.BatchNo);
 			pstmtInvLinePost.setString(14, dict.PlantCode);
 			pstmtInvLinePost.setString(15, dict.SalesOrderNumber);
 			pstmtInvLinePost.setString(16, dict.SalesOrderLineNumber);
 			pstmtInvLinePost.setString(17, "ManualJob");
 			pstmtInvLinePost.setString(18, dict.DISCOUNT);
 			pstmtInvLinePost.setString(19, dict.SOFT_DELL);

 			var rsInvLinePost = pstmtInvLinePost.executeUpdate();
 			connection.commit();
 			if (rsInvLinePost > 0) {
 				InvLineUpdateRecord.status = '1';
 				InvLineUpdateRecord.message = 'Invoice Line Data Successfully Uploaded';
 				Output.push(InvLineUpdateRecord);
 			} else {
 				InvLineUpdateRecord.status = '0';
 				InvLineUpdateRecord.message = 'Something went Wrong,Invoice Line data is not insert';
 				Output.push(InvLineUpdateRecord);
 			}
 			if (i % batchSize === 0) {
 				connection.commit();
 				connection.close();
 				connection = $.db.getConnection();
 			}
 		}
 		connection.close();
 		var messages = Output.length + ' out of ' + (excelDataInJson.length) + ' has been Updated in Invoice Line Table';
 	} catch (e) {
 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);
 		return;
 	}
 	var body = JSON.stringify(messages);
 	$.response.contentType = 'application/json';
 	$.response.setBody(body);
 	$.response.status = $.net.http.OK;
 }

 function insertEquipment(dict, connection) {
 	var record = {};

 	try {
 		var queryInvEquiPost =
 			'insert into "MDB_DEV"."EQUIPMENT_MASTER" ("SERIAL_NUMBER","MATERIAL_CODE","INVOICE_NO","IMEI1", ' +
 			' "BATCH_NO", "PLANT_CODE","CREATED_BY") ' + ' values (?,?,?,?,?,?,?)';
 		var pstmtInvEquiPost = connection.prepareStatement(queryInvEquiPost);
 		pstmtInvEquiPost.setString(1, dict.SerialNo);
 		pstmtInvEquiPost.setString(2, dict.ItemCode);
 		pstmtInvEquiPost.setString(3, dict.InvoiceNo);
 		pstmtInvEquiPost.setString(4, dict.ImeiNo1);
 		pstmtInvEquiPost.setString(5, dict.BatchNo);
 		pstmtInvEquiPost.setString(6, dict.PlantCode);
 		pstmtInvEquiPost.setString(7, "ManualJob");
 		var rsInvEquiPost = pstmtInvEquiPost.executeUpdate();
 		connection.commit();
 		if (rsInvEquiPost > 0) {
 			record.status = '1';
 			record.message = 'Equipment Data Successfully Uploaded';
 		} else {
 			record.status = '0';
 			record.message = 'Something went Wrong,Invoice Equi data is not insert';

 		}
 	} catch (e) {
 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);

 	}
 	return (record);

 }

 function equitransUpload(dict, connection) {
 	var InvEquiUpdateRecord = {};
 	try {
 		var queryInvEquiPost =
 			'insert into "MDB_DEV"."EQUIPMENT_MASTERTRANS" ("SERIAL_NO","MATERIAL_CODE","IMEI1","SAPUSER_ID", ' +
 			' "INVOICE_NO","INVOICELINE_NO","BATCH_NO", "PLANT_CODE","CREATED_BY" ,"ACTIVE") ' + ' values (?,?,?,?,?,?,?,?,?,?)';
 		var pstmtInvEquiPost = connection.prepareStatement(queryInvEquiPost);
 		pstmtInvEquiPost.setString(1, dict.SerialNo);
 		pstmtInvEquiPost.setString(2, dict.ItemCode);
 		pstmtInvEquiPost.setString(3, dict.ImeiNo1);
 		pstmtInvEquiPost.setString(4, dict.DealerCode);
 		pstmtInvEquiPost.setString(5, dict.InvoiceNo);
 		pstmtInvEquiPost.setString(6, dict.LineNo);
 		pstmtInvEquiPost.setString(7, dict.BatchNo);
 		pstmtInvEquiPost.setString(8, dict.PlantCode);
 		pstmtInvEquiPost.setString(9, "ManualJob");
 		pstmtInvEquiPost.setString(10, "active");
 		
 		var rsInvEquiPost = pstmtInvEquiPost.executeUpdate();
 		connection.commit();
 		if (rsInvEquiPost > 0) {
 			InvEquiUpdateRecord.status = '1';
 			InvEquiUpdateRecord.message = 'Equipment Transaction Data Successfully Uploaded';
 			/*	Output.push(InvEquiUpdateRecord);*/
 		} else {
 			InvEquiUpdateRecord.status = '0';
 			InvEquiUpdateRecord.message = 'Something went Wrong,Invoice Equi data is not insert';

 		}
 	} catch (e) {
 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);

 	}
 	return (InvEquiUpdateRecord);

 }

 function equipmentUpload(dict) {
 	var record = {};
 	var Output = [];
 	var connection = $.db.getConnection();
 	try {
 		var queryselect = ' select SERIAL_NUMBER from "MDB_DEV"."EQUIPMENT_MASTER" where SERIAL_NUMBER = ? ';
 		var pstmtSelect = connection.prepareStatement(queryselect);
 		pstmtSelect.setString(1, dict.SerialNo);
 		var rsSelect = pstmtSelect.executeQuery();
 		connection.commit();
 		if (rsSelect > 0) {
 			record.status = 1;
 			record.message = 'IMEI already Present ';
 		} else {
 			record.status = 0;
 			insertEquipment(dict,connection);

 		}
 	} catch (e) {

 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);
 		return;
 	}

 	var body = JSON.stringify(Output);
 	$.response.contentType = 'application/json';
 	$.response.setBody(body);
 	$.response.status = $.net.http.OK;
 }

 function equipmentEquiUpload(dict, connection) {
 	var InvEquiUpdateRecord = {};

 	try {
 		var queryInvEquiPost =
 			'insert into "MDB_DEV"."SALES_INVOICE_EQUIP" ("INVOICE_NO","INVOICE_LINE_NO","MATERIAL_CODE","SERIAL_NO","IMEI1", ' +
 			' "SAPUSER_ID","BATCH_NO", "PLANT_CODE","QUANTITY","CREATE_DBY") ' + ' values (?,?,?,?,?,?,?,?,?,?)';
 		var pstmtInvEquiPost = connection.prepareStatement(queryInvEquiPost);
 		pstmtInvEquiPost.setString(1, dict.InvoiceNo);
 		pstmtInvEquiPost.setString(2, dict.LineNo);
 		pstmtInvEquiPost.setString(3, dict.ItemCode);
 		pstmtInvEquiPost.setString(4, dict.SerialNo);
 		pstmtInvEquiPost.setString(5, dict.ImeiNo1);
 		/*	pstmtInvEquiPost.setString(6, dict.ImeiNo2);*/
 		pstmtInvEquiPost.setString(6, dict.DealerCode);
 		pstmtInvEquiPost.setString(7, dict.BatchNo);
 		pstmtInvEquiPost.setString(8, dict.PlantCode);
 		pstmtInvEquiPost.setString(9, dict.ItemQty);
 		pstmtInvEquiPost.setString(10, "ManualJob");
 		var rsInvEquiPost = pstmtInvEquiPost.executeUpdate();
 		connection.commit();
 		if (rsInvEquiPost > 0) {
 			InvEquiUpdateRecord.status = '1';
 			InvEquiUpdateRecord.message = 'Invoice Equi Data Successfully Uploaded';
 			/*Output.push(InvEquiUpdateRecord);*/

 		} else {
 			InvEquiUpdateRecord.status = '0';
 			InvEquiUpdateRecord.message = 'Something went Wrong,Invoice Equi data is not insert';

 		}
 	} catch (e) {
 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);
 	}
 	return (InvEquiUpdateRecord);

 }

 /*
  * API will use to upload  excel data  into SaleInvoiceEqui , Equipment_Master ,equipmenttrans  Table .
  * create by Shriyansi.
  */
 function populateInvoiceEquiExcel() {

 	var Output = [];
 	var connection = $.db.getConnection();
 	var excelData = $.request.parameters.get('ExcelData');
 	var excelDataJson = JSON.parse(excelData);
 	var excelDataInJson = JSON.parse(JSON.stringify(excelDataJson));
 	//var batchSize = 1500;

 	try {
 		for (var i = 0; i < excelDataInJson.length; i++) {
 			var dict = excelDataInJson[i];
 			equipmentEquiUpload(dict, connection);
 			equitransUpload(dict ,connection);
 			equipmentUpload(dict ,connection);
 			/*	if (i % batchSize === 0) {
 				connection.commit();
 				connection.close();
 				connection = $.db.getConnection();
 			}*/
 		}

 		connection.close();
 		var messages = Output.length + ' out of ' + (excelDataInJson.length) + ' has been Updated in Invoice Equi Table';
 	} catch (e) {
 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);
 		return;
 	}
 	var body = JSON.stringify(messages);
 	$.response.contentType = 'application/json';
 	$.response.setBody(body);
 	$.response.status = $.net.http.OK;
 }

 var aCmd = $.request.parameters.get('cmd');
 switch (aCmd) {
 	case "populateInvoiceHeaderExcel":
 		populateInvoiceHeaderExcel();
 		break;
 	case "populateInvoiceLineExcel":
 		populateInvoiceLineExcel();
 		break;
 	case "populateInvoiceEquiExcel":
 		populateInvoiceEquiExcel();
 		break;
 	default:
 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody('Invalid Command: ', aCmd);
 }