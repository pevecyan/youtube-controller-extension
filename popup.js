(function(Util) {
  Util.queryTabs(function(tabs) {

    var notice = document.getElementById('notice'),
      body = document.querySelector('body');

    if (tabs.length > 0) {

      body.removeChild(notice);

      var videoList = document.getElementById('video-list'),
        youtubeTitleEnding = "- YouTube",
        youtubeTitleEndingLength = youtubeTitleEnding.length,
        processedTabsCount = 0;


      tabs.forEach(function(tab) {
        var videoListItem = document.createElement("li"),
          videoListItemText = document.createElement("span"),
          videoControl = document.createElement("a"),
          videoControlText = "",

          //restart
          videoRestart = document.createElement("a"),
          tabClose = document.createElement("a"),

          tabId = tab.id,
          tabTitle = tab.title;


        if (tabTitle.substring(tabTitle.length - youtubeTitleEndingLength, tabTitle.length) === youtubeTitleEnding) {
          tabTitle = tabTitle.substring(0, tabTitle.length - youtubeTitleEndingLength).trim();
        }

        Util.videoPaused(tabId, function(paused) {

          videoControlClass = (paused === true) ? "fa-play" : "fa-pause";

          videoControl.classList.add("fa");
          videoControl.classList.add(videoControlClass);
          videoControl.addEventListener("click", videoControlClicked);
          
          videoRestart.classList.add("fa");
          videoRestart.classList.add("fa-refresh");
          videoRestart.addEventListener("click", videoRestartClicked);

          tabClose.classList.add("fa");
          tabClose.classList.add("fa-times");
          tabClose.addEventListener("click", tabCloseClicked);



          videoListItemText.textContent = tabTitle;
          videoListItemText.addEventListener("click", videoItemClicked);
          videoListItem.appendChild(videoListItemText);
          videoListItem.appendChild(videoControl);

          videoListItem.appendChild(videoRestart);

          videoListItem.appendChild(tabClose);

          videoListItem.dataset.tabId = tabId;
          videoList.appendChild(videoListItem);

          processedTabsCount++;

          if (processedTabsCount == tabs.length) {
            setTimeout(function() {
              videoList.classList.remove("hidden");
            }, 300);
          }
        });

      });

    } else {

      notice.classList.remove("hidden");
    }

  });

  function videoControlClicked(event) {
    event.stopPropagation();
    var tabId = parseInt(this.parentNode.dataset.tabId);
    Util.toggleVideo(tabId, function(paused) {
      var videoListItem = document.querySelector("li[data-tab-id=\"" + tabId + "\"]"),
        videoControl = videoListItem.querySelector("a");

      videoControlClassToAdd = paused ? "fa-play" : "fa-pause";
      videoControlClassToRemove = videoControlClassToAdd === "fa-pause" ? "fa-play" : "fa-pause";

      videoControl.classList.add(videoControlClassToAdd);
      videoControl.classList.remove(videoControlClassToRemove);

    });
  }
  function videoRestartClicked(){
    event.stopPropagation();
    var tabId = parseInt(this.parentNode.dataset.tabId);
    Util.restartVideo(tabId, function(currentTime){

    });
  }
  function tabCloseClicked(){
    event.stopPropagation();
    var tabId = parseInt(this.parentNode.dataset.tabId);
    Util.closeTab(tabId, function(){
      window.close();
    });
  }

  function videoItemClicked(event) {
    var tabId = parseInt(this.parentNode.dataset.tabId);
    Util.toggleTab(tabId, true);
  }

})(Util);
