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
		var blackboard_domains = document.getElementById("blackboard_domains").value.split("\n");
		var origins = blackboard_domains.map((x) => [
			           "https://" + x + "/",
			           "http://" + x + "/"
			         ]).reduce((a,b) => a.concat(b));
		console.log(origins);
		chrome.permissions.request({
			permissions: ["tabs"],
			origins: origins
		}, function(granted) {
			if (chrome.runtime.lastError) {
				data.errors.push(chrome.runtime.lastError.message);
			}
			if (granted) {
				data.sync.blackboard_domains = blackboard_domains;
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
		document.getElementById("blackboard_domains").value = items.blackboard_domains.join("\n");
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
