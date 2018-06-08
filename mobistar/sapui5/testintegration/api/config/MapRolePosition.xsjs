/**
 *  To get the current date in db format .
 * @Param {String} Date.
 * @return {String} yyyymmddp  .
 * @author Shriyansi.
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

/**.
 * To get date  format for paticular date
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
 * To get the details of MapRolePosition on the behalf of roleId ,positionId.
 ** @Param [] output .
 * @return {String} array of attribute .
 * @author: Shriyansi.
 */
function getMapRolePosition() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
	var roleId = $.request.parameters.get('roleId');
	var positionId = $.request.parameters.get('positionId');

	try {
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MAP_ROLE_POSITION"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, parseInt(roleId, 10));
		pstmtCallPro.setInteger(3, parseInt(positionId, 10));
		pstmtCallPro.setString(4, '0');
		pstmtCallPro.setString(5, 'ADMIN');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, ' ');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'SELECTROLEID');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn1.commit();
		while (rCallPro.next()) {
			var record = {};
			record.POSITION_NAME = rCallPro.getString(1);
			record.ROLE_NAME = rCallPro.getString(2);
			record.ROLE_POS_ID = rCallPro.getString(3);
			record.ROLE_ID = rCallPro.getString(4);
			record.POSITION_ID = rCallPro.getString(5);
			record.SOFT_DEL = rCallPro.getString(9);
			record.CREATE_BY = rCallPro.getString(10);
			record.CREATE_DATE = rCallPro.getString(11);
			record.MODIFIED_BY = rCallPro.getString(12);
			record.MODIFIED_DATE = rCallPro.getString(13);
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
 * To get the details of PosHierarchy on the behalf of posId ,parentPosId.
 ** @Param [] output .
 * @return {String} array of attribute .
 * @author: Shriyansi.
 */

function getMapRolePositions() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MAP_ROLE_POSITION"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, 0);
		pstmtCallPro.setInteger(3, 0);
		pstmtCallPro.setInteger(4, 0);
		pstmtCallPro.setString(5, 'ADMIN');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, ' ');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'SELECT');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn1.commit();
		while (rCallPro.next()) {
			var record = {};
			record.POSITION_NAME = rCallPro.getString(1);
			record.ROLE_NAME = rCallPro.getString(2);
			record.ROLE_POS_ID = rCallPro.getString(3);
			record.ROLE_ID = rCallPro.getString(4);
			record.POSITION_ID = rCallPro.getString(5);
			record.SOFT_DEL = rCallPro.getString(9);
			record.CREATE_BY = rCallPro.getString(10);
			record.CREATE_DATE = rCallPro.getString(11);
			record.MODIFIED_BY = rCallPro.getString(12);
			record.MODIFIED_DATE = rCallPro.getString(13);
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
 * To get the details of PosHierarchy on the behalf of posId ,parentPosId.
 ** @Param [] output .
 * @return {String} array of attribute .
 * @author: Shriyansi.
 */

function getRolePositions(){
     var connection = $.db.getConnection();
    	var output = {
		results: []
	};
	try {
        var qryRole = 'Select Role_id,role_name from "MDB_TEST_INTEGRATION"."MST_ROLE" where SOFT_DEL = ?';    	
    	var pstmtRole = connection.prepareStatement(qryRole);
    	pstmtRole.setString(1,'0');
    	var rsRole = pstmtRole.executeQuery();
    
    	while (rsRole.next()) {
    		var record = {};
    		record.ROLE_ID = rsRole.getInteger(1);
    		record.ROLE_NAME = rsRole.getString(2);
    		
    		var qryRolePosi = 'select RolePosi.role_pos_id,RolePosi.position_id,Position.position_name from "MDB_TEST_INTEGRATION"."MAP_ROLE_POSITION" as RolePosi inner join "MDB_TEST_INTEGRATION"."MST_POSITION" as Position on RolePosi.position_id = Position.position_id where ROLE_ID = ? and RolePosi.SOFT_DEL = ? and Position.SOFT_DEL = ?';
    		var pstmtRolePosi = connection.prepareStatement(qryRolePosi);
    		pstmtRolePosi.setInteger(1,rsRole.getInteger(1));
    		pstmtRolePosi.setString(2,'0');
    		pstmtRolePosi.setString(3,'0');
    	    var rsRolePosi = pstmtRolePosi.executeQuery();
    	    var RolePositionArray = [];
    	    while (rsRolePosi.next()) {
    	        var records = {};
    	        records.POSITION_NAME = rsRolePosi.getString(3);
    	         records.ROLE_POS_ID = rsRolePosi.getInteger(1);
    	         records.POSITION_ID = rsRolePosi.getInteger(2);
    	         RolePositionArray.push(records);
    	    }
    	    record.RolePosition = RolePositionArray;
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

/*
 * Insert all  fields  roleId Id,location Id.
 * @Param {record} hold data in array [].
 * @Param [] output to put the data in it.
 * @return {output} Array  of MapRolePosition record.
 * @author Shriyansi.
 */

function addMapRolePosition() {

	var record;
	var Output = {
		results: []
	};

	var conn = $.db.getConnection();
	var roleId = $.request.parameters.get('roleId');
	var locationId = $.request.parameters.get('locationId');

	try {
		record = {};
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MAP_ROLE_POSITION"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, parseInt(roleId, 10));
		pstmtCallPro.setInteger(3, parseInt(locationId, 10));
		pstmtCallPro.setString(4, ' ');
		pstmtCallPro.setString(5, ' ');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, '');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'INSERT');
		pstmtCallPro.execute();
		var rsm = pstmtCallPro.getResultSet();
				conn.commit();
				if (rsm > 0) {
					record.status = 1;
					record.message = 'Data Uploaded Sucessfully';
				} else {
					record.status = 0;
					record.message = 'Data Uploaded Sucessfully';
				}

		Output.results.push(record);
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


/*
 * Update selected fields .
 * @Param {Integer} RoleIDEdit.
 * @Param {Integer} RoleNameIDEdit.
 * @Param {Integer}  RolePosIDEdit .
 * @Param {Integer}  SoftDel.
 * @return {output} Message display.
 * @author Shriyansi.
 */
function updateRolePosition() {

	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var RoleIDEdit = $.request.parameters.get('RoleIDEdit');
	var RoleNameIDEdit = $.request.parameters.get('RoleNameIDEdit');
	var RolePosIDEdit = $.request.parameters.get('RolePosIDEdit');
    var SoftDel = $.request.parameters.get('SoftDel');
    
	try {
		var UpdCallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MAP_ROLE_POSITION"(?,?,?,?,?,?,?,?,?);';
		var pstmtUpdCallPro = conn.prepareCall(UpdCallPro);
		pstmtUpdCallPro.setInteger(1, parseInt(RoleIDEdit, 10));
		pstmtUpdCallPro.setInteger(2, parseInt(RoleNameIDEdit, 10));
		pstmtUpdCallPro.setInteger(3, parseInt(RolePosIDEdit, 10));
		pstmtUpdCallPro.setString(4, SoftDel);
		pstmtUpdCallPro.setString(5, 'ADMIN');
		pstmtUpdCallPro.setString(6, dateFunction());
		pstmtUpdCallPro.setString(7, ' ');
		pstmtUpdCallPro.setString(8, dateFunction());
		pstmtUpdCallPro.setString(9, 'UPDATE');
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


/*
 * delete selected fields .
 * @Param {Integer} rolePosId.
 * @return {output} Message display.
 * @author Shriyansi.
 */
function deleteRolePosition() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var rolePosId = $.request.parameters.get('rolePosId');

	try {
		var DelCallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MAP_ROLE_POSITION"(?,?,?,?,?,?,?,?,?);';
		var pstmtDelCallPro = conn.prepareCall(DelCallPro);
		pstmtDelCallPro.setInteger(1, parseInt(rolePosId, 10));
		pstmtDelCallPro.setInteger(2, 0);
		pstmtDelCallPro.setInteger(3, 0);
		pstmtDelCallPro.setString(4, '1');
		pstmtDelCallPro.setString(5, 'ADMIN');
		pstmtDelCallPro.setString(6, dateFunction());
		pstmtDelCallPro.setString(7, ' ');
		pstmtDelCallPro.setString(8, dateFunction());
		pstmtDelCallPro.setString(9, 'DELETE');
		pstmtDelCallPro.execute();
		var rsDelCallPro = pstmtDelCallPro.getParameterMetaData();
		conn.commit();

		if (rsDelCallPro.getParameterCount() > 0) {
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

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "getMapRolePosition":
		getMapRolePosition();
		break;
	case "addMapRolePosition":
		addMapRolePosition();
		break;
	case "getMapRolePositions":
		getMapRolePositions();
		break;
	case "updateRolePosition":
		updateRolePosition();
		break;
	case "deleteRolePosition":
		deleteRolePosition();
		break;
	case "getRolePositions":
	    getRolePositions();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}