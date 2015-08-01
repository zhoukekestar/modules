(function () {
	function formatDoc (oDoc, sCmd, sValue) {
		if (!validateMode(oDoc)) { return; }
		document.execCommand(sCmd, false, sValue);
		oDoc.focus();
	}

	function validateMode (oDoc) {
		if (!document.getElementById("rte-mode-" + rId.exec(oDoc.id)[0]).checked) { return true; }
		alert("Uncheck \u00AB" + sModeLabel + "\u00BB.");
		oDoc.focus();
		return false;
	}

	function extractText (oDoc) {
		if (oDoc.innerText) { return oDoc.innerText; }
		var oContent = document.createRange();
		oContent.selectNodeContents(oDoc.firstChild);
		return oContent.toString();
	}

	function setDocMode (oDoc, bToSource) {
		if (bToSource) {
			var oContent = document.createTextNode(oDoc.innerHTML), oPre = document.createElement("pre");
			oDoc.innerHTML = "";
			oDoc.contentEditable = false;
			oPre.className = "rte-sourcetext";
			oPre.id = "rte-source-" + oDoc.id;
			oPre.onblur = oDoc.onblur;
			oPre.contentEditable = true;
			oPre.appendChild(oContent);
			oDoc.appendChild(oPre);
		} else {
			oDoc.innerHTML = extractText(oDoc);
			oDoc.contentEditable = true;
		}
		oDoc.focus();
	}

	function menuSelect () {
		if (this.selectedIndex < 1) { return; }
		var sMenuGroup = rId.exec(this.id)[0], sCmd = this.id.slice(0, - sMenuGroup.length);
		formatDoc(aEditors[sMenuGroup], sCmd, this[this.selectedIndex].value);
		this.selectedIndex = 0;
	}
	
	function buttonClick () {
		var sBtnGroup = rId.exec(this.id)[0], sCmd = this.id.slice(0, - sBtnGroup.length);
		customCommands.hasOwnProperty(sCmd) ? customCommands[sCmd](aEditors[sBtnGroup]) : formatDoc(aEditors[sBtnGroup], sCmd, this.alt || false);
	}

	function changeMode () {
		setDocMode(aEditors[rId.exec(this.id)[0]], this.checked);
	}

	function updateField () {
		var sFieldNum = rId.exec(this.id)[0];
		document.getElementById("rte-field-" + sFieldNum).value = document.getElementById("rte-mode-" + sFieldNum).checked ? extractText(this) : this.innerHTML;
	}

	function createMenuItem (sValue, sLabel) {
		var oNewOpt = document.createElement("option");
		oNewOpt.value = sValue;
		oNewOpt.innerHTML = sLabel || sValue;
		return oNewOpt;
	}

	function createEditor (oTxtArea) {
		var		nEditorId = aEditors.length, oParent = document.createElement("div"), oMenuBar = document.createElement("div"),
				oToolsBar = document.createElement("div"), oEditBox = document.createElement("div"),
				oModeBox = document.createElement("div"), oModeChB = document.createElement("input"),
				oModeLbl = document.createElement("label");

		oParent.className = "rich-text-editor";
		oParent.id = oTxtArea.id || "rich-text-" + nEditorId;
		oMenuBar.className = "rte-menus";
		oToolsBar.className = "rte-tools";
		oEditBox.className = "rte-editbox";
		oEditBox.id = "rte-editbox-" + nEditorId;
		oEditBox.contentEditable = true;
		oEditBox.innerHTML = oTxtArea.value;
		aEditors.push(oEditBox);

		if (oTxtArea.form) {
			var oHiddField = document.createElement("input");
			oHiddField.type = "hidden";
			oHiddField.name = oTxtArea.name;
			oHiddField.value = oEditBox.innerHTML;
			oHiddField.id = "rte-field-" + nEditorId;
			oTxtArea.form.appendChild(oHiddField);
			oEditBox.onblur = updateField;
		}

		for (var oMenu, oMenuOpts, vOpt, nMenu = 0; nMenu < oTools.menus.length; nMenu++) {
			oMenu = document.createElement("select");
			oMenu.id = oTools.menus[nMenu].command + nEditorId;
			oMenu.onchange = menuSelect;
			oMenu.appendChild(createMenuItem(oTools.menus[nMenu].header));
			oMenuOpts = oTools.menus[nMenu].values;
			if (oMenuOpts.constructor === Array) {
				for (vOpt = 0; vOpt < oMenuOpts.length; oMenu.appendChild(createMenuItem(oMenuOpts[vOpt++])));
			} else {
				for (vOpt in oMenuOpts) { oMenu.appendChild(createMenuItem(vOpt, oMenuOpts[vOpt])); }				
			}
			oMenu.selectedIndex = 0;
			oMenuBar.appendChild(document.createTextNode(" "));
			oMenuBar.appendChild(oMenu);
		}

		for (var oBtnDef, oButton, nBtn = 0; nBtn < oTools.buttons.length; nBtn++) {
			oBtnDef = oTools.buttons[nBtn];
			oButton = document.createElement("img");
			oButton.className = "rte-button";
			oButton.id = oBtnDef.command + nEditorId;
			oButton.src = oBtnDef.image;
			if (oBtnDef.hasOwnProperty("value")) { oButton.alt = oBtnDef.value; }
			oButton.title = oBtnDef.text;
			oButton.onclick = buttonClick;
			oToolsBar.appendChild(oButton);
		}

		oModeBox.className = "rte-switchmode";
		oModeChB.type = "checkbox";
		oModeChB.id = "rte-mode-" + nEditorId;
		oModeChB.onchange = changeMode;
		oModeLbl.setAttribute("for", oModeChB.id);
		oModeLbl.innerHTML = sModeLabel;
		oModeBox.appendChild(oModeChB);
		oModeBox.appendChild(document.createTextNode(" "));
		oModeBox.appendChild(oModeLbl);
		oParent.appendChild(oMenuBar);
		oParent.appendChild(oToolsBar);
		oParent.appendChild(oEditBox);
		oParent.appendChild(oModeBox);
		oTxtArea.parentNode.replaceChild(oParent, oTxtArea);
	}

	function replaceFields (nFlag) {
		nReady |= nFlag;
		if (nReady !== 3) { return; }
		for (
			var oField, nItem = 0, aTextareas = Array.prototype.slice.call(document.getElementsByTagName("textarea"), 0);
			nItem < aTextareas.length;
			oField = aTextareas[nItem++], oField.className !== "rich-text-editor" || createEditor(oField)
		);
	}

	function toolsReady () {
		oTools = JSON.parse(this.responseText);
		replaceFields(2);
	}

	function documentReady () { replaceFields(1); }

	var		oTools, nReady = 0, sModeLabel = "Show HTML", aEditors = [], rId = /\d+$/, oToolsReq = new XMLHttpRequest(),
			customCommands = {
				"printDoc": function (oDoc) {
					if (!validateMode(oDoc)) { return; }
					var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
					oPrntWin.document.open();
					oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
					oPrntWin.document.close();
				},
				"cleanDoc": function (oDoc) {
					if (validateMode(oDoc) && confirm("Are you sure?")) { oDoc.innerHTML = ""; };
				},
				"createLink": function (oDoc) {
					var sLnk = prompt("Write the URL here", "http:\/\/");
					if (sLnk && sLnk !== "http://"){ formatDoc(oDoc, "createlink", sLnk); }
				}
			};

	oToolsReq.onload = toolsReady;
	oToolsReq.open("GET", "rich-text-tools.json", true);
	oToolsReq.send(null);
	window.addEventListener ? addEventListener("load", documentReady, false) : window.attachEvent ? attachEvent("onload", documentReady) : window.onload = documentReady;
})();