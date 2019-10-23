// ROUTING

global.routeData.setCurrentPage = (page)=>{
  global.routeData.currentPage = page;
  $("#currentpage").load("/pages/" + global.routeData.currentPage);
}

crossroads.routed.add(
  function(request, data){
    global.routeData.params = data;
  }
)

crossroads.addRoute(
  "",
  function(){
    window.location.href = "/members";
  }
);

crossroads.addRoute(
  "/members",
  function(){
    APIService.getLatestYear().then(
      (currentYear) => window.location.href = `/members/${currentYear}`
    )
  }
);

crossroads.addRoute(
  "/members/{year}",
  function(){
    global.routeData.setCurrentPage("members.html");
  }
);

crossroads.addRoute(
  "/members/{year}/{id}",
  function(){
    global.routeData.setCurrentPage("member.html");
  }
);

crossroads.addRoute(
  "/addMember",
  function(){
    global.routeData.setCurrentPage("addMember.html");
  }
);

crossroads.addRoute(
  "/registrations",
  function(){
    global.routeData.setCurrentPage("registrations.html");
  }
);

crossroads.addRoute(
  "/degrees",
  function(){
    global.routeData.setCurrentPage("degrees.html");
  }
);
