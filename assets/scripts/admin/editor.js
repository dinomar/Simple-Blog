/*
=================================
    Editor
=================================
*/

const postHandler = (publish) => {
    const title = $("#title").val();
    const body = $("#body").val();
    
    //check fields
    if(!title || !body) { 
        return null;
    }
    
    const options = {
        title: title,
        body: body,
        publish: publish
    };
    
    //post data
    $.post("/admin/editor", options)
     .done((data) => {
        
        if (!data) {
            console.log("ERROR");
            return null;
        }
        
        if (publish) {
            //Publish | redirect to /admin
            window.location.replace("/admin");
        } else {
            //Save | redirect to /editor
            window.location.replace("/admin/editor?id=" + data._id);
        }
    });
};

const updateHandler = (publish) => {
    const title = $("#title").val();
    const body = $("#body").val();
    
    //check fields
    if(!title || !body) { 
        return null;
    }
    
    const options = { 
        method: "PUT",
        url: "/admin/editor",
        date: {
            title: title,
            body: body,
            publish: publish
        } 
    };
    
    //update data
    $.ajax(options)
     .done((data) => {
        
        if (!data) {
            console.log("ERROR");
            return null;
        }
        
        if (publish) {
            //Publish | redirect to /admin
            window.location.replace("/admin");
        } else {
            //Save | redirect to /editor
            //window.location.replace("/admin/editor?id=" + data._id);
            //Show message Saved!
            console.log("Edit: saved!");
        }
        
    });
};

//Create
const publishClicked = () => {
    postHandler(true);
};

const saveClicked = () => {
    postHandler(false);
};

//Edit
const editPublishClicked = () => {
    updateHandler(true);
};

const editSaveClicked = () => {
    updateHandler(false);
};


/*
=================================
    Posts Panel
=================================
*/


/*
=================================
    Document Ready
=================================
*/
$(document).ready(function (){
    $("#btnPublish").on('click', publishClicked);
    $("#btnSave").on('click', saveClicked);
    
    $("#btnEditPublish").on('click', editPublishClicked);
    $("#btnEditSave").on('click', editSaveClicked);
    
    //delete btn clicked
});