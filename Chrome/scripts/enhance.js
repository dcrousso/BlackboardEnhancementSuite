document.getElementById("navFrame").onload = function() {
	setTimeout(function() {
		var logo = frames[0].window.document.getElementsByClassName("brandingImgWrap");
		if(logo.length > 0) {
			logo = logo[0].children[0]
			logo.target = "";
			logo.href = "#";
			logo.addEventListener("mouseup", function(e) {
				e.preventDefault();
				location.reload();
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
			var month = parseInt(new Date().getMonth() / 4) + 1;
			var section = year + "" + month;
			courses = courses.querySelectorAll("table.toolpad:not([id]) .cpright a:not([title^='" + section + "'])");
			var courseParents = [];
			for(var i = 0; i < courses.length; i++) {
				var parent = courses[i].parentElement.parentElement.parentElement.parentElement.parentElement;
				hiddenCourses.appendChild(parent);
				parent.style.display = "none";
				courseParents[i] = parent;
			}
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
	}, 1000);
};