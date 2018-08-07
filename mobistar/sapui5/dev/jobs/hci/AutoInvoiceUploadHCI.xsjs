
function checkInvoiceEquipment(dicLine, records) {
    	var connection = $.db.getConnection();
	var queryStatus = 'select SERIAL_NO from "MDB_DEV"."SALES_INVOICE_EQUIP" where SERIAL_NO = ? or IMEI1 = ? or IMEI2=?';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.SerialNo);
	pstmtStatus.setString(2, dicLine.IMEI1);
		pstmtStatus.setString(3, dicLine.IMEI2);
	var rStatus = pstmtStatus.executeQuery();
	connection.commit();
	if (rStatus.next() > 0) {
		records.status = 0;
		records.message = 'SERIAL NO [' + dicLine.SerialNo + '] Allready exist in data base !!';
		return false;
	} else {
		return true;
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

function updateEquipmentMaster(dicEquipment,records){
    var updateEquipment = false;    
    var connection = $.db.getConnection();
    if(avilabiltyCheck(dicEquipment,records)){
        
        //insert
        var qryInsertEquipment = 'INSERT INTO "MDB_DEV"."MST_EQUIPMENT" (SERIAL_NUMBER,MATERIAL_CODE,BATCH_NO,IMEI1,IMEI2,PLANT_CODE,STATUS,CREATED_BY,' +
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
		if(rsInsertEquipment > 0){
		    updateEquipment = true;
		}else{
		    updateEquipment = false;
		}
    }else{
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
		if(rsUpdateEquipment > 0){
		    updateEquipment = true;
		}else{
		    updateEquipment = false;
		}
     
    }
    connection.close();
    return updateEquipment;
    
}

function getAutoInvoiceEquipment() {
    var Output = {
        results: []
    };
    var records = {};

	var connection = $.db.getConnection();
	var objInvoiceDettails = $.request.body.asString();
//	var objInvoiceDettails = $.request.parameters.get('hciInvoiceEquipment');
	objInvoiceDettails = JSON.parse(objInvoiceDettails);
   try {
		if (objInvoiceDettails.length > 0) {
		    var msg = "";
			for (var i = 0; i < objInvoiceDettails.length; i++) {
				var dicEquipment = objInvoiceDettails[i];
				var qryEquipment = 'select SIL.INVOICE_NO,SIH.INVOICE_DATE from "MDB_DEV"."SALES_INVOICE_LINES" AS SIL join ' +
				    ' "MDB_DEV"."SALES_INVOICE_HEADER" AS SIH '
				+' on SIL.INVOICE_NO=SIH.INVOICE_NO where SIL.INVOICE_NO = ? AND SIH.DMS_CUST_CODE=? ';
            	var pstmtEquipment = connection.prepareStatement(qryEquipment);
            	if(dicEquipment.InvoiceNo.startsWith("00")){
                	dicEquipment.InvoiceNo = dicEquipment.InvoiceNo.substring(2);
            	}
            	pstmtEquipment.setString(1, dicEquipment.InvoiceNo);
            	pstmtEquipment.setString(2, dicEquipment.DealerCode);
            	var rsEquipment = pstmtEquipment.executeQuery();
            	connection.commit();
            	if (rsEquipment.next() ) {
                        dicEquipment.INVOICE_DATE = rsEquipment.getString(2);
                        dicEquipment.IMEI1 = dicEquipment.IMEI1 === '' ? "1" : dicEquipment.IMEI1; 
                        dicEquipment.IMEI2 = dicEquipment.IMEI2 === '' ? "1" : dicEquipment.IMEI2;
                        dicEquipment.ImeiNo1 =  dicEquipment.IMEI1;
                        var check = checkInvoiceEquipment(dicEquipment,records);
                        if((dicEquipment.SerialNo !== '' ) && check === true)
                        {
                        if(updateEquipmentMaster(dicEquipment,records))
                        {
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
					pstmt.setString(8,dicEquipment.IMEI2);
					pstmt.setString(9, dicEquipment.BatchNo);
					pstmt.setString(10, dicEquipment.PlantCode);
					pstmt.setInteger(11, parseInt(dicEquipment.Quantity,10));
					pstmt.setString(12, dicEquipment.ProcessStatus);
					
					var rs = pstmt.executeUpdate();
				    //var rs =  1;
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
                        }
                        else {
						records.status = 0;
						records.msg += "invoice no: [" + dicEquipment.InvoiceNo + "], DealerCode: [" + dicEquipment.DealerCode + "] not present in sales header or sales line !!! <br/>";
            		   
					}
                        
                        
                        
            	}else{
						records.status = 0;
						records.msg += "invoice no: [" + dicEquipment.InvoiceNo + "], DealerCode: [" + dicEquipment.DealerCode + "] not present in sales header or sales line !!! <br/>";
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


function getAutoInvoiceHeader() {
	var records = {};
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var objInvoiceDettails = $.request.body.asString();
//	var objInvoiceDettails = $.request.parameters.get('hciInvoiceEquipment');
	objInvoiceDettails = JSON.parse(objInvoiceDettails);
	try {
		if (objInvoiceDettails.length > 0) {
		    	    var msg = "";
			for (var i = 0; i < objInvoiceDettails.length; i++) {
				var dicLine = objInvoiceDettails[i];
					var queryStatus = 'select INVOICE_NO from "MDB_DEV"."SALES_INVOICE_HEADER" where INVOICE_NO = ? ';
            	var pstmtStatus = connection.prepareStatement(queryStatus);
            	pstmtStatus.setString(1, dicLine.InvoiceNo);
            	var rStatus = pstmtStatus.executeQuery();
            	connection.commit();
            	if (rStatus.next() > 0) {
            		records.status = 0;
            		records.message = 'Allready exist in data base !!';
            	}else{
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
            	    
            	}/*else {
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

function getAutoInvoiceLine() {
    var records = {};
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var objInvoiceDettails = $.request.body.asString();
//	var objInvoiceDettails = $.request.parameters.get('hciInvoiceEquipment');
	objInvoiceDettails = JSON.parse(objInvoiceDettails);
	
	try {
		if (objInvoiceDettails.length > 0) {
		    var msg = "";
			for (var i = 0; i < objInvoiceDettails.length; i++) {
				var dicLine = objInvoiceDettails[i];
				var qryLine = 'select INVOICE_NO from "MDB_DEV"."SALES_INVOICE_HEADER" where INVOICE_NO = ? ';
            	var pstmtLine = connection.prepareStatement(qryLine);
            	pstmtLine.setString(1, dicLine.InvoiceNo);
            	var rsLine = pstmtLine.executeQuery();
            	connection.commit();
            	if (rsLine.next() > 0) {
            
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
            	}else{
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
	
	
	var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "getAutoInvoiceEquipment":
		getAutoInvoiceEquipment();
		break;
	case "getAutoInvoiceHeader":
	    getAutoInvoiceHeader();
	    break;
	case "getAutoInvoiceLine":
	    getAutoInvoiceLine();
	    break;
	

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}
