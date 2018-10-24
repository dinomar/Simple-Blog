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
    const id = $("#id").val();
    const title = $("#title").val();
    const body = $("#body").val();
    
    //check fields
    if(!title || !body) { 
        return null;
    }
    
    const options = { 
        method: "PUT",
        url: "/admin/editor",
        data: {
            id: id,
            title: title,
            body: body,
            publish: publish
        } 
    };
    
    //update data
    $.ajax(options)
     .done((data) => {
        
        console.log(data);
        
        if (!data) {
            console.log("ERROR");
            return null;
        }
        
        if (publish) {
            //Publish | redirect to /admin
            window.location.replace("/admin");
            console.log("Edit: published!");
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
const editSaveClicked = () => {
    //if published.clicked | true
    const publish = $("#status").val();
    if(publish == "publish") {
        updateHandler(true);
    } else {
        updateHandler(false);
    }
};


/*
=================================
    Posts Panel
=================================
*/
const deleteHandler = (id) => {
    //check fields
    if(!id) { 
        return null;
    }
    
    const options = { 
        method: "DELETE",
        url: "/admin/editor",
        data: {
            id: id
        } 
    };
    
    //Delete data
    $.ajax(options)
     .done((data) => {
        
        if (!data) {
            console.log("ERROR");
            return null;
        }
        
        //refresh
        window.location.replace("/admin");
    });
};

const deleteClicked = (e) => {
    //Show "Confirm Delete Message?"
    const id = e.target.id;
    deleteHandler(id);
};


/*
=================================
    Document Ready
=================================
*/
$(document).ready(function (){
    $("#btnPublish").on('click', publishClicked);
    $("#btnSave").on('click', saveClicked);
    
    $("#btnEditSave").on('click', editSaveClicked);
    
    //Btn Delete
    $(".btnDelete").on('click', deleteClicked);
});