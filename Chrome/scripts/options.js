// Based on https://developer.chrome.com/extensions/options

function show_status(text, interval) {
	var statusEl = document.getElementById("status");
	statusEl.textContent += text;
	setTimeout(function() {
		statusEl.textContent = "";
	}, interval || 1000);
}

// Save options
function save_options() {
	new OperationList().operation((nextOperation,data) => {
		data.sync = {};
		data.errors = [];
		nextOperation();
	}).operation(function(nextOperation, data) {
		var blackboard_domain = document.getElementById("blackboard_domain").value;
		chrome.permissions.request({
			permissions: ['tabs'],
			origins: ["https://" + blackboard_domain + "/",
			          "http://" + blackboard_domain + "/"]
		}, function(granted) {
			chrome.permissions.getAll(function(permissions) {
				console.log(permissions);
			});
			if (chrome.runtime.lastError) {
				data.errors.push(chrome.runtime.lastError.message);
			}
			if (granted) {
				data.sync.blackboard_domain = blackboard_domain;
			}
			nextOperation();
		});
	}).operation(function(nextOperation, data) {
		data.sync.forum_view = document.getElementById("forum_view").value;
		nextOperation();
	}).operation(function(nextOperation, data) {
		if (data.errors.length) {
			show_status(data.errors.join("\n"), 2000);
		} else {
			chrome.storage.sync.set(data.sync, function() {
				// Update status to let the user know options were saved
				show_status("Options Saved");
			});
		}
	}).performInSequence();
}


// Update options form when options page opens
function restore_options() {
	// get options, or return default values if not set
	chrome.storage.sync.get(bb_values.default_options, function (items) {
		document.getElementById("forum_view").value = items.forum_view;
		document.getElementById("blackboard_domain").value = items.blackboard_domain;
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
