chrome.tabs.onUpdated.addListener(function (tab) {
  //   chrome.tabs.executeScript(tab.ib, {
  //     file: "inject.js",
  //   })
  console.log("reloaded");
});
