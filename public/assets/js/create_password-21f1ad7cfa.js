{
    // Using jQuery to raise XMLHttpRequest (xhr) request for password reset
    let resetPassword = function(){
        let resetPasswordForm = $('#create-password-form');

        resetPasswordForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: resetPasswordForm.attr('action'),
                data: resetPasswordForm.serialize(),
                success: function(data){
                    // console.log(data);
                    if(data.indication){
                        // Noty success notification for password reset
                        new Noty({
                            theme: 'light',
                            type: 'success',
                            text: `${data.notyText}`,
                            layout: 'topRight',
                            timeout: 1500
                        }).show();
                        $('.container-div').html(`
                        <div class="tick-mark">
                            <h1>✔</h1>
                            <p>Password Changed Successfully.</p>
                        </div>
                        <small><a href="/users/login">Login Now</a></small>
                        `);
                    }else{
                        // Noty error notification for password reset
                        new Noty({
                            theme: 'light',
                            type: 'error',
                            text: `${data.notyText}`,
                            layout: 'topRight',
                            timeout: 1500
                        }).show();
                        $('.container-div').html(`
                        <div class="tick-mark">
                            <h1>X</h1>
                            <p>Password and Confirm Password didn't match</p>
                            <small><a id="try-again" href="">Try Again</a></small>
                        </div>
                        `);
                    }

                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    resetPassword();
    //resetting the form 
    let resetForm = function(){
        let resetPasswordForm = $('#create-password-form');
    
        $('#try-again').click(function(event) {
            event.preventDefault();
            // Your code here...
        });
    }
}