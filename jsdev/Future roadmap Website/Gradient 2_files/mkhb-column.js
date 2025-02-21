/*
 * VERY TEMPORARY FIX
 *
 * Used to set inline container. We will drop this when we found a better solution.
 */
( function( $ ) {
	var inlineContainer = $( '.mkhb-col__container-inline' );

	if ( inlineContainer.length > 0 ) {
		inlineContainer.css( 'opacity', '0' );

		// 1. Inline - Center Alignment.
		$.each( inlineContainer, function( key, value ) {
			var thisContainer = $( this );
			var thisChildren = thisContainer.children();

			// Stop, if the children is empty.
			if ( thisChildren.length < 1 ) {
				return;
			}

			// Variables declaration for inline container.
			var inlineStatus = false;
			var inlineContent = '';
			var inlineTypes = [];
			inlineTypes['left'] = '';
			inlineTypes['center'] = '';
			inlineTypes['right'] = '';

			var countEls = thisChildren.length;

			$.each( thisChildren, function( key, value ) {
				elSel = $( this );

				// Reduce element numbers on each iteration.
				--countEls;

				var elMarkup = elSel[0].outerHTML;

				// Default element display for empty rendered markup is inline.
				var elDisplay = 'inline';
				var elAlign = 'left';

				// MANDATORY: Check rendered markup is not empty.
				if ( elMarkup ) {
					// MANDATORY: Check display is exist or not.
					elDisplay = elSel.data( 'display' ) || 'block';
				}

				// MANDATORY: If display is inline.
				if ( 'inline' == elDisplay ) {
					elAlign = elSel.data( 'align' ) || 'left';

					// Save element with inline to inlineTypes base on alignment.
					inlineTypes[ elAlign ] += elMarkup;

					// Clear recent markup.
					elMarkup = '';
					inlineStatus = true;
				}

				// MANDATORY: If inline container exist, place all the elements, and close container.
				if ( inlineStatus && ( 'block' == elDisplay || countEls <= 0 ) ) {
					// Inline container is exist, place all the elements, and close container.
					inlineContent += setInlineContainer( inlineTypes );

					// Close container and set inline_container is false (closed).
					inlineStatus = false;
					inlineTypes['left'] = '';
					inlineTypes['center'] = '';
					inlineTypes['right'] = '';
				}

				inlineContent += elMarkup;
			} );

			thisContainer.html( inlineContent );
		} );

		inlineContainer.css( 'opacity', '1' );
	}

	function setInlineContainer( inlineElements ) {
		// Default container.
		leftContainer = '<div class="mkhb-col__container-inline__left">' + inlineElements['left'] + '</div>';
		rightContainer = '<div class="mkhb-col__container-inline__right">' + inlineElements['right'] + '</div>';
		centerContainer = '<div class="mkhb-col__container-inline__center">' + inlineElements['center'] + '</div>';

		// Remove center if it's empty. Also check both of left and right side.
		if ( '' == inlineElements['center'] ) {
			centerContainer = '';

			if ( '' == inlineElements['left'] ) {
				leftContainer = '';
			}

			if ( '' == inlineElements['right'] ) {
				rightContainer = '';
			}
		}

		// Clear left and right when both of them are empty and center is not empty.
		if ( '' == inlineElements['left'] && '' == inlineElements['right'] ) {
			leftContainer = '';
			rightContainer = '';
		}

		columnContent = '<div class="mkhb-col__container-inline__wrap">' + leftContainer + centerContainer + rightContainer + '</div>';

		return columnContent;
	}
})( jQuery );