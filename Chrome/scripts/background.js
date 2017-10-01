// create sort of a back end for checking blackboard settings like default forum view
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action === "get_forum_view") {
		chrome.storage.sync.get(bb_values.default_options, function(items) {
			sendResponse({
				"forum_view": items.forum_view
			});
		});
		return true;
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	chrome.storage.sync.get(bb_values.default_options, function(items) {
		if (items.blackboard_domain != bb_values.default_options.blackboard_domain
		    && changeInfo.status == "complete") {
			chrome.permissions.contains({
				permissions: ['tabs'],
				origins: [tab.url]
			}, function(does) {
				if (does) chrome.tabs.executeScript(tabId, {file: "scripts/enhance.js"});
			});
		}
	});
});
