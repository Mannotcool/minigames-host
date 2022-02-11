jQuery("body").css("opacity", 0);
jQuery(function ($) {
    $("body").fadeTo(1500, 1);
    $(document).on("click", "a", function (event) {

        // get the href attribute
        // "this" is still the <a> element here
        var newUrl = $(this).attr("href");

        event.preventDefault();
        $("body").fadeTo(1500, 0, function () {

            //here, where you were trying to get the url, "this"
            //points to the animated element, ie body


            // veryfy if the new url exists or is a hash
            if (!newUrl || newUrl[0] === "#") {
                // set that hash
                location.hash = newUrl;
                return;
            }

            //just update the location without fading in at this point
            location = newUrl;

            // prevent the default browser behavior.
            return false;
        });
    });

});

// Enables the Copy to Clipboard button

function copyToClipboard(text) {

    var textArea = document.createElement( "textarea" );
    textArea.value = text;
    document.body.appendChild( textArea );       
    textArea.select();

    try {
       var successful = document.execCommand( 'copy' );
       var msg = successful ? 'successful' : 'unsuccessful';
       console.log('Copying text command was ' + msg);
    } catch (err) {
       console.log('Oops, unable to copy',err);
    }    
    document.body.removeChild( textArea );
}

$( '#button-addon2' ).click(function(){    
    var clipboardText = "";
    clipboardText = $( '#inviteurl' ).val(); 
    copyToClipboard( clipboardText );
    $( '#inviteurl' ).val('Copied to clipboard!');
    // wait 2 seconds then clear the text
    setTimeout(() => {
        $( '#inviteurl' ).val(clipboardText);
        clearTimeout();
    }, 2000);
});