{(function(){$(".new-comment-form").submit((function(n){n.preventDefault(),$.ajax({type:"post",url:"/comments/create",data:$(this).serialize(),success:function(n){let o=t(n.data.comment),s=`#post-${n.data.comment.post}-comments>div>ul`;$(s).prepend(o),e(),window.toggleLike(),new Noty({theme:"light",type:"success",text:`${n.notyText}`,layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}}),this.reset()}))})();let t=function(t){return`\n        <li>\n            <small>\n                <a href="/comments/destroy/${t._id}">x</a>\n            </small>\n            ${t.content}\n            <small>\n                <p>\n                    ${t.user.name}\n                </p>\n            </small>\n            </li>\n                <div class="like-toggle">\n                <a class="like-button" href="/likes/toggle/?id=${t._id}&type=Comment"><i class="far fa-thumbs-up"></i></a>\n                <small><span id="count-comment-${t._id}-Likes">${t.likes.length}</span> Likes</small>\n            </div>\n        `},e=function(){$(".comment-delete-button").click((function(t){t.preventDefault(),$.ajax({method:"get",url:$(this).prop("href"),success:function(t){$(`#comment-${t.data.comment_id}`).remove(),new Noty({theme:"light",type:"success",text:`${t.notyText}`,layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})}))};e()}