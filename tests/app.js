var expect = chai.expect;

describe('Prevent', function(){

  var asyncCheck = function( done, f ) {
    setTimeout(function() {
      try {
        f();
        done();
      } catch( e ) {
        done( e );
      }
    }, 1000);
  };

  beforeEach(function() {
    $('#mocha_sandbox').html('');
  });




  describe("#setup()", function() {
    it("should call setup functions", function() {
      var setup = function() { new Prevent.setup() };
      expect( setup ).to.not.throw(Error);
    });
  });





  describe("#toggleMobileNav()", function() {
    mobileNavTrigger      = '.js-mobile-nav-trigger';
    mobileNavContainer    = '.js-mobile-nav';
    mobileNavCloseTrigger = '.js-mobile-nav-close';

    beforeEach(function() {
      $('#mocha_sandbox').html('<button href="#" class="mobile-nav-btn js-mobile-nav-trigger">Menu</button><div class="js-mobile-nav mobile-nav-overlay"><button type="button" class="mobile-nav__close js-mobile-nav-close">Close</button></div>');
    });

    it("should toggle mobile nav", function() {
      var mobileNav = function() { new Prevent.mobileNav() };
      mobileNav();

      expect( $( mobileNavContainer ) ).to.not.have.class('open');

      $( mobileNavTrigger ).trigger( 'click' );

      expect( $( mobileNavContainer ) ).to.have.class('open');

    });

    it("mobile nav should be able to close", function() {
      var mobileNav = function() { new Prevent.mobileNav() };
      mobileNav();

      $( mobileNavTrigger ).trigger( 'click' );

      expect( $( mobileNavContainer ) ).to.have.class('open');

      $( mobileNavCloseTrigger ).trigger( 'click' );

      expect( $( mobileNavContainer ) ).to.not.have.class('open');

    });
  });





  describe("#closeDeploymentBanner()", function() {
    var deploymentBanner      = $('.deployment-intro'),
        deploymentBannerClose = $('.deployment-intro__close');

    beforeEach(function() {
      $('#mocha_sandbox').html('<section class="deployment-intro slideIn"><a href="#" class="deployment-intro__close">Close</a></section>');
    });

    it("deployment banner should be able to close", function() {
      var closeDeploymentBanner = function() { new Prevent.closeDeploymentBanner() };
      closeDeploymentBanner();

      expect( $('.deployment-intro') ).to.have.class('slideIn');

      $('.deployment-intro__close').trigger( 'click' );

      expect( $('.deployment-intro') ).to.have.class('slideOut');
    });
  });





  describe("#playVideosBasedOnHash()", function() {

    beforeEach(function() {
      $('#mocha_sandbox').html('<a id="prevent-video" class="js-fancybox-video" href="http://vimeo.com/85544572">Vimeo</a>');
    });

    it("should play videos when url hash matches a elements id", function() {
      var playVideosBasedOnHash = function() { new Prevent.playVideosBasedOnHash('#prevent-video') };
      playVideosBasedOnHash();

      expect( $('#prevent-video') ).to.exist;

      expect( $('.fancybox-wrap') ).to.exist;

    });
  });





  describe("#phaseCardClick()", function() {
    var firstPhaseCard = '.phase:first-of-type';
    var firstPhaseCardBack = '.phase:first-of-type .phase-back';
    var lastPhaseCard = '.phase:last-of-type';
    var lastPhaseCardBack = '.phase:last-of-type .phase-back';
    var phaseCardClick = function() { Prevent.phaseCardClick() };

    beforeEach(function() {
      $('#mocha_sandbox').html('<section style="margin-top: 400px;" class="phase phase--blue"> <h6 class="phase__subtitle mb0 uppercase">Phase 1</h6> <section class="phase__title-container"> <h3 class="phase__title">Changing <br>Food <br>Habits</h3> </section> <h6 class="phase__week">Week 1 - 4</h6> <section class="phase-back"> <section class="phase-back__title-container"> <h6 class="phase-back__subtitle mb0 uppercase">Phase 2</h6> <h2 class="phase-back__title">Increasing Activity Levels</h2> </section> <section class="phase-back__content-container"> <aside class="phase-back__callout"> <h5 class="phase-back__callout-title"> Some really cool fact about increasing activity levels. </h5> </aside> </section> </section> </section><section class="phase phase--yellow"> <h6 class="phase__subtitle mb0 uppercase">Phase 1</h6> <section class="phase__title-container"> <h3 class="phase__title">Changing <br>Food <br>Habits</h3> </section> <h6 class="phase__week">Week 1 - 4</h6> <section class="phase-back"> <section class="phase-back__title-container"> <h6 class="phase-back__subtitle mb0 uppercase">Phase 2</h6> <h2 class="phase-back__title">Increasing Activity Levels</h2> </section> <section class="phase-back__content-container"> <aside class="phase-back__callout"> <h5 class="phase-back__callout-title"> Some really cool fact about increasing activity levels. </h5> </aside> </section> </section> </section>');
    });

    it("should show .phase-back element", function() {
      phaseCardClick();
      expect( $( firstPhaseCardBack ) ).to.not.have.class('fadeIn')

      $( firstPhaseCard ).trigger( "click" );

      expect( $( firstPhaseCardBack ) ).to.have.class('fadeIn');
    });

    it("should hide other phase-back cards", function() {
      phaseCardClick();

      $( firstPhaseCard ).trigger( 'click' );

      expect( $( lastPhaseCardBack ) ).to.not.have.class('fadeIn');
    });
  });






  describe("#featuresImageToggle()", function() {
    var featuresImageToggle = function() { new Prevent.featuresImageToggle() };

    beforeEach(function() {
      $('#mocha_sandbox').html('<section id="features" class="features clearfix"> <section class="col5 features__img-container"> <img class="features__img show-by-default" src="img/feature-mobile.png" alt="Scale"> <img class="features__img" src="img/feature-recipes.png" alt="recipes"> <img class="features__img" src="img/feature-mobile.png" alt="Scale"> </section> <div class="col6"> <section class="features-content"> <h6 class="uppercase c-light-grey">Features</h6> <div class="features-content__container"> <section class="features-content__big-text"> <h1 class="font-light"> Our mobile apps are insanely <span class="font-bold"> engaging. </span> </h1> <p class="font-light">Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette. </p></section> <section class="features-content__big-text hidden"> <h1 class="font-light"> Feature number <span class="font-bold"> dos. </span> </h1> <p class="font-light">Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette. </p></section> <section class="features-content__big-text hidden"> <h1 class="font-light"> Feature number <span class="font-bold"> tres. </span> </h1> <p class="font-light">Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette. </p></section> </div><section class="features-nav row"> <a class="features-nav__item active col2 tablet-col2"> <img class="features-nav__image" src="img/atom-grey.png" alt=""> <h6 class="features-nav__title uppercase">Nori grape silver</h6> <p class="features-nav__description"> Turnip greens yarrow ricebean rutabaga endive cauliflower </p></a> <a class="features-nav__item col2 tablet-col2"> <img class="features-nav__image" src="img/atom-grey.png" alt=""> <h6 class="features-nav__title uppercase">Nori grape silver</h6> <p class="features-nav__description"> Turnip greens yarrow ricebean rutabaga endive cauliflower </p></a> <a class="features-nav__item col2 tablet-col2"> <img class="features-nav__image" src="img/atom-grey.png" alt=""> <h6 class="features-nav__title uppercase">Nori grape silver</h6> <p class="features-nav__description"> Turnip greens yarrow ricebean rutabaga endive cauliflower </p></a> </section> </section>');
    });

    it("should remove active class from other feature links", function() {
      featuresImageToggle();
      var targetItem = $('.features-nav__item:nth-child(2)');

      targetItem.trigger('click');

      expect( $( '.features-nav__item:first-child' ) ).to.not.have.class('active');

      expect( targetItem ).to.have.class('active');
    });

    it("should add active class to correct feature image", function() {
      featuresImageToggle();
      var targetImg = $( '.features__img:nth-child(2)' );

      $( '.features-nav__item:nth-child(2)' ).trigger('click');

      expect( $( '.features__img:first-child' ) ).to.not.have.class( 'active' );

      expect( targetImg ).to.have.class( 'active' );
    });

    it("should add hidden class to non-targetd feature text", function() {
      featuresImageToggle();
      var targetText = $( '.features-content__big-text:nth-child(2)' );

      $( '.features-nav__item:nth-child(2)' ).trigger('click');

      expect( $( '.features-content__big-text:first-child' ) ).to.have.class( 'hidden' );

      expect( targetText ).to.not.have.class( 'hidden' );
    });
  });




  describe("#headerTransition()", function() {
    var headerTransition = function() { new Prevent.headerTransition() };
    var header = '.js-header' ;
    var htmlBody = 'html, body' ;
    var navUp = 'nav-up' ;
    var navMain = '.js-nav-main' ;
    var navMini = '.js-nav-mini' ;

    beforeEach(function() {
      $( '#mocha_sandbox' ).html('<header class="js-header nav--main js-nav-main"> <div class="row"> <a href="{{site_url}}" class="logo left"></a> <nav class="site-nav"> <div class="text-right right site-nav__ctas"> <a class="login-btn btn--s" href="#">Log In</a> <a class="font-bold" href="#">Sign Up</a> </div><a class="site-nav__link active" href="#how-it-works">How it Works</a> <a class="site-nav__link" href="#features">Features</a> <a class="site-nav__link" href="#">Nav Link #3</a> </nav> <button href="#" class="mobile-nav-btn js-mobile-nav-trigger">Menu</button> </div></header>').css("height", "3000px");
    });

    it("should hide header when scrolling down", function( done ) {
      headerTransition();

      expect( $( navMain ) ).to.not.have.class( navUp );

      $( htmlBody ).animate({ scrollTop: 300 }, 100);

      asyncCheck( done, function() {
        expect( $( navMain ) ).to.have.class( navUp );
      });
    });

    it("should show '.nav--mini' when scrolling down", function( done ) {
      headerTransition();

      $( htmlBody ).animate({ scrollTop: 400 }, 100).delay(250).animate({ scrollTop: 200 }, 100);

      asyncCheck( done, function() {
        expect( $( navMini ) ).to.not.have.class( navUp );
      });
    });

    it("should show header when scrolling up", function( done ) {
      headerTransition();

      expect( $( header ) ).to.not.have.class( navUp );

      $( htmlBody ).animate({ scrollTop: 300 }, 100).animate({ scrollTop: 0 }, 100);

      asyncCheck( done, function() {
        expect( $( header ) ).to.not.have.class( navUp );
      });
    });

    it("should show '.nav--main' when scrolled to the top", function( done ) {
      headerTransition();

      expect( $( navMain ) ).to.not.have.class( navUp );

      $( htmlBody ).animate({ scrollTop: 300 }, 100).animate({ scrollTop: 0 }, 100);

      asyncCheck( done, function() {
        expect( $( navMain ) ).to.not.have.class( navUp );
      });
    });
  });






  describe("#createDeploymentClosedCookie()", function() {

    beforeEach(function() {
      $('#mocha_sandbox').html('<a id="prevent-video" class="js-fancybox-video" href="http://vimeo.com/85544572">Vimeo</a>');
    });

    it("should create deployment closed cookie", function() {
      var createDeploymentClosedCookie = function() { new Prevent.createDeploymentClosedCookie() };
      createDeploymentClosedCookie();

      expect( createDeploymentClosedCookie ).to.not.throw(Error);


    });
  });



  describe("#changeClosedDeploymentLinks()", function() {
    var changeClosedDeploymentLinks = function() { new Prevent.changeClosedDeploymentLinks() };

    beforeEach(function() {
      $('#mocha_sandbox').html('<a href="#" class="js-closed-deployment">Closed Deployment Link</a>');
    });

    it("change closed deployment links", function() {
      var $deploymentCookie = 'is_deployment_closed',
          $closedDeploymentLinks = $('.js-closed-deployment');

      changeClosedDeploymentLinks();

      expect( $deploymentCookie ).to.exist;

      // expect( $closedDeploymentLinks.attr('href') ).to.equal('#deployment-closed');
    });
  });


  describe("#showRiskScreener()", function() {

    beforeEach(function() {
      $('#mocha_sandbox').html('<div class="risk-screener-container"></div>');
    });

    it("show risk screener", function() {
      var riskScreenerContainer = '.risk-screener-container';
      new Prevent.showRiskScreener('.risk-screener-container', 'classy');

      expect( $(riskScreenerContainer) ).to.have.class('classy');
    });
  });


  describe("#hideRiskScreener()", function() {

    beforeEach(function() {
      $('#mocha_sandbox').html('<div class="risk-screener-container"></div>');
    });

    it("should hide risk screener", function() {
      var riskScreenerContainer = '.risk-screener-container';
      new Prevent.hideRiskScreener('.risk-screener-container', 'classy');

      expect( $(riskScreenerContainer) ).to.not.have.class('classy');
    });
  });


  describe("#riskScreenerInit()", function() {

    beforeEach(function() {
      $('#mocha_sandbox').html('<a id="prevent-video" class="js-fancybox-video" href="http://vimeo.com/85544572">Vimeo</a>');
    });

    it("should click to start risk screener", function() {
      var riskScreenerInit = function() { new Prevent.riskScreenerInit( '.js-fancybox-video', Prevent.hideRiskScreener) };

      expect( riskScreenerInit ).to.not.throw(Error);


    });
  });

})