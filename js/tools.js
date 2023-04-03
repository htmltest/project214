$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('focus', '.form-input input', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.form-input input', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        $('.window-link').removeClass('last-active');
        curLink.addClass('last-active');
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.tariffs').each(function() {
        var newHTML =   '<ul>';
        $('.tariffs-item').each(function() {
            var curItem = $(this);
            newHTML +=      '<li><a href="#">' + curItem.find('.tariffs-item-title').html() + '</a></li>';
        });
        newHTML +=      '</ul>'
        $('.tariffs-menu').html(newHTML);
        $('.tariffs-menu li').eq(0).addClass('active');
        $('.tariffs-item').eq(0).addClass('active');
    });

    $('body').on('click', '.tariffs-menu li a', function(e) {
        var curLI = $(this).parent();
        if (!curLI.hasClass('active')) {
            $('.tariffs-menu li.active').removeClass('active');
            curLI.addClass('active');
            var curIndex = $('.tariffs-menu li').index(curLI);
            $('.tariffs-item.active').removeClass('active');
            $('.tariffs-item').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('body').on('click', '.lightbox-link', function(e) {
        var curItem = $(this);
        var curGroup = ':not([data-gallery])';
        if (typeof(curItem.attr('data-gallery')) != 'undefined') {
            curGroup = '[data-gallery="' + curItem.attr('data-gallery') + '"]';
        }
        var curGallery = $('.lightbox-link' + curGroup);
        var curIndex = curGallery.index(curItem);

        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-photo-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);

        var windowHTML =    '<div class="window-photo">';

        windowHTML +=           '<div class="window-photo-preview">' +
                                    '<div class="window-photo-preview-inner">' +
                                        '<div class="window-photo-preview-list">';

        var galleryLength = curGallery.length;
        for (var i = 0; i < galleryLength; i++) {
            var curTitle = '';
            var curGalleryItem = curGallery.eq(i);
            windowHTML +=                   '<div class="window-photo-preview-list-item"><a href="#" style="background-image:url(' + curGalleryItem.find('img').attr('src') + ')"></a></div>';
        }
        windowHTML +=                   '</div>' +
                                    '</div>' +
                                '</div>';

        windowHTML +=           '<a href="#" class="window-photo-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-close"></use></svg></a>';
        windowHTML +=           '<a href="#" class="window-photo-download" target="_blank" download><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-download"></use></svg></a>';

        windowHTML +=           '<div class="window-photo-slider">' +
                                    '<div class="window-photo-slider-list">';

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.eq(i);
            windowHTML +=               '<div class="window-photo-slider-list-item">' +
                                            '<div class="window-photo-slider-list-item-header"></div>' +
                                            '<div class="window-photo-slider-list-item-inner"><img src="' + pathTemplate + 'images/loading.svg" data-src="' + curGalleryItem.attr('href') + '" alt="" /></div>' +
                                            '<div class="window-photo-slider-list-item-title">' + curGalleryItem.attr('title') + '</div>' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                '</div>';

        windowHTML +=       '</div>';

        $('body').append(windowHTML);

        var curMaxHeight = 0;
        $('.window-photo-slider-list-item').each(function() {
            var curWindowItem = $(this);
            var curHeight = $('.window-photo').height() - curWindowItem.find('.window-photo-slider-list-item-title').outerHeight() - curWindowItem.find('.window-photo-slider-list-item-header').outerHeight();
            if (curMaxHeight < curHeight) {
                curMaxHeight = curHeight;
            }
            curWindowItem.find('.window-photo-slider-list-item-inner').css({'height': curHeight + 'px', 'line-height': curHeight + 'px'});
        });

        if ($(window).width() > 1239) {
            $('.window-photo-preview-inner').mCustomScrollbar({
                axis: 'y',
                scrollButtons: {
                    enable: true
                }
            });
        } else {
            $('.window-photo-preview-inner').mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        }

        $('.window-photo-slider-list').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
            dots: false,
            speed: 250,
            initialSlide: curIndex,
            responsive: [
                {
                    breakpoint: 1239,
                    settings: {
                        arrows: false
                    }
                }
            ]
        }).on('setPosition', function(event, slick) {
            var currentSlide = $('.window-photo-slider-list').slick('slickCurrentSlide');
            $('.window-photo-preview-list-item.active').removeClass('active');
            $('.window-photo-preview-list-item').eq(currentSlide).addClass('active');

            $('.window-photo-preview-inner').mCustomScrollbar('scrollTo', $('.window-photo-preview-list-item').eq(currentSlide));
            $('.window-photo-download').attr('href', $('.window-photo-slider-list-item').eq(currentSlide).find('.window-photo-slider-list-item-inner img').attr('data-src'));
            var curIMG = $('.window-photo-slider-list-item').eq(currentSlide).find('img');
            if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                $('body').append(newIMG);
                newIMG.one('load', function(e) {
                    curIMG.attr('src', curIMG.attr('data-src'));
                    newIMG.remove();
                });
                newIMG.attr('src', curIMG.attr('data-src'));
                window.setTimeout(function() {
                    curIMG.attr('src', curIMG.attr('data-src'));
                    if (newIMG) {
                        newIMG.remove();
                    }
                }, 3000);
            }
        });
        $('.window-photo-slider-list .slick-prev, .window-photo-slider-list .slick-next').css({'top': curMaxHeight / 2 + $('.window-photo-slider-list-item-header').eq(0).height()});

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-preview-list-item a', function(e) {
        var curIndex = $('.window-photo-preview-list-item').index($(this).parent());
        $('.window-photo-slider-list').slick('slickGoTo', curIndex);
        e.preventDefault();
    });

    $('body').on('click', '.window-photo-close', function(e) {
        $('.window-photo').remove();
        $('html').removeClass('window-photo-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-photo').length > 0) {
                $('.window-photo-close').trigger('click');
            }
        }
    });

});

$(window).on('load resize', function() {
    $('.window-photo').each(function() {
        var curMaxHeight = 0;
        $('.window-photo-slider-list-item').each(function() {
            var curWindowItem = $(this);
            var curHeight = $('.window-photo').height() - curWindowItem.find('.window-photo-slider-list-item-title').outerHeight() - curWindowItem.find('.window-photo-slider-list-item-header').outerHeight();
            if (curMaxHeight < curHeight) {
                curMaxHeight = curHeight;
            }
            curWindowItem.find('.window-photo-slider-list-item-inner').css({'height': curHeight + 'px', 'line-height': curHeight + 'px'});
        });

        $('.window-photo-slider-list .slick-prev, .window-photo-slider-list .slick-next').css({'top': curMaxHeight / 2 + $('.window-photo-slider-list-item-header').eq(0).height()});
    });

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

	curForm.find('.form-input input').each(function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

    curForm.find('.form-input input:focus').each(function() {
        $(this).trigger('focus');
    });

    curForm.find('.form-input input').blur(function(e) {
        $(this).val($(this).val()).change();
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (curForm.hasClass('window-form')) {
                var formData = new FormData(form);
                windowOpen(curForm.attr('action'), formData);
            } else {
                form.submit();
            }
        }
    });
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window-project-photos').each(function() {
            var curGallery = $(this);
            var startIndex = 0;
            $('.window-link.last-active').each(function() {
                var curLink = $(this);
                if (curLink.parents().filter('.project-item').length == 1) {
                    startIndex = $('.project-item').index(curLink.parents().filter('.project-item'));
                }
            });
            var options = {
                infinite: true,
                initialSlide: startIndex,
                slidesToShow: 1,
                slidesToScroll: 1,
                prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-project-photos-prev"></use></svg></button>',
                nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-project-photos-next"></use></svg></button>',
                dots: true
            };
            curGallery.slick(
                options
            );
        });

        $('.window form').each(function() {
            initForm($(this));
        });

    });
}

function windowClose() {
    if ($('.window').length > 0) {

        var isEmptyForm = true;
        $('.window .form-input input').each(function() {
            if ($(this).val() != '') {
                isEmptyForm = false;
            }
        });
        if (isEmptyForm) {
            $('.window').remove();
            $('html').removeClass('window-open');
            $('body').css({'margin-right': 0});
            $('.wrapper').css({'top': 0});
            $(window).scrollTop($('.wrapper').data('curScroll'));
        } else {
            if (confirm('Закрыть форму?')) {
                $('.window .form-input input').val('');
                windowClose();
            }
        }
    }
}