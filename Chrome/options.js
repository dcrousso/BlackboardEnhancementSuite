
// Based on https://developer.chrome.com/extensions/options

// Save options
function save_options() {
	var forum_view = document.getElementById("forum_view").value;
	chrome.storage.sync.set({
		forum_view: forum_view,
	}, function() {
		// Update status to let the user know options were saved
		var status = document.getElementById("status");
		status.textContent = "Options Saved";
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}


// Update options form when options page opens
function restore_options() {
	// get options, or return default values if not set
	chrome.storage.sync.get(shared.default_options, function (items) {
		document.getElementById('forum_view').value = items.forum_view;
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById('save').addEventListener('click', save_options);
