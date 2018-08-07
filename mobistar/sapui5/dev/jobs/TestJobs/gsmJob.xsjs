
/**
 * To get all primary sales.
  * @return {object} array of a resultset.
 */
function getPrimarySales()  {
	var record;
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

        qryPrimarySales = ' SELECT DISTINCT C.CUST_TYPE,C.SAPUSER_ID,C.CUST_NAME,C.EMAIL_ID,C.REGION,C.STATE,C.POSTAL_CODE from "MDB_DEV"."SALES_INVOICE_EQUIP" as "SIE" '
        + ' inner join "MDB_DEV"."MST_CUSTOMER" as "C" on C.SAPUSER_ID = SIE.SAPUSER_ID ';
    	var pstmtPrimarySales = connection.prepareStatement(qryPrimarySales);
    	var rsPrimarySales = pstmtPrimarySales.executeQuery();
    
    	while (rsPrimarySales.next()) 
    	{
    		 record = {};
    		 record.CUSTOMERTYPE = rsPrimarySales.getString(1);
    		 record.SAPUSERID = rsPrimarySales.getString(2);
    		 record.CUSTOMERNAME = rsPrimarySales.getString(3);
    		 record.EMAILID = rsPrimarySales.getString(4);
    		 record.REGION = rsPrimarySales.getString(5);
    		 record.STATE = rsPrimarySales.getString(6);
    		 record.POSTALCODE = rsPrimarySales.getString(7);
    		
			     //FETCH ALL INVOICE DETAILS
			      var queryInvoice = 'select * from "MDB_DEV"."SALES_INVOICE_HEADER" where SAPUSER_ID=? ';
			      var paramInvoice = connection.prepareStatement(queryInvoice);
		          paramInvoice.setString(1, record.SAPUSERID);
	       	      var rsInvoice = paramInvoice.executeQuery();
	       	       while (rsInvoice.next()) 
			       {   recordInvoice = {};
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
	       	           while (rsInvoiceLine.next()) 
			           {   recordInvoiceLine = {};
			                recordInvoiceLine.INVOICENO = rsInvoiceLine.getString(2);
			                recordInvoiceLine.LINENO = rsInvoiceLine.getString(3);
			                recordInvoiceLine.MATERIALCODE = rsInvoiceLine.getString(4);
			                recordInvoiceLine.QTY = rsInvoiceLine.getString(5);
			                //FETCH ALL EQUIPMENT DETAILS
			                
			               var queryInvoiceEquip = 'select * from "MDB_DEV"."SALES_INVOICE_EQUIP" where INVOICE_NO=? and INVOICE_LINE_NO=? AND PROCESS_STATUS=?';
			               var paramInvoiceEquip = connection.prepareStatement(queryInvoiceEquip);
		                   paramInvoiceEquip.setString(1, recordInvoiceLine.INVOICENO);
		                   paramInvoiceEquip.setString(2, recordInvoiceLine.LINENO);
		                    paramInvoiceEquip.setString(3,'' );
	       	               var rsInvoiceEquip = paramInvoiceEquip.executeQuery();
	       	               while (rsInvoiceEquip.next()) 
			               {   
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
			       invoiceArray = [];
			      
			     
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

	case "getPrimarySales":
		getPrimarySales();
		break;
		
		
	
	
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}