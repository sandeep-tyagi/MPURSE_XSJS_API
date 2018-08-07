//------------------------------Halping Methods----------------------------------------------
function checkInvoiceEquipment(dicLine, records) {
	var connection = $.db.getConnection();
	var queryStatus = 'select SERIAL_NO,RETURN_TYPE,INVOICE_NO from "MDB_DEV"."SALES_INVOICE_EQUIP" where SERIAL_NO = ? or IMEI1 = ? or IMEI2=?';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.SerialNo);
	pstmtStatus.setString(2, dicLine.IMEI1);
	pstmtStatus.setString(3, dicLine.IMEI2);
	var rStatus = pstmtStatus.executeQuery();
	connection.commit();
	if (rStatus.next() > 0) {
	    if(rStatus.getString(2) === "ZRE" && rStatus.getString(3)===dicLine.InvoiceNo )
	    {
	       return false;
	    }
	    else if(rStatus.getString(2) === "ZRE")
	    {
	        return true;
	    }
		records.status = 0;
		records.message = 'SERIAL NO [' + dicLine.SerialNo + '] Allready exist in data base !!';
		return false;
	} else {
		return true;
	}
	connection.close();
}

function checkInvoiceLine(dicLine, records) {
	var connection = $.db.getConnection();
	var queryStatus = 'select INVOICE_NO from "MDB_DEV"."SALES_INVOICE_LINES" where INVOICE_NO = ? AND INV_LINE_NUMBER = ? ';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.InvoiceNo);
	pstmtStatus.setString(2, dicLine.LineNo);

	var rStatus = pstmtStatus.executeQuery();
	connection.commit();
	if (rStatus.next() > 0) {
		records.status = 0;
		records.message = 'INVOICE NO [' + dicLine.InvoiceNo + '],LINE NO [' + dicLine.LineNo + '] Allready exist in data base !!';
		return false;
	} else {
		return true;
	}
	connection.close();
}

function checkMaterial(dicLine, records) {
	var connection = $.db.getConnection();
	var queryStatus = 'select MATERIAL_CODE from "MDB_DEV"."MST_MATERIAL_MASTER" where MATERIAL_CODE = ? ';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.ItemCode);


	var rStatus = pstmtStatus.executeQuery();
	connection.commit();
	if (rStatus.next() > 0) {
			return true;
	} else {
	    	records.status = 0;
		records.message = 'Material [' + dicLine.ItemCode + '] doesnot exists !!';

		return false;
	}
	connection.close();
}

function avilabiltyCheck(dicLine, records) {
	var connection = $.db.getConnection();
	var queryStatus = 'select SERIAL_NUMBER from "MDB_DEV"."MST_EQUIPMENT" where SERIAL_NUMBER = ? and IMEI1 = ?';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.SerialNo);
	pstmtStatus.setString(2, dicLine.ImeiNo1);
	var rStatus = pstmtStatus.executeQuery();
	connection.commit();
	if (rStatus.next() > 0) {
		records.status = 0;
		records.message = 'Allready exist in data base !!';
		return false;
	} else {
		return true;
	}
	connection.close();
}

function avilabiltyCheckInEquipmentMaster(dicLine, records) {
	var connection = $.db.getConnection();
	var queryStatus = 'select SERIAL_NUMBER from "MDB_DEV"."MST_EQUIPMENT" where SERIAL_NUMBER = ? and IMEI1 = ?';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.SerialNo);
	pstmtStatus.setString(2, dicLine.IMEI1);
	var rStatus = pstmtStatus.executeQuery();
	connection.commit();
	if (rStatus.next() > 0) {
		records.status = 0;
		records.message = 'Allready exist in data base !!';
		return true;
	} else {
		return false;
	}
	connection.close();
}

function dateFunction() {
	var dp = new Date();
	var monthp = '' + (dp.getMonth() + 1);
	var dayp = '' + dp.getDate();
	var yearp = dp.getFullYear();

	if (monthp.length < 2) {
		monthp = '0' + monthp;
	}
	if (dayp.length < 2) {
		dayp = '0' + dayp;
	}
	var yyyymmddp = dayp + '.' + monthp + '.' + yearp;
	return yyyymmddp;
}

function updateEquipmentMaster(dicEquipment, records) {
	var updateEquipment = false;
	var connection = $.db.getConnection();
	if (avilabiltyCheck(dicEquipment, records)) {

		//insert
		var qryInsertEquipment =
			'INSERT INTO "MDB_DEV"."MST_EQUIPMENT" (SERIAL_NUMBER,MATERIAL_CODE,BATCH_NO,IMEI1,IMEI2,PLANT_CODE,STATUS,CREATED_BY,' +
			'PRIMARYSALE_CUSTOMER,PRIMARYSALE_DATE) VALUES(?,?,?,?,?,?,?,?,?,?)';
		var pstmtInsertEquipment = connection.prepareStatement(qryInsertEquipment);
		pstmtInsertEquipment.setString(1, dicEquipment.SerialNo);
		pstmtInsertEquipment.setString(2, dicEquipment.MaterialCode);
		pstmtInsertEquipment.setString(3, dicEquipment.BatchNo);
		pstmtInsertEquipment.setString(4, dicEquipment.IMEI1);
		pstmtInsertEquipment.setString(5, dicEquipment.IMEI2);
		pstmtInsertEquipment.setString(6, dicEquipment.PlantCode);
		pstmtInsertEquipment.setString(7, '1');
		pstmtInsertEquipment.setString(8, 'manualJob');
		pstmtInsertEquipment.setString(9, dicEquipment.DealerCode);
		pstmtInsertEquipment.setString(10, dicEquipment.INVOICE_DATE);
		var rsInsertEquipment = pstmtInsertEquipment.executeUpdate();
		//var rsInsertEquipment = 1;
		connection.commit();
		if (rsInsertEquipment > 0) {
			updateEquipment = true;
		} else {
			updateEquipment = false;
		}
	} else {
		//=     //update
		var qryUpdateEquipment = 'UPDATE "MDB_DEV"."MST_EQUIPMENT" SET STATUS=?,' +
			'PRIMARYSALE_CUSTOMER=?,PRIMARYSALE_DATE=? WHERE SERIAL_NUMBER=?';
		var pstmtUpdateEquipment = connection.prepareStatement(qryUpdateEquipment);
		pstmtUpdateEquipment.setString(1, '1');
		pstmtUpdateEquipment.setString(2, dicEquipment.DealerCode);
		pstmtUpdateEquipment.setString(3, dicEquipment.INVOICE_DATE);
		pstmtUpdateEquipment.setString(4, dicEquipment.SerialNo);

		var rsUpdateEquipment = pstmtUpdateEquipment.executeUpdate();
		//var rsUpdateEquipment  = 1;
		connection.commit();
		if (rsUpdateEquipment > 0) {
			updateEquipment = true;
		} else {
			updateEquipment = false;
		}

	}
	connection.close();
	return updateEquipment;

}

function countMaterial(MaterialCount, MaterialCode, SAPUSERID) {

	var flag = false;
	var data;
	if (MaterialCount.length > 0) {
		for (var i = 0; i < MaterialCount.length; i++) {
			if (MaterialCount[i].MATERIALCODE === MaterialCode) {
				MaterialCount[i].SAPUSERID = SAPUSERID;
				MaterialCount[i].QTY = parseInt(MaterialCount[i].QTY, 10) + 1; //parseInt(InvoiceLine.QTY, 10);
				flag = true;
			}
		}
	}

	if (flag === false) {
		data = {};
		data.SAPUSERID = SAPUSERID;
		data.MATERIALCODE = MaterialCode;
		data.QTY = 1; //InvoiceLine.QTY;
		MaterialCount.push(data);
	}
}

function addStocks(MaterialCount, record) {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		//var QTY = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].QTY;*/
		for (var i = 0; i < MaterialCount.length; i++) {
			var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Trn_Stock"(?,?,?,?,?,?,?,?,?,?);';
			var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
			pstmtCallAttribute.setString(1, MaterialCount[i].SAPUSERID);
			pstmtCallAttribute.setString(2, MaterialCount[i].MATERIALCODE);
			pstmtCallAttribute.setInteger(3, parseInt(MaterialCount[i].QTY, 10));
			pstmtCallAttribute.setString(4, 'DSTB');
			pstmtCallAttribute.setString(5, 'STOCKREC');
			pstmtCallAttribute.setString(6, 'MANUALJOB');
			pstmtCallAttribute.setString(7, dateFunction());
			pstmtCallAttribute.setString(8, '01:16:50');
			pstmtCallAttribute.setString(9, 'DMSTEAM');
			pstmtCallAttribute.setInteger(10, parseInt(MaterialCount[i].QTY, 10));
			pstmtCallAttribute.execute();
			var rCallAttribute = pstmtCallAttribute.getResultSet();
			connection.commit();
			// Need to identify
			if (rCallAttribute.next()) {
				record.status = 0;
				record.message = 'Data is Successfully Updated';
			}
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

function uploadReturnInvoiceEquipment(dicEquipment, records) {

	if ( avilabiltyCheckInEquipmentMaster(dicEquipment, records)) {
		var connection = $.db.getConnection();

		var qryUpdateReturnEquipment = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Trn_ReturnEquipment"(?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var pstmtUpdateReturnEquipment = connection.prepareCall(qryUpdateReturnEquipment);
		pstmtUpdateReturnEquipment.setString(1, dicEquipment.InvoiceNo); //INVOICENO
		pstmtUpdateReturnEquipment.setString(2, dicEquipment.InvoiceLineNo); //INVOICELINENO
		pstmtUpdateReturnEquipment.setString(3, dicEquipment.SerialNo); //SERIALNO
		pstmtUpdateReturnEquipment.setString(4, dicEquipment.DealerCode); //DMSCUSTCODE
		pstmtUpdateReturnEquipment.setString(5, dicEquipment.Column1); //INVOICETYPE
		pstmtUpdateReturnEquipment.setString(6, dicEquipment.IMEI1); //IMEI1
		pstmtUpdateReturnEquipment.setString(7, dicEquipment.BatchNo); //BATCHNO
		pstmtUpdateReturnEquipment.setString(8, dicEquipment.PlantCode); //PLANTCODE
		pstmtUpdateReturnEquipment.setString(9, dicEquipment.IMEI2); //IMEI2
		pstmtUpdateReturnEquipment.setString(10, dateFunction()); //TRANSACTIONDATE
		pstmtUpdateReturnEquipment.setString(11, '01:16:50'); //TRANSACTIONTIME
		pstmtUpdateReturnEquipment.setString(12, 'SALESRETURN'); //TRANSACTIONTYPE
		pstmtUpdateReturnEquipment.setString(13, '564674535'); //TRANSACTIONNUMBER

	
		pstmtUpdateReturnEquipment.execute();

		var rsUpdateReturnEquipment = pstmtUpdateReturnEquipment.getParameterMetaData();
		//	connection.commit();

		if (rsUpdateReturnEquipment.getParameterCount() > 0) {
			records.msg += "Return Serial no Uploaded Sucessfully";
		} else {
			records.msg += "Serial no:, DealerCode: not present in sales Invoice Equipment !!! ";
		}

		//Output.results.push(records);
		connection.commit();
	}
	
	else
	{
	    records.msg += "Serial number not present in  Equipment Master !!! ";
	}

	//var body = JSON.stringify(Output);
	//$.response.contentType = 'application/json';
	//$.response.setBody(body);
	//$.response.status = $.net.http.OK; 
	//	connection.close();

}

//************************************END*******************************************************

//--------------------------------Main Methods--------------------------------------------------
function getInvoiceHeader() {
	var records = {};
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('hciInvoiceHeader');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			var msg = "";
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				var queryStatus = 'select INVOICE_NO from "MDB_DEV"."SALES_INVOICE_HEADER" where INVOICE_NO = ? ';
				var pstmtStatus = connection.prepareStatement(queryStatus);
				pstmtStatus.setString(1, dicLine.InvoiceNo);
				var rStatus = pstmtStatus.executeQuery();
				connection.commit();
				if (rStatus.next() > 0) {
					records.status = 0;
					records.message = 'Allready exist in data base !!';
				} else {
					var queryCustomerCheck = 'select DMS_CUST_CODE from "MDB_DEV"."MST_CUSTOMER" where DMS_CUST_CODE = ? ';
					var pstmtCustomerCheck = connection.prepareStatement(queryCustomerCheck);
					pstmtCustomerCheck.setString(1, dicLine.CustCode);
					var rsCustomerCheck = pstmtCustomerCheck.executeQuery();
					connection.commit();
					if (rsCustomerCheck.next() > 0) {

						var query =
							'insert into  "MDB_DEV"."SALES_INVOICE_HEADER"(INVOICE_NO,INVOICE_DATE,SAPUSER_ID,INVOICE_TYPE,BILL_TO_PARTY_CODE,BILL_TO_PARTY_NAME,SHIP_TO_PARTY_CODE,SHIP_TO_PARTY_NAME,INVOICE_VALUE,CURRENCY,EXC_RATE,SAP_INV_DATE,SAP_INV_TIME,CANCELED_INVOICE,ODN,SALES_ORDER,DMS_CUST_CODE) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
						var pstmt = connection.prepareStatement(query);
						pstmt.setString(1, dicLine.InvoiceNo);
						pstmt.setString(2, dicLine.InvoiceDate);
						pstmt.setString(3, dicLine.CustCode);
						pstmt.setString(4, dicLine.InvoiceType);
						pstmt.setString(5, dicLine.BillToParty);
						pstmt.setString(6, dicLine.BillToPartyName);
						pstmt.setString(7, dicLine.ShipToParty);
						pstmt.setString(8, dicLine.ShipToPartyName);
						pstmt.setString(9, dicLine.Amount);
						pstmt.setString(10, dicLine.Currency);
						pstmt.setString(11, dicLine.ExRate);
						pstmt.setString(12, dicLine.SapInvDate);
						pstmt.setString(13, dicLine.SapInvTime);
						pstmt.setString(14, dicLine.CancledInvoice);
						pstmt.setString(15, dicLine.Odn);
						pstmt.setString(16, dicLine.SalesOrder);
						pstmt.setString(17, dicLine.CustCode);
						var rs = pstmt.executeUpdate();
						connection.commit();
						records = {};
						if (rs > 0) {
							records.status = 1;
							records.message = 'Data Uploaded Sucessfully';
						}

					}
					/*else {
						records.status = 0;
					//	records.message = 'Some Issues!';
					msg += "invoice no: [" + dicLine.InvoiceNo + "], DealerCode: [" + dicLine.CustCode + "] not present in sales header or customer master !!! <br/>";
            		    records.message = msg;
					}*/
				}
			}
			Output.results.push(records);
			connection.close();
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

function updateInvoiceLine() {
	var records = {};
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('hciInvoiceLine');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			var msg = "";
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				var qryLine = 'select INVOICE_NO from "MDB_DEV"."SALES_INVOICE_HEADER" where INVOICE_NO = ? ';
				var pstmtLine = connection.prepareStatement(qryLine);
				pstmtLine.setString(1, dicLine.InvoiceNo);
				var rsLine = pstmtLine.executeQuery();
				connection.commit();
				if (rsLine.next() > 0) {
					if (checkInvoiceLine(dicLine, records) && checkMaterial(dicLine, records)) {
						var query =
							'insert into  "MDB_DEV"."SALES_INVOICE_LINES"(INVOICE_NO,INV_LINE_NUMBER,MATERIAL_CODE,QTY,SALES_PRICE,UOM,NET_WEIGHT,GROSS_WEIGHT,NET_VALUE,BATCH_NO,PLANT_CODE,SALES_ORDER_NO,SALES_ORDER_LINE_N0,CGST,SGST,IGST) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
						var pstmt = connection.prepareStatement(query);
						pstmt.setString(1, dicLine.InvoiceNo);
						pstmt.setString(2, dicLine.LineNo);
						pstmt.setString(3, dicLine.ItemCode);
						pstmt.setString(4, dicLine.ItemQty);
						pstmt.setString(5, dicLine.Amount);
						pstmt.setString(6, dicLine.Uom);
						pstmt.setString(7, dicLine.NetWt);
						pstmt.setString(8, dicLine.GrossWt);
						pstmt.setString(9, dicLine.NetValue);
						pstmt.setString(10, dicLine.BatchNo);
						pstmt.setString(11, dicLine.PlantCode);
						pstmt.setString(12, dicLine.SapSalesOrder);
						pstmt.setString(13, dicLine.SapSalesOrderLine);
						pstmt.setString(14, dicLine.Cgst);
						pstmt.setString(15, dicLine.Sgst);
						pstmt.setString(16, dicLine.Igst);
						var rs = pstmt.executeUpdate();
						connection.commit();
						records = {};
						if (rs > 0) {
							records.status = 1;
							records.message = 'Data Uploaded Sucessfully';
						} else {
							records.status = 0;
							records.message = 'Some Issues!';
						}
					}
				} else {
					records.status = 0;
					msg += "invoice no [" + dicLine.InvoiceNo + "] not present in sales header !!! <br/>";
					records.message = msg;
				}

			}
			Output.results.push(records);
			connection.close();
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

function uploadInvoiceEquipment() {

	var records = {};
	var Output = {
		results: []
	};
	var MaterialCount = [];
	var checkAutoReceiving;
	var connection = $.db.getConnection();
	var qryAutoReceiving = 'select AUTORECEIVING from "MDB_DEV"."MPURSE_CONSTANT"';
	var pstmtAutoReceiving = connection.prepareStatement(qryAutoReceiving);
	var rsAutoReceiving = pstmtAutoReceiving.executeQuery();

	if (rsAutoReceiving.next()) {
		checkAutoReceiving = rsAutoReceiving.getString(1);
	}
	var datasEquipment = $.request.parameters.get('hciInvoiceEquipment');
	//	var datasEquipment ='[{"InvoiceNo": "99300176","InvoiceLineNo": "10","MaterialCode": "111LAIZ201","SerialNo": "911222751398223","SalesOrder": "99200335","SalesOrderLine": "10","IMEI1": "911222751398223","IMEI2": "911222751398233","DealerCode": "APDISUE01","BatchNo": "111LAIZ201","PlantCode": "MW01","Quantity": "1","ProcessStatus": ""}]';
	var dataEquipment = JSON.parse(datasEquipment.replace(/\\r/g, ""));
	try {
		if (dataEquipment.length > 0) {
			var msg = "";
			for (var i = 0; i < dataEquipment.length; i++) {
				var dicEquipment = dataEquipment[i];
				if (dicEquipment.Column1 === "ZRE" || dicEquipment.Column1 === "ZDRB") {
					uploadReturnInvoiceEquipment(dicEquipment, records);
				} else {
					var qryEquipment = 'select SIL.INVOICE_NO,SIH.INVOICE_DATE from "MDB_DEV"."SALES_INVOICE_LINES" AS SIL join ' +
						' "MDB_DEV"."SALES_INVOICE_HEADER" AS SIH ' + ' on SIL.INVOICE_NO=SIH.INVOICE_NO where SIL.INVOICE_NO = ? AND SIH.DMS_CUST_CODE=? ';
					var pstmtEquipment = connection.prepareStatement(qryEquipment);
					if (dicEquipment.InvoiceNo.startsWith("00")) {
						dicEquipment.InvoiceNo = dicEquipment.InvoiceNo.substring(2);
					}
					pstmtEquipment.setString(1, dicEquipment.InvoiceNo);
					pstmtEquipment.setString(2, dicEquipment.DealerCode);
					var rsEquipment = pstmtEquipment.executeQuery();
					//	connection.commit();
					if (rsEquipment.next()) {
						dicEquipment.INVOICE_DATE = rsEquipment.getString(2);
						dicEquipment.ImeiNo1 = dicEquipment.IMEI1;
						//	var check = checkInvoiceEquipment(dicEquipment, records);
						if ((dicEquipment.SerialNo !== '') && checkInvoiceEquipment(dicEquipment, records)) {
							if (updateEquipmentMaster(dicEquipment, records)) {
								var query =
									'insert into  "MDB_DEV"."SALES_INVOICE_EQUIP"(INVOICE_NO,INVOICE_LINE_NO,MATERIAL_CODE,SERIAL_NO,SALES_ORDER,SALES_ORDER_LINE,' +
									'IMEI1,IMEI2,BATCH_NO,PLANT_CODE,QUANTITY,PROCESS_STATUS) values (?,?,?,?,?,?,?,?,?,?,?,?)';
								var pstmt = connection.prepareStatement(query);
								pstmt.setString(1, dicEquipment.InvoiceNo);
								pstmt.setString(2, dicEquipment.InvoiceLineNo);
								pstmt.setString(3, dicEquipment.MaterialCode);
								pstmt.setString(4, dicEquipment.SerialNo);
								pstmt.setString(5, dicEquipment.SalesOrder);
								pstmt.setString(6, dicEquipment.SalesOrderLine);
								pstmt.setString(7, dicEquipment.IMEI1);
								pstmt.setString(8, dicEquipment.IMEI2);
								pstmt.setString(9, dicEquipment.BatchNo);
								pstmt.setString(10, dicEquipment.PlantCode);
								pstmt.setInteger(11, parseInt(dicEquipment.Quantity, 10));
								pstmt.setString(12, dicEquipment.ProcessStatus);
								var rs = pstmt.executeUpdate();
								//	connection.commit();
								records = {};
								if (rs > 0) {
									if (checkAutoReceiving === "true") {
										var CallProcTRANEQUIP = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::TRAN_EQUIPMENT"(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
										var pstmtCallProcTRANEQUIP = connection.prepareCall(CallProcTRANEQUIP);
										pstmtCallProcTRANEQUIP.setString(1, dicEquipment.InvoiceNo);
										pstmtCallProcTRANEQUIP.setString(2, dicEquipment.InvoiceLineNo);
										pstmtCallProcTRANEQUIP.setString(3, dicEquipment.SerialNo);
										pstmtCallProcTRANEQUIP.setString(4, dicEquipment.IMEI1);
										pstmtCallProcTRANEQUIP.setString(5, dicEquipment.IMEI2);
										pstmtCallProcTRANEQUIP.setString(6, dicEquipment.DealerCode);
										pstmtCallProcTRANEQUIP.setString(7, dicEquipment.MaterialCode);
										pstmtCallProcTRANEQUIP.setString(8, dateFunction());
										pstmtCallProcTRANEQUIP.setString(9, dicEquipment.BatchNo);
										pstmtCallProcTRANEQUIP.setString(10, dicEquipment.PlantCode);
										pstmtCallProcTRANEQUIP.setString(11, dicEquipment.DealerCode);
										pstmtCallProcTRANEQUIP.setString(12, "RECEIVED");
										pstmtCallProcTRANEQUIP.setString(13, dateFunction());
										pstmtCallProcTRANEQUIP.setString(14, "2");
										pstmtCallProcTRANEQUIP.execute();
										var rsCallProcTRANEQUIP = pstmtCallProcTRANEQUIP.getParameterMetaData();
										if (rsCallProcTRANEQUIP.getParameterCount() > 0) {
											records.status = 1;
											records.message = 'Data is Successfully Updated';
											countMaterial(MaterialCount, dicEquipment.MaterialCode, dicEquipment.DealerCode);
										}
									}
									records.status = 1;
									records.message = 'Data Uploaded Sucessfully';
								} else {
									records.status = 0;
									records.message = 'Some Issues!';
								}
							}
						} else {
							records.status = 0;
							records.msg += "invoice no: [" + dicEquipment.InvoiceNo + "], DealerCode: [" + dicEquipment.DealerCode +
								"] not present in sales header or sales line !!! <br/>";
						}
					} else {
						records.status = 0;
						records.msg += "invoice no: [" + dicEquipment.InvoiceNo + "], DealerCode: [" + dicEquipment.DealerCode +
							"] not present in sales header or sales line !!! <br/>";
						records.message = msg;
					}
				}
			}
			if (checkAutoReceiving === "true") {
				addStocks(MaterialCount, records);
			}
			Output.results.push(records);
			connection.commit();
		}
	} catch (e) {
		connection.rollback();
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	connection.close();
	var body = JSON.stringify(Output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

//****************************************END***************************************************

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "getInvoiceHeader":
		getInvoiceHeader();
		break;
	case "updateInvoiceLine":
		updateInvoiceLine();
		break;
	case "uploadInvoiceEquipment":
		uploadInvoiceEquipment();
		break;
		/*	case "uploadReturnInvoiceEquipment":
		uploadReturnInvoiceEquipment();
		break;*/
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}