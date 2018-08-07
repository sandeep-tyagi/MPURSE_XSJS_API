
function uploadImei() {

	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.imei", "Imei");
	var client = new $.net.http.Client();


		/*var req = new $.web.WebRequest($.net.http.POST,"");
		req.headers.set("x-csrf-token");
  req.headers.set("Content-Type","application/json");
  req.headers.set("X-Requested-With","XMLHttpRequest");
  req.setBody(JSON.stringify(
  {
  param1:"0000006000",
  param2:"RAHUL GANDHI",
  param3:"00000999999999"
  }));*/
  var req = new $.net.http.Request($.net.http.POST,"");

  req.contentType = "application/json";

  req.setBody(JSON.stringify({param1:"6",param2:"RAHUL",param3:"1"}));
  client.request(req, dest);
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
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}