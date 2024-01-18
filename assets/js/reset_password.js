{
    // Using jQuery to raise XMLHttpRequest (xhr) request for password reset
    let resetPassword = function(){
        let resetPasswordForm = $('#forget-password-form');

        resetPasswordForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/users/create-token',
                data: resetPasswordForm.serialize(),
                success: function(data){
                    // console.log(data);

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
                        <p>Email sent successfully. Please check your inbox.</p>
                    </div>
                `);
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    resetPassword();
}