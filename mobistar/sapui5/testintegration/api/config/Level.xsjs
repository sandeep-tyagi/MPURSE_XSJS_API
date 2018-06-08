/**
 * To get the status of soft_del in the form of Active or inactive.
 * @Param {String} output.
 * @return {String} SOFT_DEL_DESC  .
 */
 
  function checkStatusDescription(record){
    if(record.SOFT_DEL === '0'){
        record.SOFT_DEL_DESC = 'Active';
    }else  if(record.SOFT_DEL === '1'){
        record.SOFT_DEL_DESC = 'Inactive';
    }
    return record;
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
  * To fetch a level from level master.
  * @Param {Integer} leveld
  * @Param [] output to put the data in it
  * @returns {output} Array of level record
  * @author: Shubham.
  */

 function getLevel() {
 	var output = {
 		results: []
 	};
 	var conn1 = $.db.getConnection();
 	var leveld = $.request.parameters.get('leveld');
 	var queryLevel = '';
 	var pstmtLevel = '';
 	var rsLevel = '';
 	try {
 		queryLevel = ' SELECT * FROM "MDB_TEST_INTEGRATION"."MST_LEVEL" WHERE LEVEL_ID=? ';
 		pstmtLevel = conn1.prepareStatement(queryLevel);
 		pstmtLevel.setString(1, leveld);
 		rsLevel = pstmtLevel.executeQuery();
 		conn1.commit();
 		while (rsLevel.next()) {
 			var record = {};
 			record.ID = rsLevel.getString(1);
 			record.LEVEL = rsLevel.getString(2);
 			record.SOFT_DEL = rsLevel.getString(3);
 			record.CREATE_BY = rsLevel.getString(4);
 			record.CREATE_DATE = rsLevel.getString(5);
 			record.MODIFIED_BY = rsLevel.getString(6);
 			record.MODIFIED_DATE = rsLevel.getString(7);
 			output.results.push(record);
 		}

 		conn1.close();
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
  * To fetch all levels from level master
  * @returns {output} Array of level record
  * @author: Shubham.
  */

 function getLevels() {
 	var output = {
 		results: []
 	};
 	var conn1 = $.db.getConnection();

 	try {
 		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_LEVEL"(?,?,?,?,?,?,?,?)';
 		var pstmtCallPro = conn1.prepareCall(CallPro);
 		pstmtCallPro.setInteger(1, 0);
 		pstmtCallPro.setString(2, ' ');
 		pstmtCallPro.setString(3, '');
 		pstmtCallPro.setString(4, 'null');
 		pstmtCallPro.setString(5, dateFunction());
 		pstmtCallPro.setString(6, 'null');
 		pstmtCallPro.setString(7, dateFunction());
 		pstmtCallPro.setString(8, 'SELECT');
 		pstmtCallPro.execute();
 		var rCallPro = pstmtCallPro.getResultSet();
 		conn1.commit();
 		while (rCallPro.next()) {
 			var record = {};
 			record.ID = rCallPro.getString(1);
 			record.LEVEL = rCallPro.getString(2);
 			record.SOFT_DEL = rCallPro.getString(3);
 			record.CREATE_BY = rCallPro.getString(4);
 			record.CREATE_DATE = rCallPro.getString(5);
 			record.MODIFIED_BY = rCallPro.getString(6);
 			record.MODIFIED_DATE = rCallPro.getString(7);
 			checkStatusDescription(record);
 			dateFormat(record);
 			output.results.push(record);
 		}

 		conn1.close();
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
 * fetch Level from Level master
 * @Param {} inputData.
 * @returns {output} resultset of Level
 * @author: Shubham
 */ 
 
function fetchLevel(inputData, connection) {
	var queryselectLevel = 'select * from "MDB_TEST_INTEGRATION"."MST_LEVEL" where SOFT_DEL is not null ';
	var whereClause = "";
	if (inputData.level !== '') {
		whereClause += " AND LEVEL='" + inputData.level + "'";
	}
	queryselectLevel += whereClause;
	var pstmtSelectLevel = connection.prepareStatement(queryselectLevel);
	var rsSelectLevel = pstmtSelectLevel.executeQuery();
	return rsSelectLevel;
}

/**
  * Insert new  Level.
  * @Param {string} level .
  * @Param [] output .
  * @return {String} message .
  * @author : Shubham.
  */
  
 function addLevel(inputData, connection, record) {

 		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_LEVEL"(?,?,?,?,?,?,?,?);';
 		var pstmtCallPro = connection.prepareCall(CallPro);
 		pstmtCallPro.setInteger(1, 0);
 		pstmtCallPro.setString(2, inputData.level);
 		pstmtCallPro.setString(3, '0');
 		pstmtCallPro.setString(4, inputData.createby);
 		pstmtCallPro.setString(5, dateFunction());
 		pstmtCallPro.setString(6, 'null');
 		pstmtCallPro.setString(7, dateFunction());
 		pstmtCallPro.setString(8, 'INSERT');
 		pstmtCallPro.execute();
  		var rsCallPro = pstmtCallPro.getParameterMetaData();
  		connection.commit();
 		if (rsCallPro.getParameterCount() > 0) {
  			record.status = 1;
  			record.Message = 'Data inserted successfully';
  		} else {
  			record.status = 0;
  			record.Message = 'Some Issues!';
  		}

 }
 
 
 /**
  * To update level.
  * @Param {integer} levelID_EditLevel ,
  * @Param {string} levelNAME_EditLevel,
  * @Param {string} levelNameEditStatus.
  * @Param [] output .
  * @return {String} message .
  * @author: Shubham.
  */

 function updateLevel() {
 	var Output = {
 		results: []

 	};
 	var record = {};
 	var conn = $.db.getConnection();
 	var levelID_EditLevel = $.request.parameters.get('levelID_EditLevel');
 	var levelNAME_EditLevel = $.request.parameters.get('levelNAME_EditLevel');
 	var levelNameEditStatus = $.request.parameters.get('levelNameEditStatus');
var modifyby = $.request.parameters.get('modifyby');
 	try {
 		var UpdCallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_LEVEL"(?,?,?,?,?,?,?,?);';
 		var pstmtUpdCallPro = conn.prepareCall(UpdCallPro);
 		pstmtUpdCallPro.setInteger(1, parseInt(levelID_EditLevel, 10));
 		pstmtUpdCallPro.setString(2, levelNAME_EditLevel);
 		pstmtUpdCallPro.setInteger(3, 0);
 		pstmtUpdCallPro.setString(4, levelNameEditStatus);
 		pstmtUpdCallPro.setString(5, dateFunction());
 		pstmtUpdCallPro.setString(6, modifyby);
 		pstmtUpdCallPro.setString(7, dateFunction());
 		pstmtUpdCallPro.setString(8, 'UPDATE');
 		pstmtUpdCallPro.execute();
 		var rsUpdCallPro = pstmtUpdCallPro.getParameterMetaData();
 		conn.commit();

 		if (rsUpdCallPro.getParameterCount() > 0) {
 			record.status = 0;
 			record.message = 'Success';
 			Output.results.push(record);

 		} else {
 			record.status = 1;
 			record.message = 'failed';
 			Output.results.push(record);

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
 
 /**
  * To delete existing level.
  * @Param {integer} levelIdDelLevel .
  * @Param [] output .
  * @return {String} message .
  * @author: Shubham.
  */

 function deleteLevel() {
 	var Output = {
 		results: []

 	};
 	var record = {};
 	var conn = $.db.getConnection();
 	var levelIdDelLevel = $.request.parameters.get('levelIdDelLevel');

 	try {
 		var UpdCallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_LEVEL"(?,?,?,?,?,?,?,?);';
 		var pstmtUpdCallPro = conn.prepareCall(UpdCallPro);
 		pstmtUpdCallPro.setInteger(1, parseInt(levelIdDelLevel, 10));
 		pstmtUpdCallPro.setString(2, ' ');
 		pstmtUpdCallPro.setString(3, '1');
 		pstmtUpdCallPro.setString(4, 'ADMIN');
 		pstmtUpdCallPro.setString(5, dateFunction());
 		pstmtUpdCallPro.setString(6, ' ');
 		pstmtUpdCallPro.setString(7, dateFunction());
 		pstmtUpdCallPro.setString(8, 'DELETE');
 		pstmtUpdCallPro.execute();
 		var rsUpdCallPro = pstmtUpdCallPro.getParameterMetaData();
 		conn.commit();

 		if (rsUpdCallPro.getParameterCount() > 0) {
 			record.status = 0;
 			record.message = 'Success';
 			Output.results.push(record);

 		} else {
 			record.status = 1;
 			record.message = 'failed';
 			Output.results.push(record);

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
 
 /**
 * This is a function which call addLevel to Validate to add level data  on the behalf of input level.
 * @Param {String} level
 * @Param [] output to put the data in it
 * @returns {output} level 
 * @author : Shubham
 */
 
function validateLevel() {

	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var inputData = {};
		var level = $.request.parameters.get('level');
	var createby = $.request.parameters.get('createby');
	
	inputData.level = level;
	inputData.createby = createby;

	try {
		var record = {};
		var rsLevelValidation = fetchLevel(inputData, connection);
		if (rsLevelValidation.next()) {
			var softDel = rsLevelValidation.getString(3);
			if (softDel === "0") {
				record.status = 1;
				record.Message = "Level name already present in our System!!! Kindly add another Level name";

			} else {
				record.status = 1;
				record.Message = "Level name is inactive in our System!!! Kindly use edit functionality to activate it.";
			}
		} else {
			addLevel(inputData, connection, record);
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

 	case "getLevels":
 		getLevels();
 		break;
 	case "getLevel":
 		getLevel();
 		break;
 	case "addLevel":
 		addLevel();
 		break;
 	case "updateLevel":
 		updateLevel();
 		break;
 	case "deleteLevel":
 		deleteLevel();
 		break;
 	case "validateLevel":
 		validateLevel();
 		break;
 	default:
 		$.response.status = $.net.http.BAD_REQUEST;
 		$.response.setBody('Invalid Command');

 }