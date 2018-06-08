function dateFormat(record) {
	var date = record.CREATEDATE;
	if (date) {
		record.CREATEDATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
		return record.CREATEDATE;
	}
}

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
 * fetch Menu from menu master
 * @Param {} inputData.
 * @returns {output} resultset of Menu
 */

function fetchRole(inputData, connection) {
	var queryselectRole = 'select * from "MDB_DEV"."MST_ROLE" where SOFT_DEL is not null ';
	var whereClause = "";
	if (inputData.roleName !== '') {
		whereClause += " AND ROLE_NAME='" + inputData.roleName + "'";
	}
	queryselectRole += whereClause;
	var pstmtSelectRole = connection.prepareStatement(queryselectRole);
	var rsSelectRole = pstmtSelectRole.executeQuery();
	return rsSelectRole;
}

/**
 * To fetch role from role master on the behalf of roleName
 * @Param {String} countryCode for search
 * @Param [] output to put the data in it
 * @returns {output} Array of country record
 */
function getRole() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var roleId = $.request.parameters.get('roleId');
	try {
		var selectRoleCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ROLE"(?,?,?,?,?,?,?,?);';
		var pstmtCallPro = connection.prepareCall(selectRoleCallPro);
		pstmtCallPro.setInteger(1, parseInt(roleId, 10));
		pstmtCallPro.setString(2, ' ');
		pstmtCallPro.setInteger(3, 0);
		pstmtCallPro.setString(4, ' ');
		pstmtCallPro.setString(5, dateFunction());
		pstmtCallPro.setString(6, ' ');
		pstmtCallPro.setString(7, dateFunction());
		pstmtCallPro.setString(8, 'SELECT');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			var record = {};
			record.ROLEID = rCallPro.getString(1);
			record.ROLENAME = rCallPro.getString(2);
			record.SOFTDEL = rCallPro.getString(3);
			record.CREATEBY = rCallPro.getString(4);
			record.CREATEDATE = rCallPro.getString(5);
			record.MODIFIEDBY = rCallPro.getString(6);
			record.MODIFIEDDATE = rCallPro.getString(7);
			output.results.push(record);
		}
		connection.close();
	} catch (e) {
		connection.close();
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
 * To fetch All roles data
 * @Param {String} countryCode for search
 * @Param [] output to put the data in it
 * @returns {output} Array of country record
 */
function getRoles() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var selectRoleCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ROLE"(?,?,?,?,?,?,?,?);';
		var pstmtCallgetRoles = connection.prepareCall(selectRoleCallPro);
		pstmtCallgetRoles.setInteger(1, 0);
		pstmtCallgetRoles.setString(2, 'null');
		pstmtCallgetRoles.setInteger(3, 0);
		pstmtCallgetRoles.setString(4, ' ');
		pstmtCallgetRoles.setString(5, dateFunction());
		pstmtCallgetRoles.setString(6, ' ');
		pstmtCallgetRoles.setString(7, dateFunction());
		pstmtCallgetRoles.setString(8, 'SELECTROLES');
		pstmtCallgetRoles.execute();
		var rCallgetRoles = pstmtCallgetRoles.getResultSet();
		connection.commit();
		while (rCallgetRoles.next()) {
			var record = {};
			record.ROLEID = rCallgetRoles.getString(1);
			record.ROLENAME = rCallgetRoles.getString(2);
			record.SOFT_DEL = rCallgetRoles.getString(3);
			record.CREATEBY = rCallgetRoles.getString(4);
			record.CREATEDATE = rCallgetRoles.getString(5);
			record.MODIFIEDBY = rCallgetRoles.getString(6);
			record.MODIFIEDDATE = rCallgetRoles.getString(7);
			dateFormat(record);
			checkStatusDescription(record);
			output.results.push(record);
		}
		connection.close();
	} catch (e) {
		connection.close();
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

function addRole(inputData, connection, record) {

	var CalladdRole = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ROLE"(?,?,?,?,?,?,?,?);';
	var pstmtCalladdRole = connection.prepareCall(CalladdRole);
	pstmtCalladdRole.setInteger(1, 0);
	pstmtCalladdRole.setString(2, inputData.roleName);
	pstmtCalladdRole.setString(3, '0');
	pstmtCalladdRole.setString(4, inputData.createby);
	pstmtCalladdRole.setString(5, dateFunction());
	pstmtCalladdRole.setString(6, '');
	pstmtCalladdRole.setString(7, dateFunction());
	pstmtCalladdRole.setString(8, 'INSERT');
	pstmtCalladdRole.execute();
	var r = pstmtCalladdRole.getParameterMetaData();
		connection.commit();
	if (r.getParameterCount() > 0) {
		record.status = 1;
		record.Message = "Record Successfully inserted";
	} else {
		record.status = 0;
		record.Message = "Record Successfully  not inserted!!! Kindly contact Admin.";
	}

}

function updateRole() {
	var Output = {
		results: []
	};
	var record = {};
	var connection = $.db.getConnection();
	var editRoleId = $.request.parameters.get('editRoleId');
	var editRoleName = $.request.parameters.get('editRoleName');
	var editStatus = $.request.parameters.get('editStatus');
	var modifyby = $.request.parameters.get('modifyby');
	try {
		var UpdCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ROLE"(?,?,?,?,?,?,?,?);';
		var pstmtUpdCallupdateRole = connection.prepareCall(UpdCallPro);
		pstmtUpdCallupdateRole.setInteger(1, parseInt(editRoleId, 10));
		pstmtUpdCallupdateRole.setString(2, editRoleName);
		pstmtUpdCallupdateRole.setString(3, editStatus);
		pstmtUpdCallupdateRole.setString(4, 'ADMIN');
		pstmtUpdCallupdateRole.setString(5, dateFunction());
		pstmtUpdCallupdateRole.setString(6, modifyby);
		pstmtUpdCallupdateRole.setString(7, dateFunction());
		pstmtUpdCallupdateRole.setString(8, 'UPDATE');

		pstmtUpdCallupdateRole.execute();
		var rsUpdCallupdateRole = pstmtUpdCallupdateRole.getParameterMetaData();
		connection.commit();
		if (rsUpdCallupdateRole.getParameterCount() > 0) {
			record.status = 0;
			record.message = 'Successfully Updated Role Data';
			Output.results.push(record);
		} else {
			record.status = 1;
			record.message = 'Failed to update Role Data.Kindly contact to admin!!!';
			Output.results.push(record);
		}
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

function deleteRole() {
	var Output = {
		results: []

	};
	var record = {};
	var connection = $.db.getConnection();
	var deleteRoleId = $.request.parameters.get('deleteRoleId');
	try {
		var UpdCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ROLE"(?,?,?,?,?,?,?,?);';
		var pstmtdeleteRole = connection.prepareCall(UpdCallPro);
		pstmtdeleteRole.setInteger(1, parseInt(deleteRoleId, 10));
		pstmtdeleteRole.setString(2, ' ');
		pstmtdeleteRole.setString(3, '1');
		pstmtdeleteRole.setString(4, 'ADMIN');
		pstmtdeleteRole.setString(5, dateFunction());
		pstmtdeleteRole.setString(6, ' ');
		pstmtdeleteRole.setString(7, dateFunction());
		pstmtdeleteRole.setString(8, 'DELETE');
		pstmtdeleteRole.execute();
		var rsdeleteRole = pstmtdeleteRole.getParameterMetaData();
		connection.commit();
		if (rsdeleteRole.getParameterCount() > 0) {
			record.status = 0;
			record.message = 'Success';
			Output.results.push(record);
		} else {
			record.status = 1;
			record.message = 'failed';
			Output.results.push(record);
		}
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

function validateRole() {

	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var inputData = {};
	var roleName = $.request.parameters.get('roleName');
	var createby = $.request.parameters.get('createby');
	inputData.roleName = roleName;
    inputData.createby = createby;
	try {
		var record = {};
		var rsRoleValidation = fetchRole(inputData, connection);
		if (rsRoleValidation.next()) {
			var softDel = rsRoleValidation.getString(3);
			if (softDel === "0") {
				record.status = 1;
				record.Message = "Role name already present in our System!!! Kindly add another role name";

			} else {
				record.status = 1;
				record.Message = "Role name is inactive in our System!!! Kindly use edit functionality to activate it.";
			}
		} else {
			addRole(inputData, connection, record);
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

	case "getRole":
		getRole();
		break;
	case "getRoles":
		getRoles();
		break;
	case "addRole":
		addRole();
		break;
	case "updateRole":
		updateRole();
		break;
	case "deleteRole":
		deleteRole();
		break;
	case "validateRole":
		validateRole();
		break;

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}