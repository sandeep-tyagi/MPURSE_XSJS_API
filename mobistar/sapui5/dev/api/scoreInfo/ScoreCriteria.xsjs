function getScoreCriteria() {
	var output = {
		results: [],
		totalObtain: []
	};
	var total = 0;
	var dbrFormId = $.request.parameters.get('RDFORMID');
	var connection = $.db.getConnection();
	
	var queryGetScoreCriteria =
		'select CRITERIA_ID,PARAMETER,SELECTION_CRITERIA,BASIS,MEASURABLE,BENCHMARK from "MDB_DEV"."MST_SCORE_CRITERIA" ORDER BY CRITERIA_ID ASC';
	var pstmtGetScoreCriteria = connection.prepareStatement(queryGetScoreCriteria);
	var rsGetScoreCriteria = pstmtGetScoreCriteria.executeQuery();
	connection.commit();
	while (rsGetScoreCriteria.next()) {
		var record = {};
		record.CRITERIA_ID = rsGetScoreCriteria.getInteger(1);
		record.PARAMETER = rsGetScoreCriteria.getString(2);
		record.SELECTION_CRITERIA = rsGetScoreCriteria.getString(3);
		record.BASIS = rsGetScoreCriteria.getString(4);
		record.MEASURABLE = rsGetScoreCriteria.getString(5);
		record.BENCHMARK = rsGetScoreCriteria.getInteger(6);
		record.OBTAIN = "0";
		total = parseInt(record.BENCHMARK, 10) + total;
		record.totalBenchmark = total;
		output.results.push(record);
	}
	var records = {};
	records.totalBanchMark = total;
	output.totalObtain.push(records);
	var qrySelectionDBRFormId = 'SELECT  MARKS_OBTAINED_SC1,MARKS_OBTAINED_SC2,MARKS_OBTAINED_SC3,MARKS_OBTAINED_SC4,MARKS_OBTAINED_SC5,' +
        ' MARKS_OBTAINED_SC6,MARKS_OBTAINED_SC7,RATING FROM "MDB_DEV"."DBR_SCORE_INFO" WHERE dbr_form_id=? AND SOFT_DEL=?';
     var pstmtSelectionDBRFormId = connection.prepareStatement(qrySelectionDBRFormId);
       	pstmtSelectionDBRFormId.setString(1, dbrFormId);
       	pstmtSelectionDBRFormId.setString(2, '0');
		var rsSelectionDBRFormId = pstmtSelectionDBRFormId.executeQuery();
		connection.commit();
		var scoreResult = [];
		var totalMarks = 0;
		var rating = "";
		if(rsSelectionDBRFormId.next()) {
		    var	MARKS_OBTAINED_SC1 = rsSelectionDBRFormId.getInteger(1);
			scoreResult.push(MARKS_OBTAINED_SC1);
			totalMarks += MARKS_OBTAINED_SC1;
			var MARKS_OBTAINED_SC2 = rsSelectionDBRFormId.getInteger(2);
			scoreResult.push(MARKS_OBTAINED_SC2);
			totalMarks += MARKS_OBTAINED_SC2;
			var MARKS_OBTAINED_SC3 = rsSelectionDBRFormId.getInteger(3);
			scoreResult.push(MARKS_OBTAINED_SC3);
			totalMarks += MARKS_OBTAINED_SC3;
			var MARKS_OBTAINED_SC4 = rsSelectionDBRFormId.getInteger(4);
			scoreResult.push(MARKS_OBTAINED_SC4);
			totalMarks += MARKS_OBTAINED_SC4;
			var MARKS_OBTAINED_SC5 = rsSelectionDBRFormId.getInteger(5);
			scoreResult.push(MARKS_OBTAINED_SC5);
			totalMarks += MARKS_OBTAINED_SC5;
			var MARKS_OBTAINED_SC6 = rsSelectionDBRFormId.getInteger(6);
			scoreResult.push(MARKS_OBTAINED_SC6);
			totalMarks += MARKS_OBTAINED_SC6;
			var MARKS_OBTAINED_SC7 = rsSelectionDBRFormId.getInteger(7);
			scoreResult.push(MARKS_OBTAINED_SC7);
			totalMarks += MARKS_OBTAINED_SC7;
			rating = rsSelectionDBRFormId.getString(8);
			
		}   
		if(scoreResult.length > 0 ){
	var newRecord = output.results;
			output.results = [];
			output.totalBenchmark = "Total Benchmark = " + 100;
			output.totalMarksObtained = "Total Obtain = " + totalMarks;
			output.RATING = " Rating = " + rating;
			for(var i = 0; i < newRecord.length; i++ ){
			    var recordsWithObtainedMarks = newRecord[i];
			    recordsWithObtainedMarks.OBTAIN = scoreResult[i];
			    output.results.push(recordsWithObtainedMarks);
			}
		}
	connection.close();
	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}


function getDBRScoreInfo() {
	var output = {
		results: [],
		totalMarksObtained : 0 ,
		rating :'',
		totalBenchmark : 100 
	};
	var dbrFormId = $.request.parameters.get('dbrFormId');
	var connection = $.db.getConnection();
	var pstmtDBRScore;
	var queryDBRScore;
	try {

		queryDBRScore = 'select CRITERIA_ID,PARAMETER,SELECTION_CRITERIA,BASIS,MEASURABLE,BENCHMARK from "MDB_DEV"."MST_SCORE_CRITERIA" ORDER BY CRITERIA_ID ASC';
		pstmtDBRScore = connection.prepareStatement(queryDBRScore);

		var rsGetDBRScore = pstmtDBRScore.executeQuery();
		connection.commit();
		while (rsGetDBRScore.next()) {
			var record = {};
			record.CRITERIA_ID = rsGetDBRScore.getInteger(1);
			record.PARAMETER = rsGetDBRScore.getString(2);
			record.SELECTION_CRITERIA = rsGetDBRScore.getString(3);
			record.BASIS = rsGetDBRScore.getString(4);
			record.MEASURABLE = rsGetDBRScore.getString(5);
			record.BENCHMARK = rsGetDBRScore.getInteger(6);

			output.results.push(record);
		}  
		var	queryDBRScoreCriteria = 
		'select MARKS_OBTAINED_SC1,MARKS_OBTAINED_SC2,MARKS_OBTAINED_SC3,MARKS_OBTAINED_SC4,MARKS_OBTAINED_SC5,' +
        ' MARKS_OBTAINED_SC6,MARKS_OBTAINED_SC7,RATING from "MDB_DEV"."DBR_SCORE_INFO" where dbr_form_id=?';
		var pstmtDBRScoreCriteria = connection.prepareStatement(queryDBRScoreCriteria);
       	pstmtDBRScoreCriteria.setString(1, dbrFormId);
		var rsGetDBRScoreCriteria = pstmtDBRScoreCriteria.executeQuery();
		connection.commit();
		var scoreResult = [];
		var totalMarks = 0;
		while (rsGetDBRScoreCriteria.next()) {
		    var	MARKS_OBTAINED_SC1 = rsGetDBRScoreCriteria.getInteger(1);
			scoreResult.push(MARKS_OBTAINED_SC1);
			totalMarks += MARKS_OBTAINED_SC1;
			var MARKS_OBTAINED_SC2 = rsGetDBRScoreCriteria.getInteger(2);
			scoreResult.push(MARKS_OBTAINED_SC2);
			totalMarks += MARKS_OBTAINED_SC2;
			var MARKS_OBTAINED_SC3 = rsGetDBRScoreCriteria.getInteger(3);
			scoreResult.push(MARKS_OBTAINED_SC3);
			totalMarks += MARKS_OBTAINED_SC3;
			var MARKS_OBTAINED_SC4 = rsGetDBRScoreCriteria.getInteger(4);
			scoreResult.push(MARKS_OBTAINED_SC4);
			totalMarks += MARKS_OBTAINED_SC4;
			var MARKS_OBTAINED_SC5 = rsGetDBRScoreCriteria.getInteger(5);
			scoreResult.push(MARKS_OBTAINED_SC5);
			totalMarks += MARKS_OBTAINED_SC5;
			var MARKS_OBTAINED_SC6 = rsGetDBRScoreCriteria.getInteger(6);
			scoreResult.push(MARKS_OBTAINED_SC6);
			totalMarks += MARKS_OBTAINED_SC6;
			var MARKS_OBTAINED_SC7 = rsGetDBRScoreCriteria.getInteger(7);
			scoreResult.push(MARKS_OBTAINED_SC7);
			totalMarks += MARKS_OBTAINED_SC7;
			var rating = rsGetDBRScoreCriteria.getString(8);
			
		}
		
			var newRecord = output.results;
			output.results = [];
			output.totalBenchmark = "Total Benchmark = " + 100;
			output.totalMarksObtained = "Total Obtain = " + totalMarks;
			output.RATING = " Rating = " + rating;
			for(var i = 0; i < newRecord.length; i++ ){
			    var records = newRecord[i];
			    records.ObtainedMarked = scoreResult[i];
			    output.results.push(records);
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
/*
@ Shriyansi
*/
function fetchScoreCard(dic, connection, record) {
	var qurySelect = 'SELECT DBR_FORM_ID FROM "MDB_DEV"."DBR_SCORE_INFO" WHERE DBR_FORM_ID=? ';
	var pstmtGetScoreCriteria = connection.prepareStatement(qurySelect);
	pstmtGetScoreCriteria.setString(1, dic.dbr_form_id);
	var rsGetScoreCriteria = pstmtGetScoreCriteria.executeQuery();
	connection.commit();
	if (rsGetScoreCriteria.next()) {
		var queryscoreUpdate =
			'DELETE FROM "MDB_DEV"."DBR_SCORE_INFO"  where DBR_FORM_ID=?';
		var pstmtScoreUpdate = connection.prepareStatement(queryscoreUpdate);
		pstmtScoreUpdate.setString(1, dic.dbr_form_id);
		var rsScoreUpdate = pstmtScoreUpdate.executeUpdate();
		connection.commit();
		if (rsScoreUpdate > 0) {
		    
		}
	}
	var quryscoreinsert =
		'INSERT INTO "MDB_DEV"."DBR_SCORE_INFO"(DBR_FORM_ID,MARKS_OBTAINED_SC1,MARKS_OBTAINED_SC2,MARKS_OBTAINED_SC3,MARKS_OBTAINED_SC4,MARKS_OBTAINED_SC5,MARKS_OBTAINED_SC6,MARKS_OBTAINED_SC7,CREATE_BY,RATING) values(?,?,?,?,?,?,?,?,?,?)';
	var pstmtAddScore = connection.prepareStatement(quryscoreinsert);

	pstmtAddScore.setString(1, dic.dbr_form_id);
	pstmtAddScore.setInteger(2, parseInt(dic.obtain1, 10));
	pstmtAddScore.setInteger(3, parseInt(dic.obtain2, 10));
	pstmtAddScore.setInteger(4, parseInt(dic.obtain3, 10));
	pstmtAddScore.setInteger(5, parseInt(dic.obtain4, 10));
	pstmtAddScore.setInteger(6, parseInt(dic.obtain5, 10));
	pstmtAddScore.setInteger(7, parseInt(dic.obtain6, 10));
	pstmtAddScore.setInteger(8, parseInt(dic.obtain7, 10));
	//pstmtAddScore.setInteger(9, parseInt(dic.obtain8, 10));
	pstmtAddScore.setString(9, dic.CREATE_BY);
	pstmtAddScore.setString(10, dic.rating);
	var rsAddScore = pstmtAddScore.executeUpdate();
	connection.commit();
	if (rsAddScore > 0) {
		record.status = 1;
		record.message = "Record Successfully inserted";
	} else {
		record.status = 0;
		record.message = "Record Successfully  not inserted!!! Kindly contact Admin.";
	}
}

function submitScoreCard() {
	var output = {
		results: []
	};
	var scoreCardArray = $.request.parameters.get('scoreCardArray');
	var finalScoreCardArray = JSON.parse(scoreCardArray.replace(/\\r/g, ""));
	var connection = $.db.getConnection();

	try {
		for (var i = 0; i < finalScoreCardArray.length; i++) {
			var dic = finalScoreCardArray[i];
			var record = {};
			fetchScoreCard(dic, connection, record);

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

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "getscorecriteria":
		getScoreCriteria();
		break;
	case "submitScoreCard":
		submitScoreCard();
		break;
	case "getDBRScoreInfo":
		getDBRScoreInfo();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}