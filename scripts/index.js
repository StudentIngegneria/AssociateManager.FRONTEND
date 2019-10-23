// Parse the route on page load
$( document ).ready(
  () => {
    crossroads.parse(document.location.pathname);
  }
)
