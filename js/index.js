jQuery(function ($) {
    $("#antirefresh").submit(function(e) {
        e.preventDefault();
    });

    var errorset = false;
    var confirmset = false;
    // when button "submit-name" is clicked
    $("#submit-name").click(function () {
        // get the value of the input field
        var name = $("#username").val();
        console.log(name)
        // if the value is empty
        if (name == undefined || name == "" || name == null && errorset == false) {
            // if the value is not empty
        } else {
            if (confirmset == false) {
                $("#error").append('<div class="alert alert-primary" role="alert">Successfully set your username as '+ name +'</div>');
                // save a cookie that lasts forever 
                document.cookie = "username="+ name +"; expires=365d; path=/";
            }
        }
        
    });
    

});