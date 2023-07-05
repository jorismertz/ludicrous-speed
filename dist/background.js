"use strict";
chrome.tabs.onUpdated.addListener(function (tabID, info, tab) {
    const isDashboard = tab.url === "https://nettenshop.webshopapp.com/admin/";
    if (isDashboard)
        chrome.scripting.executeScript({
            target: { tabId: tabID, allFrames: true },
            files: ["dashboard.js"],
        });
});
