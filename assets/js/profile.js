{
    //for previewing the being-uploading image
    let loadFile=document.getElementById('upload-preview');
    loadFile.addEventListener('change',function(event) {
        let output = document.getElementById('output-preview');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
          URL.revokeObjectURL(output.src) // free memory after uploading the image as preview
        }
    })
}