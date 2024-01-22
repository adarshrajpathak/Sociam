{ 
  $(document).ready(function() {
    if ($('#upload-preview').length) {
      let loadFile=document.getElementById('upload-preview');
      loadFile.addEventListener('change',function(event) {
          let output = document.getElementById('output-preview');
          output.src = URL.createObjectURL(event.target.files[0]);
          output.onload = function() {
            URL.revokeObjectURL(output.src) // free memory after uploading the image as preview
          }
        })
      } else {
      //for like using the xhr request
      let toggleFriend=function(){
       $('#friend-button').click(function(e){
         e.preventDefault();
        //  console.log(e);
         let self=this;
         $.ajax({
                 method:'get',
                 url:$('#friend-toggle').prop('href'),   //property href and this is the specific element that was clicked
             })
             .done(function(data){
                 if(data.data.areFriends==true){
                   $('#friend-toggle').text('Remove Friend');
                   $('#friend-button').css('background-color', '#FF0000');
                 }else{
                   $('#friend-toggle').text('Send Friend Request');
                   $('#friend-button').css('background-color', '#4CAF50');
                 }
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
     toggleFriend();
     //for previewing the being-uploading image
    }
});
}