const renderNoPosts = () => {
    const template = `<article class="nopost">
                        <p>no posts</p>
                      </article>`;
    
    //append no post
    $("#posts").append(template);
};

const renderFullArticle = (post) => {
    // get first word in post title for highlighting
    let titleArr = post.title.split(' ');
    let titleFirst = titleArr[0];
    let titleRestof = titleArr.splice(1).join(' ');
    
    let date = new Date(post.created_on);
    let dateString = date.toDateString();
        
    let template = `<article>
                        <h2><span class="highlight">${titleFirst}</span> ${titleRestof}</h2>
                        <p class="article-body">${post.body}</p>
                        <p class="article-date">Posted on ${dateString}</p>
                    </article>`;
    
    // append post
    $("#posts").append(template);
}

const renderPosts = (posts) => {
    posts.forEach((post) => {
        // get first word in post title for highlighting
        let titleArr = post.title.split(' ');
        let titleFirst = titleArr[0];
        let titleRestof = titleArr.splice(1).join(' ');
        
        let date = new Date(post.created_on);
        let dateString = date.toDateString();
        
        let template = `<article>
                            <h2><span class="highlight">${titleFirst}</span> ${titleRestof}</h2>
                            <p class="article-body">${post.body}</p>
                            <a href="#" class="article-more" id="${post._id}">Read More</a>
                            <p class="article-date">Posted on ${dateString}</p>
                        </article>`;
        
        // append post
        $("#posts").append(template);
    });
};

// load initial blog posts
const loadPosts = (data) => {
    // clear posts
    $("#posts").html("");
    
    // Render posts
    if(posts.length == 0) {
        renderNoPosts(); // render no posts message
        return null;
    }
    renderPosts(data);
    
    // add Read more on click events
    $(".article-more").on('click', readmoreClicked);
};

//handle full article query
const loadFullArticle = (data) => {
    // clear posts
    $("#posts").html("");
    
    // Render posts
    if(data.length == 0) {
        renderNoPosts(); // render no posts message
        return null;
    }
    
    renderFullArticle(data[0]);
};

// handle search query
const handleSearch = (e) => {
    const search = $("#search").val();
    
    //load posts
    $.getJSON("/search", { search: search }).done(loadPosts);
    
    e.preventDefault();
};

// handle on read more click
const readmoreClicked = (e) => {
    const id = e.target.id;
    $.getJSON("/posts/full", { id: id }).done(loadFullArticle);
};


$(document).ready(function() {
    // load initial posts
    $.getJSON("/posts", loadPosts);
    
    // handle search box
    $("#searchForm").submit(handleSearch);
    
    // handle read more buttons
    // $(".article-more").on('click', handleReadMore);
});


