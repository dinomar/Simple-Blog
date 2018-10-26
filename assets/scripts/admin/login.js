const btnSubmitClicked = () => {
    $("#loginForm").submit();
};

$(document).ready(function(){
    
    $("#btnSubmit").on('click', btnSubmitClicked);
    
});