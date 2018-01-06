/* Author: 

*/
var pageWidth = 1000;
var slideInterval = 5000;
$(window).load(function(){
$("#contact label").inFieldLabels();
$(this).resize().scroll();
}).scroll(function(){
	if($(this).scrollTop()>550){
		$("#toTop").attr('class','visible');
	}else{
		$("#toTop").attr('class','');
	}
});


$(function(){
var w;
function setWindowDimensions(){
	w = {
			w:Math.max(parseInt($(this).width()),pageWidth),
			h:$(this).height()
	}
}
setWindowDimensions();

var toTop = $('<a id="toTop" href="#top"></a>').smoothScroll().appendTo('body');

$('nav a').smoothScroll();
$('.slides .cta').smoothScroll({
	offset: -100,
	afterScroll: function() { 
	
		var target = $(this).attr('href');
		$(target).classy({start:{add:'attention'},end:{remove:'attention'}});
	}
});


$("#logo").addClass('tt').html('<span class="logomark-base"></span><span class="logomark-top"></span><span class="identity-sep"></span><span class="signature"></span><span class="tagline"></span>');

$('nav li:first-child').addClass('first-child');

var slidePrev = $('<a id="slidePrev" class="slideArrow"></a>');
var slideNext = $('<a id="slideNext"class="slideArrow"></a>');
var slidePagination = $('<ul id="slidePagination"></ul>');
$(".slides li").each(function(i){
	var li = $('<li/>');
	var a = $('<a>&bull;</a>').click(function(){
		$(".slides").data('index',i).trigger("slideChange");
		resetSlideTimeout();
	});
	a.appendTo(li);
	li.appendTo(slidePagination);
	
});


$("#hero").prepend(slidePrev).append(slideNext).append(slidePagination);

$(".slideArrow").click(function(){
	
	var slideData = $(".slides").data();
	var numSlides = $(".slides li").size()-1;
	if($(this).is("#slideNext")){
		if(slideData.index<numSlides){
			slideData.index++;
		}else{
			slideData.index = 0;
		}
	}else{
		if(slideData.index>0){
			slideData.index--;
		}else{
			slideData.index = numSlides;
		}
	}
	$(".slides").trigger("slideChange");
	resetSlideTimeout();
});



var slideTimeout;
function resetSlideTimeout(){
	clearTimeout(slideTimeout);
	slideTimeout = setTimeout(function(){
		$("#slideNext").click();
	},slideInterval);
}
resetSlideTimeout();

var windowResizeTimeout;

$(window).resize(function(){
	
	setWindowDimensions();
	var baseMargin = ((w.w-pageWidth)/2);
	
	$(".slides li").each(function(i) {
		
		$(this).css({
			marginLeft:(w.w*i) + baseMargin
		});
	});
	
	slidePrev.css({
		left: baseMargin - 150
	});
	slideNext.css({
		right: baseMargin - 110
	});
	slidePagination.css({
		right: baseMargin
	});
	clearTimeout(windowResizeTimeout);
	windowResizeTimeout= setTimeout(function(){
		$(".slides").trigger('slideChange');
	},400);
	resetSlideTimeout();
}).resize();

$(".slides").bind('slideChange',function(){
	var i = $(this).data().index;
	var pos = -w.w * $(this).data().index;
	if(Modernizr.csstransforms){
		$(this).transition({
			x : pos
		});
	}else{
		$(this).css({
			left : pos
		});
	}
	slidePagination.children('li:eq('+i+')').addClass('current').siblings().removeClass('current');
}).data('index', 0);

$("#who-we-are .members .mainstream .icon").addClass('tt').html('');
$("#who-we-are .members .optimo .icon").addClass('tt').html('');
	
	$("#messageField").hide();
    $('#contact input[type=checkbox]').hide().each(function(){
		
		var checkbox = $(this);
		$('<span class="toggle"/>').click(function(){
		   if (checkbox.is(":checked")) {
			 checkbox.removeAttr("checked");
			 $("#messageField").slideUp();
		   }else{
			 checkbox.attr("checked","true");
			 $("#messageField").slideDown();
		   }
		   $(this).toggleClass("checked");
		}).insertAfter(checkbox);
		

		
	});
     
 	$('#contact').bind('success',function(e,comment){
		$(this).find('input, textarea').val('');
		$(this).find('.fields,#contactMessage, .button').slideUp();
		$(this).siblings('p').slideUp();
		$(this).children('#response').removeClass('empty').html(comment);
	}).bind('error',function(e,comment){
		//alert(comment);
		$(this).children('#response').removeClass('empty').html(comment);
	}).submit(function(e){
		e.preventDefault();
			var $this = $(this);
		if( $this.find('input[name=name]').val() && $this.find('input[name=email]').val() ){
			
			vars = $this.serialize();
			$.ajax({
				type:'POST',
				url:'contactengine.php',
				data:vars,
				dataType: "json",
				success: function (data) {
					$this.trigger(data.response,[data.comment]);
				},
				error:function(){
					$this.trigger('error',['An error occured. Please try again']);
				}
			});
		} else {
			$this.trigger('error',['Please make sure to fill in your name and provide a valid email address']);
		}
	});
	


var tooltip = $("#services-tooltip");
var tooltipTimeout;

	$(".services li").each(function(){
		if($(this).hasClass('optimo') || $(this).hasClass('mainstream')){
			$(this).hover(function(){
				clearTimeout(tooltipTimeout);
				
				
				var offset = $(this).offset();
				
				var vendors_on_tooltip = tooltip.data("vendors") || [];
				var vendors_on_node_string = $(this).attr('class') || "optimo carey";
				var vendors_on_node = vendors_on_node_string.split(" ") ;
				var array_differences = differences_between_arrays(vendors_on_node,vendors_on_tooltip);
				
				var add_classes = array_differences[0].join(" ");
				var remove_classes = array_differences[1].join(" ");
				
				
				
				$(this).addClass('hovered');
				tooltip	.css({'top':offset.top - tooltip.height() + 8,'left':offset.left}).data("vendors",vendors_on_node);
				if(Modernizr.csstransforms){
					tooltip.classy({start:{add:'enter '+ add_classes, remove:remove_classes},end:{add:'animate-position'},type:'transition'});				
				}else{
					tooltip.addClass('enter');
				}
				
			},function(){
				var $this = $(this);
				tooltipTimeout = setTimeout(function(){
					if(!$('html').hasClass('lteie9') && Modernizr.csstransforms){
						tooltip.classy({start:{remove:'enter',add:'leave'},end:{remove:'leave animate-position'},type:'transition'});
					}else{
						tooltip.removeClass('enter');
					}
				},300);
				$this.removeClass('hovered');
				//$(this).children('dl').classy({start:{remove:'enter',add:'leave'},end:{remove:'leave'},type:'transition'});
			});
		}
	});

});

function differences_between_arrays(first,second){

 add = [],  remove = [];
  
  $.each(first, function(i,v){
    if($.inArray(v, second)){
      add.push(v);
    }
  });

  $.each(second, function(i,v){
    if($.inArray(v, first)==-1){
      remove.push(v);
    }
  });
  
  return [add,remove];
}



















