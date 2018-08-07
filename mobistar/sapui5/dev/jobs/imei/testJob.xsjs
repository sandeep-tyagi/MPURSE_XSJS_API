function uploadImei() {

	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.imei", "Imei");
	var client = new $.net.http.Client();
/*	var req = new $.web.WebRequest($.net.http.GET, "");
	client.request(req, dest);
	var response = client.getResponse();
	var st1 = JSON.stringify(response.body.asString());
	$.response.contentType = 'application/json';
	$.response.charset = 'UTF-8';
	$.response.setBody(JSON.parse(st1));*/
	var oSapBackPack = {
    "param1": "1",
    "param2": "2",
    "param3": "1"
	};
		var req = new $.web.WebRequest($.net.http.POST,"");
	
  req.setBody(JSON.stringify(oSapBackPack));
  client.request(req, dest);
	var response = client.getResponse();
	var st1 = JSON.stringify(response.body.asString());
	$.response.contentType = 'application/json';
	$.response.setBody(JSON.parse(st1));
}




function uploadImei2() {

	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.imei", "Imei");
	var client = new $.net.http.Client();
/*	var req = new $.web.WebRequest($.net.http.GET, "");
	client.request(req, dest);
	var response = client.getResponse();
	var st1 = JSON.stringify(response.body.asString());
	$.response.contentType = 'application/json';
	$.response.charset = 'UTF-8';
	$.response.setBody(JSON.parse(st1));*/
	var oSapBackPack = {
    "param1": "1",
    "param2": "2",
    "param3": "1"
	};
		var req = new $.net.http.Request($.net.http.POST,oSapBackPack);
		//new $.web.WebRequest($.net.http.POST, oSapBackPack);
		req.contentType = "application/json";

  req.setBody(JSON.stringify(oSapBackPack));

  client.request(req, dest);
//	client.request(req, dest);
	var response = client.getResponse();
	var st1 = JSON.stringify(response.body.asString());
	$.response.contentType = 'application/json';
	$.response.setBody(JSON.parse(st1));
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "uploadImei":
		uploadImei();
		break;
		case "uploadImei2":
		uploadImei2();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}