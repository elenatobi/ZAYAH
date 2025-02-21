jQuery(document).ready(function($) {
	triggerCountdown();
});

function triggerCountdown() {
	var countdowns = jQuery('.countdownSeed');

	for(i = 0; i < countdowns.length; i++) {
		
		var time = jQuery(countdowns[i]).html() - 1;
		
		if(time < 0) {
			time = 0;
		}

		jQuery(countdowns[i]).html(time);

		var min = 60;
		var hour = min * 60;
		var day = hour * 24;

		var dayStr = "";
		var hourStr = "";
		var minStr = "";

		if(time >= day) {
			var days = Math.floor(time / day);

			if(days != 1) {
				dayStr = days + " days, ";
			} else {
				dayStr = days + " day, ";
			}

			time = time - (day * days);
		}

		var hours = Math.floor(time / hour);

		if(hours == 1) {
			hourStr = hours + " hour, ";
		} else if(hours != 0) {
			hourStr = hours + " hours, ";
		}

		time = time - (hour * hours);
	
		mins = Math.floor(time / min);

		if(mins == 1) {
			minStr = mins + " minute, ";
		} else if(mins != 0) {
			minStr = mins + " minutes, ";
		}

		time = time - (min * mins);
	
		secs = time;

		if(secs != 1) {
			secStr = secs + " seconds";
		} else {
			secStr = secs + " second";
		}

		//if(secs < 10) {
		//	secStr = "0" + secStr;
		//}

		var timeStr = dayStr + hourStr + minStr + secStr;

		jQuery(countdowns[i]).parent().find('.countdownString').html(timeStr);
		


		


	}

	setTimeout('triggerCountdown()', 1000);
}