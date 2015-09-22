(function( global, factory ) {

	if ( typeof module === 'object' && typeof module.exports === 'object' ) {
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( 'requires a window with a document' );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
	// Pass this if window is not defined yet
}(typeof window !== 'undefined' ? window : this, function( window, noGlobal ) {

	if ( typeof noGlobal === 'undefined' ) {
		window.Storyboarder = Storyboarder;
	}

	return Storyboarder;

}));