{
    //for like using the xhr request
    let toggleLike=function(){
        $('.like-button').click(function(e){
            e.preventDefault();
            let self=this;
            $.ajax({
                method:'get',
                url:$(self).prop('href'),   //property href and this is the specific element that was clicked
            })
            .done(function(data){
                let likesCountElement=$(self).next('small').find('span');
                let likesCount = parseInt(likesCountElement.text());
                console.log(likesCount);
                if(data.data.deleted==true){
                    likesCount=likesCount-1;
                    $(self).removeClass('liked');
                }else{
                    likesCount=likesCount+1;
                    $(self).addClass('liked');
                }
                console.log(likesCount);
                //increasing/decreasing the likes
                $(self).next('small').find('span').html(`${likesCount}`);
                //noty success notificaton for comment creation
                new Noty({
                    theme: 'light',
                    type: 'success',
                    text: `${data.notyText}`,
                    layout: 'topRight',
                    timeout: 1500
                }).show();                
            }).fail(function() {
                // This function is called if the AJAX request fails
                console.log('AJAX request failed');
            }).always(function() {
                // This function is always called, regardless of whether the AJAX request succeeds or fails
                // console.log('AJAX request completed');
            });
        })
    };
    toggleLike();
    window.toggleLike=toggleLike;
}