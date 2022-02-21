// file input variable
var input = document.getElementById("fileInput");

// string variables
var addTicketsNewBuild = "";
var JiraTicketResponse = "";
var m2jvTicket = "";
var mmpiTicket = "";
var newListBuilder = "";
var pwd = "";
var user = "";
var bullet = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

// boolean variables
var swAddTicketsFromJenkins = false;
var swAddTicketsToNewList = false;
var swCheckNewTicketsAffectProd = false;
var swCheckProd = false;
var swError404 = false;
var swFoundDupTicket = false;
var swFoundProdSection = false;
var swFoundswFoundProd = false;
var swMarkBlockersAfterAffectsProd = false;

// array variables
var arrAllJenkinsTickets;
var arrBlockerNamesAndTickets;
var arrCheckAffectsFoundProd;
var arrCheckFoundProd;
var arrCheckProdNoTicket;
var arrExistingDevbTickets;
var arrExistingHeadings;
var arrExistingFoundProd;
var arrFormattedJenkinsTickets;
var arrMergeReqLinks;
var arrNotCheckedAsProd;
var arrTicketsMarkedBlockers;

// clear variables and setup screen when a new option is clicked
function resetScreen() {
	removeListeners();
	input = document.getElementById("fileInput");
	input.value = '';
	var mergeUrl;
	var changeUrl;
	document.getElementById("welcomeLabel").style.display="none";
	hideClass("JenkinsAll");
	hideClass("JenkinsBranchAllAll");
	document.getElementById("JenkinsButton").style.display="none";
	document.getElementById("JenkinsLink").style.display="none";
	document.getElementById("JenkinsOldBuild").style.display="none";
	document.getElementById("JenkinsText").value = "";
	document.getElementById("fileInput").style.display="none";
	document.getElementById("fileInputLabel").style.display="none";
	document.getElementById("loaderLabel").style.display="none";
	document.getElementById("loader").style.display="none";
	document.getElementById("loginBtn").style.display="none";
	document.getElementById("goToMergeRequest").style.display="none";
	document.getElementById("newMergeRequest").style.display="none";
	document.getElementById("goToChangeRequest").style.display="none";
	document.getElementById("newChangeRequest").style.display="none";
	document.getElementById("oopEmail").style.display="none";
	document.getElementById("oopEmail").checked = false;
	document.getElementById("oopEmailLabel").style.display="none";
	document.getElementById("emailButton").style.display="none";
	document.getElementById("outputText").innerHTML = "";
	hideClass("loginInput");
	document.getElementById("outputText").style.textAlign = "left";
	document.getElementById("outputText").style.display = "block";
	hideClass("newList");
	document.getElementById("newListBtn").style.display="none";
	document.getElementById("oldBuildBtn").style.display="none";
	document.getElementById("newBuildBtn").style.display="none";
	document.getElementById("chgReqBtn").style.display="none";
	document.getElementById("oldBuild").value = "";
	document.getElementById("newBuild").value = "";
	document.getElementById("chgReq").value = "";
	document.getElementById("chgReqUrl").value = "";
	user = "";
	pwd = "";
	document.getElementById("alsoGetTickets").style.display="none";
	document.getElementById("alsoGetTicketsLabel").style.display="none";
	document.getElementById("alsoGetTickets").checked = true;
	mmpiTicket = "";
	m2jvTicket = "";
	document.getElementById("myDynamicTable").innerHTML = "";
	document.getElementById("myDynamicTable").style.display = "block";
	document.getElementById("alsoMarkBlockers").style.display="none";
	document.getElementById("alsoMarkBlockersLabel").style.display="none";
	document.getElementById("alsoMarkBlockers").checked = true;
	document.getElementById("alsoAffectsProd").style.display="none";
	document.getElementById("alsoAffectsProdLabel").style.display="none";
	document.getElementById("alsoAffectsProd").checked = true;
	document.getElementById("affectsProdBtn").style.display = "none";
	hideClass("newListSpacing");
	document.getElementById("validationEmailButton").style.display="none";
}

// toggle help menu open or closed
function toggleNav() {
	if (document.getElementById("myNav").offsetWidth > 0) {
		closeNav();
	} else {
		openNav();
	}
}

// open help menu
function openNav() {
	document.getElementById("myNav").style.width = "100%";
	setTimeout(function(){ document.getElementById("menuInfo").style.visibility="visible"; }, 450);
}

// close help menu
function closeNav() {
	document.getElementById("myNav").style.width = "0%";
	document.getElementById("menuInfo").style.visibility="hidden";
}

// goes to existing merge request when button is clicked
function goToMergeRequest() {
	navigate(mergeUrl, true);
}

// opens new merge request when button is clicked
function newMergeRequest() {
	navigate("http://gitlab.yrcw.com/mcc/environment/mcc-environment-prod/edit/master/prod-images.properties", true);
}

// goes to existing change request when button is clicked
function goToChangeRequest() {
	navigate(changeUrl, true);
}

// goes to change request list when button is clicked
function newChangeRequest() {
	navigate("https://yrcw.service-now.com/nav_to.do?uri=%2Fchange_request_list.do%3Fsysparm_query%3DstateNOT%20IN9,10%5Eshort_descriptionSTARTSWITHWeekly%20updates%20to%20Modernization%20MCC%20applications%20-%20M204%20renovated%20code%20to%20Java%2FSQL%26sysparm_first_row%3D1%26sysparm_view%3D%26sysparm_choice_query_raw%3D%26sysparm_list_header_search%3Dtrue", true);
	document.getElementById("chgReq").focus();
}

// menu option Create New Ticket List
function newList() {
	resetScreen();
	swCheckNewTicketsAffectProd = false;
	resetTicketArrays();
	newListBuilder = "";
	swAddTicketsToNewList = false;
	swCheckProd = false;
	swAddTicketsFromJenkins = false;
	showClass("newListSpacing");
	document.getElementById("optionLabel").innerHTML = "Create New Ticket List<br><br><br><br>Fill out the information below, and click submit.";
	document.getElementById("oldBuildLabel").style.display="inline-block";
	document.getElementById("oldBuild").style.display="inline-block";
	document.getElementById("oldBuildBtn").style.display="inline-block";
	document.getElementById("newBuildLabel").style.display="inline-block";
	document.getElementById("newBuild").style.display="inline-block";
	document.getElementById("newBuildBtn").style.display="inline-block";
	document.getElementById("chgReqLabel").style.display="inline-block";
	document.getElementById("chgReq").style.display="inline-block";
	document.getElementById("chgReqBtn").style.display="inline-block";
	document.getElementById("chgReqUrlLabel").style.display="inline-block";
	document.getElementById("chgReqUrl").style.display="inline-block";
	document.getElementById("alsoGetTickets").style.display="inline-block";
	document.getElementById("alsoGetTicketsLabel").style.display="inline-block";
	document.getElementById("newListBtn").style.display="block";
	document.getElementById("oldBuild").focus();
}

// goes to prod properties file when button is clicked
function findOldBuild() {
	navigate("http://gitlab.yrcw.com/mcc/environment/mcc-environment-prod/blob/master/prod-images.properties", true);
	document.getElementById("oldBuild").focus();
}

// goes to Jenkins changes when button is clicked
function findNewBuild() {
	navigate("https://jenkins-mcc.yrcw.com/job/app/job/mcc-modules/changes", true);
	document.getElementById("newBuild").focus();
}

// processes input values into new list when button is clicked
function submitNewList() {
	hideClass("newList");
	var oldBuild = document.getElementById("oldBuild").value;
	var newBuild = document.getElementById("newBuild").value;
	var chgReq = document.getElementById("chgReq").value;
	var chgReqUrl = document.getElementById("chgReqUrl").value;
	newListBuilder = "* [Previous Release File Compare] (http://gitlab.yrcw.com/mcc/app/mcc-modules/compare/" + oldBuild + "..." + newBuild + " )\n" +
		"* [" + chgReq + "] (" + chgReqUrl + " )\n" + "* [Merge Request] ([MERGE REQUEST URL HERE] )\n\n";
	if (document.getElementById("alsoGetTickets").checked == true) {
		swAddTicketsToNewList = true;
		jenkins();
	} else {
		newListBuilder += "**Production**\n\n**DevB**\n\n\n\n";
		document.getElementById("outputText").innerHTML = newListBuilder.split('\n').join('<br>');
		downloadList();
	}
}

// downloads built list
function downloadList() {
	var blob = new Blob([newListBuilder], {
		type: "text/plain;charset=utf-8"
	});
	var deployDate = getNextBusDay().replaceAll("/", "");
	deployDate = "prod_deploy_" + deployDate + ".txt";
	saveAs(blob, deployDate);
	document.getElementById("optionLabel").innerHTML = "The new ticket list has been saved to your downloads folder as " + deployDate + ".";
}

// menu option Get New Tickets from Jenkins
function jenkins() {
	resetScreen();
	swCheckNewTicketsAffectProd = false;
	swCheckProd = false;
	swAddTicketsFromJenkins = true;
	document.getElementById("optionLabel").innerHTML = "Get New Tickets from Jenkins";
	arrFormattedJenkinsTickets = new Array();
	if (!swAddTicketsToNewList) {
		newListBuilder = "";
		document.getElementById("optionLabel").innerHTML += "<br><br><br><br>Please select the file for your current ticket list below.";
		document.getElementById("fileInput").style.display="inline";
		document.getElementById("fileInputLabel").style.display="inline";
		input.addEventListener('change', processFile);
		function processFile() {
			let files = input.files; 
			if (files.length == 0) return; 
			var file = files[0]; 
			let reader = new FileReader();

			reader.onload = (e) => {
				var file = e.target.result;
				var lines = file.split(/\r\n|\n/);
				arrFormattedJenkinsTickets = file.split(/\r\n|\n/);
				var swFoundProd = false;
				resetTicketArrays();
			
				for (var i = 0; i < lines.length; i++) {
					var tempLine = lines[i];
					if (tempLine.startsWith("**Production**")) {
						swFoundProd = true;
					} else if (tempLine.startsWith("**DevB**")) {
						swFoundProd = false;
					}
					if (i < 3) {
						arrExistingHeadings.push(tempLine);
					}
					if (swFoundProd && tempLine.indexOf("*") > -1 && !tempLine.startsWith("**Production**")) {
						arrExistingFoundProd.push(tempLine);
						var formattedTicket = getTicketTitle(tempLine);
						if (formattedTicket !== "none") {
							arrAllJenkinsTickets.push(formattedTicket);
						}
					} else if (!swFoundProd && tempLine.indexOf("*") > -1 && !tempLine.startsWith("**DevB**") && i >= 3) {
						arrExistingDevbTickets.push(tempLine);
						var formattedTicket = getTicketTitle(tempLine);
						if (formattedTicket !== "none") {
							arrAllJenkinsTickets.push(formattedTicket);
						}
					}
				}
				
				document.getElementById("optionLabel").innerHTML = "Get New Tickets from Jenkins";
				document.getElementById("fileInput").style.display="none";
				document.getElementById("fileInputLabel").style.display="none";
				document.getElementById("JenkinsButton").style.display="inline-block";
				document.getElementById("JenkinsLink").style.display="inline-block";
				document.getElementById("JenkinsText").focus();
				document.getElementById("alsoAffectsProd").style.display="inline-block";
				document.getElementById("alsoAffectsProdLabel").style.display="inline-block";
				showClass("JenkinsAll");
				showClassInline("JenkinsBranchAll");
				removeListeners();
			};
			reader.onerror = (e) => alert(e.target.error.name); 
			reader.readAsText(file); 
		}
	} else {
		arrFormattedJenkinsTickets = newListBuilder.split(/\r\n|\n/);
		document.getElementById("JenkinsButton").style.display="inline-block";
		document.getElementById("JenkinsLink").style.display="inline-block";
		document.getElementById("JenkinsOldBuild").style.display="inline-block";
		document.getElementById("JenkinsText").focus();
		document.getElementById("alsoAffectsProd").style.display="inline-block";
		document.getElementById("alsoAffectsProdLabel").style.display="inline-block";
		showClass("JenkinsAll");
		showClassInline("JenkinsBranchAll");
	}
}

// resets arrays
function resetTicketArrays() {
	arrExistingHeadings = new Array();
	arrExistingFoundProd = new Array();
	arrExistingDevbTickets = new Array();
	arrAllJenkinsTickets = new Array();
}

// returns formatted ticket number, if found
function getTicketTitle(tempLine) {
	var mmpiLoc = tempLine.toUpperCase().indexOf("MMPI");
	var m2jvLoc = tempLine.toUpperCase().indexOf("M2JV");
	if (mmpiLoc > -1) {
		return tempLine.substring(mmpiLoc, mmpiLoc + 10);
	} else if (m2jvLoc > -1) {
		return tempLine.substring(m2jvLoc, m2jvLoc + 10);
	} else {
		return "none";
	}
}

// goes to Jenkins changes when button is clicked
function toJenkinsChanges() {
	navigate('https://jenkins-mcc.yrcw.com/job/app/job/mcc-modules/changes', true);
	document.getElementById("JenkinsText").focus();
}

// goes to Gitlab to search for old builds when button is clicked
function toOldBuild() {
	navigate('http://gitlab.yrcw.com/mcc/environment/mcc-environment-prod/merge_requests?scope=all&search=devb&state=merged', true);
	document.getElementById("JenkinsText").focus();
}

// opens input URL in new tab
function navigate(href, newTab) {
	var a = document.createElement('a');
	a.href = href;
	if (newTab) {
		a.setAttribute('target', '_blank');
	}
	a.click();
}

// runs when format button is clicked after entering new tickets
function jenkinsFormat() {
	hideClass("JenkinsAll");
	hideClass("JenkinsBranchAll");
	document.getElementById("JenkinsButton").style.display="none";
	document.getElementById("JenkinsLink").style.display="none";
	document.getElementById("JenkinsOldBuild").style.display="none";
	document.getElementById("alsoAffectsProd").style.display="none";
	document.getElementById("alsoAffectsProdLabel").style.display="none";
	
	if (document.getElementById("alsoAffectsProd").checked == true) {
		swCheckNewTicketsAffectProd = true;
	}
	
	var arrFileLines = new Array();
	var lines = document.getElementById("JenkinsText").value.split(/\r\n|\n/);
	var allText = document.getElementById("JenkinsText").value;
	addTicketsNewBuild = "";
	
	var selectedBranch = document.getElementById("JenkinsBranchOption").value;
	document.getElementById('JenkinsBranchOption').value="release/PreProduction";
	
	if (allText.length != 0) {
		for (var i = 0; i < lines.length; i++) {
			var tempLine = lines[i];
			var selectedBranchLoc = tempLine.indexOf("- Branch [" + selectedBranch + "]");
			var anyBuild = tempLine.indexOf("- Branch [");
			if (anyBuild > -1) {
				var swInSelectedBranch = false;
				if (selectedBranchLoc > -1) {
					swInSelectedBranch = true;
					if (addTicketsNewBuild.length == 0) {
						addTicketsNewBuild = tempLine.substring(tempLine.indexOf("#")+1, selectedBranchLoc-1);
					}
				}
			}
			if (tempLine.length != 0 && tempLine !== "Changes" && swInSelectedBranch && anyBuild < 0) {
				arrFileLines.push(tempLine);
			}
		}
		arrFileLines = cleanupLines(arrFileLines);
		if (arrFileLines.length != 0) {
			if (!swCheckNewTicketsAffectProd) {
				var devbSpacing5 = "";
				var devbSpacing6 = "<br>";
				if (!swAddTicketsToNewList) {
					devbSpacing5 = "<br><br>";
					devbSpacing6 = "";
					var firstHeading = arrExistingHeadings[0];
					var firstHeadingFirstHalf = firstHeading.indexOf("...") + 3;
					firstHeading = firstHeading.substring(0, firstHeadingFirstHalf) + addTicketsNewBuild + " )";
					arrExistingHeadings[0] = firstHeading;
				}
				document.getElementById("optionLabel").innerHTML = "New tickets have been formatted and added to the end of the list.";
				document.getElementById("outputText").innerHTML = arrExistingHeadings.join('<br>') + newListBuilder.split('\n').join('<br>') + devbSpacing5 + "**Production**<br>" + devbSpacing6 +
					arrExistingFoundProd.join('<br>') + devbSpacing5 + "**DevB**<br>" + arrExistingDevbTickets.join('<br>') + "<br><br><br>";
				if (!swAddTicketsToNewList) {
					document.getElementById("outputText").innerHTML += "<br>";
				}
				document.getElementById("outputText").innerHTML += arrFileLines.join('<br>');
			}
		} else {
			document.getElementById("outputText").style.textAlign = "center";
			document.getElementById("outputText").innerHTML = "No changes were found to be formatted.<br><br><br><br>Make sure that you are copying the build headings along with their respective changes.";
		}
	} else {
		document.getElementById("outputText").innerHTML = "You haven't entered anything in the text box! Try again.";
	}
	if (swAddTicketsToNewList && !swCheckNewTicketsAffectProd) {
		swAddTicketsToNewList = false;
		newListBuilder += "**Production**\n\n**DevB**\n\n\n\n" + arrFileLines.join('\n');
		downloadList();
	} else if (swCheckNewTicketsAffectProd) {
		arrFormattedJenkinsTickets.push("");
		for (var i = 0; i < arrFileLines.length; i++) {
			arrFormattedJenkinsTickets.push(arrFileLines[i]);
		}
		affectsProd();
	}
}

// cleans up input line and adds to array if it's not a duplicate
function cleanupLines(lines) {
	var arrFileLines = new Array();
	for (var i = 0; i < lines.length; i++) {
		var tempLine = lines[i];
		if (tempLine.length != 0 && !tempLine.startsWith("*") && !tempLine.toUpperCase().startsWith("X") && !tempLine.startsWith("?")) {
			tempLine = tempLine.replace("[", "");
			tempLine = tempLine.replace("]", "");
			tempLine = tempLine.replace("WIP:", "");
			tempLine = tempLine.substring(0, tempLine.length - 9);
			if (tempLine.toUpperCase().indexOf("ROLLBACK") < 0 && tempLine.toUpperCase().indexOf("REVERT") < 0) {
				tempLine = formatLine(tempLine);
			}
			checkDups(tempLine);
			if (!swFoundDupTicket) {
				if (mmpiTicket.length != 0) {
					arrAllJenkinsTickets.push(mmpiTicket);
				} else if (m2jvTicket.length != 0) {
					arrAllJenkinsTickets.push(m2jvTicket);
				}
				arrFileLines.push(tempLine);
			}
		}
	}
	return arrFileLines;
}

// check if current ticket is a duplicate of existing list
function checkDups(tempLine) {
	var mmpiLoc = tempLine.toUpperCase().indexOf("MMPI");
	var m2jvLoc = tempLine.toUpperCase().indexOf("M2JV");
	mmpiTicket = "";
	m2jvTicket = "";
	if (mmpiLoc > -1) {
		mmpiTicket = tempLine.substring(mmpiLoc, mmpiLoc + 10);
	} else if (m2jvLoc > -1) {
		m2jvTicket = tempLine.substring(m2jvLoc, m2jvLoc + 10);
	}
	swFoundDupTicket = false;
	if (tempLine.toUpperCase().indexOf("ROLLBACK") < 0 && tempLine.toUpperCase().indexOf("REVERT") < 0) {
		for (var t = 0; t < arrAllJenkinsTickets.length; t++) {
			if (mmpiTicket.length != 0) {
				if (arrAllJenkinsTickets[t] === mmpiTicket) {
					swFoundDupTicket = true;
					break;
				}
			} else if (m2jvTicket.length != 0) {
				if (arrAllJenkinsTickets[t] === m2jvTicket) {
					swFoundDupTicket = true;
					break;
				}
			}
		}
	}
}

// formats and returns new line
function formatLine(tempLine) {
	var lineNoSpaces = tempLine.replace(/[ -]/g, "");
	var mmpiLoc = lineNoSpaces.toUpperCase().indexOf("MMPI");
	var m2jvLoc = lineNoSpaces.toUpperCase().indexOf("M2JV");
	if (!tempLine.startsWith("*")) {
		if (mmpiLoc > -1 && tempLine.toUpperCase().indexOf("ROLLBACK") < 0 && tempLine.toUpperCase().indexOf("REVERT") < 0) {
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
		} else if (m2jvLoc > -1 && tempLine.toUpperCase().indexOf("ROLLBACK") < 0 && tempLine.toUpperCase().indexOf("REVERT") < 0) {
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
			mmpiTicket = "";
			m2jvTicket = "";
			tempLine = "* " + tempLine;
		}
	}
	return tempLine;
}

// menu option Check Which New Tickets Affect Prod
function affectsProd() {
	resetScreen();
	document.getElementById("optionLabel").innerHTML = "Check Which New Tickets Affect Prod";
	arrCheckAffectsFoundProd = new Array();
	swMarkBlockersAfterAffectsProd = false;
	swCheckProd = true;
	displayLogin();
	
	if (!swCheckNewTicketsAffectProd) {
		input.addEventListener('change', processFile);
		function processFile() {
			let files = input.files; 
			if (files.length == 0) return; 
			var file = files[0]; 
			let reader = new FileReader();
  
			reader.onload = (e) => {
				var file = e.target.result; 
				arrCheckAffectsFoundProd = file.split(/\r\n|\n/);
				processLines();
				removeListeners();
			}; 
			reader.onerror = (e) => alert(e.target.error.name); 
			reader.readAsText(file); 
		}
	}
}

// check if new tickets affect prod
async function processLines() {
	arrCheckFoundProd = new Array();
	arrCheckProdNoTicket = new Array();
	arrMergeReqLinks = new Array();
	var swDevbTickets = false;
	var blanks = 0;
	arrExistingHeadings = new Array();
	arrExistingFoundProd = new Array();
	arrExistingDevbTickets = new Array();
	var swFoundProd = false;
	for (var i = 0; i < arrCheckAffectsFoundProd.length; i++) {
		var tempLine = arrCheckAffectsFoundProd[i];
		if (tempLine.startsWith("**Production**")) {
			swFoundProd = true;
		} else if (tempLine.startsWith("**DevB**")) {
			swFoundProd = false;
		}
		if (i < 3) {
			if (i == 0 && addTicketsNewBuild.length > 0) {
				var firstHeading = tempLine;
				var firstHeadingFirstHalf = firstHeading.indexOf("...") + 3;
				firstHeading = firstHeading.substring(0, firstHeadingFirstHalf) + addTicketsNewBuild + " )";
				addTicketsNewBuild = "";
				arrExistingHeadings.push(firstHeading);
			} else {
				arrExistingHeadings.push(tempLine);
			}
		}
		if (swFoundProd && tempLine.indexOf("*") > -1 && !tempLine.startsWith("**Production**")) {
			arrExistingFoundProd.push(tempLine);
		} else if (!swFoundProd && tempLine.indexOf("*") > -1 && !tempLine.startsWith("**DevB**") && i >= 3 && blanks == 0) {
			arrExistingDevbTickets.push(tempLine);
		}
		if (tempLine.startsWith("**DevB**")) {
			swDevbTickets = true;
		}
		if (swDevbTickets || swAddTicketsToNewList) {
			if (tempLine.length == 0) {
				blanks++;
			}
			if ((blanks > 0 && tempLine.length > 0)) {
				tempLine = formatLine(tempLine);
				ticketUrlLoc = tempLine.indexOf("https://yrcfreight.atlassian.net/browse");
				var rightParen = tempLine.indexOf(")");
				
				if (ticketUrlLoc > -1) {
					var JiraUrl = tempLine.substring(ticketUrlLoc, rightParen-1);
					await getTicketStatus(JiraUrl);
					var ticketResponse = JiraTicketResponse;
					document.getElementById("loaderLabel").style.display="none";
					document.getElementById("loader").style.display="none";
					if (ticketResponse !== "error") {
						var mergeReqUrlLoc = ticketResponse.lastIndexOf("http://gitlab.yrcw.com/mcc/app/mcc-modules/");
						if (mergeReqUrlLoc > -1) {
							var mergeReqUrl = ticketResponse.substring(mergeReqUrlLoc, mergeReqUrlLoc + 62);
							arrMergeReqLinks.push(mergeReqUrl);
						} else {
							arrMergeReqLinks.push(JiraUrl);
						}
						var jiraTitleLoc = ticketResponse.lastIndexOf("\"summary\":");
						if (jiraTitleLoc > -1) {
							var jiraTitle = ticketResponse.substring(jiraTitleLoc + 11, jiraTitleLoc + 250);
							var titleEndLoc = jiraTitle.indexOf("\",");
							jiraTitle = jiraTitle.substring(0, titleEndLoc);
							var dashLoc = tempLine.indexOf(" — ");
							tempLine = tempLine.substring(0, rightParen+2) + jiraTitle + tempLine.substring(dashLoc, tempLine.length);
						}
						arrCheckFoundProd.push(tempLine);
					} else {
						if (swError404) {
							arrCheckProdNoTicket.push(tempLine);
						} else {
							alert("\nError - something went wrong.");
							break;
						}
					}
				} else {
					arrCheckProdNoTicket.push(tempLine);
				}
			}
		}
	}
	if (ticketResponse === "error" && !swError404) {
		document.getElementById("optionLabel").innerHTML = "Error";
		document.getElementById("outputText").style.textAlign = "center";
		document.getElementById("outputText").innerHTML = "Please make sure you are entering the correct email address and API token for your Jira account.<br><br>" +
			"If this issue persists, send feedback to report a bug with this functionality.";
	} else {
		if (arrCheckFoundProd.length > 0) {
			addTable(arrMergeReqLinks, arrCheckFoundProd);
			document.getElementById("affectsProdBtn").style.display = "block";
			document.getElementById("optionLabel").innerHTML = "Mark the checkbox next to the tickets that affect production, and click done.<br><br>" +
				"You can use the merge request links to determine what programs are being changed, and whether the changes affect production or not.<br>";
			document.getElementById("alsoMarkBlockers").style.display="inline-block";
			document.getElementById("alsoMarkBlockersLabel").style.display="inline-block";
		} else {
			document.getElementById("fileInput").style.display="none";
			document.getElementById("fileInputLabel").style.display="none";
			document.getElementById("affectsProdBtn").style.display = "block";
			document.getElementById("optionLabel").innerHTML = "No items were found with ticket numbers.<br><br>Click done to continue.";
		}
	}
}

// display table of new tickets with merge request and checkbox
function addTable(MergeRequests, JiraTickets) {
	var myTableDiv = document.getElementById("myDynamicTable");
	var table = document.createElement('TABLE');
	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);
	
	var trh = document.createElement('TR');
	tableBody.appendChild(trh);
	for (var h = 0; h < 3; h++) {
		var th = document.createElement('TH');
		th.setAttribute("style", "border-bottom:1px solid black;");
		if (h == 0) {
			th.appendChild(document.createTextNode("Affects Prod?"));
		} else if (h == 1) {
			th.appendChild(document.createTextNode("Merge Request"));
		} else {
			th.appendChild(document.createTextNode("Jira Ticket"));
		}
		trh.appendChild(th);
	}
	
	for (var i = 0; i < JiraTickets.length; i++) {
		var tr = document.createElement('TR');
		tableBody.appendChild(tr);
		
		for (var j = 0; j < 3; j++) {
			var swNoMerge;
			var swJiraswNoMerge = false;
			var currentMerge = MergeRequests[i]
			if (currentMerge.toUpperCase() === "NONE FOUND") {
				swNoMerge = true;
			} else if (currentMerge.toUpperCase().indexOf("ATLASSIAN") > -1) {
				swJiraswNoMerge = true;
			} else {
				swNoMerge = false;
			}
			var td = document.createElement('TD');
			if (j == 0) {
				var newCheckBox = document.createElement('input');
				newCheckBox.type = 'checkbox';
				newCheckBox.id = 'prodChk' + i;
				newCheckBox.setAttribute("style", "display:inline-block; margin-top:0px");
				newCheckBox.value = "affects";
				td.appendChild(newCheckBox);
			} else if (j == 1) {
				td.style.textAlign = "left";
				if (swNoMerge) {
					const anchor = document.createElement('a');
					anchor.className = 'linksToChangeColor';
					anchor.href = "http://gitlab.yrcw.com/mcc/app/mcc-modules/merge_requests?scope=all&state=merged";
					anchor.innerText = "None found, search here";
					anchor.target = "_blank";
					td.appendChild(anchor);
				} else if (swJiraswNoMerge) {
					var mmpiTitleLoc = currentMerge.toUpperCase().indexOf("MMPI");
					var m2jvTitleLoc = currentMerge.toUpperCase().indexOf("M2JV");
					const anchor = document.createElement('a');
					if (mmpiTitleLoc > -1) {
						currentMerge = currentMerge.substring(mmpiTitleLoc, currentMerge.length);
					} else {
						currentMerge = currentMerge.substring(m2jvTitleLoc, currentMerge.length);
					}
					var ticketNum = currentMerge.substring(currentMerge.indexOf("-")+1, currentMerge.length);
					anchor.className = 'linksToChangeColor';
					anchor.href = "http://gitlab.yrcw.com/mcc/app/mcc-modules/merge_requests?scope=all&utf8=%E2%9C%93&state=merged&search=" + ticketNum;
					anchor.innerText = "None found, search here";
					anchor.target = "_blank";
					td.appendChild(anchor);
				} else {
					const anchor = document.createElement('a');
					anchor.className = 'linksToChangeColor';
					anchor.href = currentMerge + "/diffs";
					anchor.innerText = "Merge Request !" + currentMerge.substring(currentMerge.indexOf("merge_requests/")+15, currentMerge.length);
					anchor.target = "_blank";
					td.appendChild(anchor);
				}
			} else {
				td.style.textAlign = "left";
				td.appendChild(document.createTextNode(JiraTickets[i]));
			}
			tr.appendChild(td);
		}
	}
	myTableDiv.appendChild(table);
	var links = document.getElementsByClassName("linksToChangeColor");
	for (var i = 0; i < links.length; i++) {
		links[i].addEventListener('click', changeLinkColor);
	}
}

function changeLinkColor(e) {
	e.target.style.color = 'red';
}

// runs after done button is clicked to check if changes affect prod
async function submitAffectsProd() {
	document.getElementById("alsoMarkBlockers").style.display="none";
	document.getElementById("alsoMarkBlockersLabel").style.display="none";
	document.getElementById("myDynamicTable").style.display = "none";
	document.getElementById("affectsProdBtn").style.display = "none";
	if (!swCheckNewTicketsAffectProd && !document.getElementById("alsoMarkBlockers").checked) {
		document.getElementById("optionLabel").innerHTML = "The new tickets on the list have been formatted and sorted as either Production or DevB.";
	} else {
		document.getElementById("optionLabel").innerHTML = "Mark All Prod Blockers";
	}
	var arrCheckedAsProd = new Array();
	arrNotCheckedAsProd = new Array();

	for (var i = 0; i < arrCheckFoundProd.length; i++) {
		if (document.getElementById("prodChk" + i).checked == true) {
			arrCheckedAsProd.push(markLabel(arrCheckFoundProd[i], false));
		} else {
			arrNotCheckedAsProd.push(arrCheckFoundProd[i]);
		}
	}
	
	var arrListToDownload = new Array();
	if (!swAddTicketsToNewList) {
		arrListToDownload.push("**Production**");
		for (var i = 0; i < arrCheckedAsProd.length; i++) {
			arrListToDownload.push(arrCheckedAsProd[i]);
		}
		arrListToDownload.push("");
		arrListToDownload.push("**DevB**");
		for (var i = 0; i < arrNotCheckedAsProd.length; i++) {
			arrListToDownload.push(arrNotCheckedAsProd[i]);
		}
	} else {
		for (var i = 0; i < arrExistingHeadings.length; i++) {
			arrListToDownload.push(arrExistingHeadings[i]);
		}
		arrListToDownload.push("");
		arrListToDownload.push("**Production**");
		for (var i = 0; i < arrCheckedAsProd.length; i++) {
			arrListToDownload.push(arrCheckedAsProd[i]);
		}
		arrListToDownload.push("");
		arrListToDownload.push("**DevB**");
		for (var i = 0; i < arrNotCheckedAsProd.length; i++) {
			arrListToDownload.push(arrNotCheckedAsProd[i]);
		}
	}
	
	arrTicketsMarkedBlockers = new Array();
	if (document.getElementById("alsoMarkBlockers").checked == true) {
		swMarkBlockersAfterAffectsProd = true;
	}
	swFoundProdSection = false;
	for (var i = 0; i < arrListToDownload.length; i++) {
		var tempLine = arrListToDownload[i];
		await lookForProd(tempLine);
		if (JiraTicketResponse === "error") {
			break;
		}
	}
	markProdMessages();
	if (swCheckNewTicketsAffectProd && swAddTicketsToNewList) {
		swCheckNewTicketsAffectProd = false;
		swAddTicketsToNewList = false;
		for (var i = 0; i < arrExistingHeadings.length; i++) {
			if (i == 0) {
				newListBuilder = arrExistingHeadings[i];
			} else {
				newListBuilder += '\n' + arrExistingHeadings[i];
			}
		}
		for (var i = 0; i < arrTicketsMarkedBlockers.length; i++) {
			if (i == 0) {
				newListBuilder += '\n\n' + arrTicketsMarkedBlockers[i];
			} else {
				newListBuilder += '\n' + arrTicketsMarkedBlockers[i];
			}
		}
		newListBuilder += "\n**DevB**\n";
		newListBuilder += arrNotCheckedAsProd.join('\n');
		if (arrCheckProdNoTicket.length > 0) {
			var devbSpacing4 = "";
			if (arrNotCheckedAsProd.length > 0) {
				devbSpacing4 = "\n\n\n\n";
			} else {
				devbSpacing4 = "\n\n\n";
			}
			newListBuilder += devbSpacing4 + arrCheckProdNoTicket.join('\n');
		}
		downloadList();
	}
}

// display list with tickets in production or devb section
function markProdMessages() {
	if (JiraTicketResponse === "error") {
		document.getElementById("optionLabel").innerHTML = "Error";
		document.getElementById("outputText").style.textAlign = "center";
		document.getElementById("outputText").innerHTML = "Please make sure you are entering the correct email address and API token for your Jira account.<br><br>" +
			"If this issue persists, send feedback to report a bug with this functionality.";
	} else {
		if (swCheckProd && !swAddTicketsFromJenkins) {
			var devbSpacing = "";
			if (arrNotCheckedAsProd.length > 0) {
				devbSpacing = "<br>";
			}
			document.getElementById("optionLabel").innerHTML = "Tickets have been sorted as either Production or DevB and added to the appropriate group.";
			if (swMarkBlockersAfterAffectsProd) {
				document.getElementById("optionLabel").innerHTML += "<br><br>Production tickets that have a status other than Done have been marked with an \"X\" and added to the ticket list.";
			}
			document.getElementById("outputText").innerHTML = arrExistingHeadings.join('<br>') + "<br><br>" + arrTicketsMarkedBlockers.join('<br/>') + arrExistingFoundProd.join('<br>') +
				"<br><br>**DevB**" + devbSpacing + arrNotCheckedAsProd.join('<br>') + "<br>" + arrExistingDevbTickets.join('<br>');
			if (arrCheckProdNoTicket.length > 0) {
				document.getElementById("outputText").innerHTML += "<br><br><br><br>" + arrCheckProdNoTicket.join('<br/>');
			}
		} else if (swCheckProd && swAddTicketsFromJenkins) {
			var devbSpacing = "<br>";
			var devbSpacing2 = "<br>";
			var devbSpacing3 = "";
			if (!swAddTicketsToNewList) {
				devbSpacing += "<br>";
				if (arrNotCheckedAsProd.length == 0) {
					devbSpacing2 = "";
				}
			}
			if (arrNotCheckedAsProd.length > 0) {
				devbSpacing3 = "<br><br><br>";
			} else {
				devbSpacing3 = "<br><br>";
			}
			document.getElementById("optionLabel").innerHTML = "Tickets have been sorted as either Production or DevB and added to the appropriate group.";
			document.getElementById("outputText").innerHTML = arrExistingHeadings.join('<br>') + "<br><br>" + arrTicketsMarkedBlockers.join('<br/>') + arrExistingFoundProd.join('<br>') +
				devbSpacing + "**DevB**" + devbSpacing2 + arrNotCheckedAsProd.join('<br>') + "<br>" + arrExistingDevbTickets.join('<br>');
			if (arrCheckProdNoTicket.length > 0) {
				document.getElementById("outputText").innerHTML += devbSpacing3;
				if (!swAddTicketsToNewList) {
					if (arrNotCheckedAsProd.length > 0) {
						document.getElementById("outputText").innerHTML += "<br>";
					} else {
						document.getElementById("outputText").innerHTML += "<br><br>";
					}
				}
				document.getElementById("outputText").innerHTML += arrCheckProdNoTicket.join('<br/>');
			}
		} else if (!swCheckProd) {
			document.getElementById("optionLabel").innerHTML = "Production tickets that have a status other than Done have been marked with an \"X\"";
			document.getElementById("outputText").innerHTML = arrTicketsMarkedBlockers.join('<br/>');
		}
	}
}

// menu option Mark All Prod Blockers
function markBlockers() {
	resetScreen();
	swCheckNewTicketsAffectProd = false;
	document.getElementById("optionLabel").innerHTML = "Mark All Prod Blockers";
	displayLogin();
	swMarkBlockersAfterAffectsProd = true;
	
	input.addEventListener('change', processFile);
	function processFile() {
		let files = input.files; 
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = async (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			arrTicketsMarkedBlockers = new Array();
			swFoundProdSection = false;
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				await lookForProd(tempLine);
				if (JiraTicketResponse === "error") {
					break;
				}
			}
			markProdMessages();
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

// looks for prod tickets, and processes those tickets if found
async function lookForProd(tempLine) {
	if (tempLine.startsWith("**Production**")) {
		swFoundProdSection = true;
	} else if (tempLine.startsWith("**DevB**")) {
		swFoundProdSection = false;
	}
	if (swFoundProdSection) {
		await processMarking(tempLine);
	}
}

// check status of Jira ticket
async function processMarking(tempLine) {
	if (tempLine.toUpperCase().startsWith("X")) {
		tempLine = tempLine.substring(2, tempLine.length);
	}
	var ticketUrlLoc = tempLine.indexOf("https://yrcfreight.atlassian.net/browse");
	var rightParen = tempLine.indexOf(")");
	if (ticketUrlLoc > -1 && swMarkBlockersAfterAffectsProd) {
		var JiraUrl = tempLine.substring(ticketUrlLoc, rightParen-1);
		await getTicketStatus(JiraUrl);
		var ticketResponse = JiraTicketResponse;
		document.getElementById("loaderLabel").style.display="none";
		document.getElementById("loader").style.display="none";
		if (JiraTicketResponse !== "error") {
			var statusLoc = ticketResponse.lastIndexOf("\"status\":");
			var ticketStatus = ticketResponse.substring(statusLoc, statusLoc + 250);
			var ticketStatusStartLoc = ticketStatus.indexOf("\"name\":") + 8;
			var ticketStatusEndLoc = ticketStatus.indexOf("\"id\":") - 2;
			ticketStatus = ticketStatus.substring(ticketStatusStartLoc, ticketStatusEndLoc);
			if (ticketStatus.toUpperCase() !== "DONE" && ticketStatus.toUpperCase() !== "MIGRATED TO PROD") {
				tempLine = "X " + tempLine;
			}
			arrTicketsMarkedBlockers.push(tempLine);
		} else {
			alert("\nError - something went wrong.");
			JiraTicketResponse = "error";
		}
	} else {
		arrTicketsMarkedBlockers.push(tempLine);
	}
}

// show Jira login
function displayLogin() {
	var tokenLink = createLink("https://id.atlassian.com/manage-profile/security/api-tokens", "HERE");
	document.getElementById("outputText").innerHTML = "To use this functionality, enter your Jira email address and API token below and click submit." +
														"<br><br>If you don't have an API token yet, go " + tokenLink + " to create one.<br><br>";
	document.getElementById("username").value='';
	document.getElementById("pass").value='';												
	document.getElementById("username").style.display="inline";
	document.getElementById("userLabel").style.display="inline";
	document.getElementById("pass").style.display="inline";
	document.getElementById("passLabel").style.display="inline";
	document.getElementById("username").focus();
	document.getElementById("loginBtn").style.display="block";
}

// runs after clicking submit to login with Jira credentials
function submitLogin() {
	user = document.getElementById("username").value;
	pwd = document.getElementById("pass").value;
	if (user.length == 0 || pwd.length == 0) {
		alert("\nEmail address and API token are required!");
		if (user.length == 0) {
			document.getElementById("username").focus();
		} else {
			document.getElementById("pass").focus();
		}
		return;
	}
	document.getElementById("outputText").innerHTML="";
	document.getElementById("fileInput").style.display="inline";
	document.getElementById("fileInputLabel").style.display="inline";
	hideClass("loginInput");
	document.getElementById("loginBtn").style.display="none";
	if (swCheckNewTicketsAffectProd) {
		arrCheckAffectsFoundProd = arrFormattedJenkinsTickets;
		processLines();
	}
}

// returns Jira ticket status
async function getTicketStatus(tempTicketUrl) {
	document.getElementById("fileInput").style.display="none";
	document.getElementById("fileInputLabel").style.display="none";
	document.getElementById("loaderLabel").style.display="block";
	document.getElementById("loader").style.display="block";
	swError404 = false;
	var myHeaders = new Headers();
	var separator = ":";
	var wholeAuthorization = "Basic " + btoa(user + separator + pwd);
	myHeaders.append("Authorization", wholeAuthorization);
	myHeaders.append("Origin", "*");

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'manual'
	};
	
	var ticketUrlLoc = tempTicketUrl.indexOf("browse/") + 7;
	var ticketNum = tempTicketUrl.substring(ticketUrlLoc, tempTicketUrl.length);
	var ticketUrl = "https://yrcfreight.atlassian.net/rest/api/2/issue/" + ticketNum;
	var wholeUrl = "https://jesse-cors-proxy.herokuapp.com/" + ticketUrl;
	const response = await fetch(wholeUrl, requestOptions)
		.then(async function(response) {
			if(response.status!==200) {
				if (response.status==404) {
					swError404 = true;
				}
				throw new Error(response.status)
			} else {
				const JiraResponse = await response.text();
				JiraTicketResponse = JiraResponse;
			}
		})
		.catch(function(error) {
			JiraTicketResponse = "error";
		});
}

// menu option Check Blockers for Validation
function checkBlockers() {
	resetScreen();
	swCheckNewTicketsAffectProd = false;
	document.getElementById("optionLabel").innerHTML = "Check Blockers for Validation";
	displayLogin();
	
	input.addEventListener('change', processFile);
	function processFile() {
		let files = input.files;
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = async (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var arrFileLines = new Array();
			var arrBlockerTicketNums = new Array();
			var arrBlockerTicketLinks = new Array();
			arrBlockerNamesAndTickets = new Array();
			var validatedCount = 0;
			var swFoundProd = false;
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				if (tempLine.startsWith("**Production**")) {
					swFoundProd = true;
				} else if (tempLine.startsWith("**DevB**")) {
					swFoundProd = false;
				}
				if (swFoundProd) {
					if (tempLine.startsWith("X")) {
						tempLine = tempLine.substring(2, tempLine.length);
						var ticketUrlLoc = tempLine.indexOf("https://yrcfreight.atlassian.net/browse");
						var rightParen = tempLine.indexOf(")");
						if (ticketUrlLoc > -1) {
							var JiraUrl = tempLine.substring(ticketUrlLoc, rightParen-1);
							await getTicketStatus(JiraUrl);
							var ticketResponse = JiraTicketResponse;
							document.getElementById("loaderLabel").style.display="none";
							document.getElementById("loader").style.display="none";
							if (ticketResponse !== "error") {
								var statusLoc = ticketResponse.lastIndexOf("\"status\":");
								var ticketStatus = ticketResponse.substring(statusLoc, statusLoc + 250);
								var ticketStatusStartLoc = ticketStatus.indexOf("\"name\":") + 8;
								var ticketStatusEndLoc = ticketStatus.indexOf("\"id\":") - 2;
								ticketStatus = ticketStatus.substring(ticketStatusStartLoc, ticketStatusEndLoc);
								if (ticketStatus.toUpperCase() !== "DONE" && ticketStatus.toUpperCase() !== "MIGRATED TO PROD") {
									var ticketNum = JiraUrl.substring(JiraUrl.length-10, rightParen-1);
									tempLine = "X " + tempLine;
									arrBlockerTicketNums.push(ticketNum);
									arrBlockerTicketLinks.push(JiraUrl);
									if (ticketStatus.toUpperCase() === "PROMOTED" || ticketStatus.toUpperCase() === "VALIDATE") {
										// save names for validation email
										var reporterStartLoc = ticketResponse.indexOf("\"reporter\":");
										var reporter = ticketResponse.substring(reporterStartLoc, reporterStartLoc + 1300);
										var reporterEmailStartLoc = reporter.indexOf("\"emailAddress\":") + 16;
										var reporterEmail = reporter.substring(reporterEmailStartLoc, reporterEmailStartLoc + 60);
										var reporterEmailEndLoc = reporterEmail.indexOf("\",");
										var reporterEmail = reporterEmail.substring(0, reporterEmailEndLoc);
										var reporterNameStartLoc = reporter.indexOf("\"displayName\":") + 15;
										var reporterName = reporter.substring(reporterNameStartLoc, reporterNameStartLoc + 60);
										var reporterNameEndLoc = reporterName.indexOf("\",");
										var reporterName = reporterName.substring(0, reporterNameEndLoc);
										var jiraTitleLoc = ticketResponse.lastIndexOf("\"summary\":");
										var jiraTitle = ticketResponse.substring(jiraTitleLoc + 11, jiraTitleLoc + 250);
										var titleEndLoc = jiraTitle.indexOf("\",");
										jiraTitle = jiraTitle.substring(0, titleEndLoc);
										var arrNameAndTicket = [reporterName, jiraTitle, ticketNum, JiraUrl, reporterEmail];
										arrBlockerNamesAndTickets.push(arrNameAndTicket);
									}
								}
								arrFileLines.push(tempLine);
							} else {
								alert("\nError - something went wrong.");
								break;
							}
						} else {
							arrFileLines.push(tempLine);
						}
					} else {
						arrFileLines.push(tempLine);
					}
				}
			}
			if (ticketResponse === "error") {
				document.getElementById("optionLabel").innerHTML = "Error";
				document.getElementById("outputText").style.textAlign = "center";
				document.getElementById("outputText").innerHTML = "Please make sure you are entering the correct email address and API token for your Jira account.<br><br>" +
																	"If this issue persists, send feedback to report a bug with this functionality.";
			} else {
				if (arrBlockerTicketNums.length > 0) {
					var arrBlockersOutput = new Array();
					for (var i = 0; i < arrBlockerTicketNums.length; i++) {
						arrBlockersOutput.push(createLink(arrBlockerTicketLinks[i], arrBlockerTicketNums[i]));
					}
					document.getElementById("optionLabel").innerHTML = "The remaining PROD blockers are shown below.";
					if (arrBlockersOutput.length != 1) {
						document.getElementById("outputText").innerHTML = "There are " + arrBlockersOutput.length + " blockers left:<br/>";
					} else {
						document.getElementById("outputText").innerHTML = "There is " + arrBlockersOutput.length + " blocker left:<br/>";
					}
					document.getElementById("outputText").innerHTML += arrBlockersOutput.join('<br/>');
					document.getElementById("outputText").innerHTML += "<br/><br/><br/>";
					document.getElementById("outputText").innerHTML += arrFileLines.join('<br/>');
					document.getElementById("validationEmailButton").style.display="block";
				} else {
					document.getElementById("fileInput").style.display="none";
					document.getElementById("fileInputLabel").style.display="none";
					document.getElementById("optionLabel").innerHTML = "There are no pending PROD blockers on this list.<br/><br/>Blockers must start with an \"X\" for this option to work.";
				}
			}
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

// send email to the reporter on blocker tickets
async function sendValidationEmail() {
	resetScreen();
	var to = "";
	var cc = "Jessie.Ferguson@myYellow.com;Jesse.Nickchen@myYellow.com;Todd.Moore@myYellow.com;Ryan.Dorner@myYellow.com;Colston.Erwin@myYellow.com";
	var subject = "Jira Tickets Blocking MCC-Prod Deploy";
	
	var arrEmailMessage = new Array();
	arrEmailMessage.push("All,");
	arrEmailMessage.push("");
	arrEmailMessage.push("You are receiving this email because you are the reporter for a Jira ticket with a status of <i>Promoted</i> or <i>Validate</i>.");
	arrEmailMessage.push("");
	arrEmailMessage.push("The program(s) being changed for this ticket are enabled in MCC-Prod, so until this ticket is validated it is blocking the next production deployment.");
	arrEmailMessage.push("Below is the list of tickets that need to be validated, along with the reporter's name.");
	arrEmailMessage.push("");
	arrEmailMessage.push("For each ticket by your name, please either test the relevant changes yourself or reach out to somebody who can test them.");
	arrEmailMessage.push("Any of these tickets that cannot be validated by the time of the next deployment will need to be reverted from DevB.");
	arrEmailMessage.push("The next deployment is tentatively scheduled for [DATE].");
	arrEmailMessage.push("");
	arrEmailMessage.push("Tickets");
	
	for (var i = 0; i < arrBlockerNamesAndTickets.length; i++) {
		var reporterName = arrBlockerNamesAndTickets[i][0];
		var reporterEmail = arrBlockerNamesAndTickets[i][4];
		var ticketTitle = arrBlockerNamesAndTickets[i][1];
		var ticketNum = arrBlockerNamesAndTickets[i][2];
		var ticketUrl = arrBlockerNamesAndTickets[i][3];
		arrEmailMessage.push(bullet + reporterName + ": " + createLink(ticketUrl, ticketNum) + " - " + ticketTitle);
		if (to.length == 0) {
			to = reporterEmail;
		} else {
			if (to.indexOf(reporterEmail) < 0 && cc.toUpperCase().indexOf(reporterEmail.toUpperCase()) < 0) { 
				to += ";" + reporterEmail;
			}
		}
	}
	
	arrEmailMessage.push("");
	arrEmailMessage.push("Please contact anybody CC'd on this email if you have any questions!");
	document.getElementById("outputText").innerHTML = arrEmailMessage.join('<br/>');
	var screenOutput = document.getElementById("outputText").innerHTML;
	window.location.href = "mailto:" + to + "?cc=" + cc + "&subject=" + subject;
}

// menu option Add "PROD" Label to Tickets
function addProdLabel() {
	resetScreen();
	swCheckNewTicketsAffectProd = false;
	document.getElementById("fileInput").style.display="inline";
	document.getElementById("fileInputLabel").style.display="inline";
	document.getElementById("optionLabel").innerHTML = "Add \"PROD\" Label to Tickets";
	
	input.addEventListener('change', processFile);
	function processFile() {
		let files = input.files; 
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = async (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var arrFileLines = new Array();
			swFoundProdSection = false;
			swFoundswFoundProd = false;
			
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				tempLine = markLabel(tempLine, true);
				if (swFoundProdSection) {
					arrFileLines.push(tempLine);
				}
			}
			if (swFoundswFoundProd) {
				document.getElementById("optionLabel").innerHTML = "The \"PROD\" label has been added to all Production tickets that did not already have it.";
				document.getElementById("outputText").innerHTML = arrFileLines.join('<br/>');
			} else {
				document.getElementById("optionLabel").innerHTML = "There are no production tickets on this list.";
			}
			document.getElementById("fileInput").style.display="none";
			document.getElementById("fileInputLabel").style.display="none";
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

// if input ticket is production, add the PROD label unless it already has it
function markLabel(tempLine, checkIfProd) {
	if (tempLine.startsWith("**Production**")) {
		swFoundProdSection = true;
	} else if (tempLine.startsWith("**DevB**")) {
		swFoundProdSection = false;
	}
	
	if (swFoundProdSection || !checkIfProd) {
		if (!tempLine.startsWith("**Production**") && tempLine.indexOf("*") > -1) {
			swFoundswFoundProd = true;
		}
		if (tempLine.toUpperCase().indexOf("PROD") > -1) {
			tempLine = tempLine.replace(" PROD", "");
		}
		var ticketUrlLoc = tempLine.indexOf("https://yrcfreight.atlassian.net/browse");
		if (tempLine.length > 0 && !tempLine.startsWith("**Production**")) {
			if (ticketUrlLoc > -1) {
				var rightParen = tempLine.indexOf(")");
				tempLine = tempLine.substring(0, rightParen+1) + " PROD" + tempLine.substring(rightParen+1, tempLine.length);
			} else {
				var asteriskLoc = tempLine.indexOf("*");
				tempLine = tempLine.substring(0, asteriskLoc+1) + " PROD" + tempLine.substring(asteriskLoc+1, tempLine.length);
			}
		}
	}
	return tempLine;
}

// menu option Format List for Merge Request
function merge() {
	resetScreen();
	swCheckNewTicketsAffectProd = false;
	document.getElementById("fileInput").style.display="inline";
	document.getElementById("fileInputLabel").style.display="inline";
	document.getElementById("optionLabel").innerHTML = "Format List for Merge Request";
	
	input.addEventListener('change', processFile);
	function processFile() {
		let files = input.files; 
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var arrFileLines = new Array();
			var swFoundBlank = false;
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				if (tempLine.startsWith("* [Previous") || tempLine.startsWith("* [CHG")) {
					arrFileLines.push(tempLine);
					swFoundBlank = false;
				} else if (tempLine.length == 0) {
					if (swFoundBlank == false) {
						arrFileLines.push(tempLine);
						swFoundBlank = true;
					}
				} else if (!tempLine.startsWith("* [Merge")) {
					var starLoc = tempLine.indexOf("*");
					tempLine = tempLine.substring(starLoc, tempLine.length);
					arrFileLines.push(tempLine);
					swFoundBlank = false;
				} else if (tempLine.startsWith("* [Merge")) {
					var urlLoc = tempLine.indexOf("http://gitlab.yrcw.com/mcc");
					if (urlLoc > -1) {
						document.getElementById("goToMergeRequest").style.display="block";
						mergeUrl = tempLine.substring(urlLoc, tempLine.indexOf(")") -1);
					} else {
						document.getElementById("newMergeRequest").style.display="block";
					}
				}
			}
			if (arrFileLines.length == 0) {
				document.getElementById("outputText").innerHTML = "There are no tickets on this list.";
			} else {
				document.getElementById("outputText").innerHTML = arrFileLines.join('<br/>');
			}
			document.getElementById("fileInput").style.display="none";
			document.getElementById("fileInputLabel").style.display="none";
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

// menu option Format List for Change Task
function changeTask() {
	resetScreen();
	swCheckNewTicketsAffectProd = false;
	document.getElementById("fileInput").style.display="inline";
	document.getElementById("fileInputLabel").style.display="inline";
	document.getElementById("optionLabel").innerHTML = "Format List for Change Task";
	
	input.addEventListener('change', processFile);
	function processFile() {
		let files = input.files; 
		if (files.length == 0) return; 
		var file = files[0]; 
		let reader = new FileReader();
  
		reader.onload = (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var arrFileLines = new Array();
			var swFoundBlank = false;
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				var leftParen = tempLine.indexOf("(");
				var rightParen = tempLine.indexOf(")");
				var leftBracket = tempLine.indexOf("[");
				var rightBracket = tempLine.indexOf("]");
				if (!tempLine.startsWith("* [Previous") && !tempLine.startsWith("* [CHG") && !tempLine.startsWith("* [Merge") && !tempLine.length == 0) {
					if (tempLine.startsWith("**Production**")) {
						arrFileLines.push("Production");
					} else if (tempLine.startsWith("**DevB**")) {
						arrFileLines.push("");
						arrFileLines.push("DevB");
					} else {
						var mmpiLoc = tempLine.toUpperCase().indexOf("MMPI");
						var m2jvLoc = tempLine.toUpperCase().indexOf("M2JV");
						if (mmpiLoc < 0 && m2jvLoc < 0 && !tempLine.length == 0) {
							tempLine = tempLine.substring(2, tempLine.length);
							arrFileLines.push(tempLine);
						} else if (tempLine.length != 0) {
							var ticketTitle = tempLine.substring(leftBracket+1, rightBracket);
							tempLine = ticketTitle + tempLine.substring(rightParen+1, tempLine.length);
							arrFileLines.push(tempLine);
						}
					}
				} else if (tempLine.startsWith("* [CHG")) {
					if (tempLine.indexOf("CHG URL HERE") < 0) {
						document.getElementById("goToChangeRequest").style.display="block";
						changeUrl = tempLine.substring(tempLine.indexOf("https://yrcw.service-now"), tempLine.indexOf(")")-1);
					} else {
						document.getElementById("newChangeRequest").style.display="block";
					}
				}
			}
			if (arrFileLines.length == 0) {
				document.getElementById("outputText").innerHTML = "There are no tickets on this list.";
			} else {
				document.getElementById("outputText").innerHTML = arrFileLines.join('<br/>');
			}
			document.getElementById("fileInput").style.display="none";
			document.getElementById("fileInputLabel").style.display="none";
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

// menu option Format List for Email
function email() {
	resetScreen();
	swCheckNewTicketsAffectProd = false;
	document.getElementById("fileInput").style.display="inline";
	document.getElementById("fileInputLabel").style.display="inline";
	document.getElementById("optionLabel").innerHTML = "Format Existing List for Email";
	
	input.addEventListener('change', processFile);
	function processFile() {
		let files = input.files;
		if (files.length == 0) return;
		var file = files[0];
		let reader = new FileReader();
  
		reader.onload = (e) => {
			var file = e.target.result; 
			var lines = file.split(/\r\n|\n/);
			var arrFileLines = new Array();
			arrFileLines.push("All,");
			arrFileLines.push("");
			var nextBusDay = getNextBusDay();
			var nextDate = new Date();
			var dayOfWeek = getDayOfWeek(nextDate.getDay() + getDayOffset());
			arrFileLines.push("MCC Production will be updated " + dayOfWeek + " " + nextBusDay + " at approximately 7:00 AM CDT.");
			arrFileLines.push("Tickets listed under the \"DevB\" heading do not have an impact to Production.");
			arrFileLines.push("");
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				var leftParen = tempLine.indexOf("(");
				var rightParen = tempLine.indexOf(")");
				var leftBracket = tempLine.indexOf("[");
				var rightBracket = tempLine.indexOf("]");
				if (tempLine.startsWith("* [Previous") || tempLine.startsWith("* [CHG")) {
					var linkTitle = tempLine.substring(leftBracket+1, rightBracket);
					var newLink = createLink(tempLine.substring(leftParen+1, rightParen), linkTitle);
					tempLine = bullet + newLink;
					arrFileLines.push(tempLine);
				} else if (tempLine.startsWith("* [Merge")) {
					var linkTitle = tempLine.substring(leftBracket+1, rightBracket);
					var newLink = createLink(tempLine.substring(leftParen+1, rightParen), linkTitle);
					tempLine = bullet + newLink + tempLine.substring(rightParen+1, tempLine.length);
					arrFileLines.push(tempLine);
				} else {
					var mmpiLoc = tempLine.toUpperCase().indexOf("MMPI");
					var m2jvLoc = tempLine.toUpperCase().indexOf("M2JV");
					if (tempLine.startsWith("**DevB**")) {
						arrFileLines.push("");
						arrFileLines.push("DevB");
					} else if (tempLine.startsWith("**Production**")) {
						arrFileLines.push("");
						arrFileLines.push("Production");
					} else if (mmpiLoc < 0 && m2jvLoc < 0 && !tempLine.length == 0) {
						tempLine = bullet + tempLine.substring(2, tempLine.length);
						arrFileLines.push(tempLine);
					} else if (tempLine.length != 0) {
						var ticketTitle = tempLine.substring(leftBracket+1, rightBracket);
						var ticketLink = createLink(tempLine.substring(leftParen+1, rightParen), ticketTitle);
						tempLine = bullet + ticketLink + tempLine.substring(rightParen+1, tempLine.length);
						arrFileLines.push(tempLine);
					}
				}
			}
			document.getElementById("outputText").innerHTML = arrFileLines.join('<br/>');
			document.getElementById("oopEmail").style.display="inline-block";
			document.getElementById("oopEmailLabel").style.display="inline-block";
			document.getElementById("oopEmailLabel").style.paddingTop="30px";
			document.getElementById("emailButton").style.display="block";
			document.getElementById("fileInput").style.display="none";
			document.getElementById("fileInputLabel").style.display="none";
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

// remove event listeners for input file
function removeListeners() {
	var old_element = document.getElementById("fileInput");
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
}

// opens new email template for deployment notification
function sendEmail() {
	var to = "ITModernizationNotifications@yrcw.com";
	var cc = "YT_Solution_Services@yrcfreight.com;Josh.Green@myYellow.com;Laura.Smith@myYellow.com";
	var subject = "MCC Production Deployment";
	if (document.getElementById("oopEmail").checked == true) {
		to += ";Gavin.Clyma@myYellow.com;Doug.Deppen@myYellow.com;Joanna.Rench@myYellow.com;Rob.Pendergast@myYellow.com;Tony.Thompson@myYellow.com;Derrin.Holloway@myYellow.com;theresa.bashore@myYellow.com";
		cc += ";oopscrummasters@yrcw.com;OOP_Tech_Leads@yrcw.com";
		subject += " (OOP)";
	}
	var screenOutput = document.getElementById("outputText").innerHTML;
	window.location.href = "mailto:" + to + "?cc=" + cc + "&subject=" + subject;
}

// return date of next business day
function getNextBusDay() {
	var nextDate = new Date();
	var offset = getDayOffset();
	nextDate.setDate(nextDate.getDate() + offset);
	let year = nextDate.getFullYear();
	let month = (1 + nextDate.getMonth()).toString().padStart(2, '0');
	let day = nextDate.getDate().toString().padStart(2, '0');
	return month + '/' + day + '/' + year;
}

// return day of the week
function getDayOfWeek(day) {
	const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return weekday[day];
}

// return offset for deploy day
function getDayOffset() {
	var nextDate = new Date();
	var offset = 1;
	if (nextDate.getDay() == 5) {
		offset = 3;
	}
	return offset;
}

// opens email template to send feedback about tool
function sendFeedback() {
	if (confirm("\nClick OK below to open a new email.\n\nFeel free to share any feedback such as discovered bugs or suggestions for improvements.")) {
		var to = "jesse.nickchen@myyellow.com";
		var subject = "Ticket List Formatting Tool Feedback";
		window.location.href = "mailto:" + to + "?subject=" + subject;
	} else {
		resetScreen();
		document.getElementById("optionLabel").innerHTML = "Send Feedback";
		document.getElementById("outputText").innerHTML = "You clicked cancel!";
	}
}

// displays all elements of specified class
function showClass(className) {
	var x = document.getElementsByClassName(className);
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display="block";
	}
}

// displays all elements of specified class in-line
function showClassInline(className) {
	var x = document.getElementsByClassName(className);
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display="inline-block";
	}
}

// hides all elements of specified class
function hideClass(className) {
	var x = document.getElementsByClassName(className);
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display="none";
	}
}

// returns clickable link from input URL
function createLink(url, title) {
	return "<a href=\"" + url + "\" target=\"_blank\">" + title + "</a>";
}