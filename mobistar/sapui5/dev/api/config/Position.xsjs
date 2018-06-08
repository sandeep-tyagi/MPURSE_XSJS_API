/**
 * To get the current date in db format.
 * @Param {String} output.
 * @return {String} yyyymmddp  .
 */
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

/**
  * To get the current date in db format.
  * @Param {String} output.
  * @return {String} yyyymmddp  .
  */

function dateFormat(record) {
    var date = record.CREATE_DATE;
   if (date) {
    record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
    return record.CREATE_DATE;
   }
  }

/**
 * To get the status of soft_del in the form of Active or inactive.
 * @Param {String} output.
 * @return {String} SOFT_DEL_DESC  .
 */
 function checkStatusDescription(record) {
 	if (record.SOFT_DEL === '0') {
 		record.SOFT_DEL_DESC = 'Active';
 	} else if (record.SOFT_DEL === '1') {
 		record.SOFT_DEL_DESC = 'Inactive';
 	}
 	return record;
 }

 /**
  * To get the current date in db format.
  * @Param {String} output.
  * @return {String} yyyymmddp  .
  */

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

 /**
  * To fetch a position from position master on the behalf of input position name.
  * @Param {Integer} positionId
  * @Param {String} positionName
  * @Param [] output to put the data in it
  * @returns {output} Array of position record
  * @author: Shubham.
  */
 function getPosition() {
 	var output = {
 		results: []
 	};
 	var connection = $.db.getConnection();
 	var positionId = $.request.parameters.get('positionId');
 	var positionName = $.request.parameters.get('positionName');

 	try {
 		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_POSITION"(?,?,?,?,?,?,?,?);';
 		var pstmtCallPro = connection.prepareCall(CallPro);
 		pstmtCallPro.setInteger(1, parseInt(positionId, 10));
 		pstmtCallPro.setString(2, positionName);
 		pstmtCallPro.setInteger(3, 0);
 		pstmtCallPro.setString(4, 'ADMIN');
 		pstmtCallPro.setString(5, dateFunction());
 		pstmtCallPro.setString(6, ' ');
 		pstmtCallPro.setString(7, dateFunction());
 		pstmtCallPro.setString(8, 'SELECT');
 		pstmtCallPro.execute();
 		var rCallPro = pstmtCallPro.getResultSet();
 		connection.commit();
 		while (rCallPro.next()) {
 			var record = {};
 			record.POSITION_ID = rCallPro.getString(1);
 			record.POSITION_NAME = rCallPro.getString(2);
 			record.SOFT_DEL = rCallPro.getString(3);
 			record.CREATE_BY = rCallPro.getString(4);
 			record.CREATE_DATE = rCallPro.getString(5);
 			record.MODIFIED_BY = rCallPro.getString(6);
 			record.MODIFIED_DATE = rCallPro.getString(7);
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
  * To fetch all positions from position master
  * @returns {output} Array of position record
  *  @author: Shubham.
  */

 function getPositions() {
 	var output = {
 		results: []
 	};
 	var connection = $.db.getConnection();

 	try {
 		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_POSITION"(?,?,?,?,?,?,?,?);';
 		var pstmtCallPro = connection.prepareCall(CallPro);
 		pstmtCallPro.setInteger(1, 0);
 		pstmtCallPro.setString(2, ' ');
 		pstmtCallPro.setInteger(3, 0);
 		pstmtCallPro.setString(4, 'ADMIN');
 		pstmtCallPro.setString(5, dateFunction());
 		pstmtCallPro.setString(6, ' ');
 		pstmtCallPro.setString(7, dateFunction());
 		pstmtCallPro.setString(8, 'SELECTPOSITIONS');
 		pstmtCallPro.execute();
 		var rCallPro = pstmtCallPro.getResultSet();
 		connection.commit();
 		while (rCallPro.next()) {
 			var record = {};
 			record.POSITION_ID = rCallPro.getString(1);
 			record.POSITION_NAME = rCallPro.getString(2);
 			record.SOFT_DEL = rCallPro.getString(3);
 			record.CREATE_BY = rCallPro.getString(4);
 			record.CREATE_DATE = rCallPro.getString(5);
 			record.MODIFIED_BY = rCallPro.getString(6);
 			record.MODIFIED_DATE = rCallPro.getString(7);
 			checkStatusDescription(record);
 			dateFormat(record);
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
 * fetch Position from position master
 * @Param {} inputData.
 * @returns {output} resultset of Position
 */ 
 
function fetchPosition(inputData, connection) {
	var queryselectPosition = 'select * from "MDB_DEV"."MST_POSITION" where SOFT_DEL is not null ';
	var whereClause = "";
	if (inputData.positionName !== '') {
		whereClause += " AND POSITION_NAME='" + inputData.positionName + "'";
	}
	queryselectPosition += whereClause;
	var pstmtSelectPosition = connection.prepareStatement(queryselectPosition);
	var rsSelectPosition = pstmtSelectPosition.executeQuery();
	return rsSelectPosition;
}

/* function addPosition() {

 	var record;
 	var Output = {
 		results: []
 	};

 	var connection = $.db.getConnection();
 	var positionName = $.request.parameters.get('positionName');

 	try {

 		record = {};
 		if (positionName === undefined || positionName === null || positionName === '') {
 			record.status = '1';
 			record.message = "There should be some value for position name.";

 		} else {

 			var qryInsertPosition = 'INSERT INTO  "MDB_DEV"."MST_POSITION"(POSITION_NAME) VALUES(?);';
 			var pstmtInsertPosition = connection.prepareStatement(qryInsertPosition);
 			pstmtInsertPosition.setString(1, positionName);

 			var rsInsertPosition = pstmtInsertPosition.executeUpdate();

 			connection.commit();
 			if (rsInsertPosition > 0) {
 				record.status = '0';
 				record.message = "Data inserted successfully.";
 			} else {
 				record.status = '1';
 				record.message = "There is some maintenance going on.Kindly contact admin";
 			}
 		}
 		Output.results.push(record);
 		connection.close();
 	} catch (e) {

 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);
 		return;
 	}
 	var body = JSON.stringify(Output);
 	$.response.contentType = 'application/json';
 	$.response.setBody(body);
 	$.response.status = $.net.http.OK;
 }*/

/**
  * Insert new  Position.
  * @Param {string} positionName .
  * @Param [] output .
  * @return {String} message .
  * @author : Shubham.
  */
function addPosition(inputData, connection, record) {

	var qryInsertPosition = 'INSERT INTO  "MDB_DEV"."MST_POSITION"(POSITION_NAME,CREATE_BY) VALUES(?,?);';
 			var pstmtInsertPosition = connection.prepareStatement(qryInsertPosition);
 			pstmtInsertPosition.setString(1, inputData.positionName);
            pstmtInsertPosition.setString(2, inputData.createby);
 			var rsInstPosition = pstmtInsertPosition.executeUpdate();
 	connection.commit();
 	if (rsInstPosition > 0) {
 		record.status = 1;
 		record.Message = "Record Successfully inserted";
 	} else {
 		record.status = 0;
 		record.Message = "Record Successfully  not inserted!!! Kindly contact Admin.";
 	}

}
/**
  * To update position.
  * @Param {integer} positionIdUpdatePosition ,
  * @Param {string} positionNameEditPosition,
  * @Param {string} positionStatusEditPosition.
  * @Param [] output .
  * @return {String} message .
  * @author: Shubham.
  */


 function updatePosition() {
 	var Output = {
 		results: []

 	};
 	var record = {};
 	var connection = $.db.getConnection();
 	var positionIdUpdatePosition = $.request.parameters.get('positionIdUpdatePosition');
 	var positionNameEditPosition = $.request.parameters.get('positionNameEditPosition');
 	var positionStatusEditPosition = $.request.parameters.get('positionStatusEditPosition');
 	var modifyby = $.request.parameters.get('modifyby');
 	if (positionIdUpdatePosition === undefined || positionIdUpdatePosition === null || positionIdUpdatePosition === '') {

 		record.status = '1';
 		record.message = "Update PositionId should not be empty.Please provide position id";
 	} else if (positionNameEditPosition === undefined || positionNameEditPosition === null || positionNameEditPosition === '') {
 		record.status = '1';
 		record.message = "Please provide position name.";
 	} else {

 		try {
 			var qryUpdatePosition = 'UPDATE "MDB_DEV"."MST_POSITION" SET POSITION_NAME = ?,MODIFIED_DATE=?, SOFT_DEL=?,MODIFIED_BY=? where POSITION_ID= ?';
 			var pstmtUpdatePosition = connection.prepareStatement(qryUpdatePosition);
 			pstmtUpdatePosition.setString(1, positionNameEditPosition);
 			pstmtUpdatePosition.setString(2, dateFunction());
 			pstmtUpdatePosition.setString(3, positionStatusEditPosition);
 			pstmtUpdatePosition.setString(4, modifyby);
 		//	pstmtUpdatePosition.setString(5, dateFunction());
 			pstmtUpdatePosition.setInteger(5, parseInt(positionIdUpdatePosition, 10));
 			var rsUpdatePosition = pstmtUpdatePosition.executeUpdate();
 			connection.commit();

 			if (rsUpdatePosition > 0) {
 				record.status = 0;
 				record.message = 'Successfully updated record for position';

 			} else {
 				record.status = 1;
 				record.message = 'failed to update position . Kindly contact admin.';

 			}

 		} catch (e) {

 			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 			$.response.setBody(e.message);
 			return;
 		}
 	}
 	Output.results.push(record);
 	connection.close();
 	var body = JSON.stringify(Output);
 	$.response.contentType = 'application/json';
 	$.response.setBody(body);
 	$.response.status = $.net.http.OK;
 }

/**
  * To delete existing position.
  * @Param {integer} positionIdDelPosition .
  * @Param [] output .
  * @return {String} message .
  * @author: Shubham.
  */

 function deletePosition() {
 	var Output = {
 		results: []

 	};
 	var record = {};
 	var connection = $.db.getConnection();
 	var positionIdDelPosition = $.request.parameters.get('positionIdDelPosition');

 	try {
 		if (positionIdDelPosition === undefined || positionIdDelPosition === null || positionIdDelPosition === '') {
 			record.status = '1';
 			record.message = "Position Id should not be empty!!!";

 		} else {
 			var qryDelPosition = 'UPDATE "MDB_DEV"."MST_POSITION" SET SOFT_DEL=? where POSITION_ID=?';
 			var pstmtDelPosition = connection.prepareStatement(qryDelPosition);
 			pstmtDelPosition.setString(1, '1');
 			pstmtDelPosition.setInteger(2, parseInt(positionIdDelPosition, 10));
 			var rsDelPosition = pstmtDelPosition.executeUpdate();

 			connection.commit();
 			if (rsDelPosition > 0) {
 				record.status = '0';
 				record.message = "Data Deleted successfully.";
 			} else {
 				record.status = '1';
 				record.message = "There is some maintenance going on.Kindly contact admin";
 			}
 		}
 		Output.results.push(record);
 		connection.close();

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
 
 /**
 * This is a function which call addPosition to Validate to add position data  on the behalf of input positionName.
 * @Param {String} positionName
 * @Param [] output to put the data in it
 * @returns {output} position 
 * @author : Shubham
 */

function validatePosition() {

	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var inputData = {};
	var positionName = $.request.parameters.get('positionName');
	var createby = $.request.parameters.get('createby');
	inputData.positionName = positionName;
    inputData.createby = createby;
	try {
		var record = {};
		var rsPositionValidation = fetchPosition(inputData, connection);
		if (rsPositionValidation.next()) {
			var softDel = rsPositionValidation.getString(3);
			if (softDel === "0") {
				record.status = 1;
				record.Message = "Position name already present in our System!!! Kindly add another position name";

			} else {
				record.status = 1;
				record.Message = "Position name is inactive in our System!!! Kindly use edit functionality to activate it.";
			}
		} else {
			addPosition(inputData, connection, record);
		}
		Output.results.push(record);
		connection.close();

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

 	case "getPosition":
 		getPosition();
 		break;
 	case "getPositions":
 		getPositions();
 		break;
 	case "addPosition":
 		addPosition();
 		break;
 	case "updatePosition":
 		updatePosition();
 		break;
 	case "deletePosition":
 		deletePosition();
 		break;
 	case "validatePosition":
 		validatePosition();
 		break;	

 	default:
 		$.response.status = $.net.http.BAD_REQUEST;
 		$.response.setBody('Invalid Command');

 }