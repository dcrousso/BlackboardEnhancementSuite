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

// Show welcome page on installation
chrome.runtime.onInstalled.addListener(function() {
	chrome.tabs.create({
		url: chrome.runtime.getURL("html/welcome.html")
	});
});

// Inject content script as appropriate.  Needed since content script globs aren't flexible enough
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (!("url" in tab)) return; // probably no "tabs" permissions for page loaded
	var pageDomain = tab.url.match(/:\/\/([^\/]+)/)[1];
	chrome.storage.sync.get(bb_values.default_options, function(items) {
		if (items.blackboard_domains !== bb_values.default_options.blackboard_domains
		    && changeInfo.status == "complete"
		    && items.blackboard_domains.includes(pageDomain)) {
			chrome.tabs.executeScript(tabId, {file: "scripts/enhance.js"});
		}
	});
});
