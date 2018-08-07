/**
 * To get the current date in db format.
 * @return {String} yyyymmddp  .
 * @author laxmi
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

/*
 * To fetch Status Desc behalf of Status Id.
 * @Param {Integer} Status in record {}.
 * @Param record is dictionary that's hold Status
 * @return {record} in that put StatusDesc.
 * @author laxmi
 */

function getStatusDesc(record) {
	var connection = $.db.getConnection();
	if (record.Status !== undefined && record.Status !== null && record.Status !== '') {
		var queryStatus = 'select STATUS_CODE,STATUS_DESC from "MDB_DEV"."MST_STATUS" where STATUS_CODE = ?';
		var pstmtStatus = connection.prepareStatement(queryStatus);
		pstmtStatus.setInteger(1, record.Status);
		var rStatus = pstmtStatus.executeQuery();
		connection.commit();
		while (rStatus.next()) {
			record.ID = rStatus.getInteger(1);
			record.StatusDesc = rStatus.getString(2);
		}
		connection.close();
	}
	return record;
}

/*function getRolePositionValue(record){
    var connection = $.db.getConnection();
    var query;
    switch (record.POSITION_ID_NAME) {
			case "AREA":
				query = 'Select AREA_NAME from "MDB_DEV"."MST_AREA" where AREA_CODE=?';
				break;
			case "DISTRICT":
				query = ' Select DISTRICT_NAME from "MDB_DEV"."MST_DISTRICT" where DISTRICT_CODE = ? ';
				break;
			case "STATE":
				query = ' Select STATE_NAME from "MDB_DEV"."MST_STATE" where STATE_CODE = ? ';
				break;
			case "REGION":
				query = ' Select REGION_NAME from "MDB_DEV"."MST_REGION" where REGION_CODE = ? ';
				break;
			case "COUNTRY":
				query = ' Select COUNTRY_NAME from "MDB_DEV"."MST_COUNTRY" where COUNTRY_CODE = ? ';
				break;

			default:
				return;
		}
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, record.POSITION_ID);
		var rS = pstmt.executeQuery();
		connection.commit();
		while (rS.next()) {
			record.PositionValue = rS.getString(1);
	}
		connection.close();
	return record;
}*/
/*
 * MODIFIED BY SATISH FOR CHANGE IN POSITION NAME
 */
function getRolePositionValue(record) {
	var connection = $.db.getConnection();
	var query;
	switch (record.POSITION_ID_NAME) {
		case "AREA":
			query = 'Select AREA_NAME from "MDB_DEV"."MST_AREA" where AREA_CODE=?';
			break;
		case "BRANCH":
			query = ' Select DISTRICT_NAME from "MDB_DEV"."MST_DISTRICT" where DISTRICT_CODE = ? ';
			break;
		case "REGION":

			query = 'Select REGIONAL_NAME from "MDB_DEV"."MST_REGIONAL" where REGIONAL_CODE = ?';
			//' Select STATE_NAME from "MDB_DEV"."MST_STATE" where STATE_CODE = ? ';
			break;
		case "ZONE":
			query = ' Select REGION_NAME from "MDB_DEV"."MST_REGION" where REGION_CODE = ? ';
			break;
		case "COUNTRY":
			query = ' Select COUNTRY_NAME from "MDB_DEV"."MST_COUNTRY" where COUNTRY_CODE = ? ';
			break;

		default:
			return;
	}
	var pstmt = connection.prepareStatement(query);
	pstmt.setString(1, record.POSITION_ID);
	var rS = pstmt.executeQuery();
	connection.commit();
	while (rS.next()) {
		record.PositionValue = rS.getString(1);
	}
	connection.close();
	return record;
}

/*
 * To fetch Employees data.
 * @Param [] output to put the data in it
 * @return {output} Array of Employees record
 * @author laxmi
 */

function getEmployees() {
	var output = {
		results: []
	};
	var Connection = $.db.getConnection();
	try {
		var CallProGetEmp = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_EMPLOYEE"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var pstmtGetEmp = Connection.prepareCall(CallProGetEmp);
		pstmtGetEmp.setInteger(1, 0);
		pstmtGetEmp.setString(2, 'null');
		pstmtGetEmp.setString(3, 'null');
		pstmtGetEmp.setString(4, 'null');
		pstmtGetEmp.setString(5, 'null');
		pstmtGetEmp.setString(6, 'null');
		pstmtGetEmp.setString(7, 'null');
		pstmtGetEmp.setString(8, 'null');
		pstmtGetEmp.setString(9, 'null');
		pstmtGetEmp.setString(10, 'null');
		pstmtGetEmp.setInteger(11, 0);
		pstmtGetEmp.setString(12, '0');
		pstmtGetEmp.setString(13, '0');
		pstmtGetEmp.setString(14, dateFunction());
		pstmtGetEmp.setString(15, dateFunction());
		pstmtGetEmp.setString(16, '0');
		pstmtGetEmp.setString(17, '');
		pstmtGetEmp.setString(18, dateFunction());
		pstmtGetEmp.setString(19, '');
		pstmtGetEmp.setString(20, dateFunction());
		pstmtGetEmp.setString(21, 'SELECT');
		pstmtGetEmp.execute();
		var rGetEmp = pstmtGetEmp.getResultSet();
		Connection.commit();
		while (rGetEmp.next()) {
			var record = {};
			record.CODE = rGetEmp.getString(1);
			record.NAME = rGetEmp.getString(2);
			record.ADDRESS1 = rGetEmp.getString(3);
			record.ADDRESS2 = rGetEmp.getString(4);
			record.COUNTRY = rGetEmp.getString(5);
			record.STATE = rGetEmp.getString(6);
			record.DISTRICT = rGetEmp.getString(7);
			record.PHONE_NUMBER = rGetEmp.getString(8);
			record.EMAIL = rGetEmp.getString(9);
			record.ROLE_ID = rGetEmp.getString(10);
			record.POSITION_ID = rGetEmp.getString(11);
			record.Status = rGetEmp.getInteger(12);
			record.ROLE_ID_NAME = rGetEmp.getString(15);
			record.POSITION_ID_NAME = rGetEmp.getString(16);
			//record.Status = rGetEmp.getInteger(12);
			record.UserType = "Employee";
			getRolePositionValue(record);
			getStatusDesc(record);
			output.results.push(record);
		}

		Connection.close();
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
function getRegional(){
    var output = {
		results: []
	};
	var RegionCode = $.request.parameters.get('RegionCode');
    var connection = $.db.getConnection();
    var query = 'select MRL.REGIONAL_CODE,MRL.REGIONAL_NAME from "MDB_DEV"."MST_REGIONAL" as MRL where MRL.ZONE_CODE=?';
    var pstmt = connection.prepareStatement(query);
	pstmt.setString(1, RegionCode);
	var rS = pstmt.executeQuery();
	connection.commit();
	while (rS.next()) {
	    var data = {};
	    data.REGIONAL_CODE = rS.getString(1);
        		data.REGIONAL_NAME = rS.getString(2);
        		output.results.push(data);
	}
	connection.close();
		var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}
function getRegion(record) {
	var connection = $.db.getConnection();
	var query,arr = [],arrRegion = [];
	switch (record.POSITION_NAME) {
		case "AREA":
			query = 'select ms.REGIONCODE,MR.REGION_NAME,MRL.REGIONAL_CODE,MRL.REGIONAL_NAME from "MDB_DEV"."MST_AREA" as MA ' +
				' inner join "MDB_DEV"."MST_DISTRICT" as MD on MA.DISTRICT_CODE = MD.DISTRICT_CODE ' +
				' inner join "MDB_DEV"."STATESDATA" as ms on MD.STATE_CODE = ms.STATE_CODE ' +
				' inner join "MDB_DEV"."MST_REGIONAL" as MRL on  MD.REGIONAL_CODE = MRL.REGIONAL_CODE ' +
				' inner join "MDB_DEV"."MST_REGION" as MR on  ms.REGIONCODE = MR.REGION_CODE ' + ' where MA.AREA_CODE = ?';			
			break;
		case "BRANCH":
			query = 'select ms.REGIONCODE,MR.REGION_NAME,MRL.REGIONAL_CODE,MRL.REGIONAL_NAME from "MDB_DEV"."MST_DISTRICT" as MD ' +
				' inner join "MDB_DEV"."STATESDATA" as ms on MD.STATE_CODE = ms.STATE_CODE ' +
				' inner join "MDB_DEV"."MST_REGIONAL" as MRL on  MD.REGIONAL_CODE = MRL.REGIONAL_CODE ' +
				' inner join "MDB_DEV"."MST_REGION" as MR on  ms.REGIONCODE = MR.REGION_CODE ' + ' where MD.DISTRICT_CODE = ?';			
			break;	
		case "REGION":
			query = 'select MRL.REGIONAL_CODE,MR.REGION_NAME,MRL.REGIONAL_CODE,MRL.REGIONAL_NAME from "MDB_DEV"."MST_REGIONAL" as MRL ' +
				' inner join "MDB_DEV"."MST_REGION" as MR on  MRL.ZONE_CODE = MR.REGION_CODE ' + ' where MRL.REGIONAL_CODE = ?';			
			break;
		case "ZONE":
			query = 'select MR.REGION_CODE,MR.REGION_NAME,MRL.REGIONAL_CODE,MRL.REGIONAL_NAME from "MDB_DEV"."MST_REGION" as MR inner join "MDB_DEV"."MST_REGIONAL" as MRL on MR.REGION_CODE = MRL.ZONE_CODE  where MR.REGION_CODE = ?';			
			break;	
		case "COUNTRY":
			query = 'select distinct MR.REGION_CODE,MR.REGION_NAME from "MDB_DEV"."MST_REGION" as MR  where MR.COUNTRY_CODE = ?';			
			break;		
		default:
	}
	var pstmt = connection.prepareStatement(query);
	pstmt.setString(1, record.POSITION_ID);
	var rS = pstmt.executeQuery();
	connection.commit();
	while (rS.next()) {
	    var records = {};
		record.REGION_CODE = rS.getString(1);
		record.REGION = rS.getString(2);
		if(record.POSITION_NAME === "COUNTRY"){
        		records.REGION_CODE = rS.getString(1);
        		records.REGION = rS.getString(2);
        		arrRegion.push(records);
        		record.REGION = arrRegion;
        		//getRegional(record,records);
		}else{
		        if(arrRegion.length > 0){
		            for(var i = 0 ;i < arrRegion.length; i++){
		            if(record.REGION_CODE !== arrRegion[i].REGION_CODE ){
		                records.REGION_CODE = rS.getString(1);
        		        records.REGION = rS.getString(2);
        		        arrRegion.push(records);
		            }
		        }
		        }else{
		            records.REGION_CODE = rS.getString(1);
        		        records.REGION = rS.getString(2);
        		        arrRegion.push(records);
		        }
        		records = {};
        		records.REGIONAL_CODE = rS.getString(3);
        		records.REGIONAL_NAME = rS.getString(4);
        		arr.push(records);
        		record.REGIONAL = arr;
        		record.REGION = arrRegion;
		}
	//	return;
	}
	
	connection.close();
	return;
}

/*
 * To fetch Employee behalf of CustCode.
 * @Param {String} EmployeeCode.
 * @Param [] output to put the data in it
 * @return {output} Array of Employee record
 * @author laxmi
 */

function getEmployee() {
	var output = {
		results: []
	};
	var Connection = $.db.getConnection();
	var EmployeeCode = $.request.parameters.get('EmployeeCode');

	try {
		var queryEmployee =
			'select MSE.EMPLOYEE_ID,MSE.EMPLOYEE_CODE,MSE.EMPLOYEE_NAME,MSE.ADDRESS1,MSE.ADDRESS2,MSE.COUNTRY,MSE.STATE,MSE.DISTRICT ' +
			' ,MSE.PHONE_NUMBER,MSE.EMAIL,MSE.ROLE_POSITION_ID,MSE.POSITION_VALUE_ID,MSE.STATUS,MP.POSITION_NAME from "MDB_DEV"."MST_EMPLOYEE" as MSE inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on MSE.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID where EMPLOYEE_CODE = ? and MSE.SOFT_DEL=?';
		/*'select MSE.EMPLOYEE_ID,MSE.EMPLOYEE_CODE,MSE.EMPLOYEE_NAME,MSE.ADDRESS1,MSE.ADDRESS2,MSE.COUNTRY,MSE.STATE,MSE.DISTRICT,MSE.PHONE_NUMBER,MSE.EMAIL,MSE.ROLE_POSITION_ID,MSE.POSITION_VALUE_ID,MSE.STATUS,MS.REGIONCODE,MR.REGION_NAME ' +
			' from "MDB_DEV"."MST_EMPLOYEE" as MSE inner join "MDB_DEV"."STATESDATA" as ms on MSE.STATE = ms.STATE_CODE  inner join "MDB_DEV"."MST_REGION" as MR on  ms.REGIONCODE = MR.REGION_CODE ' +
			' where EMPLOYEE_CODE = ? and MSE.SOFT_DEL=?';*/
		/*var queryEmployee = 'select MSE.EMPLOYEE_ID,MSE.EMPLOYEE_CODE,MSE.EMPLOYEE_NAME,MSE.ADDRESS1,MSE.ADDRESS2,MSE.COUNTRY,MSE.STATE,MSE.DISTRICT,MSE.PHONE_NUMBER,MSE.EMAIL,MSE.ROLE_POSITION_ID,MSE.POSITION_VALUE_ID,MSE.STATUS,MS.REGIONCODE,MR.REGION_NAME ' 
+ ' from "MDB_DEV"."MST_EMPLOYEE" as MSE '
+ ' inner join "MDB_DEV"."MST_AREA" as MA on MSE.POSITION_VALUE_ID = MA.AREA_CODE '
+ ' inner join "MDB_DEV"."STATESDATA" as ms on MSE.STATE = ms.STATE_CODE '
+ ' inner join "MDB_DEV"."DISTRICT_DATA" as md on MSE.DISTRICT = md.DISTRICT_CODE'

+ ' inner join "MDB_DEV"."MST_REGION" as MR on  ms.REGIONCODE = MR.REGION_CODE '
+ ' where MSE.EMPLOYEE_CODE = ? and MSE.SOFT_DEL=?';*/
		var pstmtEmployee = Connection.prepareStatement(queryEmployee);
		pstmtEmployee.setString(1, EmployeeCode);
		pstmtEmployee.setString(2, '0');
		var rEmployee = pstmtEmployee.executeQuery();
		Connection.commit();
		while (rEmployee.next()) {
			var record = {};
			record.ID = rEmployee.getString(1);
			record.CODE = rEmployee.getString(2);
			record.NAME = rEmployee.getString(3);
			record.ADDRESS1 = rEmployee.getString(4);
			record.ADDRESS2 = rEmployee.getString(5);
			record.COUNTRY = rEmployee.getString(6);
			record.STATE = rEmployee.getString(7);
			record.DISTRICT = rEmployee.getString(8);
			record.PHONE_NUMBER = rEmployee.getString(9);
			record.EMAIL = rEmployee.getString(10);
			record.ROLE_ID = rEmployee.getString(11);
			record.POSITION_ID = rEmployee.getString(12);
			record.Status = rEmployee.getInteger(13);
			record.POSITION_NAME = rEmployee.getString(14);
			getRegion(record);
			//record.REGION_CODE = rEmployee.getString(14);
			//record.REGION = rEmployee.getString(15);
			record.UserType = "Employee";
			getStatusDesc(record);
			output.results.push(record);
		}

		Connection.close();
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
 * To fetch Emp Code in EmpRange.
 * @Param {} record to put the data in it
 * @author laxmi
 */

function getGenerateEMPCode(record) {
	var today = new Date();
	var yyyy = today.getFullYear();
	record = {};
	var Connection = $.db.getConnection();
	var queryRange = 'select ID,name from "MDB_DEV"."EMP_RANGE"';
	var pstmtRange = Connection.prepareStatement(queryRange);
	var rrange = pstmtRange.executeQuery();
	Connection.commit();
	while (rrange.next()) {
		record.ID = rrange.getInteger(1);
		record.name = rrange.getString(2);
	}
	record.EmpNO = record.name + (record.ID).toString() + yyyy;
	Connection.close();
	return record;
}

/*
 * Use to update Emp Code in EmpRange.
 * @Param {} record holds status id , value and name
 * @output return in record
 * @author laxmi
 */

function updateEmpNo(record) {
	var Connection = $.db.getConnection();
	var id = parseInt(record.ID, 10);
	id = id + 1;
	var queryUpdateEmpRange = 'UPDATE "MDB_DEV"."EMP_RANGE" SET ID = ?,value = ? WHERE name = ?';
	var pstmtUpdateEmpRange = Connection.prepareStatement(queryUpdateEmpRange);
	pstmtUpdateEmpRange.setInteger(1, id);
	pstmtUpdateEmpRange.setString(2, record.EmpNO);
	pstmtUpdateEmpRange.setString(3, record.name);
	var rUpdateEmpRange = pstmtUpdateEmpRange.executeUpdate();
	Connection.commit();
	if (rUpdateEmpRange > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	}
}
/*
 * Validate EmailId,RolePosition Id and Position Value combination and status .
 * and check record is already insert or not.
 * @Param {dicLine} hold data in Object.
 * return true or false and update the record
 * @author satish
 */
function validateEmployee(dicLine, connection, record) {
	var qryEMPValEMAIL = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::CheckEmail"(?)';
	//'select  EMAIL from "MDB_DEV"."MST_EMPLOYEE" where EMAIL=? AND STATUS!=?';
	var pstmtEMPValEMAIL = connection.prepareCall(qryEMPValEMAIL);
	var lowercaseEmail = dicLine.EMAIL.toLowerCase();
	pstmtEMPValEMAIL.setString(1, lowercaseEmail);
	pstmtEMPValEMAIL.execute();
	var rsEMPValEMAIL = pstmtEMPValEMAIL.getResultSet();
	if (rsEMPValEMAIL.next()) {
		record.status = 0;
		record.message = 'EMAIL ID [' + dicLine.EMAIL + '] already exist in our System!!! Kindly use another EMAIL.';
		return false;
	}
	var qryEMPValRolePositionCombo =
		'select POSITION_VALUE_ID  from "MDB_DEV"."MST_EMPLOYEE" where ROLE_POSITION_ID=? AND POSITION_VALUE_ID=? AND STATUS!=?';
	var pstmtEMPValRolePositionCombo = connection.prepareStatement(qryEMPValRolePositionCombo);
	pstmtEMPValRolePositionCombo.setInteger(1, parseInt(dicLine.ROLE_DEPENDENT_POS_ID, 10));
	pstmtEMPValRolePositionCombo.setString(2, dicLine.POSITION_ID[0]);
	pstmtEMPValRolePositionCombo.setInteger(3, 2);
	var rsEMPValRolePositionCombo = pstmtEMPValRolePositionCombo.executeQuery();
	if (rsEMPValRolePositionCombo.next()) {
		record.status = 0;
		record.message = 'EMPLOYEE already exist for position [' + dicLine.POSITION_ID + '] Kindly use another Position.';
		return false;
	}
	return true;
}

function getRolePositionName(dicLine) {
	var connection = $.db.getConnection();
	var query = 'select MR.ROLE_ID,MR.ROLE_NAME,MP.POSITION_ID,MP.POSITION_NAME from "MDB_DEV"."MAP_ROLE_POSITION" as MRP ' +
		' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' +
		' inner join "MDB_DEV"."MST_ROLE" as MR on MRP.ROLE_ID = MR.ROLE_ID ' + ' where MRP.ROLE_POS_ID = ?';
	var pstmt = connection.prepareStatement(query);
	pstmt.setString(1, dicLine.ROLE_DEPENDENT_POS_ID);
	var rs = pstmt.executeQuery();
	connection.commit();
	if (rs.next() > 0) {
		dicLine.C_ROLE_ID = rs.getString(1);
		dicLine.C_ROLE_NAME = rs.getString(2);
		dicLine.C_POSITION_ID = rs.getString(3);
		dicLine.C_POSITION_NAME = rs.getString(4);
	}
	connection.close();

}

function addEmployeeDuplicateTable(dataLine) {
	var records;
	var connection = $.db.getConnection();
	var data = dataLine[0];
	getRolePositionName(data);
	for (var i = 0; i < dataLine[0].POSITION_ID.length; i++) {
				var dicLine = dataLine[0].POSITION_ID[i];
				//getRolePositionName(dicLine);
	var query =
		'insert into  "MDB_DEV"."MST_EMPLOYEE_EXTN"("EMPLOYEE_CODE","EMPLOYEE_NAME","ROLE_ID","ROLE_NAME","POSITION_ID","POSITION_NAME","POSITION_VALUE") values (?,?,?,?,?,?,?)';
	var pstmt = connection.prepareStatement(query);
	pstmt.setString(1, dataLine[0].EMPLOYEE_CODE);
	pstmt.setString(2, dataLine[0].EMPLOYEE_NAME);
	pstmt.setString(3, dataLine[0].C_ROLE_ID);
	pstmt.setString(4, dataLine[0].C_ROLE_NAME);
	pstmt.setString(5, dataLine[0].C_POSITION_ID);
	pstmt.setString(6, dataLine[0].C_POSITION_NAME);
	pstmt.setString(7, dicLine);
//	pstmt.setString(8, dicLine.createby);
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
	connection.close();
}

/*
 * Insert all mandatory fields.
 * and check record is already insert or not.
 * @Param {datasLine} hold data in array [].
 * @Param [] output to put the data in it
 * @return {output} Array of Employees record
 * @author laxmi
 * updated by Satish
 * changes: validate the Employee before Adding.
 */

function addEmployee() {
	var record;
	var Output = {
		results: []
	};
	var Connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('LineData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
		//	for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[0];
				record = {};
				if (validateEmployee(dicLine, Connection, record)) {
					var empcode = getGenerateEMPCode(record);
					dicLine.EMPLOYEE_CODE = empcode.EmpNO;
					var CallProAddEmp = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_EMPLOYEE"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
					var pstmtAddEmp = Connection.prepareCall(CallProAddEmp);
					pstmtAddEmp.setInteger(1, 0);
					pstmtAddEmp.setString(2, empcode.EmpNO);
					pstmtAddEmp.setString(3, dicLine.EMPLOYEE_NAME);
					pstmtAddEmp.setString(4, dicLine.ADDRESS1);
					pstmtAddEmp.setString(5, dicLine.ADDRESS2);
					pstmtAddEmp.setString(6, dicLine.COUNTRY);
					pstmtAddEmp.setString(7, dicLine.STATE);
					pstmtAddEmp.setString(8, dicLine.DISTRICT);
					pstmtAddEmp.setString(9, dicLine.PHONE_NUMBER);
					pstmtAddEmp.setString(10, dicLine.EMAIL);
					pstmtAddEmp.setInteger(11, parseInt(dicLine.ROLE_DEPENDENT_POS_ID, 10)); // ROLE_ID
					pstmtAddEmp.setString(12, dicLine.POSITION_ID);//dicLine.POSITION_ID[0]
					pstmtAddEmp.setInteger(13, 0);
					pstmtAddEmp.setString(14, dateFunction());
					pstmtAddEmp.setString(15, dateFunction());
					pstmtAddEmp.setString(16, '0');
					pstmtAddEmp.setString(17, dicLine.createby);
					pstmtAddEmp.setString(18, dateFunction());
					pstmtAddEmp.setString(19, '');
					pstmtAddEmp.setString(20, dateFunction());
					pstmtAddEmp.setString(21, 'INSERT');
					pstmtAddEmp.execute();
					var rAddEmp = pstmtAddEmp.getParameterMetaData();
					Connection.commit();
					if (rAddEmp.getParameterCount() > 0) {
						record.status = 1;
						record.message = 'Data Uploaded Sucessfully';
						updateEmpNo(empcode);
						//addEmployeeDuplicateTable(dataLine);
					} else {
						record.status = 0;
						record.message = 'There is some Issue!!! Kindly Contact to admin.';
						updateEmpNo(empcode);
					}
				}
		//	}
			Output.results.push(record);
			Connection.close();
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
	case "addMSTEMPLOYEE":
		addEmployee();
		break;
	case "getEmployees":
		getEmployees();
		break;
	case "getEmployee":
		getEmployee();
		break;
    case "getRegional":
        getRegional();
        break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}