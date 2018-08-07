function DateFunction(oevent) {
	var dp = new Date(oevent);
	var monthp = '' + (dp.getMonth() + 1);
	var dayp = '' + dp.getDate();
	var yearp = dp.getFullYear();

	if (monthp.length < 2) monthp = '0' + monthp;
	if (dayp.length < 2) dayp = '0' + dayp;

	var yyyymmddp = yearp + '.' + monthp + '.' + dayp;
	return yyyymmddp;
}


function uploadPrice() {
	var output = {
		results: []
	};

	var pstmtSelMaterial;
	var record = {};
	var connection = $.db.getConnection();
	var priceDataArray = $.request.parameters.get('priceList');
	var querySelMaterial;
	var closeConnectionThreshold = 300;

	try {

		var priceData = JSON.parse(priceDataArray.replace(/\\r/g, ""));
		for (var i = 0; i < priceData.length; i++) {

			var dict = priceData[i];
			var date = new Date(dict.VALID_FROM);
			var userInputDate = DateFunction(dict.VALID_FROM);
			var yesterday = new Date(date);
			yesterday.setDate(yesterday.getDate() - 1);
			var yesterdayDateTill = DateFunction(yesterday.toDateString()); 
			querySelMaterial = 'select MATERIAL_CODE,SALE_PRICE,UNIT,CURRANCY,CUST_TYPE,CUST_TYPE_SALER,DATE_TILL ' + 
				               'FROM "MDB_DEV"."MST_PRICE" where MATERIAL_CODE=?  AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? ' + 
				               ' AND CUST_TYPE_SALER=? and STATE=?  AND SOFT_DEL=? order by  DATE_TILL desc limit 1';
		    pstmtSelMaterial = connection.prepareStatement(querySelMaterial);
			pstmtSelMaterial.setString(1, dict.MATERIAL_CODE);
			pstmtSelMaterial.setString(2, 'SET');
			pstmtSelMaterial.setString(3, 'INR');
			pstmtSelMaterial.setString(4, dict.CUST_TYPE_BUYER);
			pstmtSelMaterial.setString(5, dict.CUST_TYPE_SELLER);
			pstmtSelMaterial.setString(6, dict.STATE);
			pstmtSelMaterial.setString(7, '0');
			var rsSelMaterial = pstmtSelMaterial.executeQuery();
			connection.commit();
			
			if (rsSelMaterial.next() > 0) {
				record.PRV = yesterdayDateTill;
				record.userdate = userInputDate;

		    	var	querySelPrvDate = 'select *  from   "MDB_DEV"."MST_PRICE" where SOFT_DEL=? AND MATERIAL_CODE=? ' + 
		    	                      '  AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? AND CUST_TYPE_SALER=? and STATE=? AND DATE_TILL=? ';

				var pstmtSelPrvDate = connection.prepareStatement(querySelPrvDate);

				pstmtSelPrvDate.setString(1, '0');
				pstmtSelPrvDate.setString(2, dict.MATERIAL_CODE);
				pstmtSelPrvDate.setString(3, 'SET');
				pstmtSelPrvDate.setString(4, 'INR');
				pstmtSelPrvDate.setString(5, dict.CUST_TYPE_BUYER);
				pstmtSelPrvDate.setString(6, dict.CUST_TYPE_SELLER);
				pstmtSelPrvDate.setString(7, dict.STATE);
				pstmtSelPrvDate.setString(8, record.PRV);

				var rsSelPrvDate = pstmtSelPrvDate.executeQuery();
				connection.commit();
				if (rsSelPrvDate.next()) {

				var queryValidFrom = 'select DATE_TILL  from   "MDB_DEV"."MST_PRICE" where SOFT_DEL=? AND MATERIAL_CODE=? ' + 
				                     ' AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? AND CUST_TYPE_SALER=? and STATE=? AND VALID_FROM =?';
                	var pstmtValidFrom = connection.prepareStatement(queryValidFrom);

				pstmtValidFrom.setString(1, '0');
				pstmtValidFrom.setString(2, dict.MATERIAL_CODE);
				pstmtValidFrom.setString(3, 'SET');
				pstmtValidFrom.setString(4, 'INR');
				pstmtValidFrom.setString(5, dict.CUST_TYPE_BUYER);
				pstmtValidFrom.setString(6, dict.CUST_TYPE_SELLER);
				pstmtValidFrom.setString(7, dict.STATE);
				pstmtValidFrom.setString(8, userInputDate);
               
				var rsValidFrom = pstmtValidFrom.executeQuery();
				connection.commit();
				var dateTillForExistingData = "";
				if (rsValidFrom.next()) {
				    dateTillForExistingData= rsValidFrom.getString(1);
				    dateTillForExistingData = DateFunction(dateTillForExistingData);
				   var  querySoftDelUpdate = 'update  "MDB_DEV"."MST_PRICE" set SOFT_DEL=? where   MATERIAL_CODE=? ' + 
				                             ' AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? AND CUST_TYPE_SALER=? and STATE=? ' + 
				                             ' and SOFT_DEL=? and VALID_FROM =? ';

					var pstmtSoftDelUpdate = connection.prepareStatement(querySoftDelUpdate);

					pstmtSoftDelUpdate.setString(1, '1');
					pstmtSoftDelUpdate.setString(2, dict.MATERIAL_CODE);
					pstmtSoftDelUpdate.setString(3, 'SET');
					pstmtSoftDelUpdate.setString(4, 'INR');
					pstmtSoftDelUpdate.setString(5, dict.CUST_TYPE_BUYER);
					pstmtSoftDelUpdate.setString(6, dict.CUST_TYPE_SELLER);
					pstmtSoftDelUpdate.setString(7, dict.STATE);
					pstmtSoftDelUpdate.setString(8, '0');
					pstmtSoftDelUpdate.setString(9, userInputDate);

					var rstatusSoftDelUpdate = pstmtSoftDelUpdate.executeUpdate();
					connection.commit();
            
				}
				
				    var	queryValidInsert = 'insert into "MDB_DEV"."MST_PRICE" (MATERIAL_CODE,SALE_PRICE,UNIT,CURRANCY,' + 
				                           ' STATE,CUST_TYPE,DATE_TILL,CUST_TYPE_SALER,VALID_FROM)values(?, ?, ?, ?, ?, ?, ?, ?,?)';

					var	pstmtValidInsert = connection.prepareStatement(queryValidInsert);

						pstmtValidInsert.setString(1, dict.MATERIAL_CODE);
						pstmtValidInsert.setString(2, dict.SALE_PRICE);
						pstmtValidInsert.setString(3, 'SET');
						pstmtValidInsert.setString(4, 'INR');
						pstmtValidInsert.setString(5, dict.STATE);
						pstmtValidInsert.setString(6, dict.CUST_TYPE_BUYER);
						pstmtValidInsert.setString(7, ( dateTillForExistingData !== "" ? dateTillForExistingData : '9999.12.31'));
						pstmtValidInsert.setString(8, dict.CUST_TYPE_SELLER);
						pstmtValidInsert.setString(9, userInputDate);
					//	pstmtValidInsert.setString(10, '0');

						var rsValidInsert = pstmtValidInsert.executeQuery();
						connection.commit();
					}
				
		         else {
                
                var	queryLessValidFrom = 'select *  from   "MDB_DEV"."MST_PRICE" where SOFT_DEL=? AND MATERIAL_CODE=? ' + 
                                         ' AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? AND CUST_TYPE_SALER=? and STATE=? ' + 
                                         'AND VALID_FROM< ?  ORDER BY VALID_FROM DESC';

				var pstmtLessValidFrom = connection.prepareStatement(queryLessValidFrom);

				pstmtLessValidFrom.setString(1, '0');
				pstmtLessValidFrom.setString(2, dict.MATERIAL_CODE);
				pstmtLessValidFrom.setString(3, 'SET');
				pstmtLessValidFrom.setString(4, 'INR');
				pstmtLessValidFrom.setString(5, dict.CUST_TYPE_BUYER);
				pstmtLessValidFrom.setString(6, dict.CUST_TYPE_SELLER);
				pstmtLessValidFrom.setString(7, dict.STATE);
				pstmtLessValidFrom.setString(8, userInputDate);

				var rsLessValidFrom = pstmtLessValidFrom.executeQuery();
				connection.commit();
				if (rsLessValidFrom.next()){
				   var validFromLess = rsLessValidFrom.getString(6);
				   var dateTillLess = rsLessValidFrom.getString(8);
				   validFromLess = DateFunction(validFromLess);
				   dateTillLess = DateFunction(dateTillLess);
				    var  queryLessValidFrom = 'update  "MDB_DEV"."MST_PRICE" set DATE_TILL=? where   MATERIAL_CODE=? ' + 
				                              ' AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? AND CUST_TYPE_SALER=? and STATE=? ' + 
				                              ' AND DATE_TILL=? AND SOFT_DEL=? AND VALID_FROM=?';

					var pstmtLessValidFrom1 = connection.prepareStatement(queryLessValidFrom);

					pstmtLessValidFrom1.setString(1, yesterdayDateTill);
					pstmtLessValidFrom1.setString(2, dict.MATERIAL_CODE);
					pstmtLessValidFrom1.setString(3, 'SET');
					pstmtLessValidFrom1.setString(4, 'INR');
					pstmtLessValidFrom1.setString(5, dict.CUST_TYPE_BUYER);
					pstmtLessValidFrom1.setString(6, dict.CUST_TYPE_SELLER);
					pstmtLessValidFrom1.setString(7, dict.STATE);
					pstmtLessValidFrom1.setString(8, dateTillLess);
					pstmtLessValidFrom1.setString(9, '0');
					pstmtLessValidFrom1.setString(10, validFromLess);

					var rsLessValidFrom1 = pstmtLessValidFrom1.executeUpdate();
					connection.commit();
             
				}
			    
			    
			    
			    
			    var	queryNextValidFrom = 'select *  from   "MDB_DEV"."MST_PRICE" where SOFT_DEL=? AND MATERIAL_CODE=? ' + 
			                             ' AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? AND CUST_TYPE_SALER=? and STATE=? ' + 
			                             ' AND VALID_FROM> ?  ORDER BY VALID_FROM ASC';

				var pstmtnEXTValidFrom = connection.prepareStatement(queryNextValidFrom);

				pstmtnEXTValidFrom.setString(1, '0');
				pstmtnEXTValidFrom.setString(2, dict.MATERIAL_CODE);
				pstmtnEXTValidFrom.setString(3, 'SET');
				pstmtnEXTValidFrom.setString(4, 'INR');
				pstmtnEXTValidFrom.setString(5, dict.CUST_TYPE_BUYER);
				pstmtnEXTValidFrom.setString(6, dict.CUST_TYPE_SELLER);
				pstmtnEXTValidFrom.setString(7, dict.STATE);
				pstmtnEXTValidFrom.setString(8, userInputDate);

				var rsNextValidFrom = pstmtnEXTValidFrom.executeQuery();
				connection.commit();
				var validNextDateSelection = '9999.12.31';
				if(rsNextValidFrom.next()){
				    var validfrom_next_temp = rsNextValidFrom.getString(7);
                       	var dateTilTemp = new Date(validfrom_next_temp);
                       	dateTilTemp.setDate(dateTilTemp.getDate() - 1);
				    validNextDateSelection = DateFunction(dateTilTemp.toDateString());
				    
				    
				    
				 
				}
			    var queryValidDateTill = ' select *  from   "MDB_DEV"."MST_PRICE" where SOFT_DEL=? AND MATERIAL_CODE=? ' + 
			                             ' AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? AND CUST_TYPE_SALER=? and STATE=? ' + 
			                             ' AND VALID_FROM=? AND DATE_TILL=? '; 
			    	var pstmtValidDateTill = connection.prepareStatement(queryValidDateTill);

				pstmtValidDateTill.setString(1, '0');
				pstmtValidDateTill.setString(2, dict.MATERIAL_CODE);
				pstmtValidDateTill.setString(3, 'SET');
				pstmtValidDateTill.setString(4, 'INR');
				pstmtValidDateTill.setString(5, dict.CUST_TYPE_BUYER);
				pstmtValidDateTill.setString(6, dict.CUST_TYPE_SELLER);
				pstmtValidDateTill.setString(7, dict.STATE);
				pstmtValidDateTill.setString(8, userInputDate);
				pstmtValidDateTill.setString(9, validNextDateSelection);

				var rsValidDateTill = pstmtValidDateTill.executeQuery();
				connection.commit();
				if (rsValidDateTill.next()) {
				   var  querySoftDelUpdate1 = 'update  "MDB_DEV"."MST_PRICE" set SOFT_DEL=? where   MATERIAL_CODE=?  AND UNIT=? ' + 
				                              ' AND CURRANCY=? AND CUST_TYPE=? AND CUST_TYPE_SALER=? and STATE=? AND DATE_TILL=?' + 
				                              '  and SOFT_DEL=? and VALID_FROM=?';

					var pstmtSoftDelUpdate1 = connection.prepareStatement(querySoftDelUpdate1);

					//pstmtSoftDelUpdate.setString(1, record.PRV);
					pstmtSoftDelUpdate1.setString(1, '1');
					pstmtSoftDelUpdate1.setString(2, dict.MATERIAL_CODE);
					pstmtSoftDelUpdate1.setString(3, 'SET');
					pstmtSoftDelUpdate1.setString(4, 'INR');
					pstmtSoftDelUpdate1.setString(5, dict.CUST_TYPE_BUYER);
					pstmtSoftDelUpdate1.setString(6, dict.CUST_TYPE_SELLER);
					pstmtSoftDelUpdate1.setString(7, dict.STATE);
					pstmtSoftDelUpdate1.setString(8, validNextDateSelection);
					pstmtSoftDelUpdate1.setString(9, '0');
					pstmtSoftDelUpdate1.setString(10, userInputDate);

					var rsSoftDelUpdate = pstmtSoftDelUpdate1.executeUpdate();
					connection.commit();
            
				}
				 var	queryValidDateTillInsert = 'insert into "MDB_DEV"."MST_PRICE" (MATERIAL_CODE,SALE_PRICE,UNIT, ' + 
				                                   'CURRANCY,STATE,CUST_TYPE,DATE_TILL,CUST_TYPE_SALER,VALID_FROM)values ' + 
				                                   '(?, ?, ?, ?, ?, ?, ?, ?,?)';

					var	pstmtValidDateTillInsert = connection.prepareStatement(queryValidDateTillInsert);

						pstmtValidDateTillInsert.setString(1, dict.MATERIAL_CODE);
						pstmtValidDateTillInsert.setString(2, dict.SALE_PRICE);
						pstmtValidDateTillInsert.setString(3, 'SET');
						pstmtValidDateTillInsert.setString(4, 'INR');
						pstmtValidDateTillInsert.setString(5, dict.STATE);
						pstmtValidDateTillInsert.setString(6, dict.CUST_TYPE_BUYER);
						pstmtValidDateTillInsert.setString(7, validNextDateSelection);
						pstmtValidDateTillInsert.setString(8, dict.CUST_TYPE_SELLER);
						pstmtValidDateTillInsert.setString(9, userInputDate);
					//	pstmtValidInsert.setString(10, '0');

						var rsValidDateTillInsert = pstmtValidDateTillInsert.executeQuery();
						connection.commit();
			    
            }
			} else {

			var	queryInsertMaterial =
					'insert into "MDB_DEV"."MST_PRICE"(MATERIAL_CODE,SALE_PRICE,UNIT,CURRANCY,STATE,CUST_TYPE,DATE_TILL,' +
					'CUST_TYPE_SALER,VALID_FROM)values(?, ?, ?, ?, ?, ?, ?, ?,?)';

				var pstmtInsertMaterial = connection.prepareStatement(queryInsertMaterial);

				pstmtInsertMaterial.setString(1, dict.MATERIAL_CODE);
				pstmtInsertMaterial.setString(2, dict.SALE_PRICE);
				pstmtInsertMaterial.setString(3, 'SET');
				pstmtInsertMaterial.setString(4, 'INR');
				pstmtInsertMaterial.setString(5, dict.STATE);
				pstmtInsertMaterial.setString(6, dict.CUST_TYPE_BUYER);
				pstmtInsertMaterial.setString(7, '9999.12.31');
				pstmtInsertMaterial.setString(8, dict.CUST_TYPE_SELLER);
            	pstmtInsertMaterial.setString(9, userInputDate);
				var rsInsertMaterial = pstmtInsertMaterial.executeUpdate();
				connection.commit();
				if (rsInsertMaterial > 0) {
					record.status = rsInsertMaterial.toString();
					record.message = 'Record Save Successfully!';

				} else {
					record.status = rsInsertMaterial.toString();
					record.message = 'Record not Saved !';

				}
			}
			if((i % closeConnectionThreshold) === 0){
			    connection.commit();
			    connection.close();
			    connection = $.db.getConnection();
			}
		output.results.push(record);
		}

        connection.commit();
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

function getPrice(){
    	var output = {
		results: []
	};

	var pstmtSelMaterial;
	var record = {};
	var connection = $.db.getConnection();
//	var priceDataArray = $.request.parameters.get('priceList');
	var querySelMaterial;

	try {


			querySelMaterial = 'select PRICE_ID,MATERIAL_CODE,SALE_PRICE,UNIT,CURRANCY,VALID_FROM,DATE_TILL,STATE,CUST_TYPE,' + 
			                    ' CUST_TYPE_SALER,SOFT_DEL FROM "MDB_DEV"."MST_PRICE" WHERE SOFT_DEL=?';
				               // + 'where MATERIAL_CODE=?  AND UNIT=? AND CURRANCY=? AND CUST_TYPE=? ' + 
				               //' AND CUST_TYPE_SALER=? and STATE=?  AND SOFT_DEL=? order by  DATE_TILL desc limit 1'
				               
		    pstmtSelMaterial = connection.prepareStatement(querySelMaterial);
		    pstmtSelMaterial.setString(1, '0');
			var rsSelMaterial = pstmtSelMaterial.executeQuery();
			connection.commit();
			while(rsSelMaterial.next()){
			    record = {};
			    record.PRICE_ID = rsSelMaterial.getInteger(1);
			    record.MATERIAL_CODE = rsSelMaterial.getString(2);
			    record.SALE_PRICE = rsSelMaterial.getString(3);
			    record.UNIT = rsSelMaterial.getString(4);
			    record.CURRANCY = rsSelMaterial.getString(5);
			    record.VALID_FROM = rsSelMaterial.getString(6);
			    record.DATE_TILL = rsSelMaterial.getString(7);
			    record.STATE = rsSelMaterial.getString(8);
			    record.CUST_TYPE = rsSelMaterial.getString(9);
			    record.CUST_TYPE_SALER = rsSelMaterial.getString(10);
			    record.SOFT_DEL = rsSelMaterial.getString(11);
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

function getSellerBuyerHierarchy(){
var output = {
		results: [
			{
				customerTypeSeller: "MPURSE",
				customerTypeSellerCode: "MPURSE",
				customerTypeBuyers: [

					{
						customerTypeBuyer: "REGIONAL DISTRIBUTOR",
						customerTypeBuyerCode: "DSTB"
		        }
		        ]
		   }, {
				customerTypeSeller: "REGIONAL DISTRIBUTOR",
				customerTypeSellerCode: "DSTB",
				customerTypeBuyers: [


					{
						customerTypeBuyer: "RETAILER",
						customerTypeBuyerCode: "RETL"
		        }


		        ]
		   }]
	};

	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

function getPriceDetails() { 
    
   var Output = {
		results: []
	};
	var conn = $.db.getConnection();
	var FromDate = $.request.parameters.get('FromDate');
	var ToDate = $.request.parameters.get('ToDate');
	var State = $.request.parameters.get('State');
/*	var Material = $.request.parameters.get('Material');*/
	var CustSeller = $.request.parameters.get('CustSeller');
	var custBuyer = $.request.parameters.get('CustBuyer');
	//var District = $.request.parameters.get('District');
	var whereCondition = '';
	var pstmtGetPrice; 
	var rsGetPrice;
		try {
		// when we are select FromDate , Todate and State
		if (FromDate !== '' && ToDate === '' ){
		    	whereCondition += " AND ( p.VALID_FROM >='" + FromDate + "'  )";
		}
		if (FromDate === '' && ToDate !== '' ){
		    	whereCondition += " AND (  p.DATE_TILL <='" + ToDate + "'  )";
		}
		if (FromDate !== '' && ToDate !== '' ){
		    	whereCondition += " AND (  p.VALID_FROM >= '" + FromDate + "'  AND p.DATE_TILL <= '" + ToDate + "' )";
		}
		if (!( State === undefined || State === '') ) {
	
		
		   	whereCondition += " and p.STATE='" + State + "'";
		}
		if (!(CustSeller === undefined || CustSeller === '' ) ){
		    
	    whereCondition += " and p.CUST_TYPE_SALER='" + CustSeller + "'";
		}
		if(!(custBuyer === undefined || custBuyer === '')) {
		    
		  whereCondition += " and p.CUST_TYPE='" + custBuyer + "'";  
		}
	
	
	if(whereCondition !== '' || whereCondition === 'null')
	{
	var	queryGetPrice =
        ' SELECT  p.MATERIAL_CODE ,p.SALE_PRICE ,p.VALID_FROM ,p.DATE_TILL ,p.STATE , p.CUST_TYPE ,p.CUST_TYPE_SALER  FROM   "MDB_DEV"."MST_PRICE" as p  WHERE p.SOFT_DEL=? ' + whereCondition ;
    	pstmtGetPrice = conn.prepareStatement(queryGetPrice);
    	pstmtGetPrice.setString(1,'0');
        rsGetPrice = pstmtGetPrice.executeQuery();
        conn.commit();
			while (rsGetPrice.next()) {
			   var record = {};
        				record.MATERIAL_CODE = rsGetPrice.getString(1);
        				record.SALE_PRICE = rsGetPrice.getString(2);
        				record.VALID_FROM = rsGetPrice.getString(3);
        				record.DATE_TILL = rsGetPrice.getString(4);
        				record.STATE = rsGetPrice.getString(5);
        				record.CUST_TYPE = rsGetPrice.getString(6);
        				record.CUST_TYPE_SALER = rsGetPrice.getString(7);
			        	Output.results.push(record);
			}
		
	}
		conn.close();
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

	case "uploadPrice":
		uploadPrice();
		break;
	case "getPrice":
		getPrice();
		break;	
	case "getSellerBuyerHierarchy":
	    getSellerBuyerHierarchy();
	    break;
    case "getPriceDetails":
        getPriceDetails();
        break;
		
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}