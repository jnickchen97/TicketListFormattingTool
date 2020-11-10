var input = document.getElementById("fileInput");
var user;
var pwd;
var JiraTicketResponse;
var GitlabResponse;
var newListBuilder;
var ticketsToo;
var affectsToo;
var mmpiTicket;
var m2jvTicket;
var linesArrAffects;
var mergeReqArr;
var foundProdAdd;
var prodTicketsAdd;
var foundProdMark;
var linesArrMark;
var prodTicketsMark;
var ticketResponseMark;
var linesArrFormatted;
var linesAffects;
var continueProcessing;

function resetScreen() {
	removeListeners();
	input = document.getElementById("fileInput");
	input.value = '';
	var mergeUrl;
	var changeUrl;
	document.getElementById("welcomeLabel").style.display="none";
	hideClass("JenkinsAll");
	document.getElementById("JenkinsButton").style.display="none";
	document.getElementById("JenkinsLink").style.display="none";
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
	document.getElementById("alsoGetTickets").checked = false;
	mmpiTicket = "";
	m2jvTicket = "";
	document.getElementById("myDynamicTable").innerHTML = "";
	document.getElementById("myDynamicTable").style.display = "block";
	document.getElementById("alsoMarkBlockers").style.display="none";
	document.getElementById("alsoMarkBlockersLabel").style.display="none";
	document.getElementById("alsoMarkBlockers").checked = false;
	document.getElementById("alsoAffectsProd").style.display="none";
	document.getElementById("alsoAffectsProdLabel").style.display="none";
	document.getElementById("alsoAffectsProd").checked = false;
	document.getElementById("affectsProdBtn").style.display = "none";
	
}

function hideOptions() {
	document.getElementById("options").style.display="none";
}

function toggleNav() {
	if (document.getElementById("myNav").offsetWidth > 0) {
		closeNav();
	} else {
		openNav();
	}
}

function openNav() {
	document.getElementById("myNav").style.width = "100%";
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
	document.getElementById("chgReq").focus();
}

function NewList() {
	resetScreen();
	newListBuilder = "";
	ticketsToo = false;
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

function findOldBuild() {
	navigate("http://gitlab.yrcw.com/mcc/environment/mcc-environment-prod/blob/master/prod-images.properties", true);
	document.getElementById("oldBuild").focus();
}

function findNewBuild() {
	navigate("https://jenkins-mcc.yrcw.com/job/app/job/mcc-modules/changes", true);
	document.getElementById("newBuild").focus();
}

function submitNewList() {
	hideClass("newList");
	var oldBuild = document.getElementById("oldBuild").value;
	var newBuild = document.getElementById("newBuild").value;
	var chgReq = document.getElementById("chgReq").value;
	var chgReqUrl = document.getElementById("chgReqUrl").value;
	newListBuilder = "* [Previous Release File Compare] (http://gitlab.yrcw.com/mcc/app/mcc-modules/compare/" + oldBuild + "..." + newBuild + " )\n" +
		"* [" + chgReq + "] (" + chgReqUrl + " )\n" + "* [Merge Request] ([MERGE REQUEST URL HERE] ) (see merge request for additional DevB fixes, they are not included in this email)\n\n";
	if (document.getElementById("alsoGetTickets").checked == true) {
		ticketsToo = true;
		Jenkins();
	} else {
		newListBuilder += "**Production**\n\n**DevB**\n\n\n\n";
		downloadList();
	}
}

function downloadList() {
	var blob = new Blob([newListBuilder], {
		type: "text/plain;charset=utf-8"
	});
	var deployDate = getThursday().replace("/", "");
	deployDate = deployDate.replace("/", "");
	deployDate = "prod_deploy_" + deployDate + ".txt";
	saveAs(blob, deployDate);
	document.getElementById("optionLabel").innerHTML = "The new ticket list has been saved to your downloads folder as " + deployDate + ".";
}

function Jenkins() {
	resetScreen();
	affectsToo = false;
	document.getElementById("optionLabel").innerHTML = "Get New DevB Tickets from Jenkins";
	showClass("JenkinsAll");
	document.getElementById("JenkinsButton").style.display="inline-block";
	document.getElementById("JenkinsLink").style.display="inline-block";
	document.getElementById("JenkinsText").focus();
	document.getElementById("alsoAffectsProd").style.display="inline-block";
	document.getElementById("alsoAffectsProdLabel").style.display="inline-block";
}

function toJenkinsChanges() {
	navigate('https://jenkins-mcc.yrcw.com/job/app/job/mcc-modules/changes', true);
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
	hideClass("JenkinsAll");
	document.getElementById("JenkinsButton").style.display="none";
	document.getElementById("JenkinsLink").style.display="none";
	document.getElementById("alsoAffectsProd").style.display="none";
	document.getElementById("alsoAffectsProdLabel").style.display="none";
	
	if (document.getElementById("alsoAffectsProd").checked == true) {
		affectsToo = true;
	}
	
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
			if (!affectsToo) {
				document.getElementById("outputText").innerHTML = linesArr.join('<br>');
			}
		} else {
			document.getElementById("outputText").style.textAlign = "center";
			document.getElementById("outputText").innerHTML = "No changes were found to be formatted.<br><br><br><br>Make sure that you are copying the build headings along with their respective changes.";
		}
	} else {
		document.getElementById("outputText").innerHTML = "You haven't entered anything in the text box! Try again.";
	}
	if (ticketsToo && !affectsToo) {
		ticketsToo = false;
		newListBuilder += "**Production**\n\n**DevB**\n\n\n\n" + linesArr.join('\n');
		downloadList();
	} else if (affectsToo) {
		linesArrFormatted = linesArr.join('\n');
		AffectsProd();
	}
}

function formatCleanup(lines) {
	var linesArr = new Array();
	var ticketNumbers = new Array();
	for (var i = 0; i < lines.length; i++) {
		var tempLine = lines[i];
		if (tempLine.length != 0 && !tempLine.startsWith("*") && !tempLine.toUpperCase().startsWith("X") && !tempLine.startsWith("?")) {
			tempLine = tempLine.replace("[", "");
			tempLine = tempLine.replace("]", "");
			tempLine = tempLine.replace("WIP:", "");
			tempLine = tempLine.replace("DEVB", "");
			tempLine = tempLine.substring(0, tempLine.length - 9);
			if (tempLine.toUpperCase().indexOf("ROLLBACK") < 0 && tempLine.toUpperCase().indexOf("REVERT") < 0) {
				tempLine = formatLine(tempLine);
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

function formatLine(tempLine) {
	var lineNoSpaces = tempLine.replace(/[ -]/g, "");
	var mmpiLoc = lineNoSpaces.toUpperCase().indexOf("MMPI");
	var m2jvLoc = lineNoSpaces.toUpperCase().indexOf("M2JV");
	if (!tempLine.startsWith("*")) {
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
			mmpiTicket = "";
			m2jvTicket = "";
			tempLine = "* " + tempLine;
		}
	}
	return tempLine;
}

function AffectsProd() {
	resetScreen();
	document.getElementById("optionLabel").innerHTML = "Check Which Tickets Affect Prod";
	linesAffects = new Array();
	continueProcessing = false;
	
	if (!affectsToo) {
		displayLogin();
		input.addEventListener('change', processFile);
		function processFile() {
			let files = input.files; 
			if (files.length == 0) return; 
			var file = files[0]; 
			let reader = new FileReader();
  
			reader.onload = (e) => {
				var file = e.target.result; 
				linesAffects = file.split(/\r\n|\n/);
				processLines();
				removeListeners();
			}; 
			reader.onerror = (e) => alert(e.target.error.name); 
			reader.readAsText(file); 
		}
	} else {
		continueProcessing = true;
		displayLogin();
		linesAffects = linesArrFormatted.split(/\r\n|\n/);
	}
}

async function processLines() {
	linesArrAffects = new Array();
	mergeReqArr = new Array();
	var devbTickets = false;
	var blanks = 0;
	for (var i = 0; i < linesAffects.length; i++) {
		var tempLine = linesAffects[i];
		if (tempLine.startsWith("**DevB**")) {
			devbTickets = true;
		}
		if (devbTickets || affectsToo) {
			if (tempLine.length == 0) {
				blanks++;
			}
			if ((blanks > 0 && tempLine.length > 0) || affectsToo) {
				var tempLine = formatLine(tempLine);
				ticketUrlLoc = tempLine.indexOf("https://yrcfreight.atlassian.net/browse");
				var rightParen = tempLine.indexOf(")");

				if (ticketUrlLoc > -1) {
					var JiraUrl = tempLine.substring(ticketUrlLoc, rightParen-1);
					await getTicketStatus(JiraUrl);
					var ticketResponse = JiraTicketResponse;
					document.getElementById("loaderLabel").style.display="none";
					document.getElementById("loader").style.display="none";
					if (ticketResponse !== "error") {
						var mergeReqUrlLoc = ticketResponse.lastIndexOf("href=\"http://gitlab.yrcw.com/mcc/app/mcc-modules/merge_requests/");
						if (mergeReqUrlLoc > -1) {
							var mergeReqUrl = ticketResponse.substring(mergeReqUrlLoc+6, mergeReqUrlLoc+75);
							var quoteLoc = mergeReqUrl.indexOf("\"");
							mergeReqUrl = mergeReqUrl.substring(0, quoteLoc);
							mergeReqArr.push(mergeReqUrl);
						} else {
							mergeReqArr.push(JiraUrl);
						}
						if (!affectsToo) {
							tempLine = tempLine.substring(0, tempLine.length-9);
						}
						linesArrAffects.push(tempLine);
					} else {
						alert("\nError - something went wrong.");
						break;
					}
				} else {
					mergeReqArr.push("None found");
					if (!affectsToo) {
						tempLine = tempLine.substring(0, tempLine.length-9);
					}
					linesArrAffects.push(tempLine);
				}
			}
		}
	}
	if (ticketResponse === "error") {
		document.getElementById("optionLabel").innerHTML = "Error";
		document.getElementById("outputText").style.textAlign = "center";
		document.getElementById("outputText").innerHTML = "Please make sure you are entering the correct email address and API token for your Jira account.<br><br>" +
			"If this issue persists, send feedback to report a bug with this functionality.";
	} else {
		addTable(mergeReqArr, linesArrAffects);
		document.getElementById("affectsProdBtn").style.display = "block";
		document.getElementById("optionLabel").innerHTML = "Mark the checkbox next to the tickets that affect production, and click done.<br><br>" +
			"You can use the merge request links to determine what programs are being changed, and whether the changes affect production or not.<br>";
		document.getElementById("alsoMarkBlockers").style.display="inline-block";
		document.getElementById("alsoMarkBlockersLabel").style.display="inline-block";
	}
}

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
			var noMerge;
			var jiraNoMerge = false;
			var currentMerge = MergeRequests[i]
			if (currentMerge.toUpperCase() === "NONE FOUND") {
				noMerge = true;
			} else if (currentMerge.toUpperCase().indexOf("ATLASSIAN") > -1) {
				jiraNoMerge = true;
			} else {
				noMerge = false;
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
				if (noMerge) {
					const anchor = document.createElement('a');
					anchor.href = "http://gitlab.yrcw.com/mcc/app/mcc-modules/merge_requests?scope=all&state=merged";
					anchor.innerText = "None found, search here";
					anchor.target = "_blank";
					td.appendChild(anchor);
				} else if (jiraNoMerge) {
					var mmpiTitleLoc = currentMerge.toUpperCase().indexOf("MMPI");
					var m2jvTitleLoc = currentMerge.toUpperCase().indexOf("M2JV");
					const anchor = document.createElement('a');
					if (mmpiTitleLoc > -1) {
						currentMerge = currentMerge.substring(mmpiTitleLoc, currentMerge.length);
					} else {
						currentMerge = currentMerge.substring(m2jvTitleLoc, currentMerge.length);
					}
					var ticketNum = currentMerge.substring(currentMerge.indexOf("-")+1, currentMerge.length);
					anchor.href = "http://gitlab.yrcw.com/mcc/app/mcc-modules/merge_requests?scope=all&utf8=%E2%9C%93&state=merged&search=" + ticketNum;
					anchor.innerText = "None found, search here";
					anchor.target = "_blank";
					td.appendChild(anchor);
				} else {
					const anchor = document.createElement('a');
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
}

async function submitAffectsProd() {
	document.getElementById("alsoMarkBlockers").style.display="none";
	document.getElementById("alsoMarkBlockersLabel").style.display="none";
	document.getElementById("myDynamicTable").style.display = "none";
	document.getElementById("affectsProdBtn").style.display = "none";
	if (!affectsToo && !document.getElementById("alsoMarkBlockers").checked) {
		document.getElementById("optionLabel").innerHTML = "The new tickets on the list have been formatted and sorted as either Production or DevB.";
	} else {
		document.getElementById("optionLabel").innerHTML = "Mark All Prod Blockers";
	}
	var prodTicketsArr = new Array();
	var devbTicketsArr = new Array();

	for (var i = 0; i < linesArrAffects.length; i++) {
		if (document.getElementById("prodChk" + i).checked == true) {
			prodTicketsArr.push(markLabel(linesArrAffects[i], false));
		} else {
			devbTicketsArr.push(linesArrAffects[i]);
		}
	}
	
	var allTicketsArr = new Array();
	allTicketsArr.push("**Production**");
	for (var i = 0; i < prodTicketsArr.length; i++) {
		allTicketsArr.push(prodTicketsArr[i]);
	}
	allTicketsArr.push("");
	allTicketsArr.push("**DevB**");
	for (var i = 0; i < devbTicketsArr.length; i++) {
		allTicketsArr.push(devbTicketsArr[i]);
	}
	
	if (document.getElementById("alsoMarkBlockers").checked == true) {
		linesArrMark = new Array();
		prodTicketsMark = false;
		foundProdMark = false;
		for (var i = 0; i < allTicketsArr.length; i++) {
			var tempLine = allTicketsArr[i];
			await doTheMarking(tempLine);
			if (ticketResponseMark === "error") {
				break;
			}
		}
		markProdMessages();
		if (devbTicketsArr.length > 0) {
			document.getElementById("outputText").innerHTML += "<br>**DevB**<br>" + devbTicketsArr.join('<br/>');
		}
	} else {
		document.getElementById("outputText").innerHTML = allTicketsArr.join('<br/>');
	}
	if (affectsToo && ticketsToo) {
		ticketsToo = false;
		affectsToo = false;
		newListBuilder += linesArrMark.join('\n');
		for (var i = linesArrMark.length; i < allTicketsArr.length; i++) {
			newListBuilder += '\n' + allTicketsArr[i];
		}
		downloadList();
	}
}

function markProdMessages() {
	if (ticketResponseMark === "error") {
		document.getElementById("optionLabel").innerHTML = "Error";
		document.getElementById("outputText").style.textAlign = "center";
		document.getElementById("outputText").innerHTML = "Please make sure you are entering the correct email address and API token for your Jira account.<br><br>" +
			"If this issue persists, send feedback to report a bug with this functionality.";
	} else {
		if (foundProdMark) {
			document.getElementById("optionLabel").innerHTML = "Production tickets that have a status other than Done have been marked with an \"X\"";
			document.getElementById("outputText").innerHTML = linesArrMark.join('<br/>');
		} else {
			document.getElementById("optionLabel").innerHTML = "There are no production tickets on this list.";
		}
	}
}

function MarkBlockers() {
	resetScreen();
	document.getElementById("optionLabel").innerHTML = "Mark All Prod Blockers";
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
			linesArrMark = new Array();
			prodTicketsMark = false;
			foundProdMark = false;
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				await doTheMarking(tempLine);
				if (ticketResponseMark === "error") {
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

async function doTheMarking(tempLine) {
	if (tempLine.startsWith("**Production**")) {
		prodTicketsMark = true;
	} else if (tempLine.startsWith("**DevB**")) {
		prodTicketsMark = false;
	}
	if (prodTicketsMark) {
		if (!tempLine.startsWith("**Production**") && tempLine.indexOf("*") > -1) {
			foundProdMark = true;
		}
		if (tempLine.toUpperCase().startsWith("X")) {
			tempLine = tempLine.substring(2, tempLine.length);
		}
		var ticketUrlLoc = tempLine.indexOf("https://yrcfreight.atlassian.net/browse");
		var rightParen = tempLine.indexOf(")");
		if (ticketUrlLoc > -1) {
			var JiraUrl = tempLine.substring(ticketUrlLoc, rightParen-1);
			await getTicketStatus(JiraUrl);
			ticketResponseMark = JiraTicketResponse;
			document.getElementById("loaderLabel").style.display="none";
			document.getElementById("loader").style.display="none";
			if (ticketResponseMark !== "error") {
				var changeLoc = ticketResponseMark.indexOf("Change status");
				var ticketStatus = ticketResponseMark.substring(changeLoc - 100, changeLoc);
				var buttonLoc = ticketStatus.indexOf("button aria-label");
				ticketStatus = ticketStatus.substring(buttonLoc + 19, ticketStatus.length - 3);
				if (ticketStatus.toUpperCase() !== "DONE" && ticketStatus.toUpperCase() !== "MIGRATED TO PROD") {
					tempLine = "X " + tempLine;
				}
				linesArrMark.push(tempLine);
			} else {
				alert("\nError - something went wrong.");
				ticketResponseMark = "error";
			}
		} else {
			linesArrMark.push(tempLine);
		}
	}
}

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

function displayFilePicker() {
	document.getElementById("outputText").innerHTML="";
	document.getElementById("fileInput").style.display="inline";
	document.getElementById("fileInputLabel").style.display="inline";
}

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
	displayFilePicker();
	hideClass("loginInput");
	document.getElementById("loginBtn").style.display="none";
	if (continueProcessing) {
		processLines();
	}
}

async function getTicketStatus(ticketUrl) {
	document.getElementById("fileInput").style.display="none";
	document.getElementById("fileInputLabel").style.display="none";
	document.getElementById("loaderLabel").style.display="block";
	document.getElementById("loader").style.display="block";
	var myHeaders = new Headers();
	var separator = ":";
	var wholeAuthorization = "Basic " + btoa(user + separator + pwd);
	myHeaders.append("Authorization", wholeAuthorization);

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	var wholeUrl = "https://cors-anywhere.herokuapp.com/" + ticketUrl;
	const response = await fetch(wholeUrl, requestOptions)
		.then(async function(response) {
			if(response.status!==200) {
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

function CheckBlockers() {
	resetScreen();
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
			var linesArr = new Array();
			var blockersArr = new Array();
			var blockerLinksArr = new Array();
			var prodTickets = false;
			var validatedCount = 0;
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				if (tempLine.startsWith("**Production**")) {
					prodTickets = true;
				} else if (tempLine.startsWith("**DevB**")) {
					prodTickets = false;
				}
				if (prodTickets) {
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
								var changeLoc = ticketResponse.indexOf("Change status");
								var ticketStatus = ticketResponse.substring(changeLoc - 100, changeLoc);
								var buttonLoc = ticketStatus.indexOf("button aria-label");
								ticketStatus = ticketStatus.substring(buttonLoc + 19, ticketStatus.length - 3);
								if (ticketStatus.toUpperCase() !== "DONE" && ticketStatus.toUpperCase() !== "MIGRATED TO PROD") {
									var ticketNum = JiraUrl.substring(JiraUrl.length-10, rightParen-1);
									tempLine = "X " + tempLine;
									blockersArr.push(ticketNum);
									blockerLinksArr.push(JiraUrl);
								}
								linesArr.push(tempLine);
							} else {
								alert("\nError - something went wrong.");
								break;
							}
						} else {
							linesArr.push(tempLine);
						}
					} else {
						linesArr.push(tempLine);
					}
				}
			}
			if (ticketResponse === "error") {
				document.getElementById("optionLabel").innerHTML = "Error";
				document.getElementById("outputText").style.textAlign = "center";
				document.getElementById("outputText").innerHTML = "Please make sure you are entering the correct email address and API token for your Jira account.<br><br>" +
																	"If this issue persists, send feedback to report a bug with this functionality.";
			} else {
				if (blockersArr.length > 0) {
					var blockerOutputArr = new Array();
					for (var i = 0; i < blockersArr.length; i++) {
						blockerOutputArr.push(createLink(blockerLinksArr[i], blockersArr[i]));
					}
					document.getElementById("optionLabel").innerHTML = "The remaining PROD blockers are shown below.";
					document.getElementById("outputText").innerHTML = "There are " + blockerOutputArr.length + " blocker(s) left:<br/>";
					document.getElementById("outputText").innerHTML += blockerOutputArr.join('<br/>');
					document.getElementById("outputText").innerHTML += "<br/><br/><br/>";
				} else {
					document.getElementById("optionLabel").innerHTML = "There are no pending PROD blockers on this list.<br/><br/>Blockers must start with an \"X\" for this option to work.";
				}
				document.getElementById("outputText").innerHTML += linesArr.join('<br/>');
			}
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

function AddProdLabel() {
	resetScreen();
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
			var linesArr = new Array();
			prodTicketsAdd = false;
			foundProdAdd = false;
			
			for (var i = 0; i < lines.length; i++) {
				var tempLine = lines[i];
				tempLine = markLabel(tempLine, true);
				if (prodTicketsAdd) {
					linesArr.push(tempLine);
				}
			}
			if (foundProdAdd) {
				document.getElementById("optionLabel").innerHTML = "The \"PROD\" label has been added to all Production tickets that did not already have it.";
				document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
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

function markLabel(tempLine, checkIfProd) {
	if (tempLine.startsWith("**Production**")) {
		prodTicketsAdd = true;
	} else if (tempLine.startsWith("**DevB**")) {
		prodTicketsAdd = false;
	}
	
	if (prodTicketsAdd || !checkIfProd) {
		if (!tempLine.startsWith("**Production**") && tempLine.indexOf("*") > -1) {
			foundProdAdd = true;
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

function Merge() {
	resetScreen();
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
						document.getElementById("goToMergeRequest").style.display="block";
						mergeUrl = tempLine.substring(urlLoc, tempLine.indexOf(")") -1);
					} else {
						document.getElementById("newMergeRequest").style.display="block";
					}
				}
			}
			if (linesArr.length == 0) {
				document.getElementById("outputText").innerHTML = "There are no tickets on this list.";
			} else {
				document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
			}
			document.getElementById("fileInput").style.display="none";
			document.getElementById("fileInputLabel").style.display="none";
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

function ChangeTask() {
	resetScreen();
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
						document.getElementById("goToChangeRequest").style.display="block";
						changeUrl = tempLine.substring(tempLine.indexOf("https://yrcw.service-now"), tempLine.indexOf(")")-1);
					} else {
						document.getElementById("newChangeRequest").style.display="block";
					}
				}
			}
			if (linesArr.length == 0) {
				document.getElementById("outputText").innerHTML = "There are no tickets on this list.";
			} else {
				document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
			}
			document.getElementById("fileInput").style.display="none";
			document.getElementById("fileInputLabel").style.display="none";
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

function Email() {
	resetScreen();
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
					var newLink = createLink(tempLine.substring(leftParen+1, rightParen), linkTitle);
					tempLine = bullet + newLink;
					linesArr.push(tempLine);
				} else if (tempLine.startsWith("* [Merge")) {
					var linkTitle = tempLine.substring(leftBracket+1, rightBracket);
					var newLink = createLink(tempLine.substring(leftParen+1, rightParen), linkTitle);
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
						var ticketLink = createLink(tempLine.substring(leftParen+1, rightParen), ticketTitle);
						tempLine = bullet + ticketLink + tempLine.substring(rightParen+1, tempLine.length);
						linesArr.push(tempLine);
					}
				}
			}
			document.getElementById("outputText").innerHTML = linesArr.join('<br/>');
			document.getElementById("emailButton").style.display="block";
			document.getElementById("fileInput").style.display="none";
			document.getElementById("fileInputLabel").style.display="none";
			removeListeners();
		}; 
		reader.onerror = (e) => alert(e.target.error.name); 
		reader.readAsText(file); 
	}
}

function removeListeners() {
	var old_element = document.getElementById("fileInput");
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
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

function screenLoad() {
	document.getElementById("dateLabel").innerHTML = "This week's PROD deploy will be on " + getThursday();
}

function sendFeedback() {
	if (confirm("\nClick OK below to open a new email.\n\nFeel free to share any feedback such as discovered bugs or suggestions for improvements.")) {
		var to = "jesse.nickchen@yrcw.com";
		var subject = "Ticket List Formatting Tool Feedback";
		window.location.href = "mailto:" + to + "?subject=" + subject;
	} else {
		document.getElementById("optionLabel").innerHTML = "Send Feedback";
		document.getElementById("outputText").innerHTML = "You clicked cancel!";
	}
}

function showClass(className) {
	var x = document.getElementsByClassName(className);
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display="block";
	}
}

function hideClass(className) {
	var x = document.getElementsByClassName(className);
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display="none";
	}
}

function createLink(url, title) {
	return "<a href=\"" + url + "\" target=\"_blank\">" + title + "</a>";
}