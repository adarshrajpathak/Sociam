{
    //using to jQuery to raise XMLHttpRequest (xhr) request for comment creation
    let createComment=function(){
        $('.new-comment-form').submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/comments/create',
                data:$(this).serialize(),
                success:function(data){
                    // console.log(data);
                    let newComment=newCommentDOM(data.data.comment);
                    let postCommentId="#post-"+`${data.data.comment.post}`+"-comments>div>ul";
                    $(postCommentId).prepend(newComment);
                    deleteComment();   //to include it in the event listener
                    window.toggleLike();

                    //noty notification for comment creation
                    new Noty({
                        theme: 'light',
                        type: 'success',
                        text: `${data.notyText}`,
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error:function(error){
                    console.log(error.responseText);
                }
            });
            this.reset(); //reset the comment form
        }); 
    };
    createComment();

    //creating a function to insert into the DOM new comment received via xhr
    let newCommentDOM=function(comment){
        return (`
        <li>
            <small>
                <a href="/comments/destroy/${comment._id}">x</a>
            </small>
            ${comment.content}
            <small>
                <p>
                    ${comment.user.name}
                </p>
            </small>
            </li>
                <div class="like-toggle">
                <a class="like-button" href="/likes/toggle/?id=${comment._id}&type=Comment"><i class="far fa-thumbs-up"></i></a>
                <small><span id="count-comment-${comment._id}-Likes">${comment.likes.length}</span> Likes</small>
            </div>
        `)
    }
    //method to delete a post from the DOM
    let deleteComment=function(){
        $('.comment-delete-button').click(function(e){
            e.preventDefault();
            $.ajax({
                method:'get',
                url:$(this).prop('href'),   //property href and this is the specific element that was clicked
                success:function(data){
                    // console.log(data);
                    $(`#comment-${data.data.comment_id}`).remove();

                    //noty success notificaton for comment creation
                    new Noty({
                        theme: 'light',
                        type: 'success',
                        text: `${data.notyText}`,
                        layout: 'topRight',
                        timeout: 1500
                    }).show();                
                },error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    };
    deleteComment();
}