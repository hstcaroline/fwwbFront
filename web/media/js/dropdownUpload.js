/**
 * Created by zouwenyun on 2016/7/7.
 */
/*Dropzone.autoDiscover = false;*/
 Dropzone.options.myDropzone = {
     autoProcessQueue: false,
     uploadMultiple: true,
     parallelUploads: 5,
     acceptedFiles: ".txt",
     init: function() {
         var submitButton = document.querySelector("#submit-all");
         myDropzone = this;
         submitButton.addEventListener("click", function(e) {
                 e.preventDefault();
                 e.stopPropagation();
                 myDropzone.options.autoProcessQueue = true;
                 myDropzone.processQueue(); // Tell Dropzone to process all queued files.
         });

         this.on("addedfile", function(file) {             
             // Create the remove button
             var removeButton = Dropzone.createElement('<button class="btn red mini" style="width: 100%"> <i class="icon-trash"></i></button>');
             // Capture the Dropzone instance as closure.
             var _this = this;
             // Listen to the click event
             removeButton.addEventListener("click", function(e) {
                 e.preventDefault();
                 e.stopPropagation();
                 _this.removeFile(file);
             });
             // Add the button to the file preview element.
             file.previewElement.appendChild(removeButton);
         });
         this.on("queuecomplete", function() {
             myDropzone.options.autoProcessQueue = false;
             this.removeAllFiles();
         });
         this.on("complete", function(file) {
             //this.removeFile(file);
         });
     }
 };