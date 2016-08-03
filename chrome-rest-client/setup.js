function toggleData() {
  if(jQuery.inArray($("input[type=radio]:checked").val(), ["post", "put"]) > -1) {
    $("#dataField").css("display", "");
  } else {
    $("#dataField").css("display", "none");
  }
};

$('#submit').bind('click',sendRequest);
$(".radio").change(function() { toggleData(); });
$(".radio").focus(function() { toggleData(); });