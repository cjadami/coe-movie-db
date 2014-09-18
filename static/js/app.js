
    var config;
    var baseUrl = 'http://api.themoviedb.org/3/';
    var api_key = '52330cd572ac45cc5d00091b9b0c73e6';


    function initialize(callback){
        console.log('initializing..');
        
        // setting required parameters of get request for configuration
        var configUrl = baseUrl+'configuration';
        var configParams = {
            api_key : api_key
        }
        var configResponse = function(response){
            config = response;
            callback(config);    
        }

        // get request for configuration (JSON object)
        $.get(configUrl , configParams, configResponse);
    }
    function setEventHandlers(config){
        
        console.log('setting event handlers..');
        function clearActive(){
            $(".navbar-nav > .active").removeClass('active');
        }

        // fetching DOM of search form for handling event query when submitted.
        $('#form-search').submit(function(){
            searchMovie($('#search-query').val());    // passing query to searchMovie function.
            $(".movie-view").hide();
            $(".movie-list").show();
            return false;                             // return false after searchMovie, to search movies without loading the webpage.     
        });

        $('#now_showing').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            $(".movie-view").hide();
            $(".movie-list").show();
            loadNowShowing();
            return false;
        });

        $('#latest').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            $(".movie-view").hide();
            $(".movie-list").show();
            loadLatest();
            return false;
        });

        $('#upcoming').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            $(".movie-view").html('');
            $(".movie-list").show();
            loadUpcoming();
            return false;
        });

        $('#popular').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            loadPopular();
            return false;
        });

        $('#top_rated').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            $(".movie-view").hide();
            $(".movie-list").show();
            loadTopRated();
            return false;
        });
    }

    function searchMovie(query){
        
        console.log('searching..');

        // setting required parameters of get request for search
        var searchUrl = baseUrl+'search/movie';
        var searchParams = {
            api_key: api_key,
            query: query
        };
        var searchResponse = function(response){ 
            displayMovies(response, "Search &quot;"+query+"&quot; : "+response.total_results+" results found."); 
        }; // pass data response to displayMovie function to display Movies in the page.

        // get request for searching movies (JSON object)
        $.get(searchUrl, searchParams, searchResponse);
    }
    
    function displayMovies(data,category){
        $('.movie-list').html('');
        console.log('displaying movies..');
        console.log('\n\n\n')
        if(data.results.length > 0){
            var headerStr = [
                            '<div class="col-lg-12">',
                                '<h1 class="page-header">'+category+'</h1>',
                            '</div>'
                        ];
            $('.movie-list').append($(headerStr.join('')));
            data.results.forEach(function(movie){
                
                function getCasts(id){
                    var strcasts;
                    $.get(baseUrl+"movie/"+id+"/credits",{"api_key":api_key}, function(response){
                        for(var i = 0; i<3;i++){   
                            strcasts+=( (i==2) ? response.cast[i].name : response.cast[i].name+",");
                        }
                        return strcasts;     
                    });
                }
                var poster = config.images.base_url + config.images.poster_sizes[0] + movie.poster_path;
                var backdrop = config.images.base_url + config.images.poster_sizes[3] + movie.backdrop_path; 
                var id = movie.id;
                var title = movie.title;
                var casts = getCasts(id);
                
                var values = {
                    "poster":poster,
                    "backdrop":backdrop,
                    "casts":casts,
                    "id":id,
                    "title":title
                }

                var markup = Handlebars.compile($("#tpl-listmovies").html())(values);
                $('.movie-list').append(markup);
                //try{
                //    writeTemplate("tpl-listmovies",movie,"movie-list");
                //}
                //catch(err){

                //}
                
               // var htmlStr = [
               //                  '<div class="col-lg-3 col-md-4 col-xs-6 thumb">',
               //                      '<a class="thumbnail" href="/movie/'+movie.id+'">',
               //                          '<img class="img-responsive" height="200px" src="'+poster+'" alt="">',
               //                      '</a>',
               //                      '<center><h4 style="text-align:center; width:140px; word-wrap: break-word;">',
               //                          '<a href="/movie/'+movie.id+'">'+movie.title+'</a>',
               //                      '</h4></center>',
               //                  '</div>'
               //              ];
               // $('.movie-list').append($(htmlStr.join('')));
            });
    
        /*
            var pagination = [
            '<div class="row text-center">',
                '<div class="col-lg-12">',  
                    '<ul class="pagination">',
                        '<li>',
                            '<a href="#">«</a>',
                        '</li>',
                        '<li>',
                            '<a href="#">»</a>',
                        '</li>',
                    '</ul>',
                '</div>',
            '</div>'
                        ];
            for(var i=data.total_pages; i>0 ; i--){
                pagination.splice(5,0,
                    '<li>',
                        '<a href="#">'+i+'</a>',
                    '</li>');
            }

            $('.movie-list').append($(pagination.join('')));          
        */
        }
        else{
            var htmlStr = [
                    '<h3>',
                        'No Results Found.',
                    '</h3>'
            ];
            $('.movie-list').append($(htmlStr.join('')));
        }
    }

    function loadNowShowing(){
        $.get(
            baseUrl+'movie/now_playing',
            {
                api_key:api_key
            },
            function(response){
                displayMovies(response,"Now Showing");
            }
        );
    }

    function loadUpcoming(){
        $.get(
            baseUrl+'movie/upcoming',
            {
                api_key:api_key
            },
            function(response){
                displayMovies(response, "Upcoming");
            }
        );   
    }

    function loadPopular(){
        $.get(
            baseUrl+'movie/popular',
            {
                api_key:api_key
            },
            function(response){
                displayMovies(response, "Popular");
            }
        );
    }

    function loadTopRated(){
        $.get(
            baseUrl+'movie/top_rated',
            {
                api_key:api_key
            },
            function(response){
                displayMovies(response, "Top Rated");
            }
        );
    }


    initialize(setEventHandlers);




function movieView(id){
    
    $("movie-list").hide();


    url = baseUrl + "movie/"+id;
    reqParam = {api_key:api_key};
    $.get(url,reqParam,function(response){
        $("#title").html(response.original_title);
        $("#overview").html(response.overview);

        url = baseUrl + "movie/"+id+"/videos";
        $.get(url,reqParam,function(response){
            response.key = response.results[0].key;
            writeTemplate("tpl-trailer",response,"trailer");
        });

        url = baseUrl + "movie/"+id+"/credits";
        $.get(url,reqParam,function(response){
            var profile = "";
            for(var i=0;i<response.cast.length;i++){
                //casts+="<li>"+response.cast[i].name+"</li>"
                profile = config.images.base_url + config.images.poster_sizes[0] + response.cast[i].profile_path;
                response.cast[i].profile = profile;
            }
            writeTemplate("tpl-casts",response,"casts");

        });

        url = baseUrl + "movie/"+id+"/similar";
        $.get(url,reqParam,function(response){
            var poster = "";
            for(var i=0;i<response.results.length;i++){
                poster = config.images.base_url + config.images.poster_sizes[1] + response.results[i].poster_path;
                 response.results[i].poster = poster;

            }   
            writeTemplate("tpl-similar",response,"similar");
        });

    });

function writeTemplate(sourceID,values,outputID){
        var html = getTemplate(sourceID,values)

        $("#"+outputID).html(html);
    }
    function getTemplate(sourceID,values){
        var source   = $("#"+sourceID).html();
        var template = Handlebars.compile(source);  
        var html = template(values);
        return html;
    }
}