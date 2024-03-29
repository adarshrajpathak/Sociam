{   
    //using to jQuery to raise XMLHttpRequest (xhr) request for ease post creation
    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/posts/create',
                data:newPostForm.serialize(),
                success:function(data){
                    // console.log(data);
                    let newPost=newPostDOM(data.data.post);
                    $("#post-list-section>ul").prepend(newPost);
                    deletePost();   //to include it in the event listener
                    window.toggleLike();
                    //noty success notificaton for post creation
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
            // newPostForm[0].reset();
            document.getElementById('new-post-form').reset(); //reset the post form
        }); 
    };
    createPost();

    //creating a function to insert into the DOM new post received via xhr
    let newPostDOM=function(post){
        return (`
        <div class="post-container">
            <ul type="none">
                <li id="post-${post._id}">
                <small>
                        <a class="post-delete-button" href="/posts/destroy/${post._id}">X</a>
                </small>
                ${post.content}
                <small>
                    <p>
                        ${post.user.name}
                    </p>
                </small>
                <div class="like-toggle">
                <a class="like-button" href="/likes/toggle/?id=${post._id}&type=Post"><i class="far fa-thumbs-up"></i></a>
                <small><span id="count-post-${post._id}-Likes">${post.likes.length}</span> Likes</small>
            </div>
                <hr>
                <div class="post-comments">
                    <form action="/comments/create" id="new-comment-input" method="POST">
                        <input type="text" name="content" placeholder="write a comment..." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Add Comment">
                    </form>
                </div>
                </li>
            </ul>
        </div>
    `)
    }

    //method to delete a post from the DOM
    let deletePost=function(){
        $('.post-delete-button').click(function(e){
            e.preventDefault();
            $.ajax({
                method:'get',
                url:$(this).prop('href'),   //property href and this is the specific element that was clicked
                success:function(data){
                    // console.log(data);
                    $(`#post-${data.data.post_id}`).remove();

                    //noty success notificaton for post Deletion
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
    deletePost();
}