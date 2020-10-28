let input = document.querySelector('input')
let textarea = document.querySelector('textarea')
var mergeUrl;
var changeUrl;

function toggleNav() {
	if (document.getElementById("myNav").offsetWidth > 0) {
		closeNav();
	} else {
		openNav();
	}
}

function openNav() {
	document.getElementById("myNav").style.width = "1280px";
	setTimeout(function(){ document.getElementById("menuInfo").style.visibility="visible"; }, 450);
}

function closeNav() {
	document.getElementById("myNav").style.width = "0%";
	document.getElementById("menuInfo").style.visibility="hidden";
}

function goToMergeRequest() {
	navigate(mergeUrl, true);
}

function newMergeRequest() {
	navigate("http://gitlab.yrcw.com/mcc/environment/mcc-environment-prod/edit/master/prod-images.properties", true);
}

function goToChangeRequest() {
	navigate(changeUrl, true);
}

function newChangeRequest() {
	navigate("https://yrcw.service-now.com/nav_to.do?uri=%2Fchange_request_list.do%3Fsysparm_query%3DstateNOT%2520IN9%252C10%255Eassigned_to.nameSTARTSWITHmoore%26sysparm_first_row%3D1%26sysparm_view%3D%26sysparm_choice_query_raw%3D%26sysparm_list_header_search%3Dtrue", true);
}

function Jenkins() {
	document.getElementById("refresh").style.visibility="visible";
	document.getElementById("optionButtons1").style.visibility="hidden";
	document.getElementById("optionLabel").innerHTML = "Get New DevB Tickets from Jenkins";
	document.getElementById("JenkinsLabel").style.visibility="visible";
	document.getElementById("JenkinsText").style.visibility="visible";
	document.getElementById("JenkinsButton").style.visibility="visible";
	document.getElementById("JenkinsLink").style.visibility="visible";
	document.getElementById("JenkinsText").focus();
}

function navigate(href, newTab) {
	var a = document.createElement('a');
	a.href = href;
	if (newTab) {
		a.setAttribute('target', '_blank');
	}
	a.click();
}

function JenkinsFormat() {
	document.getElementById("JenkinsLabel").style.visibility="hidden";
	document.getElementById("JenkinsText").style.visibility="hidden";
	document.getElementById("JenkinsButton").style.visibility="hidden";
	document.getElementById("JenkinsLink").style.visibility="hidden";
	
	var linesArr = new Array();
	var ticketNumbers = new Array();
	var lines = document.getElementById("JenkinsText").value.split(/\r\n|\n/);
	var allText = document.getElementById("JenkinsText").value;
	
	if (allText.length != 0) {
		for (var i = 0; i < lines.length; i++) {
			var tempLine = lines[i];
			var developBuild = tempLine.indexOf("- Branch [develop]");
			var anyBuild = tempLine.indexOf("- Branch [");
			if (anyBuild > -1) {
				var inDevelop = false;
				if (developBuild > -1) {
					inDevelop = true;
				}
			}
			if (tempLine.length != 0 && tempLine !== "Changes" && inDevelop && anyBuild < 0) {
				linesArr.push(tempLine);
			}
		}
		linesArr = formatCleanup(linesArr);
		if (linesArr.length != 0) {
			document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
		} else {
			document.getElementById("outputText").style.textAlign = "center";
			document.getElementById("outputText").innerHTML = "No changes were found to be formatted.<br><br><br><br>Make sure that you are copying the build headings along with their respective changes.";
		}
	} else {
		document.getElementById("outputText").innerHTML = "You haven't entered anything in the text box! Try again.";
	}
}
		
function NewFormat() {
	document.getElementById("fileInput").style.visibility="visible";
	document.getElementById("fileInputLabel").style.visibility="visible";
	document.getElementById("optionButtons1").style.visibility="hidden";
	document.getElementById("optionLabel").innerHTML = "Format New Tickets on List";
	document.getElementById("refresh").style.visibility="visible";
	
	input.addEventListener('change', () => {
		let files = input.files; 
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var linesArr = formatCleanup(lines);
			if (linesArr.length == 0) {
				document.getElementById("outputText").innerHTML = "There are no unformatted tickets on this list.";
			} else {
				document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
			}
			document.getElementById("fileInput").style.visibility="hidden";
			document.getElementById("fileInputLabel").style.visibility="hidden";
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	});
}

function formatCleanup(lines) {
	var linesArr = new Array();
	var ticketNumbers = new Array();
	for (var i = 0; i < lines.length; i++) {
		var tempLine = lines[i];
		var mmpiTicket = "";
		var m2jvTicket = "";
		if (tempLine.length != 0 && !tempLine.startsWith("*") && !tempLine.toUpperCase().startsWith("X") && !tempLine.startsWith("?")) {
			tempLine = tempLine.replace("[", "");
			tempLine = tempLine.replace("]", "");
			tempLine = tempLine.replace("WIP:", "");
			tempLine = tempLine.replace("DEVB", "");
			tempLine = tempLine.substring(0, tempLine.length - 9);
			if (tempLine.toUpperCase().indexOf("ROLLBACK") < 0 && tempLine.toUpperCase().indexOf("REVERT") < 0) {
				var lineNoSpaces = tempLine.replace(/[ -]/g, "");
				var mmpiLoc = lineNoSpaces.toUpperCase().indexOf("MMPI");
				var m2jvLoc = lineNoSpaces.toUpperCase().indexOf("M2JV");
				if (mmpiLoc > -1) {
					mmpiTicket = lineNoSpaces.substring(mmpiLoc, mmpiLoc + 9);
					mmpiTicket = mmpiTicket.substring(0, 4) + "-" + mmpiTicket.substring(4, mmpiTicket.length);
					tempLine = tempLine.substring(0, mmpiLoc) + tempLine.substring(mmpiLoc + 10, tempLine.length);
					var realStart = 0;
					for (var j = 0; j < tempLine.length; j++) {
						if (!tempLine[j].match(/[a-zA-Z]/)) {
							realStart = j+1;
						} else {
							break;
						}
					}
					tempLine = tempLine.substring(realStart, tempLine.length);
					tempLine = "* [" + mmpiTicket + "] (https://yrcfreight.atlassian.net/browse/" + mmpiTicket + " ) " + tempLine.trim();
				} else if (m2jvLoc > -1) {
					m2jvTicket = lineNoSpaces.substring(m2jvLoc, m2jvLoc + 9);
					m2jvTicket = m2jvTicket.substring(0, 4) + "-" + m2jvTicket.substring(4, m2jvTicket.length);
					tempLine = tempLine.substring(0, m2jvLoc) + tempLine.substring(m2jvLoc + 10, tempLine.length);
					var realStart = 0;
					for (var j = 0; j < tempLine.length; j++) {
						if (!tempLine[j].match(/[a-zA-Z]/)) {
							realStart = j+1;
						} else {
							break;
						}
					}
					tempLine = tempLine.substring(realStart, tempLine.length);
					tempLine = "* [" + m2jvTicket + "] (https://yrcfreight.atlassian.net/browse/" + m2jvTicket + " ) " + tempLine.trim();
				} else {
					tempLine = "* " + tempLine;
				}
			}
			var foundDup = false;
			for (var t = 0; t < ticketNumbers.length; t++) {
				if (mmpiTicket.length != 0) {
					if (ticketNumbers[t] === mmpiTicket) {
						foundDup = true;
						break;
					}
				} else if (m2jvTicket.length != 0) {
					if (ticketNumbers[t] === m2jvTicket) {
						foundDup = true;
						break;
					}
				}
			}
			if (!foundDup) {
				if (mmpiTicket.length != 0) {
					ticketNumbers.push(mmpiTicket);
				} else if (m2jvTicket.length != 0) {
					ticketNumbers.push(m2jvTicket);
				}
				linesArr.push(tempLine);
			}
		} else {
			var mmpiLoc = tempLine.toUpperCase().indexOf("MMPI");
			if (mmpiLoc > -1) {
				mmpiTicket = tempLine.substring(mmpiLoc, mmpiLoc + 10);
			}
			var m2jvLoc = tempLine.toUpperCase().indexOf("M2JV");
			if (m2jvLoc > -1) {
				m2jvTicket = tempLine.substring(m2jvLoc, m2jvLoc + 10);
			}
			var foundDup = false;
			for (var t = 0; t < ticketNumbers.length; t++) {
				if (mmpiTicket.length != 0) {
					if (ticketNumbers[t] === mmpiTicket) {
						foundDup = true;
						break;
					}
				} else if (m2jvTicket.length != 0) {
					if (ticketNumbers[t] === m2jvTicket) {
						foundDup = true;
						break;
					}
				}
			}
			if (!foundDup) {
				if (mmpiTicket.length != 0) {
					ticketNumbers.push(mmpiTicket);
				} else if (m2jvTicket.length != 0) {
					ticketNumbers.push(m2jvTicket);
				}
			}
		}
	}
	return linesArr;
}

function Merge() {
	document.getElementById("fileInput").style.visibility="visible";
	document.getElementById("fileInputLabel").style.visibility="visible";
	document.getElementById("optionButtons1").style.visibility="hidden";
	document.getElementById("optionLabel").innerHTML = "Format List for Merge Request";
	document.getElementById("refresh").style.visibility="visible";
	
	input.addEventListener('change', () => {
		let files = input.files; 
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var linesArr = new Array();
			var ticketNumbers = new Array();
			var foundBlank = false;
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				if (tempLine.startsWith("* [Previous") || tempLine.startsWith("* [CHG")) {
					linesArr.push(tempLine);
					foundBlank = false;
				} else if (tempLine.length == 0) {
					if (foundBlank == false) {
						linesArr.push(tempLine);
						foundBlank = true;
					}
				} else if (!tempLine.startsWith("* [Merge")) {
					var starLoc = tempLine.indexOf("*");
					tempLine = tempLine.substring(starLoc, tempLine.length);
					linesArr.push(tempLine);
					foundBlank = false;
				} else if (tempLine.startsWith("* [Merge")) {
					var urlLoc = tempLine.indexOf("http://gitlab.yrcw.com/mcc");
					if (urlLoc > -1) {
						document.getElementById("goToMergeRequest").style.visibility="visible";
						mergeUrl = tempLine.substring(urlLoc, tempLine.indexOf(")") -1);
					} else {
						document.getElementById("newMergeRequest").style.visibility="visible";
					}
				}
			}
			if (linesArr.length == 0) {
				document.getElementById("outputText").innerHTML = "There are no tickets on this list.";
			} else {
				document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
			}
			document.getElementById("fileInput").style.visibility="hidden";
			document.getElementById("fileInputLabel").style.visibility="hidden";
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	});
}

function ChangeTask() {
	document.getElementById("fileInput").style.visibility="visible";
	document.getElementById("fileInputLabel").style.visibility="visible";
	document.getElementById("optionButtons1").style.visibility="hidden";
	document.getElementById("optionLabel").innerHTML = "Format List for Change Task";
	document.getElementById("refresh").style.visibility="visible";
	
	input.addEventListener('change', () => {
		let files = input.files; 
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var linesArr = new Array();
			var ticketNumbers = new Array();
			var foundBlank = false;
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				var leftParen = tempLine.indexOf("(");
				var rightParen = tempLine.indexOf(")");
				var leftBracket = tempLine.indexOf("[");
				var rightBracket = tempLine.indexOf("]");
				if (!tempLine.startsWith("* [Previous") && !tempLine.startsWith("* [CHG") && !tempLine.startsWith("* [Merge") && !tempLine.length == 0) {
					if (tempLine.startsWith("**Production**")) {
						linesArr.push("Production");
					} else if (tempLine.startsWith("**DevB**")) {
						linesArr.push("");
						linesArr.push("DevB");
					} else {
						var mmpiLoc = tempLine.toUpperCase().indexOf("MMPI");
						var m2jvLoc = tempLine.toUpperCase().indexOf("M2JV");
						if (mmpiLoc < 0 && m2jvLoc < 0 && !tempLine.length == 0) {
							tempLine = tempLine.substring(2, tempLine.length);
							linesArr.push(tempLine);
						} else if (tempLine.length != 0) {
							var ticketTitle = tempLine.substring(leftBracket+1, rightBracket);
							tempLine = ticketTitle + tempLine.substring(rightParen+1, tempLine.length);
							linesArr.push(tempLine);
						}
					}
				} else if (tempLine.startsWith("* [CHG")) {
					if (tempLine.indexOf("CHG URL HERE") < 0) {
						document.getElementById("goToChangeRequest").style.visibility="visible";
						changeUrl = tempLine.substring(tempLine.indexOf("https://yrcw.service-now"), tempLine.indexOf(")")-1);
					} else {
						document.getElementById("newChangeRequest").style.visibility="visible";
					}
				}
			}
			if (linesArr.length == 0) {
				document.getElementById("outputText").innerHTML = "There are no tickets on this list.";
			} else {
				document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
			}
			document.getElementById("fileInput").style.visibility="hidden";
			document.getElementById("fileInputLabel").style.visibility="hidden";
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	});
}

function Email() {
	document.getElementById("fileInput").style.visibility="visible";
	document.getElementById("fileInputLabel").style.visibility="visible";
	document.getElementById("optionButtons1").style.visibility="hidden";
	document.getElementById("optionLabel").innerHTML = "Format Existing List for Email";
	document.getElementById("refresh").style.visibility="visible";
	
	input.addEventListener('change', () => {
		let files = input.files; 
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var dt = getThursday();
			var linesArr = new Array();
			linesArr.push("All,");
			linesArr.push("");
			linesArr.push("MCC Production will be updated Thursday " + dt + " at approximately 10:00 AM CDT");
			linesArr.push("");
			var bullet = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				var leftParen = tempLine.indexOf("(");
				var rightParen = tempLine.indexOf(")");
				var leftBracket = tempLine.indexOf("[");
				var rightBracket = tempLine.indexOf("]");
				if (tempLine.startsWith("* [Previous") || tempLine.startsWith("* [CHG")) {
					var linkTitle = tempLine.substring(leftBracket+1, rightBracket);
					var newLink = linkTitle.link(tempLine.substring(leftParen+1, rightParen));
					tempLine = bullet + newLink;
					linesArr.push(tempLine);
				} else if (tempLine.startsWith("* [Merge")) {
					var linkTitle = tempLine.substring(leftBracket+1, rightBracket);
					var newLink = linkTitle.link(tempLine.substring(leftParen+1, rightParen));
					tempLine = bullet + newLink + tempLine.substring(rightParen+1, tempLine.length);
					linesArr.push(tempLine);
				} else {
					var mmpiLoc = tempLine.toUpperCase().indexOf("MMPI");
					var m2jvLoc = tempLine.toUpperCase().indexOf("M2JV");
					if (tempLine.startsWith("**DevB**")) {
						break;
					} else if (tempLine.startsWith("**Production**")) {
						linesArr.push("");
						linesArr.push("Production");
					} else if (mmpiLoc < 0 && m2jvLoc < 0 && !tempLine.length == 0) {
						tempLine = bullet + tempLine.substring(2, tempLine.length);
						linesArr.push(tempLine);
					} else if (tempLine.length != 0) {
						var ticketTitle = tempLine.substring(leftBracket+1, rightBracket);
						var ticketLink = ticketTitle.link(tempLine.substring(leftParen+1, rightParen));
						tempLine = bullet + ticketLink + tempLine.substring(rightParen+1, tempLine.length);
						linesArr.push(tempLine);
					}
				}
			}
			document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
			document.getElementById("emailButton").style.visibility="visible";
			document.getElementById("fileInput").style.visibility="hidden";
			document.getElementById("fileInputLabel").style.visibility="hidden";
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	});
}

function sendEmail() {
	var to = "ITModernizationNotifications@yrcw.com";
	var cc = "YT_Solution_Services@yrcfreight.com";
	var subject = "Weekly MCC Production Deployment";
	var screenOutput = document.getElementById("outputText").innerHTML;
	window.location.href = "mailto:" + to + "?cc=" + cc + "&subject=" + subject;
}

function getThursday() {
	var date = new Date();
	var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 4);
	var thursday = new Date(date.setDate(diff));
	let year = thursday.getFullYear();
	let month = (1 + thursday.getMonth()).toString().padStart(2, '0');
	let day = thursday.getDate().toString().padStart(2, '0');
	return month + '/' + day + '/' + year;
}

function displayPushDate() {
	document.getElementById("dateLabel").innerHTML = "This week's PROD deploy will be on " + getThursday();
}

function sendFeedback() {
	if (confirm("Click OK below to open a new email.\n\nFeel free to share any feedback such as discovered bugs or suggestions for improvements.")) {
		var to = "jesse.nickchen@yrcw.com";
		var subject = "Ticket List Formatting Tool Feedback";
		window.location.href = "mailto:" + to + "?subject=" + subject;
	} else {
		document.getElementById("optionButtons1").style.visibility="hidden";
		document.getElementById("optionLabel").innerHTML = "Send Feedback";
		document.getElementById("refresh").style.visibility="visible";
		document.getElementById("outputText").innerHTML = "You clicked cancel!";
	}
}