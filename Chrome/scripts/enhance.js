// Change university logo link to use javascript and go to the main university website
var navFrame = document.getElementById("navFrame");
if (!navFrame) navFrame = window;
navFrame.onload = function() {
	setTimeout(function() {
		var logo = ((navFrame == document.body)?navFrame:navFrame.window).document.getElementsByClassName("brandingImgWrap");
		if (logo.length > 0) {
			logo = logo[0].children[0]
			var homepageURL = logo.href.split("?", 1);
			logo.target = "";
			logo.href = "#";
			logo.addEventListener("mouseup", function(e) {
				e.preventDefault();
				location.href = homepageURL;
			});
		}
	}, 1000);
};

var contentFrame = document.getElementById("contentFrame");
contentFrame.onload = function() {
	setTimeout(function() {
		var courses =  frames[1].window.document.getElementById("modBody");
		if(courses !== null) {
			var hiddenCoursesContainer = document.createElement("div");
			hiddenCoursesContainer.id = "hiddenCoursesContainer";

			var revealLink = document.createElement("a");
			revealLink.innerHTML = "Show Past Courses";
			revealLink.href = "#";
			hiddenCoursesContainer.appendChild(revealLink);

			var hiddenCourses = document.createElement("div");
			hiddenCourses.id = "hiddenCourses";
			hiddenCoursesContainer.appendChild(hiddenCourses);

			var year = new Date().getFullYear();
			var month = new Date().getMonth(); // January is month 0
			var section = year + "" + (month <= 5) ? 1 : ((month >= 8) ? 3: 2); // Before July = 1 and After August = 3
			courses = courses.querySelectorAll("table.toolpad:not([id]) .cpright a");
			var courseParents = [], count = 0;
			for(var i = 0; i < courses.length; i++) {
				var href = courses[i].href.substring(courses[i].href.indexOf("?") + 1);
				courses[i].href = location.href + "?course=" + getURLQueryParameter("id", href);
				if(courses[i].title.indexOf(section) < 0) {
					var parent = courses[i].parentElement.parentElement.parentElement.parentElement.parentElement;
					hiddenCourses.appendChild(parent);
					parent.style.display = "none";
					courseParents[count] = parent;
					count++;
				}
			}
			if(hiddenCourses.children.length > 0) {
				frames[1].window.document.querySelector("#modBody #messagetext").appendChild(hiddenCoursesContainer);

				revealLink.addEventListener("mouseup", function(e) {
					e.preventDefault();
					if(courseParents[0].style.display === "none") {
						for(var i = 0; i < courseParents.length; i++) {
							courseParents[i].style.display = "block";
						}
						revealLink.innerHTML = "Hide Past Courses";
					} else {
						for(var i = 0; i < courseParents.length; i++) {
							courseParents[i].style.display = "none";
						}
						revealLink.innerHTML = "Show Past Courses";
					}
				});
			}
		}
	}, 1000);
};

var query = window.location.search.substring(1);
if(query.length > 0) {
	var courseID = getURLQueryParameter("course", query);
	if(courseID.length > 0) {
		var newContentFrameURL = window.location.origin + "/webapps/blackboard/execute/launcher?type=Course&id=" + courseID;
		contentFrame.src = newContentFrameURL;
	}
}

function getURLQueryParameter(variable, query) {
	var vars = query.split('&');
	for(var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if(decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return "";
}
