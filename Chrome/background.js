
// create sort of a back end for checking blackboard settings like default forum view
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "get_forum_view") {
		chrome.storage.sync.get(shared.default_options, function(items) {
			sendResponse({
				"forum_view": items.forum_view
			});
		});
		return true;
	}
});
