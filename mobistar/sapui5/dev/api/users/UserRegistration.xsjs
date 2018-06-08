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

/*
 * To fetch All user Registration data.
 * @Param [] output to put the data in it
 * @return {output} Array of user registration record
 * @author laxmi
 */

function getUserRegistrations() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::USER_REGISTRATION"(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, 'null');
		pstmtCallPro.setString(2, 'null');
		pstmtCallPro.setString(3, 'null');
		pstmtCallPro.setString(4, 'null');
		pstmtCallPro.setString(7, 'null');
		pstmtCallPro.setInteger(5, 0);
		pstmtCallPro.setInteger(6, 0);
		pstmtCallPro.setString(8, '0');
		pstmtCallPro.setInteger(9, 0);
		pstmtCallPro.setString(10, 'ADMIN');
		pstmtCallPro.setString(11, dateFunction());
		pstmtCallPro.setString(12, ' ');
		pstmtCallPro.setString(13, dateFunction());
		pstmtCallPro.setString(14, 'SELECT');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			var record = {};
			record.USER_CODE = rCallPro.getString(1);
			record.PASSWORD = rCallPro.getString(2);
			record.LOGIN_NAME = rCallPro.getString(3);
			record.USER_TYPE = rCallPro.getString(4);
			record.LEVEL_ID = rCallPro.getInteger(5);
			record.POSITION_ID = rCallPro.getInteger(6);
			record.STATUS = rCallPro.getString(7);
			record.SOFT_DEL = rCallPro.getString(8);
			record.CREATE_BY = rCallPro.getString(9);
			record.CREATE_DATE = rCallPro.getString(10);
			record.MODIFIED_BY = rCallPro.getString(11);
			record.MODIFIED_DATE = rCallPro.getString(12);
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

function checkMenuVisibility(record, output) {
	if (record.MenuName === "Master") {
		record.MasterVisible = true;
		record.MasterMenuName = record.MenuName;
	} else if (record.MenuName === "Configuration") {
		record.ConfigurationVisible = true;
		record.ConfigurationMenuName = record.MenuName;
	} else if (record.MenuName === "User") {
		record.UserVisible = true;
		record.UserMenuName = record.MenuName;
	} else if (record.MenuName === "Sales") {
		record.SalesVisible = true;
		record.SalesMenuName = record.MenuName;
	} else if (record.MenuName === "Reports") {
		record.ReportsVisible = true;
		record.ReportsMenuName = record.MenuName;
	}
}

function getEmpAuthDetail(record, output) {
	var connection = $.db.getConnection();
	var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::UserAuthDetail"(?,?,?)';
	var pstmtCallPro = connection.prepareCall(CallPro);
	pstmtCallPro.setString(1, record.USER_CODE);
	pstmtCallPro.setString(2, 'null');
	pstmtCallPro.setString(3, 'EmpEligibleMenu');
	pstmtCallPro.execute();
	var rCallPro = pstmtCallPro.getResultSet();
	connection.commit();
	while (rCallPro.next()) {
		record.MenuName = rCallPro.getString(1);
		checkMenuVisibility(record, output);
	}
	if (record.MasterVisible === undefined) {
		record.MasterVisible = false;
	}
	if (record.ConfigurationVisible === undefined) {
		record.ConfigurationVisible = false;
	}
	if (record.UserVisible === undefined) {
		record.UserVisible = false;
	}
	if (record.SalesVisible === undefined) {
		record.SalesVisible = false;
	}
	if (record.ReportsVisible === undefined) {
		record.ReportsVisible = false;
	}
	output.results.push(record);
	connection.close();
}

function getUserConfiguration() {
	var output = {
		navigation: []
	};
	var record = {};
	var userId = $.request.parameters.get('userId');
	var menuName = $.request.parameters.get('menuName');
	var connection = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::UserAuthDetail"(?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, userId);
		pstmtCallPro.setString(2, menuName);
		pstmtCallPro.setString(3, 'UserConfiguration');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			record = {};
			record.title = rCallPro.getString(1);
			record.icon = rCallPro.getString(3);
			record.expanded = false;
			record.key = rCallPro.getString(2);
			record.items = [];
			record.UserId = userId;
			output.navigation.push(record);
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

function checkVisibilityAttribute(record) {
	if (record.AttributeName === "CREATE") {
		record.CreateVisible = true;
	} else if (record.AttributeName === "DELETE") {
		record.DeleteVisible = true;
	} else if (record.AttributeName === "VIEW") {
		record.ViewVisible = true;
	} else if (record.AttributeName === "SEARCH") {
		record.SearchVisible = true;
	} else if (record.AttributeName === "PRINT") {
		record.PrintVisible = true;
	} else if (record.AttributeName === "EDIT") {
		record.EditVisible = true;
	}
}

function getUserConfigurationAttribute() {
	var output = {
		results: []
	};
	var record = {};
	var userId = $.request.parameters.get('userId');
	var subMenuName = $.request.parameters.get('subMenuName');
	var connection = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::UserAuthDetail"(?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, userId);
		pstmtCallPro.setString(2, subMenuName);
		pstmtCallPro.setString(3, 'UserConfigurationAttribute');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		record = {};
		while (rCallPro.next()) {
			record.AttributeID = rCallPro.getString(2);
			record.AttributeName = rCallPro.getString(1);
			checkVisibilityAttribute(record);
		}
		if (record.CreateVisible === undefined) {
			record.CreateVisible = false;
		}
		if (record.DeleteVisible === undefined) {
			record.DeleteVisible = false;
		}
		if (record.ViewVisible === undefined) {
			record.ViewVisible = false;
		}
		if (record.EditVisible === undefined) {
			record.EditVisible = false;
		}
		if (record.SearchVisible === undefined) {
			record.SearchVisible = false;
		}
		if (record.PrintVisible === undefined) {
			record.PrintVisible = false;
		}
		output.results.push(record);
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

function getAuthTiles(record, output) {
	var connection = $.db.getConnection();
	var TileArr = [];
	var records = {};
	var GUID = 1;
	if (record.USER_TYPE === 'DSTB') {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::UserAuthDetail"(?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, record.USER_TYPE);
		pstmtCallPro.setString(2, 'null');
		pstmtCallPro.setString(3, 'UserConfigurationMenuCust');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			records = {};
			records.GUID = GUID++;
			records.MenuId = rCallPro.getString(1);
			records.MenuName = rCallPro.getString(2);
			records.HEADER = rCallPro.getString(3);
			records.SUBHEADER = rCallPro.getString(4);
			records.FRAMETYPE = rCallPro.getString(5);
			records.IMAGE = rCallPro.getString(6);
			records.FOOTER = rCallPro.getString(7);
			records.TILE_TYPE = rCallPro.getString(8);
			records.pres = rCallPro.getString(9);
			records.PRESS = "this." + records.pres + "()";
			TileArr.push(records);
		}
		record.Tiles = TileArr;
		output.results.push(record);
		connection.close();
		return output;
	} else {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::UserAuthDetail"(?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, record.USER_CODE);
		pstmtCallPro.setString(2, 'null');
		pstmtCallPro.setString(3, 'UserConfigurationMenu');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			records = {};
			records.GUID = GUID++;
			records.MenuId = rCallPro.getString(1);
			records.MenuName = rCallPro.getString(2);
			records.HEADER = rCallPro.getString(3);
			records.SUBHEADER = rCallPro.getString(4);
			records.FRAMETYPE = rCallPro.getString(5);
			records.IMAGE = rCallPro.getString(6);
			records.FOOTER = rCallPro.getString(7);
			records.TILE_TYPE = rCallPro.getString(8);
			records.pres = rCallPro.getString(9);
			records.PRESS = "this." + records.pres + "()";
			TileArr.push(records);
		}
		record.Tiles = TileArr;
		output.results.push(record);
		connection.close();
		return output;
	}
}

function getUserAndPassword() {
	var output = {
		results: []
	};
	var conn = $.db.getConnection();
	var loginDictarray = $.request.parameters.get('loginArray');
	var loginDict =  JSON.parse(loginDictarray);

	try {
		var query = 'select * from "MDB_DEV"."USER_REGISTRATION" where USER_CODE=? and PASSWORD=?';
		var pstmt = conn.prepareStatement(query);
		pstmt.setString(1, loginDict.UserId);
		pstmt.setString(2,loginDict.Pass);
		var rs = pstmt.executeQuery();
		conn.commit();
		if (rs.next()) {
			var record = {};
			record.USER_CODE = rs.getString(1);
			record.PASSWORD = rs.getString(2);
			record.LOGIN_NAME = rs.getString(3);
			record.USER_TYPE = rs.getString(4);
			record.LEVEL_ID = rs.getInteger(5);
			record.POSITION_ID = rs.getInteger(6);
			record.STATUS = rs.getString(7);
			record.CHANGE_PASSWORD = rs.getInteger(8);
			record.SOFT_DEL = rs.getString(9);
			record.CREATE_BY = rs.getString(10);
			record.CREATE_DATE = rs.getString(11);
			record.MODIFIED_BY = rs.getString(12);
			record.MODIFIED_DATE = rs.getString(13);
			record.status = '1';
			getAuthTiles(record, output);
			/*if (record.USER_TYPE === 'Employee') {
			getEmpAuthDetail(record, output);
			}*/
		} else {
			record = {};
			record.message = "Please enter correct User Id and Password.";
			record.status = '0';
			output.results.push(record);
		}
		conn.close();
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

function getUserDetails(record, userId) {
	var connection = $.db.getConnection();
	var queryUser = 'select PASSWORD,CHANGE_PASSWORD from "MDB_DEV"."USER_REGISTRATION" where USER_CODE = ? ';
	var pstmtUser = connection.prepareStatement(queryUser);
	pstmtUser.setString(1, userId);
	var rUser = pstmtUser.executeQuery();
	if (rUser.next()) {
		record.PASSWORD = rUser.getString(1);
		record.CHANGE_PASSWORD = rUser.getInteger(2);
	}
	return record;
}

function changePassword() {
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var changePass = $.request.parameters.get('changePass');
	var userId = $.request.parameters.get('userId');
	var record = {};
	try {
		getUserDetails(record, userId);
		var qryChangePass = 'update "MDB_DEV"."USER_REGISTRATION" set CHANGE_PASSWORD=? , PASSWORD = ? where USER_CODE=?';
		var pstmtChangePass = connection.prepareStatement(qryChangePass);
		pstmtChangePass.setInteger(1, record.CHANGE_PASSWORD + 1);
		pstmtChangePass.setString(2, changePass);
		pstmtChangePass.setString(3, userId);
		var rsChangePass = pstmtChangePass.executeUpdate();
		connection.commit();
		if (rsChangePass > 0) {
			record.status = '0';
			record.message = 'Change your Password successfully';
		} else {
			record.status = '1';
			record.message = 'failed to Change your Password!!! ';
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

function getEmployeeRole(dicLine) {
	var conn = $.db.getConnection();
	var query = ' select EM.EMPLOYEE_CODE,RO.ROLE_NAME from "MDB_DEV"."MST_EMPLOYEE" as EM ' +
		' inner join "MDB_DEV"."MAP_ROLE_POSITION" as RP on EM.ROLE_POSITION_ID = RP.ROLE_POS_ID ' +
		' inner join "MDB_DEV"."MST_ROLE" as RO on RP.ROLE_ID = RO.ROLE_ID where EM.EMPLOYEE_CODE = ?';
	var pstmt = conn.prepareStatement(query);
	pstmt.setString(1, dicLine.UserId);
	var rs = pstmt.executeQuery();
	conn.commit();
	if (rs.next() > 0) {
		dicLine.UserType = rs.getString(2);
	}
	return dicLine;
}

function addUserRegistration() {

	var record;
	var Output = {
		results: []
	};

	var conn = $.db.getConnection();
	var datasLine = $.request.parameters.get('LineData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				var queryCheckUser = 'select * from "MDB_DEV"."USER_REGISTRATION" where USER_CODE = ?';
				var pstmtCheckUser = conn.prepareStatement(queryCheckUser);
				pstmtCheckUser.setString(1, dicLine.UserId);
				var rsCheckUser = pstmtCheckUser.executeQuery();
				conn.commit();
				if (rsCheckUser.next() > 0) {
					record.status = 1;
					record.message = dicLine.UserId + 'user Allready register';
				} else {
					getEmployeeRole(dicLine);
					var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::USER_REGISTRATION"(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
					var pstmtCallPro = conn.prepareCall(CallPro);
					pstmtCallPro.setString(1, dicLine.UserId);
					pstmtCallPro.setString(2, dicLine.Password);
					pstmtCallPro.setString(3, dicLine.UserName);
					pstmtCallPro.setString(4, dicLine.UserType);
					pstmtCallPro.setInteger(5, parseInt(dicLine.level, 10));
					pstmtCallPro.setInteger(6, parseInt(dicLine.Position, 10));
					pstmtCallPro.setString(7, dicLine.Status);
					pstmtCallPro.setInteger(8, 1);
					pstmtCallPro.setString(9, '0');
					pstmtCallPro.setString(10, 'ADMIN');
					pstmtCallPro.setString(11, dateFunction());
					pstmtCallPro.setString(12, 'null');
					pstmtCallPro.setString(13, dateFunction());
					pstmtCallPro.setString(14, 'INSERT');
					pstmtCallPro.execute();
					var rsm = pstmtCallPro.getParameterMetaData();
					conn.commit();
					if (rsm.getParameterCount() > 0) {
						record.status = 1;
						record.message = 'Data Uploaded Sucessfully';
					} else {
						record.status = 0;
						record.message = 'Some Issues!';
					}
				}
			}
			Output.results.push(record);
			conn.close();
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

	case "getUSER_REGISTRATION":
		getUserRegistrations();
		break;
	case "addUSER_REGISTRATION":
		addUserRegistration();
		break;
	case "getUserAndPassword":
		getUserAndPassword();
		break;
	case "getUserConfiguration":
		getUserConfiguration();
		break;
	case "getUserConfigurationAttribute":
		getUserConfigurationAttribute();
		break;
	case "changePassword":
		changePassword();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}